import { _decorator, Component, Node, input, Input, EventTouch, Vec3, UITransform, Canvas, Camera, Vec2, Touch, BoxCollider2D, Sprite, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaddleController')
export class PaddleController extends Component {
    @property
    public speed: number = 300;
    
    @property
    public basePaddleWidth: number = 120; // 基础宽度
    
    @property  
    public basePaddleHeight: number = 24; // 基础高度
    
    @property
    public boundaryMargin: number = 50;

    @property
    public moveSpeed: number = 500;

    // 动态属性
    private _currentScale: number = 1.0; // 当前缩放倍数
    private _currentWidth: number = 120; // 当前实际宽度
    private _boxCollider: BoxCollider2D | null = null;
    private _sprite: Sprite | null = null;
    private _rigidBody: RigidBody2D | null = null;
    
    // 惯性移动相关 - 添加重量感 (public for debugging)
    public _targetX: number = 0;        // 目标X位置
    public _currentVelocity: number = 0; // 当前速度
    public _dampingFactor: number = 0.15; // 阻尼系数，控制惯性感
    public _maxSpeed: number = 800;      // 最大移动速度
    
    private _canvasComponent: Canvas | null = null;
    private _uiTransform: UITransform | null = null;
    private _camera: Camera | null = null;
    private _isTouching: boolean = false;
    private _lastTouchX: number = 0;
    private _screenWidth: number = 640; // 竖屏宽度640，不是960
    private _fixedY: number = -300; // 固定的Y位置，防止被球推动
    
    protected onLoad(): void {
        this._uiTransform = this.getComponent(UITransform);
        this._canvasComponent = this.node.parent?.getComponent(Canvas) || null;
        this._camera = this._canvasComponent?.cameraComponent || null;
        
        // 获取组件引用
        this._boxCollider = this.getComponent(BoxCollider2D);
        this._sprite = this.getComponent(Sprite);
        this._rigidBody = this.getComponent(RigidBody2D);
        
        // 确保RigidBody2D配置正确
        if (this._rigidBody) {
            this._rigidBody.type = 2; // Kinematic
            this._rigidBody.gravityScale = 0;
            this._rigidBody.fixedRotation = true;
            console.log('Paddle RigidBody2D configured: Kinematic, no gravity, fixed rotation');
        }
        
        // 初始化尺寸
        this._currentWidth = this.basePaddleWidth;
        this._targetX = this.node.position.x; // 初始化目标位置
        this._fixedY = this.node.position.y; // 记录初始Y位置
        this.updatePaddleSize();
    }

    protected onEnable(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
    
    protected update(dt: number): void {
        // 强制锁定Y轴位置，防止被球推动
        const currentPos = this.node.position;
        if (Math.abs(currentPos.y - this._fixedY) > 0.01) {
            console.log(`Paddle Y corrected: ${currentPos.y.toFixed(2)} -> ${this._fixedY}`);
        }
        
        // 平滑移动到目标位置 - 好品味：简单的物理模拟
        const deltaX = this._targetX - currentPos.x;
        
        // 计算加速度 (简单弹簧阻尼系统)
        const acceleration = deltaX * 10; // 弹簧力
        this._currentVelocity += acceleration * dt;
        this._currentVelocity *= (1 - this._dampingFactor); // 阻尼
        
        // 限制最大速度
        if (Math.abs(this._currentVelocity) > this._maxSpeed) {
            this._currentVelocity = Math.sign(this._currentVelocity) * this._maxSpeed;
        }
        
        // 更新位置 - 强制使用固定的Y坐标
        const newX = currentPos.x + this._currentVelocity * dt;
        this.node.setPosition(newX, this._fixedY, currentPos.z);
    }

    // 测试需要的移动方法
    public moveLeft(deltaTime: number): void {
        const currentPos = this.node.getPosition();
        const newX = currentPos.x - this.speed * deltaTime;
        const clampedX = this.clampToScreenBounds(newX);
        this.node.setPosition(clampedX, this._fixedY, currentPos.z);
    }

    public moveRight(deltaTime: number): void {
        const currentPos = this.node.getPosition();
        const newX = currentPos.x + this.speed * deltaTime;
        const clampedX = this.clampToScreenBounds(newX);
        this.node.setPosition(clampedX, this._fixedY, currentPos.z);
    }

    private clampToScreenBounds(x: number): number {
        const leftBound = -(this._screenWidth / 2) + (this._currentWidth / 2) + this.boundaryMargin;
        const rightBound = (this._screenWidth / 2) - (this._currentWidth / 2) - this.boundaryMargin;
        return Math.max(leftBound, Math.min(rightBound, x));
    }

    private onTouchStart(event: EventTouch): void {
        const touches = event.getTouches();
        if (touches.length > 0) {
            const touch = touches[0];
            this._isTouching = true;
            this._lastTouchX = touch.getLocationX();
        }
    }

    private onTouchEnd(event: EventTouch): void {
        this._isTouching = false;
    }

    private onTouchMove(event: EventTouch): void {
        this.updatePaddlePosition(event.getLocation());
    }

    private onMouseMove(event: any): void {
        this.updatePaddlePosition(event.getLocation());
    }

    private updatePaddlePosition(screenPos: Vec2): void {
        if (!this._camera || !this._uiTransform) return;

        const worldPos = this._camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));
        const localPos = this.node.parent?.getComponent(UITransform)?.convertToNodeSpaceAR(worldPos) || worldPos;

        // 设置目标位置而不是直接移动 - 添加惯性感
        this._targetX = this.clampToScreenBounds(localPos.x);
    }

    // 公共访问器供测试使用
    public get isTouching(): boolean {
        return this._isTouching;
    }

    public get lastTouchX(): number {
        return this._lastTouchX;
    }

    public get screenWidth(): number {
        return this._screenWidth;
    }

    public set screenWidth(value: number) {
        this._screenWidth = value;
    }
    
    // ===== 动态尺寸管理系统 =====
    
    /**
     * 更新paddle尺寸 - 同时更新精灵、碰撞器、边界计算
     */
    private updatePaddleSize(): void {
        if (!this._boxCollider || !this._sprite) return;
        
        // 更新碰撞器尺寸
        this._boxCollider.size.width = this.basePaddleWidth * this._currentScale;
        this._boxCollider.size.height = this.basePaddleHeight * this._currentScale;
        
        // 更新精灵缩放 (保持原始精灵比例)
        this.node.setScale(this._currentScale, this._currentScale, 1);
        
        // 更新当前宽度用于边界计算
        this._currentWidth = this.basePaddleWidth * this._currentScale;
        
        console.log(`Paddle size updated: scale=${this._currentScale}, width=${this._currentWidth}`);
    }
    
    /**
     * 设置paddle缩放 - 道具效果调用
     * @param scale 缩放倍数 (1.0=正常, 1.5=150%, 0.8=80%)
     */
    public setPaddleScale(scale: number): void {
        this._currentScale = Math.max(0.3, Math.min(3.0, scale)); // 限制30%-300%
        this.updatePaddleSize();
    }
    
    /**
     * 增加paddle尺寸 - 道具效果
     * @param multiplier 倍数增量 (1.2=增加20%)
     */
    public enlargePaddle(multiplier: number = 1.3): void {
        this.setPaddleScale(this._currentScale * multiplier);
    }
    
    /**
     * 缩小paddle尺寸 - 负面效果
     * @param multiplier 倍数减量 (0.8=减少20%)
     */
    public shrinkPaddle(multiplier: number = 0.7): void {
        this.setPaddleScale(this._currentScale * multiplier);
    }
    
    /**
     * 重置paddle到基础尺寸
     */
    public resetPaddleSize(): void {
        this.setPaddleScale(1.0);
    }
    
    /**
     * 获取当前paddle实际宽度 - 供其他系统使用
     */
    public getCurrentWidth(): number {
        return this._currentWidth;
    }
    
    /**
     * 获取当前缩放倍数
     */
    public getCurrentScale(): number {
        return this._currentScale;
    }
}