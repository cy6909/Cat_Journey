# 地图进度系统工作流程 - Cat-Conquest Roguelike Breakout

## 概述
本文档提供类似《杀戮尖塔》风格的地图进度系统的完整实现工作流程，包括分支路径、节点类型、章节进度和战略选择机制。

## 前置要求
- 已完成核心游戏机制（Cocos Creator 3.8.6）
- MapManager.ts 脚本已实现
- 理解路径查找和图论算法
- 完成UI系统基础架构

## 第一阶段：地图管理系统设置

### 1.1 MapManager 架构配置

**步骤 1：地图场景创建**
1. 创建新场景 "MapScene"
2. 设置画布分辨率 960x640，适配模式 Fit Height
3. 创建场景结构：
```
MapScene
├── Canvas
│   ├── BackgroundLayer
│   │   ├── ChapterBackground (当前章节背景)
│   │   └── ParallaxLayers (视差背景层)
│   ├── MapLayer
│   │   ├── NodesContainer (地图节点容器)
│   │   ├── PathsContainer (路径连线容器)
│   │   └── EffectsContainer (特效容器)
│   ├── UILayer
│   │   ├── TopBar (顶部状态栏)
│   │   ├── SidePanel (侧边信息面板)
│   │   └── BottomBar (底部操作栏)
│   └── MapManager (空节点，挂载脚本)
```

**步骤 2：MapManager 脚本配置**
```typescript
// 在检查器中配置地图参数
Map Configuration:
总章节数: 3
每章节楼层数: 15
每楼层节点数: 3-4
节点间距: 150px
路径宽度: 8px
章节间隔: 200px

// 节点类型配置
Node Types: [COMBAT, BOSS, ELITE, SHOP, REST, EVENT, MYSTERY, TREASURE, SHRINE, LABORATORY, PORTAL, HIDDEN]
章节主题: ["森林王国", "雪山要塞", "深渊迷宫"]
```

### 1.2 地图数据结构初始化

**步骤 1：节点数据结构**
```typescript
// 地图节点数据定义
interface MapNodeData {
    id: string;
    type: NodeType;
    position: Vec2;
    chapter: number;
    floor: number;
    connections: string[];
    isCompleted: boolean;
    isAccessible: boolean;
    rewards: RewardData[];
    requirements: RequirementData[];
    specialProperties: { [key: string]: any };
}

// 在MapManager中初始化节点网络
private initializeMapStructure(): void {
    this.mapData = {
        chapters: 3,
        floorsPerChapter: 15,
        nodes: new Map<string, MapNodeData>(),
        paths: new Map<string, PathData>(),
        currentPosition: null,
        completedNodes: new Set<string>()
    };
    
    this.generateCompleteMap();
}
```

**步骤 2：地图生成算法**
```typescript
private generateCompleteMap(): void {
    for (let chapter = 1; chapter <= 3; chapter++) {
        this.generateChapter(chapter);
        
        // 生成章节间的连接
        if (chapter < 3) {
            this.connectChapters(chapter, chapter + 1);
        }
    }
    
    // 应用特殊连接规则
    this.applySpecialConnections();
    this.validateMapConnectivity();
}

private generateChapter(chapterNum: number): void {
    const startFloor = (chapterNum - 1) * 15 + 1;
    const endFloor = chapterNum * 15;
    
    for (let floor = startFloor; floor <= endFloor; floor++) {
        const nodeCount = this.calculateNodesPerFloor(floor, chapterNum);
        const nodes = this.generateFloorNodes(floor, chapterNum, nodeCount);
        
        // 连接到上一层节点
        if (floor > startFloor) {
            this.connectToUpperFloor(nodes, floor - 1);
        }
    }
    
    // 确保每章最后一层是Boss节点
    this.ensureBossNode(endFloor, chapterNum);
}
```

## 第二阶段：节点类型和机制实现

### 2.1 基础节点类型实现

**步骤 1：战斗节点 (COMBAT)**
```typescript
@ccclass('CombatNode')
export class CombatNode extends MapNode {
    @property
    public difficultyModifier: number = 1.0;
    
    @property
    public enemyTypes: string[] = [];
    
    public onNodeEnter(): void {
        // 计算基于楼层和章节的难度
        const baseDifficulty = this.calculateBaseDifficulty();
        const finalDifficulty = baseDifficulty * this.difficultyModifier;
        
        // 生成战斗参数
        const combatParams = {
            levelType: LevelType.NORMAL,
            difficulty: finalDifficulty,
            specialBrickRatio: 0.2 + (this.floor * 0.01),
            rewardMultiplier: 1.0
        };
        
        // 启动战斗场景
        this.startCombat(combatParams);
    }
    
    public onNodeComplete(success: boolean): void {
        if (success) {
            this.grantCombatRewards();
            this.unlockConnectedNodes();
        }
        
        super.onNodeComplete(success);
    }
}
```

