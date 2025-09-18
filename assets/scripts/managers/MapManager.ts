import { _decorator, Component, Node, Vec3, Prefab, instantiate, Color, Sprite, Label, Button, UITransform } from 'cc';
import { EliteType, HiddenBossType } from './EliteAndHiddenBossManager';
import { BossType } from '../gameplay/EnhancedBossController';

const { ccclass, property } = _decorator;

export enum NodeType {
    COMBAT = 'combat',           // 普通战斗
    ELITE = 'elite',            // 精英战斗
    BOSS = 'boss',              // Boss战斗
    HIDDEN_BOSS = 'hidden_boss', // 隐藏Boss
    EVENT = 'event',            // 随机事件
    SHOP = 'shop',              // 商店
    TREASURE = 'treasure',       // 宝藏
    CAMPFIRE = 'campfire',      // 篝火(休息)
    UPGRADE = 'upgrade',        // 升级台
    MYSTERY = 'mystery',        // 神秘节点
    START = 'start',            // 起始节点
    END = 'end'                 // 结束节点
}

// 测试兼容性别名
export const MapNodeType = NodeType;

export enum ChapterTheme {
    FOREST = 'forest',          // 第一章：森林
    MOUNTAIN = 'mountain',      // 第二章：山脉  
    ABYSS = 'abyss'            // 第三章：深渊
}

interface MapNode {
    id: string;
    type: NodeType;
    position: Vec3;
    connections: string[];     // 连接的节点ID
    isVisited: boolean;
    isAvailable: boolean;
    isCurrentPath: boolean;
    chapter: number;
    floor: number;
    
    // Node-specific data
    combatData?: {
        difficulty: number;
        brickCount: number;
        specialBrickRatio: number;
    };
    
    eliteData?: {
        eliteType: EliteType;
        difficulty: number;
    };
    
    bossData?: {
        bossType: BossType;
        chapter: number;
    };
    
    eventData?: {
        eventType: string;
        choices: EventChoice[];
    };
    
    shopData?: {
        items: ShopItem[];
        currency: number;
    };
    
    treasureData?: {
        rewardType: string;
        rewardValue: any;
    };
}

interface EventChoice {
    id: string;
    text: string;
    requirements?: string[];
    consequences: EventConsequence[];
}

interface EventConsequence {
    type: 'health' | 'relic' | 'currency' | 'experience' | 'curse';
    value: any;
    description: string;
}

interface ShopItem {
    id: string;
    name: string;
    description: string;
    type: 'relic' | 'upgrade' | 'consumable';
    cost: number;
    data: any;
}

@ccclass('MapManager')  
export class MapManager extends Component {
    // 单例模式
    private static _instance: MapManager | null = null;
    
    public static getInstance(): MapManager | null {
        return MapManager._instance;
    }
    
    @property({type: Prefab})
    public mapNodePrefab: Prefab | null = null;
    
    @property({type: Prefab})
    public connectionLinePrefab: Prefab | null = null;
    
    @property
    public nodesPerFloor: number = 4;
    
    @property
    public floorsPerChapter: number = 15;
    
    @property
    public nodeSpacing: number = 150;
    
    @property
    public floorSpacing: number = 100;
    
    // Map state
    private _currentChapter: number = 1;
    private _currentFloor: number = 0;
    private _currentNodeId: string = '';
    private _mapNodes: Map<string, MapNode> = new Map();
    private _completedNodes: MapNode[] = [];
    private _chapterTheme: ChapterTheme = ChapterTheme.FOREST;
    
    // Map generation parameters
    private _nodeTypeDistribution: Map<NodeType, number> = new Map();
    private _chapterBossTypes: Map<number, BossType[]> = new Map();
    private _availableEliteTypes: EliteType[] = [];
    
    // Visual elements
    private _nodeVisuals: Map<string, Node> = new Map();
    private _connectionLines: Node[] = [];
    
