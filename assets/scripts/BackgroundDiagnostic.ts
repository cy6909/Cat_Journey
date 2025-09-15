import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Canvas, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BackgroundDiagnostic')
export class BackgroundDiagnostic extends Component {
    @property
    public testColor: Color = new Color(255, 0, 255, 255); // 洋红色，非常显眼

    protected onLoad(): void {
        console.log('=== BackgroundDiagnostic: 开始全面诊断 ===');
        this.diagnoseEnvironment();
        this.diagnoseNode();
        this.createVisibleBackground();
        this.scheduleOnce(() => {
            this.finalDiagnosis();
        }, 0.5);
    }

    private diagnoseEnvironment(): void {
        console.log('--- 环境诊断 ---');
        
        // 1. 检查Canvas设置 - 遍历父节点查找Canvas
        let currentNode = this.node;
        let canvas: Canvas | null = null;
        
        while (currentNode && !canvas) {
            canvas = currentNode.getComponent(Canvas);
            if (!canvas) {
                currentNode = currentNode.parent;
            }
        }
        
        if (canvas) {
            console.log(`Canvas found: ${canvas.node.name}`);
            const canvasTransform = canvas.getComponent(UITransform);
            if (canvasTransform) {
                console.log(`Canvas size: ${canvasTransform.width}x${canvasTransform.height}`);
            }
            console.log(`Canvas renderMode: ${canvas.renderMode}`);
            console.log(`Canvas priority: ${canvas.priority}`);
        } else {
            console.error('❌ Canvas not found in parent nodes!');
        }

        // 2. 检查屏幕信息
        const designSize = view.getDesignResolutionSize();
        const screenSize = view.getVisibleSize();
        console.log(`Design resolution: ${designSize.width}x${designSize.height}`);
        console.log(`Screen size: ${screenSize.width}x${screenSize.height}`);
    }

    private diagnoseNode(): void {
        console.log('--- 节点诊断 ---');
        
        // 1. 检查节点层级
        console.log(`Node name: ${this.node.name}`);
        console.log(`Node active: ${this.node.active}`);
        console.log(`Node parent: ${this.node.parent ? this.node.parent.name : 'none'}`);
        console.log(`Node children count: ${this.node.children.length}`);
        console.log(`Node position: (${this.node.position.x}, ${this.node.position.y}, ${this.node.position.z})`);
        console.log(`Node scale: (${this.node.scale.x}, ${this.node.scale.y}, ${this.node.scale.z})`);
        console.log(`Node siblingIndex: ${this.node.getSiblingIndex()}`);

        // 2. 检查现有组件
        const components = this.node.components;
        console.log(`Total components: ${components.length}`);
        components.forEach((comp, index) => {
            console.log(`Component ${index}: ${comp.constructor.name}`);
        });

        // 3. 检查UITransform
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            console.log(`UITransform size: ${transform.width}x${transform.height}`);
            console.log(`UITransform anchor: (${transform.anchorX}, ${transform.anchorY})`);
        } else {
            console.error('❌ UITransform not found!');
        }

        // 4. 检查现有的Sprite组件
        const sprites = this.node.getComponents(Sprite);
        console.log(`Existing Sprite components: ${sprites.length}`);
        sprites.forEach((sprite, index) => {
            console.log(`Sprite ${index}: spriteFrame=${sprite.spriteFrame ? 'exists' : 'null'}, color=(${sprite.color.r},${sprite.color.g},${sprite.color.b},${sprite.color.a})`);
        });
    }

    private createVisibleBackground(): void {
        console.log('--- 创建可见背景 ---');

        // 1. 强制设置节点尺寸
        let transform = this.node.getComponent(UITransform);
        if (!transform) {
            transform = this.node.addComponent(UITransform);
            console.log('Added UITransform component');
        }

        // 设置为固定的大尺寸，忽略其他设置
        transform.setContentSize(960, 640);
        transform.setAnchorPoint(0.5, 0.5);
        console.log(`Set UITransform to: ${transform.width}x${transform.height}`);

        // 2. 移除所有现有的Sprite
        const existingSprites = this.node.getComponents(Sprite);
        console.log(`Removing ${existingSprites.length} existing sprites`);
        existingSprites.forEach(sprite => sprite.destroy());

        // 3. 创建简单的4x4像素纹理（避免大纹理问题）
        const texture = new Texture2D();
        texture.reset({
            width: 4,
            height: 4,
            format: Texture2D.PixelFormat.RGBA8888
        });

        // 创建4x4红色像素
        const data = new Uint8Array(4 * 4 * 4);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = this.testColor.r;         // R
            data[i + 1] = this.testColor.g;     // G
            data[i + 2] = this.testColor.b;     // B
            data[i + 3] = this.testColor.a;     // A
        }
        texture.uploadData(data);
        console.log('Created 4x4 red texture');

        // 4. 创建SpriteFrame并设置到Sprite
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        console.log('Created SpriteFrame');

        // 5. 添加Sprite组件
        const sprite = this.node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;
        sprite.color = Color.WHITE; // 确保没有颜色调制
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 自定义尺寸模式
        console.log('Added and configured Sprite component');

        // 6. 强制更新渲染
        sprite.markForUpdateRenderData();
        console.log('Marked sprite for render update');

        // 7. 移到最前层
        this.node.setSiblingIndex(-1); // 移到最后（最前层）
        console.log(`Node moved to siblingIndex: ${this.node.getSiblingIndex()}`);
    }

    private finalDiagnosis(): void {
        console.log('--- 最终诊断 ---');
        
        const transform = this.node.getComponent(UITransform);
        const sprite = this.node.getComponent(Sprite);
        
        if (transform) {
            console.log(`Final UITransform size: ${transform.width}x${transform.height}`);
        }
        
        if (sprite) {
            console.log(`Final Sprite: spriteFrame=${sprite.spriteFrame ? 'exists' : 'null'}`);
            console.log(`Final Sprite color: (${sprite.color.r},${sprite.color.g},${sprite.color.b},${sprite.color.a})`);
            console.log(`Final Sprite type: ${sprite.type}`);
            console.log(`Final Sprite sizeMode: ${sprite.sizeMode}`);
        }

        console.log(`Final node active: ${this.node.active}`);
        console.log(`Final node position: (${this.node.position.x}, ${this.node.position.y})`);
        console.log(`Final node scale: (${this.node.scale.x}, ${this.node.scale.y})`);
        console.log(`Final siblingIndex: ${this.node.getSiblingIndex()}`);
        
        console.log('=== 诊断完成 ===');
        console.log('如果还是看不到红色背景，问题可能在于：');
        console.log('1. 节点被其他UI遮挡');
        console.log('2. Canvas或Camera配置问题');
        console.log('3. 节点不在可视区域内');
    }
}