**步骤 2：商店节点 (SHOP)**
```typescript
@ccclass('ShopNode')
export class ShopNode extends MapNode {
    @property
    public shopCategory: ShopCategory = ShopCategory.GENERAL;
    
    @property
    public discountPercentage: number = 0;
    
    public onNodeEnter(): void {
        // 生成本次商店的商品列表
        const shopItems = this.generateShopInventory();
        
        // 应用节点特定折扣
        if (this.discountPercentage > 0) {
            shopItems.forEach(item => {
                item.price *= (1 - this.discountPercentage);
            });
        }
        
        // 打开商店界面
        this.openShopInterface(shopItems);
    }
    
    private generateShopInventory(): ShopItem[] {
        const baseItems = this.shopManager.getBaseItems(this.shopCategory);
        const chapterItems = this.getChapterSpecificItems(this.chapter);
        
        // 基于玩家进度调整商品
        const playerProgress = this.getPlayerProgress();
        const adjustedItems = this.adjustItemsForProgress(baseItems, playerProgress);
        
        return [...adjustedItems, ...chapterItems];
    }
}
```

**步骤 3：休息节点 (REST)**
```typescript
@ccclass('RestNode')
export class RestNode extends MapNode {
    @property
    public healingAmount: number = 30;
    
    @property
    public bonusOptions: RestOption[] = [];
    
    public onNodeEnter(): void {
        // 显示休息选项界面
        const availableOptions = this.getAvailableRestOptions();
        this.showRestInterface(availableOptions);
    }
    
    private getAvailableRestOptions(): RestOption[] {
        const options: RestOption[] = [];
        
        // 基础治疗选项
        options.push({
            id: 'heal',
            name: '休息治疗',
            description: `恢复${this.healingAmount}点生命值`,
            effect: () => this.healPlayer(this.healingAmount)
        });
        
        // 升级遗物选项（如果有可升级遗物）
        const upgradableRelics = this.getUpgradableRelics();
        if (upgradableRelics.length > 0) {
            options.push({
                id: 'upgrade_relic',
                name: '强化遗物',
                description: '升级一个现有遗物',
                effect: () => this.showRelicUpgradeDialog(upgradableRelics)
            });
        }
        
        // 章节特定选项
        const chapterOptions = this.getChapterSpecificOptions();
        options.push(...chapterOptions);
        
        return options;
    }
}
```

### 2.2 特殊节点机制

**步骤 1：神社节点 (SHRINE)**
```typescript
@ccclass('ShrineNode')
export class ShrineNode extends MapNode {
    @property
    public shrineType: ShrineType = ShrineType.SACRIFICE;
    
    public onNodeEnter(): void {
        switch (this.shrineType) {
            case ShrineType.SACRIFICE:
                this.showSacrificeOptions();
                break;
            case ShrineType.ENHANCEMENT:
                this.showEnhancementOptions();
                break;
            case ShrineType.GAMBLE:
                this.showGambleOptions();
                break;
        }
    }
    
    private showSacrificeOptions(): void {
        // 牺牲生命值换取强力遗物
        const options = [
            {
                cost: 15,
                reward: '获得稀有遗物',
                effect: () => this.grantRareRelic()
            },
            {
                cost: 25,
                reward: '获得传说遗物',
                effect: () => this.grantLegendaryRelic()
            }
        ];
        
        this.showSacrificeDialog(options);
    }
    
    private showGambleOptions(): void {
        // 赌博机制：付出金币，有概率获得奖励
        const gambleOptions = [
            {
                cost: 100,
                winChance: 0.6,
                reward: 'gems',
                amount: 50
            },
            {
                cost: 200,
                winChance: 0.4,
                reward: 'rare_relic',
                amount: 1
            }
        ];
        
        this.showGambleDialog(gambleOptions);
    }
}
```

