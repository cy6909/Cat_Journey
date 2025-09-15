System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Collider2D, Contact2DType, Sprite, Color, Vec3, GameManager, RelicManager, RelicType, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, Brick;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRelicManager(extras) {
    _reporterNs.report("RelicManager", "./RelicManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRelicType(extras) {
    _reporterNs.report("RelicType", "./RelicManager", _context.meta, extras);
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
      Sprite = _cc.Sprite;
      Color = _cc.Color;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      RelicManager = _unresolved_3.RelicManager;
      RelicType = _unresolved_3.RelicType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "74d23kcRIxOEor59MKYL9nB", "Brick", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Collider2D', 'IPhysics2DContact', 'Contact2DType', 'RigidBody2D', 'Sprite', 'Color', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Brick", Brick = (_dec = ccclass('Brick'), _dec(_class = (_class2 = class Brick extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "health", _descriptor, this);

          _initializerDefineProperty(this, "maxHealth", _descriptor2, this);

          _initializerDefineProperty(this, "scoreValue", _descriptor3, this);

          _initializerDefineProperty(this, "dropsExperience", _descriptor4, this);

          this._sprite = null;
          this._originalColor = new Color();
        }

        onLoad() {
          this._sprite = this.getComponent(Sprite);

          if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
          }

          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        onDestroy() {
          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          if (otherCollider.node.name === 'Ball' || otherCollider.getComponent('Ball')) {
            this.takeDamage(1);
          }
        }

        takeDamage(damage) {
          this.health -= damage;
          this.updateVisual();

          if (this.health <= 0) {
            this.destroyBrick();
          }
        }

        updateVisual() {
          if (!this._sprite) return;
          var healthRatio = this.health / this.maxHealth;

          var newColor = this._originalColor.clone();

          newColor.a = Math.max(0.3, healthRatio) * 255;
          this._sprite.color = newColor;
        }

        destroyBrick() {
          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            gameManager.onBrickDestroyed(this.scoreValue, this.node.position.clone(), this.dropsExperience);
          }

          var relicManager = (_crd && RelicManager === void 0 ? (_reportPossibleCrUseOfRelicManager({
            error: Error()
          }), RelicManager) : RelicManager).getInstance();

          if (relicManager && relicManager.hasRelic((_crd && RelicType === void 0 ? (_reportPossibleCrUseOfRelicType({
            error: Error()
          }), RelicType) : RelicType).EXPLOSIVE_BRICKS)) {
            this.explodeBrick();
          }

          this.node.destroy();
        }

        explodeBrick() {
          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();
          if (!gameManager || !gameManager.brickContainer) return;
          var explosionRadius = 100;
          var brickPosition = this.node.position;
          var bricks = gameManager.brickContainer.children;

          for (var brick of bricks) {
            if (brick === this.node) continue;
            var distance = Vec3.distance(brickPosition, brick.position);

            if (distance <= explosionRadius) {
              var brickScript = brick.getComponent('Brick');

              if (brickScript) {
                brickScript.takeDamage(1);
              }
            }
          }

          console.log("Explosive brick detonated! Damaged bricks within " + explosionRadius + " units.");
        }

        setHealth(health) {
          this.health = health;
          this.maxHealth = health;
          this.updateVisual();
        }

        setDropsExperience(drops) {
          this.dropsExperience = drops;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scoreValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "dropsExperience", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f8e6638115742017081af46bebdb2101262c852a.js.map