    protected onLoad(): void {
        if (MapManager._instance === null) {
            MapManager._instance = this;
        }
        this.initializeNodeDistribution();
        this.initializeChapterBosses();
        this.loadMapProgress();
    }

    protected onDestroy(): void {
        if (MapManager._instance === this) {
            MapManager._instance = null;
        }
    }
    
    protected start(): void {
        this.generateChapterMap(1);
    }
    
    private initializeNodeDistribution(): void {
        // Distribution for regular floors (not boss floors)
        this._nodeTypeDistribution.set(NodeType.COMBAT, 45);      // 45% 普通战斗
        this._nodeTypeDistribution.set(NodeType.ELITE, 15);       // 15% 精英战斗
        this._nodeTypeDistribution.set(NodeType.EVENT, 15);       // 15% 随机事件
        this._nodeTypeDistribution.set(NodeType.SHOP, 8);         // 8% 商店
        this._nodeTypeDistribution.set(NodeType.TREASURE, 7);     // 7% 宝藏
        this._nodeTypeDistribution.set(NodeType.CAMPFIRE, 5);     // 5% 篝火休息
        this._nodeTypeDistribution.set(NodeType.UPGRADE, 3);      // 3% 升级台
        this._nodeTypeDistribution.set(NodeType.MYSTERY, 2);      // 2% 神秘节点
    }
    
    private initializeChapterBosses(): void {
        // Chapter 1 bosses
        this._chapterBossTypes.set(1, [
            BossType.GUARDIAN_WALL,
            BossType.STORM_CALLER,
            BossType.BRICK_SPAWNER
        ]);
        
        // Chapter 2 bosses  
        this._chapterBossTypes.set(2, [
            BossType.GRAVITY_MASTER,
            BossType.TIME_MANIPULATOR,
            BossType.SHIELD_GENERATOR
        ]);
        
        // Chapter 3 bosses
        this._chapterBossTypes.set(3, [
            BossType.MULTI_PHASE,
            BossType.TELEPORTER,
            BossType.ELEMENTAL_CHAOS,
            BossType.MIRROR_BOSS
        ]);
        
        // Initialize available elite types
        this._availableEliteTypes = [
            EliteType.BRICK_FORTRESS,
            EliteType.SPEED_DEMON,
            EliteType.REGENERATOR,
            EliteType.ELEMENTAL_CHAOS,
            EliteType.GRAVITY_ANOMALY,
            EliteType.TIME_DISTORTION,
            EliteType.PHASE_SHIFTER,
            EliteType.MAGNETIC_STORM,
            EliteType.SHIELD_MATRIX,
            EliteType.VOID_CORRUPTION
        ];
    }
    
    public generateChapterMap(chapter: number): void {
        this._currentChapter = chapter;
        this._currentFloor = 0;
        this._chapterTheme = this.getChapterTheme(chapter);
        
        console.log(`Generating Chapter ${chapter} Map: ${this._chapterTheme}`);
        
        // Clear existing map
        this.clearCurrentMap();
        
        // Generate map structure
        this.generateMapNodes();
        this.generateConnections();
        this.calculateAvailableNodes();
        
        // Create visual representation
        this.createMapVisuals();
        
        // Set starting position
        const startNodes = this.getNodesByType(NodeType.START);
        if (startNodes.length > 0) {
            this._currentNodeId = startNodes[0].id;
            this.updateNodeAvailability();
        }
    }
    
    private generateMapNodes(): void {
        this._mapNodes.clear();
        
        // Generate each floor
        for (let floor = 0; floor < this.floorsPerChapter; floor++) {
            this.generateFloorNodes(floor);
        }
        
        console.log(`Generated ${this._mapNodes.size} nodes for Chapter ${this._currentChapter}`);
    }
    
