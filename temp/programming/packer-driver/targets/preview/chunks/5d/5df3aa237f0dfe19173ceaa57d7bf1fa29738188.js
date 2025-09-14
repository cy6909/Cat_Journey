System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, Vec3, UITransform, Canvas, Collider2D, Contact2DType, Color, Sprite, Label, tween, GameManager, CoreController, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, EnhancedPaddleController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCoreController(extras) {
    _reporterNs.report("CoreController", "./CoreController", _context.meta, extras);
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
      input = _cc.input;
      Input = _cc.Input;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      Canvas = _cc.Canvas;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      Label = _cc.Label;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      CoreController = _unresolved_3.CoreController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "edadbH+JDBPm5gXX41/4PyE", "EnhancedPaddleController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'EventTouch', 'Vec3', 'UITransform', 'Canvas', 'Camera', 'Vec2', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Color', 'Sprite', 'Label', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EnhancedPaddleController", EnhancedPaddleController = (_dec = ccclass('EnhancedPaddleController'), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = class EnhancedPaddleController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "maxDurability", _descriptor2, this);

          _initializerDefineProperty(this, "durabilityLossPerHit", _descriptor3, this);

          _initializerDefineProperty(this, "repairRate", _descriptor4, this);

          // Durability per second repair when not taking damage
          _initializerDefineProperty(this, "repairDelay", _descriptor5, this);

          // Seconds after damage before repair starts
          _initializerDefineProperty(this, "criticalDurabilityThreshold", _descriptor6, this);

          // When paddle becomes "critical"
          _initializerDefineProperty(this, "durabilityLabel", _descriptor7, this);

          this._canvasComponent = null;
          this._uiTransform = null;
          this._camera = null;
          this._sprite = null;
          // Durability system
          this._currentDurability = 0;
          this._lastDamageTime = 0;
          this._isRepairing = false;
          this._originalColor = new Color(255, 255, 255, 255);
          this._level = 1;
          this._experience = 0;
          this._experienceToNextLevel = 100;
          // Enhanced stats per level
          this._speedMultiplier = 1.0;
          this._durabilityMultiplier = 1.0;
          this._repairEfficiency = 1.0;
        }

        onLoad() {
          var _this$node$parent, _this$_canvasComponen;

          this._uiTransform = this.getComponent(UITransform);
          this._canvasComponent = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponent(Canvas)) || null;
          this._camera = ((_this$_canvasComponen = this._canvasComponent) == null ? void 0 : _this$_canvasComponen.cameraComponent) || null;
          this._sprite = this.getComponent(Sprite);
          this._currentDurability = this.maxDurability;

          if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
          }

          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        onEnable() {
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }

        update(dt) {
          this.updateRepair(dt);
          this.updateVisualState();
          this.updateDurabilityLabel();
          this._lastDamageTime += dt;
        }

        onTouchMove(event) {
          this.updatePaddlePosition(event.getLocation());
        }

        onMouseMove(event) {
          this.updatePaddlePosition(event.getLocation());
        }

        updatePaddlePosition(screenPos) {
          var _this$node$parent2, _this$_canvasComponen2;

          if (!this._camera || !this._uiTransform) return;

          var worldPos = this._camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));

          var localPos = ((_this$node$parent2 = this.node.parent) == null || (_this$node$parent2 = _this$node$parent2.getComponent(UITransform)) == null ? void 0 : _this$node$parent2.convertToNodeSpaceAR(worldPos)) || worldPos;
          var paddleHalfWidth = this._uiTransform.width / 2;
          var canvasWidth = ((_this$_canvasComponen2 = this._canvasComponent) == null || (_this$_canvasComponen2 = _this$_canvasComponen2.getComponent(UITransform)) == null ? void 0 : _this$_canvasComponen2.width) || 960;
          var leftBound = -canvasWidth / 2 + paddleHalfWidth;
          var rightBound = canvasWidth / 2 - paddleHalfWidth;
          var clampedX = Math.max(leftBound, Math.min(rightBound, localPos.x));
          this.node.setPosition(clampedX, this.node.position.y, this.node.position.z);
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          // Handle collision with ball - this damages the paddle
          if (otherCollider.tag === 1000) {
            // Ball tag
            this.takeDamage(this.durabilityLossPerHit);
          } // Handle collision with boss attacks or other damaging entities


          if (otherCollider.tag === 3000) {
            // Boss attack tag
            this.takeDamage(this.durabilityLossPerHit * 2); // Boss attacks do more damage
          } // Handle experience orb collection


          if (otherCollider.tag === 4000) {
            // Experience orb tag
            this.gainExperience(10);
            otherCollider.node.destroy();
          }
        }

        takeDamage(damage) {
          var actualDamage = Math.max(1, damage - this.getDamageReduction());
          this._currentDurability = Math.max(0, this._currentDurability - actualDamage);
          this._lastDamageTime = 0;
          this._isRepairing = false; // Visual feedback

          this.showDamageEffect(); // Check if paddle is destroyed

          if (this._currentDurability <= 0) {
            this.onPaddleDestroyed();
          }

          console.log("Paddle took " + actualDamage + " damage. Durability: " + this._currentDurability + "/" + this.maxDurability * this._durabilityMultiplier);
        }

        updateRepair(dt) {
          if (this._lastDamageTime >= this.repairDelay && this._currentDurability < this.maxDurability * this._durabilityMultiplier) {
            if (!this._isRepairing) {
              this._isRepairing = true;
              console.log('Paddle repair started');
            }

            this._currentDurability = Math.min(this.maxDurability * this._durabilityMultiplier, this._currentDurability + this.repairRate * this._repairEfficiency * dt);
          }
        }

        updateVisualState() {
          if (!this._sprite) return;
          var durabilityRatio = this._currentDurability / (this.maxDurability * this._durabilityMultiplier);

          if (durabilityRatio <= 0.25) {
            // Critical state - red and flashing
            this._sprite.color = Color.RED;

            if (!this.node.getComponent('CriticalFlash')) {
              this.addCriticalFlashEffect();
            }
          } else if (durabilityRatio <= 0.5) {
            // Warning state - orange
            this._sprite.color = Color.YELLOW;
          } else if (durabilityRatio <= 0.75) {
            // Slightly damaged - light yellow
            this._sprite.color = new Color(255, 255, 200, 255);
          } else {
            // Healthy state
            this._sprite.color = this._originalColor;
          }
        }

        addCriticalFlashEffect() {
          if (this._sprite && this._sprite.color) {
            tween(this._sprite).to(0.2, {
              color: Color.RED
            }).to(0.2, {
              color: Color.WHITE
            }).union().repeatForever().start();
          } // Tag to prevent multiple flash effects


          this.node.addComponent('CriticalFlash');
        }

        showDamageEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.1, {
            color: Color.WHITE
          }).to(0.1, {
            color: this._sprite.color
          }).start();
        }

        updateDurabilityLabel() {
          if (!this.durabilityLabel) return;
          var maxDur = Math.floor(this.maxDurability * this._durabilityMultiplier);
          var currentDur = Math.floor(this._currentDurability);
          this.durabilityLabel.string = "Paddle: " + currentDur + "/" + maxDur; // Color code the label

          var ratio = this._currentDurability / (this.maxDurability * this._durabilityMultiplier);

          if (ratio <= 0.25) {
            this.durabilityLabel.color = Color.RED;
          } else if (ratio <= 0.5) {
            this.durabilityLabel.color = Color.YELLOW;
          } else {
            this.durabilityLabel.color = Color.WHITE;
          }
        }

        gainExperience(xp) {
          this._experience += xp;
          console.log("Paddle gained " + xp + " XP. Total: " + this._experience + "/" + this._experienceToNextLevel);

          while (this._experience >= this._experienceToNextLevel) {
            this.levelUp();
          }
        }

        levelUp() {
          this._experience -= this._experienceToNextLevel;
          this._level++;
          this._experienceToNextLevel = Math.floor(this._experienceToNextLevel * 1.5); // Increase stats per level

          this._speedMultiplier += 0.1;
          this._durabilityMultiplier += 0.2;
          this._repairEfficiency += 0.15; // Heal paddle on level up

          this._currentDurability = Math.min(this.maxDurability * this._durabilityMultiplier, this._currentDurability + this.maxDurability * 0.5);
          console.log("Paddle leveled up to " + this._level + "! Stats increased.");
        }

        getDamageReduction() {
          // Higher level paddles have some damage reduction
          return Math.floor(this._level * 0.5);
        }

        onPaddleDestroyed() {
          var _this$node$parent3;

          console.log('Paddle destroyed! Core is now exposed.'); // Find and damage the core directly

          var coreController = (_this$node$parent3 = this.node.parent) == null ? void 0 : _this$node$parent3.getComponentInChildren(_crd && CoreController === void 0 ? (_reportPossibleCrUseOfCoreController({
            error: Error()
          }), CoreController) : CoreController);

          if (coreController) {
            // Core takes continuous damage when paddle is destroyed
            this.schedule(() => {
              coreController.takeDamage(5);
            }, 1.0); // Damage core every second
          } // Hide paddle but don't destroy node (core still needs to function)


          if (this._sprite) {
            this._sprite.color = Color.TRANSPARENT;
          } // Disable input


          this.enabled = false; // Notify GameManager

          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager && gameManager.onPaddleDestroyed) {
            gameManager.onPaddleDestroyed();
          }
        } // Public accessors


        get currentDurability() {
          return this._currentDurability;
        }

        get maxDurabilityValue() {
          return this.maxDurability * this._durabilityMultiplier;
        }

        get level() {
          return this._level;
        }

        get isDestroyed() {
          return this._currentDurability <= 0;
        } // Repair methods for external systems


        instantRepair(amount) {
          this._currentDurability = Math.min(this.maxDurability * this._durabilityMultiplier, this._currentDurability + amount);
          console.log("Paddle repaired for " + amount + " durability");
        }

        fullRepair() {
          this._currentDurability = this.maxDurability * this._durabilityMultiplier;
          console.log('Paddle fully repaired');
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 500;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxDurability", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "durabilityLossPerHit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "repairRate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "repairDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "criticalDurabilityThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 25;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "durabilityLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5df3aa237f0dfe19173ceaa57d7bf1fa29738188.js.map