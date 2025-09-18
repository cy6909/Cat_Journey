import { _decorator, Component, Node, Vec3, Prefab, instantiate, Color, Sprite, Label, Button, UITransform, Vec2, Graphics, tween, Camera, view, Widget } from 'cc';
import { MapManager, NodeType, ChapterTheme } from '../managers/MapManager';

const { ccclass, property } = _decorator;

export enum MapIconType {
    COMBAT = 'combat',
    ELITE = 'elite', 
    BOSS = 'boss',
    SHOP = 'shop',
    TREASURE = 'treasure',
    CAMPFIRE = 'campfire',
    EVENT = 'event',
    MYSTERY = 'mystery'
}

interface VisualMapNode {
    id: string;
    type: NodeType;
    position: Vec3;
    uiNode: Node;
    iconSprite: Sprite;
    connections: string[];
    isVisited: boolean;
    isAvailable: boolean;
    isCurrentPosition: boolean;
    chapter: number;
    floor: number;
}

interface ChapterVisualConfig {
    backgroundColor: Color;
    pathColor: Color;
    availableNodeColor: Color;
    visitedNodeColor: Color;
    currentNodeColor: Color;
    lockedNodeColor: Color;
    particleEffects: string[];
    ambientAnimations: string[];
}

@ccclass('SlayTheSpireMapVisualizer')
export class SlayTheSpireMapVisualizer extends Component {
    @property
    public currentChapter: number = 1;
    
    @property
    public enableAnimations: boolean = true;
    
    @property
    public enableParticleEffects: boolean = true;
    
    @property
    public mapScrollEnabled: boolean = true;
    
    @property({type: Node})
    public mapContainer: Node | null = null;
    
    @property({type: Node})
    public pathContainer: Node | null = null;
    
    @property({type: Node})
    public nodeContainer: Node | null = null;
    
    @property({type: Node})
    public effectsContainer: Node | null = null;
    
    @property({type: Camera})
    public mapCamera: Camera | null = null;

    private visualNodes: Map<string, VisualMapNode> = new Map();
    private pathLines: Map<string, Node> = new Map();
    private chapterConfigs: Map<ChapterTheme, ChapterVisualConfig> = new Map();
    private currentPlayerPosition: string = '';
    private mapManager: MapManager | null = null;

    protected onLoad(): void {
        this.initializeChapterConfigurations();
        this.setupMapContainers();
        this.findMapManager();
    }

    private initializeChapterConfigurations(): void {
        // 森林主题配置
        this.chapterConfigs.set(ChapterTheme.FOREST, {
            backgroundColor: new Color(20, 60, 30, 255),
            pathColor: new Color(139, 69, 19, 255), // 土路色
            availableNodeColor: new Color(255, 255, 255, 255),
            visitedNodeColor: new Color(150, 150, 150, 180),
            currentNodeColor: new Color(255, 215, 0, 255), // 金色
            lockedNodeColor: new Color(80, 80, 80, 120),
            particleEffects: ['leaves', 'fireflies', 'pollen'],
            ambientAnimations: ['tree_sway', 'fog_drift']
        });

        // 雪山主题配置  
        this.chapterConfigs.set(ChapterTheme.MOUNTAIN, {
            backgroundColor: new Color(30, 50, 80, 255),
            pathColor: new Color(200, 200, 255, 255), // 雪路色
            availableNodeColor: new Color(255, 255, 255, 255),
            visitedNodeColor: new Color(150, 150, 200, 180),
            currentNodeColor: new Color(100, 200, 255, 255), // 冰蓝色
            lockedNodeColor: new Color(60, 60, 100, 120),
            particleEffects: ['snow', 'aurora', 'ice_crystals'],
            ambientAnimations: ['aurora_dance', 'snow_drift']
        });

        // 深渊主题配置
        this.chapterConfigs.set(ChapterTheme.ABYSS, {
            backgroundColor: new Color(50, 20, 60, 255),
            pathColor: new Color(150, 50, 150, 255), // 紫色能量路径
            availableNodeColor: new Color(255, 255, 255, 255),
            visitedNodeColor: new Color(120, 80, 120, 180),
            currentNodeColor: new Color(255, 100, 255, 255), // 紫红色
            lockedNodeColor: new Color(60, 40, 60, 120),
            particleEffects: ['energy_sparks', 'void_rifts', 'plasma_flows'],
            ambientAnimations: ['energy_pulse', 'void_distortion']
        });
    }

