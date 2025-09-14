import { _decorator, Component, Node, Prefab, instantiate, Vec3, math } from 'cc';
import { EnhancedBrick, BrickType } from './EnhancedBrick';

const { ccclass, property } = _decorator;

export interface LevelTemplate {
    name: string;
    difficulty: number;
    brickCount: number;
    specialBrickRatio: number;
    bossLevel: boolean;
    eliteLevel: boolean;
    brickTypeWeights: Map<BrickType, number>;
}

export enum LevelType {
    NORMAL = 'normal',
    ELITE = 'elite', 
    BOSS = 'boss',
    HIDDEN_BOSS = 'hidden_boss',
    EVENT = 'event',
    SHOP = 'shop',
    TREASURE = 'treasure'
}

@ccclass('ProceduralLevelGenerator')
export class ProceduralLevelGenerator extends Component {
    @property({type: Prefab})
    public enhancedBrickPrefab: Prefab | null = null;
    
    @property
    public gridWidth: number = 8;
    
    @property
    public gridHeight: number = 6;
    
    @property
    public brickSpacing: number = 65;
    
    @property
    public startY: number = 200;
    
    // Level difficulty scaling
    private _baseDifficulty: number = 1.0;
    private _currentChapter: number = 1;
    private _currentLevel: number = 1;
    
    // Brick type distribution templates
    private _normalLevelWeights: Map<BrickType, number> = new Map();
    private _eliteLevelWeights: Map<BrickType, number> = new Map();
    private _bossLevelWeights: Map<BrickType, number> = new Map();
    
    protected onLoad(): void {
        this.initializeBrickWeights();
    }
    
    private initializeBrickWeights(): void {
        // Normal level weights (40% normal, 30% reinforced, 20% special, 10% rare)
        this._normalLevelWeights.set(BrickType.NORMAL, 40);
        this._normalLevelWeights.set(BrickType.REINFORCED, 30);
        this._normalLevelWeights.set(BrickType.EXPERIENCE, 15);
        this._normalLevelWeights.set(BrickType.EXPLOSIVE, 5);
        this._normalLevelWeights.set(BrickType.ELECTRIC, 5);
        this._normalLevelWeights.set(BrickType.ICE, 3);
        this._normalLevelWeights.set(BrickType.FIRE, 2);
        
        // Elite level weights (20% normal, 40% reinforced, 30% special, 10% rare)
        this._eliteLevelWeights.set(BrickType.NORMAL, 20);
        this._eliteLevelWeights.set(BrickType.REINFORCED, 40);
        this._eliteLevelWeights.set(BrickType.EXPLOSIVE, 10);
        this._eliteLevelWeights.set(BrickType.ELECTRIC, 8);
        this._eliteLevelWeights.set(BrickType.REGENERATING, 7);
        this._eliteLevelWeights.set(BrickType.PHASE, 5);
        this._eliteLevelWeights.set(BrickType.MAGNETIC, 5);
        this._eliteLevelWeights.set(BrickType.SHIELD, 3);
        this._eliteLevelWeights.set(BrickType.GRAVITY, 2);
        
        // Boss level weights (10% normal, 30% reinforced, 40% special, 20% rare)
        this._bossLevelWeights.set(BrickType.NORMAL, 10);
        this._bossLevelWeights.set(BrickType.REINFORCED, 30);
        this._bossLevelWeights.set(BrickType.EXPLOSIVE, 15);
        this._bossLevelWeights.set(BrickType.ELECTRIC, 10);
        this._bossLevelWeights.set(BrickType.REGENERATING, 10);
        this._bossLevelWeights.set(BrickType.SHIELD, 8);
        this._bossLevelWeights.set(BrickType.PHASE, 7);
        this._bossLevelWeights.set(BrickType.TELEPORT, 5);
        this._bossLevelWeights.set(BrickType.TIME, 3);
        this._bossLevelWeights.set(BrickType.VOID, 2);
    }
    
    public generateLevel(levelType: LevelType, chapter: number, levelNumber: number): LevelTemplate {
        this._currentChapter = chapter;
        this._currentLevel = levelNumber;
        
        const difficulty = this.calculateDifficulty(chapter, levelNumber);
        
        switch (levelType) {
            case LevelType.NORMAL:
                return this.generateNormalLevel(difficulty);
            case LevelType.ELITE:
                return this.generateEliteLevel(difficulty);
            case LevelType.BOSS:
                return this.generateBossLevel(difficulty);
            case LevelType.HIDDEN_BOSS:
                return this.generateHiddenBossLevel(difficulty);
            default:
                return this.generateNormalLevel(difficulty);
        }
    }
    
