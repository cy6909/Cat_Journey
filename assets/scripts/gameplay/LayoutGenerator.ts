import { BrickType } from "./EnhancedBrick";
import { DifficultyConfig } from "./DifficultySystem";

/**
 * 砖块数据 - 用于布局生成
 */
export interface BrickData {
    type: BrickType;
    health: number;
    row: number;
    col: number;
}

/**
 * 布局模板接口
 */
export interface ILayoutTemplate {
    generate(config: DifficultyConfig): BrickData[];
}

/**
 * 布局生成器 - 根据难度配置生成砖块布局
 *
 * Linus式设计：简单直接，关卡递进有明确结构感
 * - 1-3关: 基础矩形
 * - 4-6关: 简单图案
 * - 7-9关: 复杂图案
 * - 10+关: 特殊布局
 */
export class LayoutGenerator {
    /**
     * 根据难度配置选择并生成布局
     * 关卡渐进式设计，而非完全随机
     */
    public static generateLayout(config: DifficultyConfig): BrickData[] {
        const level = config.level || 1;

        // 根据关卡选择布局类型 - 有明确的进阶感
        if (level <= 3) {
            // 初级关卡 - 整齐的矩形
            return new StandardGridLayout().generate(config);
        } else if (level <= 6) {
            // 中级关卡 - 简单图案
            const patterns = [
                new TriangleLayout(),
                new DiamondLayout(),
                new PyramidLayout()
            ];
            return patterns[level % patterns.length].generate(config);
        } else if (level <= 9) {
            // 高级关卡 - 复杂图案
            const patterns = [
                new SpiralLayout(),
                new CrossLayout(),
                new HexagonLayout()
            ];
            return patterns[level % patterns.length].generate(config);
        } else if (level <= 15) {
            // 专家关卡 - 防御型布局
            const patterns = [
                new FortressLayout(),
                new LayeredDefenseLayout(),
                new CheckerboardLayout()
            ];
            return patterns[level % patterns.length].generate(config);
        } else {
            // 大师关卡 - 混合型布局
            return new ChaosLayout().generate(config);
        }
    }
}

/**
 * 标准网格布局 - 矩形阵列 + 随机空缺
 */
class StandardGridLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, density } = config;

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                // 根据密度随机决定是否放置砖块
                if (Math.random() > density) continue;

                bricks.push({
                    type: BrickType.NORMAL,  // 默认类型，后续会被difficulty系统修改
                    health: config.baseHealth,
                    row,
                    col
                });
            }
        }

        return bricks;
    }
}

/**
 * 对称图案布局 - 已废弃，拆分为独立布局类
 */
class SymmetricPatternLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        // 向后兼容 - 使用三角形布局
        return new TriangleLayout().generate(config);
    }
}

/**
 * 三角形布局
 */
class TriangleLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const centerCol = Math.floor(gridCols / 2);

        for (let row = 0; row < gridRows; row++) {
            const width = row + 1;  // 每行宽度递增
            const startCol = centerCol - Math.floor(width / 2);

            for (let i = 0; i < width && startCol + i < gridCols; i++) {
                if (startCol + i >= 0) {
                    bricks.push({
                        type: BrickType.NORMAL,
                        health: baseHealth,
                        row,
                        col: startCol + i
                    });
                }
            }
        }
        return bricks;
    }
}

/**
 * 菱形布局
 */
class DiamondLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const centerRow = Math.floor(gridRows / 2);
        const centerCol = Math.floor(gridCols / 2);

        for (let row = 0; row < gridRows; row++) {
            const distanceFromCenter = Math.abs(row - centerRow);
            const width = (centerRow + 1) - distanceFromCenter;
            const startCol = centerCol - Math.floor(width / 2);

            for (let i = 0; i < width && startCol + i >= 0 && startCol + i < gridCols; i++) {
                bricks.push({
                    type: BrickType.NORMAL,
                    health: baseHealth,
                    row,
                    col: startCol + i
                });
            }
        }
        return bricks;
    }
}

