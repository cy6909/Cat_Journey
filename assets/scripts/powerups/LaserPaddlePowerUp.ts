import { _decorator, Node, Prefab, instantiate, Vec3, input, Input, EventTouch } from 'cc';
import { PowerUp, PowerUpType } from './PowerUp';
const { ccclass, property } = _decorator;

@ccclass('LaserPaddlePowerUp')
export class LaserPaddlePowerUp extends PowerUp {
    @property(Prefab)
    public laserPrefab: Prefab | null = null;

    @property
    public laserDamage: number = 1;

    @property
    public fireRate: number = 0.5;

    private _paddleNode: Node | null = null;
    private _canFire: boolean = true;

    protected onLoad(): void {
        // Set power-up type before calling parent onLoad
        this.powerUpType = PowerUpType.LASER_PADDLE;
        super.onLoad();
    }

    protected activateEffect(): void {
        const gameManager = this.getGameManager();
        if (!gameManager) return;

        this._paddleNode = gameManager.getPaddleNode();
        if (!this._paddleNode) return;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);

        console.log('Laser Paddle activated! Touch/click to fire lasers.');
    }

    protected deactivateEffect(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);

        console.log('Laser Paddle deactivated.');
    }

    private onTouchStart(event: EventTouch): void {
        this.fireLaser();
    }

    private onMouseDown(event: any): void {
        this.fireLaser();
    }

    private fireLaser(): void {
        if (!this._canFire || !this._paddleNode || !this.laserPrefab) return;

        const laser = instantiate(this.laserPrefab);
        const paddlePos = this._paddleNode.position;
        laser.setPosition(paddlePos.x, paddlePos.y + 30, paddlePos.z);
        
        const gameManager = this.getGameManager();
        if (gameManager) {
            // Add to Canvas for consistent coordinate system
            const canvas = gameManager.node.parent;
            if (canvas) {
                canvas.addChild(laser);
            } else {
                gameManager.node.addChild(laser);
            }
        }

        const laserScript = laser.getComponent('Laser');
        if (laserScript) {
            (laserScript as any).setDamage(this.laserDamage);
        }

        this._canFire = false;
        this.scheduleOnce(() => {
            this._canFire = true;
        }, this.fireRate);
    }
}