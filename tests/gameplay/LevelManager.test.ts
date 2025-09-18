/**
 * LevelManager 单元测试
 * 测试关卡管理器的关卡生成、难度控制和进度管理功能
 */

import '../setup';
import { LevelManager, LevelType, DifficultyTier } from '../../assets/scripts/gameplay/LevelManager';
import { Node } from 'cc';

describe('LevelManager 测试套件', () => {
    let levelManager: LevelManager;
    let testNode: Node;

    beforeEach(() => {
        testNode = new Node('TestLevelManager');
        levelManager = testNode.addComponent(LevelManager);
        
        // 清理单例状态
        (LevelManager as any)._instance = null;
        levelManager.onLoad();
    });

    afterEach(() => {
        (LevelManager as any)._instance = null;
    });

    describe('单例模式测试', () => {
        test('应该正确实现单例模式', () => {
            const instance1 = LevelManager.getInstance();
            const instance2 = LevelManager.getInstance();
            
            expect(instance1).toBe(instance2);
            expect(instance1).toBe(levelManager);
        });
    });

    describe('关卡初始化测试', () => {
        test('应该正确初始化关卡参数', () => {
            levelManager.initializeLevel();
            
            expect(levelManager.getCurrentLevel()).toBeGreaterThan(0);
            expect(levelManager.getCurrentLevelType()).toBeDefined();
            expect(levelManager.getCurrentDifficulty()).toBeDefined();
        });

        test('应该根据章节设置正确的难度', () => {
            levelManager.setChapter(1);
            levelManager.initializeLevel();
            
            const difficulty1 = levelManager.getCurrentDifficulty();
            
            levelManager.setChapter(3);
            levelManager.initializeLevel();
            
            const difficulty3 = levelManager.getCurrentDifficulty();
            
            // 后续章节应该有更高的难度
            expect(difficulty3).toBeGreaterThanOrEqual(difficulty1);
        });
    });

    describe('关卡类型管理测试', () => {
        test('应该正确设置普通关卡', () => {
            levelManager.setLevelType(LevelType.NORMAL);
            expect(levelManager.getCurrentLevelType()).toBe(LevelType.NORMAL);
        });

        test('应该正确设置Boss关卡', () => {
            levelManager.setLevelType(LevelType.BOSS);
            expect(levelManager.getCurrentLevelType()).toBe(LevelType.BOSS);
        });

        test('应该正确设置精英关卡', () => {
            levelManager.setLevelType(LevelType.ELITE);
            expect(levelManager.getCurrentLevelType()).toBe(LevelType.ELITE);
        });
    });

    describe('难度调整测试', () => {
        test('应该能够手动调整难度', () => {
            levelManager.adjustDifficulty(5);
            
            const newDifficulty = levelManager.getCurrentDifficulty();
            expect(newDifficulty).toBe(5);
        });

        test('应该正确计算自适应难度', () => {
            // 模拟玩家表现数据
            levelManager.recordPlayerPerformance({
                levelCompleteTime: 60,
                livesLost: 0,
                scoreEarned: 1000,
                bricksDestroyed: 50
            });
            
            const adaptiveDifficulty = levelManager.calculateAdaptiveDifficulty();
            expect(typeof adaptiveDifficulty).toBe('number');
            expect(adaptiveDifficulty).toBeGreaterThan(0);
        });

        test('应该根据玩家表现调整难度', () => {
            const initialDifficulty = levelManager.getCurrentDifficulty();
            
            // 模拟优秀表现
            levelManager.recordPlayerPerformance({
                levelCompleteTime: 30,
                livesLost: 0,
                scoreEarned: 2000,
                bricksDestroyed: 100
            });
            
            levelManager.applyAdaptiveDifficulty();
            const newDifficulty = levelManager.getCurrentDifficulty();
            
            // 优秀表现应该增加难度
            expect(newDifficulty).toBeGreaterThanOrEqual(initialDifficulty);
        });
    });

    describe('关卡进度管理测试', () => {
        test('应该正确跟踪关卡进度', () => {
            levelManager.setLevel(1);
            expect(levelManager.getCurrentLevel()).toBe(1);
            
            levelManager.completeLevel();
            expect(levelManager.getCurrentLevel()).toBe(2);
        });

        test('应该正确处理章节转换', () => {
            levelManager.setChapter(1);
            levelManager.setLevel(15); // 第一章最后一关
            
            levelManager.completeLevel();
            
            // 应该进入第二章
            expect(levelManager.getCurrentChapter()).toBe(2);
            expect(levelManager.getCurrentLevel()).toBe(1);
        });

        test('应该正确计算总进度', () => {
            levelManager.setChapter(2);
            levelManager.setLevel(5);
            
            const progress = levelManager.getOverallProgress();
            expect(progress).toBeGreaterThan(0);
            expect(progress).toBeLessThanOrEqual(1);
        });
    });

    describe('关卡重置测试', () => {
        test('应该能够重置当前关卡', () => {
            levelManager.setLevel(5);
            levelManager.adjustDifficulty(8);
            
            levelManager.resetLevel();
            
            // 关卡应该重置但保持当前进度
            expect(levelManager.getCurrentLevel()).toBe(5);
        });

        test('应该能够重置整个进度', () => {
            levelManager.setChapter(3);
            levelManager.setLevel(10);
            levelManager.adjustDifficulty(15);
            
            levelManager.resetAllProgress();
            
            expect(levelManager.getCurrentChapter()).toBe(1);
            expect(levelManager.getCurrentLevel()).toBe(1);
        });
    });

    describe('关卡配置测试', () => {
        test('应该能够获取关卡配置', () => {
            levelManager.setLevelType(LevelType.BOSS);
            const config = levelManager.getLevelConfig();
            
            expect(config).toBeDefined();
            expect(config.enemyHealth).toBeGreaterThan(0);
            expect(config.enemyDamage).toBeGreaterThan(0);
            expect(config.timeLimit).toBeGreaterThan(0);
        });

        test('应该根据难度调整配置', () => {
            levelManager.adjustDifficulty(1);
            const easyConfig = levelManager.getLevelConfig();
            
            levelManager.adjustDifficulty(10);
            const hardConfig = levelManager.getLevelConfig();
            
            expect(hardConfig.enemyHealth).toBeGreaterThan(easyConfig.enemyHealth);
            expect(hardConfig.enemyDamage).toBeGreaterThan(easyConfig.enemyDamage);
        });
    });

    describe('特殊关卡处理测试', () => {
        test('应该正确处理Boss关卡', () => {
            levelManager.setLevelType(LevelType.BOSS);
            const isBossLevel = levelManager.isBossLevel();
            
            expect(isBossLevel).toBe(true);
        });

        test('应该正确处理隐藏关卡', () => {
            levelManager.setLevelType(LevelType.SECRET);
            const isSecretLevel = levelManager.isSecretLevel();
            
            expect(isSecretLevel).toBe(true);
        });

        test('应该正确生成随机事件', () => {
            const event = levelManager.generateRandomEvent();
            
            if (event) {
                expect(event.type).toBeDefined();
                expect(event.description).toBeDefined();
                expect(typeof event.effect).toBe('function');
            }
        });
    });

    describe('保存和加载测试', () => {
        test('应该能够保存关卡状态', () => {
            levelManager.setChapter(2);
            levelManager.setLevel(8);
            levelManager.adjustDifficulty(12);
            
            const saveData = levelManager.getSaveData();
            
            expect(saveData.currentChapter).toBe(2);
            expect(saveData.currentLevel).toBe(8);
            expect(saveData.currentDifficulty).toBe(12);
        });

        test('应该能够加载关卡状态', () => {
            const saveData = {
                currentChapter: 3,
                currentLevel: 5,
                currentDifficulty: 15,
                levelType: LevelType.ELITE,
                playerPerformance: []
            };
            
            levelManager.loadFromSaveData(saveData);
            
            expect(levelManager.getCurrentChapter()).toBe(3);
            expect(levelManager.getCurrentLevel()).toBe(5);
            expect(levelManager.getCurrentDifficulty()).toBe(15);
            expect(levelManager.getCurrentLevelType()).toBe(LevelType.ELITE);
        });
    });

    describe('错误处理测试', () => {
        test('应该处理无效的关卡参数', () => {
            expect(() => {
                levelManager.setLevel(-1);
                levelManager.setLevel(0);
                levelManager.setChapter(-1);
                levelManager.adjustDifficulty(-5);
            }).not.toThrow();
            
            // 应该设置为有效值
            expect(levelManager.getCurrentLevel()).toBeGreaterThan(0);
            expect(levelManager.getCurrentChapter()).toBeGreaterThan(0);
            expect(levelManager.getCurrentDifficulty()).toBeGreaterThanOrEqual(0);
        });

        test('应该处理无效的保存数据', () => {
            expect(() => {
                levelManager.loadFromSaveData(null as any);
                levelManager.loadFromSaveData({} as any);
                levelManager.loadFromSaveData({ currentLevel: -1 } as any);
            }).not.toThrow();
        });

        test('应该处理无效的玩家表现数据', () => {
            expect(() => {
                levelManager.recordPlayerPerformance(null as any);
                levelManager.recordPlayerPerformance({} as any);
                levelManager.recordPlayerPerformance({
                    levelCompleteTime: -1,
                    livesLost: -1,
                    scoreEarned: -1000
                } as any);
            }).not.toThrow();
        });
    });

    describe('性能测试', () => {
        test('难度计算应该高效', () => {
            const startTime = performance.now();
            
            // 执行1000次难度计算
            for (let i = 0; i < 1000; i++) {
                levelManager.calculateAdaptiveDifficulty();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100);
        });

        test('关卡配置生成应该高效', () => {
            const startTime = performance.now();
            
            // 执行500次配置生成
            for (let i = 0; i < 500; i++) {
                levelManager.adjustDifficulty(Math.random() * 20);
                levelManager.getLevelConfig();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100);
        });
    });
});