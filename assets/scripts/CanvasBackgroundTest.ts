import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CanvasBackgroundTest')
export class CanvasBackgroundTest extends Component {
    @property
    public useGraphics: boolean = true; // 优先使用Graphics

    protected onLoad(): void {
        console.log('=== CanvasBackgroundTest: Canvas相机背景测试 ===');
        this.setupBackground();
    }

    private setupBackground(): void {
        // 1. 设置节点尺寸
        let transform = this.node.getComponent(UITransform);
        if (!transform) {
            transform = this.node.addComponent(UITransform);
        }
        
        transform.setContentSize(960, 640);
        transform.setAnchorPoint(0.5, 0.5);
        console.log(`设置节点尺寸: ${transform.width}x${transform.height}`);
        
        // 2. 清除现有组件
        const existingGraphics = this.node.getComponent(Graphics);
        const existingSprites = this.node.getComponents(Sprite);
        
        if (existingGraphics) existingGraphics.destroy();
        existingSprites.forEach(sprite => sprite.destroy());

        if (this.useGraphics) {
            this.createGraphicsBackground();
        } else {
            this.createSpriteBackground();
        }
    }

    private createGraphicsBackground(): void {
        console.log('使用Graphics创建背景');
        
        const graphics = this.node.addComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 创建洋红色矩形
        graphics.fillColor = new Color(255, 0, 255, 255);
        graphics.rect(
            -transform.width / 2,
            -transform.height / 2,
            transform.width,
            transform.height
        );
        graphics.fill();
        
        console.log(`Graphics矩形创建完成: ${transform.width}x${transform.height}`);
    }

    private createSpriteBackground(): void {
        console.log('使用Sprite创建背景');
        
        const transform = this.node.getComponent(UITransform);
        
        // 创建1x1像素纹理
        const texture = new Texture2D();
        texture.reset({
            width: 1,
            height: 1,
            format: Texture2D.PixelFormat.RGBA8888
        });

        // 洋红色像素数据
        const data = new Uint8Array([255, 0, 255, 255]);
        texture.uploadData(data);

        // 创建SpriteFrame
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;

        // 添加Sprite组件
        const sprite = this.node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.color = Color.WHITE;
        
        console.log(`Sprite背景创建完成`);
    }
}