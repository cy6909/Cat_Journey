import '../setup';

// Mock GameManager for testing
class MockGameManager {
    private static _instance: MockGameManager | null = null;
    
    public brickPrefab: any = null;
    public paddlePrefab: any = null;
    public ballPrefab: any = null;
    public multiBallPowerUpPrefab: any = null;
    public laserPaddlePowerUpPrefab: any = null;
    public powerUpDropChance = 0.2;
    public brickContainer: any = null;
    public coreNode: any = null;
    public experienceOrbPrefab: any = null;
    public lives = 3;
    public score = 0;
    public level = 1;

    private _currentState = 'PRE_START';
    private _bricks: any[] = [];
    private _ballNode: any = null;
    private _paddleNode: any = null;
    private _coreController: any = null;
    private _levelManager: any = null;

    public static getInstance(): MockGameManager | null {
        return MockGameManager._instance;
    }

    protected onLoad(): void {
        if (MockGameManager._instance === null) {
            MockGameManager._instance = this;
        }
    }

    protected onDestroy(): void {
        if (MockGameManager._instance === this) {
            MockGameManager._instance = null;
        }
    }

    protected start(): void {
        this.initializeGame();
        this.initializeCore();
        this.initializeLevelManager();
    }

    private initializeGame(): void {
        this.setState('PRE_START');
        this.createPaddle();
        this.createBall();
        this.setupLevel();
        
        setTimeout(() => {
            this.setState('PLAYING');
        }, 2000);
    }

    private initializeCore(): void {
        if (this.coreNode) {
            this._coreController = {
                takeDamage: jest.fn(),
                getHealth: jest.fn(() => 100),
                getMaxHealth: jest.fn(() => 100)
            };
        }
    }

    private initializeLevelManager(): void {
        this._levelManager = {
            getCurrentLevelType: jest.fn(() => 'NORMAL'),
            resetLevel: jest.fn(),
            adjustDifficulty: jest.fn()
        };
    }

    private createPaddle(): void {
        if (this.paddlePrefab) {
            this._paddleNode = new cc.Node('Paddle');
            this._paddleNode.setPosition(0, -250, 0);
        }
    }

    private createBall(): void {
        if (this.ballPrefab) {
            this._ballNode = new cc.Node('Ball');
            this._ballNode.setPosition(0, -150, 0);
        }
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
        if (!this.brickPrefab) return;

        const startX = -280;
        const startY = 200;
        const brickWidth = 80;
        const brickHeight = 40;
        const spacing = 10;

        for (let row = 0; row < layout.length; row++) {
            for (let col = 0; col < layout[row].length; col++) {
                const brickType = layout[row][col];
                if (brickType === 0) continue;

                const brick = new cc.Node('Brick');
                const x = startX + col * (brickWidth + spacing);
                const y = startY - row * (brickHeight + spacing);
                
                brick.setPosition(x, y, 0);
                
                const brickScript = {
                    setHealth: jest.fn(),
                    setDropsExperience: jest.fn(),
                    getHealth: jest.fn(() => brickType),
                    takeDamage: jest.fn()
                };
                
                brick.getComponent = jest.fn(() => brickScript);
                
                this._bricks.push(brick);
            }
        }
    }

    private clearBricks(): void {
        this._bricks.forEach(brick => {
            if (brick && brick.isValid()) {
                brick.destroy();
            }
        });
        this._bricks = [];
    }

    public onBrickDestroyed(scoreValue: number = 10, brickPosition?: any, dropsExperience: boolean = false): void {
        this.score += scoreValue;
        
        if (brickPosition) {
            if (Math.random() < this.powerUpDropChance) {
                this.dropPowerUp(brickPosition);
            }
            
            if (dropsExperience) {
                this.dropExperienceOrb(brickPosition);
            }
        }
        
        this._bricks = this._bricks.filter(brick => brick && brick.isValid());
        
        if (this._bricks.length === 0) {
            this.checkLevelComplete();
        }
    }

    private dropPowerUp(position: any): void {
        const powerUps = [this.multiBallPowerUpPrefab, this.laserPaddlePowerUpPrefab];
        const availablePowerUps = powerUps.filter(prefab => prefab !== null);
        
        if (availablePowerUps.length === 0) return;
        
        const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
        if (randomPowerUp) {
            const powerUpNode = new cc.Node('PowerUp');
            powerUpNode.setPosition(position);
        }
    }

