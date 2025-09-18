/**
 * 测试环境设置文件 - 完整版
 * 配置Jest测试环境和全局Mock
 */

// Mock Cocos Creator classes and modules with enhanced functionality
global.cc = {
    Component: class Component {
        constructor() {
            this.node = null;
            this.enabled = true;
        }
        scheduleOnce(callback, delay) {
            setTimeout(callback, delay * 1000);
        }
        schedule(callback, interval, repeat = Infinity) {
            let count = 0;
            const id = setInterval(() => {
                if (count >= repeat) {
                    clearInterval(id);
                    return;
                }
                callback();
                count++;
            }, interval * 1000);
        }
    },
    
    Node: class Node {
        constructor(name = 'MockNode') {
            this.name = name;
            this.active = true;
            this.position = { x: 0, y: 0, z: 0 };
            this.scale = { x: 1, y: 1, z: 1 };
            this.children = [];
            this.parent = null;
            this.uuid = 'mock-' + Math.random().toString(36).substr(2, 9);
            this.isValid = true;
            this._components = new Map();
        }
        
        addChild(child) { 
            if (child.parent) {
                child.parent.removeChild(child);
            }
            this.children.push(child); 
            child.parent = this;
        }
        
        removeChild(child) { 
            const index = this.children.indexOf(child);
            if (index > -1) {
                this.children.splice(index, 1);
                child.parent = null;
            }
        }
        
        removeAllChildren() {
            this.children.forEach(child => {
                child.parent = null;
            });
            this.children = [];
        }
        
        getComponent(type) { 
            const typeName = typeof type === 'string' ? type : type.name;
            return this._components.get(typeName) || null;
        }
        
        addComponent(type) { 
            const component = typeof type === 'string' ? 
                new global.cc.Component() : 
                new type();
            component.node = this;
            
            const typeName = typeof type === 'string' ? type : type.name;
            this._components.set(typeName, component);
            
            if (component.onLoad) {
                component.onLoad();
            }
            return component;
        }
        
        setPosition(x, y, z) { 
            if (typeof x === 'object') {
                this.position = { x: x.x, y: x.y, z: x.z };
            } else {
                this.position = { x, y: y || 0, z: z || 0 }; 
            }
        }
        
        getPosition() {
            return new global.cc.Vec3(this.position.x, this.position.y, this.position.z);
        }
        
        destroy() { 
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
        
        destroyAllComponents() {
            this._components.forEach(component => {
                if (component.onDestroy) {
                    component.onDestroy();
                }
            });
            this._components.clear();
        }
    },
    
    Vec3: class Vec3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x; 
            this.y = y; 
            this.z = z;
        }
        
        static get ZERO() {
            return new global.cc.Vec3(0, 0, 0);
        }
        
        clone() { 
            return new global.cc.Vec3(this.x, this.y, this.z); 
        }
        
        equals(other) {
            return this.x === other.x && this.y === other.y && this.z === other.z;
        }
        
        normalize() {
            const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            if (length > 0) {
                this.x /= length;
                this.y /= length;
                this.z /= length;
            }
            return this;
        }
        
        multiplyScalar(scalar) { 
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
        }
        
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        
        lerp(target, t) {
            return new global.cc.Vec3(
                this.x + (target.x - this.x) * t,
                this.y + (target.y - this.y) * t,
                this.z + (target.z - this.z) * t
            );
        }
        
        subtract(other) {
            return new global.cc.Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
        }
    },
    
    Color: class Color {
        constructor(r = 255, g = 255, b = 255, a = 255) {
            this.r = r; this.g = g; this.b = b; this.a = a;
        }
        static WHITE = new global.cc.Color(255, 255, 255, 255);
        static BLACK = new global.cc.Color(0, 0, 0, 255);
        static RED = new global.cc.Color(255, 0, 0, 255);
        static GREEN = new global.cc.Color(0, 255, 0, 255);
        static BLUE = new global.cc.Color(0, 0, 255, 255);
        static GRAY = new global.cc.Color(128, 128, 128, 255);
    },
    
    RigidBody2D: class RigidBody2D extends global.cc.Component {
        constructor() {
            super();
            this.linearVelocity = new global.cc.Vec3();
            this.body = {
                SetLinearVelocity: jest.fn(),
                GetLinearVelocity: jest.fn().mockReturnValue({ x: 0, y: 0 }),
                SetTransform: jest.fn(),
                GetTransform: jest.fn()
            };
        }
    },
    
    Collider2D: class Collider2D extends global.cc.Component {
        constructor() {
            super();
            this.isTrigger = false;
        }
    },
    
    Contact2DType: {
        BEGIN_CONTACT: 0,
        END_CONTACT: 1,
        PRE_SOLVE: 2,
        POST_SOLVE: 3
    },
    
    Sprite: class Sprite extends global.cc.Component {
        constructor() {
            super();
            this.spriteFrame = null;
            this.color = new global.cc.Color();
        }
    },
    
    SpriteFrame: class SpriteFrame {
        constructor() {
            this.texture = null;
        }
    },
    
    Texture2D: class Texture2D {
        initWithElement(element) {}
    },
    
    UITransform: class UITransform extends global.cc.Component {
        constructor() {
            super();
            this.width = 100;
            this.height = 100;
        }
        setContentSize(width, height) {
            this.width = width;
            this.height = height;
        }
        getContentSize() {
            return new global.cc.Vec3(this.width, this.height, 0);
        }
    },
    
    AudioSource: class AudioSource extends global.cc.Component {
        constructor() {
            super();
            this.playing = false;
            this.volume = 1.0;
            this.pitch = 1.0;
            this.loop = false;
            this.clip = null;
        }
        play() { this.playing = true; }
        stop() { this.playing = false; }
        pause() { this.playing = false; }
    },
    
    AudioClip: class AudioClip {
        constructor() {
            this.duration = 1.0;
            this.name = 'MockAudioClip';
        }
    },
    
    ParticleSystem2D: class ParticleSystem2D extends global.cc.Component {
        constructor() {
            super();
            this.totalParticles = 100;
            this.duration = 1.0;
            this.emissionRate = 50;
            this.startColor = new global.cc.Color();
            this.endColor = new global.cc.Color();
            this.startSize = 10;
            this.endSize = 5;
            this.speed = 100;
            this.speedVar = 30;
            this.gravity = new global.cc.Vec3();
            this.positionType = 0;
        }
        
        static PositionType = {
            FREE: 0,
            RELATIVE: 1,
            GROUPED: 2
        };
        
        resetSystem() {}
        stopSystem() {}
    },
    
    Touch: class Touch {
        getLocationX() { return 0; }
        getLocationY() { return 0; }
    },
    
    EventTouch: class EventTouch {
        getTouches() { return []; }
    },
    
    input: {
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
    },
    
    Input: {
        EventType: {
            TOUCH_START: 'touch-start',
            TOUCH_MOVE: 'touch-move',
            TOUCH_END: 'touch-end',
            TOUCH_CANCEL: 'touch-cancel'
        }
    },
    
    director: {
        loadScene: jest.fn(),
        addPersistRootNode: jest.fn(),
        removePersistRootNode: jest.fn(),
        getScene: () => new global.cc.Node()
    },
    
    tween: (target) => ({
        to: jest.fn().mockReturnThis(),
        repeatForever: jest.fn().mockReturnThis(),
        parallel: jest.fn().mockReturnThis(),
        call: jest.fn().mockReturnThis(),
        start: jest.fn().mockReturnThis()
    }),
    
    resources: {
        load: jest.fn((path, type, callback) => {
            setTimeout(() => callback(null, new type()), 0);
        })
    },
    
    sys: {
        localStorage: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        },
        platform: 'WECHAT_GAME'
    },
    
    game: {
        canvas: {
            getContext: () => ({
                getParameter: () => 'MockRenderer'
            })
        }
    },
    
    instantiate: (prefab) => {
        if (!prefab) return new global.cc.Node();
        return new global.cc.Node(prefab.name || 'Instantiated');
    },
    
    Prefab: class Prefab {
        constructor() {
            this.name = 'MockPrefab';
        }
    },
    
    _decorator: {
        ccclass: (name) => (target) => target,
        property: (type) => (target, propertyKey) => {}
    }
};

