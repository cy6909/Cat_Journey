import { _decorator, Component, Node, Prefab, instantiate, Vec3, math } from 'cc';
import { EnhancedBossController, BossType } from '../gameplay/EnhancedBossController';
import { ProceduralLevelGenerator, LevelType } from '../gameplay/ProceduralLevelGenerator';
import { EnhancedBrick, BrickType } from '../gameplay/EnhancedBrick';
import { EnhancedBall } from '../gameplay/EnhancedBall';

const { ccclass, property } = _decorator;

export enum EliteType {
    BRICK_FORTRESS = 0,      // 砖块要塞 - 大量强化砖块
    SPEED_DEMON = 1,         // 速度恶魔 - 快速移动的威胁
    REGENERATOR = 2,         // 再生者 - 砖块自我修复
    ELEMENTAL_CHAOS = 3,     // 元素混沌 - 随机元素效果
    GRAVITY_ANOMALY = 4,     // 重力异常 - 重力场扭曲
    TIME_DISTORTION = 5,     // 时间扭曲 - 时间流速变化
    PHASE_SHIFTER = 6,       // 相位转换者 - 砖块随机消失
    MAGNETIC_STORM = 7,      // 磁暴 - 强磁场影响
    SHIELD_MATRIX = 8,       // 护盾矩阵 - 互相保护的砖块
    VOID_CORRUPTION = 9,     // 虚空腐蚀 - 虚空砖块扩散
    EXPLOSIVE_MINE = 10,     // 爆炸地雷 - 连锁爆炸
    ICE_AGE = 11,           // 冰河时代 - 冰冻效果扩散
    FIRE_STORM = 12,        // 火焰风暴 - 火焰持续伤害
    ELECTRIC_GRID = 13,     // 电网 - 电流连锁反应
    POISON_CLOUD = 14,      // 毒云 - 毒素持续扩散
    CRYSTAL_PRISON = 15,    // 水晶监狱 - 水晶砖块阵列
    RUBBER_NIGHTMARE = 16,  // 橡胶噩梦 - 超强反弹
    METAL_FORTRESS = 17,    // 金属要塞 - 反弹伤害
    LIGHT_PUZZLE = 18,      // 光影谜题 - 特殊视觉效果
    DARK_LABYRINTH = 19     // 黑暗迷宫 - 视野限制
}

export enum HiddenBossType {
    ANCIENT_GUARDIAN = 0,    // 远古守护者 - 需要无伤通关解锁
    VOID_LORD = 1,          // 虚空领主 - 需要收集特定遗物解锁
    TIME_WEAVER = 2,        // 时间编织者 - 需要在时限内完成关卡解锁
    ELEMENTAL_AVATAR = 3,   // 元素化身 - 需要使用所有元素攻击解锁
    MIRROR_SHADOW = 4       // 镜像阴影 - 需要特定操作序列解锁
}

interface EliteConfig {
    name: string;
    description: string;
    difficultyMultiplier: number;
    specialBrickRatio: number;
    primaryBrickType: BrickType;
    secondaryBrickTypes: BrickType[];
    specialMechanic: string;
}

interface HiddenBossConfig {
    name: string;
    description: string;
    unlockCondition: string;
    unlockDescription: string;
    bossType: BossType;
    difficultyMultiplier: number;
    specialReward: string;
}

@ccclass('EliteAndHiddenBossManager')
export class EliteAndHiddenBossManager extends Component {
    @property({type: Prefab})
    public enhancedBossPrefab: Prefab | null = null;
    
    @property({type: Prefab})
    public enhancedBrickPrefab: Prefab | null = null;
    
    // Elite level configurations
    private _eliteConfigs: Map<EliteType, EliteConfig> = new Map();
    
    // Hidden boss configurations
    private _hiddenBossConfigs: Map<HiddenBossType, HiddenBossConfig> = new Map();
    
    // Unlock tracking
    private _unlockedHiddenBosses: Set<HiddenBossType> = new Set();
    private _playerStats = {
        perfectRuns: 0,
        collectedRelics: new Set<string>(),
        timeRecords: new Map<number, number>(),
        usedElements: new Set<string>(),
        secretSequence: [] as string[]
    };
    
    protected onLoad(): void {
        this.initializeEliteConfigs();
        this.initializeHiddenBossConfigs();
        this.loadUnlockProgress();
    }
    
