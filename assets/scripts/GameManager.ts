import { _decorator, Component, Node, Prefab, instantiate, Vec3, director } from 'cc';
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

    private createPaddle(): void {
        if (!this.paddlePrefab) return;
        
        this._paddleNode = instantiate(this.paddlePrefab);
        this._paddleNode.setPosition(0, -250, 0);
        this.node.addChild(this._paddleNode);
    }

    private createBall(): void {
        if (!this.ballPrefab) return;
        
        this._ballNode = instantiate(this.ballPrefab);
        this._ballNode.setPosition(0, -150, 0);
        this.node.addChild(this._ballNode);
    }

    private setupLevel(): void {
        this.clearBricks();
        const layout = this.getLevelLayout(this.level);
        this.createBricksFromLayout(layout);
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

    public onBrickDestroyed(scoreValue: number = 10, brickPosition?: Vec3): void {
        this.score += scoreValue;
        
        if (brickPosition && Math.random() < this.powerUpDropChance) {
            this.dropPowerUp(brickPosition);
        }
        
        this._bricks = this._bricks.filter(brick => brick && brick.isValid);
        
        if (this._bricks.length === 0) {
            this.onLevelComplete();
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
        
        if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
        } else {
            this.resetBall();
        }
    }

    private resetBall(): void {
        if (this._ballNode) {
            const ballScript = this._ballNode.getComponent('Ball');
            if (ballScript) {
                (ballScript as any).resetBall();
            }
        }
    }

    private onLevelComplete(): void {
        this.setState(GameState.LEVEL_COMPLETE);
        this.level++;
        
        this.scheduleOnce(() => {
            this.setupLevel();
            this.setState(GameState.PLAYING);
        }, 2.0);
    }

    public setState(newState: GameState): void {
        this._currentState = newState;
        console.log(`Game State Changed: ${newState}`);
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
}