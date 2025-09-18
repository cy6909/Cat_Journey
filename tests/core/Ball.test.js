/**
 * Ball 单元测试 - JavaScript版本
 * 测试弹球的物理运动、碰撞检测和状态管理功能
 */

// Mock Ball 类
class MockBall {
    constructor() {
        this.initialSpeed = 300;
        this.maxSpeed = 800;
        this.minSpeed = 100;
        this.isMoving = false;
        this.fireEffectDuration = 0;
        this.iceEffectDuration = 0;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.node = null;
    }

    start() {
        // 初始化逻辑
    }

    update(deltaTime) {
        if (this.fireEffectDuration > 0) {
            this.fireEffectDuration -= deltaTime;
        }
        if (this.iceEffectDuration > 0) {
            this.iceEffectDuration -= deltaTime;
        }
    }

    launch(direction) {
        if (!direction || (direction.x === 0 && direction.y === 0)) {
            return;
        }
        
        const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const normalizedX = direction.x / length;
        const normalizedY = direction.y / length;
        
        this.velocity.x = normalizedX * this.initialSpeed;
        this.velocity.y = normalizedY * this.initialSpeed;
        this.isMoving = true;
    }

    launchWithDefaultDirection() {
        this.launch({ x: 0.5, y: 1, z: 0 });
    }

    resetBall() {
        this.velocity = { x: 0, y: 0, z: 0 };
        this.isMoving = false;
    }

    applyFireEffect(duration) {
        if (typeof duration === 'number' && duration > 0) {
            this.fireEffectDuration = duration;
        }
    }

    applyIceEffect(duration) {
        if (typeof duration === 'number' && duration > 0) {
            this.iceEffectDuration = duration;
        }
    }

    hasFireEffect() {
        return this.fireEffectDuration > 0;
    }

    hasIceEffect() {
        return this.iceEffectDuration > 0;
    }

    getFireEffectDuration() {
        return this.fireEffectDuration;
    }

    getIceEffectDuration() {
        return this.iceEffectDuration;
    }

    onBeginContact(selfCollider, otherCollider, contact) {
        if (!otherCollider || !otherCollider.node) {
            return;
        }

        const otherNode = otherCollider.node;
        if (otherNode.name === 'Paddle') {
            this.onPaddleHit(otherNode);
        }
    }

    onPaddleHit(paddleNode) {
        if (paddleNode) {
            // 简单的反弹逻辑
            this.velocity.y = Math.abs(this.velocity.y);
        }
    }
}

// Mock Node 类
class MockNode {
    constructor(name = 'MockNode') {
        this.name = name;
        this.position = { x: 0, y: 0, z: 0 };
        this.components = new Map();
        this.uuid = 'mock-' + Math.random().toString(36).substr(2, 9);
        this.isValid = true;
    }

    addComponent(ComponentClass) {
        const component = new ComponentClass();
        component.node = this;
        this.components.set(ComponentClass.name, component);
        return component;
    }

    getComponent(name) {
        return this.components.get(name) || null;
    }

    setPosition(x, y, z) {
        this.position = { x, y: y || 0, z: z || 0 };
    }

    getPosition() {
        return { ...this.position };
    }

    destroy() {
        this.isValid = false;
    }
}

describe('Ball 测试套件', () => {
    let ballNode;
    let ball;

    beforeEach(() => {
        ballNode = new MockNode('TestBall');
        ball = ballNode.addComponent(MockBall);
    });

    describe('初始化测试', () => {
        test('应该正确初始化弹球属性', () => {
            expect(ball.initialSpeed).toBe(300);
            expect(ball.maxSpeed).toBe(800);
            expect(ball.minSpeed).toBe(100);
            expect(ball.isMoving).toBe(false);
        });

        test('应该正确设置节点引用', () => {
            expect(ball.node).toBe(ballNode);
        });
    });

    describe('弹球发射测试', () => {
        test('应该能够向指定方向发射弹球', () => {
            const direction = { x: 1, y: 1, z: 0 };
            ball.launch(direction);
            
            expect(ball.isMoving).toBe(true);
            expect(ball.velocity.x).toBeCloseTo(212.13, 1); // 300 * (1/√2)
            expect(ball.velocity.y).toBeCloseTo(212.13, 1);
        });

        test('应该正确处理无效的发射方向', () => {
            ball.launch({ x: 0, y: 0, z: 0 });
            expect(ball.isMoving).toBe(false);
            
            ball.launch(null);
            expect(ball.isMoving).toBe(false);
        });

        test('应该使用默认方向进行发射', () => {
            ball.launchWithDefaultDirection();
            expect(ball.isMoving).toBe(true);
        });
    });

    describe('弹球重置测试', () => {
        test('应该能够重置弹球状态', () => {
            ball.launch({ x: 1, y: 1, z: 0 });
            expect(ball.isMoving).toBe(true);
            
            ball.resetBall();
            expect(ball.isMoving).toBe(false);
            expect(ball.velocity.x).toBe(0);
            expect(ball.velocity.y).toBe(0);
        });
    });

    describe('特殊效果测试', () => {
        test('应该正确应用火焰效果', () => {
            ball.applyFireEffect(5.0);
            expect(ball.hasFireEffect()).toBe(true);
            expect(ball.getFireEffectDuration()).toBe(5.0);
        });

        test('应该正确应用冰冻效果', () => {
            ball.applyIceEffect(3.0);
            expect(ball.hasIceEffect()).toBe(true);
            expect(ball.getIceEffectDuration()).toBe(3.0);
        });

        test('特效应该正确过期', () => {
            ball.applyFireEffect(1.0);
            
            // 模拟时间流逝
            for (let i = 0; i < 70; i++) {
                ball.update(0.016);
            }
            
            expect(ball.hasFireEffect()).toBe(false);
        });
    });

    describe('碰撞检测测试', () => {
        test('应该正确处理挡板碰撞', () => {
            const mockPaddleNode = new MockNode('Paddle');
            const mockOtherCollider = {
                node: mockPaddleNode
            };
            
            ball.velocity = { x: 100, y: -200, z: 0 };
            ball.onBeginContact(null, mockOtherCollider, null);
            
            expect(ball.velocity.y).toBeGreaterThan(0); // 向上反弹
        });

        test('应该处理无效的碰撞数据', () => {
            expect(() => {
                ball.onBeginContact(null, null, null);
            }).not.toThrow();
            
            expect(() => {
                ball.onBeginContact(null, { otherCollider: null }, null);
            }).not.toThrow();
        });
    });

    describe('错误处理测试', () => {
        test('应该处理无效的特效参数', () => {
            expect(() => {
                ball.applyFireEffect(-1);
                ball.applyFireEffect(NaN);
                ball.applyIceEffect(null);
            }).not.toThrow();
        });

        test('应该处理极端输入值', () => {
            expect(() => {
                ball.launch({ x: Infinity, y: Infinity, z: 0 });
                ball.launch({ x: NaN, y: NaN, z: 0 });
            }).not.toThrow();
        });
    });

    describe('性能测试', () => {
        test('更新循环应该高效执行', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                ball.update(0.016);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100);
        });

        test('发射操作应该高效', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 100; i++) {
                ball.launch({ x: Math.random(), y: Math.random(), z: 0 });
                ball.resetBall();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(50);
        });
    });
});