import { _decorator, Component, Node, Collider2D, Contact2DType, RigidBody2D, Vec2, Sprite, Color, UITransform } from 'cc';
import { GameManager } from '../gameplay/GameManager';
const { ccclass, property } = _decorator;

export enum PowerUpType {
    MULTI_BALL = 0,
    LASER_PADDLE = 1,
    LARGER_PADDLE = 2,
    SMALLER_PADDLE = 3,
    FASTER_BALL = 4,
    SLOWER_BALL = 5
}

@ccclass('PowerUp')
export abstract class PowerUp extends Component {
    @property
    public fallSpeed: number = 200;

    @property
    public duration: number = 10.0;
    
    @property({type: PowerUpType})
    public powerUpType: PowerUpType = PowerUpType.MULTI_BALL;

    private _rigidBody: RigidBody2D | null = null;
    private _isCollected: boolean = false;
    private _sprite: Sprite | null = null;

    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        this._sprite = this.getComponent(Sprite);
        
        // Initialize programmatic visual appearance
        this.initializePowerUpVisual();
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        if (this._rigidBody) {
            this._rigidBody.linearVelocity = new Vec2(0, -this.fallSpeed);
        }
    }
    
    /**
     * 程序化生成PowerUp视觉效果 - 简单几何形状方案
     * Following the discussion.md approach: simple geometric shapes instead of complex sprites
     */
    protected initializePowerUpVisual(): void {
        if (!this._sprite) return;
        
        // Set base size for all power-ups
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(32, 32); // Standard 32x32 size
        }
        
        // Generate geometric shape based on power-up type
        switch (this.powerUpType) {
            case PowerUpType.MULTI_BALL:
                // Yellow circle ⭐ - represents multiple balls
                this._sprite.color = new Color(255, 255, 0, 255); // Bright yellow
                // Note: Sprite shape determined by SpriteFrame, color makes it distinctive
                break;
                
            case PowerUpType.LASER_PADDLE:
                // Red rectangle 🔴 - represents laser weapon
                this._sprite.color = new Color(255, 0, 0, 255); // Bright red
                if (transform) {
                    transform.setContentSize(40, 20); // Rectangle shape
                }
                break;
                
            case PowerUpType.LARGER_PADDLE:
                // Green plus/expand shape - represents paddle enlargement
                this._sprite.color = new Color(0, 255, 0, 255); // Bright green
                if (transform) {
                    transform.setContentSize(36, 36); // Slightly larger
                }
                break;
                
            case PowerUpType.SMALLER_PADDLE:
                // Orange minus/contract shape - represents paddle shrinking (negative effect)
                this._sprite.color = new Color(255, 165, 0, 255); // Orange warning
                if (transform) {
                    transform.setContentSize(24, 24); // Slightly smaller
                }
                break;
                
            case PowerUpType.FASTER_BALL:
                // Cyan arrow/speed lines - represents acceleration
                this._sprite.color = new Color(0, 255, 255, 255); // Cyan
                break;
                
            case PowerUpType.SLOWER_BALL:
                // Blue snail/slow effect - represents deceleration
                this._sprite.color = new Color(0, 100, 255, 255); // Blue
                break;
        }
        
        console.log(`PowerUp visual initialized: Type ${PowerUpType[this.powerUpType]}, Color: ${this._sprite.color.toString()}`);
    }
    
    /**
     * Get power-up type name for debugging and UI display
     */
    public getPowerUpTypeName(): string {
        return PowerUpType[this.powerUpType] || 'UNKNOWN';
    }
    
    /**
     * Get power-up description for player feedback
     */
    public getPowerUpDescription(): string {
        switch (this.powerUpType) {
            case PowerUpType.MULTI_BALL:
                return "Spawns 2 additional balls";
            case PowerUpType.LASER_PADDLE:
                return "Paddle can shoot lasers for 10 seconds";
            case PowerUpType.LARGER_PADDLE:
                return "Paddle becomes larger";
            case PowerUpType.SMALLER_PADDLE:
                return "Paddle becomes smaller (negative effect)";
            case PowerUpType.FASTER_BALL:
                return "Ball moves faster";
            case PowerUpType.SLOWER_BALL:
                return "Ball moves slower";
            default:
                return "Unknown power-up effect";
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
        console.log(`Collected power-up: ${this.getPowerUpTypeName()} - ${this.getPowerUpDescription()}`);
        
        this.activateEffect();
        
        if (this.duration > 0) {
            this.scheduleOnce(() => {
                this.deactivateEffect();
                console.log(`Power-up expired: ${this.getPowerUpTypeName()}`);
            }, this.duration);
        }

        this.node.destroy();
    }

    protected abstract activateEffect(): void;

    protected deactivateEffect(): void {
        // Default implementation - override in derived classes if needed
    }

    protected getGameManager(): GameManager | null {
        return GameManager.getInstance();
    }
}