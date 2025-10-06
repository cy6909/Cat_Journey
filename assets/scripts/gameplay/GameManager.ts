import { _decorator, Component, Node, Prefab, instantiate, Vec3, director, Color, Sprite, PhysicsSystem2D, input, Input, EventKeyboard, KeyCode, Vec2 } from 'cc';
import { RelicManager } from '../managers/RelicManager';
import { LevelManager, LevelType } from './LevelManager';
import { CoreController } from '../managers/CoreController';
import { DifficultyCalculator, DifficultyConfig, BrickDistribution } from './DifficultySystem';
import { LayoutGenerator, BrickData } from './LayoutGenerator';
import { BrickType } from './EnhancedBrick';
// import { RuntimeDebugPanel } from '../debug/RuntimeDebugPanel';
const { ccclass, property } = _decorator;

export enum GameState {
    PRE_START = 'PRE_START',
    PLAYING = 'PLAYING',
    LEVEL_COMPLETE = 'LEVEL_COMPLETE',
    GAME_OVER = 'GAME_OVER'
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    public brickPrefab: Prefab | null = null;

    @property(Prefab)
    public paddlePrefab: Prefab | null = null;

    @property(Prefab)
    public ballPrefab: Prefab | null = null;

    @property(Prefab)
    public multiBallPowerUpPrefab: Prefab | null = null;

    @property(Prefab)
    public laserPaddlePowerUpPrefab: Prefab | null = null;

    @property(Prefab)
    public wallPrefab: Prefab | null = null;

    @property(Prefab)
    public deathZonePrefab: Prefab | null = null;

    @property
    public powerUpDropChance: number = 0.2;

    @property(Node)
    public brickContainer: Node | null = null;

    @property(Node)
    public coreNode: Node | null = null;

    @property(Prefab)
    public experienceOrbPrefab: Prefab | null = null;

    @property
    public lives: number = 3;

    @property
    public score: number = 0;

    @property
    public level: number = 1;

    private static _instance: GameManager | null = null;
    private _currentState: GameState = GameState.PRE_START;
    private _bricks: Node[] = [];
    private _ballNode: Node | null = null;
    private _paddleNode: Node | null = null;
    private _coreController: CoreController | null = null;
    private _levelManager: LevelManager | null = null;
    private _currentDifficulty: DifficultyConfig | null = null;
    private _brickDistribution: BrickDistribution | null = null;

    public static getInstance(): GameManager | null {
        return GameManager._instance;
    }

    protected onLoad(): void {
        console.log('🎮 GameManager onLoad called');
        if (GameManager._instance === null) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);

