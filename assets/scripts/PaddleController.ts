import { _decorator, Component, Node, input, Input, EventTouch, Vec3, UITransform, Canvas, Camera, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaddleController')
export class PaddleController extends Component {
    @property
    public moveSpeed: number = 500;

    private _canvasComponent: Canvas | null = null;
    private _uiTransform: UITransform | null = null;
    private _camera: Camera | null = null;
    
    protected onLoad(): void {
        this._uiTransform = this.getComponent(UITransform);
        this._canvasComponent = this.node.parent?.getComponent(Canvas) || null;
        this._camera = this._canvasComponent?.cameraComponent || null;
    }

    protected onEnable(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
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

        const paddleHalfWidth = this._uiTransform.width / 2;
        const canvasWidth = this._canvasComponent?.getComponent(UITransform)?.width || 960;
        const leftBound = -canvasWidth / 2 + paddleHalfWidth;
        const rightBound = canvasWidth / 2 - paddleHalfWidth;

        const clampedX = Math.max(leftBound, Math.min(rightBound, localPos.x));
        this.node.setPosition(clampedX, this.node.position.y, this.node.position.z);
    }
}