/**
 * 金字塔布局 - 倒三角形
 */
class PyramidLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const centerCol = Math.floor(gridCols / 2);

        for (let row = 0; row < gridRows; row++) {
            const width = gridRows - row;  // 每行宽度递减
            const startCol = centerCol - Math.floor(width / 2);

            for (let i = 0; i < width && startCol + i < gridCols; i++) {
                if (startCol + i >= 0) {
                    bricks.push({
                        type: BrickType.NORMAL,
                        health: baseHealth,
                        row,
                        col: startCol + i
                    });
                }
            }
        }
        return bricks;
    }
}

/**
 * 螺旋布局 - 从中心向外螺旋
 */
class SpiralLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const centerRow = Math.floor(gridRows / 2);
        const centerCol = Math.floor(gridCols / 2);

        // 螺旋生成
        let row = centerRow, col = centerCol;
        let steps = 1;
        let direction = 0; // 0=right, 1=down, 2=left, 3=up

        bricks.push({ type: BrickType.NORMAL, health: baseHealth, row, col });

        while (bricks.length < gridRows * gridCols * 0.6) { // 填充60%
            for (let i = 0; i < 2; i++) { // 每个步长走两个方向
                for (let j = 0; j < steps; j++) {
                    switch (direction) {
                        case 0: col++; break;
                        case 1: row++; break;
                        case 2: col--; break;
                        case 3: row--; break;
                    }

                    if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
                        bricks.push({
                            type: BrickType.NORMAL,
                            health: baseHealth,
                            row,
                            col
                        });
                    }
                }
                direction = (direction + 1) % 4;
            }
            steps++;
        }

        return bricks;
    }
}

/**
 * 十字布局
 */
class CrossLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const centerRow = Math.floor(gridRows / 2);
        const centerCol = Math.floor(gridCols / 2);
        const thickness = 2;  // 十字粗细

        // 竖线
        for (let row = 0; row < gridRows; row++) {
            for (let offset = -thickness; offset <= thickness; offset++) {
                const col = centerCol + offset;
                if (col >= 0 && col < gridCols) {
                    bricks.push({
                        type: BrickType.NORMAL,
                        health: baseHealth,
                        row,
                        col
                    });
                }
            }
        }

        // 横线
        for (let col = 0; col < gridCols; col++) {
            for (let offset = -thickness; offset <= thickness; offset++) {
                const row = centerRow + offset;
                if (row >= 0 && row < gridRows) {
                    const exists = bricks.some(b => b.row === row && b.col === col);
                    if (!exists) {
                        bricks.push({
                            type: BrickType.NORMAL,
                            health: baseHealth,
                            row,
                            col
                        });
                    }
                }
            }
        }

        return bricks;
    }
}

/**
 * 六边形布局
 */
class HexagonLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const centerRow = Math.floor(gridRows / 2);
        const centerCol = Math.floor(gridCols / 2);
        const radius = Math.min(gridRows, gridCols) / 2;

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
                if (distance <= radius) {
                    bricks.push({
                        type: BrickType.NORMAL,
                        health: baseHealth,
                        row,
                        col
                    });
                }
            }
        }

        return bricks;
    }
}

/**
 * 棋盘布局 - 黑白相间
 */
class CheckerboardLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                // 棋盘格：行列和为偶数放砖块
                if ((row + col) % 2 === 0) {
                    bricks.push({
                        type: BrickType.NORMAL,
                        health: baseHealth,
                        row,
                        col
                    });
                }
            }
        }

        return bricks;
    }
}

/**
 * 混沌布局 - 大师关卡的终极挑战
 */
class ChaosLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;

        // 混合多种模式
        const patterns = [
            new DiamondLayout(),
            new SpiralLayout(),
            new CheckerboardLayout()
        ];

        // 获取每种模式的砖块
        const allPatterns = patterns.map(p => p.generate(config));

        // 合并并去重
        const brickMap = new Map<string, BrickData>();
        for (const pattern of allPatterns) {
            for (const brick of pattern) {
                const key = `${brick.row}-${brick.col}`;
                if (!brickMap.has(key) || Math.random() > 0.5) {
                    brickMap.set(key, brick);
                }
            }
        }

        // 随机移除一些砖块制造空洞
        for (const [key, brick] of brickMap) {
            if (Math.random() > 0.3) { // 70%保留率
                bricks.push(brick);
            }
        }

        return bricks;
    }
}

/**
 * 随机团块布局 - 分散的砖块团
 */
class ClusterRandomLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;
        const clusterCount = 4 + Math.floor(Math.random() * 3);  // 4-6个团块
        const clusterSize = 12 + Math.floor(Math.random() * 7);  // 12-18个砖块/团

        for (let c = 0; c < clusterCount; c++) {
            const centerRow = Math.floor(Math.random() * gridRows);
            const centerCol = Math.floor(Math.random() * gridCols);

            for (let i = 0; i < clusterSize; i++) {
                const offsetRow = Math.floor(Math.random() * 5) - 2;  // -2 to 2
                const offsetCol = Math.floor(Math.random() * 5) - 2;

                const row = centerRow + offsetRow;
                const col = centerCol + offsetCol;

                if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
                    // 避免重复
                    const exists = bricks.some(b => b.row === row && b.col === col);
                    if (!exists) {
                        bricks.push({
                            type: BrickType.NORMAL,
                            health: baseHealth,
                            row,
                            col
                        });
                    }
                }
            }
        }

        return bricks;
    }
}

/**
 * 堡垒布局 - 外墙+小孔+内部密集区
 */
class FortressLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;

        // 外墙参数
        const wallThickness = 2;
        const wallHealth = baseHealth + 2;  // 外墙更厚
        const gateWidth = 3;
        const gatePosition = Math.floor(Math.random() * (gridCols - gateWidth - wallThickness * 2)) + wallThickness;

        // 生成外墙
        for (let row = 0; row < Math.min(wallThickness + 2, gridRows); row++) {
            for (let col = 0; col < gridCols; col++) {
                // 顶部墙 + 门洞
                if (row < wallThickness) {
                    if (col < gatePosition || col >= gatePosition + gateWidth) {
                        bricks.push({
                            type: BrickType.REINFORCED,
                            health: wallHealth,
                            row,
                            col
                        });
                    }
                }
            }
        }

        // 内部密集区 (高价值砖块)
        const innerStartRow = wallThickness + 2;
        const innerDensity = 0.8;

        for (let row = innerStartRow; row < gridRows; row++) {
            for (let col = 2; col < gridCols - 2; col++) {
                if (Math.random() < innerDensity) {
                    bricks.push({
                        type: BrickType.EXPERIENCE,  // 内部多放经验砖
                        health: baseHealth,
                        row,
                        col
                    });
                }
            }
        }

        return bricks;
    }
}

/**
 * 分层防御布局 - 不同类型砖块分层
 */
class LayeredDefenseLayout implements ILayoutTemplate {
    public generate(config: DifficultyConfig): BrickData[] {
        const bricks: BrickData[] = [];
        const { gridRows, gridCols, baseHealth } = config;

        // 定义层级
        const layers = [
            { type: BrickType.PHASE, health: 1, rows: 2 },           // 相位砖前排
            { type: BrickType.REGENERATING, health: baseHealth + 1, rows: 2 }, // 再生砖中排
            { type: BrickType.NORMAL, health: baseHealth, rows: gridRows - 4 }  // 普通砖后排
        ];

        let currentRow = 0;

        for (const layer of layers) {
            for (let r = 0; r < layer.rows && currentRow < gridRows; r++) {
                for (let col = 0; col < gridCols; col++) {
                    bricks.push({
                        type: layer.type,
                        health: layer.health,
                        row: currentRow,
                        col
                    });
                }
                currentRow++;
            }
        }

        return bricks;
    }
}
