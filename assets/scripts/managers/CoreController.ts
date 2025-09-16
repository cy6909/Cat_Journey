import { _decorator, Component, Node, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact, Vec3 } from 'cc';
import { GameManager } from '../gameplay/GameManager';

const { ccclass, property } = _decorator;

@ccclass('CoreController')
export class CoreController extends Component {
    @property
    public maxCoreHealth: number = 10;
    
    @property
    public regenRate: number = 0.1; // Health per second regeneration
    
    @property
    public regenDelay: number = 5.0; // Seconds after damage before regen starts
    
    @property
    public experienceCapacity: number = 100; // XP needed for core upgrade
    
    private _currentCoreHealth: number = 0;
    private _currentExperience: number = 0;
    private _coreLevel: number = 1;
    private _lastDamageTime: number = 0;
    private _isRegenerating: boolean = false;
    
    protected onLoad(): void {
        this._currentCoreHealth = this.maxCoreHealth;
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    
    protected update(dt: number): void {
        this.updateRegeneration(dt);
        this._lastDamageTime += dt;
    }
    
    private updateRegeneration(dt: number): void {
        if (this._lastDamageTime >= this.regenDelay && this._currentCoreHealth < this.maxCoreHealth) {
            if (!this._isRegenerating) {
                this._isRegenerating = true;
                console.log('Core regeneration started');
            }
            
            this._currentCoreHealth = Math.min(
                this.maxCoreHealth,
                this._currentCoreHealth + this.regenRate * dt
            );
            
            this.updateHealthDisplay();
        } else {
            this._isRegenerating = false;
        }
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const otherNode = otherCollider.node;
        
        // Ball hit core directly (missed paddle)
        if (otherNode.name.includes('Ball')) {
            const ballScript = otherNode.getComponent('Ball');
            const damage = ballScript ? (ballScript as any).getDamage() : 1;
            this.takeDamage(damage, 'Ball impact');
        }
        
        // Experience orb collection
        if (otherNode.name.includes('ExperienceOrb')) {
            const xpValue = 10; // Could be configurable per orb type
            this.addExperience(xpValue);
            otherNode.destroy();
        }
        
        // Boss attack hit core
        if (otherNode.name.includes('BossAttack')) {
            const attackDamage = 2; // Boss attacks are stronger
            this.takeDamage(attackDamage, 'Boss attack');
            otherNode.destroy();
        }
    }
    
    public takeDamage(damage: number, source: string = 'Unknown'): void {
        this._currentCoreHealth -= damage;
        this._lastDamageTime = 0; // Reset regen timer
        this._isRegenerating = false;
        
        console.log(`Core takes ${damage} damage from ${source}. Health: ${this._currentCoreHealth}/${this.maxCoreHealth}`);
        
        this.updateHealthDisplay();
        this.showDamageEffect();
        
        if (this._currentCoreHealth <= 0) {
            this.onCoreDestroyed();
        }
    }
    
    public healCore(amount: number): void {
        this._currentCoreHealth = Math.min(this.maxCoreHealth, this._currentCoreHealth + amount);
        console.log(`Core healed by ${amount}. Health: ${this._currentCoreHealth}/${this.maxCoreHealth}`);
        this.updateHealthDisplay();
    }
    
    public addExperience(xp: number): void {
        this._currentExperience += xp;
        console.log(`Core gains ${xp} XP. Total: ${this._currentExperience}/${this.experienceCapacity}`);
        
        if (this._currentExperience >= this.experienceCapacity) {
            this.levelUpCore();
        }
    }
    
    private levelUpCore(): void {
        this._coreLevel++;
        this._currentExperience = 0;
        
        // Increase core stats on level up
        this.maxCoreHealth += 2;
        this._currentCoreHealth = this.maxCoreHealth; // Full heal on level up
        this.regenRate += 0.05;
        
        console.log(`Core leveled up! New level: ${this._coreLevel}`);
        console.log(`Core stats - Health: ${this.maxCoreHealth}, Regen: ${this.regenRate}/sec`);
        
        this.showLevelUpEffect();
        this.updateHealthDisplay();
    }
    
    private onCoreDestroyed(): void {
        console.log('Core destroyed! Game Over!');
        
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            // Core destruction triggers game over
            gameManager.onCoreDestroyed();
        }
        
        this.showDestroyedEffect();
    }
    
    private updateHealthDisplay(): void {
        // Update visual representation of core health
        const sprite = this.getComponent('cc.Sprite');
        if (sprite) {
            // Change color based on health percentage
            const healthPercent = this._currentCoreHealth / this.maxCoreHealth;
            
            if (healthPercent > 0.7) {
                (sprite as any).color = { r: 100, g: 255, b: 100, a: 255 }; // Green
            } else if (healthPercent > 0.3) {
                (sprite as any).color = { r: 255, g: 255, b: 100, a: 255 }; // Yellow
            } else {
                (sprite as any).color = { r: 255, g: 100, b: 100, a: 255 }; // Red
            }
            
            // Regeneration glow effect
            if (this._isRegenerating) {
                (sprite as any).color = { r: 150, g: 255, b: 255, a: 255 }; // Cyan glow
            }
        }
    }
    
    private showDamageEffect(): void {
        // Flash effect when taking damage
        const sprite = this.getComponent('cc.Sprite');
        if (sprite) {
            const originalColor = (sprite as any).color;
            (sprite as any).color = { r: 255, g: 50, b: 50, a: 255 };
            
            this.scheduleOnce(() => {
                (sprite as any).color = originalColor;
            }, 0.2);
        }
    }
    
    private showLevelUpEffect(): void {
        // Bright flash for level up
        const sprite = this.getComponent('cc.Sprite');
        if (sprite) {
            (sprite as any).color = { r: 255, g: 255, b: 255, a: 255 };
            
            // Pulse effect
            for (let i = 0; i < 3; i++) {
                this.scheduleOnce(() => {
                    (sprite as any).color = { r: 255, g: 255, b: 100, a: 255 };
                }, i * 0.2);
                
                this.scheduleOnce(() => {
                    (sprite as any).color = { r: 255, g: 255, b: 255, a: 255 };
                }, i * 0.2 + 0.1);
            }
        }
    }
    
    private showDestroyedEffect(): void {
        // Destruction effect - fade to dark
        const sprite = this.getComponent('cc.Sprite');
        if (sprite) {
            (sprite as any).color = { r: 50, g: 50, b: 50, a: 255 };
        }
    }
    
    // Public getters for UI and game logic
    public getCurrentHealth(): number {
        return this._currentCoreHealth;
    }
    
    public getMaxHealth(): number {
        return this.maxCoreHealth;
    }
    
    public getCurrentExperience(): number {
        return this._currentExperience;
    }
    
    public getExperienceCapacity(): number {
        return this.experienceCapacity;
    }
    
    public getCoreLevel(): number {
        return this._coreLevel;
    }
    
    public isRegenerating(): boolean {
        return this._isRegenerating;
    }
    
    public getHealthPercent(): number {
        return this._currentCoreHealth / this.maxCoreHealth;
    }
}