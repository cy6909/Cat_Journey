# 物理和碰撞系统工作流程 - Cat-Conquest Roguelike Breakout

## 概述
本文档提供物理引擎和碰撞检测系统的完整实现工作流程，包括完美弹性碰撞、多层碰撞检测、性能优化和特殊物理效果。

## 前置要求
- 已完成核心游戏机制（Cocos Creator 3.8.6）
- 理解 Box2D 物理引擎原理
- 掌握碰撞检测算法
- 完成基础游戏对象系统

## 第一阶段：物理世界设置

### 1.1 Physics2D 世界配置

**步骤 1：物理系统初始化**
1. 打开项目设置 → 物理2D
2. 配置全局物理参数：
```typescript
// 物理世界基础设置
重力: (0, -320)           // 向下的重力
速度迭代次数: 8          // 速度计算精度
位置迭代次数: 3          // 位置校正精度
允许睡眠: true          // 静止物体进入睡眠状态
```

**步骤 2：碰撞组配置**
```typescript
// 在项目设置中配置碰撞组
Collision Groups:
Group 0 (DEFAULT):   墙体和边界
Group 1 (BALL):     所有弹球类型  
Group 2 (BRICK):    所有砖块类型
Group 3 (PADDLE):   玩家挡板
Group 4 (POWERUP):  掉落的能力道具
Group 5 (BOSS):     Boss实体
Group 6 (LASER):    激光弹丸
Group 7 (EXPERIENCE): 经验球
Group 8 (EFFECT):   特效碰撞体（如爆炸）
```

**步骤 3：碰撞矩阵设置**
```typescript
// 配置哪些组之间可以发生碰撞
Collision Matrix:
BALL 与 [BRICK, PADDLE, DEFAULT, BOSS] 碰撞
BRICK 与 [BALL, LASER, EFFECT] 碰撞  
PADDLE 与 [BALL, POWERUP, EXPERIENCE] 碰撞
BOSS 与 [BALL, LASER] 碰撞
POWERUP 与 [PADDLE] 碰撞
LASER 与 [BRICK, BOSS] 碰撞
```

### 1.2 物理材质创建

**步骤 1：弹球物理材质**
```typescript
// 创建完美弹性材质
@ccclass('BallPhysicsMaterial')
export class BallPhysicsMaterial extends PhysicsMaterial {
    protected onLoad(): void {
        this.restitution = 1.0;     // 完美弹性
        this.friction = 0.0;        // 无摩擦力
        this.density = 1.0;         // 标准密度
    }
}

// 为不同球类型创建特殊材质
@ccclass('HeavyBallMaterial')
export class HeavyBallMaterial extends PhysicsMaterial {
    protected onLoad(): void {
        this.restitution = 0.95;    // 稍低弹性
        this.friction = 0.1;        // 轻微摩擦
        this.density = 3.0;         // 高密度
    }
}

@ccclass('SoftBallMaterial')
export class SoftBallMaterial extends PhysicsMaterial {
    protected onLoad(): void {
        this.restitution = 1.1;     // 超弹性
        this.friction = 0.0;        // 无摩擦
        this.density = 0.3;         // 低密度
    }
}
```

**步骤 2：砖块和挡板材质**
```typescript
// 砖块材质 - 能量吸收
@ccclass('BrickMaterial')
export class BrickMaterial extends PhysicsMaterial {
    protected onLoad(): void {
        this.restitution = 0.8;     // 吸收部分能量
        this.friction = 0.0;        // 无摩擦
        this.density = 2.0;         // 固体密度
    }
}

// 挡板材质 - 能量增强
@ccclass('PaddleMaterial')
export class PaddleMaterial extends PhysicsMaterial {
    protected onLoad(): void {
        this.restitution = 1.1;     // 轻微增能
        this.friction = 0.1;        // 控制反射角度
        this.density = 5.0;         // 重型挡板
    }
}
```

## 第二阶段：碰撞检测系统

### 2.1 全局碰撞管理器

