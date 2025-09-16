import { _decorator, Component, Node, input, Input, EventTouch, Vec3, UITransform, Canvas, Camera, Vec2, Collider2D, Contact2DType, IPhysics2DContact, Color, Sprite, Label, tween } from 'cc';
import { GameManager } from './GameManager';
import { CoreController } from '../managers/CoreController';

const { ccclass, property } = _decorator;

@ccclass('EnhancedPaddleController')
export class EnhancedPaddleController extends Component {
    @property
    public moveSpeed: number = 500;
    
    @property
    public maxDurability: number = 100;
    
    @property
    public durabilityLossPerHit: number = 5;
    
    @property
    public repairRate: number = 2; // Durability per second repair when not taking damage
    
    @property
    public repairDelay: number = 3; // Seconds after damage before repair starts
    
    @property
    public criticalDurabilityThreshold: number = 25; // When paddle becomes "critical"
    
    @property({type: Label})
    public durabilityLabel: Label | null = null;

    private _canvasComponent: Canvas | null = null;
    private _uiTransform: UITransform | null = null;
    private _camera: Camera | null = null;
    private _sprite: Sprite | null = null;
    
    // Durability system
    private _currentDurability: number = 0;
    private _lastDamageTime: number = 0;
    private _isRepairing: boolean = false;
    private _originalColor: Color = new Color(255, 255, 255, 255);
    private _level: number = 1;
    private _experience: number = 0;
    private _experienceToNextLevel: number = 100;
    
    // Enhanced stats per level
    private _speedMultiplier: number = 1.0;
    private _durabilityMultiplier: number = 1.0;
    private _repairEfficiency: number = 1.0;
    