**步骤 2：实验室节点 (LABORATORY)**
```typescript
@ccclass('LaboratoryNode')
export class LaboratoryNode extends MapNode {
    @property
    public experimentTypes: ExperimentType[] = [];
    
    public onNodeEnter(): void {
        const availableExperiments = this.getAvailableExperiments();
        this.showLaboratoryInterface(availableExperiments);
    }
    
    private getAvailableExperiments(): Experiment[] {
        const experiments: Experiment[] = [];
        
        // 遗物组合实验
        const combinableRelics = this.getCombinableRelics();
        if (combinableRelics.length >= 2) {
            experiments.push({
                id: 'relic_fusion',
                name: '遗物融合',
                description: '将两个遗物融合成一个更强力的遗物',
                requirements: { relics: 2 },
                effect: () => this.performRelicFusion()
            });
        }
        
        // 球类型研究
        experiments.push({
            id: 'ball_research',
            name: '弹球研究',
            description: '研究新的弹球效果',
            cost: { gems: 75 },
            effect: () => this.unlockNewBallType()
        });
        
        // 砖块分析
        if (this.hasDestroyedBricks()) {
            experiments.push({
                id: 'brick_analysis',
                name: '砖块分析',
                description: '分析摧毁的砖块，获得针对性提升',
                effect: () => this.performBrickAnalysis()
            });
        }
        
        return experiments;
    }
}
```

### 2.3 隐藏和传送门节点

**步骤 1：传送门节点 (PORTAL)**
```typescript
@ccclass('PortalNode')
export class PortalNode extends MapNode {
    @property
    public destinationChapter: number = 0;
    
    @property
    public destinationFloor: number = 0;
    
    @property
    public portalCost: number = 50;
    
    public onNodeEnter(): void {
        if (this.destinationChapter === 0) {
            // 随机传送门
            this.showRandomPortalOptions();
        } else {
            // 指定目标传送门
            this.showTargetedPortalOption();
        }
    }
    
    private showRandomPortalOptions(): void {
        // 生成3个随机目标
        const destinations = this.generateRandomDestinations(3);
        
        const portalOptions = destinations.map(dest => ({
            chapter: dest.chapter,
            floor: dest.floor,
            preview: this.getDestinationPreview(dest),
            cost: this.calculatePortalCost(dest)
        }));
        
        this.showPortalSelectionDialog(portalOptions);
    }
    
    private calculatePortalCost(destination: MapNodeData): number {
        const floorDifference = Math.abs(destination.floor - this.floor);
        const chapterDifference = Math.abs(destination.chapter - this.chapter);
        
        return this.portalCost + (floorDifference * 5) + (chapterDifference * 25);
    }
}
```

**步骤 2：隐藏节点发现机制**
```typescript
@ccclass('HiddenNodeDetector')
export class HiddenNodeDetector extends Component {
    private hiddenNodes: Map<string, HiddenNodeData> = new Map();
    
    protected onLoad(): void {
        this.initializeHiddenNodes();
        EventManager.on('node_completed', this.checkHiddenNodeUnlock, this);
    }
    
    private checkHiddenNodeUnlock(completedNodeId: string): void {
        this.hiddenNodes.forEach((hiddenData, hiddenId) => {
            if (!hiddenData.isDiscovered && this.checkDiscoveryCondition(hiddenData)) {
                this.discoverHiddenNode(hiddenId, hiddenData);
            }
        });
    }
    
    private checkDiscoveryCondition(hiddenData: HiddenNodeData): boolean {
        switch (hiddenData.discoveryType) {
            case 'sequence_completion':
                return this.checkSequenceCompletion(hiddenData.requiredSequence);
            case 'rare_event':
                return this.checkRareEventTrigger(hiddenData.eventId);
            case 'item_collection':
                return this.checkItemCollection(hiddenData.requiredItems);
            default:
                return false;
        }
    }
    
    private discoverHiddenNode(nodeId: string, hiddenData: HiddenNodeData): void {
        // 创建新的地图节点
        const newNode = this.createHiddenNode(nodeId, hiddenData);
        
        // 添加到地图
        this.mapManager.addNode(newNode);
        
        // 创建动画效果
        this.playDiscoveryAnimation(newNode);
        
        // 显示发现通知
        this.showDiscoveryNotification(hiddenData.name);
    }
}
```

## 第三阶段：路径生成和连接系统

### 3.1 智能路径生成

