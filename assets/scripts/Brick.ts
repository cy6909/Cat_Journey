import { _decorator, Component, Node, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, Sprite, Color, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { RelicManager, RelicType } from './RelicManager';
const { ccclass, property } = _decorator;

@ccclass('Brick')
export class Brick extends Component {
    @property
    public health: number = 1;

    @property
    public maxHealth: number = 1;

    @property
    public scoreValue: number = 10;

    private _sprite: Sprite | null = null;
    private _originalColor: Color = new Color();

    protected onLoad(): void {
        this._sprite = this.getComponent(Sprite);
        if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
        }

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (otherCollider.node.name === 'Ball' || otherCollider.getComponent('Ball')) {
            this.takeDamage(1);
        }
    }

    public takeDamage(damage: number): void {
        this.health -= damage;
        this.updateVisual();

        if (this.health <= 0) {
            this.destroyBrick();
        }
    }

    private updateVisual(): void {
        if (!this._sprite) return;

        const healthRatio = this.health / this.maxHealth;
        const newColor = this._originalColor.clone();
        newColor.a = Math.max(0.3, healthRatio) * 255;
        this._sprite.color = newColor;
    }

    private destroyBrick(): void {
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            gameManager.onBrickDestroyed(this.scoreValue, this.node.position.clone());
        }

        const relicManager = RelicManager.getInstance();
        if (relicManager && relicManager.hasRelic(RelicType.EXPLOSIVE_BRICKS)) {
            this.explodeBrick();
        }
        
        this.node.destroy();
    }

    private explodeBrick(): void {
        const gameManager = GameManager.getInstance();
        if (!gameManager || !gameManager.brickContainer) return;

        const explosionRadius = 100;
        const brickPosition = this.node.position;
        const bricks = gameManager.brickContainer.children;

        for (const brick of bricks) {
            if (brick === this.node) continue;

            const distance = Vec3.distance(brickPosition, brick.position);
            if (distance <= explosionRadius) {
                const brickScript = brick.getComponent('Brick');
                if (brickScript) {
                    (brickScript as any).takeDamage(1);
                }
            }
        }

        console.log(`Explosive brick detonated! Damaged bricks within ${explosionRadius} units.`);
    }

    public setHealth(health: number): void {
        this.health = health;
        this.maxHealth = health;
        this.updateVisual();
    }
}