    private initializeEliteConfigs(): void {
        // Elite Type 0-4: Basic Elite Mechanics
        this._eliteConfigs.set(EliteType.BRICK_FORTRESS, {
            name: "砖块要塞",
            description: "大量强化砖块构成的坚固防线",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.REINFORCED,
            secondaryBrickTypes: [BrickType.SHIELD, BrickType.METAL],
            specialMechanic: "fortress_defense"
        });
        
        this._eliteConfigs.set(EliteType.SPEED_DEMON, {
            name: "速度恶魔",
            description: "快速移动的球和压迫性时间限制",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.6,
            primaryBrickType: BrickType.NORMAL,
            secondaryBrickTypes: [BrickType.TIME, BrickType.GRAVITY],
            specialMechanic: "speed_pressure"
        });
        
        this._eliteConfigs.set(EliteType.REGENERATOR, {
            name: "再生者",
            description: "砖块持续自我修复的噩梦关卡",
            difficultyMultiplier: 1.5,
            specialBrickRatio: 0.7,
            primaryBrickType: BrickType.REGENERATING,
            secondaryBrickTypes: [BrickType.HEALING, BrickType.EXPERIENCE],
            specialMechanic: "regeneration_field"
        });
        
        this._eliteConfigs.set(EliteType.ELEMENTAL_CHAOS, {
            name: "元素混沌",
            description: "随机元素效果不断变化",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.9,
            primaryBrickType: BrickType.FIRE,
            secondaryBrickTypes: [BrickType.ICE, BrickType.ELECTRIC, BrickType.POISON],
            specialMechanic: "elemental_chaos"
        });
        
        this._eliteConfigs.set(EliteType.GRAVITY_ANOMALY, {
            name: "重力异常",
            description: "重力场持续扭曲变化",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.6,
            primaryBrickType: BrickType.GRAVITY,
            secondaryBrickTypes: [BrickType.MAGNETIC, BrickType.PHASE],
            specialMechanic: "gravity_chaos"
        });
        
        // Elite Type 5-9: Advanced Elite Mechanics
        this._eliteConfigs.set(EliteType.TIME_DISTORTION, {
            name: "时间扭曲",
            description: "时间流速随机变化，考验反应能力",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: BrickType.TIME,
            secondaryBrickTypes: [BrickType.PHASE, BrickType.TELEPORT],
            specialMechanic: "time_chaos"
        });
        
        this._eliteConfigs.set(EliteType.PHASE_SHIFTER, {
            name: "相位转换者",
            description: "砖块随机在可见和不可见间切换",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.PHASE,
            secondaryBrickTypes: [BrickType.TELEPORT, BrickType.VOID],
            specialMechanic: "phase_shifting"
        });
        
        this._eliteConfigs.set(EliteType.MAGNETIC_STORM, {
            name: "磁暴",
            description: "强磁场持续影响球的轨迹",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: BrickType.MAGNETIC,
            secondaryBrickTypes: [BrickType.ELECTRIC, BrickType.METAL],
            specialMechanic: "magnetic_chaos"
        });
        
        this._eliteConfigs.set(EliteType.SHIELD_MATRIX, {
            name: "护盾矩阵",
            description: "砖块互相提供护盾保护",
            difficultyMultiplier: 1.5,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.SHIELD,
            secondaryBrickTypes: [BrickType.REINFORCED, BrickType.REGENERATING],
            specialMechanic: "shield_network"
        });
        
        this._eliteConfigs.set(EliteType.VOID_CORRUPTION, {
            name: "虚空腐蚀",
            description: "虚空砖块持续扩散腐蚀其他砖块",
            difficultyMultiplier: 1.6,
            specialBrickRatio: 0.5,
            primaryBrickType: BrickType.VOID,
            secondaryBrickTypes: [BrickType.DARK, BrickType.CURSED],
            specialMechanic: "void_spread"
        });
        
        // Elite Type 10-14: Elemental Elite Mechanics
        this._eliteConfigs.set(EliteType.EXPLOSIVE_MINE, {
            name: "爆炸地雷",
            description: "连锁爆炸威力巨大",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.6,
            primaryBrickType: BrickType.EXPLOSIVE,
            secondaryBrickTypes: [BrickType.FIRE, BrickType.CRYSTAL],
            specialMechanic: "chain_explosion"
        });
        
        this._eliteConfigs.set(EliteType.ICE_AGE, {
            name: "冰河时代",
            description: "冰冻效果持续扩散",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.ICE,
            secondaryBrickTypes: [BrickType.CRYSTAL, BrickType.TIME],
            specialMechanic: "ice_spread"
        });
        
        this._eliteConfigs.set(EliteType.FIRE_STORM, {
            name: "火焰风暴",
            description: "火焰持续伤害和蔓延",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: BrickType.FIRE,
            secondaryBrickTypes: [BrickType.EXPLOSIVE, BrickType.LIGHT],
            specialMechanic: "fire_spread"
        });
        
        this._eliteConfigs.set(EliteType.ELECTRIC_GRID, {
            name: "电网",
            description: "电流在砖块间形成复杂网络",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.ELECTRIC,
            secondaryBrickTypes: [BrickType.METAL, BrickType.CRYSTAL],
            specialMechanic: "electric_network"
        });
        
        this._eliteConfigs.set(EliteType.POISON_CLOUD, {
            name: "毒云",
            description: "毒素持续扩散和累积",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.7,
            primaryBrickType: BrickType.POISON,
            secondaryBrickTypes: [BrickType.DARK, BrickType.VOID],
            specialMechanic: "poison_spread"
        });
        
        // Elite Type 15-19: Special Material Elite Mechanics
        this._eliteConfigs.set(EliteType.CRYSTAL_PRISON, {
            name: "水晶监狱",
            description: "水晶砖块形成复杂连锁反应",
            difficultyMultiplier: 1.5,
            specialBrickRatio: 0.9,
            primaryBrickType: BrickType.CRYSTAL,
            secondaryBrickTypes: [BrickType.LIGHT, BrickType.ELECTRIC],
            specialMechanic: "crystal_network"
        });
        
        this._eliteConfigs.set(EliteType.RUBBER_NIGHTMARE, {
            name: "橡胶噩梦",
            description: "超强反弹效果让球难以控制",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.RUBBER,
            secondaryBrickTypes: [BrickType.RUBBER, BrickType.MAGNETIC],
            specialMechanic: "hyper_bounce"
        });
        
        this._eliteConfigs.set(EliteType.METAL_FORTRESS, {
            name: "金属要塞",
            description: "金属砖块反弹攻击伤害",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: BrickType.METAL,
            secondaryBrickTypes: [BrickType.ELECTRIC, BrickType.SHIELD],
            specialMechanic: "damage_reflection"
        });
        
        this._eliteConfigs.set(EliteType.LIGHT_PUZZLE, {
            name: "光影谜题",
            description: "特殊视觉效果和光线机制",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.6,
            primaryBrickType: BrickType.LIGHT,
            secondaryBrickTypes: [BrickType.CRYSTAL, BrickType.PHASE],
            specialMechanic: "light_mechanics"
        });
        
        this._eliteConfigs.set(EliteType.DARK_LABYRINTH, {
            name: "黑暗迷宫",
            description: "视野限制增加游戏难度",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.8,
            primaryBrickType: BrickType.DARK,
            secondaryBrickTypes: [BrickType.VOID, BrickType.PHASE],
            specialMechanic: "vision_limit"
        });
    }
    
