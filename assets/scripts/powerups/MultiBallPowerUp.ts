import { _decorator, instantiate, Vec3 } from 'cc';
import { PowerUp } from './PowerUp';
const { ccclass, property } = _decorator;

@ccclass('MultiBallPowerUp')
export class MultiBallPowerUp extends PowerUp {
    @property
    public extraBalls: number = 2;

    protected activateEffect(): void {
        const gameManager = this.getGameManager();
        if (!gameManager) return;

        const ballPrefab = gameManager.getBallPrefab();
        if (!ballPrefab) return;

        const currentBall = gameManager.node.getChildByName('Ball');
        if (!currentBall) return;

        const currentPos = currentBall.position;
        
        for (let i = 0; i < this.extraBalls; i++) {
            const newBall = instantiate(ballPrefab);
            const angle = (Math.PI / 6) * (i - this.extraBalls / 2 + 0.5);
            const offset = new Vec3(
                Math.sin(angle) * 50,
                Math.cos(angle) * 50,
                0
            );
            
            newBall.setPosition(currentPos.add(offset));
            gameManager.node.addChild(newBall);

            const ballScript = newBall.getComponent('Ball');
            if (ballScript) {
                (ballScript as any).launch();
            }
        }

        console.log(`MultiBall activated! Added ${this.extraBalls} extra balls.`);
    }
}