    private setupMapContainers(): void {
        if (!this.mapContainer) {
            this.mapContainer = new Node('MapContainer');
            this.mapContainer.setParent(this.node);
            
            // 添加Widget适配全屏
            const widget = this.mapContainer.addComponent(Widget);
            widget.isAlignLeft = widget.isAlignRight = true;
            widget.isAlignTop = widget.isAlignBottom = true;
            widget.left = widget.right = widget.top = widget.bottom = 0;
            widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
        }

        // 创建分层容器
        this.pathContainer = this.createContainer('PathContainer', -50);
        this.nodeContainer = this.createContainer('NodeContainer', 0);
        this.effectsContainer = this.createContainer('EffectsContainer', 50);
        
        // 设置滚动支持
        if (this.mapScrollEnabled) {
            this.setupMapScrolling();
        }
    }

    private createContainer(name: string, zIndex: number): Node {
        const container = new Node(name);
        container.setParent(this.mapContainer);
        container.setPosition(0, 0, zIndex);
        
        const transform = container.addComponent(UITransform);
        const screenSize = view.getVisibleSize();
        transform.setContentSize(screenSize.width * 2, screenSize.height * 3); // 可滚动的大地图
        transform.setAnchorPoint(0.5, 0.5);
        
        return container;
    }

    private setupMapScrolling(): void {
        // 实现地图滚动逻辑
        // 这里可以添加触摸/鼠标拖拽支持
        this.node.on(Node.EventType.TOUCH_START, this.onMapTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMapTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMapTouchEnd, this);
    }

    private onMapTouchStart(event: any): void {
        // 记录初始触摸位置
    }

    private onMapTouchMove(event: any): void {
        // 实现地图拖拽
        if (this.mapContainer) {
            const deltaMove = event.getDelta();
            const currentPos = this.mapContainer.getPosition();
            this.mapContainer.setPosition(
                currentPos.x + deltaMove.x,
                currentPos.y + deltaMove.y,
                currentPos.z
            );
        }
    }

    private onMapTouchEnd(event: any): void {
        // 地图拖拽结束处理
    }

    private findMapManager(): void {
        this.mapManager = this.getComponent(MapManager) || this.node.getComponent(MapManager);
        if (!this.mapManager) {
            console.warn('SlayTheSpireMapVisualizer: MapManager not found');
        }
    }

    public generateVisualMap(chapter: number): void {
        this.currentChapter = chapter;
        this.clearCurrentMap();
        
        if (!this.mapManager) {
            console.error('MapManager not available for visual map generation');
            return;
        }

        // 获取地图数据
        const mapData = this.mapManager.generateChapterMap(chapter);
        const theme = this.getChapterTheme(chapter);
        
        // 设置章节主题
        this.applyChapterTheme(theme);
        
        // 创建可视化节点
        this.createVisualNodes(mapData);
        
        // 创建连接路径
        this.createConnectionPaths();
        
        // 添加动画效果
        if (this.enableAnimations) {
            this.startAmbientAnimations(theme);
        }
        
        // 添加粒子效果
        if (this.enableParticleEffects) {
            this.createParticleEffects(theme);
        }
        
        console.log(`Visual map generated for Chapter ${chapter} (${theme})`);
    }

    private clearCurrentMap(): void {
        this.visualNodes.clear();
        this.pathLines.clear();
        
        if (this.nodeContainer) {
            this.nodeContainer.removeAllChildren();
        }
        if (this.pathContainer) {
            this.pathContainer.removeAllChildren();
        }
        if (this.effectsContainer) {
            this.effectsContainer.removeAllChildren();
        }
    }

    private getChapterTheme(chapter: number): ChapterTheme {
        switch (chapter) {
            case 1: return ChapterTheme.FOREST;
            case 2: return ChapterTheme.MOUNTAIN;
            case 3: return ChapterTheme.ABYSS;
            default: return ChapterTheme.FOREST;
        }
    }