**步骤 1：路径算法实现**
```typescript
private generateFloorConnections(currentFloor: number, nextFloor: number): void {
    const currentNodes = this.getNodesOnFloor(currentFloor);
    const nextNodes = this.getNodesOnFloor(nextFloor);
    
    // 确保每个节点至少有一条出路
    currentNodes.forEach(currentNode => {
        const minConnections = 1;
        const maxConnections = Math.min(3, nextNodes.length);
        const connectionCount = minConnections + Math.floor(Math.random() * (maxConnections - minConnections + 1));
        
        const targets = this.selectConnectionTargets(currentNode, nextNodes, connectionCount);
        targets.forEach(target => {
            this.createConnection(currentNode.id, target.id);
        });
    });
    
    // 确保每个下层节点都可达
    this.ensureNodeAccessibility(nextNodes, currentNodes);
}

private selectConnectionTargets(sourceNode: MapNodeData, targetNodes: MapNodeData[], count: number): MapNodeData[] {
    // 基于节点类型和位置计算连接权重
    const weightedTargets = targetNodes.map(target => ({
        node: target,
        weight: this.calculateConnectionWeight(sourceNode, target)
    }));
    
    // 按权重排序
    weightedTargets.sort((a, b) => b.weight - a.weight);
    
    // 选择前N个，但加入一些随机性
    const selected: MapNodeData[] = [];
    const baseSelections = Math.floor(count * 0.7); // 70%基于权重
    const randomSelections = count - baseSelections;
    
    // 权重选择
    for (let i = 0; i < baseSelections && i < weightedTargets.length; i++) {
        selected.push(weightedTargets[i].node);
    }
    
    // 随机选择剩余的
    const remaining = weightedTargets.slice(baseSelections).map(w => w.node);
    for (let i = 0; i < randomSelections && remaining.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        selected.push(remaining.splice(randomIndex, 1)[0]);
    }
    
    return selected;
}
```

**步骤 2：路径权重计算**
```typescript
private calculateConnectionWeight(source: MapNodeData, target: MapNodeData): number {
    let weight = 1.0;
    
    // 距离因子 - 越近权重越高
    const distance = Vec2.distance(source.position, target.position);
    const normalizedDistance = distance / 200; // 假设200是标准距离
    weight *= (2.0 - Math.min(normalizedDistance, 1.5));
    
    // 节点类型兼容性
    weight *= this.getTypeCompatibility(source.type, target.type);
    
    // 避免过度集中到单一节点
    const targetConnectionCount = this.getNodeConnectionCount(target.id);
    if (targetConnectionCount > 2) {
        weight *= 0.5; // 减少权重
    }
    
    // 章节特定逻辑
    weight *= this.getChapterSpecificWeight(source, target);
    
    return weight;
}

private getTypeCompatibility(sourceType: NodeType, targetType: NodeType): number {
    // 定义节点类型之间的兼容性矩阵
    const compatibilityMatrix = {
        [NodeType.COMBAT]: {
            [NodeType.SHOP]: 1.2,      // 战斗后更需要商店
            [NodeType.REST]: 1.5,      // 战斗后更需要休息
            [NodeType.ELITE]: 0.8,     // 连续高难度降低权重
            [NodeType.BOSS]: 0.3       // 避免直连Boss
        },
        [NodeType.SHOP]: {
            [NodeType.COMBAT]: 1.1,    // 购买装备后适合战斗
            [NodeType.ELITE]: 1.3,     // 强化后挑战精英
            [NodeType.REST]: 0.7       // 商店后不太需要休息
        },
        [NodeType.REST]: {
            [NodeType.COMBAT]: 1.4,    // 休息后适合战斗
            [NodeType.ELITE]: 1.6,     // 休息后挑战精英
            [NodeType.BOSS]: 1.8       // 休息后挑战Boss
        }
        // ... 其他组合
    };
    
    return compatibilityMatrix[sourceType]?.[targetType] || 1.0;
}
```

### 3.2 可视化路径系统

