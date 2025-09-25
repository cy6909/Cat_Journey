import { _decorator, Component, Node, RigidBody2D, Vec2, Collider2D, IPhysics2DContact, Contact2DType, Vec3, input, Input, EventMouse } from 'cc';
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
            console.log('Ball initialized with collision detection and paddle following');
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
        
        // 在Y轴总计30度内随机发射 (向上75-105度)
        const baseAngle = Math.PI / 2; // 90度，向上
        const randomOffset = (Math.random() - 0.5) * (Math.PI / 6); // ±15度 = 30度范围
        const angle = baseAngle + randomOffset;
        
        const direction = new Vec2(
            Math.cos(angle),
            Math.sin(angle)
        );
        
        this.launch(direction);
        console.log(`Ball launched at angle: ${(angle * 180 / Math.PI).toFixed(1)}°`);
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
}