    private applyChapterTheme(theme: ChapterTheme): void {
        const config = this.chapterConfigs.get(theme);
        if (!config) return;

        // 应用背景色
        this.createThemedBackground(config.backgroundColor);
        
        console.log(`Applied theme: ${theme}`);
    }

    private createThemedBackground(backgroundColor: Color): void {
        const bgNode = new Node('ThemedBackground');
        bgNode.setParent(this.mapContainer);
        bgNode.setSiblingIndex(0); // 置于最底层
        
        const bgTransform = bgNode.addComponent(UITransform);
        const screenSize = view.getVisibleSize();
        bgTransform.setContentSize(screenSize.width * 2, screenSize.height * 3);
        bgTransform.setAnchorPoint(0.5, 0.5);
        
        const bgSprite = bgNode.addComponent(Sprite);
        const bgTexture = this.createSolidColorTexture(backgroundColor);
        bgSprite.spriteFrame = bgTexture;
        bgSprite.sizeMode = Sprite.SizeMode.CUSTOM;
    }

    private createSolidColorTexture(color: Color): any {
        // 这里应该创建纯色纹理
        // 实际实现中需要使用Cocos Creator的纹理创建API
        return null; // 占位符
    }

    private createVisualNodes(mapData: any): void {
        // 根据MapManager生成的数据创建可视化节点
        const floors = 15; // 每章15层
        const nodesPerFloor = 4; // 每层最多4个节点
        
        for (let floor = 0; floor < floors; floor++) {
            this.createFloorNodes(floor, nodesPerFloor);
        }
    }

    private createFloorNodes(floor: number, nodeCount: number): void {
        const floorY = -floor * 100; // 每层间距100像素
        const startX = -(nodeCount - 1) * 120 / 2; // 节点水平分布
        
        for (let i = 0; i < nodeCount; i++) {
            const nodeX = startX + i * 120;
            const nodePos = new Vec3(nodeX, floorY, 0);
            
            // 确定节点类型
            const nodeType = this.determineNodeType(floor, i);
            
            // 创建视觉节点
            const visualNode = this.createSingleVisualNode(
                `node_${floor}_${i}`,
                nodeType,
                nodePos,
                this.currentChapter,
                floor
            );
            
            this.visualNodes.set(visualNode.id, visualNode);
        }
    }

    private determineNodeType(floor: number, index: number): NodeType {
        // 第0层必须是START
        if (floor === 0) return NodeType.START;
        
        // 最后一层必须是BOSS
        if (floor === 14) return NodeType.BOSS;
        
        // 根据层数和随机性确定节点类型
        const rand = Math.random();
        
        if (floor % 5 === 4) { // 每5层有一个精英
            return NodeType.ELITE;
        } else if (rand < 0.7) {
            return NodeType.COMBAT;
        } else if (rand < 0.8) {
            return NodeType.SHOP;
        } else if (rand < 0.9) {
            return NodeType.CAMPFIRE;
        } else {
            return NodeType.TREASURE;
        }
    }

    private createSingleVisualNode(
        id: string, 
        type: NodeType, 
        position: Vec3, 
        chapter: number, 
        floor: number
    ): VisualMapNode {
        const nodeUI = new Node(`MapNode_${id}`);
        nodeUI.setParent(this.nodeContainer);
        nodeUI.setPosition(position);
        
        // 添加UITransform
        const transform = nodeUI.addComponent(UITransform);
        transform.setContentSize(60, 60);
        transform.setAnchorPoint(0.5, 0.5);
        
        // 创建节点图标
        const iconSprite = this.createNodeIcon(nodeUI, type);
        
        // 添加按钮功能
        const button = nodeUI.addComponent(Button);
        button.target = nodeUI;
        
        // 绑定点击事件
        button.node.on(Button.EventType.CLICK, () => {
            this.onNodeClicked(id);
        }, this);
        
        // 添加节点标签
        this.createNodeLabel(nodeUI, type);
        
        return {
            id,
            type,
            position,
            uiNode: nodeUI,
            iconSprite,
            connections: [],
            isVisited: false,
            isAvailable: floor === 0, // 只有第一层可用
            isCurrentPosition: false,
            chapter,
            floor
        };
    }

