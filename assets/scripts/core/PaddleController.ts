import { _decorator, Component, Node, input, Input, EventTouch, Vec3, UITransform, Canvas, Camera, Vec2, Touch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaddleController')
export class PaddleController extends Component {
    @property
    public speed: number = 300;
    
    @property
    public paddleWidth: number = 100;
    
    @property
    public boundaryMargin: number = 50;

    @property
    public moveSpeed: number = 500;

    private _canvasComponent: Canvas | null = null;
    private _uiTransform: UITransform | null = null;
    private _camera: Camera | null = null;
    private _isTouching: boolean = false;
    private _lastTouchX: number = 0;
    private _screenWidth: number = 960;
    
    protected onLoad(): void {
        this._uiTransform = this.getComponent(UITransform);
        this._canvasComponent = this.node.parent?.getComponent(Canvas) || null;
        this._camera = this._canvasComponent?.cameraComponent || null;
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

    // 测试需要的移动方法
    public moveLeft(deltaTime: number): void {
        const currentPos = this.node.getPosition();
        const newX = currentPos.x - this.speed * deltaTime;
        const clampedX = this.clampToScreenBounds(newX);
        this.node.setPosition(clampedX, currentPos.y, currentPos.z);
    }

    public moveRight(deltaTime: number): void {
        const currentPos = this.node.getPosition();
        const newX = currentPos.x + this.speed * deltaTime;
        const clampedX = this.clampToScreenBounds(newX);
        this.node.setPosition(clampedX, currentPos.y, currentPos.z);
    }

    private clampToScreenBounds(x: number): number {
        const leftBound = -(this._screenWidth / 2) + (this.paddleWidth / 2) + this.boundaryMargin;
        const rightBound = (this._screenWidth / 2) - (this.paddleWidth / 2) - this.boundaryMargin;
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

        const clampedX = this.clampToScreenBounds(localPos.x);
        this.node.setPosition(clampedX, this.node.position.y, this.node.position.z);
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
}