System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Prefab, instantiate, input, Input, PowerUp, PowerUpType, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, LaserPaddlePowerUp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPowerUp(extras) {
    _reporterNs.report("PowerUp", "./PowerUp", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPowerUpType(extras) {
    _reporterNs.report("PowerUpType", "./PowerUp", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      input = _cc.input;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      PowerUp = _unresolved_2.PowerUp;
      PowerUpType = _unresolved_2.PowerUpType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4ec15N+nPhL1p4zY7lcEXdJ", "LaserPaddlePowerUp", undefined);

      __checkObsolete__(['_decorator', 'Node', 'Prefab', 'instantiate', 'Vec3', 'input', 'Input', 'EventTouch']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LaserPaddlePowerUp", LaserPaddlePowerUp = (_dec = ccclass('LaserPaddlePowerUp'), _dec2 = property(Prefab), _dec(_class = (_class2 = class LaserPaddlePowerUp extends (_crd && PowerUp === void 0 ? (_reportPossibleCrUseOfPowerUp({
        error: Error()
      }), PowerUp) : PowerUp) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "laserPrefab", _descriptor, this);

          _initializerDefineProperty(this, "laserDamage", _descriptor2, this);

          _initializerDefineProperty(this, "fireRate", _descriptor3, this);

          this._paddleNode = null;
          this._canFire = true;
        }

        onLoad() {
          // Set power-up type before calling parent onLoad
          this.powerUpType = (_crd && PowerUpType === void 0 ? (_reportPossibleCrUseOfPowerUpType({
            error: Error()
          }), PowerUpType) : PowerUpType).LASER_PADDLE;
          super.onLoad();
        }

        activateEffect() {
          var gameManager = this.getGameManager();
          if (!gameManager) return;
          this._paddleNode = gameManager.getPaddleNode();
          if (!this._paddleNode) return;
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          console.log('Laser Paddle activated! Touch/click to fire lasers.');
        }

        deactivateEffect() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          console.log('Laser Paddle deactivated.');
        }

        onTouchStart(event) {
          this.fireLaser();
        }

        onMouseDown(event) {
          this.fireLaser();
        }

        fireLaser() {
          if (!this._canFire || !this._paddleNode || !this.laserPrefab) return;
          var laser = instantiate(this.laserPrefab);
          var paddlePos = this._paddleNode.position;
          laser.setPosition(paddlePos.x, paddlePos.y + 30, paddlePos.z);
          var gameManager = this.getGameManager();

          if (gameManager) {
            // Add to Canvas for consistent coordinate system
            var canvas = gameManager.node.parent;

            if (canvas) {
              canvas.addChild(laser);
            } else {
              gameManager.node.addChild(laser);
            }
          }

          var laserScript = laser.getComponent('Laser');

          if (laserScript) {
            laserScript.setDamage(this.laserDamage);
          }

          this._canFire = false;
          this.scheduleOnce(() => {
            this._canFire = true;
          }, this.fireRate);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "laserPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "laserDamage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "fireRate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3939819955d5bbabd76545e63290e4a6aadfb7b3.js.map