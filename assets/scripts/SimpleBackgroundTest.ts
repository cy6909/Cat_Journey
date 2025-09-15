import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Node, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SimpleBackgroundTest')
export class SimpleBackgroundTest extends Component {
    @property
    public testColor: Color = new Color(0, 100, 200, 255); // 蓝色测试

    protected onLoad(): void {
        console.log('SimpleBackgroundTest: Starting simple test');
        this.createSimpleBackground();
    }

    private createSimpleBackground(): void {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            console.error('SimpleBackgroundTest: UITransform not found');
            return;
        }

        console.log(`SimpleBackgroundTest: Node size is ${transform.width}x${transform.height}`);

        // 方法1: 使用Graphics组件绘制简单矩形
        this.testWithGraphics(transform);

        // 方法2: 创建简单纹理测试
        setTimeout(() => {
            this.testWithTexture(transform);
        }, 1000);
    }

    private testWithGraphics(transform: UITransform): void {
        console.log('SimpleBackgroundTest: Testing with Graphics');
        
        const graphics = this.node.addComponent(Graphics);
        graphics.fillColor = this.testColor;
        graphics.rect(-transform.width/2, -transform.height/2, transform.width, transform.height);
        graphics.fill();
        
        console.log('SimpleBackgroundTest: Graphics rect drawn');
    }

    private testWithTexture(transform: UITransform): void {
        console.log('SimpleBackgroundTest: Testing with Texture');
        
        // 移除Graphics组件
        const graphics = this.node.getComponent(Graphics);
        if (graphics) {
            graphics.destroy();
        }

        // 创建简单的纹理
        const texture = this.createSolidTexture(transform.width, transform.height, this.testColor);
        
        const sprite = this.node.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        sprite.spriteFrame = spriteFrame;
        
        console.log('SimpleBackgroundTest: Texture sprite created');
    }

    private createSolidTexture(width: number, height: number, color: Color): Texture2D {
        const texture = new Texture2D();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        
        // 填充纯色
        for (let i = 0; i < data.length; i += 4) {
            data[i] = color.r;     // R
            data[i + 1] = color.g; // G
            data[i + 2] = color.b; // B
            data[i + 3] = color.a; // A
        }

        texture.uploadData(data);
        return texture;
    }
}