    private initializeHiddenBossConfigs(): void {
        this._hiddenBossConfigs.set(HiddenBossType.ANCIENT_GUARDIAN, {
            name: "远古守护者",
            description: "沉睡千年的远古力量苏醒",
            unlockCondition: "perfect_runs_3",
            unlockDescription: "完成3次无伤通关",
            bossType: BossType.GUARDIAN_WALL,
            difficultyMultiplier: 2.5,
            specialReward: "legendary_relic_ancient_power"
        });
        
        this._hiddenBossConfigs.set(HiddenBossType.VOID_LORD, {
            name: "虚空领主",
            description: "来自虚无深渊的恐怖存在",
            unlockCondition: "collect_void_relics_5",
            unlockDescription: "收集5个虚空系遗物",
            bossType: BossType.TELEPORTER,
            difficultyMultiplier: 3.0,
            specialReward: "legendary_relic_void_mastery"
        });
        
        this._hiddenBossConfigs.set(HiddenBossType.TIME_WEAVER, {
            name: "时间编织者",
            description: "操控时间线的神秘实体",
            unlockCondition: "speed_run_records_10",
            unlockDescription: "在10个关卡创造速通记录",
            bossType: BossType.TIME_MANIPULATOR,
            difficultyMultiplier: 2.8,
            specialReward: "legendary_relic_time_control"
        });
        
        this._hiddenBossConfigs.set(HiddenBossType.ELEMENTAL_AVATAR, {
            name: "元素化身",
            description: "四大元素力量的完美融合",
            unlockCondition: "use_all_elements_100",
            unlockDescription: "使用所有元素攻击累计100次",
            bossType: BossType.ELEMENTAL_CHAOS,
            difficultyMultiplier: 2.7,
            specialReward: "legendary_relic_elemental_mastery"
        });
        
        this._hiddenBossConfigs.set(HiddenBossType.MIRROR_SHADOW, {
            name: "镜像阴影",
            description: "玩家内心黑暗面的具现化",
            unlockCondition: "secret_sequence_complete",
            unlockDescription: "在特定关卡执行神秘操作序列",
            bossType: BossType.MIRROR_BOSS,
            difficultyMultiplier: 3.2,
            specialReward: "legendary_relic_shadow_mastery"
        });
    }
    
