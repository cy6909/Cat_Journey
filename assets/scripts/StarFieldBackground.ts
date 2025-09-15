import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StarFieldBackground')
export class StarFieldBackground extends Component {
    @property
    public starCount: number = 150;
    
    @property
    public layerCount: number = 3; // 多层星空效果
    
    @property
    public bgStartColor: Color = new Color(0, 8, 20, 255); // #000814
    
    @property
    public bgEndColor: Color = new Color(0, 24, 69, 255); // #001845

    protected onLoad(): void {
        this.createEnhancedBackground();
    }

    private createEnhancedBackground(): void {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            console.error('UITransform component not found');
            return;
        }

        // 创建多层背景
        this.createGradientLayer(transform);
        this.createMultiLayerStars(transform);
        this.createNebulaEffect(transform);
    }

    private createGradientLayer(transform: UITransform): void {
        const gradientTexture = this.createGradientTexture(transform.width, transform.height);
        
        const gradientSprite = this.node.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = gradientTexture;
        gradientSprite.spriteFrame = spriteFrame;
    }

    private createGradientTexture(width: number, height: number): Texture2D {
        const texture = new Texture2D();
        texture.reset({
            width: Math.floor(width),
            height: Math.floor(height),
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(width * height * 4);
        
        for (let y = 0; y < height; y++) {
            const ratio = y / height;
            const r = Math.floor(this.bgStartColor.r + (this.bgEndColor.r - this.bgStartColor.r) * ratio);
            const g = Math.floor(this.bgStartColor.g + (this.bgEndColor.g - this.bgStartColor.g) * ratio);
            const b = Math.floor(this.bgStartColor.b + (this.bgEndColor.b - this.bgStartColor.b) * ratio);
            
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                data[index] = r;     // R
                data[index + 1] = g; // G
                data[index + 2] = b; // B
                data[index + 3] = 255; // A
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private createMultiLayerStars(transform: UITransform): void {
        for (let layer = 0; layer < this.layerCount; layer++) {
            this.createStarLayer(transform, layer);
        }
    }

    private createStarLayer(transform: UITransform, layerIndex: number): void {
        const starTexture = this.createStarTexture(transform.width, transform.height, layerIndex);
        
        const starSprite = this.node.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = starTexture;
        starSprite.spriteFrame = spriteFrame;
        
        // 设置透明度和层次
        const alpha = 255 - (layerIndex * 50);
        starSprite.color = new Color(255, 255, 255, alpha);
    }

    private createStarTexture(width: number, height: number, layerIndex: number): Texture2D {
        const texture = new Texture2D();
        texture.reset({
            width: Math.floor(width),
            height: Math.floor(height),
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(width * height * 4);
        const starsInLayer = Math.floor(this.starCount / this.layerCount);
        const starSize = 2 + layerIndex; // 不同层星星大小不同

        // 初始化为透明
        for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 透明
        }

        // 绘制星星
        for (let i = 0; i < starsInLayer; i++) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            const brightness = 150 + Math.random() * 105; // 150-255
            
            this.drawStar(data, width, height, x, y, starSize, brightness);
        }

        texture.uploadData(data);
        return texture;
    }

    private drawStar(data: Uint8Array, width: number, height: number, centerX: number, centerY: number, size: number, brightness: number): void {
        for (let dy = -size; dy <= size; dy++) {
            for (let dx = -size; dx <= size; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;
                
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= size) {
                        const alpha = Math.max(0, brightness * (1 - distance / size));
                        const index = (y * width + x) * 4;
                        
                        data[index] = brightness;     // R
                        data[index + 1] = brightness; // G
                        data[index + 2] = brightness; // B
                        data[index + 3] = alpha;      // A
                    }
                }
            }
        }
    }

    private createNebulaEffect(transform: UITransform): void {
        const nebulaTexture = this.createNebulaTexture(transform.width, transform.height);
        
        const nebulaSprite = this.node.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = nebulaTexture;
        nebulaSprite.spriteFrame = spriteFrame;
        nebulaSprite.color = new Color(255, 255, 255, 80); // 半透明
    }

    private createNebulaTexture(width: number, height: number): Texture2D {
        const texture = new Texture2D();
        texture.reset({
            width: Math.floor(width),
            height: Math.floor(height),
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(width * height * 4);
        
        // 使用柏林噪声模拟的简化版本
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                // 简单的噪声函数
                const noise = this.simpleNoise(x * 0.01, y * 0.01);
                const intensity = Math.max(0, noise * 100);
                
                data[index] = Math.floor(intensity * 0.8);     // R - 偏红
                data[index + 1] = Math.floor(intensity * 0.4); // G
                data[index + 2] = Math.floor(intensity * 1.2); // B - 偏蓝
                data[index + 3] = Math.floor(intensity * 0.6); // A
            }
        }

        texture.uploadData(data);
        return texture;
    }

    private simpleNoise(x: number, y: number): number {
        // 简单的伪随机噪声函数
        let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        n = n - Math.floor(n);
        return n;
    }
}