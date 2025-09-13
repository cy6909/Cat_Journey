import { _decorator, Component, Node, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('BossController')
export class BossController extends Component {
    @property
    public maxHealth: number = 100;
    
    @property
    public attackDamage: number = 1;
    
    @property
    public attackInterval: number = 5.0;
    
    @property
    public moveSpeed: number = 50;
    
    @property
    public scoreValue: number = 500;
    
    private _currentHealth: number = 0;
    private _lastAttackTime: number = 0;
    private _moveDirection: number = 1;
    
    protected onLoad(): void {
        this._currentHealth = this.maxHealth;
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    
    protected start(): void {
        this.schedule(this.performAttack, this.attackInterval);
    }
    
    protected update(dt: number): void {
        this.updateMovement(dt);
        this.updateAttackTimer(dt);
    }
    
    private updateMovement(dt: number): void {
        const currentPos = this.node.position;
        const newX = currentPos.x + this._moveDirection * this.moveSpeed * dt;
        
        // Bounce off screen edges
        if (newX > 400 || newX < -400) {
            this._moveDirection *= -1;
        }
        
        this.node.setPosition(newX, currentPos.y, currentPos.z);
    }
    
    private updateAttackTimer(dt: number): void {
        this._lastAttackTime += dt;
    }
    
    private performAttack(): void {
        console.log(`Boss attacks! Dealing ${this.attackDamage} damage`);
        
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            // Boss attack causes core damage
            this.scheduleOnce(() => {
                gameManager.onCoreAttacked(this.attackDamage);
            }, 0.1);
        }
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const otherNode = otherCollider.node;
        
        // Check if hit by ball
        if (otherNode.name.includes('Ball')) {
            const ballScript = otherNode.getComponent('Ball');
            const damage = ballScript ? (ballScript as any).getDamage() : 1;
            this.takeDamage(damage);
        }
        
        // Check if hit by laser
        if (otherNode.name.includes('Laser')) {
            this.takeDamage(2);
            otherNode.destroy();
        }
    }
    
    public takeDamage(damage: number): void {
        this._currentHealth -= damage;
        console.log(`Boss takes ${damage} damage. Health: ${this._currentHealth}/${this.maxHealth}`);
        
        if (this._currentHealth <= 0) {
            this.onDestroyed();
        } else {
            // Visual feedback for damage
            this.showDamageEffect();
        }
    }
    
    private showDamageEffect(): void {
        // Flash effect - change color briefly
        const sprite = this.getComponent('cc.Sprite');
        if (sprite) {
            (sprite as any).color = { r: 255, g: 100, b: 100, a: 255 };
            this.scheduleOnce(() => {
                (sprite as any).color = { r: 255, g: 255, b: 255, a: 255 };
            }, 0.1);
        }
    }
    
    private onDestroyed(): void {
        console.log('Boss defeated!');
        
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            gameManager.onBossDefeated(this.scoreValue);
        }
        
        // Cleanup
        this.unschedule(this.performAttack);
        this.node.destroy();
    }
    
    public getCurrentHealth(): number {
        return this._currentHealth;
    }
    
    public getMaxHealth(): number {
        return this.maxHealth;
    }
    
    public setHealth(health: number): void {
        this.maxHealth = health;
        this._currentHealth = health;
    }
}