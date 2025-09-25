System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, Vec2, Collider2D, Contact2DType, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Ball;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ba31691v+lEpIX5npg55beq", "Ball", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Vec2', 'Collider2D', 'IPhysics2DContact', 'Contact2DType']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Ball", Ball = (_dec = ccclass('Ball'), _dec(_class = (_class2 = class Ball extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "initialSpeed", _descriptor, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "minSpeed", _descriptor3, this);

          this._rigidBody = null;
          this.isMoving = false;
          this.fireEffectDuration = 0;
          this.iceEffectDuration = 0;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D);

          if (this._rigidBody) {
            // 注册碰撞事件
            const colliders = this.node.getComponents(Collider2D);
            colliders.forEach(collider => {
              collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }); // 设置刚体属性以实现无摩擦完美弹性碰撞
            // 注意：材质需要在编辑器中或者通过其他方式设置

            console.log('Ball initialized with collision detection');
          }
        }

        start() {
          // 不自动发射球，等待GameManager准备完成后手动调用launch()
          console.log('Ball ready, waiting for launch command');
        }

        launch(direction) {
          if (!this._rigidBody) return;
          let velocity;

          if (direction && (direction.x !== 0 || direction.y !== 0)) {
            // 使用指定方向
            const normalized = direction.normalize();
            velocity = new Vec2(normalized.x * this.initialSpeed, normalized.y * this.initialSpeed);
          } else {
            // 使用默认随机方向
            const angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
            velocity = new Vec2(Math.cos(angle) * this.initialSpeed, Math.sin(angle) * this.initialSpeed);
          }

          this._rigidBody.linearVelocity = velocity;
          this.isMoving = true;
          console.log(`Ball launched from position: (${this.node.position.x}, ${this.node.position.y})`);
          console.log(`Ball velocity: (${velocity.x}, ${velocity.y}), angle: ${Math.atan2(velocity.y, velocity.x) * 180 / Math.PI}°`);
        }

        launchWithDefaultDirection() {
          this.launch();
        }

        resetBall() {
          if (!this._rigidBody) return;
          this.node.setPosition(0, 0, 0);
          this._rigidBody.linearVelocity = new Vec2(0, 0);
          this.isMoving = false;
          this.scheduleOnce(() => this.launch(), 1.0);
        } // 特效系统方法


        applyFireEffect(duration) {
          if (typeof duration === 'number' && duration > 0) {
            this.fireEffectDuration = duration;
          }
        }

        applyIceEffect(duration) {
          if (typeof duration === 'number' && duration > 0) {
            this.iceEffectDuration = duration;
          }
        }

        hasFireEffect() {
          return this.fireEffectDuration > 0;
        }

        hasIceEffect() {
          return this.iceEffectDuration > 0;
        }

        getFireEffectDuration() {
          return this.fireEffectDuration;
        }

        getIceEffectDuration() {
          return this.iceEffectDuration;
        } // 碰撞处理方法 - 修复测试失败的核心问题


        onBeginContact(_selfCollider, otherCollider, _contact) {
          if (!otherCollider || !otherCollider.node) {
            return;
          }

          const otherNode = otherCollider.node;

          if (otherNode.name === 'Paddle' || otherNode.getComponent('PaddleController')) {
            this.onPaddleHit(otherNode);
          }
        }

        onPaddleHit(paddleNode) {
          if (!this._rigidBody || !paddleNode) return;
          const velocity = this._rigidBody.linearVelocity; // 修复测试失败的问题：确保球向上反弹

          if (velocity.y < 0) {
            velocity.y = Math.abs(velocity.y);
            this._rigidBody.linearVelocity = velocity;
          }
        }

        get velocity() {
          return this._rigidBody ? this._rigidBody.linearVelocity : new Vec2(0, 0);
        }

        set velocity(value) {
          if (this._rigidBody) {
            this._rigidBody.linearVelocity = value;
          }
        }

        update(deltaTime) {
          if (!this._rigidBody) return; // 更新特效持续时间

          const dt = deltaTime || 1 / 60;

          if (this.fireEffectDuration > 0) {
            this.fireEffectDuration -= dt;

            if (this.fireEffectDuration < 0) {
              this.fireEffectDuration = 0;
            }
          }

          if (this.iceEffectDuration > 0) {
            this.iceEffectDuration -= dt;

            if (this.iceEffectDuration < 0) {
              this.iceEffectDuration = 0;
            }
          } // 速度控制


          const velocity = this._rigidBody.linearVelocity;
          const speed = velocity.length();

          if (speed > this.maxSpeed) {
            velocity.normalize();
            velocity.multiplyScalar(this.maxSpeed);
            this._rigidBody.linearVelocity = velocity;
          } else if (speed < this.initialSpeed * 0.8) {
            velocity.normalize();
            velocity.multiplyScalar(this.initialSpeed);
            this._rigidBody.linearVelocity = velocity;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "initialSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 400;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 600;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8327df90437bd567230e0bf6a4a96cc297c41410.js.map