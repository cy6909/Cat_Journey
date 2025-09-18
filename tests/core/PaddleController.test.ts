/**
 * PaddleController 单元测试
 * 测试挡板控制器的移动、边界检测和输入处理功能
 */

import '../setup';
import { PaddleController } from '../../assets/scripts/core/PaddleController';
import { Node, Component, Vec3, input, Input, EventTouch, Touch } from 'cc';

describe('PaddleController 测试套件', () => {
    let paddleNode: Node;
    let paddleController: PaddleController;
    let mockScreenWidth: number;

    beforeEach(() => {
        // 创建测试挡板节点
        paddleNode = new Node('TestPaddle');
        paddleController = paddleNode.addComponent(PaddleController);
        mockScreenWidth = 960;
        
        // 模拟屏幕宽度
        (paddleController as any).screenWidth = mockScreenWidth;
        (paddleController as any).paddleWidth = 100;
        
        // 设置初始位置
        paddleNode.setPosition(0, -250, 0);
    });

    describe('初始化测试', () => {
        test('应该正确初始化挡板属性', () => {
            expect(paddleController.speed).toBe(300);
            expect(paddleController.paddleWidth).toBe(100);
            expect(paddleController.boundaryMargin).toBe(50);
        });

        test('应该正确设置初始位置', () => {
            const position = paddleNode.getPosition();
            expect(position.x).toBe(0);
            expect(position.y).toBe(-250);
        });
    });

    describe('移动功能测试', () => {
        test('应该能够向左移动', () => {
            const initialX = paddleNode.getPosition().x;
            paddleController.moveLeft(0.1); // 移动0.1秒
            
            const newX = paddleNode.getPosition().x;
            expect(newX).toBeLessThan(initialX);
        });

        test('应该能够向右移动', () => {
            const initialX = paddleNode.getPosition().x;
            paddleController.moveRight(0.1); // 移动0.1秒
            
            const newX = paddleNode.getPosition().x;
            expect(newX).toBeGreaterThan(initialX);
        });

        test('应该遵守左边界限制', () => {
            // 移动到左边界外
            paddleNode.setPosition(-1000, -250, 0);
            paddleController.moveLeft(1.0);
            
            const position = paddleNode.getPosition();
            const expectedMinX = -(mockScreenWidth / 2) + (paddleController.paddleWidth / 2) + paddleController.boundaryMargin;
            expect(position.x).toBeGreaterThanOrEqual(expectedMinX);
        });

        test('应该遵守右边界限制', () => {
            // 移动到右边界外
            paddleNode.setPosition(1000, -250, 0);
            paddleController.moveRight(1.0);
            
            const position = paddleNode.getPosition();
            const expectedMaxX = (mockScreenWidth / 2) - (paddleController.paddleWidth / 2) - paddleController.boundaryMargin;
            expect(position.x).toBeLessThanOrEqual(expectedMaxX);
        });
    });

    describe('输入处理测试', () => {
        test('应该正确处理触摸开始事件', () => {
            const mockTouch = {
                getLocationX: jest.fn().mockReturnValue(100),
                getLocationY: jest.fn().mockReturnValue(300)
            } as any as Touch;
            
            const mockEvent = {
                getTouches: jest.fn().mockReturnValue([mockTouch])
            } as any as EventTouch;

            // 模拟触摸开始
            (paddleController as any).onTouchStart(mockEvent);
            
            expect((paddleController as any).isTouching).toBe(true);
            expect((paddleController as any).lastTouchX).toBe(100);
        });

        test('应该正确处理触摸移动事件', () => {
            // 先设置触摸状态
            (paddleController as any).isTouching = true;
            (paddleController as any).lastTouchX = 100;
            
            const mockTouch = {
                getLocationX: jest.fn().mockReturnValue(200),
                getLocationY: jest.fn().mockReturnValue(300)
            } as any as Touch;
            
            const mockEvent = {
                getTouches: jest.fn().mockReturnValue([mockTouch])
            } as any as EventTouch;

            const initialX = paddleNode.getPosition().x;
            (paddleController as any).onTouchMove(mockEvent);
            
            // 挡板应该向右移动
            const newX = paddleNode.getPosition().x;
            expect(newX).toBeGreaterThan(initialX);
            expect((paddleController as any).lastTouchX).toBe(200);
        });

        test('应该正确处理触摸结束事件', () => {
            (paddleController as any).isTouching = true;
            
            const mockEvent = {} as EventTouch;
            (paddleController as any).onTouchEnd(mockEvent);
            
            expect((paddleController as any).isTouching).toBe(false);
        });
    });

    describe('边界计算测试', () => {
        test('应该正确计算左边界', () => {
            const leftBoundary = (paddleController as any).getLeftBoundary();
            const expected = -(mockScreenWidth / 2) + (paddleController.paddleWidth / 2) + paddleController.boundaryMargin;
            expect(leftBoundary).toBe(expected);
        });

        test('应该正确计算右边界', () => {
            const rightBoundary = (paddleController as any).getRightBoundary();
            const expected = (mockScreenWidth / 2) - (paddleController.paddleWidth / 2) - paddleController.boundaryMargin;
            expect(rightBoundary).toBe(expected);
        });
    });

    describe('错误处理测试', () => {
        test('应该处理无效的移动参数', () => {
            const initialX = paddleNode.getPosition().x;
            
            // 测试负数时间
            paddleController.moveLeft(-0.1);
            expect(paddleNode.getPosition().x).toBe(initialX);
            
            // 测试NaN时间
            paddleController.moveRight(NaN);
            expect(paddleNode.getPosition().x).toBe(initialX);
        });

        test('应该处理空的触摸事件', () => {
            const mockEvent = {
                getTouches: jest.fn().mockReturnValue([])
            } as any as EventTouch;

            expect(() => {
                (paddleController as any).onTouchStart(mockEvent);
            }).not.toThrow();
            
            expect((paddleController as any).isTouching).toBe(false);
        });

        test('应该处理无效的屏幕尺寸', () => {
            (paddleController as any).screenWidth = 0;
            
            // 应该使用默认值或安全值
            const leftBoundary = (paddleController as any).getLeftBoundary();
            const rightBoundary = (paddleController as any).getRightBoundary();
            
            expect(typeof leftBoundary).toBe('number');
            expect(typeof rightBoundary).toBe('number');
            expect(leftBoundary).toBeLessThan(rightBoundary);
        });
    });

    describe('性能测试', () => {
        test('移动更新应该高效执行', () => {
            const startTime = performance.now();
            
            // 执行100次移动更新
            for (let i = 0; i < 100; i++) {
                paddleController.moveLeft(0.016); // 模拟60FPS
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // 应该在合理时间内完成
            expect(duration).toBeLessThan(50); // 50ms内完成100次更新
        });

        test('触摸事件处理应该高效', () => {
            const startTime = performance.now();
            
            const mockTouch = {
                getLocationX: jest.fn().mockReturnValue(Math.random() * 800),
                getLocationY: jest.fn().mockReturnValue(300)
            } as any as Touch;
            
            const mockEvent = {
                getTouches: jest.fn().mockReturnValue([mockTouch])
            } as any as EventTouch;

            // 执行100次触摸事件
            for (let i = 0; i < 100; i++) {
                (paddleController as any).onTouchMove(mockEvent);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100);
        });
    });
});