import { _decorator, Component, Node, Prefab, instantiate, Vec3, director } from 'cc';
// import { GameManager, GameState } from './GameManager';  // 移除循环依赖
import { BossController } from '../managers/BossController';

const { ccclass, property } = _decorator;

export enum LevelType {
    NORMAL = 'NORMAL',
    BOSS = 'BOSS',
    ELITE = 'ELITE',
    TIME_ATTACK = 'TIME_ATTACK'
}

export enum DifficultyTier {
    EASY = 'EASY',
    NORMAL = 'NORMAL', 
    HARD = 'HARD',
    EXPERT = 'EXPERT',
    NIGHTMARE = 'NIGHTMARE'
}

@ccclass('LevelManager')
export class LevelManager extends Component {
    @property
    public pressureMoveSpeed: number = 10.0; // Speed at which bricks move down
    
    @property
    public pressureStartDelay: number = 30.0; // Seconds before pressure begins
    
    @property
    public pressureAcceleration: number = 1.5; // Speed multiplier per level
    
    @property(Prefab)
    public bossPrefab: Prefab | null = null;
    
    @property(Node)
    public brickContainer: Node | null = null;
    
    private static _instance: LevelManager | null = null;
    private _pressureTimer: number = 0;
    private _pressureActive: boolean = false;
    private _currentLevelType: LevelType = LevelType.NORMAL;
    private _bossNode: Node | null = null;
    private _levelStartTime: number = 0;
    private _currentLevel: number = 1;
    private _currentChapter: number = 1;
    private _currentDifficulty: number = 1;
    
    public static getInstance(): LevelManager | null {
        return LevelManager._instance;
    }
    
    protected onLoad(): void {
        if (LevelManager._instance === null) {
            LevelManager._instance = this;
        }
    }
    
    protected onDestroy(): void {
        if (LevelManager._instance === this) {
            LevelManager._instance = null;
        }
    }
    
    protected start(): void {
        this.initializeLevel();
    }
    
    protected update(dt: number): void {
        this.updatePressureSystem(dt);
    }
    
    public initializeLevel(): void {
        this._levelStartTime = director.getTotalTime();
        this._pressureTimer = 0;
        this._pressureActive = false;
        
        const gameManager = GameManager.getInstance();
        if (!gameManager) return;
        
        const currentLevel = gameManager.getLevel();
        this._currentLevelType = this.determineLevelType(currentLevel);
        
        console.log(`Starting ${this._currentLevelType} level ${currentLevel}`);
        
        if (this._currentLevelType === LevelType.BOSS) {
            this.setupBossLevel();
        } else {
            this.setupNormalLevel();
        }
    }
    
    private determineLevelType(level: number): LevelType {
        // Boss levels every 10 levels
        if (level % 10 === 0) {
            return LevelType.BOSS;
        }
        
        // Elite levels every 5 levels (but not boss levels)
        if (level % 5 === 0) {
            return LevelType.ELITE;
        }
        
        // Time attack levels occasionally
        if (level > 5 && Math.random() < 0.15) {
            return LevelType.TIME_ATTACK;
        }
        
        return LevelType.NORMAL;
    }
    
    private setupBossLevel(): void {
        // Clear existing bricks for boss fight
        this.clearAllBricks();
        
        // Spawn boss
        this.spawnBoss();
        
        // No pressure system during boss fights
        this._pressureActive = false;
    }
    
    private setupNormalLevel(): void {
        // Enable pressure system for normal levels
        this._pressureActive = true;
        this._pressureTimer = this.pressureStartDelay;
    }
    
    private spawnBoss(): void {
        if (!this.bossPrefab) {
            console.error('Boss prefab not assigned!');
            return;
        }
        
        this._bossNode = instantiate(this.bossPrefab);
        this._bossNode.setPosition(0, 150, 0); // Position at top of screen
        
        // Configure boss based on level
        const bossScript = this._bossNode.getComponent(BossController);
        if (bossScript) {
            const gameManager = GameManager.getInstance();
            const level = gameManager ? gameManager.getLevel() : 1;
            
            // Scale boss health and damage with level
            const healthMultiplier = 1 + (level / 10);
            const damageMultiplier = 1 + (level / 20);
            
            bossScript.maxHealth = Math.floor(100 * healthMultiplier);
            bossScript.attackDamage = Math.floor(1 * damageMultiplier);
            bossScript.scoreValue = Math.floor(500 * healthMultiplier);
        }
        
        this.node.addChild(this._bossNode);
    }
    
    private updatePressureSystem(dt: number): void {
        if (!this._pressureActive || this._currentLevelType === LevelType.BOSS) {
            return;
        }
        
        this._pressureTimer -= dt;
        
        if (this._pressureTimer <= 0) {
            this.applyBrickPressure(dt);
        }
    }
    
