import { _decorator, Component, Node, ParticleSystem2D, tween, Color, Vec3, UITransform, Sprite, SpriteFrame, Texture2D } from 'cc';

const { ccclass, property } = _decorator;

export enum VisualEffectType {
    // 弹球特效
    BALL_FIRE_TRAIL = 'ball_fire_trail',
    BALL_ICE_AURA = 'ball_ice_aura', 
    BALL_ELECTRIC_SPARK = 'ball_electric_spark',
    BALL_POISON_MIST = 'ball_poison_mist',
    BALL_EXPLOSIVE_CHARGE = 'ball_explosive_charge',
    BALL_PIERCING_GLOW = 'ball_piercing_glow',
    BALL_MAGNETIC_FIELD = 'ball_magnetic_field',
    BALL_PHASE_SHIMMER = 'ball_phase_shimmer',
    BALL_GRAVITY_DISTORTION = 'ball_gravity_distortion',
    BALL_TIME_RIPPLE = 'ball_time_ripple',
    BALL_HEALING_LIGHT = 'ball_healing_light',
    BALL_CHAOS_SWIRL = 'ball_chaos_swirl',
    
    // 砖块特效
    BRICK_FIRE_BURN = 'brick_fire_burn',
    BRICK_ICE_FREEZE = 'brick_ice_freeze',
    BRICK_ELECTRIC_CHAIN = 'brick_electric_chain',
    BRICK_POISON_CORRODE = 'brick_poison_corrode',
    BRICK_EXPLOSION = 'brick_explosion',
    BRICK_SPLITTING = 'brick_splitting',
    BRICK_MAGNETIC_ATTRACT = 'brick_magnetic_attract',
    BRICK_PHASE_FADE = 'brick_phase_fade',
    BRICK_REGENERATION = 'brick_regeneration',
    BRICK_CRYSTAL_SHATTER = 'brick_crystal_shatter',
    
    // 挡板特效
    PADDLE_FIRE_ARMOR = 'paddle_fire_armor',
    PADDLE_ICE_SHIELD = 'paddle_ice_shield',
    PADDLE_ELECTRIC_CHARGE = 'paddle_electric_charge',
    PADDLE_DAMAGE_SPARKS = 'paddle_damage_sparks',
    PADDLE_REPAIR_GLOW = 'paddle_repair_glow',
    PADDLE_LEVEL_UP_BURST = 'paddle_level_up_burst',
    PADDLE_LASER_CHARGE = 'paddle_laser_charge',
    
    // 核心特效
    CORE_DAMAGE_CRACK = 'core_damage_crack',
    CORE_CRITICAL_PULSE = 'core_critical_pulse',
    CORE_HEALING_AURA = 'core_healing_aura',
    CORE_LEVEL_UP_NOVA = 'core_level_up_nova',
    CORE_DESTRUCTION = 'core_destruction',
    
    // 环境特效
    ENV_FIRE_PARTICLES = 'env_fire_particles',
    ENV_ICE_CRYSTALS = 'env_ice_crystals',
    ENV_ELECTRIC_ARCS = 'env_electric_arcs',
    ENV_POISON_FOG = 'env_poison_fog',
    ENV_EXPLOSION_SHOCKWAVE = 'env_explosion_shockwave',
    ENV_LIGHT_RAYS = 'env_light_rays',
    
    // UI特效
    UI_BUTTON_GLOW = 'ui_button_glow',
    UI_TRANSITION_FADE = 'ui_transition_fade',
    UI_SUCCESS_SPARKLE = 'ui_success_sparkle',
    UI_ERROR_SHAKE = 'ui_error_shake'
}

export interface EffectStackLayer {
    effectType: VisualEffectType;
    node: Node;
    duration: number;
    stackLevel: number;
    blendMode: string;
    priority: number;
    isActive: boolean;
}

@ccclass('AdvancedEffectSystem')
export class AdvancedEffectSystem extends Component {
    
    @property
    public maxEffectNodes: number = 50;
    
    @property
    public enableEffectStacking: boolean = true;
    
    @property
    public effectQualityLevel: number = 2; // 0-低, 1-中, 2-高
    
    @property
    public enableParticlePooling: boolean = true;

