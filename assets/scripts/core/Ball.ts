import { _decorator, Component, Node, RigidBody2D, Vec2, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property
    public initialSpeed: number = 400;

    @property
    public maxSpeed: number = 600;

    @property
    public minSpeed: number = 100;

    private _rigidBody: RigidBody2D | null = null;
    public isMoving: boolean = false;
    public fireEffectDuration: number = 0;
    public iceEffectDuration: number = 0;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        
        if (this._rigidBody) {
            // 注册碰撞事件
            const colliders = this.node.getComponents(Collider2D);
            colliders.forEach(collider => {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            });
            
            // 设置刚体属性以实现无摩擦完美弹性碰撞
            // 注意：材质需要在编辑器中或者通过其他方式设置
            console.log('Ball initialized with collision detection');
        }
    }

    protected start(): void {
        // 不自动发射球，等待GameManager准备完成后手动调用launch()
        console.log('Ball ready, waiting for launch command');
    }

    public launch(direction?: Vec2): void {
        if (!this._rigidBody) return;

        let velocity: Vec2;
        if (direction && (direction.x !== 0 || direction.y !== 0)) {
            // 使用指定方向
            const normalized = direction.normalize();
            velocity = new Vec2(
                normalized.x * this.initialSpeed,
                normalized.y * this.initialSpeed
            );
        } else {
            // 使用默认随机方向
            const angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
            velocity = new Vec2(
                Math.cos(angle) * this.initialSpeed,
                Math.sin(angle) * this.initialSpeed
            );
        }

        this._rigidBody.linearVelocity = velocity;
        this.isMoving = true;
        
        console.log(`Ball launched from position: (${this.node.position.x}, ${this.node.position.y})`);
        console.log(`Ball velocity: (${velocity.x}, ${velocity.y}), angle: ${Math.atan2(velocity.y, velocity.x) * 180 / Math.PI}°`);
    }

    public launchWithDefaultDirection(): void {
        this.launch();
    }

    public resetBall(): void {
        if (!this._rigidBody) return;
        
        this.node.setPosition(0, 0, 0);
        this._rigidBody.linearVelocity = new Vec2(0, 0);
        this.isMoving = false;
        this.scheduleOnce(() => this.launch(), 1.0);
    }

    // 特效系统方法
    public applyFireEffect(duration: number): void {
        if (typeof duration === 'number' && duration > 0) {
            this.fireEffectDuration = duration;
        }
    }

    public applyIceEffect(duration: number): void {
        if (typeof duration === 'number' && duration > 0) {
            this.iceEffectDuration = duration;
        }
    }

    public hasFireEffect(): boolean {
        return this.fireEffectDuration > 0;
    }

    public hasIceEffect(): boolean {
        return this.iceEffectDuration > 0;
    }

    public getFireEffectDuration(): number {
        return this.fireEffectDuration;
    }

    public getIceEffectDuration(): number {
        return this.iceEffectDuration;
    }

    // 碰撞处理方法 - 修复测试失败的核心问题
    public onBeginContact(_selfCollider: Collider2D, otherCollider: Collider2D, _contact: IPhysics2DContact | null): void {
        if (!otherCollider || !otherCollider.node) {
            return;
        }

        const otherNode = otherCollider.node;
        if (otherNode.name === 'Paddle' || otherNode.getComponent('PaddleController')) {
            this.onPaddleHit(otherNode);
        }
    }

    private onPaddleHit(paddleNode: Node): void {
        if (!this._rigidBody || !paddleNode) return;
        
        const velocity = this._rigidBody.linearVelocity;
        // 修复测试失败的问题：确保球向上反弹
        if (velocity.y < 0) {
            velocity.y = Math.abs(velocity.y);
            this._rigidBody.linearVelocity = velocity;
        }
    }

    public get velocity(): Vec2 {
        return this._rigidBody ? this._rigidBody.linearVelocity : new Vec2(0, 0);
    }

    public set velocity(value: Vec2) {
        if (this._rigidBody) {
            this._rigidBody.linearVelocity = value;
        }
    }

    protected update(deltaTime?: number): void {
        if (!this._rigidBody) return;

        // 更新特效持续时间
        const dt = deltaTime || 1/60;
        if (this.fireEffectDuration > 0) {
            this.fireEffectDuration -= dt;
            if (this.fireEffectDuration < 0) {
                this.fireEffectDuration = 0;
            }
        }
        if (this.iceEffectDuration > 0) {
            this.iceEffectDuration -= dt;
            if (this.iceEffectDuration < 0) {
                this.iceEffectDuration = 0;
            }
        }

        // 速度控制
        const velocity = this._rigidBody.linearVelocity;
        const speed = velocity.length();
        
        if (speed > this.maxSpeed) {
            velocity.normalize();
            velocity.multiplyScalar(this.maxSpeed);
            this._rigidBody.linearVelocity = velocity;
        } else if (speed < this.initialSpeed * 0.8) {
            velocity.normalize();
            velocity.multiplyScalar(this.initialSpeed);
            this._rigidBody.linearVelocity = velocity;
        }
    }
}