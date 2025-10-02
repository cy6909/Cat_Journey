import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, Color, Sprite, tween, Vec3, Prefab, instantiate, RigidBody2D, Vec2, Enum } from 'cc';
import { GameManager } from './GameManager';
import { RelicManager } from '../managers/RelicManager';

const { ccclass, property } = _decorator;

export enum BrickType {
    NORMAL = 0,
    REINFORCED = 1,        // 需要多次击打
    EXPLOSIVE = 2,         // 爆炸砖块
    ELECTRIC = 3,          // 导电砖块
    EXPERIENCE = 4,        // 经验砖块
    REGENERATING = 5,      // 自我修复砖块
    PHASE = 6,            // 相位砖块(有时穿透)
    MAGNETIC = 7,          // 磁性砖块(吸引球)
    REFLECTIVE = 8,        // 反射砖块(改变球方向)
    POISON = 9,           // 毒性砖块(持续伤害)
    ICE = 10,             // 冰冻砖块(减慢球速)
    FIRE = 11,            // 火焰砖块(加速球)
    SPLITTING = 12,       // 分裂砖块(分裂成多个)
    TELEPORT = 13,        // 传送砖块(球随机传送)
    SHIELD = 14,          // 护盾砖块(保护周围砖块)
    GRAVITY = 15,         // 重力砖块(改变重力)
    TIME = 16,            // 时间砖块(减慢/加速时间)
    HEALING = 17,         // 治疗砖块(修复挡板)
    CURSED = 18,          // 诅咒砖块(负面效果)
    CRYSTAL = 19,         // 水晶砖块(连锁反应)
    RUBBER = 20,          // 橡胶砖块(超强反弹)
    METAL = 21,           // 金属砖块(反弹伤害)
    VOID = 22,            // 虚空砖块(吞噬球)
    LIGHT = 23,           // 光明砖块(照亮区域)
    DARK = 24             // 黑暗砖块(减少视野)
}

@ccclass('EnhancedBrick')
export class EnhancedBrick extends Component {
    @property({type: Enum(BrickType)})
    public brickType: BrickType = BrickType.NORMAL;
    
    @property
    public health: number = 1;
    
    @property  
    public scoreValue: number = 10;
    
    @property
    public experienceValue: number = 5;
    
    @property({type: Prefab})
    public experienceOrbPrefab: Prefab | null = null;
    
    // Type-specific properties
    @property
    public explosionRadius: number = 100;
    
    @property
    public electricChainDistance: number = 80;
    
    @property
    public magneticForce: number = 300;
    
    @property
    public regenerationRate: number = 0.1; // Health per second
    
    @property
    public phaseProbability: number = 0.3; // 30% chance to phase
    
    private _maxHealth: number = 0;
    private _sprite: Sprite | null = null;
    private _originalColor: Color = new Color();
    private _lastHitTime: number = 0;
    private _isElectric: boolean = false;
    private _isShielded: boolean = false;
    private _regenerationTimer: number = 0;
    
