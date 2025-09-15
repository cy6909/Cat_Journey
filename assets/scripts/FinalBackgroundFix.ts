import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FinalBackgroundFix')
export class FinalBackgroundFix extends Component {
    @property
    public backgroundColor: Color = new Color(255, 0, 255, 255); // 洋红色，非常显眼

    @property  
    public debugMode: boolean = true;

    protected onLoad(): void {
        if (this.debugMode) {
            console.log('=== FinalBackgroundFix: 开始最终修复 ===');
        }
        this.createRobustBackground();
    }

    private createRobustBackground(): void {
        // 1. 确保UITransform存在且正确
        let transform = this.node.getComponent(UITransform);
        if (!transform) {
            transform = this.node.addComponent(UITransform);
        }
        // 确保transform不为null
        if (!transform) {
            console.error('FinalBackgroundFix: 无法获取或创建UITransform组件');
            return;
        }

        // 2. 获取正确尺寸
        const designSize = view.getDesignResolutionSize();
        const targetWidth = Math.max(designSize.width, 960);
        const targetHeight = Math.max(designSize.height, 640);

        if (this.debugMode) {
            console.log(`FinalBackgroundFix: 设置目标尺寸 ${targetWidth}x${targetHeight}`);
        }

        // 3. 移除所有现有Sprite组件
        const existingSprites = this.node.getComponents(Sprite);
        existingSprites.forEach(sprite => sprite.destroy());

        // 4. 创建大纹理（避免尺寸问题）
        const texture = this.createLargeTexture(targetWidth, targetHeight);
        
        // 5. 创建SpriteFrame
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;

        // 6. 添加Sprite组件并配置
        const sprite = this.node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.color = Color.WHITE;
        
        // ★ 关键：设置为CUSTOM模式，防止自动调整尺寸
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.type = Sprite.Type.SIMPLE;

        // 7. 强制设置UITransform尺寸（在Sprite设置之后）
        transform.setContentSize(targetWidth, targetHeight);
        transform.setAnchorPoint(0.5, 0.5);

        // 8. 强制更新渲染
        sprite.markForUpdateRenderData();
        
        // 9. 设置正确的Layer（确保Canvas摄像机能看到）
        this.node.layer = 33554432; // UI_2D Layer

        if (this.debugMode) {
            console.log(`FinalBackgroundFix: 创建完成`);
            console.log(`- 纹理尺寸: ${texture.width}x${texture.height}`);
            console.log(`- UITransform: ${transform.width}x${transform.height}`);
            console.log(`- Sprite sizeMode: ${sprite.sizeMode}`);
            console.log(`- Node layer: ${this.node.layer}`);
        }

        // 10. 延迟验证尺寸
        this.scheduleOnce(() => {
            // 重新获取transform确保类型安全
            const finalTransform = this.node.getComponent(UITransform);
            if (finalTransform) {
                this.verifyFinalResult(finalTransform, sprite);
            }
        }, 0.1);
    }

    private createLargeTexture(width: number, height: number): Texture2D {
        const texture = new Texture2D();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        // 创建纯色数据
        const data = new Uint8Array(w * h * 4);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = this.backgroundColor.r;     // R
            data[i + 1] = this.backgroundColor.g; // G
            data[i + 2] = this.backgroundColor.b; // B
            data[i + 3] = this.backgroundColor.a; // A
        }

        texture.uploadData(data);
        
        if (this.debugMode) {
            console.log(`FinalBackgroundFix: 创建纹理 ${w}x${h}`);
        }
        
        return texture;
    }

    private verifyFinalResult(transform: UITransform, sprite: Sprite): void {
        if (this.debugMode) {
            console.log('=== FinalBackgroundFix: 最终验证 ===');
            console.log(`UITransform最终尺寸: ${transform.width}x${transform.height}`);
            console.log(`Sprite sizeMode: ${sprite.sizeMode}`);
            console.log(`节点Layer: ${this.node.layer}`);
            console.log(`节点active: ${this.node.active}`);
            console.log(`节点position: (${this.node.position.x}, ${this.node.position.y})`);
            
            if (transform.width < 100 || transform.height < 100) {
                console.error('❌ UITransform尺寸异常，可能被其他代码重置');
                // 尝试再次设置
                transform.setContentSize(960, 640);
                console.log(`重新设置尺寸为: ${transform.width}x${transform.height}`);
            } else {
                console.log('✅ UITransform尺寸正常');
            }
        }
    }
}