    private createNodeIcon(parentNode: Node, type: NodeType): Sprite {
        const iconNode = new Node('Icon');
        iconNode.setParent(parentNode);
        
        const iconTransform = iconNode.addComponent(UITransform);
        iconTransform.setContentSize(40, 40);
        iconTransform.setAnchorPoint(0.5, 0.5);
        
        const sprite = iconNode.addComponent(Sprite);
        
        // 根据节点类型设置图标
        const iconColor = this.getNodeTypeColor(type);
        this.setNodeIconAppearance(sprite, type, iconColor);
        
        return sprite;
    }

    private getNodeTypeColor(type: NodeType): Color {
        switch (type) {
            case NodeType.COMBAT: return new Color(255, 100, 100, 255); // 红色
            case NodeType.ELITE: return new Color(255, 200, 0, 255); // 金色
            case NodeType.BOSS: return new Color(150, 0, 255, 255); // 紫色
            case NodeType.SHOP: return new Color(0, 200, 255, 255); // 蓝色
            case NodeType.TREASURE: return new Color(255, 215, 0, 255); // 金宝箱色
            case NodeType.CAMPFIRE: return new Color(255, 150, 0, 255); // 橙色
            case NodeType.EVENT: return new Color(0, 255, 150, 255); // 绿色
            case NodeType.MYSTERY: return new Color(200, 0, 200, 255); // 紫红色
            default: return new Color(255, 255, 255, 255);
        }
    }

    private setNodeIconAppearance(sprite: Sprite, type: NodeType, color: Color): void {
        // 这里应该设置具体的图标纹理
        // 暂时使用颜色区分
        sprite.color = color;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    }

    private createNodeLabel(parentNode: Node, type: NodeType): void {
        const labelNode = new Node('Label');
        labelNode.setParent(parentNode);
        labelNode.setPosition(0, -40, 0);
        
        const labelTransform = labelNode.addComponent(UITransform);
        labelTransform.setContentSize(80, 20);
        labelTransform.setAnchorPoint(0.5, 0.5);
        
        const label = labelNode.addComponent(Label);
        label.string = this.getNodeTypeDisplayName(type);
        label.fontSize = 12;
        label.color = new Color(255, 255, 255, 255);
    }

    private getNodeTypeDisplayName(type: NodeType): string {
        switch (type) {
            case NodeType.COMBAT: return '战斗';
            case NodeType.ELITE: return '精英';
            case NodeType.BOSS: return 'Boss';
            case NodeType.SHOP: return '商店';
            case NodeType.TREASURE: return '宝藏';
            case NodeType.CAMPFIRE: return '篝火';
            case NodeType.EVENT: return '事件';
            case NodeType.MYSTERY: return '神秘';
            case NodeType.START: return '开始';
            case NodeType.END: return '结束';
            default: return '未知';
        }
    }

    private createConnectionPaths(): void {
        // 创建节点间的连接路径
        this.visualNodes.forEach((node, nodeId) => {
            node.connections.forEach(connectionId => {
                const targetNode = this.visualNodes.get(connectionId);
                if (targetNode) {
                    this.createPathLine(node, targetNode);
                }
            });
        });
    }

    private createPathLine(fromNode: VisualMapNode, toNode: VisualMapNode): void {
        const pathNode = new Node(`Path_${fromNode.id}_to_${toNode.id}`);
        pathNode.setParent(this.pathContainer);
        
        const graphics = pathNode.addComponent(Graphics);
        
        // 获取主题配置
        const theme = this.getChapterTheme(this.currentChapter);
        const config = this.chapterConfigs.get(theme);
        const pathColor = config?.pathColor || new Color(200, 200, 200, 255);
        
        // 绘制路径线条
        graphics.strokeColor = pathColor;
        graphics.lineWidth = 4;
        graphics.moveTo(fromNode.position.x, fromNode.position.y);
        graphics.lineTo(toNode.position.x, toNode.position.y);
        graphics.stroke();
        
        this.pathLines.set(`${fromNode.id}_${toNode.id}`, pathNode);
    }

