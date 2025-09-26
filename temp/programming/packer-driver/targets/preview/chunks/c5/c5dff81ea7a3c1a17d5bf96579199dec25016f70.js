System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, instantiate, Vec3, PowerUp, PowerUpType, _dec, _class, _class2, _descriptor, _crd, ccclass, property, MultiBallPowerUp;

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
      instantiate = _cc.instantiate;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PowerUp = _unresolved_2.PowerUp;
      PowerUpType = _unresolved_2.PowerUpType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e98c9CNW3ZOxJ+py+t28QSw", "MultiBallPowerUp", undefined);

      __checkObsolete__(['_decorator', 'instantiate', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MultiBallPowerUp", MultiBallPowerUp = (_dec = ccclass('MultiBallPowerUp'), _dec(_class = (_class2 = class MultiBallPowerUp extends (_crd && PowerUp === void 0 ? (_reportPossibleCrUseOfPowerUp({
        error: Error()
      }), PowerUp) : PowerUp) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "extraBalls", _descriptor, this);
        }

        onLoad() {
          // Set power-up type before calling parent onLoad
          this.powerUpType = (_crd && PowerUpType === void 0 ? (_reportPossibleCrUseOfPowerUpType({
            error: Error()
          }), PowerUpType) : PowerUpType).MULTI_BALL;
          super.onLoad();
        }

        activateEffect() {
          var gameManager = this.getGameManager();
          if (!gameManager) return;
          var ballPrefab = gameManager.getBallPrefab();
          if (!ballPrefab) return;
          var currentBall = gameManager.getBallNode();
          if (!currentBall) return;
          var currentPos = currentBall.position;

          for (var i = 0; i < this.extraBalls; i++) {
            var newBall = instantiate(ballPrefab);
            var angle = Math.PI / 6 * (i - this.extraBalls / 2 + 0.5);
            var offset = new Vec3(Math.sin(angle) * 50, Math.cos(angle) * 50, 0);
            newBall.setPosition(currentPos.add(offset)); // Add to Canvas instead of GameManager for consistent coordinate system

            var canvas = gameManager.node.parent;

            if (canvas) {
              canvas.addChild(newBall);
            } else {
              gameManager.node.addChild(newBall);
            }

            var ballScript = newBall.getComponent('Ball');

            if (ballScript) {
              ballScript.launch();
            }
          }

          console.log("MultiBall activated! Added " + this.extraBalls + " extra balls.");
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "extraBalls", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c5dff81ea7a3c1a17d5bf96579199dec25016f70.js.map