    public generateEliteLevel(eliteType: EliteType, chapter: number, levelNumber: number): void {
        const config = this._eliteConfigs.get(eliteType);
        if (!config) {
            console.error(`Elite config not found for type: ${eliteType}`);
            return;
        }
        
        console.log(`Generating Elite Level: ${config.name}`);
        
        // Calculate difficulty based on chapter and elite multiplier
        const baseDifficulty = 1 + (chapter - 1) * 0.5 + levelNumber * 0.1;
        const eliteDifficulty = baseDifficulty * config.difficultyMultiplier;
        
        // Generate elite-specific brick layout
        this.createEliteBrickLayout(config, eliteDifficulty);
        
        // Apply special mechanics
        this.activateEliteMechanic(config.specialMechanic, eliteDifficulty);
        
        // Update UI to show elite level info
        this.displayEliteLevelInfo(config);
    }
    
    private createEliteBrickLayout(config: EliteConfig, difficulty: number): void {
        if (!this.enhancedBrickPrefab) return;
        
        const brickCount = Math.floor(30 + difficulty * 5); // More bricks than normal
        const specialCount = Math.floor(brickCount * config.specialBrickRatio);
        const normalCount = brickCount - specialCount;
        
        // Create primary special bricks
        const primaryCount = Math.floor(specialCount * 0.6);
        for (let i = 0; i < primaryCount; i++) {
            this.createEliteBrick(config.primaryBrickType, difficulty);
        }
        
        // Create secondary special bricks
        const secondaryCount = specialCount - primaryCount;
        for (let i = 0; i < secondaryCount; i++) {
            const randomSecondary = config.secondaryBrickTypes[
                Math.floor(Math.random() * config.secondaryBrickTypes.length)
            ];
            this.createEliteBrick(randomSecondary, difficulty);
        }
        
        // Create normal bricks
        for (let i = 0; i < normalCount; i++) {
            this.createEliteBrick(BrickType.NORMAL, difficulty);
        }
    }
    
    private createEliteBrick(brickType: BrickType, difficulty: number): Node | null {
        if (!this.enhancedBrickPrefab) return null;
        
        const brick = instantiate(this.enhancedBrickPrefab);
        const brickComponent = brick.getComponent(EnhancedBrick);
        
        if (brickComponent) {
            brickComponent.brickType = brickType;
            
            // Enhanced stats for elite levels
            const baseHealth = this.getEliteHealthForBrickType(brickType);
            brickComponent.health = Math.max(1, Math.floor(baseHealth * difficulty * 1.5));
            
            const baseScore = this.getEliteScoreForBrickType(brickType);
            brickComponent.scoreValue = Math.floor(baseScore * difficulty * 1.3);
        }
        
        // Random position within elite level bounds
        const x = math.randomRangeInt(-350, 350);
        const y = math.randomRangeInt(100, 400);
        brick.setWorldPosition(x, y, 0);
        brick.setParent(this.node.parent);
        
        return brick;
    }
    
    private activateEliteMechanic(mechanic: string, difficulty: number): void {
        switch (mechanic) {
            case "fortress_defense":
                this.activateFortressDefense(difficulty);
                break;
            case "speed_pressure":
                this.activateSpeedPressure(difficulty);
                break;
            case "regeneration_field":
                this.activateRegenerationField(difficulty);
                break;
            case "elemental_chaos":
                this.activateElementalChaos(difficulty);
                break;
            case "gravity_chaos":
                this.activateGravityChaos(difficulty);
                break;
            case "time_chaos":
                this.activateTimeChaos(difficulty);
                break;
            case "phase_shifting":
                this.activatePhaseShifting(difficulty);
                break;
            case "magnetic_chaos":
                this.activateMagneticChaos(difficulty);
                break;
            case "shield_network":
                this.activateShieldNetwork(difficulty);
                break;
            case "void_spread":
                this.activateVoidSpread(difficulty);
                break;
            // Additional mechanics...
            default:
                console.log(`Elite mechanic not implemented: ${mechanic}`);
        }
    }
    //TODO:完成一个特殊效果的编写
    // Elite mechanic implementations
    private activateFortressDefense(difficulty: number): void {
        console.log('Fortress Defense mechanics activated');
        
        // Fortress Defense: Periodically creates shield barriers around remaining bricks
        this.schedule(() => {
            const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
            const activeBricks = allBricks.filter(brick => brick.node.active && brick.health > 0);
            
            // Create shield effect for 30% of remaining bricks
            const shieldCount = Math.floor(activeBricks.length * 0.3);
            for (let i = 0; i < shieldCount; i++) {
                const randomBrick = activeBricks[Math.floor(Math.random() * activeBricks.length)];
                if (randomBrick) {
                    // Add temporary shield (implementation would add visual effect and damage immunity)
                    this.addShieldEffect(randomBrick, 5000); // 5 seconds shield
                }
            }
        }, 8, 10, 2); // Every 8 seconds, max 10 times, start after 2 seconds
    }
    