    private startAmbientAnimations(theme: ChapterTheme): void {
        const config = this.chapterConfigs.get(theme);
        if (!config) return;
        
        // 启动环境动画
        config.ambientAnimations.forEach(animType => {
            this.createAmbientAnimation(animType);
        });
    }

    private createAmbientAnimation(animType: string): void {
        switch (animType) {
            case 'tree_sway':
                this.createTreeSwayAnimation();
                break;
            case 'fog_drift':
                this.createFogDriftAnimation();
                break;
            case 'aurora_dance':
                this.createAuroraDanceAnimation();
                break;
            case 'snow_drift':
                this.createSnowDriftAnimation();
                break;
            case 'energy_pulse':
                this.createEnergyPulseAnimation();
                break;
            case 'void_distortion':
                this.createVoidDistortionAnimation();
                break;
        }
    }

    private createTreeSwayAnimation(): void {
        // 森林主题：树木摇摆动画
        console.log('Creating tree sway animation');
    }

    private createFogDriftAnimation(): void {
        // 森林主题：雾气飘动动画
        console.log('Creating fog drift animation');
    }

    private createAuroraDanceAnimation(): void {
        // 雪山主题：极光舞动动画
        console.log('Creating aurora dance animation');
    }

    private createSnowDriftAnimation(): void {
        // 雪山主题：雪花飘落动画
        console.log('Creating snow drift animation');
    }

    private createEnergyPulseAnimation(): void {
        // 深渊主题：能量脉冲动画
        console.log('Creating energy pulse animation');
    }

    private createVoidDistortionAnimation(): void {
        // 深渊主题：虚空扭曲动画
        console.log('Creating void distortion animation');
    }

    private createParticleEffects(theme: ChapterTheme): void {
        const config = this.chapterConfigs.get(theme);
        if (!config) return;
        
        // 创建粒子效果
        config.particleEffects.forEach(effectType => {
            this.createParticleEffect(effectType);
        });
    }

    private createParticleEffect(effectType: string): void {
        const effectNode = new Node(`ParticleEffect_${effectType}`);
        effectNode.setParent(this.effectsContainer);
        
        // 这里应该添加粒子系统组件
        // 暂时用日志记录
        console.log(`Creating particle effect: ${effectType}`);
    }

    private onNodeClicked(nodeId: string): void {
        const node = this.visualNodes.get(nodeId);
        if (!node) return;
        
        console.log(`Node clicked: ${nodeId} (${node.type})`);
        
        if (!node.isAvailable) {
            console.log('Node is not available');
            return;
        }
        
        // 更新当前位置
        this.setCurrentPlayerPosition(nodeId);
        
        // 开始关卡切换过渡
        this.startLevelTransition(node);
    }

    private setCurrentPlayerPosition(nodeId: string): void {
        // 清除旧的当前位置
        if (this.currentPlayerPosition) {
            const oldNode = this.visualNodes.get(this.currentPlayerPosition);
            if (oldNode) {
                oldNode.isCurrentPosition = false;
                this.updateNodeVisuals(oldNode);
            }
        }
        
        // 设置新的当前位置
        const newNode = this.visualNodes.get(nodeId);
        if (newNode) {
            newNode.isCurrentPosition = true;
            newNode.isVisited = true;
            this.updateNodeVisuals(newNode);
            
            // 解锁连接的节点
            this.unlockConnectedNodes(newNode);
        }
        
        this.currentPlayerPosition = nodeId;
    }

    private updateNodeVisuals(node: VisualMapNode): void {
        const theme = this.getChapterTheme(this.currentChapter);
        const config = this.chapterConfigs.get(theme);
        if (!config) return;
        
        let targetColor: Color;
        
        if (node.isCurrentPosition) {
            targetColor = config.currentNodeColor;
        } else if (node.isVisited) {
            targetColor = config.visitedNodeColor;
        } else if (node.isAvailable) {
            targetColor = config.availableNodeColor;
        } else {
            targetColor = config.lockedNodeColor;
        }
        
        // 应用颜色变化动画
        if (this.enableAnimations) {
            tween(node.iconSprite)
                .to(0.3, { color: targetColor })
                .start();
        } else {
            node.iconSprite.color = targetColor;
        }
    }

