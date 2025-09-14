import { _decorator, Component, Node, RigidBody2D, PhysicsMaterial, Collider2D, Contact2DType, IPhysics2DContact, Vec3, Color, Sprite, tween, Vec2 } from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

export enum BallType {
    NORMAL = 0,
    HEAVY = 1,           // 超重球，伤害高但速度慢
    SOFT = 2,            // 超软球，特殊反弹效果
    FIRE = 3,            // 火焰球，持续伤害
    ICE = 4,             // 冰冻球，减速效果
    ELECTRIC = 5,        // 电击球，连锁伤害
    POISON = 6,          // 毒性球，毒素扩散
    EXPLOSIVE = 7,       // 爆炸球，爆炸伤害
    PIERCING = 8,        // 穿透球，穿透砖块
    SPLITTING = 9,       // 分裂球，击中后分裂
    MAGNETIC = 10,       // 磁性球，改变轨迹
    PHASE = 11,          // 相位球，随机穿透
    GRAVITY = 12,        // 重力球，影响重力
    TIME = 13,           // 时间球，减慢时间
    HEALING = 14,        // 治疗球，修复挡板
    CURSED = 15,         // 诅咒球，负面效果
    LIGHT = 16,          // 光明球，照亮区域
    DARK = 17,           // 黑暗球，减少视野
    CRYSTAL = 18,        // 水晶球，连锁反应
    RUBBER = 19,         // 橡胶球，超强反弹
    METAL = 20,          // 金属球，坚硬不变形
    VOID = 21,           // 虚空球，吞噬效果
    PLASMA = 22,         // 等离子球，高能量
    QUANTUM = 23,        // 量子球，叠加态
    CHAOS = 24           // 混沌球，随机效果
}

@ccclass('EnhancedBall')
export class EnhancedBall extends Component {
    @property({type: BallType})
    public ballType: BallType = BallType.NORMAL;
    
    @property
    public initialSpeed: number = 300;
    
    @property
    public damage: number = 1;
    
    @property
    public weight: number = 1.0; // 影响物理行为
    
    @property
    public bounciness: number = 1.0; // 反弹系数
    
    @property
    public penetrationCount: number = 0; // 穿透次数
    
    @property
    public effectDuration: number = 5.0; // 效果持续时间
    
    @property
    public areaRadius: number = 50; // 范围效果半径
    
    private _rigidBody: RigidBody2D | null = null;
    private _collider: Collider2D | null = null;
    private _sprite: Sprite | null = null;
    private _physicsMaterial: PhysicsMaterial | null = null;
    
    // Ball state
    private _currentSpeed: number = 0;
    private _targetSpeed: number = 0;
    private _speedMultiplier: number = 1.0;
    private _speedMultiplierTimer: number = 0;
    private _isElectric: boolean = false;
    private _isPoisonous: boolean = false;
    private _isPhasing: boolean = false;
    private _remainingPenetrations: number = 0;
    private _effectTimer: number = 0;
    
    // Visual effects
    private _originalColor: Color = new Color();
    private _trailNodes: Node[] = [];
    private _particleTimer: number = 0;
    
    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        this._collider = this.getComponent(Collider2D);
        this._sprite = this.getComponent(Sprite);
        
