/**
 * RelicManager 单元测试
 * 测试遗物管理器的遗物获取、激活和效果应用功能
 */

import '../setup';
import { RelicManager, RelicType } from '../../assets/scripts/managers/RelicManager';
import { Node } from 'cc';

describe('RelicManager 测试套件', () => {
    let relicManager: RelicManager;
    let testNode: Node;

    beforeEach(() => {
        testNode = new Node('TestRelicManager');
        relicManager = testNode.addComponent(RelicManager);
        
        // 清理单例状态
        (RelicManager as any)._instance = null;
        relicManager.onLoad();
    });

    afterEach(() => {
        (RelicManager as any)._instance = null;
    });

    describe('单例模式测试', () => {
        test('应该正确实现单例模式', () => {
            const instance1 = RelicManager.getInstance();
            const instance2 = RelicManager.getInstance();
            
            expect(instance1).toBe(instance2);
            expect(instance1).toBe(relicManager);
        });

        test('应该在销毁时清理单例', () => {
            expect(RelicManager.getInstance()).toBe(relicManager);
            
            relicManager.onDestroy();
            expect(RelicManager.getInstance()).toBeNull();
        });
    });

    describe('遗物获取测试', () => {
        test('应该能够获取随机遗物', () => {
            const relic = relicManager.grantRandomRelic();
            
            expect(relic).toBeDefined();
            expect(Object.values(RelicType)).toContain(relic);
        });

        test('应该能够获取指定遗物', () => {
            const targetRelic = RelicType.EXPLOSIVE_BRICKS;
            const granted = relicManager.grantRelic(targetRelic);
            
            expect(granted).toBe(true);
            expect(relicManager.hasRelic(targetRelic)).toBe(true);
        });

        test('不应该重复获得相同遗物', () => {
            const relic = RelicType.MULTI_BALL_MASTER;
            
            const first = relicManager.grantRelic(relic);
            const second = relicManager.grantRelic(relic);
            
            expect(first).toBe(true);
            expect(second).toBe(false);
            
            const relics = relicManager.getActiveRelics();
            const relicCount = relics.filter(r => r === relic).length;
            expect(relicCount).toBe(1);
        });

        test('应该正确跟踪激活的遗物', () => {
            const relics = [RelicType.EXPLOSIVE_BRICKS, RelicType.FIRE_BALLS, RelicType.ICE_SHIELD];
            
            relics.forEach(relic => {
                relicManager.grantRelic(relic);
            });
            
            const activeRelics = relicManager.getActiveRelics();
            expect(activeRelics).toHaveLength(3);
            relics.forEach(relic => {
                expect(activeRelics).toContain(relic);
            });
        });
    });

    describe('遗物效果测试', () => {
        test('应该正确应用爆炸砖块效果', () => {
            relicManager.grantRelic(RelicType.EXPLOSIVE_BRICKS);
            
            const mockBrick = new Node('TestBrick');
            mockBrick.setPosition(100, 100, 0);
            
            const explosionSpy = jest.spyOn(relicManager as any, 'triggerExplosiveEffect');
            relicManager.onBrickDestroyed(mockBrick);
            
            expect(explosionSpy).toHaveBeenCalledWith(mockBrick.getPosition());
        });

        test('应该正确应用多球大师效果', () => {
            relicManager.grantRelic(RelicType.MULTI_BALL_MASTER);
            
            const ballCount = relicManager.getMultiBallBonus();
            expect(ballCount).toBeGreaterThan(0);
        });

        test('应该正确应用火焰球效果', () => {
            relicManager.grantRelic(RelicType.FIRE_BALLS);
            
            const mockBall = new Node('TestBall');
            const fireSpy = jest.spyOn(relicManager as any, 'applyFireEffect');
            
            relicManager.onBallLaunched(mockBall);
            expect(fireSpy).toHaveBeenCalledWith(mockBall);
        });

        test('应该正确应用冰盾效果', () => {
            relicManager.grantRelic(RelicType.ICE_SHIELD);
            
            const mockPaddle = new Node('TestPaddle');
            const iceSpy = jest.spyOn(relicManager as any, 'applyIceShield');
            
            relicManager.onPaddleHit(mockPaddle);
            expect(iceSpy).toHaveBeenCalledWith(mockPaddle);
        });

        test('应该正确应用磁力挡板效果', () => {
            relicManager.grantRelic(RelicType.MAGNETIC_PADDLE);
            
            const mockBall = new Node('TestBall');
            mockBall.setPosition(50, 100, 0);
            
            const mockPaddle = new Node('TestPaddle');
            mockPaddle.setPosition(0, -200, 0);
            
            const magnetSpy = jest.spyOn(relicManager as any, 'applyMagneticEffect');
            relicManager.update(0.016, mockPaddle, [mockBall]);
            
            expect(magnetSpy).toHaveBeenCalled();
        });
    });

    describe('遗物组合效果测试', () => {
        test('应该正确处理多个遗物的组合效果', () => {
            relicManager.grantRelic(RelicType.EXPLOSIVE_BRICKS);
            relicManager.grantRelic(RelicType.FIRE_BALLS);
            
            const mockBrick = new Node('TestBrick');
            const mockBall = new Node('TestBall');
            
            const explosionSpy = jest.spyOn(relicManager as any, 'triggerExplosiveEffect');
            const fireSpy = jest.spyOn(relicManager as any, 'applyFireEffect');
            
            relicManager.onBrickDestroyed(mockBrick);
            relicManager.onBallLaunched(mockBall);
            
            expect(explosionSpy).toHaveBeenCalled();
            expect(fireSpy).toHaveBeenCalled();
        });

        test('应该正确计算组合加成', () => {
            // 没有遗物时的基础值
            const baseBonus = relicManager.getDamageMultiplier();
            
            // 添加伤害相关遗物
            relicManager.grantRelic(RelicType.FIRE_BALLS);
            relicManager.grantRelic(RelicType.EXPLOSIVE_BRICKS);
            
            const enhancedBonus = relicManager.getDamageMultiplier();
            expect(enhancedBonus).toBeGreaterThan(baseBonus);
        });
    });

    describe('遗物移除测试', () => {
        test('应该能够移除指定遗物', () => {
            const relic = RelicType.EXPLOSIVE_BRICKS;
            relicManager.grantRelic(relic);
            
            expect(relicManager.hasRelic(relic)).toBe(true);
            
            relicManager.removeRelic(relic);
            expect(relicManager.hasRelic(relic)).toBe(false);
        });

        test('应该能够清除所有遗物', () => {
            relicManager.grantRelic(RelicType.EXPLOSIVE_BRICKS);
            relicManager.grantRelic(RelicType.FIRE_BALLS);
            relicManager.grantRelic(RelicType.ICE_SHIELD);
            
            expect(relicManager.getActiveRelics()).toHaveLength(3);
            
            relicManager.clearAllRelics();
            expect(relicManager.getActiveRelics()).toHaveLength(0);
        });
    });

    describe('遗物信息查询测试', () => {
        test('应该能够获取遗物描述', () => {
            const description = relicManager.getRelicDescription(RelicType.EXPLOSIVE_BRICKS);
            
            expect(description).toBeDefined();
            expect(typeof description).toBe('string');
            expect(description.length).toBeGreaterThan(0);
        });

        test('应该能够获取遗物稀有度', () => {
            const rarity = relicManager.getRelicRarity(RelicType.EXPLOSIVE_BRICKS);
            
            expect(rarity).toBeDefined();
            expect(['common', 'uncommon', 'rare', 'epic', 'legendary']).toContain(rarity);
        });

        test('应该能够检查遗物兼容性', () => {
            const isCompatible = relicManager.areRelicsCompatible(
                RelicType.FIRE_BALLS,
                RelicType.ICE_SHIELD
            );
            
            expect(typeof isCompatible).toBe('boolean');
        });
    });

    describe('保存和加载测试', () => {
        test('应该能够序列化遗物状态', () => {
            relicManager.grantRelic(RelicType.EXPLOSIVE_BRICKS);
            relicManager.grantRelic(RelicType.FIRE_BALLS);
            
            const saveData = relicManager.getSaveData();
            
            expect(saveData).toBeDefined();
            expect(saveData.activeRelics).toContain(RelicType.EXPLOSIVE_BRICKS);
            expect(saveData.activeRelics).toContain(RelicType.FIRE_BALLS);
        });

        test('应该能够从保存数据恢复', () => {
            const saveData = {
                activeRelics: [RelicType.MAGNETIC_PADDLE, RelicType.ICE_SHIELD],
                relicStats: {}
            };
            
            relicManager.loadFromSaveData(saveData);
            
            expect(relicManager.hasRelic(RelicType.MAGNETIC_PADDLE)).toBe(true);
            expect(relicManager.hasRelic(RelicType.ICE_SHIELD)).toBe(true);
            expect(relicManager.getActiveRelics()).toHaveLength(2);
        });
    });

    describe('错误处理测试', () => {
        test('应该处理无效的遗物类型', () => {
            expect(() => {
                relicManager.grantRelic('INVALID_RELIC' as any);
            }).not.toThrow();
            
            expect(() => {
                relicManager.hasRelic(null as any);
            }).not.toThrow();
        });

        test('应该处理空的保存数据', () => {
            expect(() => {
                relicManager.loadFromSaveData(null as any);
                relicManager.loadFromSaveData({} as any);
                relicManager.loadFromSaveData({ activeRelics: null } as any);
            }).not.toThrow();
        });

        test('应该处理无效的节点参数', () => {
            relicManager.grantRelic(RelicType.EXPLOSIVE_BRICKS);
            
            expect(() => {
                relicManager.onBrickDestroyed(null as any);
                relicManager.onBallLaunched(null as any);
                relicManager.onPaddleHit(null as any);
            }).not.toThrow();
        });
    });

    describe('性能测试', () => {
        test('遗物效果更新应该高效', () => {
            // 添加多个遗物
            Object.values(RelicType).forEach(relic => {
                relicManager.grantRelic(relic);
            });
            
            const mockPaddle = new Node('TestPaddle');
            const mockBalls = Array.from({ length: 10 }, (_, i) => new Node(`Ball${i}`));
            
            const startTime = performance.now();
            
            // 执行100次更新
            for (let i = 0; i < 100; i++) {
                relicManager.update(0.016, mockPaddle, mockBalls);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // 100ms内完成100次更新
        });

        test('大量遗物查询应该高效', () => {
            // 添加所有遗物
            Object.values(RelicType).forEach(relic => {
                relicManager.grantRelic(relic);
            });
            
            const startTime = performance.now();
            
            // 执行1000次遗物查询
            for (let i = 0; i < 1000; i++) {
                Object.values(RelicType).forEach(relic => {
                    relicManager.hasRelic(relic);
                });
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(50);
        });
    });
});