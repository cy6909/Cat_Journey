import { _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Node, Widget, Canvas, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StarFieldBackgroundFixed')
export class StarFieldBackgroundFixed extends Component {
    @property
    public starCount: number = 150;
    
    @property
    public layerCount: number = 3;
    
    @property
    public bgStartColor: Color = new Color(10, 30, 60, 255); // 更亮的起始色
    
    @property
    public bgEndColor: Color = new Color(30, 80, 140, 255); // 更亮的结束色
    
    @property
    public debugMode: boolean = true; // 默认开启调试模式

    protected onLoad(): void {
        if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: onLoad started');
        }
        this.setupFullScreenBackground();
        this.createLayeredBackground();
    }

    private setupFullScreenBackground(): void {
        // 1. 设置UITransform为全屏尺寸
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            console.error('StarFieldBackgroundFixed: UITransform not found, adding one');
            this.node.addComponent(UITransform);
        }
        
        // 获取屏幕尺寸
        const screenSize = view.getVisibleSize();
        const designSize = view.getDesignResolutionSize();
        
        // 使用设计分辨率或屏幕分辨率，取较大值确保全覆盖
        const targetWidth = Math.max(designSize.width, screenSize.width, 960);
        const targetHeight = Math.max(designSize.height, screenSize.height, 640);
        
        if (this.debugMode) {
            console.log(`StarFieldBackgroundFixed: Screen size: ${screenSize.width}x${screenSize.height}`);
            console.log(`StarFieldBackgroundFixed: Design size: ${designSize.width}x${designSize.height}`);
            console.log(`StarFieldBackgroundFixed: Target size: ${targetWidth}x${targetHeight}`);
        }
        
        // 设置UITransform
        const finalTransform = this.node.getComponent(UITransform);
        finalTransform.setContentSize(targetWidth, targetHeight);
        finalTransform.setAnchorPoint(0.5, 0.5);
        
        // 2. 添加并配置Widget组件自动适应屏幕
        let widget = this.node.getComponent(Widget);
        if (!widget) {
            widget = this.node.addComponent(Widget);
        }
        
        // 配置Widget让背景填满整个屏幕
        widget.isAlignLeft = true;
        widget.isAlignRight = true;  
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
        
        // 3. 立即更新Widget
        widget.updateAlignment();
        
        if (this.debugMode) {
            console.log(`StarFieldBackgroundFixed: Final size after Widget: ${finalTransform.width}x${finalTransform.height}`);
        }
    }

    private createLayeredBackground(): void {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            console.error('StarFieldBackgroundFixed: UITransform component not found');
            return;
        }

        if (this.debugMode) {
            console.log(`StarFieldBackgroundFixed: Creating background with size ${transform.width}x${transform.height}`);
        }

        // 清除现有的Sprite组件
        const existingSprites = this.node.getComponents(Sprite);
        existingSprites.forEach(sprite => {
            sprite.destroy();
        });

        // 方法1: 创建单独的子节点为每一层
        this.createSeparateLayerNodes(transform);
    }

    private createSeparateLayerNodes(transform: UITransform): void {
        // Layer 1: 渐变背景层
        const gradientLayer = this.createLayerNode('GradientLayer', transform, -100);
        this.addGradientToLayer(gradientLayer, transform);

        // Layer 2: 星星层
        for (let layer = 0; layer < this.layerCount; layer++) {
            const starLayer = this.createLayerNode(`StarLayer${layer}`, transform, -50 + layer);
            this.addStarsToLayer(starLayer, transform, layer);
        }

        // Layer 3: 星云层
        const nebulaLayer = this.createLayerNode('NebulaLayer', transform, 0);
        this.addNebulaToLayer(nebulaLayer, transform);

        if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: All layers created');
        }
    }

    private createLayerNode(name: string, parentTransform: UITransform, zIndex: number): Node {
        const layerNode = new Node(name);
        layerNode.setParent(this.node);
        
        // 设置UITransform
        const layerTransform = layerNode.addComponent(UITransform);
        layerTransform.setContentSize(parentTransform.width, parentTransform.height);
        layerTransform.setAnchorPoint(0.5, 0.5);
        
        // 设置层级
        layerNode.setSiblingIndex(zIndex + 100); // 确保正确的渲染顺序
        
        return layerNode;
    }

    private addGradientToLayer(layerNode: Node, transform: UITransform): void {
        const gradientTexture = this.createGradientTexture(transform.width, transform.height);
        
        const sprite = layerNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = gradientTexture;
        sprite.spriteFrame = spriteFrame;
        sprite.color = Color.WHITE;

        if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: Gradient layer added');
        }
    }

    private addStarsToLayer(layerNode: Node, transform: UITransform, layerIndex: number): void {
        const starTexture = this.createStarTexture(transform.width, transform.height, layerIndex);
        
        const sprite = layerNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = starTexture;
        sprite.spriteFrame = spriteFrame;
        
        // 设置透明度，让星星层叠加显示
        const alpha = Math.max(100, 255 - (layerIndex * 60));
        sprite.color = new Color(255, 255, 255, alpha);

        if (this.debugMode) {
            console.log(`StarFieldBackgroundFixed: Star layer ${layerIndex} added with alpha ${alpha}`);
        }
    }

    private addNebulaToLayer(layerNode: Node, transform: UITransform): void {
        const nebulaTexture = this.createNebulaTexture(transform.width, transform.height);
        
        const sprite = layerNode.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = nebulaTexture;
        sprite.spriteFrame = spriteFrame;
        sprite.color = new Color(255, 255, 255, 120); // 提高透明度，避免过暗

        if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: Nebula layer added');
        }
    }

    private createGradientTexture(width: number, height: number): Texture2D {
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
            const r = Math.floor(this.bgStartColor.r + (this.bgEndColor.r - this.bgStartColor.r) * ratio);
            const g = Math.floor(this.bgStartColor.g + (this.bgEndColor.g - this.bgStartColor.g) * ratio);
            const b = Math.floor(this.bgStartColor.b + (this.bgEndColor.b - this.bgStartColor.b) * ratio);
            
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

    private createStarTexture(width: number, height: number, layerIndex: number): Texture2D {
        const texture = new Texture2D();
        const w = Math.max(1, Math.floor(width));
        const h = Math.max(1, Math.floor(height));
        
        texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const data = new Uint8Array(w * h * 4);
        const starsInLayer = Math.floor(this.starCount / this.layerCount);
        const starSize = 1 + layerIndex; // 不同层星星大小

        // 初始化为透明
        for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 完全透明
        }

        // 绘制星星
        for (let i = 0; i < starsInLayer; i++) {
            const x = Math.floor(Math.random() * w);
            const y = Math.floor(Math.random() * h);
            const brightness = 180 + Math.random() * 75; // 180-255，更明亮
            
            this.drawStar(data, w, h, x, y, starSize, brightness);
        }

        texture.uploadData(data);
        return texture;
    }

    private createNebulaTexture(width: number, height: number): Texture2D {
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
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;
                
                // 简化的噪声函数，创建更明显的星云效果
                const noise1 = this.simpleNoise(x * 0.02, y * 0.02);
                const noise2 = this.simpleNoise(x * 0.01, y * 0.01);
                const combinedNoise = (noise1 + noise2) * 0.5;
                const intensity = Math.max(0, combinedNoise * 150); // 提高强度
                
                if (intensity > 50) { // 只在噪声值较高的地方显示星云
                    data[index] = Math.floor(intensity * 1.2);     // R - 偏红紫
                    data[index + 1] = Math.floor(intensity * 0.6); // G
                    data[index + 2] = Math.floor(intensity * 1.5); // B - 偏蓝紫
                    data[index + 3] = Math.floor(intensity * 0.8); // A - 适中透明度
                } else {
                    data[index + 3] = 0; // 完全透明
                }
            }
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
                        
                        // 确保星星是白色且明亮
                        data[index] = Math.min(255, brightness);     // R
                        data[index + 1] = Math.min(255, brightness); // G
                        data[index + 2] = Math.min(255, brightness); // B
                        data[index + 3] = Math.min(255, alpha);      // A
                    }
                }
            }
        }
    }

    private simpleNoise(x: number, y: number): number {
        let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        n = n - Math.floor(n);
        return n;
    }
}