    private activateSpeedPressure(difficulty: number): void {
        console.log('Speed Pressure mechanics activated');
        
        // Speed Pressure: Gradually increases ball speed and adds time pressure
        let speedMultiplier = 1.0;
        const maxSpeedMultiplier = 1.5 + (difficulty * 0.1);
        
        this.schedule(() => {
            speedMultiplier = Math.min(speedMultiplier + 0.1, maxSpeedMultiplier);
            
            // Apply speed boost to all balls
            const allBalls = this.node.parent?.getComponentsInChildren(EnhancedBall) || [];
            allBalls.forEach(ball => {
                if (ball.rigidBody) {
                    const currentVelocity = ball.rigidBody.linearVelocity;
                    currentVelocity.multiplyScalar(1.1); // 10% speed increase
                    ball.rigidBody.linearVelocity = currentVelocity;
                }
            });
            
            // Add time pressure visual effect
            this.addTimePressureEffect(speedMultiplier);
        }, 3, 15, 1); // Every 3 seconds, increase speed
    }
    
    private activateRegenerationField(difficulty: number): void {
        console.log('Regeneration Field mechanics activated');
        
        // Regeneration Field: Damaged bricks slowly regenerate health
        const regenRate = Math.floor(1 + difficulty * 0.5); // Health points per interval
        
        this.schedule(() => {
            const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
            allBricks.forEach(brick => {
                if (brick.node.active && brick.health > 0 && brick.health < brick.maxHealth) {
                    brick.health = Math.min(brick.health + regenRate, brick.maxHealth);
                    
                    // Add regeneration visual effect
                    this.addRegenerationEffect(brick);
                }
            });
        }, 2, Number.MAX_VALUE, 0); // Every 2 seconds, indefinitely
    }
    
    private activateElementalChaos(difficulty: number): void {
        console.log('Elemental Chaos mechanics activated');
        
        // Elemental Chaos: Random elemental effects applied to random areas
        const elements = ['fire', 'ice', 'electric', 'poison'];
        
        this.schedule(() => {
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            const effectRadius = 100 + (difficulty * 20);
            
            // Random position in game area
            const randomX = (Math.random() - 0.5) * 700; // Assume game width ~700
            const randomY = Math.random() * 400 + 100;    // Height range
            const effectPos = { x: randomX, y: randomY };
            
            // Apply elemental effect to nearby bricks and balls
            this.applyElementalEffect(randomElement, effectPos, effectRadius, difficulty);
            
        }, 5, 20, 3); // Every 5 seconds, max 20 times, start after 3 seconds
    }
    
    private activateGravityChaos(difficulty: number): void {
        console.log('Gravity Chaos mechanics activated');
        
        // Gravity Chaos: Periodically changes gravity direction and strength
        const gravityDirections = [
            { x: 0, y: -320 },    // Normal down
            { x: 0, y: 320 },     // Up
            { x: -320, y: 0 },    // Left
            { x: 320, y: 0 },     // Right
            { x: 0, y: -160 }     // Reduced down
        ];
        
        this.schedule(() => {
            const randomGravity = gravityDirections[Math.floor(Math.random() * gravityDirections.length)];
            
            // Apply gravity change (would need physics world access)
            this.applyGravityChange(randomGravity, 3000); // 3 seconds duration
            
            // Visual indicator of gravity change
            this.showGravityChangeEffect(randomGravity);
            
        }, 8, 10, 4); // Every 8 seconds, max 10 changes
    }
    
    private activateTimeChaos(difficulty: number): void {
        console.log('Time Chaos mechanics activated');
        
        // Time Chaos: Game speed fluctuates randomly
        const speedVariations = [0.5, 0.7, 1.0, 1.3, 1.5];
        
        this.schedule(() => {
            const newTimeScale = speedVariations[Math.floor(Math.random() * speedVariations.length)];
            
            // Apply time scale change (would affect all game objects)
            this.applyTimeScale(newTimeScale, 4000); // 4 seconds duration
            
            // Visual time distortion effect
            this.showTimeDistortionEffect(newTimeScale);
            
        }, 6, 15, 2); // Every 6 seconds
    }
    
    private activatePhaseShifting(difficulty: number): void {
        console.log('Phase Shifting mechanics activated');
        
        // Phase Shifting: Bricks randomly become intangible for short periods
        this.schedule(() => {
            const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
            const phaseCount = Math.floor(allBricks.length * 0.2); // 20% of bricks
            
            for (let i = 0; i < phaseCount; i++) {
                const randomBrick = allBricks[Math.floor(Math.random() * allBricks.length)];
                if (randomBrick && randomBrick.node.active) {
                    // Make brick intangible
                    this.makePhaseShifted(randomBrick, 3000); // 3 seconds intangible
                }
            }
        }, 7, 12, 3); // Every 7 seconds
    }
    
