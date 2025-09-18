/**
 * Cocos Creator 3.x 完整模拟系统
 * 提供测试环境所需的所有核心类和组件
 */

// 基础数学类
export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static get ZERO(): Vec3 {
        return new Vec3(0, 0, 0);
    }

    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    equals(other: Vec3): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    normalize(): Vec3 {
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (length > 0) {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        }
        return this;
    }

    multiplyScalar(scalar: number): Vec3 {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}

export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

// 节点系统
export class Node {
    public name: string;
    public active: boolean = true;
    public parent: Node | null = null;
    public children: Node[] = [];
    public uuid: string;
    public isValid: boolean = true;
    
    private _position: Vec3 = new Vec3();
    private _scale: Vec3 = new Vec3(1, 1, 1);
    private _components: Map<string, Component> = new Map();

    constructor(name: string = 'Node') {
        this.name = name;
        this.uuid = 'mock-uuid-' + Math.random().toString(36).substr(2, 9);
    }

    getPosition(): Vec3 {
        return this._position.clone();
    }

    setPosition(x: number | Vec3, y?: number, z?: number): void {
        if (typeof x === 'number') {
            this._position.x = x;
            this._position.y = y || 0;
            this._position.z = z || 0;
        } else {
            this._position = x.clone();
        }
    }

    get scale(): Vec3 {
        return this._scale.clone();
    }

    set scale(value: Vec3) {
        this._scale = value.clone();
    }

    addChild(child: Node): void {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        this.children.push(child);
    }

    removeChild(child: Node): void {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }

    removeAllChildren(): void {
        this.children.forEach(child => {
            child.parent = null;
        });
        this.children = [];
    }

    addComponent<T extends Component>(constructor: any): T {
        const component = new constructor();
        component.node = this;
        const typeName = constructor.name || 'Component';
        this._components.set(typeName, component);
        
        // 调用组件生命周期
        if (component.onLoad) {
            component.onLoad();
        }
        
        return component as T;
    }

    getComponent<T extends Component>(constructor: any): T | null {
        const typeName = typeof constructor === 'string' ? constructor : constructor.name;
        return this._components.get(typeName) as T || null;
    }

    destroy(): void {
        this.isValid = false;
        this._components.forEach(component => {
            if (component.onDestroy) {
                component.onDestroy();
            }
        });
        this._components.clear();
        
        if (this.parent) {
            this.parent.removeChild(this);
        }
        
        this.children.forEach(child => child.destroy());
        this.children = [];
    }

    destroyAllComponents(): void {
        this._components.forEach(component => {
            if (component.onDestroy) {
                component.onDestroy();
            }
        });
        this._components.clear();
    }
}

// 组件基类
export class Component {
    public node: Node | null = null;
    public enabled: boolean = true;

    protected onLoad?(): void;
    protected onDestroy?(): void;
    protected start?(): void;
    protected update?(deltaTime: number): void;

    scheduleOnce(callback: Function, delay: number): void {
        setTimeout(callback, delay * 1000);
    }

    schedule(callback: Function, interval: number, repeat?: number): void {
        let count = 0;
        const maxRepeat = repeat || Infinity;
        
        const intervalId = setInterval(() => {
            if (count >= maxRepeat) {
                clearInterval(intervalId);
                return;
            }
            callback();
            count++;
        }, interval * 1000);
    }
}

// 物理系统模拟
export class RigidBody2D extends Component {
    public linearVelocity: Vec3 = new Vec3();
    public body: any = {
        SetLinearVelocity: jest.fn(),
        GetLinearVelocity: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        SetTransform: jest.fn(),
        GetTransform: jest.fn()
    };

    setLinearVelocity(velocity: Vec3): void {
        this.linearVelocity = velocity.clone();
        this.body.SetLinearVelocity(velocity);
    }

    getLinearVelocity(): Vec3 {
        return this.linearVelocity.clone();
    }
}

export class Collider2D extends Component {
    public isTrigger: boolean = false;
}

export enum Contact2DType {
    BEGIN_CONTACT = 0,
    END_CONTACT = 1,
    PRE_SOLVE = 2,
    POST_SOLVE = 3
}

