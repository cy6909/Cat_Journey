import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Node, ParticleSystem2D, tween, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SnowMountainBackground')
export class SnowMountainBackground extends Component {
    @property
    public snowflakeCount: number = 30;
    
    @property
    public auroraCount: number = 3;
    
    @property
    public icicleCount: number = 8;
    
    @property
    public enableCatCharacter: boolean = true;
    
    // 雪山主题色彩配置
    @property
    public mountainStartColor: Color = new Color(30, 58, 138, 255); // #1E3A8A 深蓝
    
    @property
    public mountainEndColor: Color = new Color(248, 250, 252, 255); // #F8FAFC 雪白

    protected onLoad(): void {
        this.createSnowMountainBackground();
    }

    private createSnowMountainBackground(): void {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            console.error('UITransform component not found');
            return;
        }

        this.setupNodeSize(transform);

        // 创建雪山主题分层背景
        this.createMountainGradient(transform);
        this.createMountainSilhouette(transform);
        this.createSnowflakeParticles(transform);
        this.createAuroraEffect(transform);
        this.createIcicleDecorations(transform);
        
        if (this.enableCatCharacter) {
            this.createSnowCat(transform);
        }
    }

    private setupNodeSize(transform: UITransform): void {
        const designSize = view.getDesignResolutionSize();
        const targetWidth = Math.max(designSize.width, 960);
        const targetHeight = Math.max(designSize.height, 640);
        
        transform.setContentSize(targetWidth, targetHeight);
        transform.setAnchorPoint(0.5, 0.5);
    }

    private createMountainGradient(transform: UITransform): void {
        const gradientNode = new Node('MountainGradient');
        gradientNode.setParent(this.node);
        
        const layerTransform = gradientNode.addComponent(UITransform);
        layerTransform.setContentSize(transform.width, transform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        const gradientTexture = this.createMountainGradientTexture(transform.width, transform.height);
        const sprite = gradientNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = gradientTexture;
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = Color.WHITE;
    }

    private createMountainGradientTexture(width: number, height: number): Texture2D {
        const texture = new Texture2D();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        for (let y = 0; y < h; y++) {
            const ratio = y / h;
            // 雪山渐变：上方深蓝（夜空），下方雪白（雪地）
            const r = Math.floor(this.mountainStartColor.r + (this.mountainEndColor.r - this.mountainStartColor.r) * ratio);
            const g = Math.floor(this.mountainStartColor.g + (this.mountainEndColor.g - this.mountainStartColor.g) * ratio);
            const b = Math.floor(this.mountainStartColor.b + (this.mountainEndColor.b - this.mountainStartColor.b) * ratio);
            
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;
                data[index] = r;     // R
                data[index + 1] = g; // G
                data[index + 2] = b; // B
                data[index + 3] = 255; // A
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private createMountainSilhouette(transform: UITransform): void {
        const silhouetteNode = new Node('MountainSilhouette');
        silhouetteNode.setParent(this.node);
        
        const layerTransform = silhouetteNode.addComponent(UITransform);
        layerTransform.setContentSize(transform.width, transform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        const silhouetteTexture = this.createMountainSilhouetteTexture(transform.width, transform.height);
        const sprite = silhouetteNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = silhouetteTexture;
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = new Color(255, 255, 255, 150); // 半透明白色
    }

    private createMountainSilhouetteTexture(width: number, height: number): Texture2D {
        const texture = new Texture2D();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        // 初始化为透明
        for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 透明
        }

        // 绘制山峰剪影 - 底部1/2区域
        const mountainZoneStart = Math.floor(h * 0.5);
        for (let y = mountainZoneStart; y < h; y++) {
            for (let x = 0; x < w; x++) {
                // 使用多层噪声创建山峰轮廓
                const mountainNoise = this.mountainNoise(x * 0.01, y * 0.015);
                const heightFactor = (h - y) / (h - mountainZoneStart);
                
                if (mountainNoise > (0.2 - heightFactor * 0.5)) {
                    const index = (y * w + x) * 4;
                    const intensity = 200 + Math.random() * 55; // 亮白色
                    
                    data[index] = intensity;       // R
                    data[index + 1] = intensity;   // G
                    data[index + 2] = intensity;   // B
                    data[index + 3] = 200;         // A
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private createSnowflakeParticles(transform: UITransform): void {
        const particleNode = new Node('SnowflakeParticles');
        particleNode.setParent(this.node);
        
        const layerTransform = particleNode.addComponent(UITransform);
        layerTransform.setContentSize(transform.width, transform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        const particleSystem = particleNode.addComponent(ParticleSystem2D);
        
        // 配置雪花飘落效果
        particleSystem.duration = -1; // 持续发射
        particleSystem.emissionRate = 5;
        particleSystem.life = 12;
        particleSystem.startSize = 4;
        particleSystem.endSize = 2;
        particleSystem.startColor = new Color(255, 255, 255, 255); // 纯白
        particleSystem.endColor = new Color(200, 220, 255, 180);   // 蓝白色
        
        // 重力和运动
        particleSystem.gravity = new Vec2(0, -20);
        particleSystem.speed = 15;
        particleSystem.speedVar = 8;
        particleSystem.angle = 0;
        particleSystem.angleVar = 15;
        
        // 旋转效果
        particleSystem.startSpin = 0;
        particleSystem.endSpin = 360;
        particleSystem.startSpinVar = 180;
        
        // 创建雪花纹理
        const snowflakeTexture = this.createSnowflakeTexture();
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = snowflakeTexture;
        particleSystem.spriteFrame = spriteFrame;
    }

    private createSnowflakeTexture(): Texture2D {
        const texture = new Texture2D();
        const size = 6;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        // 绘制六角雪花形状
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const centerX = size / 2;
                const centerY = size / 2;
                const dx = x - centerX;
                const dy = y - centerY;
                
                // 创建十字形和对角线的雪花图案
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
        return texture;
    }

    private createAuroraEffect(transform: UITransform): void {
        for (let i = 0; i < this.auroraCount; i++) {
            this.createSingleAurora(transform, i);
        }
    }

    private createSingleAurora(transform: UITransform, index: number): void {
        const auroraNode = new Node(`Aurora_${index}`);
        auroraNode.setParent(this.node);
        
        // 极光位置在屏幕上方
        const x = (Math.random() - 0.5) * transform.width * 0.8;
        const y = transform.height * 0.2 + Math.random() * 100;
        auroraNode.setPosition(x, y, 0);
        
        const auroraTransform = auroraNode.addComponent(UITransform);
        auroraTransform.setContentSize(200, 80);
        auroraTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = auroraNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.createAuroraTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        
        // 极光颜色（绿色、紫色变化）
        const colors = [
            new Color(50, 255, 50, 100),   // 绿色
            new Color(150, 50, 255, 100),  // 紫色
            new Color(50, 150, 255, 100)   // 蓝色
        ];
        sprite.color = colors[index % colors.length];
        
        // 添加波动动画
        this.startAuroraAnimation(auroraNode);
    }

    private createAuroraTexture(): Texture2D {
        const texture = new Texture2D();
        const w = 40;
        const h = 16;
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        // 创建波浪形极光纹理
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;
                
                // 使用正弦波创建极光形状
                const waveHeight = Math.sin(x * 0.3) * 3 + h / 2;
                const distance = Math.abs(y - waveHeight);
                
                if (distance < 4) {
                    const alpha = Math.max(0, 255 * (1 - distance / 4));
                    data[index] = 255;       // R
                    data[index + 1] = 255;   // G
                    data[index + 2] = 255;   // B
                    data[index + 3] = alpha; // A
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private startAuroraAnimation(auroraNode: Node): void {
        const originalPos = auroraNode.position.clone();
        
        // 缓慢飘动
        tween(auroraNode)
            .repeatForever(
                tween()
                    .to(8 + Math.random() * 4, { 
                        position: new Vec3(
                            originalPos.x + (Math.random() - 0.5) * 50,
                            originalPos.y + (Math.random() - 0.5) * 30,
                            0
                        )
                    })
                    .to(8 + Math.random() * 4, { position: originalPos })
            )
            .start();
        
        // 透明度变化
        const sprite = auroraNode.getComponent(Sprite);
        if (sprite) {
            const originalColor = sprite.color.clone();
            tween(sprite)
                .repeatForever(
                    tween()
                        .to(3 + Math.random() * 2, { 
                            color: new Color(originalColor.r, originalColor.g, originalColor.b, 50) 
                        })
                        .to(3 + Math.random() * 2, { color: originalColor })
                )
                .start();
        }
    }

    private createIcicleDecorations(transform: UITransform): void {
        // 创建冰柱装饰效果 - 简化实现
        console.log('雪山冰柱装饰 - 基础实现');
        
        for (let i = 0; i < this.icicleCount; i++) {
            this.createSingleIcicle(transform, i);
        }
    }

    private createSingleIcicle(transform: UITransform, index: number): void {
        const icicleNode = new Node(`Icicle_${index}`);
        icicleNode.setParent(this.node);
        
        // 冰柱位置在屏幕边缘
        const x = (index % 2 === 0) ? 
            -transform.width * 0.4 + Math.random() * 50 : 
            transform.width * 0.4 - Math.random() * 50;
        const y = (Math.random() - 0.5) * transform.height * 0.6;
        icicleNode.setPosition(x, y, 0);
        
        const icicleTransform = icicleNode.addComponent(UITransform);
        icicleTransform.setContentSize(8, 30);
        icicleTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = icicleNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.createIcicleTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = new Color(200, 230, 255, 200); // 冰蓝色
    }

    private createIcicleTexture(): Texture2D {
        const texture = new Texture2D();
        const w = 4;
        const h = 15;
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        // 创建锥形冰柱
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const centerX = w / 2;
                const width = (h - y) / h * (w / 2);
                
                if (Math.abs(x - centerX) < width) {
                    const index = (y * w + x) * 4;
                    data[index] = 200;     // R
                    data[index + 1] = 230; // G
                    data[index + 2] = 255; // B
                    data[index + 3] = 255; // A
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private createSnowCat(transform: UITransform): void {
        const catNode = new Node('SnowCat');
        catNode.setParent(this.node);
        
        // 位置：左下角，不干扰游戏区域
        catNode.setPosition(-350, -200, 0);
        catNode.setScale(0.8, 0.8, 1);
        
        const catTransform = catNode.addComponent(UITransform);
        catTransform.setContentSize(64, 64);
        catTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = catNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.createSnowCatTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = Color.WHITE;
        
        // 添加待机动画
        this.startSnowCatAnimation(catNode);
    }

    private createSnowCatTexture(): Texture2D {
        const texture = new Texture2D();
        const size = 32;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        // 简化的雪地猫咪像素艺术（白猫+蓝色装饰）
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = (y * size + x) * 4;
                
                // 基础形状：白猫轮廓
                if (this.isInCatShape(x, y, size)) {
                    data[index] = 240;     // R - 近白色
                    data[index + 1] = 248; // G
                    data[index + 2] = 255; // B
                    data[index + 3] = 255; // A
                } else {
                    data[index + 3] = 0; // 透明
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private isInCatShape(x: number, y: number, size: number): boolean {
        const centerX = size / 2;
        const centerY = size / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        
        // 简单的椭圆形作为猫咪身体
        const bodyRadius = size * 0.3;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < bodyRadius;
    }

    private startSnowCatAnimation(catNode: Node): void {
        // 轻微的上下浮动（在雪地里）
        tween(catNode)
            .repeatForever(
                tween()
                    .to(3, { position: new Vec3(-350, -190, 0) })
                    .to(3, { position: new Vec3(-350, -210, 0) })
            )
            .start();
        
        // 偶尔的抖动（抖掉雪花）
        this.schedule(() => {
            tween(catNode)
                .to(0.1, { scale: new Vec3(0.85, 0.85, 1) })
                .to(0.1, { scale: new Vec3(0.8, 0.8, 1) })
                .to(0.1, { scale: new Vec3(0.85, 0.85, 1) })
                .to(0.1, { scale: new Vec3(0.8, 0.8, 1) })
                .start();
        }, 12 + Math.random() * 8); // 12-20秒随机
    }

    private mountainNoise(x: number, y: number): number {
        // 雪山专用噪声函数 - 创造尖锐的山峰形状
        let n = Math.sin(x * 5.123 + y * 2.456) * 0.6;
        n += Math.sin(x * 2.789 + y * 4.123) * 0.3;
        n += Math.sin(x * 1.234 + y * 1.789) * 0.1;
        return (n + 1) / 2; // 归一化到0-1
    }
}