    private activateMagneticChaos(difficulty: number): void {
        console.log('Magnetic Chaos mechanics activated');
        
        // Magnetic Chaos: Creates magnetic fields that affect ball trajectory
        this.schedule(() => {
            const magneticStrength = 50 + (difficulty * 20);
            const fieldCount = 2 + Math.floor(difficulty * 0.5);
            
            for (let i = 0; i < fieldCount; i++) {
                const fieldX = (Math.random() - 0.5) * 600;
                const fieldY = Math.random() * 300 + 150;
                
                // Create magnetic field effect
                this.createMagneticField(fieldX, fieldY, magneticStrength, 5000); // 5 seconds
            }
        }, 10, 8, 2); // Every 10 seconds
    }
    
    private activateShieldNetwork(difficulty: number): void {
        console.log('Shield Network mechanics activated');
        
        // Shield Network: Bricks share shield protection with nearby bricks
        const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
        const networkRange = 150; // Distance for shield sharing
        
        // Create shield networks
        const networks: EnhancedBrick[][] = [];
        allBricks.forEach(brick => {
            if (!brick.node.active) return;
            
            // Find nearby bricks
            const nearbyBricks = allBricks.filter(otherBrick => {
                if (otherBrick === brick || !otherBrick.node.active) return false;
                const distance = this.getDistance(brick.node.position, otherBrick.node.position);
                return distance <= networkRange;
            });
            
            if (nearbyBricks.length > 0) {
                networks.push([brick, ...nearbyBricks]);
            }
        });
        
        // Apply shield network effects
        networks.forEach(network => {
            this.createShieldNetwork(network, difficulty);
        });
    }
    
    private activateVoidSpread(difficulty: number): void {
        console.log('Void Spread mechanics activated');
        
        // Void Spread: Void effect spreads to adjacent bricks over time
        const spreadInterval = Math.max(3, 6 - difficulty); // Faster spread with higher difficulty
        
        this.schedule(() => {
            const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
            const voidBricks = allBricks.filter(brick => 
                brick.node.active && brick.brickType === BrickType.VOID
            );
            
            voidBricks.forEach(voidBrick => {
                // Find adjacent bricks to corrupt
                const adjacentBricks = this.getAdjacentBricks(voidBrick, allBricks, 120);
                adjacentBricks.forEach(adjacentBrick => {
                    if (adjacentBrick.brickType !== BrickType.VOID && Math.random() < 0.3) {
                        // Convert to void brick with corruption effect
                        this.corruptToVoid(adjacentBrick);
                    }
                });
            });
        }, spreadInterval, 20, 1); // Spread every few seconds
    }
    
    // Hidden Boss Management
    public checkHiddenBossUnlocks(): void {
        for (const [bossType, config] of this._hiddenBossConfigs.entries()) {
            if (!this._unlockedHiddenBosses.has(bossType)) {
                if (this.checkUnlockCondition(config.unlockCondition)) {
                    this.unlockHiddenBoss(bossType);
                }
            }
        }
    }
    
    private checkUnlockCondition(condition: string): boolean {
        switch (condition) {
            case "perfect_runs_3":
                return this._playerStats.perfectRuns >= 3;
            case "collect_void_relics_5":
                return Array.from(this._playerStats.collectedRelics).filter(relic => 
                    relic.includes('void')).length >= 5;
            case "speed_run_records_10":
                return this._playerStats.timeRecords.size >= 10;
            case "use_all_elements_100":
                return this._playerStats.usedElements.size >= 4 && 
                       Array.from(this._playerStats.usedElements).length >= 100;
            case "secret_sequence_complete":
                return this.checkSecretSequence();
            default:
                return false;
        }
    }
    
    private checkSecretSequence(): boolean {
        const requiredSequence = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
        if (this._playerStats.secretSequence.length < requiredSequence.length) return false;
        
        const lastSequence = this._playerStats.secretSequence.slice(-requiredSequence.length);
        return JSON.stringify(lastSequence) === JSON.stringify(requiredSequence);
    }
    
    private unlockHiddenBoss(bossType: HiddenBossType): void {
        this._unlockedHiddenBosses.add(bossType);
        const config = this._hiddenBossConfigs.get(bossType);
        
        console.log(`Hidden Boss Unlocked: ${config?.name}`);
        this.showHiddenBossUnlockNotification(config!);
        this.saveUnlockProgress();
    }
    
    public spawnHiddenBoss(bossType: HiddenBossType, chapter: number): Node | null {
        if (!this._unlockedHiddenBosses.has(bossType) || !this.enhancedBossPrefab) {
            return null;
        }
        
        const config = this._hiddenBossConfigs.get(bossType);
        if (!config) return null;
        
        const boss = instantiate(this.enhancedBossPrefab);
        const bossController = boss.getComponent(EnhancedBossController);
        
        if (bossController) {
            bossController.bossType = config.bossType;
            bossController.chapter = chapter;
            
            // Apply hidden boss difficulty scaling
            const baseDifficulty = 100 + chapter * 50;
            bossController.maxHealth = Math.floor(baseDifficulty * config.difficultyMultiplier);
            bossController.attackPower = Math.floor(20 * config.difficultyMultiplier);
        }
        
        boss.setParent(this.node.parent);
        boss.setWorldPosition(0, 300, 0);
        
        console.log(`Hidden Boss Spawned: ${config.name}`);
        return boss;
    }
    