    private static _instance: AdvancedEffectSystem | null = null;
    private _effectPool: Node[] = [];
    private _activeEffects: Map<string, EffectStackLayer[]> = new Map();
    private _effectStacks: Map<string, EffectStackLayer[]> = new Map();
    private _particlePool: ParticleSystem2D[] = [];
    private _effectConfigs: Map<VisualEffectType, any> = new Map();

    public static getInstance(): AdvancedEffectSystem | null {
        return AdvancedEffectSystem._instance;
    }

    protected onLoad(): void {
        if (AdvancedEffectSystem._instance === null) {
            AdvancedEffectSystem._instance = this;
        }
        
        this.initializeEffectPool();
        this.initializeEffectConfigs();
    }

    protected onDestroy(): void {
        if (AdvancedEffectSystem._instance === this) {
            AdvancedEffectSystem._instance = null;
        }
        
        this.clearAllEffects();
    }

    /**
     * 初始化特效池
     */
    private initializeEffectPool(): void {
        for (let i = 0; i < this.maxEffectNodes; i++) {
            const effectNode = new Node(`Effect_${i}`);
            effectNode.active = false;
            this.node.addChild(effectNode);
            this._effectPool.push(effectNode);
        }
        
        console.log(`Effect pool initialized with ${this.maxEffectNodes} nodes`);
    }

    /**
     * 初始化特效配置
     */
    private initializeEffectConfigs(): void {
        // 弹球火焰尾迹配置
        this._effectConfigs.set(VisualEffectType.BALL_FIRE_TRAIL, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(100, 50, 25),
            lifetime: 1.5,
            startColor: new Color(255, 100, 0, 255),
            endColor: new Color(255, 0, 0, 0),
            startSize: 8,
            endSize: 2,
            speed: 50,
            gravity: { x: 0, y: -100 },
            emission: 60,
            shape: 'point',
            blend: 'additive',
            texture: 'fire_particle'
        });

