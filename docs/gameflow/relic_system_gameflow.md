# 遗物系统工作流程 - Cat-Conquest Roguelike Breakout

## 概述
本文档提供可扩展遗物系统的完整实现工作流程，包括遗物效果设计、获取机制、UI集成和扩展框架。

## 前置要求
- 已完成核心游戏机制（Cocos Creator 3.8.6）
- RelicManager.ts 脚本已实现
- 理解 TypeScript 装饰器和反射机制
- 基础UI系统完成

## 第一阶段：遗物管理器集成

### 1.1 RelicManager 系统设置

**步骤 1：添加到游戏场景**
1. 打开 GameScene 场景
2. 创建空节点并命名为 "RelicManager"
3. 添加组件 → 自定义脚本 → RelicManager
4. 在检查器中配置基础参数：
```typescript
// 基础遗物设置
Max Relics: 8              // 最大携带遗物数量
Duplicate Chance: 0.1      // 重复遗物出现概率
Rare Relic Chance: 0.05    // 稀有遗物基础概率
Legendary Chance: 0.01     // 传说遗物基础概率
```

**步骤 2：遗物数据结构配置**
```typescript
// 在 RelicManager 检查器中配置遗物池
Common Relics: 30 种遗物    // 常见遗物列表
Rare Relics: 15 种遗物      // 稀有遗物列表
Legendary Relics: 5 种遗物   // 传说遗物列表
```

### 1.2 遗物效果系统架构

**步骤 1：创建遗物效果基类**
```typescript
// 创建 assets/scripts/relics/RelicEffect.ts
@ccclass('RelicEffect')
export abstract class RelicEffect extends Component {
    @property
    public relicId: string = "";
    
    @property
    public stackable: boolean = false;
    
    @property
    public maxStacks: number = 1;
    
    protected currentStacks: number = 1;
    
    // 抽象方法 - 子类必须实现
    public abstract applyEffect(): void;
    public abstract removeEffect(): void;
    public abstract getDescription(): string;
}
```

**步骤 2：遗物效果注册系统**
```typescript
// 创建效果注册管理器
@ccclass('RelicEffectRegistry')
export class RelicEffectRegistry extends Component {
    private static _effectMap: Map<RelicType, typeof RelicEffect> = new Map();
    
    public static registerEffect(relicType: RelicType, effectClass: typeof RelicEffect): void {
        this._effectMap.set(relicType, effectClass);
    }
    
    public static createEffect(relicType: RelicType, node: Node): RelicEffect | null {
        const EffectClass = this._effectMap.get(relicType);
        return EffectClass ? node.addComponent(EffectClass) : null;
    }
}
```

## 第二阶段：核心遗物效果实现

### 2.1 基础增强型遗物

**步骤 1：伤害增强遗物**
```typescript
// 创建 DamageBoostRelic.ts
@ccclass('DamageBoostRelic')
export class DamageBoostRelic extends RelicEffect {
    @property
    public damageMultiplier: number = 1.2;
    
    public applyEffect(): void {
        // 注册球的伤害计算事件
        EventManager.on('calculate_ball_damage', this.enhanceDamage, this);
    }
    
    private enhanceDamage(damage: number): number {
        return damage * (this.damageMultiplier ** this.currentStacks);
    }
    
    public removeEffect(): void {
        EventManager.off('calculate_ball_damage', this.enhanceDamage, this);
    }
    
    public getDescription(): string {
        return `弹球伤害增加${(this.damageMultiplier - 1) * 100}%`;
    }
}
```

**步骤 2：速度增强遗物**
```typescript
@ccclass('SpeedBoostRelic')
export class SpeedBoostRelic extends RelicEffect {
    @property
    public speedMultiplier: number = 1.15;
    
    public applyEffect(): void {
        EventManager.on('ball_spawn', this.enhanceSpeed, this);
        EventManager.on('ball_collision', this.maintainSpeed, this);
    }
    
    private enhanceSpeed(ball: Node): void {
        const ballController = ball.getComponent(EnhancedBall);
        ballController.baseSpeed *= this.speedMultiplier ** this.currentStacks;
    }
    
    public getDescription(): string {
        return `弹球速度增加${(this.speedMultiplier - 1) * 100}%`;
    }
}
```

