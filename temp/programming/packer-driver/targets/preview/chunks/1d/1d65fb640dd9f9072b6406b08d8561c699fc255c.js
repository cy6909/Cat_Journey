System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, Vec3, Vec2, Collider2D, Contact2DType, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, ExperienceOrb;

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
      Vec3 = _cc.Vec3;
      Vec2 = _cc.Vec2;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f1f1dhJWA9GYZ4McpDTfBhR", "ExperienceOrb", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Vec3', 'Vec2', 'Collider2D', 'Contact2DType', 'IPhysics2DContact']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ExperienceOrb", ExperienceOrb = (_dec = ccclass('ExperienceOrb'), _dec(_class = (_class2 = class ExperienceOrb extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "fallSpeed", _descriptor, this);

          _initializerDefineProperty(this, "experienceValue", _descriptor2, this);

          _initializerDefineProperty(this, "lifeTime", _descriptor3, this);

          // Auto-destroy after 8 seconds
          _initializerDefineProperty(this, "magnetRange", _descriptor4, this);

          // Range at which orb is attracted to paddle/core
          this._rigidBody = null;
          this._paddleNode = null;
          this._coreNode = null;
          this._isBeingAttracted = false;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D);
          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          } // Auto-destroy after lifetime expires


          this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
              this.node.destroy();
            }
          }, this.lifeTime);
        }

        start() {
          this.findTargets();
          this.setInitialVelocity();
        }

        update(dt) {
          this.updateMagnetism(dt);
        }

        findTargets() {
          // Find paddle and core nodes for magnetism
          var gameManager = require('./GameManager').GameManager.getInstance();

          if (gameManager) {
            this._paddleNode = gameManager._paddleNode;
            this._coreNode = gameManager.coreNode;
          }
        }

        setInitialVelocity() {
          if (this._rigidBody) {
            // Start falling down with slight random horizontal movement
            var randomX = (Math.random() - 0.5) * 50;
            this._rigidBody.linearVelocity = new Vec2(randomX, -this.fallSpeed);
          }
        }

        updateMagnetism(dt) {
          if (this._isBeingAttracted) return;
          var currentPos = this.node.position;
          var closestTarget = null;
          var closestDistance = Infinity; // Check distance to paddle

          if (this._paddleNode && this._paddleNode.isValid) {
            var paddleDistance = Vec3.distance(currentPos, this._paddleNode.position);

            if (paddleDistance < this.magnetRange && paddleDistance < closestDistance) {
              closestTarget = this._paddleNode;
              closestDistance = paddleDistance;
            }
          } // Check distance to core


          if (this._coreNode && this._coreNode.isValid) {
            var coreDistance = Vec3.distance(currentPos, this._coreNode.position);

            if (coreDistance < this.magnetRange && coreDistance < closestDistance) {
              closestTarget = this._coreNode;
              closestDistance = coreDistance;
            }
          } // Apply magnetism if target found


          if (closestTarget && this._rigidBody) {
            this._isBeingAttracted = true;
            this.attractToTarget(closestTarget);
          }
        }

        attractToTarget(target) {
          if (!this._rigidBody) return;
          var currentPos = this.node.position;
          var targetPos = target.position; // Calculate direction to target

          var direction = new Vec3();
          Vec3.subtract(direction, targetPos, currentPos);
          direction.normalize(); // Apply attraction force

          var attractionForce = 500; // Strong attraction

          var attractionVelocity = Vec3.multiplyScalar(new Vec3(), direction, attractionForce);
          this._rigidBody.linearVelocity = new Vec2(attractionVelocity.x, attractionVelocity.y);
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          var otherNode = otherCollider.node; // Check if collected by paddle or core

          if (otherNode.name.includes('Paddle') || otherNode.name.includes('Core')) {
            this.onCollected();
          }
        }

        onCollected() {
          console.log("Experience orb collected! Value: " + this.experienceValue); // Find core controller and add experience

          if (this._coreNode) {
            var coreController = this._coreNode.getComponent('CoreController');

            if (coreController) {
              coreController.addExperience(this.experienceValue);
            }
          }

          this.showCollectionEffect(); // Destroy the orb

          this.node.destroy();
        }

        showCollectionEffect() {
          // Visual feedback for collection
          var sprite = this.getComponent('cc.Sprite');

          if (sprite) {
            // Quick flash before destruction
            sprite.color = {
              r: 255,
              g: 255,
              b: 255,
              a: 255
            };
          } // Could add particle effect or sound here


          console.log('Experience orb collection effect played');
        }

        getExperienceValue() {
          return this.experienceValue;
        }

        setExperienceValue(value) {
          this.experienceValue = value;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "fallSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200.0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "experienceValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "lifeTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8.0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "magnetRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1d65fb640dd9f9072b6406b08d8561c699fc255c.js.map