        // 弹球冰霜光环配置
        this._effectConfigs.set(VisualEffectType.BALL_ICE_AURA, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(80, 40, 20),
            lifetime: 2.0,
            startColor: new Color(150, 200, 255, 180),
            endColor: new Color(100, 150, 255, 0),
            startSize: 12,
            endSize: 20,
            speed: 20,
            gravity: { x: 0, y: 0 },
            emission: 30,
            shape: 'circle',
            blend: 'normal',
            texture: 'ice_crystal'
        });

        // 弹球电击火花配置
        this._effectConfigs.set(VisualEffectType.BALL_ELECTRIC_SPARK, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(60, 30, 15),
            lifetime: 0.8,
            startColor: new Color(255, 255, 100, 255),
            endColor: new Color(100, 100, 255, 0),
            startSize: 4,
            endSize: 1,
            speed: 100,
            gravity: { x: 0, y: 0 },
            emission: 80,
            shape: 'cone',
            blend: 'additive',
            texture: 'electric_spark'
        });

        // 砖块爆炸配置
        this._effectConfigs.set(VisualEffectType.BRICK_EXPLOSION, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(150, 75, 35),
            lifetime: 1.0,
            startColor: new Color(255, 150, 0, 255),
            endColor: new Color(100, 50, 0, 0),
            startSize: 15,
            endSize: 5,
            speed: 150,
            gravity: { x: 0, y: -200 },
            emission: 200,
            shape: 'sphere',
            blend: 'additive',
            texture: 'explosion_fragment',
            burst: true,
            shockwave: true
        });

        // 挡板火焰护甲配置
        this._effectConfigs.set(VisualEffectType.PADDLE_FIRE_ARMOR, {
            type: 'composite',
            layers: [
                {
                    type: 'particle',
                    particleCount: this.getParticleCountByQuality(40, 20, 10),
                    lifetime: 1.5,
                    startColor: new Color(255, 100, 0, 200),
                    endColor: new Color(255, 0, 0, 0),
                    startSize: 6,
                    endSize: 12,
                    speed: 30,
                    emission: 25,
                    shape: 'box',
                    texture: 'fire_armor'
                },
                {
                    type: 'glow',
                    color: new Color(255, 50, 0, 100),
                    intensity: 0.8,
                    radius: 20,
                    pulsate: true
                }
            ]
        });

        console.log(`Initialized ${this._effectConfigs.size} effect configurations`);
    }

    /**
     * 添加特效到对象
     */
    public addEffectToObject(targetNode: Node, effectType: VisualEffectType, duration: number = -1, stackLevel: number = 1): string {
        const objectId = targetNode.uuid;
        const effectId = `${effectType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        // 检查是否启用特效叠加
        if (this.enableEffectStacking) {
            if (!this._effectStacks.has(objectId)) {
                this._effectStacks.set(objectId, []);
            }
            
            const existingStack = this._effectStacks.get(objectId)!;
            const existingEffect = existingStack.find(layer => layer.effectType === effectType);
            
            if (existingEffect) {
                // 更新现有特效的叠加层级
                existingEffect.stackLevel = Math.min(existingEffect.stackLevel + stackLevel, 5);
                this.updateEffectIntensity(existingEffect);
                return effectId;
            }
        }

        // 创建新的特效层
        const effectNode = this.getEffectNode();
        if (!effectNode) {
            console.warn('No available effect nodes');
            return '';
        }

        const effectLayer = this.createEffectLayer(effectNode, targetNode, effectType, duration, stackLevel);
        if (!effectLayer) {
            this.returnEffectNode(effectNode);
            return '';
        }

        // 添加到堆栈
        if (!this._effectStacks.has(objectId)) {
            this._effectStacks.set(objectId, []);
        }
        this._effectStacks.get(objectId)!.push(effectLayer);

        // 如果有持续时间，设置自动清理
        if (duration > 0) {
            this.scheduleOnce(() => {
                this.removeEffectFromObject(targetNode, effectType);
            }, duration);
        }

        console.log(`Added effect ${effectType} to object ${objectId}, stack level: ${stackLevel}`);
        return effectId;
    }

    /**
     * 从对象移除特效
     */
    public removeEffectFromObject(targetNode: Node, effectType?: VisualEffectType): void {
        const objectId = targetNode.uuid;
        const effectStack = this._effectStacks.get(objectId);
        
        if (!effectStack) return;

        if (effectType) {
            // 移除特定类型的特效
            const index = effectStack.findIndex(layer => layer.effectType === effectType);
            if (index !== -1) {
                const layer = effectStack[index];
                this.destroyEffectLayer(layer);
                effectStack.splice(index, 1);
            }
        } else {
            // 移除所有特效
            effectStack.forEach(layer => this.destroyEffectLayer(layer));
            effectStack.length = 0;
        }

        if (effectStack.length === 0) {
            this._effectStacks.delete(objectId);
        }
    }

    /**
     * 创建特效层
     */
    private createEffectLayer(effectNode: Node, targetNode: Node, effectType: VisualEffectType, duration: number, stackLevel: number): EffectStackLayer | null {
        const config = this._effectConfigs.get(effectType);
        if (!config) {
            console.warn(`Effect config not found: ${effectType}`);
            return null;
        }

        effectNode.active = true;
        effectNode.parent = targetNode;
        effectNode.setPosition(0, 0, 0);

        // 根据配置类型创建特效
        switch (config.type) {
            case 'particle':
                this.createParticleEffect(effectNode, config, stackLevel);
                break;
            case 'composite':
                this.createCompositeEffect(effectNode, config, stackLevel);
                break;
            case 'shader':
                this.createShaderEffect(effectNode, config, stackLevel);
                break;
            default:
                console.warn(`Unknown effect type: ${config.type}`);
                return null;
        }

        return {
            effectType,
            node: effectNode,
            duration,
            stackLevel,
            blendMode: config.blend || 'normal',
            priority: config.priority || 5,
            isActive: true
        };
    }

    /**
     * 创建粒子特效
     */
    private createParticleEffect(effectNode: Node, config: any, stackLevel: number): void {
        const particle = effectNode.addComponent(ParticleSystem2D);
        
        // 基础粒子配置
        particle.totalParticles = Math.floor(config.particleCount * stackLevel);
        particle.duration = config.lifetime;
        particle.emissionRate = config.emission * stackLevel;
        
        // 颜色配置
        particle.startColor = config.startColor;
        particle.endColor = config.endColor;
        
        // 大小配置
        particle.startSize = config.startSize;
        particle.endSize = config.endSize;
        
        // 运动配置
        particle.speed = config.speed;
        particle.speedVar = config.speed * 0.3;
        
        // 重力配置
        if (config.gravity) {
            particle.gravity = new Vec3(config.gravity.x, config.gravity.y, 0);
        }
        
        // 发射形状配置
        switch (config.shape) {
            case 'point':
                particle.positionType = ParticleSystem2D.PositionType.FREE;
                break;
            case 'circle':
                particle.positionType = ParticleSystem2D.PositionType.RELATIVE;
                break;
            case 'sphere':
                particle.positionType = ParticleSystem2D.PositionType.GROUPED;
                break;
        }
        
        // 爆发模式
        if (config.burst) {
            particle.emissionRate = 0;
            particle.totalParticles = config.particleCount * stackLevel;
            this.scheduleOnce(() => {
                particle.resetSystem();
            }, 0.1);
        }
        
        // 创建震荡波效果
        if (config.shockwave) {
            this.createShockwaveEffect(effectNode, stackLevel);
        }
        
        particle.resetSystem();
    }

    /**
     * 创建复合特效
     */
    private createCompositeEffect(effectNode: Node, config: any, stackLevel: number): void {
        config.layers.forEach((layerConfig: any, index: number) => {
            const layerNode = new Node(`Layer_${index}`);
            effectNode.addChild(layerNode);
            
            switch (layerConfig.type) {
                case 'particle':
                    this.createParticleEffect(layerNode, layerConfig, stackLevel);
                    break;
                case 'glow':
                    this.createGlowEffect(layerNode, layerConfig, stackLevel);
                    break;
                case 'distortion':
                    this.createDistortionEffect(layerNode, layerConfig, stackLevel);
                    break;
            }
        });
    }

    /**
     * 创建发光效果
     */
    private createGlowEffect(effectNode: Node, config: any, stackLevel: number): void {
        const sprite = effectNode.addComponent(Sprite);
        const uiTransform = effectNode.addComponent(UITransform);
        
        // 创建发光贴图
        const glowTexture = this.createGlowTexture(config.radius * stackLevel, config.color);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = glowTexture;
        sprite.spriteFrame = spriteFrame;
        
        uiTransform.setContentSize(config.radius * 2 * stackLevel, config.radius * 2 * stackLevel);
        sprite.color = config.color;
        
        // 脉冲动画
        if (config.pulsate) {
            const originalScale = effectNode.scale.clone();
            tween(effectNode)
                .repeatForever(
                    tween()
                        .to(0.8, { scale: originalScale.multiplyScalar(1.2) })
                        .to(0.8, { scale: originalScale })
                )
                .start();
        }
    }

    /**
     * 创建震荡波效果
     */
    private createShockwaveEffect(effectNode: Node, stackLevel: number): void {
        const shockwaveNode = new Node('Shockwave');
        effectNode.addChild(shockwaveNode);
        
        const sprite = shockwaveNode.addComponent(Sprite);
        const uiTransform = shockwaveNode.addComponent(UITransform);
        
        // 创建环形贴图
        const ringTexture = this.createRingTexture(50 * stackLevel);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = ringTexture;
        sprite.spriteFrame = spriteFrame;
        
        uiTransform.setContentSize(20, 20);
        sprite.color = new Color(255, 255, 255, 200);
        
        // 震荡波扩散动画
        tween(shockwaveNode)
            .parallel(
                tween().to(0.5, { scale: new Vec3(5 * stackLevel, 5 * stackLevel, 1) }),
                tween().to(0.5, { 
                    scale: new Vec3(5 * stackLevel, 5 * stackLevel, 1),
                    color: new Color(255, 255, 255, 0)
                })
            )
            .call(() => {
                shockwaveNode.destroy();
            })
            .start();
    }

    /**
     * 更新特效强度
     */
    private updateEffectIntensity(effectLayer: EffectStackLayer): void {
        const particle = effectLayer.node.getComponent(ParticleSystem2D);
        if (particle) {
            const config = this._effectConfigs.get(effectLayer.effectType);
            if (config) {
                particle.totalParticles = Math.floor(config.particleCount * effectLayer.stackLevel);
                particle.emissionRate = config.emission * effectLayer.stackLevel;
                particle.resetSystem();
            }
        }
    }

    /**
     * 工具方法
     */
    private getEffectNode(): Node | null {
        for (const node of this._effectPool) {
            if (!node.active) {
                return node;
            }
        }
        return null;
    }

    private returnEffectNode(node: Node): void {
        node.active = false;
        node.parent = this.node;
        node.removeAllChildren();
        node.destroyAllComponents();
    }

    private destroyEffectLayer(layer: EffectStackLayer): void {
        layer.isActive = false;
        this.returnEffectNode(layer.node);
    }

    private getParticleCountByQuality(high: number, medium: number, low: number): number {
        switch (this.effectQualityLevel) {
            case 2: return high;
            case 1: return medium;
            case 0: return low;
            default: return medium;
        }
    }

    private createGlowTexture(radius: number, color: Color): Texture2D {
        const size = radius * 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        
        const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        const texture = new Texture2D();
        texture.initWithElement(canvas);
        return texture;
    }

    private createRingTexture(radius: number): Texture2D {
        const size = radius * 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
        ctx.stroke();
        
        const texture = new Texture2D();
        texture.initWithElement(canvas);
        return texture;
    }

    /**
     * 特效管理方法
     */
    public clearAllEffects(): void {
        this._effectStacks.forEach(stack => {
            stack.forEach(layer => this.destroyEffectLayer(layer));
        });
        this._effectStacks.clear();
    }

    public setEffectQuality(level: number): void {
        try {
            const oldQuality = this.effectQualityLevel;
            this.effectQualityLevel = Math.max(0, Math.min(2, Math.round(level || 0)));
            
            if (this.effectQualityLevel !== oldQuality) {
                console.log(`Effect quality changed from ${oldQuality} to ${this.effectQualityLevel}`);
                
                // Update existing effects if needed
                this.updateEffectsForQualityChange();
            }
            
        } catch (error) {
            console.error('Error setting effect quality:', error);
            this.effectQualityLevel = 2; // Default to high quality
        }
    }

    private updateEffectsForQualityChange(): void {
        try {
            // Update all active effects to match new quality level
            this._effectStacks.forEach((stack) => {
                stack.forEach(layer => {
                    if (layer.isActive) {
                        this.updateEffectIntensity(layer);
                    }
                });
            });
        } catch (error) {
            console.warn('Error updating effects for quality change:', error);
        }
    }

    public pauseAllEffects(): void {
        this._effectStacks.forEach(stack => {
            stack.forEach(layer => {
                const particle = layer.node.getComponent(ParticleSystem2D);
                if (particle && layer.isActive) {
                    particle.stopSystem();
                }
            });
        });
    }

    public resumeAllEffects(): void {
        this._effectStacks.forEach(stack => {
            stack.forEach(layer => {
                const particle = layer.node.getComponent(ParticleSystem2D);
                if (particle && layer.isActive) {
                    particle.resetSystem();
                }
            });
        });
    }

    /**
     * 快捷方法
     */
    public addFireTrailToBall(ballNode: Node, duration: number = -1): string {
        return this.addEffectToObject(ballNode, VisualEffectType.BALL_FIRE_TRAIL, duration);
    }

    public addIceAuraToBall(ballNode: Node, duration: number = -1): string {
        return this.addEffectToObject(ballNode, VisualEffectType.BALL_ICE_AURA, duration);
    }

    public addElectricSparksToBall(ballNode: Node, duration: number = -1): string {
        return this.addEffectToObject(ballNode, VisualEffectType.BALL_ELECTRIC_SPARK, duration);
    }

    public createBrickExplosion(brickNode: Node): void {
        this.addEffectToObject(brickNode, VisualEffectType.BRICK_EXPLOSION, 1.0);
    }

    public addFireArmorToPaddle(paddleNode: Node, duration: number = -1): string {
        return this.addEffectToObject(paddleNode, VisualEffectType.PADDLE_FIRE_ARMOR, duration);
    }

    public createShaderEffect(effectNode: Node, config: any, stackLevel: number): void {
        // 着色器特效的实现留待后续扩展
        console.log('Shader effects not implemented yet');
    }

    public createDistortionEffect(effectNode: Node, config: any, stackLevel: number): void {
        // 扭曲特效的实现留待后续扩展
        console.log('Distortion effects not implemented yet');
    }
}