**步骤 1：路径绘制组件**
```typescript
@ccclass('PathRenderer')
export class PathRenderer extends Component {
    @property(Graphics)
    public pathGraphics: Graphics = null;
    
    @property
    public pathWidth: number = 8;
    
    @property
    public activePathColor: Color = Color.YELLOW;
    
    @property
    public completedPathColor: Color = Color.GREEN;
    
    @property
    public lockedPathColor: Color = Color.GRAY;
    
    public renderAllPaths(): void {
        this.pathGraphics.clear();
        
        const allPaths = this.mapManager.getAllPaths();
        allPaths.forEach(path => {
            this.renderPath(path);
        });
    }
    
    private renderPath(path: PathData): void {
        const startNode = this.mapManager.getNode(path.fromNodeId);
        const endNode = this.mapManager.getNode(path.toNodeId);
        
        if (!startNode || !endNode) return;
        
        // 确定路径颜色和状态
        const pathColor = this.getPathColor(path, startNode, endNode);
        const isAnimated = this.shouldAnimatePath(path);
        
        // 绘制基础路径
        this.drawBasePath(startNode.position, endNode.position, pathColor);
        
        // 添加特效
        if (isAnimated) {
            this.addPathAnimation(startNode.position, endNode.position);
        }
    }
    
    private drawBasePath(start: Vec2, end: Vec2, color: Color): void {
        this.pathGraphics.strokeColor = color;
        this.pathGraphics.lineWidth = this.pathWidth;
        
        // 绘制贝塞尔曲线路径
        const controlPoint = this.calculateControlPoint(start, end);
        
        this.pathGraphics.moveTo(start.x, start.y);
        this.pathGraphics.quadraticCurveTo(
            controlPoint.x, controlPoint.y,
            end.x, end.y
        );
        this.pathGraphics.stroke();
    }
}
```

**步骤 2：路径动画效果**
```typescript
private addPathAnimation(start: Vec2, end: Vec2): void {
    // 创建能量流动效果
    const energyOrb = this.createEnergyOrb();
    energyOrb.setPosition(start.x, start.y);
    
    const pathDuration = Vec2.distance(start, end) / 200; // 基于距离计算持续时间
    
    const moveSequence = tween(energyOrb)
        .to(pathDuration, { position: cc.v3(end.x, end.y, 0) })
        .call(() => {
            this.createArrivalEffect(end);
            energyOrb.destroy();
        });
    
    moveSequence.start();
}

private createProgressParticles(path: PathData): void {
    // 在路径上创建进度粒子效果
    const particleCount = 5;
    const pathLength = Vec2.distance(
        this.mapManager.getNode(path.fromNodeId).position,
        this.mapManager.getNode(path.toNodeId).position
    );
    
    for (let i = 0; i < particleCount; i++) {
        const progress = i / (particleCount - 1);
        const position = this.interpolatePathPosition(path, progress);
        
        const particle = this.createProgressParticle();
        particle.setPosition(position.x, position.y);
        
        // 粒子闪烁动画
        const blinkSequence = tween(particle)
            .repeatForever(
                tween()
                    .to(0.5, { opacity: 100 })
                    .to(0.5, { opacity: 255 })
            );
        
        blinkSequence.start();
    }
}
```

## 第四阶段：地图UI和交互系统

### 4.1 地图导航界面

**步骤 1：地图相机控制**
```typescript
@ccclass('MapCamera')
export class MapCamera extends Component {
    @property(Camera)
    public camera: Camera = null;
    
    @property
    public zoomMin: number = 0.5;
    
    @property
    public zoomMax: number = 2.0;
    
    @property
    public panSpeed: number = 300;
    
    private isDragging: boolean = false;
    private lastTouchPos: Vec2 = null;
    
    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }
    
    private onTouchStart(event: EventTouch): void {
        this.isDragging = true;
        this.lastTouchPos = event.getUILocation();
    }
    
    private onTouchMove(event: EventTouch): void {
        if (!this.isDragging) return;
        
        const currentPos = event.getUILocation();
        const deltaPos = currentPos.subtract(this.lastTouchPos);
        
        // 转换为世界坐标移动
        const worldDelta = this.camera.screenToWorld(cc.v3(deltaPos.x, deltaPos.y, 0));
        const currentCameraPos = this.camera.node.position;
        
        this.camera.node.setPosition(
            currentCameraPos.x - worldDelta.x,
            currentCameraPos.y - worldDelta.y,
            currentCameraPos.z
        );
        
        this.lastTouchPos = currentPos;
    }
    
    private onMouseWheel(event: EventMouse): void {
        const zoomDelta = event.getScrollY() * 0.001;
        const currentZoom = this.camera.orthoHeight;
        const newZoom = Math.max(this.zoomMin, Math.min(this.zoomMax, currentZoom + zoomDelta));
        
        this.camera.orthoHeight = newZoom;
    }
}
```

