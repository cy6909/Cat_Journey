System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Collider2D, Contact2DType, Sprite, Color, UITransform, Enum, GameManager, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, PowerUpType, PowerUp;

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
      Sprite = _cc.Sprite;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3cb63viDYBDDI17RKoWRS7d", "PowerUp", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Collider2D', 'Contact2DType', 'Sprite', 'Color', 'UITransform', 'Vec3', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PowerUpType", PowerUpType = /*#__PURE__*/function (PowerUpType) {
        PowerUpType[PowerUpType["MULTI_BALL"] = 0] = "MULTI_BALL";
        PowerUpType[PowerUpType["LASER_PADDLE"] = 1] = "LASER_PADDLE";
        PowerUpType[PowerUpType["LARGER_PADDLE"] = 2] = "LARGER_PADDLE";
        PowerUpType[PowerUpType["SMALLER_PADDLE"] = 3] = "SMALLER_PADDLE";
        PowerUpType[PowerUpType["FASTER_BALL"] = 4] = "FASTER_BALL";
        PowerUpType[PowerUpType["SLOWER_BALL"] = 5] = "SLOWER_BALL";
        return PowerUpType;
      }({}));

      _export("PowerUp", PowerUp = (_dec = ccclass('PowerUp'), _dec2 = property({
        type: Enum(PowerUpType)
      }), _dec(_class = (_class2 = class PowerUp extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "fallSpeed", _descriptor, this);

          _initializerDefineProperty(this, "duration", _descriptor2, this);

          _initializerDefineProperty(this, "powerUpType", _descriptor3, this);

          this._isCollected = false;
          this._sprite = null;
        }

        onLoad() {
          this._sprite = this.getComponent(Sprite); // Initialize programmatic visual appearance

          this.initializePowerUpVisual();
          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        start() {
          // 使用简单的位置移动代替物理速度，避免物理世界初始化问题
          console.log("PowerUp started, using position-based movement");
        }

        update(dt) {
          // 使用简单的位置更新实现掉落效果
          if (this.node && this.node.isValid) {
            var currentPos = this.node.position;
            var newY = currentPos.y - this.fallSpeed * dt;
            this.node.setPosition(currentPos.x, newY, currentPos.z); // 检查是否掉出屏幕底部

            if (newY < -500) {
              // 屏幕底部大约是-480
              this.node.destroy();
            }
          }
        }

        initializePhysics() {
          // 不再需要设置linearVelocity，使用位置更新
          console.log("PowerUp using position-based movement, no physics velocity needed");
        }
        /**
         * 程序化生成PowerUp视觉效果 - 简单几何形状方案
         * Following the discussion.md approach: simple geometric shapes instead of complex sprites
         */


        initializePowerUpVisual() {
          if (!this._sprite) return; // Set base size for all power-ups

          var transform = this.node.getComponent(UITransform);

          if (transform) {
            transform.setContentSize(32, 32); // Standard 32x32 size
          } // Generate geometric shape based on power-up type


          switch (this.powerUpType) {
            case PowerUpType.MULTI_BALL:
              // Yellow circle ⭐ - represents multiple balls
              this._sprite.color = new Color(255, 255, 0, 255); // Bright yellow
              // Note: Sprite shape determined by SpriteFrame, color makes it distinctive

              break;

            case PowerUpType.LASER_PADDLE:
              // Red rectangle 🔴 - represents laser weapon
              this._sprite.color = new Color(255, 0, 0, 255); // Bright red

              if (transform) {
                transform.setContentSize(40, 20); // Rectangle shape
              }

              break;

            case PowerUpType.LARGER_PADDLE:
              // Green plus/expand shape - represents paddle enlargement
              this._sprite.color = new Color(0, 255, 0, 255); // Bright green

              if (transform) {
                transform.setContentSize(36, 36); // Slightly larger
              }

              break;

            case PowerUpType.SMALLER_PADDLE:
              // Orange minus/contract shape - represents paddle shrinking (negative effect)
              this._sprite.color = new Color(255, 165, 0, 255); // Orange warning

              if (transform) {
                transform.setContentSize(24, 24); // Slightly smaller
              }

              break;

            case PowerUpType.FASTER_BALL:
              // Cyan arrow/speed lines - represents acceleration
              this._sprite.color = new Color(0, 255, 255, 255); // Cyan

              break;

            case PowerUpType.SLOWER_BALL:
              // Blue snail/slow effect - represents deceleration
              this._sprite.color = new Color(0, 100, 255, 255); // Blue

              break;
          }

          console.log("PowerUp visual initialized: Type " + PowerUpType[this.powerUpType] + ", Color: " + this._sprite.color.toString());
        }
        /**
         * Get power-up type name for debugging and UI display
         */


        getPowerUpTypeName() {
          return PowerUpType[this.powerUpType] || 'UNKNOWN';
        }
        /**
         * Get power-up description for player feedback
         */


        getPowerUpDescription() {
          switch (this.powerUpType) {
            case PowerUpType.MULTI_BALL:
              return "Spawns 2 additional balls";

            case PowerUpType.LASER_PADDLE:
              return "Paddle can shoot lasers for 10 seconds";

            case PowerUpType.LARGER_PADDLE:
              return "Paddle becomes larger";

            case PowerUpType.SMALLER_PADDLE:
              return "Paddle becomes smaller (negative effect)";

            case PowerUpType.FASTER_BALL:
              return "Ball moves faster";

            case PowerUpType.SLOWER_BALL:
              return "Ball moves slower";

            default:
              return "Unknown power-up effect";
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
          console.log("Collected power-up: " + this.getPowerUpTypeName() + " - " + this.getPowerUpDescription());
          this.activateEffect();

          if (this.duration > 0) {
            this.scheduleOnce(() => {
              this.deactivateEffect();
              console.log("Power-up expired: " + this.getPowerUpTypeName());
            }, this.duration);
          }

          this.node.destroy();
        }

        deactivateEffect() {// Default implementation - override in derived classes if needed
        }

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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "powerUpType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PowerUpType.MULTI_BALL;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=33ada407cc6cda21d992e6cca9d99297be9b070d.js.map