import { _decorator, Component, Prefab, Vec3, Node, instantiate, math } from 'cc';
import { LevelManager, LevelType, DifficultyTier } from './LevelManager';
import { MapManager, NodeType } from '../managers/MapManager';
import { EnhancedBrick, BrickType } from './EnhancedBrick';

const { ccclass, property } = _decorator;

export enum LevelLayoutPattern {
    STANDARD = 'standard',
    PYRAMID = 'pyramid', 
    DIAMOND = 'diamond',
    SPIRAL = 'spiral',
    FORTRESS = 'fortress',
    CHAOS = 'chaos',
    TUNNEL = 'tunnel',
    WAVES = 'waves'
}

export interface LevelGenerationParams {
    chapterNumber: number;
    floorNumber: number;
    levelType: LevelType;
    difficultyTier: DifficultyTier;
    nodeType: NodeType;
    layoutPattern: LevelLayoutPattern;
    specialModifiers: string[];
}

export interface BrickLayoutData {
    position: Vec3;
    brickType: BrickType;
    health: number;
    specialEffects: string[];
    difficultyMultiplier: number;
}

@ccclass('DynamicLevelGenerator')
export class DynamicLevelGenerator extends Component {
    
    @property
    public gridWidth: number = 8;
    
    @property
    public gridHeight: number = 6;
    
    @property
    public brickWidth: number = 80;
    
    @property
    public brickHeight: number = 40;
    
    @property
    public brickSpacing: number = 10;
    
    @property
    public startX: number = -280;
    
    @property
    public startY: number = 200;

    private static _instance: DynamicLevelGenerator | null = null;
    private _levelManager: LevelManager | null = null;
    private _mapManager: MapManager | null = null;
    private _currentParams: LevelGenerationParams | null = null;

    public static getInstance(): DynamicLevelGenerator | null {
        return DynamicLevelGenerator._instance;
    }

    protected onLoad(): void {
        if (DynamicLevelGenerator._instance === null) {
            DynamicLevelGenerator._instance = this;
        }
        
        this._levelManager = LevelManager.getInstance();
        this._mapManager = MapManager.getInstance();
    }

    protected onDestroy(): void {
        if (DynamicLevelGenerator._instance === this) {
            DynamicLevelGenerator._instance = null;
        }
    }

    /**
     * 根据地图选择和难度参数生成关卡布局
     */
    public generateLevelLayout(params: LevelGenerationParams): BrickLayoutData[] {
        this._currentParams = params;
        
        console.log(`开始生成关卡 - 章节:${params.chapterNumber} 层数:${params.floorNumber} 类型:${params.levelType}`);
        
        let layout: BrickLayoutData[] = [];
        
        switch (params.layoutPattern) {
            case LevelLayoutPattern.STANDARD:
                layout = this.generateStandardLayout(params);
                break;
            case LevelLayoutPattern.PYRAMID:
                layout = this.generatePyramidLayout(params);
                break;
            case LevelLayoutPattern.DIAMOND:
                layout = this.generateDiamondLayout(params);
                break;
            case LevelLayoutPattern.SPIRAL:
                layout = this.generateSpiralLayout(params);
                break;
            case LevelLayoutPattern.FORTRESS:
                layout = this.generateFortressLayout(params);
                break;
            case LevelLayoutPattern.CHAOS:
                layout = this.generateChaosLayout(params);
                break;
            case LevelLayoutPattern.TUNNEL:
                layout = this.generateTunnelLayout(params);
                break;
            case LevelLayoutPattern.WAVES:
                layout = this.generateWavesLayout(params);
                break;
            default:
                layout = this.generateStandardLayout(params);
        }
        
        // 应用难度修饰符
        layout = this.applyDifficultyModifiers(layout, params);
        
        // 应用特殊修饰符
        layout = this.applySpecialModifiers(layout, params);
        
        console.log(`关卡生成完成 - 共${layout.length}个砖块`);
        return layout;
    }

    /**
     * 标准矩形布局
     */
    private generateStandardLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                // 根据节点类型调整砖块密度
                const spawnChance = this.getBrickSpawnChance(params.nodeType, row, col);
                if (Math.random() > spawnChance) continue;
                