**步骤 2：节点选择和信息显示**
```typescript
@ccclass('NodeInteraction')
export class NodeInteraction extends Component {
    @property(Node)
    public infoPanel: Node = null;
    
    @property(Node)
    public nodeTooltip: Node = null;
    
    protected onLoad(): void {
        // 为所有节点添加点击和悬停事件
        const allNodes = this.node.getComponentsInChildren(MapNodeComponent);
        allNodes.forEach(nodeComponent => {
            const nodeButton = nodeComponent.getComponent(Button);
            nodeButton.node.on('click', () => this.onNodeClicked(nodeComponent), this);
            nodeButton.node.on(Input.EventType.TOUCH_START, () => this.showNodeTooltip(nodeComponent), this);
            nodeButton.node.on(Input.EventType.TOUCH_END, () => this.hideNodeTooltip(), this);
        });
    }
    
    private onNodeClicked(nodeComponent: MapNodeComponent): void {
        const nodeData = nodeComponent.nodeData;
        
        if (!nodeData.isAccessible) {
            this.showInaccessibleMessage();
            return;
        }
        
        if (nodeData.isCompleted) {
            this.showCompletedNodeInfo(nodeData);
            return;
        }
        
        // 显示确认对话框
        this.showNodeConfirmDialog(nodeData);
    }
    
    private showNodeConfirmDialog(nodeData: MapNodeData): void {
        const dialogData = {
            title: this.getNodeTypeName(nodeData.type),
            description: this.getNodeDescription(nodeData),
            rewards: this.getNodeRewards(nodeData),
            requirements: this.getNodeRequirements(nodeData),
            onConfirm: () => this.enterNode(nodeData),
            onCancel: () => this.hideConfirmDialog()
        };
        
        this.showDialog(dialogData);
    }
}
```

### 4.2 章节切换和进度显示

**步骤 1：章节进度栏**
```typescript
@ccclass('ChapterProgressBar')
export class ChapterProgressBar extends Component {
    @property(Node)
    public progressBarContainer: Node = null;
    
    @property(Prefab)
    public chapterSegmentPrefab: Prefab = null;
    
    private chapterSegments: Node[] = [];
    
    protected onLoad(): void {
        this.createChapterSegments();
        EventManager.on('player_progress_updated', this.updateProgress, this);
    }
    
    private createChapterSegments(): void {
        for (let chapter = 1; chapter <= 3; chapter++) {
            const segment = instantiate(this.chapterSegmentPrefab);
            segment.setParent(this.progressBarContainer);
            
            // 设置章节信息
            const chapterLabel = segment.getChildByName('ChapterLabel').getComponent(Label);
            chapterLabel.string = `第${chapter}章`;
            
            const progressFill = segment.getChildByName('ProgressFill').getComponent(Sprite);
            progressFill.fillRange = this.getChapterProgress(chapter);
            
            // 设置章节主题色彩
            const chapterColor = this.getChapterColor(chapter);
            segment.color = chapterColor;
            
            this.chapterSegments.push(segment);
        }
    }
    
    private updateProgress(playerProgress: PlayerProgress): void {
        this.chapterSegments.forEach((segment, index) => {
            const chapter = index + 1;
            const progress = this.calculateChapterProgress(playerProgress, chapter);
            
            const progressFill = segment.getChildByName('ProgressFill').getComponent(Sprite);
            
            // 平滑更新进度条
            tween(progressFill)
                .to(0.5, { fillRange: progress })
                .start();
            
            // 更新章节状态
            this.updateChapterStatus(segment, chapter, progress);
        });
    }
}
```

**步骤 2：地图概览模式**
```typescript
@ccclass('MapOverview')
export class MapOverview extends Component {
    @property(Camera)
    public overviewCamera: Camera = null;
    
    @property
    public overviewScale: number = 0.3;
    
    private isOverviewMode: boolean = false;
    
    public toggleOverviewMode(): void {
        this.isOverviewMode = !this.isOverviewMode;
        
        if (this.isOverviewMode) {
            this.enterOverviewMode();
        } else {
            this.exitOverviewMode();
        }
    }
    
    private enterOverviewMode(): void {
        // 计算包含所有节点的边界框
        const mapBounds = this.calculateMapBounds();
        
        // 调整相机位置和缩放以显示整个地图
        const targetPosition = mapBounds.center;
        const targetZoom = this.calculateOptimalZoom(mapBounds);
        
        // 平滑过渡到概览视图
        const cameraTransition = tween(this.overviewCamera.node)
            .to(0.8, { position: cc.v3(targetPosition.x, targetPosition.y, 0) });
        
        const zoomTransition = tween(this.overviewCamera)
            .to(0.8, { orthoHeight: targetZoom });
        
        cameraTransition.start();
        zoomTransition.start();
        
        // 显示章节标签和统计信息
        this.showOverviewElements();
    }
    
    private exitOverviewMode(): void {
        // 返回到玩家当前位置
        const currentPlayerNode = this.mapManager.getCurrentPlayerNode();
        const targetPosition = currentPlayerNode.position;
        
        const returnTransition = tween(this.overviewCamera.node)
            .to(0.6, { position: cc.v3(targetPosition.x, targetPosition.y, 0) });
        
        const zoomReturn = tween(this.overviewCamera)
            .to(0.6, { orthoHeight: 1.0 });
        
        returnTransition.start();
        zoomReturn.start();
        
        this.hideOverviewElements();
    }
}
```

