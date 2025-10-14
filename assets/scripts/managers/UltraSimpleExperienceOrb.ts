import { _decorator, Component, Node, Vec3, Vec2 } from 'cc';
import { GameManager } from '../gameplay/GameManager';
import { ExperienceManager } from './ExperienceManager';

const { ccclass, property } = _decorator;

/**
 * 极简经验球组件 - 无物理依赖版本
 *
 * Linus式设计：删除所有不必要的复杂性
 * - 无RigidBody2D
 * - 无Collider2D
 * - 纯位置检测
 */
@ccclass('UltraSimpleExperienceOrb')
export class UltraSimpleExperienceOrb extends Component {
    @property
    public experienceValue: number = 10;

    @property
    public fallSpeed: number = 150;  // 掉落速度

    private _velocity: Vec2 = new Vec2(0, -150);
    private _paddleNode: Node | null = null;
    private _isCollected: boolean = false;
    private _lifeTime: number = 0;

    protected start(): void {
        // 查找挡板
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            this._paddleNode = gameManager.getPaddleNode();
        }

        // 初始速度 - 直接向下掉落
        this._velocity.x = 0;
        this._velocity.y = -this.fallSpeed;
    }

    protected update(dt: number): void {
        if (this._isCollected) return;

        // 生命周期管理 - 10秒后消失
        this._lifeTime += dt;
        if (this._lifeTime > 10) {
            this.node.destroy();
            return;
        }

        // 使用世界坐标进行碰撞检测
        const currentWorldPos = this.node.getWorldPosition();

        // 检查是否碰到挡板
        if (this._paddleNode && this._paddleNode.isValid) {
            const paddleWorldPos = this._paddleNode.getWorldPosition();

            // 简单的矩形碰撞检测
            const xDiff = Math.abs(currentWorldPos.x - paddleWorldPos.x);
            const yDiff = Math.abs(currentWorldPos.y - paddleWorldPos.y);

            // 挡板宽度约80，高度约20；经验球约20x20
            // 碰撞检测：x方向 < 50 (40+10), y方向 < 30 (10+20)
            if (xDiff < 50 && yDiff < 30) {
                this.collect();
                return;
            }
        }

        // 更新位置 - 简单的向下掉落
        const currentLocalPos = this.node.position;
        const newPos = new Vec3(
            currentLocalPos.x,
            currentLocalPos.y + this._velocity.y * dt,
            currentLocalPos.z
        );

        // 底部边界检查 - 掉出屏幕则销毁
        if (newPos.y < -400) {
            this.node.destroy();
            return;
        }

        this.node.setPosition(newPos);
    }

    private collect(): void {
        if (this._isCollected) return;
        this._isCollected = true;

        // 添加经验值
        const expManager = ExperienceManager.getInstance();
        if (expManager) {
            expManager.addExperience(this.experienceValue);
        }

        // 直接销毁，不播放动画
        this.node.destroy();
    }

    // 公开方法，用于测试
    public forceCollect(): void {
        this.collect();
    }

    public setPaddleNode(paddle: Node): void {
        this._paddleNode = paddle;
    }
}