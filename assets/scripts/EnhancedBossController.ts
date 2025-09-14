import { _decorator, Component, Node, Vec3, RigidBody2D, Collider2D, Contact2DType, IPhysics2DContact, Sprite, Color, tween, Prefab, instantiate, math, Vec2 } from 'cc';
import { GameManager } from './GameManager';
import { EnhancedBrick, BrickType } from './EnhancedBrick';

const { ccclass, property } = _decorator;

export enum BossType {
    GUARDIAN_WALL = 0,      // 守护墙Boss - 生成保护砖块
    STORM_CALLER = 1,       // 风暴召唤者 - 改变球轨迹
    BRICK_SPAWNER = 2,      // 砖块生成器 - 持续生成新砖块
    GRAVITY_MASTER = 3,     // 重力主宰 - 控制重力方向
    TIME_MANIPULATOR = 4,   // 时间操控者 - 影响游戏时间
    SHIELD_GENERATOR = 5,   // 护盾生成器 - 为砖块提供护盾
    MULTI_PHASE = 6,        // 多相位Boss - 多个阶段形态
    TELEPORTER = 7,         // 传送者 - 传送砖块和球
    ELEMENTAL_CHAOS = 8,    // 元素混沌 - 随机元素攻击
    MIRROR_BOSS = 9         // 镜像Boss - 复制玩家行为
}

export enum BossPhase {
    PHASE_1 = 0,
    PHASE_2 = 1, 
    PHASE_3 = 2,
    ENRAGED = 3
}

interface BossAttackPattern {
    name: string;
    cooldown: number;
    damage: number;
    range: number;
    execute: () => void;
}

@ccclass('EnhancedBossController')
export class EnhancedBossController extends Component {
    @property({type: BossType})
    public bossType: BossType = BossType.GUARDIAN_WALL;
    
    @property
    public maxHealth: number = 100;
    
    @property
    public attackPower: number = 10;
    
    @property
    public moveSpeed: number = 100;
    
    @property
    public chapter: number = 1;
    
    @property({type: Prefab})
    public brickPrefab: Prefab | null = null;
    
    @property({type: Prefab})
    public projectilePrefab: Prefab | null = null;
    
    // Boss state
    private _currentHealth: number = 0;
    private _currentPhase: BossPhase = BossPhase.PHASE_1;
    private _isAttacking: boolean = false;
    private _lastAttackTime: number = 0;
    private _attackCooldown: number = 3.0;
    private _phaseTransitionHealth: number[] = [0.75, 0.5, 0.25];
    
    // Components
    private _rigidBody: RigidBody2D | null = null;
    private _sprite: Sprite | null = null;
    private _collider: Collider2D | null = null;
    
    // Boss-specific data
    private _attackPatterns: BossAttackPattern[] = [];
    private _spawnedObjects: Node[] = [];
    private _moveDirection: Vec3 = new Vec3(1, 0, 0);
    private _specialTimer: number = 0;
    private _enragedMode: boolean = false;
    
    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        this._sprite = this.getComponent(Sprite);
        this._collider = this.getComponent(Collider2D);
        
        this._currentHealth = this.maxHealth;
        this.initializeBossType();
        this.setupCollisionHandling();
        