### 2.2 特殊效果型遗物

**步骤 1：穿透效果遗物**
```typescript
@ccclass('PiercingRelic')
export class PiercingRelic extends RelicEffect {
    @property
    public pierceChance: number = 0.15;
    
    public applyEffect(): void {
        EventManager.on('ball_brick_collision', this.tryPierce, this);
    }
    
    private tryPierce(ball: Node, brick: Node): boolean {
        if (Math.random() < this.pierceChance * this.currentStacks) {
            // 允许球穿过砖块
            const ballPhysics = ball.getComponent(RigidBody2D);
            const brickPhysics = brick.getComponent(RigidBody2D);
            
            // 暂时禁用物理碰撞
            this.scheduleOnce(() => {
                ballPhysics.enabledContactListener = true;
            }, 0.1);
            
            return true; // 穿透成功
        }
        return false;
    }
    
    public getDescription(): string {
        return `${this.pierceChance * 100}%概率穿透砖块`;
    }
}
```

**步骤 2：分裂效果遗物**
```typescript
@ccclass('SplittingRelic')
export class SplittingRelic extends RelicEffect {
    @property
    public splitChance: number = 0.08;
    
    @property
    public maxSplitBalls: number = 2;
    
    public applyEffect(): void {
        EventManager.on('brick_destroyed', this.trySplit, this);
    }
    
    private trySplit(brick: Node, ball: Node): void {
        if (Math.random() < this.splitChance) {
            const gameManager = find('GameManager').getComponent(GameManager);
            
            for (let i = 0; i < Math.min(this.maxSplitBalls, this.currentStacks); i++) {
                gameManager.createSplitBall(ball, brick.getPosition());
            }
        }
    }
    
    public getDescription(): string {
        return `${this.splitChance * 100}%概率在破坏砖块时分裂弹球`;
    }
}
```

## 第三阶段：复杂协同遗物

### 3.1 元素组合遗物

**步骤 1：元素掌握遗物**
```typescript
@ccclass('ElementalMasteryRelic')
export class ElementalMasteryRelic extends RelicEffect {
    @property
    public elementalDamageBonus: number = 0.5;
    
    private elementalBallCount: Map<ElementType, number> = new Map();
    
    public applyEffect(): void {
        EventManager.on('ball_spawn', this.trackElementalBall, this);
        EventManager.on('calculate_elemental_damage', this.enhanceElementalDamage, this);
    }
    
    private trackElementalBall(ball: Node): void {
        const ballController = ball.getComponent(EnhancedBall);
        if (ballController.ballType !== BallType.NORMAL) {
            const element = this.getElementFromBallType(ballController.ballType);
            const currentCount = this.elementalBallCount.get(element) || 0;
            this.elementalBallCount.set(element, currentCount + 1);
        }
    }
    
    private enhanceElementalDamage(damage: number, element: ElementType): number {
        const elementCount = this.elementalBallCount.get(element) || 0;
        return damage * (1 + this.elementalDamageBonus * elementCount);
    }
}
```

**步骤 2：连锁反应遗物**
```typescript
@ccclass('ChainReactionRelic')
export class ChainReactionRelic extends RelicEffect {
    @property
    public chainRange: number = 150;
    
    @property
    public chainDamageReduction: number = 0.8;
    
    public applyEffect(): void {
        EventManager.on('explosive_brick_destroyed', this.triggerChain, this);
    }
    
    private triggerChain(explosionCenter: Vec3, damage: number): void {
        const nearbyBricks = this.findBricksInRange(explosionCenter, this.chainRange);
        
        nearbyBricks.forEach((brick, index) => {
            const chainDamage = damage * (this.chainDamageReduction ** index);
            
            this.scheduleOnce(() => {
                brick.getComponent(EnhancedBrick).takeDamage(chainDamage);
                this.createChainEffect(explosionCenter, brick.getPosition());
            }, index * 0.1);
        });
    }
}
```

