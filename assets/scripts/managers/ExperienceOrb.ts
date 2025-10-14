import { _decorator, Component, Node, RigidBody2D, Vec3, Vec2, Collider2D, Contact2DType, IPhysics2DContact, find } from 'cc';
import { GameManager } from '../gameplay/GameManager';
import { ExperienceManager } from './ExperienceManager';

const { ccclass, property } = _decorator;

@ccclass('ExperienceOrb')
export class ExperienceOrb extends Component {
    @property
    public fallSpeed: number = 200.0;
    
    @property
    public experienceValue: number = 10;
    
    @property
    public lifeTime: number = 8.0; // Auto-destroy after 8 seconds
    
    @property
    public magnetRange: number = 150.0; // Range at which orb is attracted to paddle/core
    
    private _rigidBody: RigidBody2D | null = null;
    private _paddleNode: Node | null = null;
    private _coreNode: Node | null = null;
    private _isBeingAttracted: boolean = false;
    
    protected onLoad(): void {
        this._rigidBody = this.getComponent(RigidBody2D);
        
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        
        // Auto-destroy after lifetime expires
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, this.lifeTime);
    }
    
    protected start(): void {
        this.findTargets();
        this.setInitialVelocity();
    }
    
    protected update(dt: number): void {
        this.updateMagnetism(dt);
    }
    
    private findTargets(): void {
        // Find paddle and core nodes for magnetism
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            this._paddleNode = gameManager.getPaddleNode();
            this._coreNode = gameManager.getCoreController()?.node || null;
        }
    }
    
    private setInitialVelocity(): void {
        if (this._rigidBody) {
            // Start falling down with slight random horizontal movement
            const randomX = (Math.random() - 0.5) * 50;
            this._rigidBody.linearVelocity = new Vec2(randomX, -this.fallSpeed);
        }
    }
    
    private updateMagnetism(dt: number): void {
        if (this._isBeingAttracted) return;
        
        const currentPos = this.node.position;
        let closestTarget: Node | null = null;
        let closestDistance = Infinity;
        
        // Check distance to paddle
        if (this._paddleNode && this._paddleNode.isValid) {
            const paddleDistance = Vec3.distance(currentPos, this._paddleNode.position);
            if (paddleDistance < this.magnetRange && paddleDistance < closestDistance) {
                closestTarget = this._paddleNode;
                closestDistance = paddleDistance;
            }
        }
        
        // Check distance to core
        if (this._coreNode && this._coreNode.isValid) {
            const coreDistance = Vec3.distance(currentPos, this._coreNode.position);
            if (coreDistance < this.magnetRange && coreDistance < closestDistance) {
                closestTarget = this._coreNode;
                closestDistance = coreDistance;
            }
        }
        
        // Apply magnetism if target found
        if (closestTarget && this._rigidBody) {
            this._isBeingAttracted = true;
            this.attractToTarget(closestTarget);
        }
    }
    
    private attractToTarget(target: Node): void {
        if (!this._rigidBody) return;
        
        const currentPos = this.node.position;
        const targetPos = target.position;
        
        // Calculate direction to target
        const direction = new Vec3();
        Vec3.subtract(direction, targetPos, currentPos);
        direction.normalize();
        
        // Apply attraction force
        const attractionForce = 500; // Strong attraction
        const attractionVelocity = Vec3.multiplyScalar(new Vec3(), direction, attractionForce);
        this._rigidBody.linearVelocity = new Vec2(attractionVelocity.x, attractionVelocity.y);
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const otherNode = otherCollider.node;
        
        // Check if collected by paddle or core
        if (otherNode.name.includes('Paddle') || otherNode.name.includes('Core')) {
            this.onCollected();
        }
    }
    
    private onCollected(): void {
        // Add experience to ExperienceManager
        const expManager = ExperienceManager.getInstance();
        if (expManager) {
            expManager.addExperience(this.experienceValue);
        }

        this.showCollectionEffect();

        // Destroy the orb
        this.node.destroy();
    }
    
    private showCollectionEffect(): void {
        // Visual feedback for collection
        const sprite = this.getComponent('cc.Sprite');
        if (sprite) {
            // Quick flash before destruction
            (sprite as any).color = { r: 255, g: 255, b: 255, a: 255 };
        }

        // Could add particle effect or sound here
    }
    
    public getExperienceValue(): number {
        return this.experienceValue;
    }
    
    public setExperienceValue(value: number): void {
        this.experienceValue = value;
    }
}