System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Collider2D, Contact2DType, RigidBody2D, Vec2, GameManager, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, PowerUp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "../gameplay/GameManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3cb63viDYBDDI17RKoWRS7d", "PowerUp", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Collider2D', 'Contact2DType', 'RigidBody2D', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PowerUp", PowerUp = (_dec = ccclass('PowerUp'), _dec(_class = (_class2 = class PowerUp extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "fallSpeed", _descriptor, this);

          _initializerDefineProperty(this, "duration", _descriptor2, this);

          this._rigidBody = null;
          this._isCollected = false;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D);
          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }

          if (this._rigidBody) {
            this._rigidBody.linearVelocity = new Vec2(0, -this.fallSpeed);
          }
        }

        onDestroy() {
          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        onBeginContact(selfCollider, otherCollider) {
          if (this._isCollected) return;

          if (otherCollider.node.name === 'Paddle' || otherCollider.getComponent('PaddleController')) {
            this.collectPowerUp();
          } else if (otherCollider.getComponent('DeathZone')) {
            this.node.destroy();
          }
        }

        collectPowerUp() {
          if (this._isCollected) return;
          this._isCollected = true;
          this.activateEffect();

          if (this.duration > 0) {
            this.scheduleOnce(() => {
              this.deactivateEffect();
            }, this.duration);
          }

          this.node.destroy();
        }

        deactivateEffect() {}

        getGameManager() {
          return (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "fallSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "duration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4171d71a28c93706088634afc55346512d6f259b.js.map