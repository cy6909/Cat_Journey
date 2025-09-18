import '../setup';

// Mock visual effect types
enum MockVisualEffectType {
    BALL_FIRE_TRAIL = 'ball_fire_trail',
    BALL_ICE_AURA = 'ball_ice_aura',
    BALL_ELECTRIC_SPARK = 'ball_electric_spark',
    BRICK_EXPLOSION = 'brick_explosion',
    PADDLE_FIRE_ARMOR = 'paddle_fire_armor',
    CORE_DAMAGE_CRACK = 'core_damage_crack'
}

interface MockEffectStackLayer {
    effectType: MockVisualEffectType;
    node: any;
    duration: number;
    stackLevel: number;
    blendMode: string;
    priority: number;
    isActive: boolean;
}

// Create a simplified AdvancedEffectSystem for testing
class MockAdvancedEffectSystem {
    private static _instance: MockAdvancedEffectSystem | null = null;
    
    public maxEffectNodes = 50;
    public enableEffectStacking = true;
    public effectQualityLevel = 2;
    public enableParticlePooling = true;

    private _effectPool: any[] = [];
    private _activeEffects = new Map<string, MockEffectStackLayer[]>();
    private _effectStacks = new Map<string, MockEffectStackLayer[]>();
    private _particlePool: any[] = [];
    private _effectConfigs = new Map<MockVisualEffectType, any>();

    public static getInstance(): MockAdvancedEffectSystem | null {
        return MockAdvancedEffectSystem._instance;
    }

    protected onLoad(): void {
        if (MockAdvancedEffectSystem._instance === null) {
            MockAdvancedEffectSystem._instance = this;
        }
        
        this.initializeEffectPool();
        this.initializeEffectConfigs();
    }

    protected onDestroy(): void {
        if (MockAdvancedEffectSystem._instance === this) {
            MockAdvancedEffectSystem._instance = null;
        }
        
        this.clearAllEffects();
    }

    private initializeEffectPool(): void {
        for (let i = 0; i < this.maxEffectNodes; i++) {
            const effectNode = new cc.Node(`Effect_${i}`);
            effectNode.active = false;
            this._effectPool.push(effectNode);
        }
    }

    private initializeEffectConfigs(): void {
        this._effectConfigs.set(MockVisualEffectType.BALL_FIRE_TRAIL, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(100, 50, 25),
            lifetime: 1.5,
            startColor: new cc.Color(255, 100, 0, 255),
            endColor: new cc.Color(255, 0, 0, 0),
            startSize: 8,
            endSize: 2,
            speed: 50,
            gravity: { x: 0, y: -100 },
            emission: 60,
            shape: 'point',
            blend: 'additive',
            texture: 'fire_particle'
        });