## 第五阶段：保存和进度系统

### 5.1 地图状态持久化

**步骤 1：地图数据序列化**
```typescript
@ccclass('MapSaveManager')
export class MapSaveManager extends Component {
    private static SAVE_KEY = 'map_progress_data';
    
    public saveMapProgress(): void {
        const saveData = {
            version: 1,
            timestamp: Date.now(),
            currentNodeId: this.mapManager.getCurrentNodeId(),
            completedNodes: Array.from(this.mapManager.getCompletedNodes()),
            discoveredHiddenNodes: Array.from(this.mapManager.getDiscoveredHiddenNodes()),
            chapterProgress: this.mapManager.getChapterProgress(),
            playerStats: this.mapManager.getPlayerStats(),
            mapModifications: this.mapManager.getMapModifications()
        };
        
        try {
            const serializedData = JSON.stringify(saveData);
            cc.sys.localStorage.setItem(MapSaveManager.SAVE_KEY, serializedData);
            console.log('地图进度已保存');
        } catch (error) {
            console.error('保存地图进度失败:', error);
        }
    }
    
    public loadMapProgress(): MapSaveData | null {
        try {
            const serializedData = cc.sys.localStorage.getItem(MapSaveManager.SAVE_KEY);
            if (!serializedData) return null;
            
            const saveData = JSON.parse(serializedData) as MapSaveData;
            
            // 验证存档数据完整性
            if (this.validateSaveData(saveData)) {
                return saveData;
            } else {
                console.warn('存档数据损坏，将重新开始');
                return null;
            }
        } catch (error) {
            console.error('读取地图进度失败:', error);
            return null;
        }
    }
    
    private validateSaveData(saveData: MapSaveData): boolean {
        return saveData.version === 1 &&
               Array.isArray(saveData.completedNodes) &&
               typeof saveData.currentNodeId === 'string' &&
               typeof saveData.chapterProgress === 'object';
    }
}
```

**步骤 2：断点续传功能**
```typescript
public restoreMapState(saveData: MapSaveData): void {
    // 恢复节点完成状态
    saveData.completedNodes.forEach(nodeId => {
        const node = this.mapManager.getNode(nodeId);
        if (node) {
            node.isCompleted = true;
            this.updateNodeVisual(node);
        }
    });
    
    // 恢复当前玩家位置
    const currentNode = this.mapManager.getNode(saveData.currentNodeId);
    if (currentNode) {
        this.mapManager.setPlayerPosition(currentNode);
        this.focusCameraOnNode(currentNode);
    }
    
    // 恢复隐藏节点发现状态
    saveData.discoveredHiddenNodes.forEach(nodeId => {
        this.mapManager.revealHiddenNode(nodeId);
    });
    
    // 更新可访问性
    this.updateNodeAccessibility();
    
    // 恢复章节进度
    this.restoreChapterProgress(saveData.chapterProgress);
}
```

## 第六阶段：测试和优化

### 6.1 地图生成测试