**步骤 1：碰撞事件管理**
```typescript
@ccclass('CollisionManager')
export class CollisionManager extends Component {
    private static _instance: CollisionManager = null;
    private collisionCallbacks: Map<string, Function[]> = new Map();
    
    public static getInstance(): CollisionManager {
        return CollisionManager._instance;
    }
    
    protected onLoad(): void {
        CollisionManager._instance = this;
        this.initializeCollisionHandlers();
    }
    
    private initializeCollisionHandlers(): void {
        // 监听全局碰撞事件
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        PhysicsSystem2D.instance.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
        PhysicsSystem2D.instance.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
    }
    
    private onBeginContact(contact: PhysicsContact, selfCollider: Collider2D, otherCollider: Collider2D): void {
        const collisionType = this.getCollisionType(selfCollider, otherCollider);
        
        // 分发到特定的碰撞处理器
        switch (collisionType) {
            case 'ball_brick':
                this.handleBallBrickCollision(contact, selfCollider, otherCollider);
                break;
            case 'ball_paddle':
                this.handleBallPaddleCollision(contact, selfCollider, otherCollider);
                break;
            case 'ball_wall':
                this.handleBallWallCollision(contact, selfCollider, otherCollider);
                break;
            case 'ball_boss':
                this.handleBallBossCollision(contact, selfCollider, otherCollider);
                break;
            // ... 其他碰撞类型
        }
    }
}
```

**步骤 2：特定碰撞处理器**
```typescript
// 弹球-砖块碰撞处理
private handleBallBrickCollision(contact: PhysicsContact, ballCollider: Collider2D, brickCollider: Collider2D): void {
    const ball = ballCollider.getComponent(EnhancedBall);
    const brick = brickCollider.getComponent(EnhancedBrick);
    
    if (!ball || !brick) return;
    
    // 计算碰撞伤害
    const damage = this.calculateCollisionDamage(ball, brick, contact);
    
    // 应用球的特殊效果
    this.applyBallEffects(ball, brick, contact);
    
    // 砖块受伤
    brick.takeDamage(damage, ball.ballType);
    
    // 触发碰撞特效
    this.createCollisionEffect(contact.getWorldManifold().points[0], ball.ballType, brick.brickType);
    
    // 检查是否需要修改碰撞行为
    this.modifyCollisionBehavior(contact, ball, brick);
}

// 弹球-挡板碰撞处理
private handleBallPaddleCollision(contact: PhysicsContact, ballCollider: Collider2D, paddleCollider: Collider2D): void {
    const ball = ballCollider.getComponent(EnhancedBall);
    const paddle = paddleCollider.getComponent(EnhancedPaddleController);
    
    // 计算反射角度增强
    const hitPosition = this.getRelativeHitPosition(contact, paddle);
    const angleModification = this.calculateAngleModification(hitPosition);
    
    // 应用角度修正
    this.modifyBallVelocity(ball, angleModification);
    
    // 挡板经验获取
    paddle.gainExperience(5);
    
    // 触发挡板特效
    this.createPaddleHitEffect(contact.getWorldManifold().points[0]);
}
```

### 2.2 高精度碰撞检测

**步骤 1：连续碰撞检测**
```typescript
@ccclass('ContinuousCollisionDetection')
export class ContinuousCollisionDetection extends Component {
    private raycastCallbacks: Map<string, Function> = new Map();
    
    // 高速弹球的连续碰撞检测
    public checkContinuousCollision(ball: Node, dt: number): CollisionResult[] {
        const ballBody = ball.getComponent(RigidBody2D);
        const currentPos = ball.getPosition();
        const velocity = ballBody.linearVelocity;
        
        // 计算下一帧位置
        const nextPos = currentPos.add(cc.v3(velocity.x * dt, velocity.y * dt, 0));
        
        // 射线检测路径上的碰撞
        const raycastResults: RaycastResult2D[] = [];
        PhysicsSystem2D.instance.rayCast(currentPos, nextPos, RaycastResult2D);
        
        // 处理每个检测到的碰撞
        return this.processRaycastResults(raycastResults, ball);
    }
    
    private processRaycastResults(results: RaycastResult2D[], ball: Node): CollisionResult[] {
        const collisions: CollisionResult[] = [];
        
        results.forEach(result => {
            if (result.collider.node !== ball) {
                const collision = {
                    point: result.point,
                    normal: result.normal,
                    fraction: result.fraction,
                    collider: result.collider,
                    ball: ball
                };
                
                collisions.push(collision);
            }
        });
        
        // 按距离排序，处理最近的碰撞
        collisions.sort((a, b) => a.fraction - b.fraction);
        
        return collisions;
    }
}
```