    // Player stats tracking for unlock conditions
    public recordPerfectRun(): void {
        this._playerStats.perfectRuns++;
        this.checkHiddenBossUnlocks();
    }
    
    public recordRelicCollected(relicName: string): void {
        this._playerStats.collectedRelics.add(relicName);
        this.checkHiddenBossUnlocks();
    }
    
    public recordSpeedRun(level: number, time: number): void {
        const currentRecord = this._playerStats.timeRecords.get(level);
        if (!currentRecord || time < currentRecord) {
            this._playerStats.timeRecords.set(level, time);
            this.checkHiddenBossUnlocks();
        }
    }
    
    public recordElementUsed(element: string): void {
        this._playerStats.usedElements.add(element);
        this.checkHiddenBossUnlocks();
    }
    
    public recordSecretInput(input: string): void {
        this._playerStats.secretSequence.push(input);
        // Keep only last 20 inputs to prevent memory issues
        if (this._playerStats.secretSequence.length > 20) {
            this._playerStats.secretSequence.shift();
        }
        this.checkHiddenBossUnlocks();
    }
    
    // Utility methods
    private getEliteHealthForBrickType(brickType: BrickType): number {
        switch (brickType) {
            case BrickType.NORMAL: return 2;
            case BrickType.REINFORCED: return 5;
            case BrickType.SHIELD: return 7;
            case BrickType.METAL: return 8;
            case BrickType.REGENERATING: return 4;
            default: return 3;
        }
    }
    
    private getEliteScoreForBrickType(brickType: BrickType): number {
        switch (brickType) {
            case BrickType.NORMAL: return 20;
            case BrickType.REINFORCED: return 60;
            case BrickType.EXPLOSIVE: return 50;
            case BrickType.SHIELD: return 80;
            case BrickType.VOID: return 200;
            default: return 30;
        }
    }
    
    private displayEliteLevelInfo(config: EliteConfig): void {
        console.log(`=== ELITE LEVEL ===`);
        console.log(`Name: ${config.name}`);
        console.log(`Description: ${config.description}`);
        console.log(`Difficulty: ${config.difficultyMultiplier}x`);
        console.log(`==================`);
    }
    
    private showHiddenBossUnlockNotification(config: HiddenBossConfig): void {
        console.log(`*** HIDDEN BOSS UNLOCKED ***`);
        console.log(`${config.name}: ${config.description}`);
        console.log(`Reward: ${config.specialReward}`);
        console.log(`****************************`);
    }
    
    private saveUnlockProgress(): void {
        // Save progress to local storage or game save system
        const saveData = {
            unlockedBosses: Array.from(this._unlockedHiddenBosses),
            playerStats: {
                perfectRuns: this._playerStats.perfectRuns,
                collectedRelics: Array.from(this._playerStats.collectedRelics),
                timeRecords: Array.from(this._playerStats.timeRecords.entries()),
                usedElements: Array.from(this._playerStats.usedElements),
                secretSequence: this._playerStats.secretSequence
            }
        };
        
        // In a real implementation, this would use proper save system
        console.log('Progress saved:', saveData);
    }
    
    private loadUnlockProgress(): void {
        // Load progress from save system
        // For now, just initialize empty state
        console.log('Unlock progress loaded');
    }
    
    // Public accessors
    public getEliteConfig(eliteType: EliteType): EliteConfig | undefined {
        return this._eliteConfigs.get(eliteType);
    }
    
    public getHiddenBossConfig(bossType: HiddenBossType): HiddenBossConfig | undefined {
        return this._hiddenBossConfigs.get(bossType);
    }
    
    public isHiddenBossUnlocked(bossType: HiddenBossType): boolean {
        return this._unlockedHiddenBosses.has(bossType);
    }
    
    public getAllUnlockedHiddenBosses(): HiddenBossType[] {
        return Array.from(this._unlockedHiddenBosses);
    }
    
    public getPlayerStats() {
        return { ...this._playerStats };
    }
    
    // Helper methods for elite mechanics
    private addShieldEffect(brick: EnhancedBrick, duration: number): void {
        // Add visual shield effect and temporary damage immunity
        console.log(`Adding shield to brick ${brick.node.name} for ${duration}ms`);
        // Implementation would add particle effect and modify damage handling
    }
    
    private addTimePressureEffect(speedMultiplier: number): void {
        // Add visual indicators for increased speed/pressure
        console.log(`Time pressure effect: ${speedMultiplier}x speed`);
        // Implementation would add screen effects, UI warnings
    }
    
