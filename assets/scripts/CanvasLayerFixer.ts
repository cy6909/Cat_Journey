import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CanvasLayerFixer')
export class CanvasLayerFixer extends Component {
    @property
    public targetLayerValue: number = 33554432; // Canvas默认Layer值
    
    @property
    public debugMode: boolean = true;

    protected onLoad(): void {
        if (this.debugMode) {
            console.log('CanvasLayerFixer: 开始修复Layer配置');
        }
        
        this.fixNodeLayers();
    }

    private fixNodeLayers(): void {
        // 修复当前节点
        this.fixSingleNode(this.node);
        
        // 递归修复所有子节点
        this.fixChildrenRecursively(this.node);
        
        if (this.debugMode) {
            console.log(`CanvasLayerFixer: 修复完成，目标Layer: ${this.targetLayerValue}`);
        }
    }
    
    private fixChildrenRecursively(parentNode: Node): void {
        parentNode.children.forEach(child => {
            this.fixSingleNode(child);
            if (child.children.length > 0) {
                this.fixChildrenRecursively(child);
            }
        });
    }
    
    private fixSingleNode(node: Node): void {
        const oldLayer = node.layer;
        
        // 只有Layer不匹配时才修改
        if (oldLayer !== this.targetLayerValue) {
            node.layer = this.targetLayerValue;
            
            if (this.debugMode) {
                console.log(`CanvasLayerFixer: 修复节点 "${node.name}" Layer: ${oldLayer} -> ${this.targetLayerValue}`);
            }
        }
    }
}