    private applyBrickPressure(dt: number): void {
        if (!this.brickContainer) return;
        
        const gameManager = GameManager.getInstance();
        if (!gameManager) return;
        
        const level = gameManager.getLevel();
        const adjustedSpeed = this.pressureMoveSpeed * Math.pow(this.pressureAcceleration, level / 5);
        
        // Move all bricks down
        const children = this.brickContainer.children;
        let paddleHit = false;
        
        for (const child of children) {
            const currentPos = child.position;
            const newY = currentPos.y - adjustedSpeed * dt;
            child.setPosition(currentPos.x, newY, currentPos.z);
            
            // Check if bricks reached paddle level (danger zone)
            if (newY < -200 && !paddleHit) {
                paddleHit = true;
                this.onBricksReachPaddle();
            }
        }
    }
    
    private onBricksReachPaddle(): void {
        const gameManager = GameManager.getInstance();
        if (!gameManager) return;
        
        // Calculate damage based on remaining brick rows
        const remainingBricks = this.countRemainingBricks();
        const rowsRemaining = Math.ceil(remainingBricks / 8); // Assuming 8 bricks per row
        const damage = Math.max(1, rowsRemaining);
        
        console.log(`Bricks reached paddle! Taking ${damage} damage from ${rowsRemaining} rows`);
        gameManager.onCoreAttacked(damage);
        
        // Reset all bricks to higher position to continue pressure
        this.resetBrickPositions();
    }
    
    private resetBrickPositions(): void {
        if (!this.brickContainer) return;
        
        const children = this.brickContainer.children;
        for (const child of children) {
            const currentPos = child.position;
            child.setPosition(currentPos.x, currentPos.y + 100, currentPos.z);
        }
    }
    
    private countRemainingBricks(): number {
        if (!this.brickContainer) return 0;
        return this.brickContainer.children.length;
    }
    
    private clearAllBricks(): void {
        if (!this.brickContainer) return;
        
        const children = [...this.brickContainer.children];
        for (const child of children) {
            child.destroy();
        }
    }
    
    public getCurrentLevelType(): LevelType {
        return this._currentLevelType;
    }
    
    public isPressureActive(): boolean {
        return this._pressureActive;
    }
    
    public getPressureTimer(): number {
        return this._pressureTimer;
    }
    
    public onBossDefeated(): void {
        console.log('Boss defeated! Level complete!');
        
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            // Boss levels give extra rewards
            gameManager.onLevelComplete();
        }
    }
    
    public resetLevel(): void {
        this._pressureTimer = this.pressureStartDelay;
        this._pressureActive = false;
        
        if (this._bossNode && this._bossNode.isValid) {
            this._bossNode.destroy();
            this._bossNode = null;
        }
    }
    
    public adjustDifficulty(level: number): void {
        if (level < 0) return; // 处理无效参数
        
        this._currentDifficulty = level;
        // Adjust pressure system based on level
        const difficultyMultiplier = 1 + (level / 10);
        this.pressureMoveSpeed = 10 * difficultyMultiplier;
        this.pressureStartDelay = Math.max(15, 30 - level);
    }

    // 添加测试需要的方法
    public getCurrentDifficulty(): number {
        return this._currentDifficulty;
    }

    public setLevelType(levelType: LevelType): void {
        this._currentLevelType = levelType;
    }

    public setLevel(level: number): void {
        if (level < 1) return; // 处理无效参数
        this._currentLevel = level;
    }

    public getLevel(): number {
        return this._currentLevel;
    }

    public setChapter(chapter: number): void {
        if (chapter < 1) return; // 处理无效参数
        this._currentChapter = chapter;
        // 根据章节调整基础难度
        this._currentDifficulty = chapter;
    }

    public getChapter(): number {
        return this._currentChapter;
    }

    public setLevelConfiguration(config: any): void {
        if (!config) return;
        
        if (config.level) this.setLevel(config.level);
        if (config.chapter) this.setChapter(config.chapter);
        if (config.difficulty !== undefined) this._currentDifficulty = config.difficulty;
        if (config.levelType) this.setLevelType(config.levelType);
    }

    public getLevelConfiguration(): any {
        return {
            level: this._currentLevel,
            chapter: this._currentChapter,
            difficulty: this._currentDifficulty,
            levelType: this._currentLevelType
        };
    }

    public getCurrentLevelData(): any {
        return {
            level: this._currentLevel,
            chapter: this._currentChapter,
            difficulty: this._currentDifficulty,
            type: this._currentLevelType,
            pressureActive: this._pressureActive,
            pressureTimer: this._pressureTimer
        };
    }
}