// Export cc globally
global.cc.Vec3.ZERO = new global.cc.Vec3(0, 0, 0);

// Mock Math functions
global.Math.random = jest.fn(() => 0.5);

// Mock WeChat API
global.wx = {
    createRewardedVideoAd: jest.fn(() => ({
        onLoad: jest.fn(),
        onError: jest.fn(),
        onClose: jest.fn(),
        load: jest.fn(),
        show: jest.fn()
    })),
    requestPayment: jest.fn(),
    cloud: {
        database: () => ({
            collection: () => ({
                doc: () => ({
                    set: jest.fn().mockResolvedValue({}),
                    get: jest.fn().mockResolvedValue({ data: {} })
                })
            })
        })
    }
};

// Mock document for texture creation
global.document = {
    createElement: jest.fn((tagName) => {
        if (tagName === 'canvas') {
            return {
                width: 0,
                height: 0,
                getContext: jest.fn(() => ({
                    createRadialGradient: jest.fn(() => ({
                        addColorStop: jest.fn()
                    })),
                    fillStyle: '',
                    fillRect: jest.fn(),
                    strokeStyle: '',
                    lineWidth: 0,
                    beginPath: jest.fn(),
                    arc: jest.fn(),
                    stroke: jest.fn()
                }))
            };
        }
        return {};
    })
};

// Mock performance API
global.performance = {
    now: jest.fn(() => Date.now())
};

// Enhanced console for test debugging
global.console = {
    ...global.console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Test utilities
global.TestUtils = {
    waitFor: (condition, timeout = 1000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkCondition = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Timeout waiting for condition'));
                } else {
                    setTimeout(checkCondition, 10);
                }
            };
            checkCondition();
        });
    },
    
    advanceTime: (ms) => {
        jest.advanceTimersByTime(ms);
    },
    
    createMockFn: (returnValue) => {
        return jest.fn().mockReturnValue(returnValue);
    }
};

// Setup and teardown
beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllTimers();
});