**步骤 2：穿透检测和处理**
```typescript
// 防止高速物体穿透
@ccclass('TunnellingPrevention')
export class TunnellingPrevention extends Component {
    @property
    public maxVelocity: number = 1000;
    
    @property  
    public subdivisionThreshold: number = 500;
    
    protected update(dt: number): void {
        // 检查所有高速移动的刚体
        const allBalls = find('BallContainer').children;
        
        allBalls.forEach(ball => {
            const rigidBody = ball.getComponent(RigidBody2D);
            if (rigidBody) {
                const speed = rigidBody.linearVelocity.mag();
                
                if (speed > this.subdivisionThreshold) {
                    this.preventTunnelling(ball, rigidBody, dt);
                }
                
                // 限制最大速度
                if (speed > this.maxVelocity) {
                    const normalizedVelocity = rigidBody.linearVelocity.normalize();
                    rigidBody.linearVelocity = normalizedVelocity.mul(this.maxVelocity);
                }
            }
        });
    }
    
    private preventTunnelling(ball: Node, rigidBody: RigidBody2D, dt: number): void {
        // 细分时间步长
        const subSteps = Math.ceil(rigidBody.linearVelocity.mag() / this.subdivisionThreshold);
        const subDt = dt / subSteps;
        
        for (let i = 0; i < subSteps; i++) {
            // 执行子步长的碰撞检测
            const collisions = this.ccdSystem.checkContinuousCollision(ball, subDt);
            
            if (collisions.length > 0) {
                // 处理第一个碰撞
                this.handleEarlyCollision(collisions[0], ball, subDt * i);
                break;
            }
        }
    }
}
```

## 第三阶段：特殊物理效果

### 3.1 弹球轨迹预测

**步骤 1：轨迹计算系统**
```typescript
@ccclass('TrajectoryPredictor')
export class TrajectoryPredictor extends Component {
    @property
    public predictionSteps: number = 50;
    
    @property
    public stepSize: number = 0.02;
    
    @property(Graphics)
    public trajectoryGraphics: Graphics = null;
    
    // 预测弹球轨迹
    public predictTrajectory(ball: Node, initialVelocity: Vec2): Vec3[] {
        const trajectory: Vec3[] = [];
        let currentPos = ball.getPosition();
        let currentVel = cc.v2(initialVelocity.x, initialVelocity.y);
        
        for (let i = 0; i < this.predictionSteps; i++) {
            // 模拟物理步进
            const nextPos = this.simulateStep(currentPos, currentVel, this.stepSize);
            
            // 检查潜在碰撞
            const collision = this.checkPotentialCollision(currentPos, nextPos);
            
            if (collision) {
                // 计算反射
                const reflectedVelocity = this.calculateReflection(currentVel, collision.normal);
                currentVel = reflectedVelocity;
                currentPos = collision.point;
            } else {
                currentPos = nextPos;
                // 应用重力
                currentVel.y += PhysicsSystem2D.instance.gravity.y * this.stepSize;
            }
            
            trajectory.push(currentPos);
            
            // 如果弹球离开屏幕，停止预测
            if (this.isOutOfBounds(currentPos)) {
                break;
            }
        }
        
        return trajectory;
    }
    
    // 绘制轨迹线
    public drawTrajectory(trajectory: Vec3[]): void {
        if (!this.trajectoryGraphics) return;
        
        this.trajectoryGraphics.clear();
        this.trajectoryGraphics.strokeColor = Color.YELLOW;
        this.trajectoryGraphics.lineWidth = 3;
        
        if (trajectory.length > 1) {
            this.trajectoryGraphics.moveTo(trajectory[0].x, trajectory[0].y);
            
            for (let i = 1; i < trajectory.length; i++) {
                const alpha = 1.0 - (i / trajectory.length); // 渐变透明度
                this.trajectoryGraphics.strokeColor = cc.color(255, 255, 0, 255 * alpha);
                this.trajectoryGraphics.lineTo(trajectory[i].x, trajectory[i].y);
            }
            
            this.trajectoryGraphics.stroke();
        }
    }
}
```