            // 添加键盘监听用于测试BallType切换
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            console.log('✅ GameManager: Keyboard listener registered for ball type switching');
            console.log('✅ GameManager instance created and keyboard listener active');
        } else {
            console.log('⚠️ GameManager instance already exists, destroying duplicate');
            this.node.destroy();
            return;
        }
    }

    protected onDestroy(): void {
        if (GameManager._instance === this) {
            GameManager._instance = null;
            // 移除键盘监听
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    }

    protected start(): void {
        console.log('🎮 GameManager start called');
        this.initializeGame();
        this.initializeCore();
        // this.initializeLevelManager(); // 暂时注释掉

        // 🔧 测试：添加全局键盘监听
        window.addEventListener('keydown', (e) => {
            console.log('🌐 Window keydown event:', e.key, e.code, e.keyCode);
            if (e.code === 'Space' || e.keyCode === 32) {
                console.log('🔑 SPACE detected via window listener');
                this.cycleBallType();
            }
        });
        console.log('🔧 Added window.addEventListener for keyboard testing');
    }
    
    private onKeyDown(event: EventKeyboard): void {
        console.log('⌨️ Key pressed:', event.keyCode, 'SPACE keyCode:', KeyCode.SPACE);

        switch (event.keyCode) {
            case KeyCode.SPACE:
                // 空格键：切换Ball类型来验证25种颜色
                console.log('🔑 SPACE key detected, attempting to cycle ball type...');
                this.cycleBallType();
                break;
            default:
                console.log('Other key pressed:', event.keyCode);
                break;
        }
    }

    private cycleBallType(): void {
        if (this._ballNode) {
            console.log('Ball node exists:', this._ballNode.name);

            // 尝试获取EnhancedBall组件
            let ballScript = this._ballNode.getComponent('EnhancedBall');

            // 如果没有EnhancedBall，尝试获取Ball组件
            if (!ballScript) {
                console.log('EnhancedBall not found, trying Ball component...');
                ballScript = this._ballNode.getComponent('Ball');
            }

            if (ballScript) {
                console.log('Ball script found:', ballScript.constructor.name);

                // 检查是否有cycleToNextBallType方法
                if (typeof (ballScript as any).cycleToNextBallType === 'function') {
                    console.log('✅ Calling cycleToNextBallType()');
                    (ballScript as any).cycleToNextBallType();
                } else {
                    console.warn('❌ Ball script does not have cycleToNextBallType method');
                    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ballScript)));
                }
            } else {
                console.error('❌ No ball script found on ball node');
                console.log('Ball node components:', this._ballNode.components.map(c => c.constructor.name));
            }
        } else {
            console.error('❌ Ball node is null, ballNode value:', this._ballNode);
        }
    }

    private initializeGame(): void {
        this.setState(GameState.PRE_START);
        
        // 关闭物理调试显示
        PhysicsSystem2D.instance.debugDrawFlags = 0; 
        // 设置物理系统重力为0 - Breakout游戏不需要重力！
        PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
        console.log('Physics system: Debug draw disabled, gravity set to 0');
        
        this.createBoundaryWalls();
        this.createPaddle();
        
        // 延迟创建Ball，确保Paddle完全初始化
        this.scheduleOnce(() => {
            this.createBallBasedOnPaddle();
        }, 0.1);
        
        this.setupLevel();
        // this.createDebugPanel(); // 暂时注释掉，先修复场景加载问题
        
        // Ball现在由鼠标点击控制发射，不需要自动延迟发射
        this.setState(GameState.PLAYING);
    }

    private initializeCore(): void {
        if (this.coreNode) {
            this._coreController = this.coreNode.getComponent(CoreController);
            if (!this._coreController) {
                console.warn('CoreController not found on coreNode');
            }
        }
    }

    /*
    private initializeLevelManager(): void {
        this._levelManager = LevelManager.getInstance();
        if (!this._levelManager) {
            console.warn('LevelManager instance not found');
        }
    }
    */

    private createPaddle(): void {
        try {
            if (!this.paddlePrefab) {
                console.warn('Paddle prefab not assigned - skipping paddle creation');
                return;
            }
            
            this._paddleNode = instantiate(this.paddlePrefab);
            if (this._paddleNode) {
                this._paddleNode.setPosition(0, -300, 0);
                // 统一添加到Canvas下
                const canvas = this.node.parent;
                if (canvas) {
                    canvas.addChild(this._paddleNode);
                    console.log('Paddle created successfully and added to Canvas');
                } else {
                    this.node.addChild(this._paddleNode);
                    console.log('Paddle created successfully and added to GameManager');
                }
            } else {
                console.error('Failed to instantiate paddle prefab');
            }
            
        } catch (error) {
            console.error('Error creating paddle:', error);
        }
    }

    private createBallBasedOnPaddle(): void {
        try {
            if (!this.ballPrefab) {
                console.warn('Ball prefab not assigned - skipping ball creation');
                return;
            }
            
            if (!this._paddleNode) {
                console.error('Cannot create ball - paddle not found');
                return;
            }
            
            // 获取Paddle的实际位置
            const paddlePos = this._paddleNode.position;
            console.log(`Paddle actual position: (${paddlePos.x}, ${paddlePos.y}, ${paddlePos.z})`);
            
            this._ballNode = instantiate(this.ballPrefab);
            if (this._ballNode) {
                // Ball位置基于Paddle实际位置，上方20像素
                const ballPos = new Vec3(paddlePos.x, paddlePos.y + 20, paddlePos.z);
                this._ballNode.setPosition(ballPos);
                
                console.log(`Ball positioned at: (${ballPos.x}, ${ballPos.y}, ${ballPos.z})`);
                
                // 将Ball添加到Canvas下，与Paddle同级
                const canvas = this.node.parent;
                if (canvas) {
                    canvas.addChild(this._ballNode);
                    console.log('Ball created successfully and added to Canvas');
                } else {
                    this.node.addChild(this._ballNode);
                    console.log('Ball created successfully and added to GameManager');
                }
                
                // 通知Ball找到Paddle引用
                const ballScript = this._ballNode.getComponent('EnhancedBall') || this._ballNode.getComponent('Ball');
                if (ballScript && typeof (ballScript as any).setPaddleReference === 'function') {
                    (ballScript as any).setPaddleReference(this._paddleNode);
                }
            } else {
                console.error('Failed to instantiate ball prefab');
            }
            
        } catch (error) {
            console.error('Error creating ball based on paddle:', error);
        }
    }

    private createBall(): void {
        try {
            if (!this.ballPrefab) {
                console.warn('Ball prefab not assigned - skipping ball creation');
                return;
            }
            
            this._ballNode = instantiate(this.ballPrefab);
            if (this._ballNode) {
                this._ballNode.setPosition(0, -250, 0); // 与跟随逻辑一致：-300 + 50 = -250
                // 将Ball添加到Canvas下，而不是GameManager下
                const canvas = this.node.parent;
                if (canvas) {
                    canvas.addChild(this._ballNode);
                    console.log('Ball created successfully and added to Canvas');
                } else {
                    this.node.addChild(this._ballNode);
                    console.log('Ball created successfully and added to GameManager');
                }
            } else {
                console.error('Failed to instantiate ball prefab');
            }
            
        } catch (error) {
            console.error('Error creating ball:', error);
        }
    }

    private createBoundaryWalls(): void {
        try {
            if (!this.wallPrefab) {
                console.warn('Wall prefab not assigned - skipping boundary creation');
                return;
            }

            // Screen boundaries for 640x960 portrait: left=-320, right=+320, top=+480, bottom=-480
            const canvas = this.node.parent;
            const parentNode = canvas || this.node;
            
            // Left wall
            const leftWall = instantiate(this.wallPrefab);
            leftWall.setPosition(-325, 0, 0); // 竖屏左边界
            leftWall.setScale(1, 10, 1); // 高一些适应竖屏
            const leftSprite = leftWall.getComponent(Sprite);
            if (leftSprite) {
                leftSprite.color = new Color(255, 0, 0, 128);
            }
            parentNode.addChild(leftWall);

            // Right wall  
            const rightWall = instantiate(this.wallPrefab);
            rightWall.setPosition(325, 0, 0); // 竖屏右边界
            rightWall.setScale(1, 10, 1);
            const rightSprite = rightWall.getComponent(Sprite);
            if (rightSprite) {
                rightSprite.color = new Color(255, 0, 0, 128);
            }
            parentNode.addChild(rightWall);

            // Top wall
            const topWall = instantiate(this.wallPrefab);
            topWall.setPosition(0, 485, 0); // 竖屏上边界
            topWall.setScale(7, 1, 1); // 宽一些覆盖竖屏宽度
            const topSprite = topWall.getComponent(Sprite);
            if (topSprite) {
                topSprite.color = new Color(0, 255, 0, 128);
            }
            parentNode.addChild(topWall);

            // Bottom wall
            const bottomWall = instantiate(this.wallPrefab);
            bottomWall.setPosition(0, -485, 0); // 竖屏下边界
            bottomWall.setScale(7, 1, 1);
            const bottomSprite = bottomWall.getComponent(Sprite);
            if (bottomSprite) {
                bottomSprite.color = new Color(0, 0, 255, 128);
            }
            parentNode.addChild(bottomWall);

            console.log('Boundary walls created successfully');
        } catch (error) {
            console.error('Error creating boundary walls:', error);
        }
    }

    /*
    private createDebugPanel(): void {
        try {
            // 创建调试面板节点
            const debugNode = new Node('RuntimeDebugPanel');
            const debugPanel = debugNode.addComponent(RuntimeDebugPanel);
            
            // 添加到Canvas下，确保在UI层次结构中
            const canvas = this.node.parent;
            if (canvas) {
                canvas.addChild(debugNode);
                console.log('✅ Runtime debug panel created and added to Canvas');
            } else {
                this.node.addChild(debugNode);
                console.log('✅ Runtime debug panel created and added to GameManager');
            }
        } catch (error) {
            console.error('Error creating debug panel:', error);
        }
    }
    */

    private launchBall(): void {
        if (this._ballNode) {
            const ballScript = this._ballNode.getComponent('EnhancedBall') || this._ballNode.getComponent('Ball');
            if (ballScript && typeof (ballScript as any).launch === 'function') {
                (ballScript as any).launch();
                console.log('Ball launched after physics initialization');
            } else {
                console.warn('Ball script not found or launch method not available');
            }
        } else {
            console.warn('Ball node not found, cannot launch');
        }
    }

    private setupLevel(): void {
        console.log(`🎯 SetupLevel called - Level ${this.level}`);

        // 计算当前关卡难度
        this._currentDifficulty = DifficultyCalculator.calculateDifficulty(this.level);
        this._brickDistribution = DifficultyCalculator.getBrickDistribution();

        console.log('📊 Difficulty config:', DifficultyCalculator.formatConfig(this._currentDifficulty));

        // 清除旧砖块
        this.clearBricks();

        // 使用新的布局生成系统
        const brickData = LayoutGenerator.generateLayout(this._currentDifficulty);
        this.createBricksFromData(brickData);
    }

    /**
     * 从BrickData数组创建砖块 - 替代旧的createBricksFromLayout
     */
    private createBricksFromData(brickDataArray: BrickData[]): void {
        if (!this.brickPrefab || !this.brickContainer || !this._currentDifficulty) {
            console.error('Missing prefab, container, or difficulty config');
            return;
        }

        const config = this._currentDifficulty;

        // 基于真实砖块尺寸计算布局
        const wallInnerBoundary = 310; // 墙壁内边界 (325 wall - 15 safety margin)
        const actualBrickWidth = 80 * 0.625;  // 50像素实际宽度
        const actualBrickHeight = 30 * 0.625; // 18.75像素实际高度
        const spacing = 4;  // 间距

        // 计算可用宽度和实际可放置的列数
        const availableWidth = wallInnerBoundary * 2; // 左右各310，总共620
        let finalCols = config.gridCols;
        let finalTotalWidth = finalCols * actualBrickWidth + (finalCols - 1) * spacing;

        // 如果砖块网格超出边界，减少列数
        while (finalTotalWidth > availableWidth && finalCols > 1) {
            finalCols--;
            finalTotalWidth = finalCols * actualBrickWidth + (finalCols - 1) * spacing;
        }

        // 过滤掉超出列数的砖块
        const filteredBricks = finalCols < config.gridCols
            ? brickDataArray.filter(brick => brick.col < finalCols)
            : brickDataArray;

        const startX = -finalTotalWidth / 2 + actualBrickWidth / 2;
        const startY = 300;

        console.log(`📦 Creating ${filteredBricks.length} bricks from ${config.gridRows}x${finalCols} grid (available width: ${availableWidth}, used: ${finalTotalWidth.toFixed(1)})`);

        // 应用难度系统: 随机分配特殊砖块类型
        this.applyDifficultyToBricks(filteredBricks);

        for (const data of filteredBricks) {
            const brick = instantiate(this.brickPrefab);
            const x = startX + data.col * (actualBrickWidth + spacing);
            const y = startY - data.row * (actualBrickHeight + spacing);

            brick.setPosition(x, y, 0);
            brick.setScale(0.625, 0.625, 1);

            // 配置砖块类型和生命值
            const brickScript = brick.getComponent('EnhancedBrick') || brick.getComponent('Brick');
            if (brickScript) {
                // 先设置类型
                (brickScript as any).brickType = data.type;

                // 调用initializeBrickType初始化颜色和默认属性
                if (typeof (brickScript as any).initializeBrickType === 'function') {
                    (brickScript as any).initializeBrickType();
                }

                // 检查是否需要覆盖生命值 (只覆盖不硬编码生命值的类型)
                const typesWithHardcodedHealth = [1, 5, 14, 21]; // REINFORCED, REGENERATING, SHIELD, METAL
                if (!typesWithHardcodedHealth.includes(data.type)) {
                    // 对于其他类型，使用难度系统计算的生命值
                    (brickScript as any).health = data.health;
                    (brickScript as any)._maxHealth = data.health;
                }
            }

            this.brickContainer.addChild(brick);
            this._bricks.push(brick);
        }

        console.log(`✅ Created ${this._bricks.length} bricks successfully`);
    }

    /**
     * 应用难度配置到砖块数据 - 根据概率分配特殊砖块类型
     */
    private applyDifficultyToBricks(brickDataArray: BrickData[]): void {
        if (!this._currentDifficulty || !this._brickDistribution) return;

        const config = this._currentDifficulty;
        const dist = this._brickDistribution;

        // 记录已使用的reactive砖块位置
        const reactiveBricks: { row: number, col: number }[] = [];

        for (const brick of brickDataArray) {
            let finalType = brick.type;

            // 1. 检查是否应该是有益砖块
            if (Math.random() < config.beneficialBrickChance) {
                finalType = DifficultyCalculator.selectBrickTypeByWeight(
                    dist.beneficial.types,
                    dist.beneficial.weights
                );
            }
            // 2. 检查是否应该是减益砖块
            else if (Math.random() < config.harmfulBrickChance) {
                finalType = DifficultyCalculator.selectBrickTypeByWeight(
                    dist.harmful.types,
                    dist.harmful.weights
                );
            }
            // 3. 检查是否应该是爆炸性砖块
            else if (Math.random() < dist.reactive.chance) {
                // 检查与其他reactive砖块的距离
                let tooClose = false;
                for (const pos of reactiveBricks) {
                    const distance = Math.abs(brick.row - pos.row) + Math.abs(brick.col - pos.col);
                    if (distance < dist.reactive.minDistance) {
                        tooClose = true;
                        break;
                    }
                }

                if (!tooClose) {
                    finalType = dist.reactive.types[Math.floor(Math.random() * dist.reactive.types.length)];
                    reactiveBricks.push({ row: brick.row, col: brick.col });
                }
            }

            brick.type = finalType;
        }

        console.log(`🎲 Applied difficulty: ${reactiveBricks.length} reactive bricks placed`);
    }

    /**
     * 公开方法 - 供DevTools调用，加载指定关卡
     */
    public loadLevel(level: number, customConfig?: DifficultyConfig): void {
        console.log(`🔄 Loading level ${level}${customConfig ? ' with custom config' : ''}`);

        this.level = level;

        if (customConfig) {
            this._currentDifficulty = customConfig;
        }

        this.setupLevel();
    }

    private getLevelLayout(level: number): number[][] {
        // 已废弃 - 保留用于向后兼容
        // 更多砖块：从8x4增加到12x6，提升内容密度
        const basicLayout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        if (level > 1) {
            for (let row = 0; row < basicLayout.length; row++) {
                for (let col = 0; col < basicLayout[row].length; col++) {
                    if (Math.random() < 0.3) {
                        basicLayout[row][col] = 2;
                    }
                }
            }
        }

        return basicLayout;
    }

    private createBricksFromLayout(layout: number[][]): void {
        if (!this.brickPrefab || !this.brickContainer) return;

        // 基于真实砖块尺寸计算布局 - 消除缩放特殊情况
        const wallInnerBoundary = 320; // 墙壁内边界 (325-5)
        const actualBrickWidth = 80 * 0.625;  // 50像素实际宽度
        const actualBrickHeight = 40 * 0.625; // 25像素实际高度
        const spacing = 4;  // 减小间距适应更多砖块
        
        const cols = layout[0] ? layout[0].length : 0;
        const totalBrickArea = cols * actualBrickWidth + (cols - 1) * spacing;
        
        // 如果12列太宽，减少到10列
        let finalCols = cols;
        let finalLayout = layout;
        
        if (totalBrickArea > wallInnerBoundary * 2) {
            console.log(`12列太宽(${totalBrickArea})，减少到10列`);
            finalCols = 10;
            finalLayout = layout.map(row => row.slice(0, 10)); // 截取前10列
        }
        
        const finalTotalWidth = finalCols * actualBrickWidth + (finalCols - 1) * spacing;
        const startX = -finalTotalWidth / 2 + actualBrickWidth / 2;
        const startY = 300;
        
        console.log(`Creating ${finalLayout.length}x${finalCols} brick grid, total width: ${finalTotalWidth.toFixed(1)}, wall boundary: ±${wallInnerBoundary}`);

        for (let row = 0; row < finalLayout.length; row++) {
            for (let col = 0; col < finalCols; col++) {
                const brickType = finalLayout[row][col];
                if (brickType === 0) continue;

                const brick = instantiate(this.brickPrefab);
                const x = startX + col * (actualBrickWidth + spacing);
                const y = startY - row * (actualBrickHeight + spacing);
                
                brick.setPosition(x, y, 0);
                
                // 缩放砖块到新尺寸
                brick.setScale(0.625, 0.625, 1);
                
                // Use EnhancedBrick component with programmatic types
                const brickScript = brick.getComponent('EnhancedBrick') || brick.getComponent('Brick');
                if (brickScript) {
                    // Convert layout value to diverse brick types
                    const enhancedBrickType = this.getBrickTypeFromValue(brickType, row, col);
                    
                    if ((brickScript as any).brickType !== undefined) {
                        // EnhancedBrick system
                        (brickScript as any).brickType = enhancedBrickType;
                        // Trigger initialization after type assignment
                        if ((brickScript as any).initializeBrickType) {
                            (brickScript as any).initializeBrickType();
                        }
                    } else {
                        // Legacy Brick system fallback
                        (brickScript as any).setHealth(brickType);
                    }
                    
                    // Some bricks drop experience orbs
                    if (Math.random() < 0.1) { // 10% chance
                        (brickScript as any).setDropsExperience && (brickScript as any).setDropsExperience(true);
                    }
                }

                this.brickContainer.addChild(brick);
                this._bricks.push(brick);
            }
        }
        
        console.log(`Created ${this._bricks.length} bricks with diverse types`);
    }
    
    /**
     * Convert layout value to enhanced brick type with strategic diversity
     * 为每个砖块分配有意义的类型，而不是简单的随机化
     */
    private getBrickTypeFromValue(layoutValue: number, row: number, col: number): number {
        // Import BrickType enum values  
        const BrickType = {
            NORMAL: 0, REINFORCED: 1, EXPLOSIVE: 2, ELECTRIC: 3, EXPERIENCE: 4,
            REGENERATING: 5, PHASE: 6, MAGNETIC: 7, REFLECTIVE: 8, POISON: 9,
            ICE: 10, FIRE: 11, SPLITTING: 12, TELEPORT: 13, SHIELD: 14,
            GRAVITY: 15, TIME: 16, HEALING: 17, CURSED: 18, CRYSTAL: 19,
            RUBBER: 20, METAL: 21, VOID: 22, LIGHT: 23, DARK: 24
        };
        
        // Strategic brick placement based on position and level
        const totalPositions = (row * 8 + col); // Unique position identifier
        const levelDifficulty = this.level;
        
        // Base distribution: mostly normal bricks
        if (layoutValue === 1) {
            // Row-based strategy
            switch (row) {
                case 0: // Top row - defensive types
                    if (col % 3 === 0) return BrickType.SHIELD;
                    if (col % 4 === 1) return BrickType.REINFORCED;
                    return BrickType.NORMAL;
                    
                case 1: // Second row - special effects
                    if (col % 5 === 0) return BrickType.EXPLOSIVE;
                    if (col % 5 === 2) return BrickType.ELECTRIC;
                    if (col % 7 === 3) return BrickType.EXPERIENCE;
                    return BrickType.NORMAL;
                    
                case 2: // Third row - element effects
                    if (col % 4 === 0) return BrickType.FIRE;
                    if (col % 4 === 2) return BrickType.ICE;
                    if (col % 6 === 1) return BrickType.POISON;
                    return BrickType.NORMAL;
                    
                default: // Bottom rows - utility and rare types
                    if (col === 0 || col === 7) return BrickType.HEALING; // Corner healing
                    if (totalPositions % 11 === 0) return BrickType.TELEPORT;
                    if (totalPositions % 13 === 0) return BrickType.CRYSTAL;
                    return BrickType.NORMAL;
            }
        }
        
        // Enhanced bricks for higher layout values
        if (layoutValue === 2) {
            const rareTypes = [
                BrickType.GRAVITY, BrickType.TIME, BrickType.VOID, 
                BrickType.METAL, BrickType.PHASE, BrickType.MAGNETIC
            ];
            
            // Add level scaling for rare types
            if (levelDifficulty > 2) {
                const typeIndex = (totalPositions + levelDifficulty) % rareTypes.length;
                return rareTypes[typeIndex];
            } else {
                // Early levels: safer special types
                const earlySpecial = [BrickType.REINFORCED, BrickType.EXPERIENCE, BrickType.HEALING];
                return earlySpecial[totalPositions % earlySpecial.length];
            }
        }
        
        return BrickType.NORMAL;
    }

    private clearBricks(): void {
        this._bricks.forEach(brick => {
            if (brick && brick.isValid) {
                brick.destroy();
            }
        });
        this._bricks = [];
    }

    public onBrickDestroyed(scoreValue: number = 10, brickPosition?: Vec3, dropsExperience: boolean = false): void {
        this.score += scoreValue;
        
        if (brickPosition) {
            // Drop power-ups
            if (Math.random() < this.powerUpDropChance) {
                this.dropPowerUp(brickPosition);
            }
            
            // Drop experience orbs
            if (dropsExperience) {
                this.dropExperienceOrb(brickPosition);
            }
        }
        
        this._bricks = this._bricks.filter(brick => brick && brick.isValid);
        
        if (this._bricks.length === 0) {
            this.checkLevelComplete();
        }
    }

    private dropPowerUp(position: Vec3): void {
        const powerUps = [this.multiBallPowerUpPrefab, this.laserPaddlePowerUpPrefab];
        const availablePowerUps = powerUps.filter(prefab => prefab !== null);
        
        if (availablePowerUps.length === 0) return;
        
        const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
        if (randomPowerUp) {
            const powerUpNode = instantiate(randomPowerUp);
            powerUpNode.setPosition(position);
            
            // Add to Canvas for consistent coordinate system
            const canvas = this.node.parent;
            if (canvas) {
                canvas.addChild(powerUpNode);
                console.log('PowerUp dropped and added to Canvas');
            } else {
                this.node.addChild(powerUpNode);
                console.log('PowerUp dropped and added to GameManager');
            }
        }
    }

    public onBallLost(): void {
        this.lives--;
        
        // Ball hitting core also deals damage
        if (this._coreController) {
            this._coreController.takeDamage(1, 'Ball lost');
        }
        
        if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
        } else {
            this.resetBall();
        }
    }
    
    public onCoreAttacked(damage: number): void {
        console.log(`Core attacked for ${damage} damage`);
        
        if (this._coreController) {
            this._coreController.takeDamage(damage, 'External attack');
        }
    }
    
    public onCoreDestroyed(): void {
        console.log('Core destroyed! Immediate game over!');
        this.lives = 0;
        this.setState(GameState.GAME_OVER);
    }
    
    public onBossDefeated(scoreValue: number): void {
        console.log(`Boss defeated! Awarded ${scoreValue} points`);
        this.score += scoreValue;
        
        // Boss defeat triggers level completion
        this.onLevelComplete();
    }
    
    private dropExperienceOrb(position: Vec3): void {
        if (!this.experienceOrbPrefab) return;
        
        const orbNode = instantiate(this.experienceOrbPrefab);
        orbNode.setPosition(position);
        this.node.addChild(orbNode);
        console.log('Experience orb dropped');
    }

    private resetBall(): void {
        if (this._ballNode) {
            const ballScript = this._ballNode.getComponent('EnhancedBall') || this._ballNode.getComponent('Ball');
            if (ballScript && typeof (ballScript as any).resetBall === 'function') {
                (ballScript as any).resetBall();
            }
        }
    }

    private checkLevelComplete(): void {
        // 暂时简化：直接完成关卡，不检查Boss类型
        this.onLevelComplete();
        
        /*
        const levelType = this._levelManager ? this._levelManager.getCurrentLevelType() : LevelType.NORMAL;
        
        if (levelType === LevelType.BOSS) {
            // Boss levels complete when boss is defeated (handled in onBossDefeated)
            return;
        }
        
        this.onLevelComplete();
        */
    }

    public onLevelComplete(): void {
        this.setState(GameState.LEVEL_COMPLETE);
        this.level++;
        
        const relicManager = RelicManager.getInstance();
        if (relicManager) {
            relicManager.grantRandomRelic();
        }
        
        // Reset level manager for next level
        if (this._levelManager) {
            this._levelManager.resetLevel();
            this._levelManager.adjustDifficulty(this.level);
        }
        
        this.scheduleOnce(() => {
            this.setupLevel();
            this.setState(GameState.PLAYING);
        }, 3.0);
    }

    public setState(newState: GameState): void {
        try {
            if (!newState || typeof newState !== 'string') {
                console.warn('Invalid game state:', newState);
                return;
            }

            const validStates = Object.values(GameState);
            if (!validStates.includes(newState as GameState)) {
                console.warn('Unknown game state:', newState);
                return;
            }

            const oldState = this._currentState;
            this._currentState = newState;
            
            console.log(`Game State Changed: ${oldState} -> ${newState}`);
            
            // Handle state-specific logic
            this.onStateChanged(oldState, newState);
            
        } catch (error) {
            console.error('Error setting game state:', error);
        }
    }

    private onStateChanged(_oldState: GameState, newState: GameState): void {
        try {
            switch (newState) {
                case GameState.GAME_OVER:
                    this.handleGameOver();
                    break;
                case GameState.LEVEL_COMPLETE:
                    this.handleLevelComplete();
                    break;
                case GameState.PLAYING:
                    this.handleGamePlaying();
                    break;
            }
        } catch (error) {
            console.warn('Error in state change handler:', error);
        }
    }

    private handleGameOver(): void {
        console.log('Game Over - cleaning up resources');
        // Stop any ongoing animations or sounds
        // Save final score if needed
    }

    private handleLevelComplete(): void {
        console.log('Level Complete - preparing next level');
        // Award experience, update progression
    }

    private handleGamePlaying(): void {
        console.log('Game Playing - all systems active');
        // Ensure all game systems are ready
    }

    public getCurrentState(): GameState {
        return this._currentState;
    }

    public getBallPrefab(): Prefab | null {
        return this.ballPrefab;
    }

    public getScore(): number {
        return this.score;
    }

    public getLives(): number {
        return this.lives;
    }

    public getLevel(): number {
        return this.level;
    }

    // 添加测试期望的方法
    public getBrickCount(): number {
        return this._bricks.length;
    }

    public getBricks(): Node[] {
        return this._bricks;
    }

    public getBallNode(): Node | null {
        return this._ballNode;
    }

    public getPaddleNode(): Node | null {
        return this._paddleNode;
    }

    public getCoreController(): CoreController | null {
        return this._coreController;
    }

    public getLevelManager(): LevelManager | null {
        return this._levelManager;
    }

    public getGameState(): GameState {
        return this._currentState;
    }

    public addScore(points: number): void {
        this.score += points;
        console.log(`Score increased by ${points}. Total: ${this.score}`);
    }

    public decreaseLives(amount: number = 1): void {
        this.lives = Math.max(0, this.lives - amount);
        console.log(`Lives decreased by ${amount}. Remaining: ${this.lives}`);
        
        if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
        }
    }
}