    protected onLoad(): void {
        this._maxHealth = this.health;
        this._sprite = this.getComponent(Sprite);
        
        if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
        }
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        
        this.initializeBrickType();
    }
    
    protected update(dt: number): void {
        this._lastHitTime += dt;
        
        // Handle regenerating bricks
        if (this.brickType === BrickType.REGENERATING && this.health < this._maxHealth) {
            this._regenerationTimer += dt;
            if (this._regenerationTimer >= 1.0) {
                this.health = Math.min(this._maxHealth, this.health + this.regenerationRate);
                this.updateVisualState();
                this._regenerationTimer = 0;
            }
        }
        
        // Handle time-based effects
        this.updateTimeBasedEffects(dt);
    }
    
    public initializeBrickType(): void {
        switch (this.brickType) {
            case BrickType.NORMAL:
                this.setBrickColor(Color.RED);
                break;
            case BrickType.REINFORCED:
                this.health = 3;
                this._maxHealth = 3;
                this.setBrickColor(Color.BLUE);
                this.scoreValue = 30;
                break;
            case BrickType.EXPLOSIVE:
                this.setBrickColor(Color.YELLOW);
                this.scoreValue = 25;
                break;
            case BrickType.ELECTRIC:
                this.setBrickColor(new Color(0, 255, 255)); // Cyan
                this.scoreValue = 20;
                break;
            case BrickType.EXPERIENCE:
                this.setBrickColor(Color.GREEN);
                this.experienceValue = 20;
                break;
            case BrickType.REGENERATING:
                this.health = 2;
                this._maxHealth = 2;
                this.setBrickColor(new Color(255, 0, 255)); // Magenta
                break;
            case BrickType.PHASE:
                this.setBrickColor(new Color(128, 128, 255)); // Light blue
                break;
            case BrickType.MAGNETIC:
                this.setBrickColor(new Color(128, 0, 128)); // Purple
                break;
            case BrickType.REFLECTIVE:
                this.setBrickColor(new Color(255, 215, 0)); // Gold
                this.scoreValue = 15;
                break;
            case BrickType.POISON:
                this.setBrickColor(new Color(128, 255, 0)); // Lime green
                this.scoreValue = 18;
                break;
            case BrickType.ICE:
                this.setBrickColor(new Color(200, 255, 255)); // Light cyan
                break;
            case BrickType.FIRE:
                this.setBrickColor(new Color(255, 100, 0)); // Orange
                break;
            case BrickType.SPLITTING:
                this.setBrickColor(new Color(255, 182, 193)); // Light pink
                this.scoreValue = 22;
                break;
            case BrickType.TELEPORT:
                this.setBrickColor(new Color(138, 43, 226)); // Blue violet
                this.scoreValue = 35;
                break;
            case BrickType.SHIELD:
                this.setBrickColor(new Color(192, 192, 192)); // Silver
                this.health = 2;
                this._maxHealth = 2;
                this.scoreValue = 40;
                break;
            case BrickType.GRAVITY:
                this.setBrickColor(new Color(75, 0, 130)); // Indigo
                this.scoreValue = 50;
                break;
            case BrickType.TIME:
                this.setBrickColor(new Color(255, 20, 147)); // Deep pink
                this.scoreValue = 45;
                break;
            case BrickType.HEALING:
                this.setBrickColor(new Color(144, 238, 144)); // Light green
                this.scoreValue = 12;
                break;
            case BrickType.CURSED:
                this.setBrickColor(new Color(128, 0, 0)); // Maroon
                this.scoreValue = 5;
                break;
            case BrickType.CRYSTAL:
                this.setBrickColor(new Color(230, 230, 250)); // Lavender
                this.scoreValue = 30;
                break;
            case BrickType.RUBBER:
                this.setBrickColor(new Color(255, 105, 180)); // Hot pink
                this.scoreValue = 8;
                break;
            case BrickType.METAL:
                this.health = 4;
                this._maxHealth = 4;
                this.setBrickColor(new Color(169, 169, 169)); // Dark gray
                this.scoreValue = 50;
                break;
            case BrickType.VOID:
                this.setBrickColor(new Color(25, 25, 112)); // Midnight blue
                this.scoreValue = 100;
                break;
            case BrickType.LIGHT:
                this.setBrickColor(new Color(255, 255, 224)); // Light yellow
                this.scoreValue = 15;
                break;
            case BrickType.DARK:
                this.setBrickColor(new Color(47, 79, 79)); // Dark slate gray
                this.scoreValue = 25;
                break;
        }
    }
    
    private setBrickColor(color: Color): void {
        if (this._sprite) {
            this._sprite.color = color;
            this._originalColor = color.clone();
        }
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        console.log('🔥 Brick collision detected with:', otherCollider.node.name); // 调试日志
        
        // 检查是否是Ball - 兼容两种组件名称
        const ball = otherCollider.getComponent('Ball') || otherCollider.getComponent('EnhancedBall');
        if (!ball) {
            console.log('⚠️ Not a ball collision, skipping');
            return;
        }
        
        console.log('✅ Ball detected, processing collision');
        
        // Handle phase bricks
        if (this.brickType === BrickType.PHASE && Math.random() < this.phaseProbability) {
            console.log('Ball phased through brick!');
            this.showPhaseEffect();
            return; // Ball passes through
        }
        
        // Handle shielded bricks
        if (this._isShielded) {
            console.log('Attack blocked by shield!');
            this.showShieldEffect();
            return;
        }
        
        // Apply brick-specific pre-hit effects
        this.applyPreHitEffects(ball, otherCollider);
        
        // Take damage
        this.takeDamage(1, otherCollider.node.getWorldPosition());
    }
    
    private applyPreHitEffects(ball: any, ballCollider: Collider2D): void {
        switch (this.brickType) {
            case BrickType.MAGNETIC:
                this.applyMagneticEffect(ballCollider);
                break;
            case BrickType.ICE:
                this.applyIceEffect(ball);
                break;
            case BrickType.FIRE:
                this.applyFireEffect(ball);
                break;
            case BrickType.GRAVITY:
                this.applyGravityEffect();
                break;
            case BrickType.TIME:
                this.applyTimeEffect();
                break;
        }
    }
    
    public takeDamage(damage: number, impactPosition?: Vec3): void {
        console.log(`🎯 Brick taking ${damage} damage. Health: ${this.health} -> ${this.health - damage}`);
        
        this.health -= damage;
        this._lastHitTime = 0;
        
        if (this.health <= 0) {
            console.log('💥 Brick health depleted, destroying...');
            this.onDestroyed(impactPosition);
        } else {
            console.log(`🔧 Brick damaged but not destroyed. Remaining health: ${this.health}`);
            this.showDamageEffect();
            this.updateVisualState();
        }
    }
    
    private onDestroyed(impactPosition?: Vec3): void {
        console.log('🧱 Brick destruction started');
        
        const gameManager = GameManager.getInstance();
        const relicManager = RelicManager.getInstance();
        
        // Apply post-destruction effects before notifying GameManager
        this.applyDestructionEffects(impactPosition);
        
        // Check for explosive bricks relic
        if (relicManager && (relicManager as any).hasRelic) {
            (relicManager as any).hasRelic('ExplosiveBricks');
            this.explodeAdjacent(impactPosition);
        }
        
        // Notify GameManager (handles score, level completion, power-ups)
        const brickPosition = this.node.getWorldPosition();
        const dropsExperience = this.brickType === BrickType.EXPERIENCE || Math.random() < 0.3;
        
        if (gameManager) {
            console.log(`📈 Notifying GameManager: score=${this.scoreValue}, drops=${dropsExperience}`);
            gameManager.onBrickDestroyed(this.scoreValue, brickPosition, dropsExperience);
        } else {
            console.warn('⚠️ GameManager not found, cannot update score');
        }
        
        // Destroy the brick
        console.log('🗑️ Destroying brick node');
        this.node.destroy();
    }
    
    private applyDestructionEffects(impactPosition?: Vec3): void {
        switch (this.brickType) {
            case BrickType.EXPLOSIVE:
                this.createExplosion(impactPosition);
                break;
            case BrickType.ELECTRIC:
                this.triggerElectricChain();
                break;
            case BrickType.SPLITTING:
                this.createSplitBricks();
                break;
            case BrickType.TELEPORT:
                this.teleportBall();
                break;
            case BrickType.HEALING:
                this.healPaddle();
                break;
            case BrickType.CURSED:
                this.applyCurse();
                break;
            case BrickType.CRYSTAL:
                this.triggerCrystalChain();
                break;
            case BrickType.VOID:
                this.consumeBall();
                break;
        }
    }
    
    private createExplosion(center?: Vec3): void {
        if (!center) center = this.node.getWorldPosition();
        
        // Find all bricks within explosion radius
        const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
        
        for (const brick of allBricks) {
            if (brick === this) continue;
            
            const distance = Vec3.distance(center, brick.node.getWorldPosition());
            if (distance <= this.explosionRadius) {
                // Damage decreases with distance
                const damage = Math.max(1, Math.floor(3 * (1 - distance / this.explosionRadius)));
                brick.takeDamage(damage);
                brick.showExplosionEffect();
            }
        }
        
        console.log(`Explosion at ${center} with radius ${this.explosionRadius}`);
    }
    
    private triggerElectricChain(): void {
        const nearbyBricks = this.findNearbyBricks(this.electricChainDistance);
        
        for (const brick of nearbyBricks) {
            if (brick.brickType === BrickType.ELECTRIC || brick._isElectric) {
                brick._isElectric = true;
                brick.takeDamage(1);
                brick.showElectricEffect();
            }
        }
    }
    
    private applyMagneticEffect(ballCollider: Collider2D): void {
        const ballRigidBody = ballCollider.getComponent(RigidBody2D);
        if (!ballRigidBody) return;
        
        const direction = Vec3.subtract(new Vec3(), this.node.getWorldPosition(), ballCollider.node.getWorldPosition()).normalize();
        const force = Vec2.multiplyScalar(new Vec2(), new Vec2(direction.x, direction.y), this.magneticForce);
        
        ballRigidBody.applyForceToCenter(force, true);
        console.log('Magnetic force applied to ball');
    }
    
    private applyIceEffect(ball: any): void {
        // Slow down the ball temporarily
        if (ball && ball.setSpeedMultiplier) {
            ball.setSpeedMultiplier(0.5, 3.0); // 50% speed for 3 seconds
            console.log('Ball slowed by ice brick');
        }
    }
    
    private applyFireEffect(ball: any): void {
        // Speed up the ball temporarily  
        if (ball && ball.setSpeedMultiplier) {
            ball.setSpeedMultiplier(1.5, 3.0); // 150% speed for 3 seconds
            console.log('Ball accelerated by fire brick');
        }
    }
    
    private healPaddle(): void {
        const paddle = this.node.parent?.getComponentInChildren('EnhancedPaddleController') as any;
        if (paddle && paddle.instantRepair) {
            paddle.instantRepair(25);
            console.log('Paddle healed by healing brick');
        }
    }
    
    private dropExperienceOrb(): void {
        if (!this.experienceOrbPrefab) return;
        
        const orb = instantiate(this.experienceOrbPrefab);
        orb.setParent(this.node.parent);
        orb.setWorldPosition(this.node.getWorldPosition());
        
        console.log(`Dropped experience orb worth ${this.experienceValue} XP`);
    }
    
    private findNearbyBricks(radius: number): EnhancedBrick[] {
        const allBricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
        const nearby: EnhancedBrick[] = [];
        
        for (const brick of allBricks) {
            if (brick === this) continue;
            
            const distance = Vec3.distance(this.node.getWorldPosition(), brick.node.getWorldPosition());
            if (distance <= radius) {
                nearby.push(brick);
            }
        }
        
        return nearby;
    }
    
    private updateVisualState(): void {
        if (!this._sprite) return;
        
        const healthRatio = this.health / this._maxHealth;
        const currentColor = this._originalColor.clone();
        
        // Darken based on damage
        currentColor.r = Math.floor(currentColor.r * healthRatio);
        currentColor.g = Math.floor(currentColor.g * healthRatio);  
        currentColor.b = Math.floor(currentColor.b * healthRatio);
        
        this._sprite.color = currentColor;
    }
    
    private updateTimeBasedEffects(dt: number): void {
        // Add time-based visual effects for special bricks
        switch (this.brickType) {
            case BrickType.ELECTRIC:
                if (this._isElectric) {
                    this.sparkleEffect(dt);
                }
                break;
            case BrickType.MAGNETIC:
                this.pulseEffect(dt);
                break;
        }
    }
    
    // Visual effect methods
    private showDamageEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.1, { color: Color.WHITE })
            .to(0.1, { color: this._sprite.color })
            .start();
    }
    
    private showPhaseEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.2, { color: Color.TRANSPARENT })
            .to(0.2, { color: this._originalColor })
            .start();
    }
    
    private showExplosionEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.1, { color: Color.YELLOW })
            .to(0.1, { color: this._sprite.color })
            .start();
    }
    
    private showElectricEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.05, { color: Color.WHITE })
            .to(0.05, { color: Color.CYAN })
            .to(0.05, { color: this._sprite.color })
            .start();
    }
    
    private showShieldEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.1, { color: Color.BLUE })
            .to(0.1, { color: this._sprite.color })
            .start();
    }
    
    private sparkleEffect(dt: number): void {
        // Implement sparkling effect for electric bricks
    }
    
    private pulseEffect(dt: number): void {
        // Implement pulsing effect for magnetic bricks  
    }
    
    // Additional effect implementations would go here...
    private createSplitBricks(): void { console.log('Brick split into smaller pieces'); }
    private teleportBall(): void { console.log('Ball teleported to random location'); }
    private applyCurse(): void { console.log('Curse applied to player'); }
    private triggerCrystalChain(): void { console.log('Crystal chain reaction triggered'); }
    private consumeBall(): void { console.log('Ball consumed by void brick'); }
    private applyGravityEffect(): void { console.log('Gravity modified'); }
    private applyTimeEffect(): void { console.log('Time flow modified'); }
    private explodeAdjacent(center?: Vec3): void { 
        // Implementation from original Brick.ts
        this.createExplosion(center);
    }
    
    // Public accessors
    public get currentHealth(): number { return this.health; }
    public get maxHealth(): number { return this._maxHealth; }
    public get isDestroyed(): boolean { return this.health <= 0; }
    
    // Shield system
    public setShielded(shielded: boolean): void {
        this._isShielded = shielded;
        if (shielded && this._sprite) {
            this._sprite.color = new Color(this._sprite.color.r, this._sprite.color.g, this._sprite.color.b, 200);
        }
    }
}