    private addRegenerationEffect(brick: EnhancedBrick): void {
        // Add healing particle effect
        console.log(`Regenerating brick ${brick.node.name}`);
        // Implementation would show green healing particles
    }
    
    private applyElementalEffect(element: string, position: {x: number, y: number}, radius: number, difficulty: number): void {
        console.log(`Applying ${element} effect at (${position.x}, ${position.y}) with radius ${radius}`);
        
        // Find all bricks and balls within radius
        const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
        const allBalls = this.node.parent?.getComponentsInChildren(EnhancedBall) || [];
        
        // Apply effects based on element type
        [...allBricks, ...allBalls].forEach(target => {
            const distance = Math.sqrt(
                Math.pow(target.node.position.x - position.x, 2) + 
                Math.pow(target.node.position.y - position.y, 2)
            );
            
            if (distance <= radius) {
                switch (element) {
                    case 'fire':
                        // Apply fire damage over time
                        this.applyBurnEffect(target, difficulty * 2, 3000);
                        break;
                    case 'ice':
                        // Apply slow effect
                        this.applyFreezeEffect(target, 0.5, 2000);
                        break;
                    case 'electric':
                        // Apply chain lightning
                        this.applyElectricEffect(target, difficulty, radius);
                        break;
                    case 'poison':
                        // Apply poison damage
                        this.applyPoisonEffect(target, difficulty, 4000);
                        break;
                }
            }
        });
    }
    
    private applyGravityChange(newGravity: {x: number, y: number}, duration: number): void {
        console.log(`Changing gravity to (${newGravity.x}, ${newGravity.y}) for ${duration}ms`);
        // Implementation would access physics world and change gravity
    }
    
    private showGravityChangeEffect(gravity: {x: number, y: number}): void {
        console.log(`Showing gravity change effect for direction (${gravity.x}, ${gravity.y})`);
        // Implementation would show directional arrows and visual effects
    }
    
    private applyTimeScale(timeScale: number, duration: number): void {
        console.log(`Changing time scale to ${timeScale} for ${duration}ms`);
        // Implementation would affect all scheduled actions and animations
    }
    
    private showTimeDistortionEffect(timeScale: number): void {
        console.log(`Showing time distortion effect: ${timeScale}x speed`);
        // Implementation would add visual warping effects
    }
    
    private makePhaseShifted(brick: EnhancedBrick, duration: number): void {
        console.log(`Making brick ${brick.node.name} phase-shifted for ${duration}ms`);
        // Implementation would disable collider and add transparency effect
        const collider = brick.getComponent('Collider2D');
        if (collider) {
            collider.enabled = false;
            this.scheduleOnce(() => {
                if (collider && brick.node.isValid) {
                    collider.enabled = true;
                }
            }, duration / 1000);
        }
    }
    
    private createMagneticField(x: number, y: number, strength: number, duration: number): void {
        console.log(`Creating magnetic field at (${x}, ${y}) with strength ${strength} for ${duration}ms`);
        // Implementation would create invisible node that affects nearby balls
    }
    
    private getDistance(pos1: any, pos2: any): number {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    }
    
    private createShieldNetwork(network: EnhancedBrick[], difficulty: number): void {
        console.log(`Creating shield network with ${network.length} bricks`);
        // Implementation would create shared damage reduction system
    }
    
    private getAdjacentBricks(centerBrick: EnhancedBrick, allBricks: EnhancedBrick[], maxDistance: number): EnhancedBrick[] {
        return allBricks.filter(brick => {
            if (brick === centerBrick || !brick.node.active) return false;
            const distance = this.getDistance(centerBrick.node.position, brick.node.position);
            return distance <= maxDistance;
        });
    }
    
    private corruptToVoid(brick: EnhancedBrick): void {
        console.log(`Corrupting brick ${brick.node.name} to void type`);
        brick.brickType = BrickType.VOID;
        // Implementation would change brick appearance and behavior
    }
    
    private applyBurnEffect(target: any, damage: number, duration: number): void {
        console.log(`Applying burn effect: ${damage} damage over ${duration}ms`);
        // Implementation would apply damage over time
    }
    
    private applyFreezeEffect(target: any, slowFactor: number, duration: number): void {
        console.log(`Applying freeze effect: ${slowFactor}x speed for ${duration}ms`);
        // Implementation would reduce movement/animation speed
    }
    
    private applyElectricEffect(target: any, damage: number, radius: number): void {
        console.log(`Applying electric effect: ${damage} damage with ${radius} chain radius`);
        // Implementation would create chain lightning to nearby targets
    }
    
    private applyPoisonEffect(target: any, damage: number, duration: number): void {
        console.log(`Applying poison effect: ${damage} damage over ${duration}ms`);
        // Implementation would apply continuous poison damage
    }
}