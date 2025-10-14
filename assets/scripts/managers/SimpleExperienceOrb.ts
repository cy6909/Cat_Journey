import { _decorator, Component, Node, Vec3, Vec2, Collider2D, Contact2DType, IPhysics2DContact, Sprite, Color } from 'cc';
import { GameManager } from '../gameplay/GameManager';
import { ExperienceManager } from './ExperienceManager';

const { ccclass, property } = _decorator;

/**
 * 简化版经验球组件
 *
 * Linus式设计：移除复杂物理，使用简单位置更新
 * "好品味意味着消除特殊情况"
 */
@ccclass('SimpleExperienceOrb')
export class SimpleExperienceOrb extends Component {
    @property
    public experienceValue: number = 10;

    @property
    public fallSpeed: number = 150;

    @property
    public magnetRange: number = 100;

    @property
    public magnetSpeed: number = 300;

    private _velocity: Vec2 = new Vec2(0, -150);
    private _paddleNode: Node | null = null;
    private _isCollected: boolean = false;
    private _lifeTime: number = 0;

    protected onLoad(): void {
        // 设置碰撞检测
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        // 初始化随机横向速度
        this._velocity.x = (Math.random() - 0.5) * 50;
        this._velocity.y = -this.fallSpeed;
    }

    protected start(): void {
        // 查找挡板节点
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            this._paddleNode = gameManager.getPaddleNode();
        }
    }

    protected update(dt: number): void {
        if (this._isCollected) return;

        // 生命周期管理 - 8秒后自动销毁
        this._lifeTime += dt;
        if (this._lifeTime > 8) {
            this.node.destroy();
            return;
        }

        const currentPos = this.node.position;

        // 磁力吸引效果
        if (this._paddleNode && this._paddleNode.isValid) {
            const distance = Vec3.distance(currentPos, this._paddleNode.position);

            if (distance < this.magnetRange) {
                // 计算吸引方向
                const direction = new Vec3();
                Vec3.subtract(direction, this._paddleNode.position, currentPos);
                direction.normalize();

                // 应用磁力
                this._velocity.x = direction.x * this.magnetSpeed;
                this._velocity.y = direction.y * this.magnetSpeed;
            }
        }

        // 更新位置
        const newPos = new Vec3(
            currentPos.x + this._velocity.x * dt,
            currentPos.y + this._velocity.y * dt,
            currentPos.z
        );

        // 边界检查 - 防止飞出屏幕
        if (newPos.y < -400) {
            this.node.destroy();
            return;
        }

        this.node.setPosition(newPos);
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (this._isCollected) return;

        const otherNode = otherCollider.node;

        // 检查是否被挡板收集
        if (otherNode.name.includes('Paddle')) {
            this.collect();
        }
    }

    private collect(): void {
        if (this._isCollected) return;
        this._isCollected = true;

        // 添加经验值
        const expManager = ExperienceManager.getInstance();
        if (expManager) {
            expManager.addExperience(this.experienceValue);
        }

        // 简单的收集效果
        this.playCollectEffect();

        // 延迟销毁，让效果播放
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.2);
    }

    private playCollectEffect(): void {
        // 简单的闪光效果
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color(255, 255, 255, 255);
        }

        // 缩放动画
        this.node.setScale(1.5, 1.5, 1);
    }
}