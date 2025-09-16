import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Node, ParticleSystem2D, tween, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AbyssBackground')
export class AbyssBackground extends Component {
    @property
    public energySparkCount: number = 25;
    
    @property
    public dataStreamCount: number = 8;
    
    @property
    public mechanicalPipeCount: number = 6;
    
    @property
    public enableCatCharacter: boolean = true;
    
    // 深渊主题色彩配置
    @property
    public abyssStartColor: Color = new Color(76, 29, 149, 255); // #4C1D95 深紫
    
    @property
    public abyssEndColor: Color = new Color(127, 29, 29, 255); // #7F1D1D 暗红

    protected onLoad(): void {
        this.createAbyssBackground();
    }

    private createAbyssBackground(): void {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            console.error('UITransform component not found');
            return;
        }

        this.setupNodeSize(transform);

        // 创建深渊主题分层背景
        this.createAbyssGradient(transform);
        this.createMechanicalStructure(transform);
        this.createEnergySparkParticles(transform);
        this.createDataStreams(transform);
        this.createEnergyPipes(transform);
        
        if (this.enableCatCharacter) {
            this.createCyberCat(transform);
        }
    }

    private setupNodeSize(transform: UITransform): void {
        const designSize = view.getDesignResolutionSize();
        const targetWidth = Math.max(designSize.width, 960);
        const targetHeight = Math.max(designSize.height, 640);
        
        transform.setContentSize(targetWidth, targetHeight);
        transform.setAnchorPoint(0.5, 0.5);
    }

    private createAbyssGradient(transform: UITransform): void {
        const gradientNode = new Node('AbyssGradient');
        gradientNode.setParent(this.node);
        
        const layerTransform = gradientNode.addComponent(UITransform);
        layerTransform.setContentSize(transform.width, transform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        const gradientTexture = this.createAbyssGradientTexture(transform.width, transform.height);
        const sprite = gradientNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = gradientTexture;
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = Color.WHITE;
    }

    private createAbyssGradientTexture(width: number, height: number): Texture2D {
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
            // 深渊渐变：上方深紫（深空），下方暗红（地狱）
            const r = Math.floor(this.abyssStartColor.r + (this.abyssEndColor.r - this.abyssStartColor.r) * ratio);
            const g = Math.floor(this.abyssStartColor.g + (this.abyssEndColor.g - this.abyssStartColor.g) * ratio);
            const b = Math.floor(this.abyssStartColor.b + (this.abyssEndColor.b - this.abyssStartColor.b) * ratio);
            
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

    private createMechanicalStructure(transform: UITransform): void {
        const structureNode = new Node('MechanicalStructure');
        structureNode.setParent(this.node);
        
        const layerTransform = structureNode.addComponent(UITransform);
        layerTransform.setContentSize(transform.width, transform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        const structureTexture = this.createMechanicalTexture(transform.width, transform.height);
        const sprite = structureNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = structureTexture;
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = new Color(255, 255, 255, 100); // 半透明
    }

    private createMechanicalTexture(width: number, height: number): Texture2D {
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

        // 绘制机械结构 - 网格和管道
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;
                
                // 垂直网格线
                if (x % 60 === 0 || x % 60 === 1) {
                    data[index] = 100;     // R
                    data[index + 1] = 100; // G
                    data[index + 2] = 120; // B
                    data[index + 3] = 150; // A
                }
                
                // 水平网格线
                if (y % 80 === 0 || y % 80 === 1) {
                    data[index] = 100;     // R
                    data[index + 1] = 100; // G
                    data[index + 2] = 120; // B
                    data[index + 3] = 150; // A
                }
                
                // 添加一些机械纹理噪声
                const mechNoise = this.mechanicalNoise(x * 0.05, y * 0.05);
                if (mechNoise > 0.7) {
                    data[index] = 80;      // R
                    data[index + 1] = 80;  // G
                    data[index + 2] = 100; // B
                    data[index + 3] = 100; // A
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private createEnergySparkParticles(transform: UITransform): void {
        const particleNode = new Node('EnergySparkParticles');
        particleNode.setParent(this.node);
        
        const layerTransform = particleNode.addComponent(UITransform);
        layerTransform.setContentSize(transform.width, transform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        const particleSystem = particleNode.addComponent(ParticleSystem2D);
        
        // 配置能量火花效果
        particleSystem.duration = -1; // 持续发射
        particleSystem.emissionRate = 4;
        particleSystem.life = 6;
        particleSystem.startSize = 3;
        particleSystem.endSize = 1;
        particleSystem.startColor = new Color(255, 50, 100, 255); // 红色火花
        particleSystem.endColor = new Color(150, 50, 255, 100);   // 紫色
        
        // 浮动运动
        particleSystem.gravity = new Vec2(0, 10);
        particleSystem.speed = 25;
        particleSystem.speedVar = 15;
        particleSystem.angle = 90;
        particleSystem.angleVar = 360;
        
        // 旋转效果
        particleSystem.startSpin = 0;
        particleSystem.endSpin = 720;
        particleSystem.startSpinVar = 360;
        
        // 创建火花纹理
        const sparkTexture = this.createSparkTexture();
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = sparkTexture;
        particleSystem.spriteFrame = spriteFrame;
    }

    private createSparkTexture(): Texture2D {
        const texture = new Texture2D();
        const size = 4;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        // 绘制菱形火花
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const centerX = size / 2;
                const centerY = size / 2;
                const dx = Math.abs(x - centerX);
                const dy = Math.abs(y - centerY);
                
                if (dx + dy <= size / 2) {
                    const index = (y * size + x) * 4;
                    data[index] = 255;     // R
                    data[index + 1] = 100; // G
                    data[index + 2] = 150; // B
                    data[index + 3] = 255; // A
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private createDataStreams(transform: UITransform): void {
        for (let i = 0; i < this.dataStreamCount; i++) {
            this.createSingleDataStream(transform, i);
        }
    }

    private createSingleDataStream(transform: UITransform, index: number): void {
        const streamNode = new Node(`DataStream_${index}`);
        streamNode.setParent(this.node);
        
        // 数据流位置 - 垂直移动
        const x = (Math.random() - 0.5) * transform.width * 0.9;
        const y = transform.height * 0.5;
        streamNode.setPosition(x, y, 0);
        
        const streamTransform = streamNode.addComponent(UITransform);
        streamTransform.setContentSize(2, 100);
        streamTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = streamNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.createDataStreamTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = new Color(0, 255, 100, 200); // 绿色数据流
        
        // 添加下降动画
        this.startDataStreamAnimation(streamNode, transform);
    }

    private createDataStreamTexture(): Texture2D {
        const texture = new Texture2D();
        const w = 2;
        const h = 20;
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        // 创建垂直线条
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;
                const alpha = Math.random() > 0.3 ? 255 : 0; // 随机间断
                
                data[index] = 0;       // R
                data[index + 1] = 255; // G
                data[index + 2] = 100; // B
                data[index + 3] = alpha; // A
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private startDataStreamAnimation(streamNode: Node, transform: UITransform): void {
        const startY = transform.height * 0.6;
        const endY = -transform.height * 0.6;
        
        // 重置位置并开始下降
        const resetAndFall = () => {
            streamNode.setPosition(
                (Math.random() - 0.5) * transform.width * 0.9,
                startY,
                0
            );
            
            tween(streamNode)
                .to(8 + Math.random() * 4, { position: new Vec3(streamNode.position.x, endY, 0) })
                .call(resetAndFall)
                .start();
        };
        
        resetAndFall();
    }

    private createEnergyPipes(transform: UITransform): void {
        for (let i = 0; i < this.mechanicalPipeCount; i++) {
            this.createSingleEnergyPipe(transform, i);
        }
    }

    private createSingleEnergyPipe(transform: UITransform, index: number): void {
        const pipeNode = new Node(`EnergyPipe_${index}`);
        pipeNode.setParent(this.node);
        
        // 能量管道位置 - 水平分布
        const x = -transform.width * 0.4 + (index / this.mechanicalPipeCount) * transform.width * 0.8;
        const y = (Math.random() - 0.5) * transform.height * 0.4;
        pipeNode.setPosition(x, y, 0);
        
        const pipeTransform = pipeNode.addComponent(UITransform);
        pipeTransform.setContentSize(100, 8);
        pipeTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = pipeNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.createEnergyPipeTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = new Color(255, 100, 50, 180); // 橙红色管道
        
        // 添加脉动动画
        this.startEnergyPipeAnimation(pipeNode);
    }

    private createEnergyPipeTexture(): Texture2D {
        const texture = new Texture2D();
        const w = 20;
        const h = 4;
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        // 创建管道纹理
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;
                
                // 管道边缘
                if (y === 0 || y === h - 1) {
                    data[index] = 150;     // R
                    data[index + 1] = 150; // G
                    data[index + 2] = 150; // B
                    data[index + 3] = 255; // A
                } else {
                    // 管道内部 - 能量流
                    const flow = Math.sin(x * 0.5) * 0.5 + 0.5;
                    data[index] = Math.floor(255 * flow);     // R
                    data[index + 1] = Math.floor(100 * flow); // G
                    data[index + 2] = Math.floor(50 * flow);  // B
                    data[index + 3] = 200; // A
                }
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private startEnergyPipeAnimation(pipeNode: Node): void {
        const sprite = pipeNode.getComponent(Sprite);
        if (sprite) {
            const originalColor = sprite.color.clone();
            const brightColor = new Color(255, 150, 100, 220);
            
            // 脉动效果
            tween(sprite)
                .repeatForever(
                    tween()
                        .to(1 + Math.random(), { color: brightColor })
                        .to(1 + Math.random(), { color: originalColor })
                )
                .start();
        }
    }

    private createCyberCat(transform: UITransform): void {
        const catNode = new Node('CyberCat');
        catNode.setParent(this.node);
        
        // 位置：左下角，不干扰游戏区域
        catNode.setPosition(-350, -200, 0);
        catNode.setScale(0.8, 0.8, 1);
        
        const catTransform = catNode.addComponent(UITransform);
        catTransform.setContentSize(64, 64);
        catTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = catNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.createCyberCatTexture();
        sprite.spriteFrame = spriteFrame;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = Color.WHITE;
        
        // 添加待机动画
        this.startCyberCatAnimation(catNode);
    }

    private createCyberCatTexture(): Texture2D {
        const texture = new Texture2D();
        const size = 32;
        
        texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(size * size * 4);
        
        // 简化的赛博猫咪像素艺术（黑猫+霓虹边框）
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = (y * size + x) * 4;
                
                // 基础形状：黑猫轮廓
                if (this.isInCatShape(x, y, size)) {
                    data[index] = 40;      // R - 暗色
                    data[index + 1] = 40;  // G
                    data[index + 2] = 60;  // B
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

    private startCyberCatAnimation(catNode: Node): void {
        // 轻微的上下浮动（机械悬浮效果）
        tween(catNode)
            .repeatForever(
                tween()
                    .to(1.5, { position: new Vec3(-350, -190, 0) })
                    .to(1.5, { position: new Vec3(-350, -210, 0) })
            )
            .start();
        
        // 霓虹发光效果
        const sprite = catNode.getComponent(Sprite);
        if (sprite) {
            tween(sprite)
                .repeatForever(
                    tween()
                        .to(2, { color: new Color(100, 255, 255, 255) }) // 青色发光
                        .to(2, { color: new Color(255, 100, 255, 255) }) // 紫色发光
                        .to(2, { color: Color.WHITE })
                )
                .start();
        }
    }

    private mechanicalNoise(x: number, y: number): number {
        // 机械专用噪声函数 - 创造电路板纹理
        let n = Math.sin(x * 8.123 + y * 6.789) * 0.4;
        n += Math.sin(x * 4.456 + y * 3.123) * 0.3;
        n += Math.sin(x * 2.789 + y * 1.456) * 0.3;
        return (n + 1) / 2; // 归一化到0-1
    }
}