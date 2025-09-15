import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Widget, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QuickBackgroundFix')
export class QuickBackgroundFix extends Component {
    @property
    public backgroundColor: Color = new Color(30, 60, 120, 255); // 明亮的蓝色

    protected onLoad(): void {
        console.log('QuickBackgroundFix: Starting quick fix');
        this.setupFullScreenBackground();
    }

    private setupFullScreenBackground(): void {
        // 1. 确保有UITransform组件
        let transform = this.node.getComponent(UITransform);
        if (!transform) {
            transform = this.node.addComponent(UITransform);
        }

        // 2. 获取并设置全屏尺寸
        const designSize = view.getDesignResolutionSize();
        const screenSize = view.getVisibleSize();
        
        // 使用最大尺寸确保覆盖全屏
        const width = Math.max(designSize.width, screenSize.width, 960);
        const height = Math.max(designSize.height, screenSize.height, 640);
        
        console.log(`QuickBackgroundFix: Setting size to ${width}x${height}`);
        
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0.5, 0.5);

        // 3. 添加Widget自动适配
        let widget = this.node.getComponent(Widget);
        if (!widget) {
            widget = this.node.addComponent(Widget);
        }
        
        // Widget配置 - 填满整个屏幕
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
        widget.updateAlignment();

        // 4. 创建简单的纯色背景
        this.createSolidBackground();
        
        console.log(`QuickBackgroundFix: Background created with final size ${transform.width}x${transform.height}`);
    }

    private createSolidBackground(): void {
        const transform = this.node.getComponent(UITransform);
        const texture = this.createSolidTexture(transform.width, transform.height, this.backgroundColor);
        
        // 移除现有的Sprite组件
        const existingSprites = this.node.getComponents(Sprite);
        existingSprites.forEach(sprite => sprite.destroy());
        
        // 添加新的Sprite
        const sprite = this.node.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        sprite.spriteFrame = spriteFrame;
        sprite.color = Color.WHITE;
        
        console.log('QuickBackgroundFix: Solid background texture applied');
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
            data[i] = color.r;         // R
            data[i + 1] = color.g;     // G
            data[i + 2] = color.b;     // B
            data[i + 3] = color.a;     // A
        }

        texture.uploadData(data);
        console.log(`QuickBackgroundFix: Created texture ${w}x${h} with color (${color.r},${color.g},${color.b},${color.a})`);
        return texture;
    }
}