                const position = this.getGridPosition(row, col);
                const brickType = this.selectBrickType(params, row, col);
                
                layout.push({
                    position,
                    brickType,
                    health: baseHealth + Math.floor(row * 0.5),
                    specialEffects: [],
                    difficultyMultiplier: 1.0
                });
            }
        }
        
        return layout;
    }

    /**
     * 金字塔布局
     */
    private generatePyramidLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        
        for (let row = 0; row < this.gridHeight; row++) {
            const rowWidth = Math.max(1, this.gridWidth - row);
            const startCol = Math.floor((this.gridWidth - rowWidth) / 2);
            
            for (let i = 0; i < rowWidth; i++) {
                const col = startCol + i;
                const position = this.getGridPosition(row, col);
                const brickType = this.selectBrickType(params, row, col);
                
                layout.push({
                    position,
                    brickType,
                    health: baseHealth + row,
                    specialEffects: [],
                    difficultyMultiplier: 1.0 + (row * 0.2)
                });
            }
        }
        
        return layout;
    }

    /**
     * 钻石布局
     */
    private generateDiamondLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        const centerRow = Math.floor(this.gridHeight / 2);
        
        for (let row = 0; row < this.gridHeight; row++) {
            const distanceFromCenter = Math.abs(row - centerRow);
            const rowWidth = Math.max(1, this.gridWidth - distanceFromCenter * 2);
            const startCol = Math.floor((this.gridWidth - rowWidth) / 2);
            
            for (let i = 0; i < rowWidth; i++) {
                const col = startCol + i;
                const position = this.getGridPosition(row, col);
                const brickType = this.selectBrickType(params, row, col);
                
                layout.push({
                    position,
                    brickType,
                    health: baseHealth + distanceFromCenter,
                    specialEffects: [],
                    difficultyMultiplier: 1.0 + (distanceFromCenter * 0.15)
                });
            }
        }
        
        return layout;
    }

    /**
     * 螺旋布局
     */
    private generateSpiralLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        const grid: boolean[][] = Array(this.gridHeight).fill(null).map(() => Array(this.gridWidth).fill(false));
        
        let row = 0, col = 0;
        let dr = 0, dc = 1; // 开始向右移动
        let spiral = 0;
        
        for (let i = 0; i < this.gridWidth * this.gridHeight * 0.7; i++) {
            if (row >= 0 && row < this.gridHeight && col >= 0 && col < this.gridWidth && !grid[row][col]) {
                grid[row][col] = true;
                
                const position = this.getGridPosition(row, col);
                const brickType = this.selectBrickType(params, row, col);
                
                layout.push({
                    position,
                    brickType,
                    health: baseHealth + Math.floor(spiral / 4),
                    specialEffects: [],
                    difficultyMultiplier: 1.0 + (spiral * 0.05)
                });
                spiral++;
            }
            
            // 检查是否需要转向
            const nextRow = row + dr;
            const nextCol = col + dc;
            if (nextRow < 0 || nextRow >= this.gridHeight || nextCol < 0 || nextCol >= this.gridWidth || grid[nextRow][nextCol]) {
                // 转向：右->下->左->上
                const temp = dr;
                dr = dc;
                dc = -temp;
            }
            
            row += dr;
            col += dc;
        }
        
        return layout;
    }

    /**
     * 要塞布局
     */
    private generateFortressLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        
        // 外墙
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const isWall = (row === 0 || row === this.gridHeight - 1 || col === 0 || col === this.gridWidth - 1);
                const isGate = (row === this.gridHeight - 1 && (col === Math.floor(this.gridWidth / 2) - 1 || col === Math.floor(this.gridWidth / 2)));
                
                if (isWall && !isGate) {
                    const position = this.getGridPosition(row, col);
                    const brickType = BrickType.REINFORCED;
                    
                    layout.push({
                        position,
                        brickType,
                        health: baseHealth * 2,
                        specialEffects: ['fortress_wall'],
                        difficultyMultiplier: 1.5
                    });
                }
                
                // 内部结构
                if (!isWall && Math.random() < 0.4) {
                    const position = this.getGridPosition(row, col);
                    const brickType = this.selectBrickType(params, row, col);
                    
                    layout.push({
                        position,
                        brickType,
                        health: baseHealth,
                        specialEffects: [],
                        difficultyMultiplier: 1.0
                    });
                }
            }
        }
        
        return layout;
    }

    /**
     * 混沌布局
     */
    private generateChaosLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        
        // 随机分布，但确保有一定的可玩性
        const brickCount = Math.floor(this.gridWidth * this.gridHeight * (0.5 + Math.random() * 0.3));
        const positions = new Set<string>();
        
        while (positions.size < brickCount) {
            const row = Math.floor(Math.random() * this.gridHeight);
            const col = Math.floor(Math.random() * this.gridWidth);
            const key = `${row},${col}`;
            
            if (!positions.has(key)) {
                positions.add(key);
                
                const position = this.getGridPosition(row, col);
                const brickType = this.selectBrickType(params, row, col);
                
                layout.push({
                    position,
                    brickType,
                    health: baseHealth + Math.floor(Math.random() * 3),
                    specialEffects: [],
                    difficultyMultiplier: 0.8 + Math.random() * 0.4
                });
            }
        }
        
        return layout;
    }

    /**
     * 隧道布局
     */
    private generateTunnelLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        const tunnelWidth = 2;
        const tunnelCenter = Math.floor(this.gridWidth / 2);
        
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const distanceFromTunnel = Math.abs(col - tunnelCenter);
                const isInTunnel = distanceFromTunnel <= tunnelWidth / 2;
                
                if (!isInTunnel || (row % 2 === 0 && Math.random() < 0.3)) {
                    const position = this.getGridPosition(row, col);
                    const brickType = this.selectBrickType(params, row, col);
                    
                    layout.push({
                        position,
                        brickType,
                        health: baseHealth + Math.floor(distanceFromTunnel * 0.5),
                        specialEffects: [],
                        difficultyMultiplier: 1.0 + (distanceFromTunnel * 0.1)
                    });
                }
            }
        }
        
        return layout;
    }

    /**
     * 波浪布局
     */
    private generateWavesLayout(params: LevelGenerationParams): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
        
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                const waveHeight = Math.sin((col / this.gridWidth) * Math.PI * 2) * 2;
                const targetRow = Math.floor(this.gridHeight / 2 + waveHeight);
                
                if (Math.abs(row - targetRow) <= 1 && Math.random() < 0.8) {
                    const position = this.getGridPosition(row, col);
                    const brickType = this.selectBrickType(params, row, col);
                    
                    layout.push({
                        position,
                        brickType,
                        health: baseHealth + Math.abs(row - targetRow),
                        specialEffects: [],
                        difficultyMultiplier: 1.0 + Math.abs(waveHeight * 0.1)
                    });
                }
            }
        }
        
        return layout;
    }

    /**
     * 应用难度修饰符
     */
    private applyDifficultyModifiers(layout: BrickLayoutData[], params: LevelGenerationParams): BrickLayoutData[] {
        const difficultyMultiplier = this.getDifficultyMultiplier(params);
        
        return layout.map(brick => ({
            ...brick,
            health: Math.ceil(brick.health * difficultyMultiplier),
            difficultyMultiplier: brick.difficultyMultiplier * difficultyMultiplier
        }));
    }

    /**
     * 应用特殊修饰符
     */
    private applySpecialModifiers(layout: BrickLayoutData[], params: LevelGenerationParams): BrickLayoutData[] {
        params.specialModifiers.forEach(modifier => {
            switch (modifier) {
                case 'electric_storm':
                    layout = this.applyElectricStorm(layout);
                    break;
                case 'fire_zone':
                    layout = this.applyFireZone(layout);
                    break;
                case 'ice_field':
                    layout = this.applyIceField(layout);
                    break;
                case 'explosive_cluster':
                    layout = this.applyExplosiveCluster(layout);
                    break;
                case 'regeneration_field':
                    layout = this.applyRegenerationField(layout);
                    break;
            }
        });
        
        return layout;
    }

    /**
     * 电流风暴修饰符
     */
    private applyElectricStorm(layout: BrickLayoutData[]): BrickLayoutData[] {
        const electricCount = Math.floor(layout.length * 0.2);
        const shuffled = [...layout].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < electricCount && i < shuffled.length; i++) {
            shuffled[i].brickType = BrickType.ELECTRIC;
            shuffled[i].specialEffects.push('chain_lightning');
        }
        
        return layout;
    }

    /**
     * 火焰区域修饰符
     */
    private applyFireZone(layout: BrickLayoutData[]): BrickLayoutData[] {
        const centerX = this.gridWidth / 2;
        const centerY = this.gridHeight / 2;
        
        return layout.map(brick => {
            const gridPos = this.getGridFromPosition(brick.position);
            const distance = Math.sqrt(Math.pow(gridPos.col - centerX, 2) + Math.pow(gridPos.row - centerY, 2));
            
            if (distance <= 2) {
                brick.brickType = BrickType.FIRE;
                brick.specialEffects.push('burn_aura');
            }
            
            return brick;
        });
    }

    /**
     * 冰霜领域修饰符
     */
    private applyIceField(layout: BrickLayoutData[]): BrickLayoutData[] {
        return layout.map((brick, index) => {
            if (index % 3 === 0) {
                brick.brickType = BrickType.ICE;
                brick.specialEffects.push('slow_aura');
            }
            return brick;
        });
    }

    /**
     * 爆炸集群修饰符
     */
    private applyExplosiveCluster(layout: BrickLayoutData[]): BrickLayoutData[] {
        const explosiveCount = Math.floor(layout.length * 0.15);
        const shuffled = [...layout].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < explosiveCount && i < shuffled.length; i++) {
            shuffled[i].brickType = BrickType.EXPLOSIVE;
            shuffled[i].specialEffects.push('cluster_bomb');
        }
        
        return layout;
    }

    /**
     * 再生领域修饰符
     */
    private applyRegenerationField(layout: BrickLayoutData[]): BrickLayoutData[] {
        const regenCount = Math.floor(layout.length * 0.1);
        const shuffled = [...layout].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < regenCount && i < shuffled.length; i++) {
            shuffled[i].brickType = BrickType.REGENERATING;
            shuffled[i].specialEffects.push('area_regen');
        }
        
        return layout;
    }

    /**
     * 工具方法
     */
    private getGridPosition(row: number, col: number): Vec3 {
        const x = this.startX + col * (this.brickWidth + this.brickSpacing);
        const y = this.startY - row * (this.brickHeight + this.brickSpacing);
        return new Vec3(x, y, 0);
    }

    private getGridFromPosition(position: Vec3): { row: number, col: number } {
        const col = Math.round((position.x - this.startX) / (this.brickWidth + this.brickSpacing));
        const row = Math.round((this.startY - position.y) / (this.brickHeight + this.brickSpacing));
        return { row, col };
    }

    private getBaseHealthForDifficulty(tier: DifficultyTier): number {
        switch (tier) {
            case DifficultyTier.EASY: return 1;
            case DifficultyTier.NORMAL: return 2;
            case DifficultyTier.HARD: return 3;
            case DifficultyTier.NIGHTMARE: return 5;
            default: return 2;
        }
    }

    private getBrickSpawnChance(nodeType: NodeType, row: number, col: number): number {
        const baseChance = {
            [NodeType.COMBAT]: 0.85,
            [NodeType.ELITE]: 0.9,
            [NodeType.BOSS]: 1.0,
            [NodeType.HIDDEN_BOSS]: 1.0,
            [NodeType.EVENT]: 0.7,
            [NodeType.SHOP]: 0.4,
            [NodeType.TREASURE]: 0.6,
            [NodeType.CAMPFIRE]: 0.3,
            [NodeType.UPGRADE]: 0.5,
            [NodeType.MYSTERY]: 0.8,
            [NodeType.START]: 0.0,
            [NodeType.END]: 0.0,
            [NodeType.REST]: 0.3,
            [NodeType.SECRET]: 0.95,
            [NodeType.MINI_BOSS]: 0.88,
            [NodeType.PUZZLE]: 0.75,
            [NodeType.GAUNTLET]: 0.95,
            [NodeType.FINAL_BOSS]: 1.0
        };
        
        return baseChance[nodeType] || 0.8;
    }

    private selectBrickType(params: LevelGenerationParams, row: number, col: number): BrickType {
        const difficultyFactor = this.getDifficultyMultiplier(params);
        const random = Math.random();
        
        // 根据难度和位置选择砖块类型
        if (params.levelType === LevelType.BOSS || params.nodeType === NodeType.BOSS) {
            if (random < 0.3) return BrickType.REINFORCED;
            if (random < 0.5) return BrickType.ELECTRIC;
            if (random < 0.7) return BrickType.EXPLOSIVE;
            return BrickType.NORMAL;
        }
        
        // 前排砖块更容易是强化型
        const frontRowBonus = (this.gridHeight - row) * 0.1;
        const specialChance = (difficultyFactor - 1.0) * 0.5 + frontRowBonus;
        
        if (random < specialChance * 0.2) return BrickType.REINFORCED;
        if (random < specialChance * 0.4) return BrickType.ELECTRIC;
        if (random < specialChance * 0.6) return BrickType.EXPLOSIVE;
        if (random < specialChance * 0.8) return BrickType.EXPERIENCE;
        
        return BrickType.NORMAL;
    }

    private getDifficultyMultiplier(params: LevelGenerationParams): number {
        let multiplier = 1.0;
        
        // 章节难度
        multiplier += (params.chapterNumber - 1) * 0.5;
        
        // 层数难度
        multiplier += params.floorNumber * 0.1;
        
        // 难度级别
        switch (params.difficultyTier) {
            case DifficultyTier.EASY: multiplier *= 0.8; break;
            case DifficultyTier.NORMAL: multiplier *= 1.0; break;
            case DifficultyTier.HARD: multiplier *= 1.3; break;
            case DifficultyTier.NIGHTMARE: multiplier *= 1.8; break;
        }
        
        // 节点类型
        switch (params.nodeType) {
            case NodeType.ELITE: multiplier *= 1.4; break;
            case NodeType.BOSS: multiplier *= 2.0; break;
            case NodeType.MINI_BOSS: multiplier *= 1.6; break;
            case NodeType.GAUNTLET: multiplier *= 1.5; break;
            case NodeType.FINAL_BOSS: multiplier *= 3.0; break;
        }
        
        return multiplier;
    }

    /**
     * 获取推荐的布局模式
     */
    public getRecommendedLayoutPattern(params: LevelGenerationParams): LevelLayoutPattern {
        // 根据关卡类型和难度推荐布局
        if (params.levelType === LevelType.BOSS) {
            return LevelLayoutPattern.FORTRESS;
        }
        
        if (params.nodeType === NodeType.ELITE) {
            const patterns = [LevelLayoutPattern.SPIRAL, LevelLayoutPattern.DIAMOND, LevelLayoutPattern.FORTRESS];
            return patterns[Math.floor(Math.random() * patterns.length)];
        }
        
        if (params.floorNumber % 5 === 0) {
            return LevelLayoutPattern.PYRAMID;
        }
        
        const allPatterns = Object.values(LevelLayoutPattern);
        return allPatterns[Math.floor(Math.random() * allPatterns.length)];
    }

    /**
     * 获取特殊修饰符建议
     */
    public getRecommendedModifiers(params: LevelGenerationParams): string[] {
        const modifiers: string[] = [];
        
        // 根据章节添加主题修饰符
        if (params.chapterNumber === 2) {
            modifiers.push('ice_field');
        } else if (params.chapterNumber === 3) {
            modifiers.push('fire_zone');
        }
        
        // 根据难度添加修饰符
        if (params.difficultyTier === DifficultyTier.HARD) {
            modifiers.push('electric_storm');
        } else if (params.difficultyTier === DifficultyTier.NIGHTMARE) {
            modifiers.push('explosive_cluster', 'regeneration_field');
        }
        
        // 特殊节点修饰符
        if (params.nodeType === NodeType.GAUNTLET) {
            modifiers.push('electric_storm', 'fire_zone');
        }
        
        return modifiers;
    }

    private generateFallbackLayout(): BrickLayoutData[] {
        const layout: BrickLayoutData[] = [];
        const baseHealth = 1;
        
        // Generate a simple 4x6 grid as fallback
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                const position = this.getGridPosition(row, col);
                
                layout.push({
                    position,
                    brickType: BrickType.NORMAL,
                    health: baseHealth,
                    specialEffects: [],
                    difficultyMultiplier: 1.0
                });
            }
        }
        
        return layout;
    }
}