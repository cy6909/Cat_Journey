import { _decorator, Component, Node, Prefab, instantiate, Vec3, director } from 'cc';
import { RelicManager } from '../managers/RelicManager';
import { LevelManager, LevelType } from './LevelManager';
import { CoreController } from '../managers/CoreController';
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

    public static getInstance(): GameManager | null {
        return GameManager._instance;
    }

    protected onLoad(): void {
        if (GameManager._instance === null) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);
        } else {
            this.node.destroy();
            return;
        }
    }

    protected onDestroy(): void {
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }
    }

    protected start(): void {
        this.initializeGame();
        this.initializeCore();
        this.initializeLevelManager();
    }

    private initializeGame(): void {
        this.setState(GameState.PRE_START);
        this.createPaddle();
        this.createBall();
        this.setupLevel();
        this.scheduleOnce(() => {
            this.setState(GameState.PLAYING);
        }, 2.0);
    }

    private initializeCore(): void {
        if (this.coreNode) {
            this._coreController = this.coreNode.getComponent(CoreController);
            if (!this._coreController) {
                console.warn('CoreController not found on coreNode');
            }
        }
    }

    private initializeLevelManager(): void {
        this._levelManager = LevelManager.getInstance();
        if (!this._levelManager) {
            console.warn('LevelManager instance not found');
        }
    }

    private createPaddle(): void {
        try {
            if (!this.paddlePrefab) {
                console.warn('Paddle prefab not assigned - skipping paddle creation');
                return;
            }
            
            this._paddleNode = instantiate(this.paddlePrefab);
            if (this._paddleNode) {
                this._paddleNode.setPosition(0, -250, 0);
                this.node.addChild(this._paddleNode);
                console.log('Paddle created successfully');
            } else {
                console.error('Failed to instantiate paddle prefab');
            }
            
        } catch (error) {
            console.error('Error creating paddle:', error);
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
                this._ballNode.setPosition(0, -150, 0);
                this.node.addChild(this._ballNode);
                console.log('Ball created successfully');
            } else {
                console.error('Failed to instantiate ball prefab');
            }
            
        } catch (error) {
            console.error('Error creating ball:', error);
        }
    }

    private setupLevel(): void {
        this.clearBricks();
        
        if (this._levelManager) {
            this._levelManager.initializeLevel();
            
            const levelType = this._levelManager.getCurrentLevelType();
            if (levelType !== LevelType.BOSS) {
                const layout = this.getLevelLayout(this.level);
                this.createBricksFromLayout(layout);
            }
        } else {
            const layout = this.getLevelLayout(this.level);
            this.createBricksFromLayout(layout);
        }
    }

    private getLevelLayout(level: number): number[][] {
        const basicLayout = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
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

        const startX = -280;
        const startY = 200;
        const brickWidth = 80;
        const brickHeight = 40;
        const spacing = 10;

        for (let row = 0; row < layout.length; row++) {
            for (let col = 0; col < layout[row].length; col++) {
                const brickType = layout[row][col];
                if (brickType === 0) continue;

                const brick = instantiate(this.brickPrefab);
                const x = startX + col * (brickWidth + spacing);
                const y = startY - row * (brickHeight + spacing);
                
                brick.setPosition(x, y, 0);
                
                const brickScript = brick.getComponent('Brick');
                if (brickScript) {
                    (brickScript as any).setHealth(brickType);
                    
                    // Some bricks drop experience orbs
                    if (Math.random() < 0.1) { // 10% chance
                        (brickScript as any).setDropsExperience(true);
                    }
                }

                this.brickContainer.addChild(brick);
                this._bricks.push(brick);
            }
        }
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
            this.node.addChild(powerUpNode);
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
            const ballScript = this._ballNode.getComponent('Ball');
            if (ballScript) {
                (ballScript as any).resetBall();
            }
        }
    }

    private checkLevelComplete(): void {
        const levelType = this._levelManager ? this._levelManager.getCurrentLevelType() : LevelType.NORMAL;
        
        if (levelType === LevelType.BOSS) {
            // Boss levels complete when boss is defeated (handled in onBossDefeated)
            return;
        }
        
        this.onLevelComplete();
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