    private generateFloorNodes(floor: number): void {
        const nodeCount = this.getNodeCountForFloor(floor);
        
        if (floor === 0) {
            // Start floor - single start node
            this.createNode('start_0', NodeType.START, floor, 0);
        } else if (floor === this.floorsPerChapter - 1) {
            // Boss floor
            const bossTypes = this._chapterBossTypes.get(this._currentChapter) || [];
            const randomBoss = bossTypes[Math.floor(Math.random() * bossTypes.length)];
            
            const bossNode = this.createNode(`boss_${floor}`, NodeType.BOSS, floor, 0);
            bossNode.bossData = {
                bossType: randomBoss,
                chapter: this._currentChapter
            };
        } else if (floor === this.floorsPerChapter - 2) {
            // Pre-boss floor - always has campfire and shop
            this.createNode(`campfire_${floor}_0`, NodeType.CAMPFIRE, floor, 0);
            this.createNode(`shop_${floor}_1`, NodeType.SHOP, floor, 1);
            
            // Fill remaining slots with combat
            for (let i = 2; i < nodeCount; i++) {
                this.createCombatNode(`combat_${floor}_${i}`, floor, i);
            }
        } else {
            // Regular floors
            this.generateRegularFloor(floor, nodeCount);
        }
    }
    
    private generateRegularFloor(floor: number, nodeCount: number): void {
        const nodesToCreate: NodeType[] = [];
        
        // Determine node types for this floor
        for (let i = 0; i < nodeCount; i++) {
            const nodeType = this.selectRandomNodeType();
            nodesToCreate.push(nodeType);
        }
        
        // Ensure at least one combat node per floor
        if (!nodesToCreate.includes(NodeType.COMBAT)) {
            nodesToCreate[Math.floor(Math.random() * nodesToCreate.length)] = NodeType.COMBAT;
        }
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const nodeId = `${nodesToCreate[i]}_${floor}_${i}`;
            this.createNodeByType(nodeId, nodesToCreate[i], floor, i);
        }
    }
    
    private createNodeByType(nodeId: string, nodeType: NodeType, floor: number, position: number): void {
        const node = this.createNode(nodeId, nodeType, floor, position);
        
        switch (nodeType) {
            case NodeType.COMBAT:
                this.setupCombatNode(node, floor);
                break;
            case NodeType.ELITE:
                this.setupEliteNode(node, floor);
                break;
            case NodeType.EVENT:
                this.setupEventNode(node, floor);
                break;
            case NodeType.SHOP:
                this.setupShopNode(node, floor);
                break;
            case NodeType.TREASURE:
                this.setupTreasureNode(node, floor);
                break;
            case NodeType.MYSTERY:
                this.setupMysteryNode(node, floor);
                break;
        }
    }
    
    private createNode(nodeId: string, nodeType: NodeType, floor: number, position: number): MapNode {
        const node: MapNode = {
            id: nodeId,
            type: nodeType,
            position: new Vec3(
                (position - (this.getNodeCountForFloor(floor) - 1) / 2) * this.nodeSpacing,
                floor * this.floorSpacing,
                0
            ),
            connections: [],
            isVisited: false,
            isAvailable: floor === 0, // Only start nodes are initially available
            isCurrentPath: false,
            chapter: this._currentChapter,
            floor: floor
        };
        
        this._mapNodes.set(nodeId, node);
        return node;
    }
    
    private createCombatNode(nodeId: string, floor: number, position: number): void {
        const node = this.createNode(nodeId, NodeType.COMBAT, floor, position);
        this.setupCombatNode(node, floor);
    }
    
    private setupCombatNode(node: MapNode, floor: number): void {
        const baseDifficulty = 1 + (this._currentChapter - 1) * 0.5 + floor * 0.1;
        
        node.combatData = {
            difficulty: baseDifficulty,
            brickCount: Math.floor(20 + baseDifficulty * 5),
            specialBrickRatio: Math.min(0.4, 0.2 + baseDifficulty * 0.05)
        };
    }
    
    private setupEliteNode(node: MapNode, floor: number): void {
        const randomElite = this._availableEliteTypes[
            Math.floor(Math.random() * this._availableEliteTypes.length)
        ];
        
        const baseDifficulty = 1 + (this._currentChapter - 1) * 0.5 + floor * 0.1;
        
        node.eliteData = {
            eliteType: randomElite,
            difficulty: baseDifficulty * 1.4
        };
    }
    
    private setupEventNode(node: MapNode, floor: number): void {
        const events = this.getAvailableEvents(this._chapterTheme, floor);
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        node.eventData = {
            eventType: randomEvent.type,
            choices: randomEvent.choices
        };
    }
    
    private setupShopNode(node: MapNode, floor: number): void {
        node.shopData = {
            items: this.generateShopItems(floor),
            currency: 0 // Player's currency will be checked when entering
        };
    }
    
    private setupTreasureNode(node: MapNode, floor: number): void {
        const treasureTypes = ['relic', 'currency', 'upgrade_material'];
        const randomType = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
        
        node.treasureData = {
            rewardType: randomType,
            rewardValue: this.generateTreasureReward(randomType, floor)
        };
    }
    
    private setupMysteryNode(node: MapNode, floor: number): void {
        // Mystery nodes have random effects that are revealed when entered
        node.treasureData = {
            rewardType: 'mystery',
            rewardValue: { floor: floor, chapter: this._currentChapter }
        };
    }
    
    private generateConnections(): void {
        const nodesByFloor = this.groupNodesByFloor();
        
        for (let floor = 0; floor < this.floorsPerChapter - 1; floor++) {
            const currentFloorNodes = nodesByFloor.get(floor) || [];
            const nextFloorNodes = nodesByFloor.get(floor + 1) || [];
            
            this.connectFloors(currentFloorNodes, nextFloorNodes, floor);
        }
    }
    
    private connectFloors(currentFloor: MapNode[], nextFloor: MapNode[], floorIndex: number): void {
        if (currentFloor.length === 0 || nextFloor.length === 0) return;
        
        // Each node in current floor connects to 1-3 nodes in next floor
        for (const currentNode of currentFloor) {
            const connectionCount = Math.min(
                nextFloor.length,
                Math.floor(Math.random() * 3) + 1
            );
            
            // Choose random nodes to connect to, preferring nearby positions
            const targetIndices = this.selectConnectionTargets(
                currentFloor.indexOf(currentNode),
                nextFloor.length,
                connectionCount
            );
            
            for (const targetIndex of targetIndices) {
                const targetNode = nextFloor[targetIndex];
                currentNode.connections.push(targetNode.id);
            }
        }
        
        // Ensure all next floor nodes are reachable
        this.ensureNodesReachable(currentFloor, nextFloor);
    }
    
    private selectConnectionTargets(sourceIndex: number, targetCount: number, connectionCount: number): number[] {
        const targets: number[] = [];
        const sourcePosition = sourceIndex / Math.max(1, targetCount - 1); // Normalize to 0-1
        
        // Prefer connections to nearby nodes
        for (let i = 0; i < connectionCount; i++) {
            let targetIndex: number;
            
            if (i === 0) {
                // First connection: closest node
                targetIndex = Math.round(sourcePosition * (targetCount - 1));
            } else {
                // Additional connections: random nearby nodes
                const range = Math.min(2, Math.floor(targetCount / 2));
                const centerIndex = Math.round(sourcePosition * (targetCount - 1));
                const minIndex = Math.max(0, centerIndex - range);
                const maxIndex = Math.min(targetCount - 1, centerIndex + range);
                
                do {
                    targetIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
                } while (targets.includes(targetIndex));
            }
            
            targets.push(targetIndex);
        }
        
        return targets;
    }
    
    private ensureNodesReachable(currentFloor: MapNode[], nextFloor: MapNode[]): void {
        const reachableNodes = new Set<string>();
        
        // Find all reachable nodes
        for (const currentNode of currentFloor) {
            for (const connectionId of currentNode.connections) {
                reachableNodes.add(connectionId);
            }
        }
        
        // Connect unreachable nodes to random current floor nodes
        for (const nextNode of nextFloor) {
            if (!reachableNodes.has(nextNode.id)) {
                const randomCurrentNode = currentFloor[Math.floor(Math.random() * currentFloor.length)];
                randomCurrentNode.connections.push(nextNode.id);
            }
        }
    }
    
    private createMapVisuals(): void {
        this.clearMapVisuals();
        
        // Create node visuals
        for (const [nodeId, node] of this._mapNodes) {
            this.createNodeVisual(node);
        }
        
        // Create connection lines
        this.createConnectionVisuals();
    }
    
    private createNodeVisual(node: MapNode): void {
        if (!this.mapNodePrefab) return;
        
        const nodeVisual = instantiate(this.mapNodePrefab);
        const sprite = nodeVisual.getComponent(Sprite);
        const label = nodeVisual.getComponentInChildren(Label);
        const button = nodeVisual.getComponent(Button);
        
        if (sprite) {
            sprite.color = this.getNodeColor(node.type);
        }
        
        if (label) {
            label.string = this.getNodeDisplayName(node.type);
        }
        
        if (button) {
            button.node.on(Button.EventType.CLICK, () => this.onNodeClicked(node.id), this);
        }
        
        nodeVisual.setParent(this.node);
        nodeVisual.setPosition(node.position);
        
        // Set availability visual state
        this.updateNodeVisualState(nodeVisual, node);
        
        this._nodeVisuals.set(node.id, nodeVisual);
    }
    
    private createConnectionVisuals(): void {
        if (!this.connectionLinePrefab) return;
        
        for (const [nodeId, node] of this._mapNodes) {
            for (const connectionId of node.connections) {
                const targetNode = this._mapNodes.get(connectionId);
                if (!targetNode) continue;
                
                const line = instantiate(this.connectionLinePrefab);
                line.setParent(this.node);
                
                // Position and scale line between nodes
                const startPos = node.position;
                const endPos = targetNode.position;
                const midPos = Vec3.lerp(new Vec3(), startPos, endPos, 0.5);
                const distance = Vec3.distance(startPos, endPos);
                
                line.setPosition(midPos);
                
                const transform = line.getComponent(UITransform);
                if (transform) {
                    transform.width = distance;
                    
                    // Rotate line to connect nodes
                    const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
                    line.setRotationFromEuler(0, 0, angle * 180 / Math.PI);
                }
                
                this._connectionLines.push(line);
            }
        }
    }
    
    private getNodeColor(nodeType: NodeType): Color {
        switch (nodeType) {
            case NodeType.COMBAT: return new Color(150, 150, 150); // Gray
            case NodeType.ELITE: return new Color(255, 165, 0);    // Orange
            case NodeType.BOSS: return new Color(255, 0, 0);       // Red
            case NodeType.EVENT: return new Color(0, 255, 255);    // Cyan
            case NodeType.SHOP: return new Color(255, 255, 0);     // Yellow
            case NodeType.TREASURE: return new Color(255, 215, 0); // Gold
            case NodeType.CAMPFIRE: return new Color(255, 100, 0); // Orange-red
            case NodeType.UPGRADE: return new Color(128, 0, 128);  // Purple
            case NodeType.MYSTERY: return new Color(128, 128, 255); // Light blue
            case NodeType.START: return new Color(0, 255, 0);      // Green
            default: return new Color(255, 255, 255);              // White
        }
    }
    
    private getNodeDisplayName(nodeType: NodeType): string {
        switch (nodeType) {
            case NodeType.COMBAT: return "战斗";
            case NodeType.ELITE: return "精英";
            case NodeType.BOSS: return "BOSS";
            case NodeType.EVENT: return "事件";
            case NodeType.SHOP: return "商店";
            case NodeType.TREASURE: return "宝藏";
            case NodeType.CAMPFIRE: return "篝火";
            case NodeType.UPGRADE: return "升级";
            case NodeType.MYSTERY: return "神秘";
            case NodeType.START: return "开始";
            default: return "未知";
        }
    }
    
    public onNodeClicked(nodeId: string): void {
        const node = this._mapNodes.get(nodeId);
        if (!node || !node.isAvailable) {
            console.log(`Node ${nodeId} is not available`);
            return;
        }
        
        console.log(`Player selected node: ${nodeId} (${node.type})`);
        
        // Mark current node as visited
        node.isVisited = true;
        node.isCurrentPath = true;
        this._currentNodeId = nodeId;
        
        // Update node availability
        this.updateNodeAvailability();
        
        // Trigger node action
        this.executeNodeAction(node);
        
        // Update visuals
        this.updateAllNodeVisuals();
    }
    
    private executeNodeAction(node: MapNode): void {
        switch (node.type) {
            case NodeType.COMBAT:
                this.startCombat(node);
                break;
            case NodeType.ELITE:
                this.startEliteCombat(node);
                break;
            case NodeType.BOSS:
                this.startBossCombat(node);
                break;
            case NodeType.EVENT:
                this.triggerEvent(node);
                break;
            case NodeType.SHOP:
                this.enterShop(node);
                break;
            case NodeType.TREASURE:
                this.openTreasure(node);
                break;
            case NodeType.CAMPFIRE:
                this.restAtCampfire(node);
                break;
            case NodeType.UPGRADE:
                this.enterUpgradeStation(node);
                break;
            case NodeType.MYSTERY:
                this.encounterMystery(node);
                break;
        }
    }
    
    // Node action implementations
    private startCombat(node: MapNode): void {
        console.log(`Starting combat with difficulty ${node.combatData?.difficulty}`);
        // Integrate with GameManager to start combat
    }
    
    private startEliteCombat(node: MapNode): void {
        console.log(`Starting elite combat: ${node.eliteData?.eliteType}`);
        // Integrate with EliteAndHiddenBossManager
    }
    
    private startBossCombat(node: MapNode): void {
        console.log(`Starting boss combat: ${node.bossData?.bossType}`);
        // Integrate with EnhancedBossController
    }
    
    private triggerEvent(node: MapNode): void {
        console.log(`Triggered event: ${node.eventData?.eventType}`);
        // Show event UI with choices
    }
    
    private enterShop(node: MapNode): void {
        console.log(`Entered shop with ${node.shopData?.items.length} items`);
        // Show shop UI
    }
    
    private openTreasure(node: MapNode): void {
        console.log(`Found treasure: ${node.treasureData?.rewardType}`);
        // Award treasure and show UI
    }
    
    private restAtCampfire(node: MapNode): void {
        console.log('Resting at campfire');
        // Restore health, show rest options
    }
    
    private enterUpgradeStation(node: MapNode): void {
        console.log('Entered upgrade station');
        // Show upgrade options
    }
    
    private encounterMystery(node: MapNode): void {
        console.log('Encountered mystery node');
        // Random effect
    }
    
    // Utility methods
    private selectRandomNodeType(): NodeType {
        const totalWeight = Array.from(this._nodeTypeDistribution.values()).reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [nodeType, weight] of this._nodeTypeDistribution.entries()) {
            random -= weight;
            if (random <= 0) {
                return nodeType;
            }
        }
        
        return NodeType.COMBAT; // Fallback
    }
    
    private getNodeCountForFloor(floor: number): number {
        if (floor === 0 || floor === this.floorsPerChapter - 1) {
            return 1; // Start and boss floors have single nodes
        } else if (floor === this.floorsPerChapter - 2) {
            return this.nodesPerFloor - 1; // Pre-boss floor has slightly fewer options
        } else {
            return this.nodesPerFloor;
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
    
    private groupNodesByFloor(): Map<number, MapNode[]> {
        const floorGroups = new Map<number, MapNode[]>();
        
        for (const node of this._mapNodes.values()) {
            if (!floorGroups.has(node.floor)) {
                floorGroups.set(node.floor, []);
            }
            floorGroups.get(node.floor)!.push(node);
        }
        
        return floorGroups;
    }
    
    private getNodesByType(nodeType: NodeType): MapNode[] {
        return Array.from(this._mapNodes.values()).filter(node => node.type === nodeType);
    }
    
    private updateNodeAvailability(): void {
        // Reset availability
        for (const node of this._mapNodes.values()) {
            node.isAvailable = false;
        }
        
        // Make connected nodes available
        const currentNode = this._mapNodes.get(this._currentNodeId);
        if (currentNode) {
            for (const connectionId of currentNode.connections) {
                const connectedNode = this._mapNodes.get(connectionId);
                if (connectedNode && !connectedNode.isVisited) {
                    connectedNode.isAvailable = true;
                }
            }
        }
    }
    
    private updateAllNodeVisuals(): void {
        for (const [nodeId, node] of this._mapNodes) {
            const visual = this._nodeVisuals.get(nodeId);
            if (visual) {
                this.updateNodeVisualState(visual, node);
            }
        }
    }
    
    private updateNodeVisualState(visual: Node, node: MapNode): void {
        const sprite = visual.getComponent(Sprite);
        if (!sprite) return;
        
        if (node.isVisited) {
            sprite.color = new Color(100, 100, 100, 180); // Dark and semi-transparent
        } else if (node.isAvailable) {
            sprite.color = this.getNodeColor(node.type);
        } else {
            sprite.color = new Color(80, 80, 80, 100); // Very dark and transparent
        }
        
        // Highlight current node
        if (node.id === this._currentNodeId) {
            sprite.color = Color.WHITE;
        }
    }
    
    private clearCurrentMap(): void {
        this._mapNodes.clear();
        this.clearMapVisuals();
    }
    
    private clearMapVisuals(): void {
        // Clear node visuals
        for (const visual of this._nodeVisuals.values()) {
            visual.destroy();
        }
        this._nodeVisuals.clear();
        
        // Clear connection lines
        for (const line of this._connectionLines) {
            line.destroy();
        }
        this._connectionLines = [];
    }
    
    // Event and shop data generation
    private getAvailableEvents(theme: ChapterTheme, floor: number): any[] {
        // This would be expanded with actual event data
        return [
            {
                type: 'mysterious_shrine',
                choices: [
                    {
                        id: 'pray',
                        text: '祈祷获得祝福',
                        consequences: [{ type: 'relic', value: 'random', description: '获得随机遗物' }]
                    },
                    {
                        id: 'ignore',
                        text: '无视神龛',
                        consequences: [{ type: 'currency', value: 20, description: '获得20金币' }]
                    }
                ]
            }
        ];
    }
    
    private generateShopItems(floor: number): ShopItem[] {
        // Generate shop items based on floor and chapter
        return [
            {
                id: 'health_potion',
                name: '生命药水',
                description: '恢复50点生命值',
                type: 'consumable',
                cost: 75,
                data: { healing: 50 }
            },
            {
                id: 'damage_relic',
                name: '力量护符',
                description: '永久增加10%伤害',
                type: 'relic',
                cost: 150,
                data: { damageBonus: 0.1 }
            }
        ];
    }
    
    private generateTreasureReward(rewardType: string, floor: number): any {
        switch (rewardType) {
            case 'relic':
                return { relicType: 'random', tier: 'common' };
            case 'currency':
                return { amount: 50 + floor * 10 };
            case 'upgrade_material':
                return { type: 'enhancement_stone', quantity: 2 };
            default:
                return null;
        }
    }
    
    private saveMapProgress(): void {
        // Save current map state
        console.log('Map progress saved');
    }
    
    private loadMapProgress(): void {
        // Load saved map state
        console.log('Map progress loaded');
    }
    
    // Public accessors
    public getCurrentNode(): MapNode | undefined {
        return this._mapNodes.get(this._currentNodeId);
    }
    
    public getCurrentChapter(): number {
        return this._currentChapter;
    }
    
    public getCurrentFloor(): number {
        const currentNode = this.getCurrentNode();
        return currentNode ? currentNode.floor : 0;
    }
    
    public isChapterComplete(): boolean {
        const currentNode = this.getCurrentNode();
        return currentNode?.type === NodeType.BOSS && currentNode.isVisited;
    }
    
    public getNextChapterAvailable(): boolean {
        return this.isChapterComplete() && this._currentChapter < 3;
    }
    
    private calculateAvailableNodes(): void {
        // Calculate which nodes are available based on current progress
        // Initially only starting nodes are available
        for (const [nodeId, node] of this._mapNodes) {
            if (node.type === NodeType.START) {
                node.isAvailable = true;
            } else {
                node.isAvailable = false;
            }
        }
        
        // Update available nodes based on completed nodes
        this.updateAvailableNodes();
    }
    
    private updateAvailableNodes(): void {
        // Unlock nodes that are connected to completed nodes
        for (const completedNode of this._completedNodes) {
            for (const connectionId of completedNode.connections) {
                const connectedNode = this.getNodeById(connectionId);
                if (connectedNode) {
                    connectedNode.isAvailable = true;
                }
            }
        }
    }
    
    private getNodeById(nodeId: string): MapNode | undefined {
        return this._mapNodes.get(nodeId);
    }

    // 添加测试需要的方法
    public getCurrentChapter(): number {
        return this._currentChapter;
    }

    public getCurrentFloor(): number {
        return this._currentFloor;
    }

    public getCurrentNodeType(): NodeType {
        const currentNode = this.getNodeById(this._currentNodeId);
        return currentNode ? currentNode.type : NodeType.START;
    }

    public getMapSize(): number {
        return this._mapNodes.size;
    }

    public getAvailableNodes(): MapNode[] {
        return Array.from(this._mapNodes.values()).filter(node => node.isAvailable);
    }

    public getCompletedNodesCount(): number {
        return this._completedNodes.length;
    }

    public canNavigateToNode(nodeId: string): boolean {
        const targetNode = this.getNodeById(nodeId);
        if (!targetNode) return false;
        return targetNode.isAvailable && !targetNode.isVisited;
    }

    public getNodeConnections(nodeId: string): string[] {
        const node = this.getNodeById(nodeId);
        return node ? node.connections : [];
    }

    public getShortestPath(fromNodeId: string, toNodeId: string): string[] {
        // 简单的BFS路径查找实现
        const visited = new Set<string>();
        const queue: { nodeId: string, path: string[] }[] = [];
        
        queue.push({ nodeId: fromNodeId, path: [fromNodeId] });
        visited.add(fromNodeId);
        
        while (queue.length > 0) {
            const { nodeId, path } = queue.shift()!;
            
            if (nodeId === toNodeId) {
                return path;
            }
            
            const node = this.getNodeById(nodeId);
            if (node) {
                for (const connectionId of node.connections) {
                    if (!visited.has(connectionId)) {
                        visited.add(connectionId);
                        queue.push({ 
                            nodeId: connectionId, 
                            path: [...path, connectionId] 
                        });
                    }
                }
            }
        }
        
        return []; // 无路径
    }

    public getNodeData(nodeId: string): MapNode | null {
        return this.getNodeById(nodeId) || null;
    }

    public getAllNodes(): MapNode[] {
        return Array.from(this._mapNodes.values());
    }

    public resetMap(): void {
        this._mapNodes.clear();
        this._completedNodes = [];
        this._currentFloor = 0;
        this._currentNodeId = '';
        this.clearMapVisuals();
    }

    private clearMapVisuals(): void {
        this._nodeVisuals.clear();
        this._connectionLines.forEach(line => line.destroy());
        this._connectionLines = [];
    }
}