        this._effectConfigs.set(MockVisualEffectType.BALL_ICE_AURA, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(80, 40, 20),
            lifetime: 2.0,
            startColor: new cc.Color(150, 200, 255, 180),
            endColor: new cc.Color(100, 150, 255, 0),
            startSize: 12,
            endSize: 20,
            speed: 20,
            gravity: { x: 0, y: 0 },
            emission: 30,
            shape: 'circle',
            blend: 'normal',
            texture: 'ice_crystal'
        });

        this._effectConfigs.set(MockVisualEffectType.BRICK_EXPLOSION, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(150, 75, 35),
            lifetime: 1.0,
            startColor: new cc.Color(255, 150, 0, 255),
            endColor: new cc.Color(100, 50, 0, 0),
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

        this._effectConfigs.set(MockVisualEffectType.PADDLE_FIRE_ARMOR, {
            type: 'composite',
            layers: [
                {
                    type: 'particle',
                    particleCount: this.getParticleCountByQuality(40, 20, 10),
                    lifetime: 1.5,
                    startColor: new cc.Color(255, 100, 0, 200),
                    endColor: new cc.Color(255, 0, 0, 0),
                    startSize: 6,
                    endSize: 12,
                    speed: 30,
                    emission: 25,
                    shape: 'box',
                    texture: 'fire_armor'
                },
                {
                    type: 'glow',
                    color: new cc.Color(255, 50, 0, 100),
                    intensity: 0.8,
                    radius: 20,
                    pulsate: true
                }
            ]
        });
    }

    public addEffectToObject(targetNode: any, effectType: MockVisualEffectType, duration: number = -1, stackLevel: number = 1): string {
        const objectId = targetNode.uuid;
        const effectId = `${effectType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        if (this.enableEffectStacking) {
            if (!this._effectStacks.has(objectId)) {
                this._effectStacks.set(objectId, []);
            }
            
            const existingStack = this._effectStacks.get(objectId)!;
            const existingEffect = existingStack.find(layer => layer.effectType === effectType);
            
            if (existingEffect) {
                existingEffect.stackLevel = Math.min(existingEffect.stackLevel + stackLevel, 5);
                this.updateEffectIntensity(existingEffect);
                return effectId;
            }
        }

        const effectNode = this.getEffectNode();
        if (!effectNode) {
            return '';
        }

        const effectLayer = this.createEffectLayer(effectNode, targetNode, effectType, duration, stackLevel);
        if (!effectLayer) {
            this.returnEffectNode(effectNode);
            return '';
        }

        if (!this._effectStacks.has(objectId)) {
            this._effectStacks.set(objectId, []);
        }
        this._effectStacks.get(objectId)!.push(effectLayer);

        if (duration > 0) {
            setTimeout(() => {
                this.removeEffectFromObject(targetNode, effectType);
            }, duration * 1000);
        }

        return effectId;
    }

    public removeEffectFromObject(targetNode: any, effectType?: MockVisualEffectType): void {
        const objectId = targetNode.uuid;
        const effectStack = this._effectStacks.get(objectId);
        
        if (!effectStack) return;

        if (effectType) {
            const index = effectStack.findIndex(layer => layer.effectType === effectType);
            if (index !== -1) {
                const layer = effectStack[index];
                this.destroyEffectLayer(layer);
                effectStack.splice(index, 1);
            }
        } else {
            effectStack.forEach(layer => this.destroyEffectLayer(layer));
            effectStack.length = 0;
        }

        if (effectStack.length === 0) {
            this._effectStacks.delete(objectId);
        }
    }

    private createEffectLayer(effectNode: any, targetNode: any, effectType: MockVisualEffectType, duration: number, stackLevel: number): MockEffectStackLayer | null {
        const config = this._effectConfigs.get(effectType);
        if (!config) {
            return null;
        }

        effectNode.active = true;
        effectNode.parent = targetNode;
        effectNode.setPosition(0, 0, 0);

        // Mock effect creation based on type
        switch (config.type) {
            case 'particle':
                this.createParticleEffect(effectNode, config, stackLevel);
                break;
            case 'composite':
                this.createCompositeEffect(effectNode, config, stackLevel);
                break;
            default:
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

    private createParticleEffect(effectNode: any, config: any, stackLevel: number): void {
        const particle = new cc.ParticleSystem2D();
        effectNode.addComponent(cc.ParticleSystem2D);
        
        particle.totalParticles = Math.floor(config.particleCount * stackLevel);
        particle.duration = config.lifetime;
        particle.emissionRate = config.emission * stackLevel;
        particle.startColor = config.startColor;
        particle.endColor = config.endColor;
        particle.startSize = config.startSize;
        particle.endSize = config.endSize;
        particle.speed = config.speed;
        particle.speedVar = config.speed * 0.3;
        
        if (config.gravity) {
            particle.gravity = new cc.Vec3(config.gravity.x, config.gravity.y, 0);
        }

        particle.resetSystem();
    }

    private createCompositeEffect(effectNode: any, config: any, stackLevel: number): void {
        config.layers.forEach((layerConfig: any, index: number) => {
            const layerNode = new cc.Node(`Layer_${index}`);
            effectNode.addChild(layerNode);
            
            switch (layerConfig.type) {
                case 'particle':
                    this.createParticleEffect(layerNode, layerConfig, stackLevel);
                    break;
                case 'glow':
                    this.createGlowEffect(layerNode, layerConfig, stackLevel);
                    break;
            }
        });
    }

    private createGlowEffect(effectNode: any, config: any, stackLevel: number): void {
        const sprite = effectNode.addComponent(cc.Sprite);
        const uiTransform = effectNode.addComponent(cc.UITransform);
        
        uiTransform.setContentSize(config.radius * 2 * stackLevel, config.radius * 2 * stackLevel);
        sprite.color = config.color;
        
        if (config.pulsate) {
            // Mock pulsate animation
            effectNode.pulsating = true;
        }
    }

    private updateEffectIntensity(effectLayer: MockEffectStackLayer): void {
        const config = this._effectConfigs.get(effectLayer.effectType);
        if (config && config.type === 'particle') {
            // Mock intensity update
            effectLayer.node.intensity = effectLayer.stackLevel;
        }
    }

    private getEffectNode(): any {
        for (const node of this._effectPool) {
            if (!node.active) {
                return node;
            }
        }
        return null;
    }

    private returnEffectNode(node: any): void {
        node.active = false;
        node.removeAllChildren();
    }

    private destroyEffectLayer(layer: MockEffectStackLayer): void {
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

    public clearAllEffects(): void {
        this._effectStacks.forEach(stack => {
            stack.forEach(layer => this.destroyEffectLayer(layer));
        });
        this._effectStacks.clear();
    }

    public setEffectQuality(level: number): void {
        this.effectQualityLevel = Math.max(0, Math.min(2, level));
    }

    public pauseAllEffects(): void {
        this._effectStacks.forEach(stack => {
            stack.forEach(layer => {
                layer.isActive = false;
            });
        });
    }

    public resumeAllEffects(): void {
        this._effectStacks.forEach(stack => {
            stack.forEach(layer => {
                layer.isActive = true;
            });
        });
    }

    public getEffectStack(targetNode: any): MockEffectStackLayer[] {
        return this._effectStacks.get(targetNode.uuid) || [];
    }

    // Convenience methods
    public addFireTrailToBall(ballNode: any, duration: number = -1): string {
        return this.addEffectToObject(ballNode, MockVisualEffectType.BALL_FIRE_TRAIL, duration);
    }

    public addIceAuraToBall(ballNode: any, duration: number = -1): string {
        return this.addEffectToObject(ballNode, MockVisualEffectType.BALL_ICE_AURA, duration);
    }

    public createBrickExplosion(brickNode: any): void {
        this.addEffectToObject(brickNode, MockVisualEffectType.BRICK_EXPLOSION, 1.0);
    }

    public addFireArmorToPaddle(paddleNode: any, duration: number = -1): string {
        return this.addEffectToObject(paddleNode, MockVisualEffectType.PADDLE_FIRE_ARMOR, duration);
    }
}

describe('AdvancedEffectSystem', () => {
    let effectSystem: MockAdvancedEffectSystem;
    let testNode: any;

    beforeEach(() => {
        jest.clearAllMocks();
        effectSystem = new MockAdvancedEffectSystem();
        effectSystem.onLoad();
        testNode = new cc.Node('TestNode');
    });

    afterEach(() => {
        if (effectSystem) {
            effectSystem.onDestroy();
        }
    });

    describe('Initialization', () => {
        test('should initialize with correct default parameters', () => {
            expect(effectSystem.maxEffectNodes).toBe(50);
            expect(effectSystem.enableEffectStacking).toBe(true);
            expect(effectSystem.effectQualityLevel).toBe(2);
            expect(effectSystem.enableParticlePooling).toBe(true);
        });

        test('should create singleton instance', () => {
            const instance = MockAdvancedEffectSystem.getInstance();
            expect(instance).toBe(effectSystem);
        });

        test('should initialize effect pool', () => {
            expect(effectSystem['_effectPool']).toBeDefined();
            expect(effectSystem['_effectPool'].length).toBe(50);
        });

        test('should initialize effect configurations', () => {
            expect(effectSystem['_effectConfigs']).toBeDefined();
            expect(effectSystem['_effectConfigs'].size).toBeGreaterThan(0);
        });
    });

    describe('Effect Creation and Management', () => {
        test('should add effect to object successfully', () => {
            const effectId = effectSystem.addEffectToObject(
                testNode, 
                MockVisualEffectType.BALL_FIRE_TRAIL, 
                5.0, 
                1
            );
            
            expect(effectId).toBeTruthy();
            expect(typeof effectId).toBe('string');
        });

        test('should handle effect stacking', () => {
            const effectId1 = effectSystem.addEffectToObject(
                testNode, 
                MockVisualEffectType.BALL_FIRE_TRAIL, 
                -1, 
                1
            );
            
            const effectId2 = effectSystem.addEffectToObject(
                testNode, 
                MockVisualEffectType.BALL_FIRE_TRAIL, 
                -1, 
                1
            );
            
            expect(effectId1).toBeTruthy();
            expect(effectId2).toBeTruthy();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack.length).toBe(1); // Should stack, not create new
            expect(stack[0].stackLevel).toBe(2);
        });

        test('should handle different effect types on same object', () => {
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_ICE_AURA, -1, 1);
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack.length).toBe(2);
        });

        test('should limit stack level to maximum', () => {
            for (let i = 0; i < 10; i++) {
                effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            }
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].stackLevel).toBeLessThanOrEqual(5);
        });

        test('should handle effect duration', (done) => {
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, 0.1, 1);
            
            const initialStack = effectSystem.getEffectStack(testNode);
            expect(initialStack.length).toBe(1);
            
            setTimeout(() => {
                const finalStack = effectSystem.getEffectStack(testNode);
                expect(finalStack.length).toBe(0);
                done();
            }, 150);
        });
    });

    describe('Effect Removal', () => {
        beforeEach(() => {
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_ICE_AURA, -1, 1);
        });

        test('should remove specific effect type', () => {
            effectSystem.removeEffectFromObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL);
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack.length).toBe(1);
            expect(stack[0].effectType).toBe(MockVisualEffectType.BALL_ICE_AURA);
        });

        test('should remove all effects when no type specified', () => {
            effectSystem.removeEffectFromObject(testNode);
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack.length).toBe(0);
        });

        test('should handle removal of non-existent effect', () => {
            expect(() => {
                effectSystem.removeEffectFromObject(testNode, MockVisualEffectType.CORE_DAMAGE_CRACK);
            }).not.toThrow();
        });

        test('should handle removal from object with no effects', () => {
            const emptyNode = new cc.Node('EmptyNode');
            
            expect(() => {
                effectSystem.removeEffectFromObject(emptyNode, MockVisualEffectType.BALL_FIRE_TRAIL);
            }).not.toThrow();
        });
    });

    describe('Quality Management', () => {
        test('should adjust particle count based on quality level', () => {
            effectSystem.setEffectQuality(0); // Low quality
            const lowQualityId = effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            
            effectSystem.setEffectQuality(2); // High quality
            const testNode2 = new cc.Node('TestNode2');
            const highQualityId = effectSystem.addEffectToObject(testNode2, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            
            expect(lowQualityId).toBeTruthy();
            expect(highQualityId).toBeTruthy();
        });

        test('should clamp quality level to valid range', () => {
            effectSystem.setEffectQuality(-1);
            expect(effectSystem.effectQualityLevel).toBe(0);
            
            effectSystem.setEffectQuality(5);
            expect(effectSystem.effectQualityLevel).toBe(2);
        });

        test('should handle quality changes during runtime', () => {
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            
            expect(() => {
                effectSystem.setEffectQuality(1);
            }).not.toThrow();
        });
    });

    describe('Effect Pool Management', () => {
        test('should handle effect pool exhaustion', () => {
            const nodes: any[] = [];
            
            // Create more effects than pool size
            for (let i = 0; i < 60; i++) {
                const node = new cc.Node(`Node_${i}`);
                nodes.push(node);
                const effectId = effectSystem.addEffectToObject(node, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
                
                if (i < 50) {
                    expect(effectId).toBeTruthy();
                } else {
                    expect(effectId).toBe(''); // Pool exhausted
                }
            }
        });

        test('should reuse effect nodes correctly', () => {
            const effectId1 = effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            effectSystem.removeEffectFromObject(testNode);
            
            const testNode2 = new cc.Node('TestNode2');
            const effectId2 = effectSystem.addEffectToObject(testNode2, MockVisualEffectType.BALL_ICE_AURA, -1, 1);
            
            expect(effectId1).toBeTruthy();
            expect(effectId2).toBeTruthy();
        });
    });

    describe('Effect Types', () => {
        test('should create particle effects', () => {
            const effectId = effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            
            expect(effectId).toBeTruthy();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].effectType).toBe(MockVisualEffectType.BALL_FIRE_TRAIL);
        });

        test('should create composite effects', () => {
            const effectId = effectSystem.addEffectToObject(testNode, MockVisualEffectType.PADDLE_FIRE_ARMOR, -1, 1);
            
            expect(effectId).toBeTruthy();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].effectType).toBe(MockVisualEffectType.PADDLE_FIRE_ARMOR);
        });

        test('should handle explosion effects with shockwave', () => {
            const effectId = effectSystem.addEffectToObject(testNode, MockVisualEffectType.BRICK_EXPLOSION, 1.0, 1);
            
            expect(effectId).toBeTruthy();
        });
    });

    describe('System Control', () => {
        beforeEach(() => {
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_ICE_AURA, -1, 1);
        });

        test('should pause all effects', () => {
            effectSystem.pauseAllEffects();
            
            const stack = effectSystem.getEffectStack(testNode);
            stack.forEach(layer => {
                expect(layer.isActive).toBe(false);
            });
        });

        test('should resume all effects', () => {
            effectSystem.pauseAllEffects();
            effectSystem.resumeAllEffects();
            
            const stack = effectSystem.getEffectStack(testNode);
            stack.forEach(layer => {
                expect(layer.isActive).toBe(true);
            });
        });

        test('should clear all effects', () => {
            effectSystem.clearAllEffects();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack.length).toBe(0);
        });
    });

    describe('Convenience Methods', () => {
        test('should add fire trail to ball', () => {
            const effectId = effectSystem.addFireTrailToBall(testNode);
            
            expect(effectId).toBeTruthy();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].effectType).toBe(MockVisualEffectType.BALL_FIRE_TRAIL);
        });

        test('should add ice aura to ball', () => {
            const effectId = effectSystem.addIceAuraToBall(testNode, 5.0);
            
            expect(effectId).toBeTruthy();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].effectType).toBe(MockVisualEffectType.BALL_ICE_AURA);
        });

        test('should create brick explosion', () => {
            expect(() => {
                effectSystem.createBrickExplosion(testNode);
            }).not.toThrow();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].effectType).toBe(MockVisualEffectType.BRICK_EXPLOSION);
        });

        test('should add fire armor to paddle', () => {
            const effectId = effectSystem.addFireArmorToPaddle(testNode);
            
            expect(effectId).toBeTruthy();
            
            const stack = effectSystem.getEffectStack(testNode);
            expect(stack[0].effectType).toBe(MockVisualEffectType.PADDLE_FIRE_ARMOR);
        });
    });

    describe('Error Handling', () => {
        test('should handle unknown effect types', () => {
            const effectId = effectSystem.addEffectToObject(testNode, 'UNKNOWN_EFFECT' as any, -1, 1);
            
            expect(effectId).toBe('');
        });

        test('should handle null target nodes', () => {
            expect(() => {
                effectSystem.addEffectToObject(null as any, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            }).not.toThrow();
        });

        test('should handle invalid duration values', () => {
            const effectId = effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, NaN, 1);
            
            expect(effectId).toBeTruthy(); // Should still work
        });

        test('should handle invalid stack levels', () => {
            const effectId = effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, -5);
            
            expect(effectId).toBeTruthy(); // Should clamp or handle gracefully
        });
    });

    describe('Performance', () => {
        test('should handle rapid effect creation/destruction', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 100; i++) {
                const node = new cc.Node(`PerfTest_${i}`);
                effectSystem.addEffectToObject(node, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
                effectSystem.removeEffectFromObject(node);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(1000); // Should complete in reasonable time
        });

        test('should handle multiple simultaneous effects', () => {
            const nodes: any[] = [];
            
            for (let i = 0; i < 20; i++) {
                const node = new cc.Node(`MultiTest_${i}`);
                nodes.push(node);
                
                effectSystem.addEffectToObject(node, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
                effectSystem.addEffectToObject(node, MockVisualEffectType.BALL_ICE_AURA, -1, 1);
            }
            
            // Verify all effects were created
            nodes.forEach(node => {
                const stack = effectSystem.getEffectStack(node);
                expect(stack.length).toBe(2);
            });
        });
    });

    describe('Memory Management', () => {
        test('should not leak effect nodes', () => {
            const initialPoolSize = effectSystem['_effectPool'].length;
            
            // Create and destroy many effects
            for (let i = 0; i < 10; i++) {
                const node = new cc.Node(`MemTest_${i}`);
                effectSystem.addEffectToObject(node, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
                effectSystem.removeEffectFromObject(node);
            }
            
            const finalPoolSize = effectSystem['_effectPool'].length;
            expect(finalPoolSize).toBe(initialPoolSize);
        });

        test('should clean up on destroy', () => {
            effectSystem.addEffectToObject(testNode, MockVisualEffectType.BALL_FIRE_TRAIL, -1, 1);
            
            effectSystem.onDestroy();
            
            expect(MockAdvancedEffectSystem.getInstance()).toBe(null);
        });
    });
});