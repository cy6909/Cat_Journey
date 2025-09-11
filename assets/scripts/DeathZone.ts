import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('DeathZone')
export class DeathZone extends Component {
    protected onLoad(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D): void {
        if (otherCollider.node.name === 'Ball' || otherCollider.getComponent('Ball')) {
            const gameManager = GameManager.getInstance();
            if (gameManager) {
                gameManager.onBallLost();
            }
        }
    }
}