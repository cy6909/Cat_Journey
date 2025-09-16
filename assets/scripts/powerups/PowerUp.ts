import { _decorator, Component, Node, Collider2D, Contact2DType, RigidBody2D, Vec2 } from 'cc';
import { GameManager } from '../gameplay/GameManager';
const { ccclass, property } = _decorator;

@ccclass('PowerUp')
export abstract class PowerUp extends Component {
    @property
    public fallSpeed: number = 200;

    @property
    public duration: number = 10.0;

    private _rigidBody: RigidBody2D | null = null;
    private _isCollected: boolean = false;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        if (this._rigidBody) {
            this._rigidBody.linearVelocity = new Vec2(0, -this.fallSpeed);
        }
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D): void {
        if (this._isCollected) return;

        if (otherCollider.node.name === 'Paddle' || otherCollider.getComponent('PaddleController')) {
            this.collectPowerUp();
        } else if (otherCollider.getComponent('DeathZone')) {
            this.node.destroy();
        }
    }

    private collectPowerUp(): void {
        if (this._isCollected) return;
        
        this._isCollected = true;
        this.activateEffect();
        
        if (this.duration > 0) {
            this.scheduleOnce(() => {
                this.deactivateEffect();
            }, this.duration);
        }

        this.node.destroy();
    }

    protected abstract activateEffect(): void;

    protected deactivateEffect(): void {
    }

    protected getGameManager(): GameManager | null {
        return GameManager.getInstance();
    }
}