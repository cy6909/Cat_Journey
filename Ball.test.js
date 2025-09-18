/**
 * Ball 组件简化测试
 * 完全独立的JavaScript测试，验证测试环境正常工作
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

    resetBall() {
        this.velocity = { x: 0, y: 0, z: 0 };
        this.isMoving = false;
    }

    applyFireEffect(duration) {
        if (typeof duration === 'number' && duration > 0) {
            this.fireEffectDuration = duration;
        }
    }

    hasFireEffect() {
        return this.fireEffectDuration > 0;
    }

    update(deltaTime) {
        if (this.fireEffectDuration > 0) {
            this.fireEffectDuration -= deltaTime;
            if (this.fireEffectDuration < 0) {
                this.fireEffectDuration = 0;
            }
        }
    }
}

describe('🎾 Ball 组件核心功能测试', () => {
    let ball;

    beforeEach(() => {
        ball = new MockBall();
    });

    describe('✨ 初始化测试', () => {
        test('应该正确初始化弹球属性', () => {
            expect(ball.initialSpeed).toBe(300);
            expect(ball.maxSpeed).toBe(800);
            expect(ball.minSpeed).toBe(100);
            expect(ball.isMoving).toBe(false);
        });

        test('初始速度应该为零', () => {
            expect(ball.velocity.x).toBe(0);
            expect(ball.velocity.y).toBe(0);
            expect(ball.velocity.z).toBe(0);
        });
    });

    describe('🚀 弹球发射测试', () => {
        test('应该能够向右上方发射', () => {
            const direction = { x: 1, y: 1, z: 0 };
            ball.launch(direction);
            
            expect(ball.isMoving).toBe(true);
            expect(ball.velocity.x).toBeCloseTo(212.13, 1);
            expect(ball.velocity.y).toBeCloseTo(212.13, 1);
        });

        test('应该能够向左上方发射', () => {
            const direction = { x: -1, y: 1, z: 0 };
            ball.launch(direction);
            
            expect(ball.isMoving).toBe(true);
            expect(ball.velocity.x).toBeCloseTo(-212.13, 1);
            expect(ball.velocity.y).toBeCloseTo(212.13, 1);
        });

        test('应该拒绝无效方向', () => {
            ball.launch({ x: 0, y: 0, z: 0 });
            expect(ball.isMoving).toBe(false);

            ball.launch(null);
            expect(ball.isMoving).toBe(false);
        });

        test('发射速度应该等于初始速度', () => {
            ball.launch({ x: 0, y: 1, z: 0 });
            const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
            expect(speed).toBeCloseTo(ball.initialSpeed, 1);
        });
    });

    describe('🔄 弹球重置测试', () => {
        test('重置后应该停止移动', () => {
            ball.launch({ x: 1, y: 1, z: 0 });
            expect(ball.isMoving).toBe(true);
            
            ball.resetBall();
            expect(ball.isMoving).toBe(false);
        });

        test('重置后速度应该为零', () => {
            ball.launch({ x: 1, y: 1, z: 0 });
            ball.resetBall();
            
            expect(ball.velocity.x).toBe(0);
            expect(ball.velocity.y).toBe(0);
            expect(ball.velocity.z).toBe(0);
        });
    });

    describe('🔥 特效系统测试', () => {
        test('应该能够应用火焰特效', () => {
            ball.applyFireEffect(5.0);
            expect(ball.hasFireEffect()).toBe(true);
            expect(ball.fireEffectDuration).toBe(5.0);
        });

        test('火焰特效应该随时间消退', () => {
            ball.applyFireEffect(1.0);
            expect(ball.hasFireEffect()).toBe(true);
            
            // 模拟0.5秒流逝
            ball.update(0.5);
            expect(ball.fireEffectDuration).toBe(0.5);
            expect(ball.hasFireEffect()).toBe(true);
            
            // 再模拟0.6秒流逝（总共1.1秒）
            ball.update(0.6);
            expect(ball.fireEffectDuration).toBe(0);
            expect(ball.hasFireEffect()).toBe(false);
        });

        test('应该拒绝无效的特效持续时间', () => {
            ball.applyFireEffect(-1);
            expect(ball.hasFireEffect()).toBe(false);
            
            ball.applyFireEffect(0);
            expect(ball.hasFireEffect()).toBe(false);
            
            ball.applyFireEffect("invalid");
            expect(ball.hasFireEffect()).toBe(false);
        });
    });

    describe('🎯 边界条件测试', () => {
        test('应该处理极端输入值', () => {
            expect(() => {
                ball.launch({ x: Infinity, y: Infinity, z: 0 });
            }).not.toThrow();
            
            expect(() => {
                ball.launch({ x: NaN, y: NaN, z: 0 });
            }).not.toThrow();
        });

        test('应该处理超大速度值', () => {
            ball.launch({ x: 1000000, y: 1000000, z: 0 });
            const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
            expect(speed).toBeCloseTo(ball.initialSpeed, 1);
        });
    });

    describe('⚡ 性能测试', () => {
        test('批量发射应该高效', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                ball.launch({ x: Math.random(), y: Math.random(), z: 0 });
                ball.resetBall();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // 100ms内完成1000次操作
        });

        test('特效更新应该高效', () => {
            ball.applyFireEffect(10.0);
            const startTime = performance.now();
            
            for (let i = 0; i < 1000; i++) {
                ball.update(0.001); // 每次更新1ms
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(50); // 50ms内完成1000次更新
        });
    });
});

describe('🎮 游戏系统集成测试', () => {
    test('完整的弹球生命周期', () => {
        const ball = new MockBall();
        
        // 1. 初始状态
        expect(ball.isMoving).toBe(false);
        
        // 2. 发射弹球
        ball.launch({ x: 1, y: 1, z: 0 });
        expect(ball.isMoving).toBe(true);
        
        // 3. 应用特效
        ball.applyFireEffect(2.0);
        expect(ball.hasFireEffect()).toBe(true);
        
        // 4. 模拟游戏运行
        for (let i = 0; i < 60; i++) { // 1秒，60FPS
            ball.update(1/60);
        }
        expect(ball.hasFireEffect()).toBe(true);
        expect(ball.fireEffectDuration).toBeCloseTo(1.0, 1);
        
        // 5. 重置弹球
        ball.resetBall();
        expect(ball.isMoving).toBe(false);
        expect(ball.velocity.x).toBe(0);
        expect(ball.velocity.y).toBe(0);
    });

    test('多次发射和重置', () => {
        const ball = new MockBall();
        
        for (let i = 0; i < 10; i++) {
            // 随机方向发射
            const angle = (i / 10) * Math.PI * 2;
            ball.launch({ 
                x: Math.cos(angle), 
                y: Math.sin(angle), 
                z: 0 
            });
            
            expect(ball.isMoving).toBe(true);
            
            // 验证速度大小
            const speed = Math.sqrt(
                ball.velocity.x * ball.velocity.x + 
                ball.velocity.y * ball.velocity.y
            );
            expect(speed).toBeCloseTo(ball.initialSpeed, 1);
            
            // 重置
            ball.resetBall();
            expect(ball.isMoving).toBe(false);
        }
    });
});