    private calculateDifficulty(chapter: number, levelNumber: number): number {
        // Base difficulty increases with chapter and level
        const chapterMultiplier = 1 + (chapter - 1) * 0.5;
        const levelProgress = levelNumber / 10; // Assuming 10 levels per chapter
        return this._baseDifficulty * chapterMultiplier * (1 + levelProgress);
    }
    
    private generateNormalLevel(difficulty: number): LevelTemplate {
        const brickCount = Math.min(this.gridWidth * this.gridHeight, 
                                   Math.floor(20 + difficulty * 8));
        
        return {
            name: `Normal Level ${this._currentLevel}`,
            difficulty: difficulty,
            brickCount: brickCount,
            specialBrickRatio: Math.min(0.4, 0.2 + difficulty * 0.05),
            bossLevel: false,
            eliteLevel: false,
            brickTypeWeights: this._normalLevelWeights
        };
    }
    
    private generateEliteLevel(difficulty: number): LevelTemplate {
        const brickCount = Math.min(this.gridWidth * this.gridHeight,
                                   Math.floor(30 + difficulty * 10));
        
        return {
            name: `Elite Level ${this._currentLevel}`,
            difficulty: difficulty * 1.3,
            brickCount: brickCount,
            specialBrickRatio: Math.min(0.6, 0.4 + difficulty * 0.1),
            bossLevel: false,
            eliteLevel: true,
            brickTypeWeights: this._eliteLevelWeights
        };
    }
    
    private generateBossLevel(difficulty: number): LevelTemplate {
        const brickCount = Math.floor(this.gridWidth * this.gridHeight * 0.7); // Less bricks for boss fights
        
        return {
            name: `Boss Level ${this._currentLevel}`,
            difficulty: difficulty * 1.5,
            brickCount: brickCount,
            specialBrickRatio: Math.min(0.8, 0.6 + difficulty * 0.1),
            bossLevel: true,
            eliteLevel: false,
            brickTypeWeights: this._bossLevelWeights
        };
    }
    
    private generateHiddenBossLevel(difficulty: number): LevelTemplate {
        const brickCount = Math.floor(this.gridWidth * this.gridHeight * 0.5);
        
        return {
            name: `Hidden Boss ${this._currentLevel}`,
            difficulty: difficulty * 2.0,
            brickCount: brickCount,
            specialBrickRatio: 0.9, // Almost all special bricks
            bossLevel: true,
            eliteLevel: false,
            brickTypeWeights: this._bossLevelWeights
        };
    }
    
    public placeBricksFromTemplate(template: LevelTemplate, parent: Node): Node[] {
        const bricks: Node[] = [];
        const positions = this.generateBrickPositions(template.brickCount);
        
        for (let i = 0; i < positions.length; i++) {
            const brickType = this.selectBrickType(template.brickTypeWeights, template.difficulty);
            const brick = this.createBrick(brickType, positions[i], template.difficulty);
            
            if (brick && parent) {
                brick.setParent(parent);
                bricks.push(brick);
            }
        }
        
        return bricks;
    }
    