### 3.2 系统改变型遗物

**步骤 1：重力操控遗物**
```typescript
@ccclass('GravityManipulatorRelic')
export class GravityManipulatorRelic extends RelicEffect {
    @property
    public gravityReversalChance: number = 0.05;
    
    @property
    public reversalDuration: number = 3.0;
    
    public applyEffect(): void {
        EventManager.on('ball_wall_collision', this.tryGravityReversal, this);
    }
    
    private tryGravityReversal(ball: Node): void {
        if (Math.random() < this.gravityReversalChance) {
            // 临时反转重力
            PhysicsSystem2D.instance.gravity = cc.v2(0, 320); // 向上重力
            
            this.scheduleOnce(() => {
                PhysicsSystem2D.instance.gravity = cc.v2(0, -320); // 恢复正常
            }, this.reversalDuration);
            
            this.createGravityReversalEffect();
        }
    }
    
    public getDescription(): string {
        return `撞墙时有${this.gravityReversalChance * 100}%概率短暂反转重力`;
    }
}
```

## 第四阶段：遗物获取系统

### 4.1 遗物掉落机制

**步骤 1：关卡完成奖励**
```typescript
// 在 GameManager 中集成遗物奖励
public onLevelComplete(): void {
    const relicManager = this.getComponent(RelicManager);
    
    // 计算遗物掉落概率
    const baseChance = 0.3;
    const difficultyBonus = this.currentDifficulty * 0.1;
    const finalChance = Math.min(baseChance + difficultyBonus, 0.8);
    
    if (Math.random() < finalChance) {
        this.showRelicRewardScreen();
    } else {
        this.showStandardReward();
    }
}

private showRelicRewardScreen(): void {
    // 生成3个随机遗物供选择
    const relicOptions = this.generateRelicOptions(3);
    
    // 显示选择界面
    const rewardUI = this.node.getChildByName('RelicRewardUI');
    const relicSelector = rewardUI.getComponent(RelicSelector);
    relicSelector.showRelicOptions(relicOptions);
}
```

**Step 2: Boss战特殊奖励**
```typescript
// Boss击败后的遗物奖励
public onBossDefeated(bossType: BossType): void {
    // Boss战必定掉落遗物，且有更高概率获得稀有遗物
    const guaranteedRelic = this.generateBossSpecificRelic(bossType);
    const bonusRelic = this.maybeGenerateBonusRelic(0.4); // 40%概率额外遗物
    
    const relics = [guaranteedRelic];
    if (bonusRelic) relics.push(bonusRelic);
    
    this.showBossRelicReward(relics);
}
```

### 4.2 遗物商店集成

**步骤 1：商店遗物选项**
```typescript
// 在 ShopManager 中添加遗物商品
private generateRelicShopItems(): ShopItem[] {
    const availableRelics = this.getAvailableRelicsForShop();
    
    return availableRelics.map(relic => ({
        id: `relic_${relic.type}`,
        name: relic.name,
        description: relic.getDescription(),
        category: ShopCategory.RELICS,
        currencyType: CurrencyType.GEMS,
        currencyAmount: this.calculateRelicPrice(relic),
        rarity: relic.rarity,
        inStock: 1,
        maxPurchases: 1 // 每个遗物只能购买一次
    }));
}
```

## 第五阶段：遗物UI系统

### 5.1 遗物展示界面

**步骤 1：遗物背包UI**
```typescript
// 创建遗物背包界面
@ccclass('RelicInventoryUI')
export class RelicInventoryUI extends Component {
    @property(Node)
    public relicContainer: Node = null;
    
    @property(Prefab)
    public relicSlotPrefab: Prefab = null;
    
    protected onLoad(): void {
        this.refreshRelicDisplay();
        EventManager.on('relic_acquired', this.onRelicAcquired, this);
        EventManager.on('relic_removed', this.onRelicRemoved, this);
    }
    
    private refreshRelicDisplay(): void {
        // 清空现有显示
        this.relicContainer.removeAllChildren();
        
        // 获取当前遗物
        const relicManager = find('RelicManager').getComponent(RelicManager);
        const currentRelics = relicManager.getActiveRelics();
        
        // 创建遗物槽位
        currentRelics.forEach((relic, index) => {
            const slotNode = instantiate(this.relicSlotPrefab);
            this.setupRelicSlot(slotNode, relic, index);
            this.relicContainer.addChild(slotNode);
        });
    }
}
```