**步骤 1：连通性验证**
```typescript
@ccclass('MapValidator')
export class MapValidator extends Component {
    public validateMapConnectivity(): boolean {
        const allNodes = this.mapManager.getAllNodes();
        const startNode = allNodes.find(node => node.floor === 1);
        
        if (!startNode) {
            console.error('找不到起始节点');
            return false;
        }
        
        // 使用广度优先搜索验证所有节点可达性
        const visited = new Set<string>();
        const queue = [startNode];
        
        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (visited.has(currentNode.id)) continue;
            
            visited.add(currentNode.id);
            
            // 添加连接的节点到队列
            currentNode.connections.forEach(connectionId => {
                const connectedNode = this.mapManager.getNode(connectionId);
                if (connectedNode && !visited.has(connectedNode.id)) {
                    queue.push(connectedNode);
                }
            });
        }
        
        // 检查是否所有节点都可达
        const unreachableNodes = allNodes.filter(node => !visited.has(node.id));
        
        if (unreachableNodes.length > 0) {
            console.error('发现不可达节点:', unreachableNodes.map(n => n.id));
            return false;
        }
        
        return true;
    }
    
    public validateNodeDistribution(): boolean {
        const chapters = [1, 2, 3];
        
        return chapters.every(chapter => {
            const chapterNodes = this.mapManager.getChapterNodes(chapter);
            
            // 验证Boss节点存在
            const bossNodes = chapterNodes.filter(n => n.type === NodeType.BOSS);
            if (bossNodes.length !== 1) {
                console.error(`第${chapter}章Boss节点数量异常: ${bossNodes.length}`);
                return false;
            }
            
            // 验证商店节点数量
            const shopNodes = chapterNodes.filter(n => n.type === NodeType.SHOP);
            if (shopNodes.length < 2) {
                console.error(`第${chapter}章商店节点过少: ${shopNodes.length}`);
                return false;
            }
            
            return true;
        });
    }
}
```

### 6.2 性能优化

**步骤 1：节点懒加载**
```typescript
@ccclass('NodeLODManager')
export class NodeLODManager extends Component {
    private visibleNodes: Set<string> = new Set();
    private nodePool: Map<NodeType, Node[]> = new Map();
    
    protected update(dt: number): void {
        const cameraPosition = this.mapCamera.node.position;
        const viewDistance = this.calculateViewDistance();
        
        // 更新可见节点
        const allNodes = this.mapManager.getAllNodes();
        allNodes.forEach(nodeData => {
            const distance = Vec2.distance(
                cc.v2(cameraPosition.x, cameraPosition.y),
                nodeData.position
            );
            
            const shouldBeVisible = distance <= viewDistance;
            const isCurrentlyVisible = this.visibleNodes.has(nodeData.id);
            
            if (shouldBeVisible && !isCurrentlyVisible) {
                this.showNode(nodeData);
            } else if (!shouldBeVisible && isCurrentlyVisible) {
                this.hideNode(nodeData);
            }
        });
    }
    
    private showNode(nodeData: MapNodeData): void {
        const nodeComponent = this.getOrCreateNodeComponent(nodeData);
        nodeComponent.node.active = true;
        this.visibleNodes.add(nodeData.id);
    }
    
    private hideNode(nodeData: MapNodeData): void {
        const nodeComponent = this.getNodeComponent(nodeData.id);
        if (nodeComponent) {
            this.returnNodeToPool(nodeComponent);
            this.visibleNodes.delete(nodeData.id);
        }
    }
}
```

**步骤 2：路径渲染优化**
```typescript
// 批量渲染路径以减少绘制调用
private optimizePathRendering(): void {
    // 将路径按颜色分组
    const pathGroups = new Map<string, PathData[]>();
    
    this.mapManager.getAllPaths().forEach(path => {
        const colorKey = this.getPathColor(path).toHEX();
        if (!pathGroups.has(colorKey)) {
            pathGroups.set(colorKey, []);
        }
        pathGroups.get(colorKey).push(path);
    });
    
    // 为每种颜色创建一个Graphics组件
    pathGroups.forEach((paths, colorKey) => {
        const graphics = this.getGraphicsForColor(colorKey);
        graphics.clear();
        graphics.strokeColor = Color.fromHEX(colorKey);
        
        // 批量绘制相同颜色的路径
        paths.forEach(path => {
            this.drawPathOnGraphics(graphics, path);
        });
        
        graphics.stroke();
    });
}
```

## 性能优化建议

### 渲染优化
- 使用对象池管理节点和特效组件
- 实现基于距离的LOD系统
- 批量渲染相同类型的视觉元素

### 内存管理
- 及时清理不可见区域的资源
- 压缩地图数据结构
- 使用弱引用避免循环依赖

### 算法优化
- 缓存路径查找结果
- 使用空间哈希优化碰撞检测
- 异步处理地图生成避免卡顿

这个地图进度系统工作流程提供了完整的类《杀戮尖塔》风格的地图实现，包括智能路径生成、丰富的节点类型和流畅的用户体验。