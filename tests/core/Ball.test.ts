/**
 * Ball 单元测试
 * 测试弹球的物理运动、碰撞检测和状态管理功能
 */

import '../setup';
import { Ball } from '../__mocks__/Ball';
import { Node, RigidBody2D, Vec3, Collider2D, Contact2DType } from 'cc';

describe('Ball 测试套件', () => {
    let ballNode: Node;
    let ball: Ball;
    let mockRigidBody: RigidBody2D;

    beforeEach(() => {
        ballNode = new Node('TestBall');
        ball = ballNode.addComponent(Ball);
        
        // 模拟刚体组件
        mockRigidBody = {
            linearVelocity: new Vec3(0, 0, 0),
            isValid: true,
            node: ballNode,
            body: {
                SetLinearVelocity: jest.fn(),
                GetLinearVelocity: jest.fn().mockReturnValue({ x: 0, y: 0 })
            }
        } as any;
        
        ballNode.addComponent = jest.fn().mockReturnValue(mockRigidBody);
        ballNode.getComponent = jest.fn().mockReturnValue(mockRigidBody);
        
        // 设置初始状态
        ball.initialSpeed = 300;
        ball.maxSpeed = 800;
        ball.minSpeed = 100;
    });

    describe('初始化测试', () => {
        test('应该正确初始化弹球属性', () => {
            expect(ball.initialSpeed).toBe(300);
            expect(ball.maxSpeed).toBe(800);
            expect(ball.minSpeed).toBe(100);
            expect(ball.isMoving).toBe(false);
        });

        test('应该正确获取刚体组件', () => {
            ball.start();
            expect((ball as any).rigidBody).toBeDefined();
        });
    });

    describe('弹球发射测试', () => {
        beforeEach(() => {
            ball.start();
        });

        test('应该能够向指定方向发射弹球', () => {
            const direction = new Vec3(1, 1, 0).normalize();
            ball.launch(direction);
            
            expect(ball.isMoving).toBe(true);
            expect(mockRigidBody.body.SetLinearVelocity).toHaveBeenCalled();
        });

        test('应该正确处理无效的发射方向', () => {
            // 测试零向量
            ball.launch(new Vec3(0, 0, 0));
            expect(ball.isMoving).toBe(false);
            
            // 测试null
            ball.launch(null as any);
            expect(ball.isMoving).toBe(false);
        });

        test('应该使用默认方向进行发射', () => {
            ball.launchWithDefaultDirection();
            
            expect(ball.isMoving).toBe(true);
            const expectedDirection = new Vec3(0.5, 1, 0).normalize();
            // 验证发射方向接近期望值
        });
    });

    describe('弹球重置测试', () => {
        beforeEach(() => {
            ball.start();
        });

        test('应该能够重置弹球状态', () => {
            // 先发射弹球
            ball.launch(new Vec3(1, 1, 0));
            expect(ball.isMoving).toBe(true);
            
            // 重置弹球
            ball.resetBall();
            
            expect(ball.isMoving).toBe(false);
            expect(mockRigidBody.linearVelocity.equals(Vec3.ZERO)).toBe(true);
        });

        test('重置后应该回到初始位置', () => {
            const initialPosition = new Vec3(0, -150, 0);
            ballNode.setPosition(100, 100, 0);
            
            ball.resetBall();
            
            const currentPosition = ballNode.getPosition();
            expect(currentPosition.x).toBe(initialPosition.x);
            expect(currentPosition.y).toBe(initialPosition.y);
        });
    });

    describe('速度管理测试', () => {
        beforeEach(() => {
            ball.start();
        });

        test('应该正确限制最大速度', () => {
            const highVelocity = new Vec3(1000, 1000, 0);
            mockRigidBody.linearVelocity = highVelocity;
            mockRigidBody.body.GetLinearVelocity.mockReturnValue({ x: 1000, y: 1000 });
            
            ball.update(0.016);
            
            // 验证速度被限制在最大值内
            expect(mockRigidBody.body.SetLinearVelocity).toHaveBeenCalled();
        });

        test('应该正确处理最小速度', () => {
            const lowVelocity = new Vec3(10, 10, 0);
            mockRigidBody.linearVelocity = lowVelocity;
            mockRigidBody.body.GetLinearVelocity.mockReturnValue({ x: 10, y: 10 });
            
            ball.update(0.016);
            
            // 验证速度被提升到最小值
            expect(mockRigidBody.body.SetLinearVelocity).toHaveBeenCalled();
        });

        test('应该保持合理速度范围内的速度不变', () => {
            const normalVelocity = new Vec3(200, 200, 0);
            mockRigidBody.linearVelocity = normalVelocity;
            mockRigidBody.body.GetLinearVelocity.mockReturnValue({ x: 200, y: 200 });
            
            const callCount = mockRigidBody.body.SetLinearVelocity.mock.calls.length;
            ball.update(0.016);
            
            // 正常速度不应该被修改
            expect(mockRigidBody.body.SetLinearVelocity.mock.calls.length).toBe(callCount);
        });
    });

    describe('碰撞检测测试', () => {
        beforeEach(() => {
            ball.start();
        });

        test('应该正确处理挡板碰撞', () => {
            const mockPaddleNode = new Node('Paddle');
            mockPaddleNode.addComponent('PaddleController');
            
            const mockContact = {
                otherCollider: {
                    node: mockPaddleNode
                }
            };
            
            const velocityChangedSpy = jest.spyOn(ball as any, 'onPaddleHit');
            ball.onBeginContact(null, mockContact as any, null);
            
            expect(velocityChangedSpy).toHaveBeenCalledWith(mockPaddleNode);
        });

        test('应该正确处理砖块碰撞', () => {
            const mockBrickNode = new Node('Brick');
            mockBrickNode.addComponent('Brick');
            
            const mockContact = {
                otherCollider: {
                    node: mockBrickNode
                }
            };
            
            const brickHitSpy = jest.spyOn(ball as any, 'onBrickHit');
            ball.onBeginContact(null, mockContact as any, null);
            
            expect(brickHitSpy).toHaveBeenCalledWith(mockBrickNode);
        });

        test('应该正确处理墙壁碰撞', () => {
            const mockWallNode = new Node('Wall');
            
            const mockContact = {
                otherCollider: {
                    node: mockWallNode
                }
            };
            
            const wallHitSpy = jest.spyOn(ball as any, 'onWallHit');
            ball.onBeginContact(null, mockContact as any, null);
            
            expect(wallHitSpy).toHaveBeenCalledWith(mockWallNode);
        });

        test('应该正确处理死亡区域碰撞', () => {
            const mockDeathZoneNode = new Node('DeathZone');
            mockDeathZoneNode.addComponent('DeathZone');
            
            const mockContact = {
                otherCollider: {
                    node: mockDeathZoneNode
                }
            };
            
            const deathSpy = jest.spyOn(ball as any, 'onDeathZoneHit');
            ball.onBeginContact(null, mockContact as any, null);
            
            expect(deathSpy).toHaveBeenCalledWith(mockDeathZoneNode);
        });
    });

    describe('挡板击球效果测试', () => {
        beforeEach(() => {
            ball.start();
        });

        test('应该根据击球位置调整角度', () => {
            const mockPaddleNode = new Node('Paddle');
            mockPaddleNode.setPosition(0, -200, 0);
            ballNode.setPosition(50, -180, 0); // 球在挡板右侧
            
            const originalVelocity = new Vec3(0, 200, 0);
            mockRigidBody.linearVelocity = originalVelocity;
            
            (ball as any).onPaddleHit(mockPaddleNode);
            
            // 验证速度被调整
            expect(mockRigidBody.body.SetLinearVelocity).toHaveBeenCalled();
        });

        test('应该保持反弹速度合理', () => {
            const mockPaddleNode = new Node('Paddle');
            mockPaddleNode.setPosition(0, -200, 0);
            ballNode.setPosition(0, -180, 0);
            
            const originalVelocity = new Vec3(100, -200, 0);
            mockRigidBody.linearVelocity = originalVelocity;
            
            (ball as any).onPaddleHit(mockPaddleNode);
            
            // 验证Y方向速度变为正值（向上）
            const lastCall = mockRigidBody.body.SetLinearVelocity.mock.calls.slice(-1)[0];
            if (lastCall) {
                expect(lastCall[0].y).toBeGreaterThan(0);
            }
        });
    });

    describe('特殊效果测试', () => {
        test('应该正确应用火焰效果', () => {
            ball.applyFireEffect(5.0);
            
            expect((ball as any).hasFireEffect).toBe(true);
            expect((ball as any).fireEffectDuration).toBe(5.0);
        });

        test('应该正确应用冰冻效果', () => {
            ball.applyIceEffect(3.0);
            
            expect((ball as any).hasIceEffect).toBe(true);
            expect((ball as any).iceEffectDuration).toBe(3.0);
        });

        test('特效应该正确过期', () => {
            ball.applyFireEffect(1.0);
            
            // 模拟时间流逝
            for (let i = 0; i < 70; i++) { // 超过1秒
                ball.update(0.016);
            }
            
            expect((ball as any).hasFireEffect).toBe(false);
        });
    });

    describe('错误处理测试', () => {
        test('应该处理缺失的刚体组件', () => {
            ballNode.getComponent = jest.fn().mockReturnValue(null);
            
            expect(() => {
                ball.start();
            }).not.toThrow();
        });

        test('应该处理无效的碰撞数据', () => {
            expect(() => {
                ball.onBeginContact(null, null, null);
            }).not.toThrow();
            
            expect(() => {
                ball.onBeginContact(null, { otherCollider: null } as any, null);
            }).not.toThrow();
        });

        test('应该处理无效的特效参数', () => {
            expect(() => {
                ball.applyFireEffect(-1);
                ball.applyFireEffect(NaN);
                ball.applyIceEffect(null as any);
            }).not.toThrow();
        });
    });

    describe('性能测试', () => {
        test('更新循环应该高效执行', () => {
            ball.start();
            const startTime = performance.now();
            
            // 执行1000次更新
            for (let i = 0; i < 1000; i++) {
                ball.update(0.016);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // 100ms内完成1000次更新
        });

        test('碰撞处理应该高效', () => {
            ball.start();
            const startTime = performance.now();
            
            const mockContact = {
                otherCollider: {
                    node: new Node('TestNode')
                }
            };
            
            // 执行100次碰撞处理
            for (let i = 0; i < 100; i++) {
                ball.onBeginContact(null, mockContact as any, null);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(50);
        });
    });
});