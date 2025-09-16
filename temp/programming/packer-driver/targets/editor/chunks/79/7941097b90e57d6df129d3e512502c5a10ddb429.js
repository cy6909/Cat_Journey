System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Collider2D, Contact2DType, GameManager, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, BossController;

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

      _cclegacy._RF.push({}, "cb177WSSvJDZKpPFRzyRoaE", "BossController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BossController", BossController = (_dec = ccclass('BossController'), _dec(_class = (_class2 = class BossController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "maxHealth", _descriptor, this);

          _initializerDefineProperty(this, "attackDamage", _descriptor2, this);

          _initializerDefineProperty(this, "attackInterval", _descriptor3, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "scoreValue", _descriptor5, this);

          this._currentHealth = 0;
          this._lastAttackTime = 0;
          this._moveDirection = 1;
        }

        onLoad() {
          this._currentHealth = this.maxHealth;
          const collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        }

        start() {
          this.schedule(this.performAttack, this.attackInterval);
        }

        update(dt) {
          this.updateMovement(dt);
          this.updateAttackTimer(dt);
        }

        updateMovement(dt) {
          const currentPos = this.node.position;
          const newX = currentPos.x + this._moveDirection * this.moveSpeed * dt; // Bounce off screen edges

          if (newX > 400 || newX < -400) {
            this._moveDirection *= -1;
          }

          this.node.setPosition(newX, currentPos.y, currentPos.z);
        }

        updateAttackTimer(dt) {
          this._lastAttackTime += dt;
        }

        performAttack() {
          console.log(`Boss attacks! Dealing ${this.attackDamage} damage`);
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            // Boss attack causes core damage
            this.scheduleOnce(() => {
              gameManager.onCoreAttacked(this.attackDamage);
            }, 0.1);
          }
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          const otherNode = otherCollider.node; // Check if hit by ball

          if (otherNode.name.includes('Ball')) {
            const ballScript = otherNode.getComponent('Ball');
            const damage = ballScript ? ballScript.getDamage() : 1;
            this.takeDamage(damage);
          } // Check if hit by laser


          if (otherNode.name.includes('Laser')) {
            this.takeDamage(2);
            otherNode.destroy();
          }
        }

        takeDamage(damage) {
          this._currentHealth -= damage;
          console.log(`Boss takes ${damage} damage. Health: ${this._currentHealth}/${this.maxHealth}`);

          if (this._currentHealth <= 0) {
            this.onDestroyed();
          } else {
            // Visual feedback for damage
            this.showDamageEffect();
          }
        }

        showDamageEffect() {
          // Flash effect - change color briefly
          const sprite = this.getComponent('cc.Sprite');

          if (sprite) {
            sprite.color = {
              r: 255,
              g: 100,
              b: 100,
              a: 255
            };
            this.scheduleOnce(() => {
              sprite.color = {
                r: 255,
                g: 255,
                b: 255,
                a: 255
              };
            }, 0.1);
          }
        }

        onDestroyed() {
          console.log('Boss defeated!');
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            gameManager.onBossDefeated(this.scoreValue);
          } // Cleanup


          this.unschedule(this.performAttack);
          this.node.destroy();
        }

        getCurrentHealth() {
          return this._currentHealth;
        }

        getMaxHealth() {
          return this.maxHealth;
        }

        setHealth(health) {
          this.maxHealth = health;
          this._currentHealth = health;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "attackDamage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "attackInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scoreValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7941097b90e57d6df129d3e512502c5a10ddb429.js.map