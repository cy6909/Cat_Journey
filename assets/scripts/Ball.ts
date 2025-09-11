import { _decorator, Component, Node, RigidBody2D, Vec2, PhysicsMaterial } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    @property
    public initialSpeed: number = 400;

    @property
    public maxSpeed: number = 600;

    private _rigidBody: RigidBody2D | null = null;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        
        if (this._rigidBody) {
            const physicsMaterial = new PhysicsMaterial();
            physicsMaterial.friction = 0.0;
            physicsMaterial.restitution = 1.0;
            
            const colliders = this.node.getComponents('cc.Collider2D');
            colliders.forEach(collider => {
                (collider as any).material = physicsMaterial;
            });
        }
    }

    protected start(): void {
        this.launch();
    }

    public launch(): void {
        if (!this._rigidBody) return;

        const angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
        const velocity = new Vec2(
            Math.cos(angle) * this.initialSpeed,
            Math.sin(angle) * this.initialSpeed
        );

        this._rigidBody.linearVelocity = velocity;
    }

    public resetBall(): void {
        if (!this._rigidBody) return;
        
        this.node.setPosition(0, 0, 0);
        this._rigidBody.linearVelocity = new Vec2(0, 0);
        this.scheduleOnce(() => this.launch(), 1.0);
    }

    protected update(): void {
        if (!this._rigidBody) return;

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