### 3.2 特殊物理状态

**步骤 1：时间扭曲效果**
```typescript
@ccclass('TimeWarp')
export class TimeWarp extends Component {
    @property
    public warpFactor: number = 0.5;
    
    @property
    public warpDuration: number = 3.0;
    
    private originalTimeScale: number = 1.0;
    private warpTimer: number = 0;
    
    public activateTimeWarp(factor: number, duration: number): void {
        this.warpFactor = factor;
        this.warpDuration = duration;
        this.warpTimer = duration;
        
        // 应用时间缩放到物理世界
        PhysicsSystem2D.instance.fixedTimeStep *= factor;
        
        // 视觉效果
        this.createTimeWarpEffect();
    }
    
    protected update(dt: number): void {
        if (this.warpTimer > 0) {
            this.warpTimer -= dt;
            
            if (this.warpTimer <= 0) {
                this.deactivateTimeWarp();
            }
        }
    }
    
    private deactivateTimeWarp(): void {
        // 恢复正常时间流速
        PhysicsSystem2D.instance.fixedTimeStep = 0.016; // 60 FPS
        
        this.clearTimeWarpEffect();
    }
}
```

**步骤 2：重力场效果**
```typescript
@ccclass('GravityField')
export class GravityField extends Component {
    @property
    public fieldStrength: number = 500;
    
    @property
    public fieldRadius: number = 200;
    
    @property
    public affectsAllObjects: boolean = false;
    
    protected update(dt: number): void {
        const fieldCenter = this.node.getPosition();
        const affectedObjects = this.getObjectsInRange();
        
        affectedObjects.forEach(obj => {
            this.applyGravitationalForce(obj, fieldCenter, dt);
        });
    }
    
    private applyGravitationalForce(target: Node, center: Vec3, dt: number): void {
        const rigidBody = target.getComponent(RigidBody2D);
        if (!rigidBody) return;
        
        const targetPos = target.getPosition();
        const direction = center.subtract(targetPos).normalize();
        const distance = Vec3.distance(center, targetPos);
        
        // 计算引力强度（距离越近，引力越强）
        const forceStrength = this.fieldStrength / Math.max(distance * distance, 1);
        const force = direction.multiplyScalar(forceStrength);
        
        // 应用力
        rigidBody.applyForceToCenter(cc.v2(force.x, force.y), true);
    }
}
```

### 3.3 碰撞粒子系统

**步骤 1：碰撞特效生成器**
```typescript
@ccclass('CollisionEffectGenerator')
export class CollisionEffectGenerator extends Component {
    @property({type: [Prefab]})
    public effectPrefabs: Prefab[] = [];
    
    @property
    public effectPool: Map<string, Node[]> = new Map();
    
    public createCollisionEffect(position: Vec3, ballType: BallType, targetType: string): void {
        const effectType = this.getEffectType(ballType, targetType);
        const effect = this.getEffectFromPool(effectType);
        
        if (effect) {
            effect.setPosition(position);
            effect.active = true;
            
            // 配置粒子系统
            const particleSystem = effect.getComponent(ParticleSystem2D);
            this.configureParticleSystem(particleSystem, ballType, targetType);
            
            // 播放音效
            this.playCollisionSound(ballType, targetType);
            
            // 设置自动回收
            this.scheduleOnce(() => {
                this.returnEffectToPool(effect, effectType);
            }, 2.0);
        }
    }
    
    private configureParticleSystem(particles: ParticleSystem2D, ballType: BallType, targetType: string): void {
        switch (ballType) {
            case BallType.FIRE:
                particles.startColor = cc.color(255, 100, 0);
                particles.endColor = cc.color(255, 255, 0);
                particles.emissionRate = 50;
                break;
            case BallType.ICE:
                particles.startColor = cc.color(100, 200, 255);
                particles.endColor = cc.color(255, 255, 255);
                particles.emissionRate = 30;
                break;
            case BallType.ELECTRIC:
                particles.startColor = cc.color(255, 255, 100);
                particles.endColor = cc.color(255, 255, 255);
                particles.emissionRate = 80;
                break;
            // ... 其他类型
        }
        
        // 根据目标类型调整特效
        if (targetType === 'brick') {
            particles.life *= 1.5;
            particles.startSize *= 1.2;
        }
    }
}
```

