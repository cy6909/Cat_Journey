import { _decorator, Component, Node, RigidBody2D, Vec2, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Laser')
export class Laser extends Component {
    @property
    public speed: number = 800;

    @property
    public damage: number = 1;

    private _rigidBody: RigidBody2D | null = null;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        
        if (this._rigidBody) {
            this._rigidBody.linearVelocity = new Vec2(0, this.speed);
        }

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 3.0);
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D): void {
        const brickScript = otherCollider.getComponent('Brick');
        if (brickScript) {
            (brickScript as any).takeDamage(this.damage);
            this.node.destroy();
        } else if (otherCollider.node.name.includes('Wall')) {
            this.node.destroy();
        }
    }

    public setDamage(damage: number): void {
        this.damage = damage;
    }
}