        if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
        }
        
        this.initializeBallType();
        this.setupPhysics();
        this.setupCollisionHandling();
        
        this._targetSpeed = this.initialSpeed;
        this._currentSpeed = this.initialSpeed;
    }
    
    protected start(): void {
        this.launch();
    }
    
    protected update(dt: number): void {
        this.maintainSpeed();
        this.updateEffects(dt);
        this.updateVisualEffects(dt);
        this.updateTimers(dt);
    }
    
    private initializeBallType(): void {
        switch (this.ballType) {
            case BallType.NORMAL:
                this.setBallColor(Color.WHITE);
                break;
                
            case BallType.HEAVY:
                this.damage = 3;
                this.weight = 2.5;
                this.initialSpeed = 200; // Slower but powerful
                this.setBallColor(new Color(128, 128, 128)); // Dark gray
                break;
                
            case BallType.SOFT:
                this.damage = 1;
                this.weight = 0.5;
                this.bounciness = 1.5; // Extra bouncy
                this.setBallColor(new Color(255, 192, 203)); // Pink
                break;
                
            case BallType.FIRE:
                this.damage = 2;
                this.setBallColor(new Color(255, 100, 0)); // Orange-red
                this._effectTimer = this.effectDuration;
                break;
                
            case BallType.ICE:
                this.damage = 1;
                this.setBallColor(new Color(173, 216, 230)); // Light blue
                break;
                
            case BallType.ELECTRIC:
                this.damage = 1;
                this._isElectric = true;
                this.setBallColor(new Color(255, 255, 0)); // Yellow
                break;
                
            case BallType.POISON:
                this.damage = 1;
                this._isPoisonous = true;
                this.setBallColor(new Color(128, 0, 128)); // Purple
                break;
                
            case BallType.EXPLOSIVE:
                this.damage = 2;
                this.setBallColor(new Color(255, 0, 0)); // Red
                break;
                
            case BallType.PIERCING:
                this.damage = 1;
                this.penetrationCount = 3;
                this._remainingPenetrations = 3;
                this.setBallColor(new Color(0, 255, 255)); // Cyan
                break;
                
            case BallType.SPLITTING:
                this.damage = 1;
                this.setBallColor(new Color(255, 255, 255)); // White with sparkles
                break;
                
            case BallType.PHASE:
                this.damage = 1;
                this._isPhasing = true;
                this.setBallColor(new Color(128, 128, 255, 150)); // Semi-transparent blue
                break;
                
            case BallType.PLASMA:
                this.damage = 4;
                this.initialSpeed = 400;
                this.setBallColor(new Color(255, 0, 255)); // Magenta
                break;
                
            case BallType.QUANTUM:
                this.damage = 2;
                this.setBallColor(new Color(128, 255, 128)); // Light green
                break;
                
            case BallType.CHAOS:
                this.randomizeBallProperties();
                this.setBallColor(this.getRandomColor());
                break;
        }
    }
    
    private setBallColor(color: Color): void {
        if (this._sprite) {
            this._sprite.color = color;
        }
    }
    
    private setupPhysics(): void {
        if (!this._rigidBody || !this._collider) return;
        
        // Create physics material based on ball type
        this._physicsMaterial = new PhysicsMaterial();
        this._physicsMaterial.friction = 0.0;
        this._physicsMaterial.restitution = this.bounciness;
        
        // Apply weight scaling
        this._rigidBody.gravityScale = this.weight;
        
        // Apply physics material (Cocos Creator handles this automatically)
    }
    
    private setupCollisionHandling(): void {
        if (!this._collider) return;
        
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // Handle phase balls
        if (this._isPhasing && Math.random() < 0.3) {
            console.log('Ball phased through object');
            this.showPhaseEffect();
            return;
        }
        
        // Apply ball-specific collision effects
        this.applyCollisionEffects(otherCollider);
        
        // Handle penetration
        if (this._remainingPenetrations > 0 && otherCollider.tag === 2000) { // Brick tag
            this._remainingPenetrations--;
            console.log(`Ball penetrated! Remaining: ${this._remainingPenetrations}`);
            return; // Don't reflect, continue through
        }
        
        // Standard collision response
        this.onHitTarget(otherCollider);
    }
    
    private applyCollisionEffects(otherCollider: Collider2D): void {
        const position = otherCollider.node.getWorldPosition();
        
        switch (this.ballType) {
            case BallType.FIRE:
                this.applyFireEffect(otherCollider, position);
                break;
                
            case BallType.ICE:
                this.applyIceEffect(otherCollider, position);
                break;
                
            case BallType.ELECTRIC:
                this.applyElectricEffect(otherCollider, position);
                break;
                
            case BallType.POISON:
                this.applyPoisonEffect(otherCollider, position);
                break;
                
            case BallType.EXPLOSIVE:
                this.applyExplosiveEffect(position);
                break;
                
            case BallType.SPLITTING:
                this.applySplittingEffect();
                break;
                
            case BallType.HEALING:
                this.applyHealingEffect();
                break;
                
            case BallType.CURSED:
                this.applyCursedEffect();
                break;
                
            case BallType.CHAOS:
                this.applyRandomEffect(otherCollider, position);
                break;
        }
    }
    
    private applyFireEffect(collider: Collider2D, position: Vec3): void {
        // Apply fire damage over time to nearby objects
        const nearbyObjects = this.findObjectsInRadius(position, this.areaRadius);
        for (const obj of nearbyObjects) {
            const brick = obj.getComponent('EnhancedBrick') as any;
            if (brick && brick.takeDamage) {
                // Schedule fire damage over time
                this.scheduleFireDamage(brick, 3, 0.5); // 3 ticks, every 0.5s
            }
        }
        console.log('Fire effect applied');
    }
    
    private applyIceEffect(collider: Collider2D, position: Vec3): void {
        // Slow down nearby balls and freeze bricks temporarily
        const nearbyObjects = this.findObjectsInRadius(position, this.areaRadius);
        for (const obj of nearbyObjects) {
            const ball = obj.getComponent('EnhancedBall') as any;
            if (ball && ball !== this && ball.setSpeedMultiplier) {
                ball.setSpeedMultiplier(0.5, 3.0);
            }
        }
        console.log('Ice effect applied');
    }
    
    private applyElectricEffect(collider: Collider2D, position: Vec3): void {
        // Chain lightning to nearby objects
        const nearbyObjects = this.findObjectsInRadius(position, this.areaRadius * 1.5);
        for (const obj of nearbyObjects) {
            const brick = obj.getComponent('EnhancedBrick') as any;
            if (brick && brick.takeDamage) {
                brick.takeDamage(1);
                this.createLightningEffect(position, obj.getWorldPosition());
            }
        }
        console.log('Electric chain applied');
    }
    
    private applyPoisonEffect(collider: Collider2D, position: Vec3): void {
        // Spread poison to nearby bricks
        const nearbyObjects = this.findObjectsInRadius(position, this.areaRadius);
        for (const obj of nearbyObjects) {
            const brick = obj.getComponent('EnhancedBrick');
            if (brick) {
                this.schedulePoisonDamage(brick, 5, 1.0); // 5 ticks, every 1s
            }
        }
        console.log('Poison spread');
    }
    
    private applyExplosiveEffect(position: Vec3): void {
        // Create explosion damage
        const nearbyObjects = this.findObjectsInRadius(position, this.areaRadius * 2);
        for (const obj of nearbyObjects) {
            const distance = Vec3.distance(position, obj.getWorldPosition());
            const damage = Math.max(1, Math.floor(this.damage * 2 * (1 - distance / (this.areaRadius * 2))));
            
            const brick = obj.getComponent('EnhancedBrick') as any;
            if (brick && brick.takeDamage) {
                brick.takeDamage(damage);
            }
        }
        this.createExplosionEffect(position);
        console.log('Explosion triggered');
    }
    
    private applySplittingEffect(): void {
        // Create multiple smaller balls
        const gameManager = GameManager.getInstance();
        if (gameManager && (gameManager as any).createSplitBall) {
            for (let i = 0; i < 3; i++) {
                (gameManager as any).createSplitBall(this.node.getWorldPosition(), this.ballType);
            }
        }
        console.log('Ball split into multiple balls');
    }
    
    private applyHealingEffect(): void {
        // Heal the paddle
        const paddle = this.node.parent?.getComponentInChildren('EnhancedPaddleController') as any;
        if (paddle && paddle.instantRepair) {
            paddle.instantRepair(15);
            console.log('Paddle healed by healing ball');
        }
    }
    
    private applyCursedEffect(): void {
        // Apply random negative effect
        const effects = ['slow_paddle', 'damage_paddle', 'reverse_controls', 'reduce_score'];
        const effect = effects[Math.floor(Math.random() * effects.length)];
        
        const gameManager = GameManager.getInstance();
        if (gameManager && (gameManager as any).applyCurse) {
            (gameManager as any).applyCurse(effect, 10.0); // 10 second curse
        }
        console.log(`Curse applied: ${effect}`);
    }
    
    private applyRandomEffect(collider: Collider2D, position: Vec3): void {
        // Randomly apply one of many effects
        const effects = [
            () => this.applyFireEffect(collider, position),
            () => this.applyIceEffect(collider, position),
            () => this.applyElectricEffect(collider, position),
            () => this.applyExplosiveEffect(position),
            () => this.applySplittingEffect(),
            () => this.applyHealingEffect()
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
        
        // Change color to indicate new effect
        this.setBallColor(this.getRandomColor());
    }
    
    private launch(): void {
        if (!this._rigidBody) return;
        
        const angle = Math.PI / 4; // 45 degrees
        const direction = new Vec2(Math.cos(angle), Math.sin(angle));
        const velocity = Vec2.multiplyScalar(new Vec2(), direction, this.initialSpeed);
        
        this._rigidBody.linearVelocity = velocity;
    }
    
    private maintainSpeed(): void {
        if (!this._rigidBody) return;
        
        const currentVelocity = this._rigidBody.linearVelocity;
        const currentSpeed = currentVelocity.length();
        
        if (Math.abs(currentSpeed - (this._targetSpeed * this._speedMultiplier)) > 5) {
            const normalizedVelocity = currentVelocity.normalize();
            const newVelocity = Vec2.multiplyScalar(new Vec2(), normalizedVelocity, this._targetSpeed * this._speedMultiplier);
            this._rigidBody.linearVelocity = newVelocity;
        }
    }
    
    private updateEffects(dt: number): void {
        if (this._effectTimer > 0) {
            this._effectTimer -= dt;
        }
        
        // Update type-specific continuous effects
        switch (this.ballType) {
            case BallType.QUANTUM:
                this.updateQuantumEffect(dt);
                break;
            case BallType.PLASMA:
                this.updatePlasmaEffect(dt);
                break;
        }
    }
    
    private updateVisualEffects(dt: number): void {
        this._particleTimer += dt;
        
        // Create trail effects for special balls
        if (this._particleTimer >= 0.1) {
            this.createTrailEffect();
            this._particleTimer = 0;
        }
        
        // Update visual states
        this.updateGlowEffect(dt);
    }
    
    private updateTimers(dt: number): void {
        if (this._speedMultiplierTimer > 0) {
            this._speedMultiplierTimer -= dt;
            if (this._speedMultiplierTimer <= 0) {
                this._speedMultiplier = 1.0;
            }
        }
    }
    
    // Utility methods
    private findObjectsInRadius(center: Vec3, radius: number): Node[] {
        const allObjects = this.node.parent?.children || [];
        const nearby: Node[] = [];
        
        for (const obj of allObjects) {
            const distance = Vec3.distance(center, obj.getWorldPosition());
            if (distance <= radius && obj !== this.node) {
                nearby.push(obj);
            }
        }
        
        return nearby;
    }
    
    private randomizeBallProperties(): void {
        this.damage = Math.floor(Math.random() * 3) + 1;
        this.weight = Math.random() * 2 + 0.5;
        this.bounciness = Math.random() * 0.5 + 0.75;
        this.initialSpeed = Math.random() * 200 + 200;
    }
    
    private getRandomColor(): Color {
        return new Color(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            255
        );
    }
    
    // Public methods
    public setSpeedMultiplier(multiplier: number, duration: number): void {
        this._speedMultiplier = multiplier;
        this._speedMultiplierTimer = duration;
    }
    
    public getSpeed(): number {
        return this._rigidBody?.linearVelocity.length() || 0;
    }
    
    public get rigidBody(): RigidBody2D | null {
        return this._rigidBody;
    }
    
    public changeBallType(newType: BallType): void {
        this.ballType = newType;
        this.initializeBallType();
        this.setupPhysics();
    }
    
    // Effect scheduling methods
    private scheduleFireDamage(target: any, ticks: number, interval: number): void {
        if (ticks <= 0) return;
        
        this.scheduleOnce(() => {
            if (target && target.takeDamage) {
                target.takeDamage(1);
                this.scheduleFireDamage(target, ticks - 1, interval);
            }
        }, interval);
    }
    
    private schedulePoisonDamage(target: any, ticks: number, interval: number): void {
        if (ticks <= 0) return;
        
        this.scheduleOnce(() => {
            if (target && target.takeDamage) {
                target.takeDamage(1);
                this.schedulePoisonDamage(target, ticks - 1, interval);
            }
        }, interval);
    }
    
    // Visual effect methods  
    private createTrailEffect(): void { console.log('Trail effect created'); }
    private updateGlowEffect(dt: number): void { /* Implement glow effect */ }
    private createExplosionEffect(position: Vec3): void { console.log('Explosion visual effect'); }
    private createLightningEffect(from: Vec3, to: Vec3): void { console.log('Lightning effect'); }
    private showPhaseEffect(): void { console.log('Phase visual effect'); }
    private updateQuantumEffect(dt: number): void { console.log('Quantum effect update'); }
    private updatePlasmaEffect(dt: number): void { console.log('Plasma effect update'); }
    private onHitTarget(collider: Collider2D): void { console.log('Ball hit target'); }
}