    private generateBrickPositions(count: number): Vec3[] {
        const positions: Vec3[] = [];
        const availablePositions: Vec3[] = [];
        
        // Generate all possible positions
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const x = (col - this.gridWidth / 2 + 0.5) * this.brickSpacing;
                const y = this.startY - row * (this.brickSpacing * 0.6);
                availablePositions.push(new Vec3(x, y, 0));
            }
        }
        
        // Randomly select positions
        while (positions.length < count && availablePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            positions.push(availablePositions.splice(randomIndex, 1)[0]);
        }
        
        return positions;
    }
    
    private selectBrickType(weights: Map<BrickType, number>, difficulty: number): BrickType {
        const totalWeight = Array.from(weights.values()).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [brickType, weight] of weights.entries()) {
            random -= weight;
            if (random <= 0) {
                return brickType;
            }
        }
        
        return BrickType.NORMAL; // Fallback
    }
    
    private createBrick(brickType: BrickType, position: Vec3, difficulty: number): Node | null {
        if (!this.enhancedBrickPrefab) return null;
        
        const brickNode = instantiate(this.enhancedBrickPrefab);
        const brickComponent = brickNode.getComponent(EnhancedBrick);
        
        if (brickComponent) {
            brickComponent.brickType = brickType;
            
            // Scale health based on difficulty
            const baseHealth = this.getBaseHealthForBrickType(brickType);
            brickComponent.health = Math.max(1, Math.floor(baseHealth * (1 + difficulty * 0.3)));
            
            // Scale score based on difficulty and brick type
            const baseScore = this.getBaseScoreForBrickType(brickType);
            brickComponent.scoreValue = Math.floor(baseScore * (1 + difficulty * 0.2));
        }
        
        brickNode.setWorldPosition(position);
        return brickNode;
    }
    
    private getBaseHealthForBrickType(brickType: BrickType): number {
        switch (brickType) {
            case BrickType.NORMAL: return 1;
            case BrickType.REINFORCED: return 3;
            case BrickType.REGENERATING: return 2;
            case BrickType.SHIELD: return 4;
            case BrickType.METAL: return 5;
            default: return 1;
        }
    }
    
    private getBaseScoreForBrickType(brickType: BrickType): number {
        switch (brickType) {
            case BrickType.NORMAL: return 10;
            case BrickType.REINFORCED: return 30;
            case BrickType.EXPLOSIVE: return 25;
            case BrickType.ELECTRIC: return 20;
            case BrickType.EXPERIENCE: return 15;
            case BrickType.REGENERATING: return 40;
            case BrickType.PHASE: return 35;
            case BrickType.VOID: return 100;
            default: return 15;
        }
    }
    
    // Pattern generation methods
    public generateSymmetricPattern(template: LevelTemplate): Vec3[] {
        const positions: Vec3[] = [];
        const centerX = this.gridWidth / 2;
        
        for (let row = 0; row < Math.min(this.gridHeight, 4); row++) {
            for (let col = 0; col < Math.floor(this.gridWidth / 2); col++) {
                if (Math.random() < 0.7) { // 70% chance to place brick
                    const x1 = (col - centerX + 0.5) * this.brickSpacing;
                    const x2 = (this.gridWidth - col - 1 - centerX + 0.5) * this.brickSpacing;
                    const y = this.startY - row * (this.brickSpacing * 0.6);
                    
                    positions.push(new Vec3(x1, y, 0));
                    if (col !== Math.floor(this.gridWidth / 2) - 1) { // Don't duplicate center column
                        positions.push(new Vec3(x2, y, 0));
                    }
                }
            }
        }
        
        return positions.slice(0, template.brickCount);
    }
    
    public generateCorridorPattern(template: LevelTemplate): Vec3[] {
        const positions: Vec3[] = [];
        
        // Create corridors with walls
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const isWall = col === 0 || col === this.gridWidth - 1 || 
                              (row % 2 === 0 && col % 3 === 1);
                
                if (isWall && Math.random() < 0.8) {
                    const x = (col - this.gridWidth / 2 + 0.5) * this.brickSpacing;
                    const y = this.startY - row * (this.brickSpacing * 0.6);
                    positions.push(new Vec3(x, y, 0));
                }
            }
        }
        
        return positions.slice(0, template.brickCount);
    }
    
    public generateSpiralPattern(template: LevelTemplate): Vec3[] {
        const positions: Vec3[] = [];
        const centerRow = Math.floor(this.gridHeight / 2);
        const centerCol = Math.floor(this.gridWidth / 2);
        
        let currentRow = centerRow;
        let currentCol = centerCol;
        let direction = 0; // 0: right, 1: down, 2: left, 3: up
        let steps = 1;
        let stepCount = 0;
        let directionChanges = 0;
        
        while (positions.length < template.brickCount && 
               currentRow >= 0 && currentRow < this.gridHeight &&
               currentCol >= 0 && currentCol < this.gridWidth) {
            
            const x = (currentCol - this.gridWidth / 2 + 0.5) * this.brickSpacing;
            const y = this.startY - currentRow * (this.brickSpacing * 0.6);
            positions.push(new Vec3(x, y, 0));
            
            // Move in current direction
            switch (direction) {
                case 0: currentCol++; break; // right
                case 1: currentRow++; break; // down
                case 2: currentCol--; break; // left
                case 3: currentRow--; break; // up
            }
            
            stepCount++;
            
            // Check if we need to change direction
            if (stepCount === steps) {
                direction = (direction + 1) % 4;
                stepCount = 0;
                directionChanges++;
                
                // Increase steps every two direction changes
                if (directionChanges % 2 === 0) {
                    steps++;
                }
            }
        }
        
        return positions;
    }
}