## 第四阶段：物理性能优化

### 4.1 碰撞检测优化

**步骤 1：空间分割系统**
```typescript
@ccclass('SpatialHashGrid')
export class SpatialHashGrid extends Component {
    private cellSize: number = 100;
    private grid: Map<string, Set<Node>> = new Map();
    private objectCells: Map<Node, string[]> = new Map();
    
    public updateObjectPosition(obj: Node): void {
        // 移除旧的单元格记录
        const oldCells = this.objectCells.get(obj) || [];
        oldCells.forEach(cellKey => {
            this.grid.get(cellKey)?.delete(obj);
        });
        
        // 计算新的单元格位置
        const newCells = this.getCellsForObject(obj);
        this.objectCells.set(obj, newCells);
        
        // 添加到新单元格
        newCells.forEach(cellKey => {
            if (!this.grid.has(cellKey)) {
                this.grid.set(cellKey, new Set());
            }
            this.grid.get(cellKey).add(obj);
        });
    }
    
    public getNearbyObjects(obj: Node): Node[] {
        const cells = this.objectCells.get(obj) || [];
        const nearbyObjects = new Set<Node>();
        
        cells.forEach(cellKey => {
            const cellObjects = this.grid.get(cellKey);
            if (cellObjects) {
                cellObjects.forEach(other => {
                    if (other !== obj) {
                        nearbyObjects.add(other);
                    }
                });
            }
        });
        
        return Array.from(nearbyObjects);
    }
    
    private getCellsForObject(obj: Node): string[] {
        const pos = obj.getPosition();
        const collider = obj.getComponent(Collider2D);
        const bounds = collider ? collider.worldAABB : { xMin: pos.x, xMax: pos.x, yMin: pos.y, yMax: pos.y };
        
        const cells: string[] = [];
        
        const minX = Math.floor(bounds.xMin / this.cellSize);
        const maxX = Math.floor(bounds.xMax / this.cellSize);
        const minY = Math.floor(bounds.yMin / this.cellSize);
        const maxY = Math.floor(bounds.yMax / this.cellSize);
        
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                cells.push(`${x},${y}`);
            }
        }
        
        return cells;
    }
}
```

**步骤 2：碰撞检测级联优化**
```typescript
@ccclass('CollisionLOD')
export class CollisionLOD extends Component {
    private highDetailDistance: number = 300;
    private mediumDetailDistance: number = 600;
    
    protected update(dt: number): void {
        const playerPosition = this.getPlayerPosition();
        const allObjects = this.getAllPhysicsObjects();
        
        allObjects.forEach(obj => {
            const distance = Vec3.distance(obj.getPosition(), playerPosition);
            this.setCollisionDetail(obj, distance);
        });
    }
    
    private setCollisionDetail(obj: Node, distance: number): void {
        const rigidBody = obj.getComponent(RigidBody2D);
        if (!rigidBody) return;
        
        if (distance < this.highDetailDistance) {
            // 高精度：启用连续碰撞检测
            rigidBody.bullet = true;
            this.enableContinuousCollision(obj);
        } else if (distance < this.mediumDetailDistance) {
            // 中精度：标准碰撞检测
            rigidBody.bullet = false;
            this.enableStandardCollision(obj);
        } else {
            // 低精度：减少碰撞检测频率
            rigidBody.bullet = false;
            this.enableLowFrequencyCollision(obj);
        }
    }
}
```