    protected onLoad(): void {
        this._uiTransform = this.getComponent(UITransform);
        this._canvasComponent = this.node.parent?.getComponent(Canvas) || null;
        this._camera = this._canvasComponent?.cameraComponent || null;
        this._sprite = this.getComponent(Sprite);
        this._currentDurability = this.maxDurability;
        
        if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
        }
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onEnable(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
    
    protected update(dt: number): void {
        this.updateRepair(dt);
        this.updateVisualState();
        this.updateDurabilityLabel();
        this._lastDamageTime += dt;
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
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // Handle collision with ball - this damages the paddle
        if (otherCollider.tag === 1000) { // Ball tag
            this.takeDamage(this.durabilityLossPerHit);
        }
        
        // Handle collision with boss attacks or other damaging entities
        if (otherCollider.tag === 3000) { // Boss attack tag
            this.takeDamage(this.durabilityLossPerHit * 2); // Boss attacks do more damage
        }
        
        // Handle experience orb collection
        if (otherCollider.tag === 4000) { // Experience orb tag
            this.gainExperience(10);
            otherCollider.node.destroy();
        }
    }
    
    public takeDamage(damage: number): void {
        const actualDamage = Math.max(1, damage - this.getDamageReduction());
        this._currentDurability = Math.max(0, this._currentDurability - actualDamage);
        this._lastDamageTime = 0;
        this._isRepairing = false;
        
        // Visual feedback
        this.showDamageEffect();
        
        // Check if paddle is destroyed
        if (this._currentDurability <= 0) {
            this.onPaddleDestroyed();
        }
        
        console.log(`Paddle took ${actualDamage} damage. Durability: ${this._currentDurability}/${this.maxDurability * this._durabilityMultiplier}`);
    }
    
    private updateRepair(dt: number): void {
        if (this._lastDamageTime >= this.repairDelay && this._currentDurability < this.maxDurability * this._durabilityMultiplier) {
            if (!this._isRepairing) {
                this._isRepairing = true;
                console.log('Paddle repair started');
            }
            
            this._currentDurability = Math.min(
                this.maxDurability * this._durabilityMultiplier,
                this._currentDurability + this.repairRate * this._repairEfficiency * dt
            );
        }
    }
    
    private updateVisualState(): void {
        if (!this._sprite) return;
        
        const durabilityRatio = this._currentDurability / (this.maxDurability * this._durabilityMultiplier);
        
        if (durabilityRatio <= 0.25) {
            // Critical state - red and flashing
            this._sprite.color = Color.RED;
            if (!this.node.getComponent('CriticalFlash')) {
                this.addCriticalFlashEffect();
            }
        } else if (durabilityRatio <= 0.5) {
            // Warning state - orange
            this._sprite.color = Color.YELLOW;
        } else if (durabilityRatio <= 0.75) {
            // Slightly damaged - light yellow
            this._sprite.color = new Color(255, 255, 200, 255);
        } else {
            // Healthy state
            this._sprite.color = this._originalColor;
        }
    }
    
    private addCriticalFlashEffect(): void {
        if (this._sprite && this._sprite.color) {
            tween(this._sprite)
                .to(0.2, { color: Color.RED })
                .to(0.2, { color: Color.WHITE })
                .union()
                .repeatForever()
                .start();
        }
        
        // Tag to prevent multiple flash effects
        this.node.addComponent('CriticalFlash');
    }
    
    private showDamageEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.1, { color: Color.WHITE })
            .to(0.1, { color: this._sprite.color })
            .start();
    }
    
    private updateDurabilityLabel(): void {
        if (!this.durabilityLabel) return;
        
        const maxDur = Math.floor(this.maxDurability * this._durabilityMultiplier);
        const currentDur = Math.floor(this._currentDurability);
        this.durabilityLabel.string = `Paddle: ${currentDur}/${maxDur}`;
        
        // Color code the label
        const ratio = this._currentDurability / (this.maxDurability * this._durabilityMultiplier);
        if (ratio <= 0.25) {
            this.durabilityLabel.color = Color.RED;
        } else if (ratio <= 0.5) {
            this.durabilityLabel.color = Color.YELLOW;
        } else {
            this.durabilityLabel.color = Color.WHITE;
        }
    }
    
    public gainExperience(xp: number): void {
        this._experience += xp;
        console.log(`Paddle gained ${xp} XP. Total: ${this._experience}/${this._experienceToNextLevel}`);
        
        while (this._experience >= this._experienceToNextLevel) {
            this.levelUp();
        }
    }
    
    private levelUp(): void {
        this._experience -= this._experienceToNextLevel;
        this._level++;
        this._experienceToNextLevel = Math.floor(this._experienceToNextLevel * 1.5);
        
        // Increase stats per level
        this._speedMultiplier += 0.1;
        this._durabilityMultiplier += 0.2;
        this._repairEfficiency += 0.15;
        
        // Heal paddle on level up
        this._currentDurability = Math.min(
            this.maxDurability * this._durabilityMultiplier,
            this._currentDurability + (this.maxDurability * 0.5)
        );
        
        console.log(`Paddle leveled up to ${this._level}! Stats increased.`);
    }
    
    private getDamageReduction(): number {
        // Higher level paddles have some damage reduction
        return Math.floor(this._level * 0.5);
    }
    
    private onPaddleDestroyed(): void {
        console.log('Paddle destroyed! Core is now exposed.');
        
        // Find and damage the core directly
        const coreController = this.node.parent?.getComponentInChildren(CoreController);
        if (coreController) {
            // Core takes continuous damage when paddle is destroyed
            this.schedule(() => {
                coreController.takeDamage(5);
            }, 1.0); // Damage core every second
        }
        
        // Hide paddle but don't destroy node (core still needs to function)
        if (this._sprite) {
            this._sprite.color = Color.TRANSPARENT;
        }
        
        // Disable input
        this.enabled = false;
        
        // Notify GameManager
        const gameManager = GameManager.getInstance();
        if (gameManager && (gameManager as any).onPaddleDestroyed) {
            (gameManager as any).onPaddleDestroyed();
        }
    }
    
    // Public accessors
    public get currentDurability(): number { return this._currentDurability; }
    public get maxDurabilityValue(): number { return this.maxDurability * this._durabilityMultiplier; }
    public get level(): number { return this._level; }
    public get isDestroyed(): boolean { return this._currentDurability <= 0; }
    
    // Repair methods for external systems
    public instantRepair(amount: number): void {
        this._currentDurability = Math.min(
            this.maxDurability * this._durabilityMultiplier,
            this._currentDurability + amount
        );
        console.log(`Paddle repaired for ${amount} durability`);
    }
    
    public fullRepair(): void {
        this._currentDurability = this.maxDurability * this._durabilityMultiplier;
        console.log('Paddle fully repaired');
    }
}