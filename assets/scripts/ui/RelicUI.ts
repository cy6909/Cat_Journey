import { _decorator, Component, Node, Label, Layout } from 'cc';
import { RelicManager, Relic } from '../managers/RelicManager';
const { ccclass, property } = _decorator;

@ccclass('RelicUI')
export class RelicUI extends Component {
    @property(Node)
    public relicContainer: Node | null = null;

    @property(Label)
    public relicCountLabel: Label | null = null;

    private _relicManager: RelicManager | null = null;

    protected onLoad(): void {
        this._relicManager = RelicManager.getInstance();
    }

    protected start(): void {
        this.updateRelicDisplay();
        this.schedule(this.updateRelicDisplay, 1.0);
    }

    private updateRelicDisplay(): void {
        if (!this._relicManager) return;

        const activeRelics = this._relicManager.getActiveRelics();
        
        if (this.relicCountLabel) {
            this.relicCountLabel.string = `Relics: ${activeRelics.length}`;
        }

        if (this.relicContainer) {
            this.relicContainer.removeAllChildren();
            
            activeRelics.forEach(relic => {
                this.createRelicItem(relic);
            });
        }
    }

    private createRelicItem(relic: Relic): void {
        if (!this.relicContainer) return;

        const relicNode = new Node(`Relic_${relic.id}`);
        const label = relicNode.addComponent(Label);
        
        label.string = relic.name;
        label.fontSize = 16;
        label.lineHeight = 18;
        
        this.relicContainer.addChild(relicNode);
    }

    public showRelicAcquired(relic: Relic): void {
        console.log(`🎯 New Relic Acquired: ${relic.name} - ${relic.description}`);
    }
}