// UI组件
export class UITransform extends Component {
    private _contentSize: Vec3 = new Vec3(100, 100, 0);

    setContentSize(width: number, height: number): void {
        this._contentSize.x = width;
        this._contentSize.y = height;
    }

    getContentSize(): Vec3 {
        return this._contentSize.clone();
    }
}

export class Sprite extends Component {
    public spriteFrame: SpriteFrame | null = null;
    public color: Color = new Color();
}

export class SpriteFrame {
    public texture: Texture2D | null = null;
}

export class Texture2D {
    initWithElement(element: any): void {
        // Mock implementation
    }
}

// 粒子系统
export class ParticleSystem2D extends Component {
    public totalParticles: number = 100;
    public duration: number = 1.0;
    public emissionRate: number = 50;
    public startColor: Color = new Color();
    public endColor: Color = new Color();
    public startSize: number = 10;
    public endSize: number = 5;
    public speed: number = 100;
    public speedVar: number = 30;
    public gravity: Vec3 = new Vec3();
    public positionType: number = 0;

    static PositionType = {
        FREE: 0,
        RELATIVE: 1,
        GROUPED: 2
    };

    resetSystem(): void {
        // Mock implementation
    }

    stopSystem(): void {
        // Mock implementation
    }
}

// 音频系统
export class AudioSource extends Component {
    public clip: AudioClip | null = null;
    public volume: number = 1.0;
    public loop: boolean = false;
    public playOnAwake: boolean = false;

    play(): void {
        // Mock implementation
    }

    stop(): void {
        // Mock implementation
    }

    pause(): void {
        // Mock implementation
    }
}

export class AudioClip {
    public duration: number = 1.0;
    public name: string = 'MockAudioClip';
}

// 输入系统
export class Touch {
    getLocationX(): number {
        return 0;
    }

    getLocationY(): number {
        return 0;
    }
}

export class EventTouch {
    getTouches(): Touch[] {
        return [];
    }
}

// 输入管理
export const input = {
    on: jest.fn(),
    off: jest.fn(),
    Input: {
        EventType: {
            TOUCH_START: 'touch-start',
            TOUCH_MOVE: 'touch-move',
            TOUCH_END: 'touch-end',
            TOUCH_CANCEL: 'touch-cancel'
        }
    }
};

export const Input = input.Input;

// 导演系统
export const director = {
    addPersistRootNode: jest.fn(),
    removePersistRootNode: jest.fn(),
    getScene: jest.fn(),
    loadScene: jest.fn()
};

// 系统模块
export const sys = {
    localStorage: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    },
    platform: 'WECHAT_GAME'
};

// 实例化函数
export function instantiate(prefab: any): Node {
    if (!prefab) return new Node('Instantiated');
    
    // 简单克隆prefab
    const node = new Node(prefab.name || 'Instantiated');
    return node;
}

// Tween系统
export const tween = (target: any) => ({
    to: jest.fn().mockReturnThis(),
    parallel: jest.fn().mockReturnThis(),
    repeatForever: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    start: jest.fn().mockReturnThis()
});

// 数学工具
export const math = {
    Vec3,
    Color,
    randomRange: (min: number, max: number) => Math.random() * (max - min) + min,
    lerp: (a: number, b: number, t: number) => a + (b - a) * t
};

// 预制体
export class Prefab {
    public name: string = 'MockPrefab';
}

// 装饰器
export const _decorator = {
    ccclass: (name?: string) => (target: any) => target,
    property: (target: any, propertyKey: string) => {}
};

// 全局导出
export default {
    Vec3,
    Color,
    Node,
    Component,
    RigidBody2D,
    Collider2D,
    Contact2DType,
    UITransform,
    Sprite,
    SpriteFrame,
    Texture2D,
    ParticleSystem2D,
    AudioSource,
    AudioClip,
    Touch,
    EventTouch,
    input,
    Input,
    director,
    sys,
    instantiate,
    tween,
    math,
    Prefab,
    _decorator
};