    private unlockConnectedNodes(node: VisualMapNode): void {
        node.connections.forEach(connectionId => {
            const connectedNode = this.visualNodes.get(connectionId);
            if (connectedNode && !connectedNode.isAvailable) {
                connectedNode.isAvailable = true;
                this.updateNodeVisuals(connectedNode);
                
                // 播放解锁动画
                if (this.enableAnimations) {
                    this.playNodeUnlockAnimation(connectedNode);
                }
            }
        });
    }

    private playNodeUnlockAnimation(node: VisualMapNode): void {
        // 解锁动画：闪光效果
        tween(node.uiNode)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.2, { scale: new Vec3(1.0, 1.0, 1) })
            .start();
    }

    private startLevelTransition(node: VisualMapNode): void {
        console.log(`Starting transition to ${node.type} level`);
        
        // 这里可以触发场景切换或关卡加载
        // 触发MapManager的关卡加载逻辑
        if (this.mapManager) {
            // this.mapManager.loadLevel(node.id);
        }
        
        // 可以在这里添加过场动画
        this.playTransitionAnimation(node);
    }

    private playTransitionAnimation(node: VisualMapNode): void {
        // 过场动画：地图淡出，准备切换到游戏场景
        if (this.mapContainer && this.enableAnimations) {
            tween(this.mapContainer)
                .to(0.5, { 
                    position: new Vec3(0, 0, 0),
                    scale: new Vec3(0.8, 0.8, 1)
                })
                .call(() => {
                    console.log('Transition animation completed');
                    // 这里可以触发实际的场景切换
                })
                .start();
        }
    }

    // 公共接口方法
    public getCurrentPlayerPosition(): string {
        return this.currentPlayerPosition;
    }

    public getVisibleNodes(): VisualMapNode[] {
        return Array.from(this.visualNodes.values()).filter(node => node.isAvailable || node.isVisited);
    }

    public centerMapOnCurrentNode(): void {
        if (!this.currentPlayerPosition || !this.mapContainer) return;
        
        const currentNode = this.visualNodes.get(this.currentPlayerPosition);
        if (!currentNode) return;
        
        // 将地图中心移动到当前节点
        const targetPos = new Vec3(-currentNode.position.x, -currentNode.position.y, 0);
        
        if (this.enableAnimations) {
            tween(this.mapContainer)
                .to(0.8, { position: targetPos })
                .start();
        } else {
            this.mapContainer.setPosition(targetPos);
        }
    }

    public resetMap(): void {
        this.clearCurrentMap();
        this.currentPlayerPosition = '';
    }

    public saveMapProgress(): any {
        // 保存地图进度数据
        const saveData = {
            currentChapter: this.currentChapter,
            currentPosition: this.currentPlayerPosition,
            visitedNodes: Array.from(this.visualNodes.values())
                .filter(node => node.isVisited)
                .map(node => node.id),
            availableNodes: Array.from(this.visualNodes.values())
                .filter(node => node.isAvailable)
                .map(node => node.id)
        };
        
        return saveData;
    }

    public loadMapProgress(saveData: any): void {
        // 加载地图进度数据
        if (saveData.currentChapter) {
            this.generateVisualMap(saveData.currentChapter);
        }
        
        if (saveData.currentPosition) {
            this.setCurrentPlayerPosition(saveData.currentPosition);
        }
        
        if (saveData.visitedNodes) {
            saveData.visitedNodes.forEach((nodeId: string) => {
                const node = this.visualNodes.get(nodeId);
                if (node) {
                    node.isVisited = true;
                    this.updateNodeVisuals(node);
                }
            });
        }
        
        if (saveData.availableNodes) {
            saveData.availableNodes.forEach((nodeId: string) => {
                const node = this.visualNodes.get(nodeId);
                if (node) {
                    node.isAvailable = true;
                    this.updateNodeVisuals(node);
                }
            });
        }
    }
}