import { _decorator, Component, ParticleSystem2D, Texture2D, SpriteFrame, Color, Vec2, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnhancedParticleEffect')
export class EnhancedParticleEffect extends Component {
    @property({ type: String, tooltip: "粒子效果类型: star, magic, energy, leaf, snow" })
    public effectType: string = "star";

    @property({ tooltip: "粒子数量" })
    public particleCount: number = 50;

    @property({ tooltip: "启用动态颜色变化" })
    public enableColorAnimation: boolean = true;

    @property({ tooltip: "启用音频响应" })
    public enableAudioReactive: boolean = false;

    @property({ tooltip: "动画强度" })
    public animationIntensity: number = 1.0;

    private particleSystem: ParticleSystem2D | null = null;
    private originalEmissionRate: number = 0;
    private colorAnimationTween: any = null;

    protected onLoad(): void {
        this.particleSystem = this.node.getComponent(ParticleSystem2D);
        if (!this.particleSystem) {
            this.particleSystem = this.node.addComponent(ParticleSystem2D);
        }

        this.setupParticleEffect();
    }

    protected start(): void {
        if (this.enableColorAnimation) {
            this.startColorAnimation();
        }
    }

    private setupParticleEffect(): void {
        if (!this.particleSystem) return;

        this.originalEmissionRate = this.particleCount / 10;

        switch (this.effectType) {
            case "star":
                this.setupStarEffect();
                break;
            case "magic":
                this.setupMagicEffect();
                break;
            case "energy":
                this.setupEnergyEffect();
                break;
            case "leaf":
                this.setupLeafEffect();
                break;
            case "snow":
                this.setupSnowEffect();
                break;
            default:
                this.setupDefaultEffect();
        }
    }

    private setupStarEffect(): void {
        if (!this.particleSystem) return;

        this.particleSystem.duration = -1;
        this.particleSystem.emissionRate = this.originalEmissionRate;
        this.particleSystem.life = 4;
        this.particleSystem.startSize = 2;
        this.particleSystem.endSize = 0;
        this.particleSystem.startColor = new Color(255, 255, 255, 255);
        this.particleSystem.endColor = new Color(255, 255, 255, 0);
        this.particleSystem.gravity = new Vec2(0, 0);
        this.particleSystem.speed = 10;
        this.particleSystem.speedVar = 5;
        this.particleSystem.angle = 90;
        this.particleSystem.angleVar = 360;
        this.particleSystem.startSpin = 0;
        this.particleSystem.endSpin = 360;

        this.particleSystem.spriteFrame = this.createStarTexture();
    }

    private setupMagicEffect(): void {
        if (!this.particleSystem) return;

        this.particleSystem.duration = -1;
        this.particleSystem.emissionRate = this.originalEmissionRate * 0.8;
        this.particleSystem.life = 6;
        this.particleSystem.startSize = 4;
        this.particleSystem.endSize = 1;
        this.particleSystem.startColor = new Color(255, 100, 255, 255);
        this.particleSystem.endColor = new Color(100, 255, 255, 0);
        this.particleSystem.gravity = new Vec2(0, 15);
        this.particleSystem.speed = 25;
        this.particleSystem.speedVar = 10;
        this.particleSystem.angle = 90;
        this.particleSystem.angleVar = 45;
        this.particleSystem.startSpin = 0;
        this.particleSystem.endSpin = 720;

        this.particleSystem.spriteFrame = this.createMagicTexture();
    }

    private setupEnergyEffect(): void {
        if (!this.particleSystem) return;

        this.particleSystem.duration = -1;
        this.particleSystem.emissionRate = this.originalEmissionRate * 1.2;
        this.particleSystem.life = 3;
        this.particleSystem.startSize = 3;
        this.particleSystem.endSize = 0;
        this.particleSystem.startColor = new Color(255, 255, 0, 255);
        this.particleSystem.endColor = new Color(255, 100, 0, 0);
        this.particleSystem.gravity = new Vec2(0, -10);
        this.particleSystem.speed = 30;
        this.particleSystem.speedVar = 15;
        this.particleSystem.angle = 90;
        this.particleSystem.angleVar = 180;

        this.particleSystem.spriteFrame = this.createEnergyTexture();
    }

    private setupLeafEffect(): void {
        if (!this.particleSystem) return;

        this.particleSystem.duration = -1;
        this.particleSystem.emissionRate = this.originalEmissionRate * 0.6;
        this.particleSystem.life = 8;
        this.particleSystem.startSize = 5;
        this.particleSystem.endSize = 3;
        this.particleSystem.startColor = new Color(255, 200, 0, 255);
        this.particleSystem.endColor = new Color(200, 100, 0, 180);
        this.particleSystem.gravity = new Vec2(0, -20);
        this.particleSystem.speed = 15;
        this.particleSystem.speedVar = 8;
        this.particleSystem.angle = 0;
        this.particleSystem.angleVar = 30;
        this.particleSystem.startSpin = 0;
        this.particleSystem.endSpin = 180;

        this.particleSystem.spriteFrame = this.createLeafTexture();
    }

    private setupSnowEffect(): void {
        if (!this.particleSystem) return;

        this.particleSystem.duration = -1;
        this.particleSystem.emissionRate = this.originalEmissionRate * 0.5;
        this.particleSystem.life = 12;
        this.particleSystem.startSize = 4;
        this.particleSystem.endSize = 2;
        this.particleSystem.startColor = new Color(255, 255, 255, 255);
        this.particleSystem.endColor = new Color(200, 220, 255, 180);
        this.particleSystem.gravity = new Vec2(0, -20);
        this.particleSystem.speed = 15;
        this.particleSystem.speedVar = 8;
        this.particleSystem.angle = 0;
        this.particleSystem.angleVar = 15;
        this.particleSystem.startSpin = 0;
        this.particleSystem.endSpin = 360;

        this.particleSystem.spriteFrame = this.createSnowTexture();
    }

    private setupDefaultEffect(): void {
        if (!this.particleSystem) return;

        this.particleSystem.duration = -1;
        this.particleSystem.emissionRate = this.originalEmissionRate;
        this.particleSystem.life = 3;
        this.particleSystem.startSize = 3;
        this.particleSystem.endSize = 1;
        this.particleSystem.startColor = new Color(255, 255, 255, 255);
        this.particleSystem.endColor = new Color(255, 255, 255, 0);

        this.particleSystem.spriteFrame = this.createDefaultTexture();
    }

    private createStarTexture(): SpriteFrame {
        const texture = new Texture2D();
        const size = 4;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const centerX = size / 2;
                const centerY = size / 2;
                const dx = Math.abs(x - centerX);
                const dy = Math.abs(y - centerY);
                
                if ((dx < 0.8 && dy < 2) || (dy < 0.8 && dx < 2)) {
                    const index = (y * size + x) * 4;
                    data[index] = 255;     // R
                    data[index + 1] = 255; // G
                    data[index + 2] = 255; // B
                    data[index + 3] = 255; // A
                }
            }
        }

        texture.uploadData(data);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    private createMagicTexture(): SpriteFrame {
        const texture = new Texture2D();
        const size = 6;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const centerX = size / 2;
                const centerY = size / 2;
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                if (distance <= size / 2) {
                    const index = (y * size + x) * 4;
                    const intensity = 255 * (1 - distance / (size / 2));
                    data[index] = 255;           // R
                    data[index + 1] = intensity; // G
                    data[index + 2] = 255;       // B
                    data[index + 3] = intensity; // A
                }
            }
        }

        texture.uploadData(data);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    private createEnergyTexture(): SpriteFrame {
        const texture = new Texture2D();
        const size = 4;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const centerX = size / 2;
                const centerY = size / 2;
                const dx = Math.abs(x - centerX);
                const dy = Math.abs(y - centerY);
                
                if (dx + dy <= size / 2) {
                    const index = (y * size + x) * 4;
                    data[index] = 255;     // R
                    data[index + 1] = 255; // G
                    data[index + 2] = 0;   // B
                    data[index + 3] = 255; // A
                }
            }
        }

        texture.uploadData(data);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    private createLeafTexture(): SpriteFrame {
        const texture = new Texture2D();
        const size = 6;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = (y * size + x) * 4;
                
                // 椭圆形叶子
                const centerX = size / 2;
                const centerY = size / 2;
                const dx = (x - centerX) / (size / 2);
                const dy = (y - centerY) / (size / 3);
                
                if (dx * dx + dy * dy <= 1) {
                    data[index] = 200;     // R
                    data[index + 1] = 150; // G
                    data[index + 2] = 0;   // B
                    data[index + 3] = 255; // A
                }
            }
        }

        texture.uploadData(data);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    private createSnowTexture(): SpriteFrame {
        const texture = new Texture2D();
        const size = 6;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const centerX = size / 2;
                const centerY = size / 2;
                const dx = x - centerX;
                const dy = y - centerY;
                
                // 六角雪花
                if ((Math.abs(dx) < 0.8 && Math.abs(dy) < 2.5) || 
                    (Math.abs(dy) < 0.8 && Math.abs(dx) < 2.5) ||
                    (Math.abs(dx - dy) < 0.8) || 
                    (Math.abs(dx + dy) < 0.8)) {
                    const index = (y * size + x) * 4;
                    data[index] = 255;     // R
                    data[index + 1] = 255; // G
                    data[index + 2] = 255; // B
                    data[index + 3] = 255; // A
                }
            }
        }

        texture.uploadData(data);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    private createDefaultTexture(): SpriteFrame {
        const texture = new Texture2D();
        const size = 4;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255;     // R
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
            data[i + 3] = 255; // A
        }

        texture.uploadData(data);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    private startColorAnimation(): void {
        if (!this.particleSystem) return;

        const originalStartColor = this.particleSystem.startColor.clone();
        const originalEndColor = this.particleSystem.endColor.clone();

        this.colorAnimationTween = tween(this.particleSystem)
            .repeatForever(
                tween()
                    .to(3, {
                        startColor: new Color(
                            Math.min(255, originalStartColor.r + 50),
                            Math.min(255, originalStartColor.g + 30),
                            Math.min(255, originalStartColor.b + 70),
                            originalStartColor.a
                        )
                    })
                    .to(3, { startColor: originalStartColor })
            )
            .start();
    }

    /**
     * 设置粒子强度（用于音频响应）
     */
    public setIntensity(intensity: number): void {
        if (!this.particleSystem) return;

        const normalizedIntensity = Math.max(0, Math.min(2, intensity));
        this.particleSystem.emissionRate = this.originalEmissionRate * normalizedIntensity;
        
        if (this.enableAudioReactive) {
            const scale = 0.8 + (normalizedIntensity * 0.4);
            this.node.setScale(scale, scale, 1);
        }
    }

    /**
     * 触发爆发效果
     */
    public triggerBurst(burstCount: number = 20): void {
        if (!this.particleSystem) return;

        const originalRate = this.particleSystem.emissionRate;
        this.particleSystem.emissionRate = burstCount * 10;
        
        this.scheduleOnce(() => {
            this.particleSystem!.emissionRate = originalRate;
        }, 0.1);
    }

    /**
     * 设置效果类型
     */
    public setEffectType(type: string): void {
        this.effectType = type;
        this.setupParticleEffect();
    }

    protected onDestroy(): void {
        if (this.colorAnimationTween) {
            this.colorAnimationTween.stop();
        }
    }
}