### 4.2 内存管理优化

**步骤 1：碰撞事件池化**
```typescript
@ccclass('CollisionEventPool')
export class CollisionEventPool extends Component {
    private static eventPool: CollisionEvent[] = [];
    private static maxPoolSize: number = 100;
    
    public static getCollisionEvent(): CollisionEvent {
        if (this.eventPool.length > 0) {
            return this.eventPool.pop();
        } else {
            return new CollisionEvent();
        }
    }
    
    public static returnCollisionEvent(event: CollisionEvent): void {
        if (this.eventPool.length < this.maxPoolSize) {
            event.reset();
            this.eventPool.push(event);
        }
    }
    
    // 批量处理碰撞事件
    public static processBatchedCollisions(events: CollisionEvent[]): void {
        // 按类型分组处理
        const groupedEvents = this.groupEventsByType(events);
        
        groupedEvents.forEach((eventList, type) => {
            this.processCollisionGroup(type, eventList);
        });
        
        // 返回所有事件到池中
        events.forEach(event => this.returnCollisionEvent(event));
    }
}
```

**步骤 2：物理对象池**
```typescript
@ccclass('PhysicsObjectPool')
export class PhysicsObjectPool extends Component {
    private ballPools: Map<BallType, Node[]> = new Map();
    private effectPools: Map<string, Node[]> = new Map();
    
    public getBall(ballType: BallType): Node {
        if (!this.ballPools.has(ballType)) {
            this.ballPools.set(ballType, []);
        }
        
        const pool = this.ballPools.get(ballType);
        if (pool.length > 0) {
            const ball = pool.pop();
            this.resetBallPhysics(ball);
            return ball;
        } else {
            return this.createNewBall(ballType);
        }
    }
    
    public returnBall(ball: Node, ballType: BallType): void {
        // 清理物理状态
        const rigidBody = ball.getComponent(RigidBody2D);
        if (rigidBody) {
            rigidBody.linearVelocity = cc.v2(0, 0);
            rigidBody.angularVelocity = 0;
        }
        
        // 移出屏幕
        ball.setPosition(0, -1000, 0);
        ball.active = false;
        
        // 返回池中
        const pool = this.ballPools.get(ballType);
        if (pool && pool.length < 20) { // 限制池大小
            pool.push(ball);
        } else {
            ball.destroy();
        }
    }
}
```

## 第五阶段：调试和验证

### 5.1 物理调试工具

**步骤 1：可视化调试**
```typescript
@ccclass('PhysicsDebugger')
export class PhysicsDebugger extends Component {
    @property
    public showColliders: boolean = false;
    
    @property
    public showVelocities: boolean = false;
    
    @property
    public showForces: boolean = false;
    
    @property(Graphics)
    public debugGraphics: Graphics = null;
    
    protected update(dt: number): void {
        if (!CC_DEBUG) return;
        
        this.debugGraphics.clear();
        
        if (this.showColliders) {
            this.drawAllColliders();
        }
        
        if (this.showVelocities) {
            this.drawVelocityVectors();
        }
        
        if (this.showForces) {
            this.drawForceVectors();
        }
    }
    
    private drawAllColliders(): void {
        const allColliders = find('Canvas').getComponentsInChildren(Collider2D);
        
        allColliders.forEach(collider => {
            const bounds = collider.worldAABB;
            
            this.debugGraphics.strokeColor = Color.GREEN;
            this.debugGraphics.lineWidth = 2;
            this.debugGraphics.rect(
                bounds.xMin, bounds.yMin,
                bounds.width, bounds.height
            );
            this.debugGraphics.stroke();
        });
    }
    
    private drawVelocityVectors(): void {
        const allBodies = find('Canvas').getComponentsInChildren(RigidBody2D);
        
        allBodies.forEach(body => {
            if (body.linearVelocity.mag() > 0.1) {
                const pos = body.node.getPosition();
                const vel = body.linearVelocity.normalize().mul(50); // 缩放用于显示
                
                this.debugGraphics.strokeColor = Color.RED;
                this.debugGraphics.lineWidth = 3;
                this.debugGraphics.moveTo(pos.x, pos.y);
                this.debugGraphics.lineTo(pos.x + vel.x, pos.y + vel.y);
                this.debugGraphics.stroke();
            }
        });
    }
}
```

