System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Collider2D, Contact2DType, GameManager, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, CoreController;

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
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b6438S7c+VE55er3eEbLAhz", "CoreController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CoreController", CoreController = (_dec = ccclass('CoreController'), _dec(_class = (_class2 = class CoreController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "maxCoreHealth", _descriptor, this);

          _initializerDefineProperty(this, "regenRate", _descriptor2, this);

          // Health per second regeneration
          _initializerDefineProperty(this, "regenDelay", _descriptor3, this);

          // Seconds after damage before regen starts
          _initializerDefineProperty(this, "experienceCapacity", _descriptor4, this);

          // XP needed for core upgrade
          this._currentCoreHealth = 0;
          this._currentExperience = 0;
          this._coreLevel = 1;
          this._lastDamageTime = 0;
          this._isRegenerating = false;
        }

        onLoad() {
          this._currentCoreHealth = this.maxCoreHealth;
          const collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        update(dt) {
          this.updateRegeneration(dt);
          this._lastDamageTime += dt;
        }

        updateRegeneration(dt) {
          if (this._lastDamageTime >= this.regenDelay && this._currentCoreHealth < this.maxCoreHealth) {
            if (!this._isRegenerating) {
              this._isRegenerating = true;
              console.log('Core regeneration started');
            }

            this._currentCoreHealth = Math.min(this.maxCoreHealth, this._currentCoreHealth + this.regenRate * dt);
            this.updateHealthDisplay();
          } else {
            this._isRegenerating = false;
          }
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          const otherNode = otherCollider.node; // Ball hit core directly (missed paddle)

          if (otherNode.name.includes('Ball')) {
            const ballScript = otherNode.getComponent('Ball');
            const damage = ballScript ? ballScript.getDamage() : 1;
            this.takeDamage(damage, 'Ball impact');
          } // Experience orb collection


          if (otherNode.name.includes('ExperienceOrb')) {
            const xpValue = 10; // Could be configurable per orb type

            this.addExperience(xpValue);
            otherNode.destroy();
          } // Boss attack hit core


          if (otherNode.name.includes('BossAttack')) {
            const attackDamage = 2; // Boss attacks are stronger

            this.takeDamage(attackDamage, 'Boss attack');
            otherNode.destroy();
          }
        }

        takeDamage(damage, source = 'Unknown') {
          this._currentCoreHealth -= damage;
          this._lastDamageTime = 0; // Reset regen timer

          this._isRegenerating = false;
          console.log(`Core takes ${damage} damage from ${source}. Health: ${this._currentCoreHealth}/${this.maxCoreHealth}`);
          this.updateHealthDisplay();
          this.showDamageEffect();

          if (this._currentCoreHealth <= 0) {
            this.onCoreDestroyed();
          }
        }

        healCore(amount) {
          this._currentCoreHealth = Math.min(this.maxCoreHealth, this._currentCoreHealth + amount);
          console.log(`Core healed by ${amount}. Health: ${this._currentCoreHealth}/${this.maxCoreHealth}`);
          this.updateHealthDisplay();
        }

        addExperience(xp) {
          this._currentExperience += xp;
          console.log(`Core gains ${xp} XP. Total: ${this._currentExperience}/${this.experienceCapacity}`);

          if (this._currentExperience >= this.experienceCapacity) {
            this.levelUpCore();
          }
        }

        levelUpCore() {
          this._coreLevel++;
          this._currentExperience = 0; // Increase core stats on level up

          this.maxCoreHealth += 2;
          this._currentCoreHealth = this.maxCoreHealth; // Full heal on level up

          this.regenRate += 0.05;
          console.log(`Core leveled up! New level: ${this._coreLevel}`);
          console.log(`Core stats - Health: ${this.maxCoreHealth}, Regen: ${this.regenRate}/sec`);
          this.showLevelUpEffect();
          this.updateHealthDisplay();
        }

        onCoreDestroyed() {
          console.log('Core destroyed! Game Over!');
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            // Core destruction triggers game over
            gameManager.onCoreDestroyed();
          }

          this.showDestroyedEffect();
        }

        updateHealthDisplay() {
          // Update visual representation of core health
          const sprite = this.getComponent('cc.Sprite');

          if (sprite) {
            // Change color based on health percentage
            const healthPercent = this._currentCoreHealth / this.maxCoreHealth;

            if (healthPercent > 0.7) {
              sprite.color = {
                r: 100,
                g: 255,
                b: 100,
                a: 255
              }; // Green
            } else if (healthPercent > 0.3) {
              sprite.color = {
                r: 255,
                g: 255,
                b: 100,
                a: 255
              }; // Yellow
            } else {
              sprite.color = {
                r: 255,
                g: 100,
                b: 100,
                a: 255
              }; // Red
            } // Regeneration glow effect


            if (this._isRegenerating) {
              sprite.color = {
                r: 150,
                g: 255,
                b: 255,
                a: 255
              }; // Cyan glow
            }
          }
        }

        showDamageEffect() {
          // Flash effect when taking damage
          const sprite = this.getComponent('cc.Sprite');

          if (sprite) {
            const originalColor = sprite.color;
            sprite.color = {
              r: 255,
              g: 50,
              b: 50,
              a: 255
            };
            this.scheduleOnce(() => {
              sprite.color = originalColor;
            }, 0.2);
          }
        }

        showLevelUpEffect() {
          // Bright flash for level up
          const sprite = this.getComponent('cc.Sprite');

          if (sprite) {
            sprite.color = {
              r: 255,
              g: 255,
              b: 255,
              a: 255
            }; // Pulse effect

            for (let i = 0; i < 3; i++) {
              this.scheduleOnce(() => {
                sprite.color = {
                  r: 255,
                  g: 255,
                  b: 100,
                  a: 255
                };
              }, i * 0.2);
              this.scheduleOnce(() => {
                sprite.color = {
                  r: 255,
                  g: 255,
                  b: 255,
                  a: 255
                };
              }, i * 0.2 + 0.1);
            }
          }
        }

        showDestroyedEffect() {
          // Destruction effect - fade to dark
          const sprite = this.getComponent('cc.Sprite');

          if (sprite) {
            sprite.color = {
              r: 50,
              g: 50,
              b: 50,
              a: 255
            };
          }
        } // Public getters for UI and game logic


        getCurrentHealth() {
          return this._currentCoreHealth;
        }

        getMaxHealth() {
          return this.maxCoreHealth;
        }

        getCurrentExperience() {
          return this._currentExperience;
        }

        getExperienceCapacity() {
          return this.experienceCapacity;
        }

        getCoreLevel() {
          return this._coreLevel;
        }

        isRegenerating() {
          return this._isRegenerating;
        }

        getHealthPercent() {
          return this._currentCoreHealth / this.maxCoreHealth;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxCoreHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "regenRate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "regenDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "experienceCapacity", [property], {
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
//# sourceMappingURL=3d0b3f155ed57be7390cfdabc8ce592c75bc3e0e.js.map