**步骤 2：遗物选择界面**
```typescript
@ccclass('RelicSelector')
export class RelicSelector extends Component {
    @property(Node)
    public optionContainer: Node = null;
    
    @property(Prefab)
    public relicOptionPrefab: Prefab = null;
    
    public showRelicOptions(relics: RelicType[]): void {
        this.node.active = true;
        this.optionContainer.removeAllChildren();
        
        relics.forEach((relicType, index) => {
            const optionNode = instantiate(this.relicOptionPrefab);
            this.setupRelicOption(optionNode, relicType, index);
            this.optionContainer.addChild(optionNode);
        });
    }
    
    private setupRelicOption(node: Node, relicType: RelicType, index: number): void {
        // 设置遗物图标
        const icon = node.getChildByName('Icon').getComponent(Sprite);
        icon.spriteFrame = this.getRelicIcon(relicType);
        
        // 设置遗物信息
        const nameLabel = node.getChildByName('Name').getComponent(Label);
        const descLabel = node.getChildByName('Description').getComponent(Label);
        
        nameLabel.string = this.getRelicName(relicType);
        descLabel.string = this.getRelicDescription(relicType);
        
        // 设置选择按钮
        const button = node.getComponent(Button);
        button.node.on('click', () => this.selectRelic(relicType), this);
    }
}
```

### 5.2 遗物效果提示

**步骤 1：实时效果显示**
```typescript
// 创建遗物效果提示系统
@ccclass('RelicEffectNotifier')
export class RelicEffectNotifier extends Component {
    @property(Node)
    public notificationArea: Node = null;
    
    @property(Prefab)
    public effectNotificationPrefab: Prefab = null;
    
    protected onLoad(): void {
        // 监听各种遗物效果触发事件
        EventManager.on('relic_effect_triggered', this.showEffectNotification, this);
        EventManager.on('relic_synergy_activated', this.showSynergyNotification, this);
    }
    
    private showEffectNotification(relicType: RelicType, effectDescription: string): void {
        const notification = instantiate(this.effectNotificationPrefab);
        const label = notification.getComponentInChildren(Label);
        
        label.string = `${this.getRelicName(relicType)}: ${effectDescription}`;
        label.color = this.getRelicRarityColor(relicType);
        
        this.notificationArea.addChild(notification);
        
        // 动画效果：淡入 → 停留 → 淡出
        const fadeSequence = tween(notification)
            .to(0.3, { opacity: 255 })
            .delay(2.0)
            .to(0.5, { opacity: 0 })
            .call(() => notification.destroy());
        
        fadeSequence.start();
    }
}
```

## 第六阶段：遗物协同效应

### 6.1 协同效应系统

**步骤 1：协同检测机制**
```typescript
@ccclass('RelicSynergyDetector')
export class RelicSynergyDetector extends Component {
    private synergyRules: Map<string, SynergyRule> = new Map();
    
    protected onLoad(): void {
        this.initializeSynergyRules();
        EventManager.on('relic_acquired', this.checkSynergies, this);
    }
    
    private initializeSynergyRules(): void {
        // 元素协同：拥有3种不同元素遗物时激活
        this.synergyRules.set('elemental_trinity', {
            requiredRelics: [RelicType.FIRE_MASTERY, RelicType.ICE_MASTERY, RelicType.ELECTRIC_MASTERY],
            requireAll: false,
            minCount: 3,
            effect: this.activateElementalTrinity.bind(this)
        });
        
        // 破坏协同：拥有爆炸和穿透遗物时激活
        this.synergyRules.set('destruction_combo', {
            requiredRelics: [RelicType.EXPLOSIVE_BALLS, RelicType.PIERCING_SHOTS],
            requireAll: true,
            effect: this.activateDestructionCombo.bind(this)
        });
    }
    
    private checkSynergies(newRelic: RelicType): void {
        const relicManager = this.getComponent(RelicManager);
        const activeRelics = relicManager.getActiveRelics();
        
        this.synergyRules.forEach((rule, synergyId) => {
            if (this.checkSynergyCondition(rule, activeRelics)) {
                if (!relicManager.hasActiveSynergy(synergyId)) {
                    this.activateSynergy(synergyId, rule);
                }
            }
        });
    }
}
```