**步骤 2：性能监控**
```typescript
@ccclass('PhysicsProfiler')
export class PhysicsProfiler extends Component {
    private frameCollisionCounts: number[] = [];
    private maxFrameHistory: number = 60;
    
    @property(Label)
    public collisionCountLabel: Label = null;
    
    @property(Label)
    public physicsTimeLabel: Label = null;
    
    protected update(dt: number): void {
        // 记录当前帧碰撞数
        const currentCollisions = this.getCurrentFrameCollisions();
        this.frameCollisionCounts.push(currentCollisions);
        
        if (this.frameCollisionCounts.length > this.maxFrameHistory) {
            this.frameCollisionCounts.shift();
        }
        
        // 计算平均值
        const avgCollisions = this.frameCollisionCounts.reduce((a, b) => a + b, 0) / this.frameCollisionCounts.length;
        
        // 更新UI显示
        if (this.collisionCountLabel) {
            this.collisionCountLabel.string = `碰撞/帧: ${avgCollisions.toFixed(1)}`;
        }
        
        // 监控物理计算时间
        const physicsTime = this.measurePhysicsTime();
        if (this.physicsTimeLabel) {
            this.physicsTimeLabel.string = `物理耗时: ${(physicsTime * 1000).toFixed(2)}ms`;
        }
    }
    
    private measurePhysicsTime(): number {
        const startTime = performance.now();
        
        // 这里应该在物理步进前后测量
        // 实际实现中需要Hook到Physics2D系统
        
        const endTime = performance.now();
        return (endTime - startTime) / 1000; // 转换为秒
    }
}
```

### 5.2 单元测试

**步骤 1：碰撞测试用例**
```typescript
@ccclass('CollisionTestSuite')
export class CollisionTestSuite extends Component {
    public runAllTests(): void {
        console.log('开始物理系统测试...');
        
        this.testPerfectElasticity();
        this.testCollisionFiltering();
        this.testContinuousCollision();
        this.testPerformanceUnderLoad();
        
        console.log('物理系统测试完成');
    }
    
    private testPerfectElasticity(): void {
        // 测试完美弹性碰撞
        const ball = this.createTestBall();
        ball.getComponent(RigidBody2D).linearVelocity = cc.v2(100, 0);
        
        const initialEnergy = this.calculateKineticEnergy(ball);
        
        // 模拟碰撞
        this.simulateWallCollision(ball);
        
        const finalEnergy = this.calculateKineticEnergy(ball);
        const energyLoss = Math.abs(initialEnergy - finalEnergy) / initialEnergy;
        
        console.assert(energyLoss < 0.001, `能量损失过大: ${energyLoss}`);
    }
    
    private testCollisionFiltering(): void {
        // 测试碰撞过滤
        const ball = this.createTestBall();
        const powerup = this.createTestPowerup();
        
        ball.getComponent(Collider2D).group = PhysicsGroup.BALL;
        powerup.getComponent(Collider2D).group = PhysicsGroup.POWERUP;
        
        // Ball和PowerUp不应该碰撞
        const shouldCollide = this.testCollisionBetween(ball, powerup);
        console.assert(!shouldCollide, '球和道具不应该碰撞');
    }
}
```

## 性能优化建议

### 碰撞检测优化
- 使用空间分割减少不必要的碰撞检测
- 实现碰撞检测的LOD系统
- 批量处理碰撞事件减少开销

### 物理计算优化
- 对静止对象启用睡眠机制
- 使用固定时间步长保证稳定性
- 限制活跃物理对象数量

### 内存管理
- 实现物理对象和事件的对象池
- 及时清理不必要的碰撞监听器
- 优化粒子系统的创建和销毁

这个物理和碰撞系统工作流程提供了完整的物理引擎集成方案，确保游戏具有精确的物理模拟和良好的性能表现。