System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, Vec2, PhysicsMaterial, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, Ball;

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
      PhysicsMaterial = _cc.PhysicsMaterial;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ba31691v+lEpIX5npg55beq", "Ball", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Vec2', 'PhysicsMaterial']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Ball", Ball = (_dec = ccclass('Ball'), _dec(_class = (_class2 = class Ball extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "initialSpeed", _descriptor, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor2, this);

          this._rigidBody = null;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D);

          if (this._rigidBody) {
            var physicsMaterial = new PhysicsMaterial();
            physicsMaterial.friction = 0.0;
            physicsMaterial.restitution = 1.0;
            var colliders = this.node.getComponents('cc.Collider2D');
            colliders.forEach(collider => {
              collider.material = physicsMaterial;
            });
          }
        }

        start() {
          this.launch();
        }

        launch() {
          if (!this._rigidBody) return;
          var angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
          var velocity = new Vec2(Math.cos(angle) * this.initialSpeed, Math.sin(angle) * this.initialSpeed);
          this._rigidBody.linearVelocity = velocity;
        }

        resetBall() {
          if (!this._rigidBody) return;
          this.node.setPosition(0, 0, 0);
          this._rigidBody.linearVelocity = new Vec2(0, 0);
          this.scheduleOnce(() => this.launch(), 1.0);
        }

        update() {
          if (!this._rigidBody) return;
          var velocity = this._rigidBody.linearVelocity;
          var speed = velocity.length();

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
        initializer: function initializer() {
          return 400;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 600;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8327df90437bd567230e0bf6a4a96cc297c41410.js.map