**步骤 2：特殊协同效果实现**
```typescript
// 元素三位一体协同效果
private activateElementalTrinity(): void {
    // 所有弹球获得随机元素效果
    EventManager.on('ball_spawn', (ball: Node) => {
        const ballController = ball.getComponent(EnhancedBall);
        const elements = [BallType.FIRE, BallType.ICE, BallType.ELECTRIC];
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        ballController.addElementalEffect(randomElement);
        this.createElementalAura(ball, randomElement);
    });
    
    this.showSynergyActivation('元素三位一体', '所有弹球获得随机元素效果！');
}

// 破坏组合协同效果
private activateDestructionCombo(): void {
    // 穿透弹球在穿透时触发小范围爆炸
    EventManager.on('ball_pierce_success', (ball: Node, brick: Node) => {
        const explosionRadius = 80;
        const explosionDamage = 30;
        
        this.createExplosion(brick.getPosition(), explosionRadius, explosionDamage);
        this.showEffectText(brick.getPosition(), '穿透爆炸！');
    });
    
    this.showSynergyActivation('破坏组合', '穿透攻击触发爆炸效果！');
}
```

## 第七阶段：遗物扩展框架

### 7.1 模块化遗物系统

**步骤 1：遗物模板创建工具**
```typescript
// 创建遗物快速生成工具
@ccclass('RelicTemplate')
export class RelicTemplate {
    public static createSimpleStatBoostRelic(
        id: string,
        name: string, 
        description: string,
        statType: StatType,
        multiplier: number,
        rarity: RelicRarity = RelicRarity.COMMON
    ): RelicData {
        return {
            id,
            name,
            description,
            rarity,
            effectType: 'stat_boost',
            parameters: {
                statType,
                multiplier
            },
            applyEffect: function(gameManager: GameManager) {
                gameManager.modifyStat(statType, multiplier);
            }
        };
    }
    
    public static createEventTriggerRelic(
        id: string,
        name: string,
        description: string,
        triggerEvent: string,
        effectCallback: (data: any) => void,
        rarity: RelicRarity = RelicRarity.COMMON
    ): RelicData {
        return {
            id,
            name, 
            description,
            rarity,
            effectType: 'event_trigger',
            parameters: {
                triggerEvent
            },
            applyEffect: function(gameManager: GameManager) {
                EventManager.on(triggerEvent, effectCallback);
            }
        };
    }
}
```

**步骤 2：动态遗物加载系统**
```typescript
// 支持运行时加载新遗物
@ccclass('RelicLoader')
export class RelicLoader extends Component {
    public async loadRelicFromConfig(configPath: string): Promise<RelicData> {
        try {
            const config = await this.loadRelicConfig(configPath);
            const relicData = this.parseRelicConfig(config);
            
            // 动态创建遗物效果类
            const effectClass = this.createRelicEffectClass(relicData);
            RelicEffectRegistry.registerEffect(relicData.type, effectClass);
            
            return relicData;
        } catch (error) {
            console.error('Failed to load relic:', error);
            return null;
        }
    }
    
    private createRelicEffectClass(relicData: RelicData): typeof RelicEffect {
        // 使用反射和动态类生成创建遗物效果
        const className = `${relicData.id}Effect`;
        
        return class extends RelicEffect {
            public applyEffect(): void {
                relicData.applyEffect(this.getGameManager());
            }
            
            public removeEffect(): void {
                if (relicData.removeEffect) {
                    relicData.removeEffect(this.getGameManager());
                }
            }
            
            public getDescription(): string {
                return relicData.description;
            }
        };
    }
}
```