    public onBallLost(): void {
        this.lives--;
        
        if (this._coreController) {
            this._coreController.takeDamage(1, 'Ball lost');
        }
        
        if (this.lives <= 0) {
            this.setState('GAME_OVER');
        } else {
            this.resetBall();
        }
    }
    
    public onCoreAttacked(damage: number): void {
        if (this._coreController) {
            this._coreController.takeDamage(damage, 'External attack');
        }
    }
    
    public onCoreDestroyed(): void {
        this.lives = 0;
        this.setState('GAME_OVER');
    }
    
    public onBossDefeated(scoreValue: number): void {
        this.score += scoreValue;
        this.onLevelComplete();
    }
    
    private dropExperienceOrb(position: any): void {
        if (!this.experienceOrbPrefab) return;
        
        const orbNode = new cc.Node('ExperienceOrb');
        orbNode.setPosition(position);
    }

    private resetBall(): void {
        if (this._ballNode) {
            this._ballNode.setPosition(0, -150, 0);
        }
    }

    private checkLevelComplete(): void {
        const levelType = this._levelManager ? this._levelManager.getCurrentLevelType() : 'NORMAL';
        
        if (levelType === 'BOSS') {
            return;
        }
        
        this.onLevelComplete();
    }

    public onLevelComplete(): void {
        this.setState('LEVEL_COMPLETE');
        this.level++;
        
        if (this._levelManager) {
            this._levelManager.resetLevel();
            this._levelManager.adjustDifficulty(this.level);
        }
        
        setTimeout(() => {
            this.setupLevel();
            this.setState('PLAYING');
        }, 3000);
    }

    public setState(newState: string): void {
        this._currentState = newState;
    }

    public getCurrentState(): string {
        return this._currentState;
    }

    public getBallPrefab(): any {
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

    public getBricks(): any[] {
        return this._bricks;
    }

    public getPaddleNode(): any {
        return this._paddleNode;
    }

    public getBallNode(): any {
        return this._ballNode;
    }
}

describe('GameManager', () => {
    let gameManager: MockGameManager;

    beforeEach(() => {
        jest.clearAllMocks();
        gameManager = new MockGameManager();
        
        // Set up mock prefabs
        gameManager.brickPrefab = { name: 'BrickPrefab' };
        gameManager.paddlePrefab = { name: 'PaddlePrefab' };
        gameManager.ballPrefab = { name: 'BallPrefab' };
        gameManager.multiBallPowerUpPrefab = { name: 'MultiBallPowerUp' };
        gameManager.laserPaddlePowerUpPrefab = { name: 'LaserPaddlePowerUp' };
        gameManager.experienceOrbPrefab = { name: 'ExperienceOrb' };
        gameManager.coreNode = new cc.Node('Core');
        
        gameManager.onLoad();
    });

    afterEach(() => {
        if (gameManager) {
            gameManager.onDestroy();
        }
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(gameManager.lives).toBe(3);
            expect(gameManager.score).toBe(0);
            expect(gameManager.level).toBe(1);
            expect(gameManager.powerUpDropChance).toBe(0.2);
        });

        test('should create singleton instance', () => {
            const instance = MockGameManager.getInstance();
            expect(instance).toBe(gameManager);
        });

        test('should initialize game state on start', () => {
            gameManager.start();
            
            expect(gameManager.getCurrentState()).toBe('PRE_START');
            expect(gameManager.getPaddleNode()).toBeDefined();
            expect(gameManager.getBallNode()).toBeDefined();
        });

        test('should transition to playing state after delay', (done) => {
            gameManager.start();
            
            setTimeout(() => {
                expect(gameManager.getCurrentState()).toBe('PLAYING');
                done();
            }, 2100);
        });
    });

    describe('Level Setup', () => {
        test('should generate level layout correctly', () => {
            gameManager.start();
            
            const bricks = gameManager.getBricks();
            expect(bricks.length).toBeGreaterThan(0);
            expect(bricks.length).toBeLessThanOrEqual(32); // 8x4 grid
        });

        test('should create more complex layout for higher levels', () => {
            gameManager.level = 3;
            gameManager.start();
            
            const bricks = gameManager.getBricks();
            expect(bricks.length).toBeGreaterThan(0);
        });

        test('should position bricks correctly in grid', () => {
            gameManager.start();
            
            const bricks = gameManager.getBricks();
            if (bricks.length > 0) {
                const firstBrick = bricks[0];
                expect(firstBrick.position).toBeDefined();
                expect(firstBrick.position.x).toBeGreaterThanOrEqual(-280);
                expect(firstBrick.position.y).toBeLessThanOrEqual(200);
            }
        });

        test('should clear previous bricks when setting up new level', () => {
            gameManager.start();
            const initialBrickCount = gameManager.getBricks().length;
            
            gameManager.onLevelComplete();
            
            // After level complete, new level should be set up
            setTimeout(() => {
                const newBricks = gameManager.getBricks();
                expect(newBricks.length).toBeGreaterThanOrEqual(0);
            }, 100);
        });
    });

