import { BrickType } from "../core/Brick";

/**
 * 难度配置接口
 */
export interface DifficultyConfig {
    level: number;                  // 关卡数字 (1-∞)

    // 砖块属性
    baseHealth: number;             // 基础生命值: 1 + floor(level / 5)

    // 特殊砖块概率
    specialBrickChance: number;     // 特殊砖块总概率: min(level * 2%, 50%)
    harmfulBrickChance: number;     // 减益砖块概率: min(level * 1.5%, 30%)
    beneficialBrickChance: number;  // 有益砖块概率: 固定5%

    // 布局参数
    layoutType: 'normal' | 'special'; // level < 10: normal, else: special
    density: number;                  // 砖块密度: 0.6 + min(level * 0.02, 0.3)

    // 网格尺寸
    gridRows: number;               // 行数
    gridCols: number;               // 列数
}

/**
 * 砖块分布配置
 */
export interface BrickDistribution {
    // 有益砖块类型及权重
    beneficial: {
        types: BrickType[];
        weights: number[];  // 对应types的权重
    };

    // 减益砖块类型及权重
    harmful: {
        types: BrickType[];
        weights: number[];
    };

    // 爆炸性砖块类型
    reactive: {
        types: BrickType[];
        chance: number;
        minDistance: number;  // 与其他reactive砖块的最小距离
    };
}

/**
 * 难度计算器 - 根据关卡数字计算难度参数
 */
export class DifficultyCalculator {
    /**
     * 计算指定关卡的难度配置
     * @param level 关卡数字 (1-based)
     */
    public static calculateDifficulty(level: number): DifficultyConfig {
        // 输入验证
        if (level < 1) level = 1;

        // 基础生命值: 每5关+1
        const baseHealth = 1 + Math.floor(level / 5);

        // 特殊砖概率: 每关+2%, 上限50%
        const specialBrickChance = Math.min(level * 0.02, 0.5);

        // 减益砖概率: 每关+1.5%, 上限30%
        const harmfulBrickChance = Math.min(level * 0.015, 0.3);

        // 有益砖概率: 固定5%
        const beneficialBrickChance = 0.05;

        // 布局类型: <10关用Normal, >=10关用Special
        const layoutType = level < 10 ? 'normal' : 'special';

        // 密度: 基础60% + 每关+2%, 上限90%
        const density = 0.6 + Math.min(level * 0.02, 0.3);

        // 网格尺寸: 根据关卡递增
        let gridRows = 8;
        let gridCols = 12;

        if (level >= 15) {
            gridRows = 10;
            gridCols = 14;
        } else if (level >= 10) {
            gridRows = 9;
            gridCols = 13;
        }

        return {
            level,
            baseHealth,
            specialBrickChance,
            harmfulBrickChance,
            beneficialBrickChance,
            layoutType,
            density,
            gridRows,
            gridCols
        };
    }

    /**
     * 获取砖块类型分布配置
     */
    public static getBrickDistribution(): BrickDistribution {
        return {
            beneficial: {
                types: [
                    BrickType.EXPERIENCE,  // 经验砖
                    BrickType.HEALING      // 治疗砖
                ],
                weights: [0.7, 0.3]  // 70%经验, 30%治疗
            },

            harmful: {
                types: [
                    BrickType.REGENERATING,  // 再生砖
                    BrickType.PHASE,         // 相位砖
                    BrickType.SHIELD,        // 护盾砖
                    BrickType.TELEPORT       // 传送砖
                ],
                weights: [0.4, 0.3, 0.2, 0.1]  // 递减权重
            },

            reactive: {
                types: [
                    BrickType.EXPLOSIVE,  // 爆炸砖
                    BrickType.ELECTRIC    // 电击砖
                ],
                chance: 0.1,        // 10%概率
                minDistance: 2      // 至少间隔2格
            }
        };
    }

    /**
     * 根据权重随机选择砖块类型
     * @param types 砖块类型数组
     * @param weights 权重数组
     */
    public static selectBrickTypeByWeight(types: BrickType[], weights: number[]): BrickType {
        if (types.length === 0 || types.length !== weights.length) {
            return BrickType.NORMAL;
        }

        // 计算总权重
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);

        // 随机值
        let random = Math.random() * totalWeight;

        // 选择类型
        for (let i = 0; i < types.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return types[i];
            }
        }

        // 默认返回第一个
        return types[0];
    }

    /**
     * 格式化难度配置为可读字符串 (用于DevTools显示)
     */
    public static formatConfig(config: DifficultyConfig): string {
        return `关卡: ${config.level}
基础生命: ${config.baseHealth} HP
特殊砖概率: ${(config.specialBrickChance * 100).toFixed(1)}%
减益砖概率: ${(config.harmfulBrickChance * 100).toFixed(1)}%
有益砖概率: ${(config.beneficialBrickChance * 100).toFixed(1)}%
布局类型: ${config.layoutType === 'normal' ? 'Normal' : 'Special'}
密度: ${(config.density * 100).toFixed(0)}%
网格: ${config.gridRows}行 × ${config.gridCols}列`;
    }
}
