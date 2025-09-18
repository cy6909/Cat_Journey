/**
 * Ball 组件模拟
 * 用于测试环境的简化Ball实现
 */

import { Component, Vec3, RigidBody2D } from 'cc';

export class Ball extends Component {
    public initialSpeed: number = 300;
    public maxSpeed: number = 800;
    public minSpeed: number = 100;
    public isMoving: boolean = false;
    
    private rigidBody: RigidBody2D | null = null;
    private fireEffectDuration: number = 0;
    private iceEffectDuration: number = 0;

    protected start(): void {
        this.rigidBody = this.node?.getComponent(RigidBody2D) || null;
    }

    protected update(deltaTime: number): void {
        if (this.fireEffectDuration > 0) {
            this.fireEffectDuration -= deltaTime;
            if (this.fireEffectDuration <= 0) {
                this.fireEffectDuration = 0;
            }
        }

        if (this.iceEffectDuration > 0) {
            this.iceEffectDuration -= deltaTime;
            if (this.iceEffectDuration <= 0) {
                this.iceEffectDuration = 0;
            }
        }

        // 速度限制
        if (this.rigidBody && this.isMoving) {
            const velocity = this.getVelocity();
            const speed = velocity.length();
            
            if (speed > this.maxSpeed) {
                const normalizedVelocity = velocity.normalize();
                normalizedVelocity.multiplyScalar(this.maxSpeed);
                this.setVelocity(normalizedVelocity);
            } else if (speed < this.minSpeed && speed > 0) {
                const normalizedVelocity = velocity.normalize();
                normalizedVelocity.multiplyScalar(this.minSpeed);
                this.setVelocity(normalizedVelocity);
            }
        }
    }

    public launch(direction: Vec3): void {
        if (!direction || direction.length() === 0) {
            return;
        }

        const normalizedDirection = direction.clone().normalize();
        normalizedDirection.multiplyScalar(this.initialSpeed);
        
        this.setVelocity(normalizedDirection);
        this.isMoving = true;
    }

    public launchWithDefaultDirection(): void {
        const defaultDirection = new Vec3(0.5, 1, 0).normalize();
        this.launch(defaultDirection);
    }

    public resetBall(): void {
        this.setVelocity(Vec3.ZERO);
        this.isMoving = false;
        
        // 重置到初始位置
        if (this.node) {
            this.node.setPosition(0, -150, 0);
        }
    }

    public setVelocity(velocity: Vec3): void {
        if (this.rigidBody) {
            this.rigidBody.linearVelocity = velocity.clone();
            if (this.rigidBody.body) {
                this.rigidBody.body.SetLinearVelocity(velocity);
            }
        }
    }

    public getVelocity(): Vec3 {
        if (this.rigidBody) {
            return this.rigidBody.linearVelocity.clone();
        }
        return Vec3.ZERO;
    }

    public applyFireEffect(duration: number): void {
        if (typeof duration === 'number' && duration > 0) {
            this.fireEffectDuration = duration;
        }
    }

    public applyIceEffect(duration: number): void {
        if (typeof duration === 'number' && duration > 0) {
            this.iceEffectDuration = duration;
        }
    }

    public hasFireEffect(): boolean {
        return this.fireEffectDuration > 0;
    }

    public hasIceEffect(): boolean {
        return this.iceEffectDuration > 0;
    }

    public getFireEffectDuration(): number {
        return this.fireEffectDuration;
    }

    public getIceEffectDuration(): number {
        return this.iceEffectDuration;
    }

    public onBeginContact(selfCollider: any, otherCollider: any, contact: any): void {
        if (!otherCollider || !otherCollider.node) {
            return;
        }

        const otherNode = otherCollider.node;
        
        // 处理挡板碰撞
        if (otherNode.getComponent('PaddleController')) {
            this.onPaddleHit(otherNode);
        }
        // 处理砖块碰撞
        else if (otherNode.getComponent('Brick')) {
            this.onBrickHit(otherNode);
        }
        // 处理墙壁碰撞
        else if (otherNode.name.includes('Wall')) {
            this.onWallHit(otherNode);
        }
        // 处理死亡区域碰撞
        else if (otherNode.getComponent('DeathZone')) {
            this.onDeathZoneHit(otherNode);
        }
    }

    private onPaddleHit(paddleNode: any): void {
        if (!paddleNode) return;
        
        const paddlePos = paddleNode.getPosition();
        const ballPos = this.node?.getPosition();
        
        if (ballPos && paddlePos) {
            // 计算击球角度
            const hitOffset = ballPos.x - paddlePos.x;
            const currentVelocity = this.getVelocity();
            
            // 调整X方向速度
            const newVelocity = currentVelocity.clone();
            newVelocity.x += hitOffset * 2;
            newVelocity.y = Math.abs(newVelocity.y); // 确保向上反弹
            
            this.setVelocity(newVelocity);
        }
    }

    private onBrickHit(brickNode: any): void {
        // 砖块碰撞处理
        console.log('Ball hit brick');
    }

    private onWallHit(wallNode: any): void {
        // 墙壁碰撞处理
        console.log('Ball hit wall');
    }

    private onDeathZoneHit(deathZoneNode: any): void {
        // 死亡区域碰撞处理
        this.isMoving = false;
        console.log('Ball hit death zone');
    }
}