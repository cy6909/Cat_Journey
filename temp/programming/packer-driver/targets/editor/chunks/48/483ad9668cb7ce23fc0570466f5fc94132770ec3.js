System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Collider2D, Contact2DType, Color, Sprite, tween, Vec3, Prefab, instantiate, RigidBody2D, Vec2, Enum, GameManager, RelicManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, BrickType, EnhancedBrick;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRelicManager(extras) {
    _reporterNs.report("RelicManager", "../managers/RelicManager", _context.meta, extras);
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
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      RelicManager = _unresolved_3.RelicManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "acecfigFjRLxI/GlpYxn2YH", "EnhancedBrick", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Color', 'Sprite', 'tween', 'Vec3', 'Prefab', 'instantiate', 'RigidBody2D', 'Vec2', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BrickType", BrickType = /*#__PURE__*/function (BrickType) {
        BrickType[BrickType["NORMAL"] = 0] = "NORMAL";
        BrickType[BrickType["REINFORCED"] = 1] = "REINFORCED";
        BrickType[BrickType["EXPLOSIVE"] = 2] = "EXPLOSIVE";
        BrickType[BrickType["ELECTRIC"] = 3] = "ELECTRIC";
        BrickType[BrickType["EXPERIENCE"] = 4] = "EXPERIENCE";
        BrickType[BrickType["REGENERATING"] = 5] = "REGENERATING";
        BrickType[BrickType["PHASE"] = 6] = "PHASE";
        BrickType[BrickType["MAGNETIC"] = 7] = "MAGNETIC";
        BrickType[BrickType["REFLECTIVE"] = 8] = "REFLECTIVE";
        BrickType[BrickType["POISON"] = 9] = "POISON";
        BrickType[BrickType["ICE"] = 10] = "ICE";
        BrickType[BrickType["FIRE"] = 11] = "FIRE";
        BrickType[BrickType["SPLITTING"] = 12] = "SPLITTING";
        BrickType[BrickType["TELEPORT"] = 13] = "TELEPORT";
        BrickType[BrickType["SHIELD"] = 14] = "SHIELD";
        BrickType[BrickType["GRAVITY"] = 15] = "GRAVITY";
        BrickType[BrickType["TIME"] = 16] = "TIME";
        BrickType[BrickType["HEALING"] = 17] = "HEALING";
        BrickType[BrickType["CURSED"] = 18] = "CURSED";
        BrickType[BrickType["CRYSTAL"] = 19] = "CRYSTAL";
        BrickType[BrickType["RUBBER"] = 20] = "RUBBER";
        BrickType[BrickType["METAL"] = 21] = "METAL";
        BrickType[BrickType["VOID"] = 22] = "VOID";
        BrickType[BrickType["LIGHT"] = 23] = "LIGHT";
        BrickType[BrickType["DARK"] = 24] = "DARK";
        return BrickType;
      }({}));

      _export("EnhancedBrick", EnhancedBrick = (_dec = ccclass('EnhancedBrick'), _dec2 = property({
        type: Enum(BrickType)
      }), _dec3 = property({
        type: Prefab
      }), _dec(_class = (_class2 = class EnhancedBrick extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "brickType", _descriptor, this);

          _initializerDefineProperty(this, "health", _descriptor2, this);

          _initializerDefineProperty(this, "scoreValue", _descriptor3, this);

          _initializerDefineProperty(this, "experienceValue", _descriptor4, this);

          _initializerDefineProperty(this, "experienceOrbPrefab", _descriptor5, this);

          // Type-specific properties
          _initializerDefineProperty(this, "explosionRadius", _descriptor6, this);

          _initializerDefineProperty(this, "electricChainDistance", _descriptor7, this);

          _initializerDefineProperty(this, "magneticForce", _descriptor8, this);

          _initializerDefineProperty(this, "regenerationRate", _descriptor9, this);

          // Health per second
          _initializerDefineProperty(this, "phaseProbability", _descriptor10, this);

          // 30% chance to phase
          this._maxHealth = 0;
          this._sprite = null;
          this._originalColor = new Color();
          this._lastHitTime = 0;
          this._isElectric = false;
          this._isShielded = false;
          this._regenerationTimer = 0;
        }

        onLoad() {
          this._maxHealth = this.health;
          this._sprite = this.getComponent(Sprite);

          if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
          }

          const collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }

          this.initializeBrickType();
        }

        update(dt) {
          this._lastHitTime += dt; // Handle regenerating bricks

          if (this.brickType === BrickType.REGENERATING && this.health < this._maxHealth) {
            this._regenerationTimer += dt;

            if (this._regenerationTimer >= 1.0) {
              this.health = Math.min(this._maxHealth, this.health + this.regenerationRate);
              this.updateVisualState();
              this._regenerationTimer = 0;
            }
          } // Handle time-based effects


          this.updateTimeBasedEffects(dt);
        }

        initializeBrickType() {
          switch (this.brickType) {
            case BrickType.NORMAL:
              this.setBrickColor(Color.RED);
              break;

            case BrickType.REINFORCED:
              this.health = 3;
              this._maxHealth = 3;
              this.setBrickColor(Color.BLUE);
              this.scoreValue = 30;
              break;

            case BrickType.EXPLOSIVE:
              this.setBrickColor(Color.YELLOW);
              this.scoreValue = 25;
              break;

            case BrickType.ELECTRIC:
              this.setBrickColor(new Color(0, 255, 255)); // Cyan

              this.scoreValue = 20;
              break;

            case BrickType.EXPERIENCE:
              this.setBrickColor(Color.GREEN);
              this.experienceValue = 20;
              break;

            case BrickType.REGENERATING:
              this.health = 2;
              this._maxHealth = 2;
              this.setBrickColor(new Color(255, 0, 255)); // Magenta

              break;

            case BrickType.PHASE:
              this.setBrickColor(new Color(128, 128, 255)); // Light blue

              break;

            case BrickType.MAGNETIC:
              this.setBrickColor(new Color(128, 0, 128)); // Purple

              break;

            case BrickType.REFLECTIVE:
              this.setBrickColor(new Color(255, 215, 0)); // Gold

              this.scoreValue = 15;
              break;

            case BrickType.POISON:
              this.setBrickColor(new Color(128, 255, 0)); // Lime green

              this.scoreValue = 18;
              break;

            case BrickType.ICE:
              this.setBrickColor(new Color(200, 255, 255)); // Light cyan

              break;

            case BrickType.FIRE:
              this.setBrickColor(new Color(255, 100, 0)); // Orange

              break;

            case BrickType.SPLITTING:
              this.setBrickColor(new Color(255, 182, 193)); // Light pink

              this.scoreValue = 22;
              break;

            case BrickType.TELEPORT:
              this.setBrickColor(new Color(138, 43, 226)); // Blue violet

              this.scoreValue = 35;
              break;

            case BrickType.SHIELD:
              this.setBrickColor(new Color(192, 192, 192)); // Silver

              this.health = 2;
              this._maxHealth = 2;
              this.scoreValue = 40;
              break;

            case BrickType.GRAVITY:
              this.setBrickColor(new Color(75, 0, 130)); // Indigo

              this.scoreValue = 50;
              break;

            case BrickType.TIME:
              this.setBrickColor(new Color(255, 20, 147)); // Deep pink

              this.scoreValue = 45;
              break;

            case BrickType.HEALING:
              this.setBrickColor(new Color(144, 238, 144)); // Light green

              this.scoreValue = 12;
              break;

            case BrickType.CURSED:
              this.setBrickColor(new Color(128, 0, 0)); // Maroon

              this.scoreValue = 5;
              break;

            case BrickType.CRYSTAL:
              this.setBrickColor(new Color(230, 230, 250)); // Lavender

              this.scoreValue = 30;
              break;

            case BrickType.RUBBER:
              this.setBrickColor(new Color(255, 105, 180)); // Hot pink

              this.scoreValue = 8;
              break;

            case BrickType.METAL:
              this.health = 4;
              this._maxHealth = 4;
              this.setBrickColor(new Color(169, 169, 169)); // Dark gray

              this.scoreValue = 50;
              break;

            case BrickType.VOID:
              this.setBrickColor(new Color(25, 25, 112)); // Midnight blue

              this.scoreValue = 100;
              break;

            case BrickType.LIGHT:
              this.setBrickColor(new Color(255, 255, 224)); // Light yellow

              this.scoreValue = 15;
              break;

            case BrickType.DARK:
              this.setBrickColor(new Color(47, 79, 79)); // Dark slate gray

              this.scoreValue = 25;
              break;
          }
        }

        setBrickColor(color) {
          if (this._sprite) {
            this._sprite.color = color;
            this._originalColor = color.clone();
          }
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          console.log('🔥 Brick collision detected with:', otherCollider.node.name); // 调试日志
          // 检查是否是Ball - 兼容两种组件名称

          const ball = otherCollider.getComponent('Ball') || otherCollider.getComponent('EnhancedBall');

          if (!ball) {
            console.log('⚠️ Not a ball collision, skipping');
            return;
          }

          console.log('✅ Ball detected, processing collision'); // Handle phase bricks

          if (this.brickType === BrickType.PHASE && Math.random() < this.phaseProbability) {
            console.log('Ball phased through brick!');
            this.showPhaseEffect();
            return; // Ball passes through
          } // Handle shielded bricks


          if (this._isShielded) {
            console.log('Attack blocked by shield!');
            this.showShieldEffect();
            return;
          } // Apply brick-specific pre-hit effects


          this.applyPreHitEffects(ball, otherCollider); // Take damage

          this.takeDamage(1, otherCollider.node.getWorldPosition());
        }

        applyPreHitEffects(ball, ballCollider) {
          switch (this.brickType) {
            case BrickType.MAGNETIC:
              this.applyMagneticEffect(ballCollider);
              break;

            case BrickType.ICE:
              this.applyIceEffect(ball);
              break;

            case BrickType.FIRE:
              this.applyFireEffect(ball);
              break;

            case BrickType.GRAVITY:
              this.applyGravityEffect();
              break;

            case BrickType.TIME:
              this.applyTimeEffect();
              break;
          }
        }

        takeDamage(damage, impactPosition) {
          console.log(`🎯 Brick taking ${damage} damage. Health: ${this.health} -> ${this.health - damage}`);
          this.health -= damage;
          this._lastHitTime = 0;

          if (this.health <= 0) {
            console.log('💥 Brick health depleted, destroying...');
            this.onDestroyed(impactPosition);
          } else {
            console.log(`🔧 Brick damaged but not destroyed. Remaining health: ${this.health}`);
            this.showDamageEffect();
            this.updateVisualState();
          }
        }

        onDestroyed(impactPosition) {
          console.log('🧱 Brick destruction started');
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();
          const relicManager = (_crd && RelicManager === void 0 ? (_reportPossibleCrUseOfRelicManager({
            error: Error()
          }), RelicManager) : RelicManager).getInstance(); // Apply post-destruction effects before notifying GameManager

          this.applyDestructionEffects(impactPosition); // Check for explosive bricks relic

          if (relicManager && relicManager.hasRelic) {
            relicManager.hasRelic('ExplosiveBricks');
            this.explodeAdjacent(impactPosition);
          } // Notify GameManager (handles score, level completion, power-ups)


          const brickPosition = this.node.getWorldPosition();
          const dropsExperience = this.brickType === BrickType.EXPERIENCE || Math.random() < 0.3;

          if (gameManager) {
            console.log(`📈 Notifying GameManager: score=${this.scoreValue}, drops=${dropsExperience}`);
            gameManager.onBrickDestroyed(this.scoreValue, brickPosition, dropsExperience);
          } else {
            console.warn('⚠️ GameManager not found, cannot update score');
          } // Destroy the brick


          console.log('🗑️ Destroying brick node');
          this.node.destroy();
        }

        applyDestructionEffects(impactPosition) {
          switch (this.brickType) {
            case BrickType.EXPLOSIVE:
              this.createExplosion(impactPosition);
              break;

            case BrickType.ELECTRIC:
              this.triggerElectricChain();
              break;

            case BrickType.SPLITTING:
              this.createSplitBricks();
              break;

            case BrickType.TELEPORT:
              this.teleportBall();
              break;

            case BrickType.HEALING:
              this.healPaddle();
              break;

            case BrickType.CURSED:
              this.applyCurse();
              break;

            case BrickType.CRYSTAL:
              this.triggerCrystalChain();
              break;

            case BrickType.VOID:
              this.consumeBall();
              break;
          }
        }

        createExplosion(center) {
          var _this$node$parent;

          if (!center) center = this.node.getWorldPosition(); // Find all bricks within explosion radius

          const allBricks = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponentsInChildren(EnhancedBrick)) || [];

          for (const brick of allBricks) {
            if (brick === this) continue;
            const distance = Vec3.distance(center, brick.node.getWorldPosition());

            if (distance <= this.explosionRadius) {
              // Damage decreases with distance
              const damage = Math.max(1, Math.floor(3 * (1 - distance / this.explosionRadius)));
              brick.takeDamage(damage);
              brick.showExplosionEffect();
            }
          }

          console.log(`Explosion at ${center} with radius ${this.explosionRadius}`);
        }

        triggerElectricChain() {
          const nearbyBricks = this.findNearbyBricks(this.electricChainDistance);

          for (const brick of nearbyBricks) {
            if (brick.brickType === BrickType.ELECTRIC || brick._isElectric) {
              brick._isElectric = true;
              brick.takeDamage(1);
              brick.showElectricEffect();
            }
          }
        }

        applyMagneticEffect(ballCollider) {
          const ballRigidBody = ballCollider.getComponent(RigidBody2D);
          if (!ballRigidBody) return;
          const direction = Vec3.subtract(new Vec3(), this.node.getWorldPosition(), ballCollider.node.getWorldPosition()).normalize();
          const force = Vec2.multiplyScalar(new Vec2(), new Vec2(direction.x, direction.y), this.magneticForce);
          ballRigidBody.applyForceToCenter(force, true);
          console.log('Magnetic force applied to ball');
        }

        applyIceEffect(ball) {
          // Slow down the ball temporarily
          if (ball && ball.setSpeedMultiplier) {
            ball.setSpeedMultiplier(0.5, 3.0); // 50% speed for 3 seconds

            console.log('Ball slowed by ice brick');
          }
        }

        applyFireEffect(ball) {
          // Speed up the ball temporarily  
          if (ball && ball.setSpeedMultiplier) {
            ball.setSpeedMultiplier(1.5, 3.0); // 150% speed for 3 seconds

            console.log('Ball accelerated by fire brick');
          }
        }

        healPaddle() {
          var _this$node$parent2;

          const paddle = (_this$node$parent2 = this.node.parent) == null ? void 0 : _this$node$parent2.getComponentInChildren('EnhancedPaddleController');

          if (paddle && paddle.instantRepair) {
            paddle.instantRepair(25);
            console.log('Paddle healed by healing brick');
          }
        }

        dropExperienceOrb() {
          if (!this.experienceOrbPrefab) return;
          const orb = instantiate(this.experienceOrbPrefab);
          orb.setParent(this.node.parent);
          orb.setWorldPosition(this.node.getWorldPosition());
          console.log(`Dropped experience orb worth ${this.experienceValue} XP`);
        }

        findNearbyBricks(radius) {
          var _this$node$parent3;

          const allBricks = ((_this$node$parent3 = this.node.parent) == null ? void 0 : _this$node$parent3.getComponentsInChildren(EnhancedBrick)) || [];
          const nearby = [];

          for (const brick of allBricks) {
            if (brick === this) continue;
            const distance = Vec3.distance(this.node.getWorldPosition(), brick.node.getWorldPosition());

            if (distance <= radius) {
              nearby.push(brick);
            }
          }

          return nearby;
        }

        updateVisualState() {
          if (!this._sprite) return;
          const healthRatio = this.health / this._maxHealth;

          const currentColor = this._originalColor.clone(); // Darken based on damage


          currentColor.r = Math.floor(currentColor.r * healthRatio);
          currentColor.g = Math.floor(currentColor.g * healthRatio);
          currentColor.b = Math.floor(currentColor.b * healthRatio);
          this._sprite.color = currentColor;
        }

        updateTimeBasedEffects(dt) {
          // Add time-based visual effects for special bricks
          switch (this.brickType) {
            case BrickType.ELECTRIC:
              if (this._isElectric) {
                this.sparkleEffect(dt);
              }

              break;

            case BrickType.MAGNETIC:
              this.pulseEffect(dt);
              break;
          }
        } // Visual effect methods


        showDamageEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.1, {
            color: Color.WHITE
          }).to(0.1, {
            color: this._sprite.color
          }).start();
        }

        showPhaseEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.2, {
            color: Color.TRANSPARENT
          }).to(0.2, {
            color: this._originalColor
          }).start();
        }

        showExplosionEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.1, {
            color: Color.YELLOW
          }).to(0.1, {
            color: this._sprite.color
          }).start();
        }

        showElectricEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.05, {
            color: Color.WHITE
          }).to(0.05, {
            color: Color.CYAN
          }).to(0.05, {
            color: this._sprite.color
          }).start();
        }

        showShieldEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.1, {
            color: Color.BLUE
          }).to(0.1, {
            color: this._sprite.color
          }).start();
        }

        sparkleEffect(dt) {// Implement sparkling effect for electric bricks
        }

        pulseEffect(dt) {// Implement pulsing effect for magnetic bricks  
        } // Additional effect implementations would go here...


        createSplitBricks() {
          console.log('Brick split into smaller pieces');
        }

        teleportBall() {
          console.log('Ball teleported to random location');
        }

        applyCurse() {
          console.log('Curse applied to player');
        }

        triggerCrystalChain() {
          console.log('Crystal chain reaction triggered');
        }

        consumeBall() {
          console.log('Ball consumed by void brick');
        }

        applyGravityEffect() {
          console.log('Gravity modified');
        }

        applyTimeEffect() {
          console.log('Time flow modified');
        }

        explodeAdjacent(center) {
          // Implementation from original Brick.ts
          this.createExplosion(center);
        } // Public accessors


        get currentHealth() {
          return this.health;
        }

        get maxHealth() {
          return this._maxHealth;
        }

        get isDestroyed() {
          return this.health <= 0;
        } // Shield system


        setShielded(shielded) {
          this._isShielded = shielded;

          if (shielded && this._sprite) {
            this._sprite.color = new Color(this._sprite.color.r, this._sprite.color.g, this._sprite.color.b, 200);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "brickType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BrickType.NORMAL;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scoreValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "experienceValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "experienceOrbPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "explosionRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "electricChainDistance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 80;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "magneticForce", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 300;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "regenerationRate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "phaseProbability", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=483ad9668cb7ce23fc0570466f5fc94132770ec3.js.map