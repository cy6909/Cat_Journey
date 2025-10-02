import { _decorator, Component, Node, RigidBody2D, Vec2, Collider2D, IPhysics2DContact, Contact2DType, Vec3, input, Input, EventMouse } from 'cc';
import { LaunchStrategy, LaunchContext, LaunchParams } from './LaunchStrategy';
import { AimingLaunchStrategy } from './strategies/AimingLaunchStrategy';
import { RandomLaunchStrategy } from './strategies/RandomLaunchStrategy';

const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property
    public initialSpeed: number = 100;

    @property
    public maxSpeed: number = 600;

    @property
    public minSpeed: number = 100;

    private _rigidBody: RigidBody2D | null = null;
    public isMoving: boolean = false;
    public fireEffectDuration: number = 0;
    public iceEffectDuration: number = 0;
    
    // 跟随挡板相关状态
    private _isAttachedToPaddle: boolean = true;  // 初始状态：粘在挡板上
    private _paddleNode: Node | null = null;
    private _initialBallY: number = 0; // 记录Ball的初始Y位置，不再跟随Paddle的Y
    private _launchStrategy: LaunchStrategy = new RandomLaunchStrategy();
    private _aimDirection: Vec2 | null = null;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        
        // 查找挡板节点
        this.findPaddleNode();
        
        // 注册鼠标事件用于发射控制
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        
        if (this._rigidBody) {
            // 注册碰撞事件
            const colliders = this.node.getComponents(Collider2D);
            colliders.forEach(collider => {
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            });
            
            // 设置刚体属性以实现无摩擦完美弹性碰撞
            this._rigidBody.gravityScale = 0; // 无重力！Breakout游戏不需要重力
            this._rigidBody.linearDamping = 0; // 无阻尼，保持恒定速度
            this._rigidBody.angularDamping = 0; // 无角阻尼
            console.log('Ball initialized: no gravity, no damping, perfect bouncing');
        }
    }

    protected start(): void {
        // 初始状态禁用物理，等待发射
        if (this._rigidBody) {
            this._rigidBody.enabled = false;
        }
        
        // 记录初始Y位置
        this._initialBallY = this.node.position.y;
        console.log(`Ball ready, attached to paddle. Initial Y: ${this._initialBallY}`);
    }
    
    protected update(dt: number): void {
        // 如果球粘在挡板上，只跟随挡板的X轴移动，Y轴保持初始位置
        if (this._isAttachedToPaddle && this._paddleNode) {
            const paddlePos = this._paddleNode.position;
            // 只跟随X轴，Y轴使用初始位置
            const newPos = new Vec3(paddlePos.x, this._initialBallY, this.node.position.z);
            this.node.setPosition(newPos);
            
            // 每2秒输出一次调试信息
            if (Math.floor(Date.now() / 1000) % 2 === 0 && Date.now() % 1000 < 50) {
                console.log(`Ball following paddle X: paddle(${paddlePos.x.toFixed(1)}, ${paddlePos.y.toFixed(1)}) -> ball(${newPos.x.toFixed(1)}, ${newPos.y.toFixed(1)})`);
            }
        } else if (this._isAttachedToPaddle && !this._paddleNode) {
            // 每3秒输出一次找不到挡板的警告
            if (Math.floor(Date.now() / 1000) % 3 === 0 && Date.now() % 1000 < 50) {
                console.warn('Ball attached but no paddle found, retrying...');
                this._findPaddleNodeActual();
            }
        }

        // 以下逻辑只在刚体存在且球已发射时执行
        if (!this._rigidBody || this._isAttachedToPaddle) return;

        // 更新特效持续时间
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
    
    protected onDestroy(): void {
        // 清理鼠标事件监听
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    
    public setLaunchStrategy(strategy: LaunchStrategy): void {
        this._launchStrategy = strategy;
    }

    public setAimDirection(direction: Vec2): void {
        this._aimDirection = direction;
    }

    // GameManager调用此方法直接设置Paddle引用，避免查找延迟
    public setPaddleReference(paddleNode: Node): void {
        this._paddleNode = paddleNode;
        console.log('✅ Ball paddle reference set directly by GameManager');
    }
    
    private findPaddleNode(): void {
        // 延迟查找挡板，确保所有节点都已创建
        this.scheduleOnce(() => {
            this._findPaddleNodeActual();
        }, 0.1);
    }
    
    private _findPaddleNodeActual(): void {
        // 通过Canvas查找挡板节点
        const canvas = this.node.parent;
        console.log('Ball searching for paddle, canvas children count:', canvas ? canvas.children.length : 0);
        
        if (canvas) {
            // 遍历Canvas的子节点寻找挡板
            for (const child of canvas.children) {
                console.log(`Checking child: ${child.name}, has PaddleController: ${!!child.getComponent('PaddleController')}`);
                if (child.name.includes('Paddle') || child.getComponent('PaddleController')) {
                    this._paddleNode = child;
                    console.log('✅ Ball found paddle node:', child.name);
                    return;
                }
            }
        }
        
        // 如果还是找不到，尝试通过GameManager获取
        const gameManager = this.node.scene.getComponentInChildren('GameManager');
        if (gameManager && (gameManager as any).getPaddleNode) {
            this._paddleNode = (gameManager as any).getPaddleNode();
            console.log('✅ Ball found paddle via GameManager');
            return;
        }
        
        console.warn('❌ Ball could not find paddle node');
    }
    
    private onMouseDown(event: EventMouse): void {
        if (this._isAttachedToPaddle) {
            console.log('Mouse down - preparing to launch ball');
        }
    }
    
    private onMouseUp(event: EventMouse): void {
        if (this._isAttachedToPaddle) {
            this.launchBall();
        }
    }
    
    private launchBall(): void {
        this._isAttachedToPaddle = false;
        
        // 启用物理
        if (this._rigidBody) {
            this._rigidBody.enabled = true;
        }
        
        const context: LaunchContext = {
            paddlePosition: this._paddleNode? new Vec2(this._paddleNode.position.x, this._paddleNode.position.y) : new Vec2(0, 0),
            ballPosition: new Vec2(0,0),
            mousePosition: new Vec2(0,0),
            aimDirection: this._aimDirection || new Vec2(0, 1)
        };
        const params = this._launchStrategy.calculateLaunchParams(context);
        
        this.launch(params.direction);
        console.log('Aiming relic activated - Ball launch strategy changed');
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
        const ballPos = this.node.position;
        const paddlePos = paddleNode.position;

        // 计算球相对于挡板中心的偏移量 (-1到1之间)
        const paddleWidth = paddleNode.getComponent('UITransform')?.width || 100;
        const offsetX = (ballPos.x - paddlePos.x) / (paddleWidth / 2);
        const clampedOffset = Math.max(-1, Math.min(1, offsetX));

        // 根据碰撞位置调整反弹角度 (20度到160度之间)
        const minAngle = 20 * Math.PI / 180;  // 最小角度20度
        const maxAngle = 160 * Math.PI / 180; // 最大角度160度
        const targetAngle = minAngle + (1 - (clampedOffset + 1) / 2) * (maxAngle - minAngle);

        // 保持当前速度大小，只改变方向
        const speed = velocity.length();
        const newVelocity = new Vec2(
            Math.cos(targetAngle) * speed,
            Math.sin(targetAngle) * speed
        );

        // 确保Y方向始终向上
        if (newVelocity.y < 0) {
            newVelocity.y = Math.abs(newVelocity.y);
        }

        // 防止完全垂直（90度）的情况
        if (Math.abs(newVelocity.x) < speed * 0.1) {
            newVelocity.x = speed * 0.1 * (Math.random() > 0.5 ? 1 : -1);
            // 重新归一化并恢复速度
            const normalized = newVelocity.normalize();
            newVelocity.x = normalized.x * speed;
            newVelocity.y = normalized.y * speed;
        }

        this._rigidBody.linearVelocity = newVelocity;

        console.log(`Paddle hit - Offset: ${clampedOffset.toFixed(2)}, Angle: ${(targetAngle * 180 / Math.PI).toFixed(1)}°, Velocity: (${newVelocity.x.toFixed(1)}, ${newVelocity.y.toFixed(1)})`);
    }

    public get velocity(): Vec2 {
        return this._rigidBody ? this._rigidBody.linearVelocity : new Vec2(0, 0);
    }

    public set velocity(value: Vec2) {
        if (this._rigidBody) {
            this._rigidBody.linearVelocity = value;
        }
    }
}