        // Scale stats based on chapter
        this.scaleStatsForChapter();
    }
    
    protected start(): void {
        this.startBossBehavior();
    }
    
    protected update(dt: number): void {
        this._lastAttackTime += dt;
        this._specialTimer += dt;
        
        this.updateMovement(dt);
        this.updateAttackPatterns(dt);
        this.updateSpecialBehavior(dt);
        this.checkPhaseTransitions();
    }
    
    private initializeBossType(): void {
        switch (this.bossType) {
            case BossType.GUARDIAN_WALL:
                this.initializeGuardianWall();
                break;
            case BossType.STORM_CALLER:
                this.initializeStormCaller();
                break;
            case BossType.BRICK_SPAWNER:
                this.initializeBrickSpawner();
                break;
            case BossType.GRAVITY_MASTER:
                this.initializeGravityMaster();
                break;
            case BossType.TIME_MANIPULATOR:
                this.initializeTimeManipulator();
                break;
            case BossType.SHIELD_GENERATOR:
                this.initializeShieldGenerator();
                break;
            case BossType.MULTI_PHASE:
                this.initializeMultiPhase();
                break;
            case BossType.TELEPORTER:
                this.initializeTeleporter();
                break;
            case BossType.ELEMENTAL_CHAOS:
                this.initializeElementalChaos();
                break;
            case BossType.MIRROR_BOSS:
                this.initializeMirrorBoss();
                break;
        }
        
        this.setBossColor();
    }
    
    private initializeGuardianWall(): void {
        this._attackPatterns = [
            {
                name: 'Shield Regeneration',
                cooldown: 5.0,
                damage: 0,
                range: 200,
                execute: () => this.regenerateShieldBricks()
            },
            {
                name: 'Defensive Burst',
                cooldown: 8.0,
                damage: 15,
                range: 150,
                execute: () => this.createDefensiveBarrier()
            }
        ];
    }
    
    private initializeStormCaller(): void {
        this._attackPatterns = [
            {
                name: 'Wind Gust',
                cooldown: 3.0,
                damage: 0,
                range: 300,
                execute: () => this.createWindGust()
            },
            {
                name: 'Lightning Strike',
                cooldown: 6.0,
                damage: 20,
                range: 100,
                execute: () => this.lightningStrike()
            },
            {
                name: 'Tornado',
                cooldown: 12.0,
                damage: 25,
                range: 200,
                execute: () => this.createTornado()
            }
        ];
    }
    
    private initializeBrickSpawner(): void {
        this._attackPatterns = [
            {
                name: 'Spawn Basic Bricks',
                cooldown: 4.0,
                damage: 0,
                range: 0,
                execute: () => this.spawnBasicBricks()
            },
            {
                name: 'Spawn Elite Bricks',
                cooldown: 8.0,
                damage: 0,
                range: 0,
                execute: () => this.spawnEliteBricks()
            },
            {
                name: 'Brick Rain',
                cooldown: 15.0,
                damage: 30,
                range: 400,
                execute: () => this.createBrickRain()
            }
        ];
    }
    
    private initializeGravityMaster(): void {
        this._attackPatterns = [
            {
                name: 'Gravity Flip',
                cooldown: 8.0,
                damage: 0,
                range: 0,
                execute: () => this.flipGravity()
            },
            {
                name: 'Gravity Well',
                cooldown: 10.0,
                damage: 15,
                range: 150,
                execute: () => this.createGravityWell()
            },
            {
                name: 'Zero Gravity',
                cooldown: 20.0,
                damage: 0,
                range: 0,
                execute: () => this.activateZeroGravity()
            }
        ];
    }
    
    private initializeTimeManipulator(): void {
        this._attackPatterns = [
            {
                name: 'Time Slow',
                cooldown: 6.0,
                damage: 0,
                range: 0,
                execute: () => this.slowTime()
            },
            {
                name: 'Time Acceleration',
                cooldown: 12.0,
                damage: 20,
                range: 0,
                execute: () => this.accelerateTime()
            },
            {
                name: 'Temporal Rift',
                cooldown: 18.0,
                damage: 35,
                range: 200,
                execute: () => this.createTemporalRift()
            }
        ];
    }
    
    private initializeShieldGenerator(): void {
        this._attackPatterns = [
            {
                name: 'Shield All Bricks',
                cooldown: 10.0,
                damage: 0,
                range: 0,
                execute: () => this.shieldAllBricks()
            },
            {
                name: 'Energy Pulse',
                cooldown: 7.0,
                damage: 18,
                range: 250,
                execute: () => this.energyPulse()
            }
        ];
    }
    
    private initializeMultiPhase(): void {
        this._attackPatterns = [
            {
                name: 'Phase Attack',
                cooldown: 4.0,
                damage: 15,
                range: 200,
                execute: () => this.phaseSpecificAttack()
            }
        ];
    }
    
    private initializeTeleporter(): void {
        this._attackPatterns = [
            {
                name: 'Teleport Self',
                cooldown: 5.0,
                damage: 0,
                range: 0,
                execute: () => this.teleportSelf()
            },
            {
                name: 'Teleport Bricks',
                cooldown: 8.0,
                damage: 0,
                range: 0,
                execute: () => this.teleportBricks()
            },
            {
                name: 'Teleport Ball',
                cooldown: 6.0,
                damage: 10,
                range: 0,
                execute: () => this.teleportBall()
            }
        ];
    }
    
    private initializeElementalChaos(): void {
        this._attackPatterns = [
            {
                name: 'Random Elemental',
                cooldown: 3.0,
                damage: 20,
                range: 180,
                execute: () => this.randomElementalAttack()
            },
            {
                name: 'Elemental Storm',
                cooldown: 15.0,
                damage: 40,
                range: 300,
                execute: () => this.elementalStorm()
            }
        ];
    }
    
    private initializeMirrorBoss(): void {
        this._attackPatterns = [
            {
                name: 'Mirror Paddle',
                cooldown: 2.0,
                damage: 0,
                range: 0,
                execute: () => this.mirrorPaddleMovement()
            },
            {
                name: 'Copy Ball',
                cooldown: 8.0,
                damage: 0,
                range: 0,
                execute: () => this.copyBallMovement()
            }
        ];
    }
    
    private scaleStatsForChapter(): void {
        const chapterMultiplier = 1 + (this.chapter - 1) * 0.5;
        this.maxHealth = Math.floor(this.maxHealth * chapterMultiplier);
        this._currentHealth = this.maxHealth;
        this.attackPower = Math.floor(this.attackPower * chapterMultiplier);
        
        // Update phase transition thresholds
        this._phaseTransitionHealth = this._phaseTransitionHealth.map(threshold => 
            Math.floor(this.maxHealth * threshold)
        );
    }
    
    private setBossColor(): void {
        if (!this._sprite) return;
        
        switch (this.bossType) {
            case BossType.GUARDIAN_WALL:
                this._sprite.color = new Color(100, 100, 255); // Blue
                break;
            case BossType.STORM_CALLER:
                this._sprite.color = new Color(200, 200, 200); // Gray
                break;
            case BossType.BRICK_SPAWNER:
                this._sprite.color = new Color(139, 69, 19); // Brown
                break;
            case BossType.GRAVITY_MASTER:
                this._sprite.color = new Color(128, 0, 128); // Purple
                break;
            case BossType.TIME_MANIPULATOR:
                this._sprite.color = new Color(255, 215, 0); // Gold
                break;
            case BossType.SHIELD_GENERATOR:
                this._sprite.color = new Color(0, 255, 255); // Cyan
                break;
            case BossType.MULTI_PHASE:
                this._sprite.color = new Color(255, 0, 255); // Magenta
                break;
            case BossType.TELEPORTER:
                this._sprite.color = new Color(255, 165, 0); // Orange
                break;
            case BossType.ELEMENTAL_CHAOS:
                this._sprite.color = this.getRandomElementalColor();
                break;
            case BossType.MIRROR_BOSS:
                this._sprite.color = new Color(192, 192, 192); // Silver
                break;
        }
    }
    
    private setupCollisionHandling(): void {
        if (!this._collider) return;
        
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        // Handle collision with ball or projectiles
        const ball = otherCollider.getComponent('EnhancedBall') as any;
        if (ball) {
            this.takeDamage(ball.damage || 1);
        }
        
        // Handle collision with laser or other attacks
        const laser = otherCollider.getComponent('Laser') as any;
        if (laser) {
            this.takeDamage(laser.damage || 5);
        }
    }
    
    public takeDamage(damage: number): void {
        this._currentHealth = Math.max(0, this._currentHealth - damage);
        this.showDamageEffect();
        
        console.log(`Boss took ${damage} damage. Health: ${this._currentHealth}/${this.maxHealth}`);
        
        if (this._currentHealth <= 0) {
            this.onBossDefeated();
        }
    }
    
    private updateMovement(dt: number): void {
        if (!this._rigidBody) return;
        
        switch (this.bossType) {
            case BossType.GUARDIAN_WALL:
                // Stationary boss
                break;
            case BossType.STORM_CALLER:
                this.floatingMovement(dt);
                break;
            case BossType.TELEPORTER:
                // Movement handled by teleportation
                break;
            default:
                this.horizontalMovement(dt);
                break;
        }
    }
    
    private horizontalMovement(dt: number): void {
        const position = this.node.getWorldPosition();
        const velocity = Vec2.multiplyScalar(new Vec2(), new Vec2(this._moveDirection.x, 0), this.moveSpeed);
        
        // Bounce off screen edges
        if (position.x <= -400 || position.x >= 400) {
            this._moveDirection.x *= -1;
        }
        
        if (this._rigidBody) {
            this._rigidBody.linearVelocity = velocity;
        }
    }
    
    private floatingMovement(dt: number): void {
        const time = this._specialTimer;
        const x = Math.sin(time * 2) * 150;
        const y = Math.cos(time * 1.5) * 50;
        
        this.node.setWorldPosition(x, this.node.worldPosition.y + y * dt * 0.1, 0);
    }
    
    private updateAttackPatterns(dt: number): void {
        if (this._isAttacking) return;
        
        for (const pattern of this._attackPatterns) {
            if (this._lastAttackTime >= pattern.cooldown) {
                this.executeAttackPattern(pattern);
                this._lastAttackTime = 0;
                break;
            }
        }
    }
    
    private executeAttackPattern(pattern: BossAttackPattern): void {
        console.log(`Boss executing: ${pattern.name}`);
        this._isAttacking = true;
        
        pattern.execute();
        
        // Reset attack state after a short delay
        this.scheduleOnce(() => {
            this._isAttacking = false;
        }, 1.0);
    }
    
    private updateSpecialBehavior(dt: number): void {
        switch (this.bossType) {
            case BossType.ELEMENTAL_CHAOS:
                if (this._specialTimer >= 1.0) {
                    this.changeElementalColor();
                    this._specialTimer = 0;
                }
                break;
            case BossType.MULTI_PHASE:
                this.updateMultiPhaseVisuals();
                break;
        }
    }
    
    private checkPhaseTransitions(): void {
        let newPhase = this._currentPhase;
        
        if (this._currentHealth <= this._phaseTransitionHealth[2] && this._currentPhase < BossPhase.ENRAGED) {
            newPhase = BossPhase.ENRAGED;
        } else if (this._currentHealth <= this._phaseTransitionHealth[1] && this._currentPhase < BossPhase.PHASE_3) {
            newPhase = BossPhase.PHASE_3;
        } else if (this._currentHealth <= this._phaseTransitionHealth[0] && this._currentPhase < BossPhase.PHASE_2) {
            newPhase = BossPhase.PHASE_2;
        }
        
        if (newPhase !== this._currentPhase) {
            this.transitionToPhase(newPhase);
        }
    }
    
    private transitionToPhase(newPhase: BossPhase): void {
        console.log(`Boss transitioning to phase ${newPhase}`);
        this._currentPhase = newPhase;
        
        // Adjust attack patterns based on phase
        this.adjustAttackPatternsForPhase(newPhase);
        
        // Visual effects for phase transition
        this.showPhaseTransitionEffect();
        
        if (newPhase === BossPhase.ENRAGED) {
            this._enragedMode = true;
            this.attackPower *= 1.5;
            this._attackCooldown *= 0.7; // Attack faster
        }
    }
    
    private adjustAttackPatternsForPhase(phase: BossPhase): void {
        const speedMultiplier = 1 + phase * 0.2;
        const damageMultiplier = 1 + phase * 0.3;
        
        for (const pattern of this._attackPatterns) {
            pattern.cooldown /= speedMultiplier;
            pattern.damage = Math.floor(pattern.damage * damageMultiplier);
        }
    }
    
    // Attack pattern implementations
    private regenerateShieldBricks(): void {
        const bricks = this.node.parent?.getComponentsInChildren(EnhancedBrick) || [];
        let regenerated = 0;
        
        for (const brick of bricks) {
            if (brick.currentHealth < brick.maxHealth && regenerated < 3) {
                brick.health = brick.maxHealth;
                this.showRegenerationEffect(brick.node);
                regenerated++;
            }
        }
    }
    
    private createDefensiveBarrier(): void {
        if (!this.brickPrefab) return;
        
        // Create a protective barrier around the boss
        const positions = [
            new Vec3(-100, -50, 0),
            new Vec3(100, -50, 0),
            new Vec3(-100, 50, 0),
            new Vec3(100, 50, 0)
        ];
        
        for (const pos of positions) {
            const barrier = instantiate(this.brickPrefab);
            const brick = barrier.getComponent(EnhancedBrick);
            if (brick) {
                brick.brickType = BrickType.SHIELD;
                brick.health = 5;
            }
            
            barrier.setParent(this.node.parent);
            barrier.setWorldPosition(this.node.worldPosition.add(pos));
            this._spawnedObjects.push(barrier);
        }
    }
    
    private createWindGust(): void {
        // Apply force to all balls in the scene
        const balls = this.node.parent?.getComponentsInChildren('EnhancedBall') || [];
        const windForce = new Vec2(math.randomRangeInt(-500, 500), math.randomRangeInt(-200, 200));
        
        for (const ball of balls) {
            const rigidBody = ball.getComponent(RigidBody2D);
            if (rigidBody) {
                rigidBody.applyForceToCenter(windForce, true);
            }
        }
    }
    
    private lightningStrike(): void {
        // Create lightning at random positions
        const paddleController = this.node.parent?.getComponentInChildren('EnhancedPaddleController') as any;
        if (paddleController) {
            paddleController.takeDamage(this.attackPower);
        }
    }
    
    private createTornado(): void {
        // Create a spinning force field
        const tornado = new Node('Tornado');
        tornado.setParent(this.node.parent);
        tornado.setWorldPosition(new Vec3(math.randomRangeInt(-300, 300), 0, 0));
        
        // Tornado effect would be implemented with custom component
        this._spawnedObjects.push(tornado);
        
        // Auto-destroy after 5 seconds
        this.scheduleOnce(() => {
            tornado.destroy();
        }, 5.0);
    }
    
    private spawnBasicBricks(): void {
        if (!this.brickPrefab) return;
        
        for (let i = 0; i < 3; i++) {
            const brick = instantiate(this.brickPrefab);
            const brickComponent = brick.getComponent(EnhancedBrick);
            if (brickComponent) {
                brickComponent.brickType = BrickType.NORMAL;
            }
            
            brick.setParent(this.node.parent);
            const randomX = math.randomRangeInt(-300, 300);
            const randomY = math.randomRangeInt(100, 300);
            brick.setWorldPosition(randomX, randomY, 0);
            this._spawnedObjects.push(brick);
        }
    }
    
    private spawnEliteBricks(): void {
        if (!this.brickPrefab) return;
        
        const eliteTypes = [BrickType.REINFORCED, BrickType.EXPLOSIVE, BrickType.ELECTRIC];
        
        for (let i = 0; i < 2; i++) {
            const brick = instantiate(this.brickPrefab);
            const brickComponent = brick.getComponent(EnhancedBrick);
            if (brickComponent) {
                brickComponent.brickType = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
            }
            
            brick.setParent(this.node.parent);
            const randomX = math.randomRangeInt(-300, 300);
            const randomY = math.randomRangeInt(100, 300);
            brick.setWorldPosition(randomX, randomY, 0);
            this._spawnedObjects.push(brick);
        }
    }
    
    // Additional attack implementations would continue...
    private createBrickRain(): void { console.log('Brick rain attack'); }
    private flipGravity(): void { console.log('Gravity flipped'); }
    private createGravityWell(): void { console.log('Gravity well created'); }
    private activateZeroGravity(): void { console.log('Zero gravity activated'); }
    private slowTime(): void { console.log('Time slowed'); }
    private accelerateTime(): void { console.log('Time accelerated'); }
    private createTemporalRift(): void { console.log('Temporal rift created'); }
    private shieldAllBricks(): void { console.log('All bricks shielded'); }
    private energyPulse(): void { console.log('Energy pulse released'); }
    private phaseSpecificAttack(): void { console.log('Phase-specific attack'); }
    private teleportSelf(): void { console.log('Boss teleported'); }
    private teleportBricks(): void { console.log('Bricks teleported'); }
    private teleportBall(): void { console.log('Ball teleported'); }
    private randomElementalAttack(): void { console.log('Random elemental attack'); }
    private elementalStorm(): void { console.log('Elemental storm'); }
    private mirrorPaddleMovement(): void { console.log('Mirroring paddle movement'); }
    private copyBallMovement(): void { console.log('Copying ball movement'); }
    
    // Utility methods
    private getRandomElementalColor(): Color {
        const colors = [
            new Color(255, 0, 0),   // Red (Fire)
            new Color(0, 0, 255),   // Blue (Ice)
            new Color(255, 255, 0), // Yellow (Electric)
            new Color(0, 255, 0)    // Green (Poison)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    private changeElementalColor(): void {
        if (this._sprite && this.bossType === BossType.ELEMENTAL_CHAOS) {
            this._sprite.color = this.getRandomElementalColor();
        }
    }
    
    private updateMultiPhaseVisuals(): void {
        if (this._sprite) {
            const alpha = 150 + Math.sin(this._specialTimer * 4) * 50;
            this._sprite.color = new Color(this._sprite.color.r, this._sprite.color.g, this._sprite.color.b, alpha);
        }
    }
    
    private showDamageEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.1, { color: Color.WHITE })
            .to(0.1, { color: this._sprite.color })
            .start();
    }
    
    private showPhaseTransitionEffect(): void {
        if (!this._sprite) return;
        
        tween(this._sprite)
            .to(0.5, { color: Color.RED })
            .to(0.5, { color: this._sprite.color })
            .start();
    }
    
    private showRegenerationEffect(target: Node): void {
        const sprite = target.getComponent(Sprite);
        if (!sprite) return;
        
        tween(sprite)
            .to(0.3, { color: Color.GREEN })
            .to(0.3, { color: sprite.color })
            .start();
    }
    
    private startBossBehavior(): void {
        console.log(`${BossType[this.bossType]} Boss activated - Chapter ${this.chapter}`);
        console.log(`Boss Health: ${this._currentHealth}/${this.maxHealth}`);
    }
    
    private onBossDefeated(): void {
        console.log(`Boss defeated! ${BossType[this.bossType]} has fallen.`);
        
        // Clean up spawned objects
        for (const obj of this._spawnedObjects) {
            if (obj && obj.isValid) {
                obj.destroy();
            }
        }
        
        // Notify GameManager
        const gameManager = GameManager.getInstance();
        if (gameManager && (gameManager as any).onBossDefeated) {
            (gameManager as any).onBossDefeated(this.bossType, this.chapter);
        }
        
        // Boss death animation
        if (this._sprite) {
            tween(this._sprite)
                .to(1.0, { color: Color.TRANSPARENT })
                .call(() => this.node.destroy())
                .start();
        }
    }
    
    // Public accessors
    public get currentHealth(): number { return this._currentHealth; }
    public get maxHealthValue(): number { return this.maxHealth; }
    public get currentPhase(): BossPhase { return this._currentPhase; }
    public get isEnraged(): boolean { return this._enragedMode; }
}