### 7.2 遗物平衡系统

**步骤 1：动态平衡调整**
```typescript
@ccclass('RelicBalancer')
export class RelicBalancer extends Component {
    private performanceMetrics: Map<RelicType, RelicPerformance> = new Map();
    
    public trackRelicPerformance(relicType: RelicType, gameResult: GameResult): void {
        if (!this.performanceMetrics.has(relicType)) {
            this.performanceMetrics.set(relicType, new RelicPerformance());
        }
        
        const performance = this.performanceMetrics.get(relicType);
        performance.recordGame(gameResult);
        
        // 检查是否需要平衡调整
        if (performance.needsBalancing()) {
            this.adjustRelicPower(relicType, performance);
        }
    }
    
    private adjustRelicPower(relicType: RelicType, performance: RelicPerformance): void {
        const adjustment = performance.calculateAdjustment();
        
        // 应用平衡调整
        const relicEffect = RelicEffectRegistry.getEffect(relicType);
        relicEffect.applyBalanceAdjustment(adjustment);
        
        console.log(`Adjusted ${relicType} power by ${adjustment}%`);
    }
}
```

## 第八阶段：测试和验证

### 8.1 遗物效果测试

**步骤 1：单元测试框架**
```typescript
// 创建遗物测试套件
@ccclass('RelicTestSuite')
export class RelicTestSuite extends Component {
    public runAllTests(): void {
        console.log('Running relic tests...');
        
        this.testBasicStatBoosts();
        this.testStackingEffects();
        this.testSynergyActivation();
        this.testConditionalEffects();
        
        console.log('Relic tests completed.');
    }
    
    private testBasicStatBoosts(): void {
        // 测试基础属性增强遗物
        const testRelic = new DamageBoostRelic();
        const initialDamage = 10;
        
        testRelic.applyEffect();
        const enhancedDamage = testRelic.enhanceDamage(initialDamage);
        
        console.assert(
            enhancedDamage === initialDamage * testRelic.damageMultiplier,
            'Damage boost relic failed'
        );
    }
    
    private testStackingEffects(): void {
        // 测试可叠加遗物效果
        const testRelic = new StackableTestRelic();
        testRelic.currentStacks = 3;
        
        const result = testRelic.calculateStackedEffect(100);
        const expected = 100 * Math.pow(testRelic.multiplier, 3);
        
        console.assert(result === expected, 'Stacking effects failed');
    }
}
```

### 8.2 集成测试

**步骤 1：完整游戏流程测试**
```typescript
// 测试遗物在完整游戏中的表现
@ccclass('RelicIntegrationTest')
export class RelicIntegrationTest extends Component {
    public async testRelicGameFlow(): Promise<void> {
        // 模拟一个完整的游戏流程
        const gameManager = this.getComponent(GameManager);
        const relicManager = this.getComponent(RelicManager);
        
        // 添加测试遗物
        relicManager.addRelic(RelicType.DAMAGE_BOOST);
        relicManager.addRelic(RelicType.PIERCING_SHOTS);
        
        // 开始游戏并检查效果
        await gameManager.startLevel(1);
        
        // 验证遗物效果正常工作
        const balls = gameManager.getActiveBalls();
        balls.forEach(ball => {
            const ballController = ball.getComponent(EnhancedBall);
            console.assert(
                ballController.damage > ballController.baseDamage,
                'Damage boost not applied'
            );
        });
    }
}
```

## 性能优化建议

### 内存管理
- 使用对象池管理遗物效果实例
- 缓存遗物图标和描述文本
- 及时清理过期的事件监听器

### 事件系统优化
- 批量处理遗物效果触发
- 使用事件优先级避免冲突
- 实现事件去重避免重复触发

### UI优化
- 异步加载遗物图标资源
- 使用虚拟滚动处理大量遗物显示
- 缓存遗物UI元素避免重复创建

这个遗物系统工作流程提供了完整的可扩展框架，支持动态添加新遗物、复杂的协同效应和平衡调整系统。