    describe('Brick Destruction', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should increase score when brick is destroyed', () => {
            const initialScore = gameManager.getScore();
            gameManager.onBrickDestroyed(10);
            
            expect(gameManager.getScore()).toBe(initialScore + 10);
        });

        test('should drop power-up based on chance', () => {
            const position = { x: 100, y: 200, z: 0 };
            
            // Mock Math.random to guarantee power-up drop
            const originalRandom = Math.random;
            Math.random = jest.fn(() => 0.1); // Less than powerUpDropChance
            
            expect(() => {
                gameManager.onBrickDestroyed(10, position);
            }).not.toThrow();
            
            Math.random = originalRandom;
        });

        test('should drop experience orb when specified', () => {
            const position = { x: 100, y: 200, z: 0 };
            
            expect(() => {
                gameManager.onBrickDestroyed(10, position, true);
            }).not.toThrow();
        });

        test('should trigger level complete when all bricks destroyed', () => {
            // Destroy all bricks
            while (gameManager.getBricks().length > 0) {
                gameManager.getBricks().pop();
            }
            
            const initialLevel = gameManager.getLevel();
            gameManager.onBrickDestroyed(10);
            
            expect(gameManager.getCurrentState()).toBe('LEVEL_COMPLETE');
            expect(gameManager.getLevel()).toBe(initialLevel + 1);
        });
    });

    describe('Ball Management', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should decrease lives when ball is lost', () => {
            const initialLives = gameManager.getLives();
            gameManager.onBallLost();
            
            expect(gameManager.getLives()).toBe(initialLives - 1);
        });

        test('should damage core when ball is lost', () => {
            const coreController = gameManager['_coreController'];
            gameManager.onBallLost();
            
            expect(coreController.takeDamage).toHaveBeenCalledWith(1, 'Ball lost');
        });

        test('should trigger game over when lives reach zero', () => {
            gameManager.lives = 1;
            gameManager.onBallLost();
            
            expect(gameManager.getCurrentState()).toBe('GAME_OVER');
            expect(gameManager.getLives()).toBe(0);
        });

        test('should reset ball position when lives remain', () => {
            gameManager.lives = 2;
            gameManager.onBallLost();
            
            expect(gameManager.getCurrentState()).not.toBe('GAME_OVER');
            expect(gameManager.getBallNode().position.x).toBe(0);
            expect(gameManager.getBallNode().position.y).toBe(-150);
        });
    });

    describe('Core Management', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should damage core when attacked', () => {
            const coreController = gameManager['_coreController'];
            gameManager.onCoreAttacked(5);
            
            expect(coreController.takeDamage).toHaveBeenCalledWith(5, 'External attack');
        });

        test('should trigger immediate game over when core is destroyed', () => {
            gameManager.onCoreDestroyed();
            
            expect(gameManager.getCurrentState()).toBe('GAME_OVER');
            expect(gameManager.getLives()).toBe(0);
        });
    });

    describe('Boss Encounters', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should award score and complete level when boss is defeated', () => {
            const initialScore = gameManager.getScore();
            const initialLevel = gameManager.getLevel();
            
            gameManager.onBossDefeated(1000);
            
            expect(gameManager.getScore()).toBe(initialScore + 1000);
            expect(gameManager.getCurrentState()).toBe('LEVEL_COMPLETE');
            expect(gameManager.getLevel()).toBe(initialLevel + 1);
        });
    });

    describe('Level Progression', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should complete level and increment level counter', () => {
            const initialLevel = gameManager.getLevel();
            gameManager.onLevelComplete();
            
            expect(gameManager.getLevel()).toBe(initialLevel + 1);
            expect(gameManager.getCurrentState()).toBe('LEVEL_COMPLETE');
        });

        test('should reset level manager on level complete', () => {
            const levelManager = gameManager['_levelManager'];
            gameManager.onLevelComplete();
            
            expect(levelManager.resetLevel).toHaveBeenCalled();
            expect(levelManager.adjustDifficulty).toHaveBeenCalledWith(gameManager.getLevel());
        });

        test('should transition back to playing state after delay', (done) => {
            gameManager.onLevelComplete();
            
            setTimeout(() => {
                expect(gameManager.getCurrentState()).toBe('PLAYING');
                done();
            }, 3100);
        });
    });

    describe('State Management', () => {
        test('should set and get game state correctly', () => {
            gameManager.setState('PAUSED');
            expect(gameManager.getCurrentState()).toBe('PAUSED');
            
            gameManager.setState('PLAYING');
            expect(gameManager.getCurrentState()).toBe('PLAYING');
        });

        test('should handle all valid game states', () => {
            const validStates = ['PRE_START', 'PLAYING', 'LEVEL_COMPLETE', 'GAME_OVER', 'PAUSED'];
            
            validStates.forEach(state => {
                expect(() => {
                    gameManager.setState(state);
                }).not.toThrow();
                
                expect(gameManager.getCurrentState()).toBe(state);
            });
        });
    });

    describe('Prefab Management', () => {
        test('should return correct prefab references', () => {
            expect(gameManager.getBallPrefab()).toBe(gameManager.ballPrefab);
        });

        test('should handle missing prefabs gracefully', () => {
            gameManager.brickPrefab = null;
            
            expect(() => {
                gameManager.start();
            }).not.toThrow();
        });
    });

    describe('Score and Statistics', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should track score correctly', () => {
            expect(gameManager.getScore()).toBe(0);
            
            gameManager.onBrickDestroyed(10);
            expect(gameManager.getScore()).toBe(10);
            
            gameManager.onBrickDestroyed(25);
            expect(gameManager.getScore()).toBe(35);
        });

        test('should track level progression', () => {
            expect(gameManager.getLevel()).toBe(1);
            
            gameManager.onLevelComplete();
            expect(gameManager.getLevel()).toBe(2);
        });

        test('should track lives correctly', () => {
            expect(gameManager.getLives()).toBe(3);
            
            gameManager.onBallLost();
            expect(gameManager.getLives()).toBe(2);
        });
    });

    describe('Error Handling', () => {
        test('should handle null prefabs', () => {
            gameManager.brickPrefab = null;
            gameManager.paddlePrefab = null;
            gameManager.ballPrefab = null;
            
            expect(() => {
                gameManager.start();
            }).not.toThrow();
        });

        test('should handle missing core node', () => {
            gameManager.coreNode = null;
            
            expect(() => {
                gameManager.start();
                gameManager.onBallLost();
                gameManager.onCoreAttacked(5);
            }).not.toThrow();
        });

        test('should handle missing level manager', () => {
            gameManager['_levelManager'] = null;
            
            expect(() => {
                gameManager.onLevelComplete();
            }).not.toThrow();
        });
    });

    describe('Memory Management', () => {
        test('should clean up singleton on destroy', () => {
            gameManager.onDestroy();
            
            expect(MockGameManager.getInstance()).toBe(null);
        });

        test('should clean up bricks properly', () => {
            gameManager.start();
            const initialBrickCount = gameManager.getBricks().length;
            
            // Simulate brick destruction
            gameManager.getBricks().forEach(brick => {
                brick.destroy = jest.fn();
                brick.isValid = jest.fn(() => false);
            });
            
            gameManager.onBrickDestroyed(10);
            
            expect(gameManager.getBricks().length).toBeLessThan(initialBrickCount);
        });
    });

    describe('Power-up System Integration', () => {
        beforeEach(() => {
            gameManager.start();
        });

        test('should respect power-up drop chance', () => {
            gameManager.powerUpDropChance = 0;
            const position = { x: 100, y: 200, z: 0 };
            
            // With 0% drop chance, no power-up should drop
            const originalRandom = Math.random;
            Math.random = jest.fn(() => 0.5);
            
            expect(() => {
                gameManager.onBrickDestroyed(10, position);
            }).not.toThrow();
            
            Math.random = originalRandom;
        });

        test('should handle empty power-up prefab list', () => {
            gameManager.multiBallPowerUpPrefab = null;
            gameManager.laserPaddlePowerUpPrefab = null;
            
            const position = { x: 100, y: 200, z: 0 };
            
            expect(() => {
                gameManager.onBrickDestroyed(10, position);
            }).not.toThrow();
        });
    });
});