System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, PhysicsMaterial, Collider2D, Contact2DType, Vec3, Color, Sprite, Vec2, Enum, GameManager, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, BallType, EnhancedBall;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
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
      RigidBody2D = _cc.RigidBody2D;
      PhysicsMaterial = _cc.PhysicsMaterial;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      Vec2 = _cc.Vec2;
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5e6d2nrg9hJyKLzZFD65mxC", "EnhancedBall", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'PhysicsMaterial', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Vec3', 'Color', 'Sprite', 'tween', 'Vec2', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BallType", BallType = /*#__PURE__*/function (BallType) {
        BallType[BallType["NORMAL"] = 0] = "NORMAL";
        BallType[BallType["HEAVY"] = 1] = "HEAVY";
        BallType[BallType["SOFT"] = 2] = "SOFT";
        BallType[BallType["FIRE"] = 3] = "FIRE";
        BallType[BallType["ICE"] = 4] = "ICE";
        BallType[BallType["ELECTRIC"] = 5] = "ELECTRIC";
        BallType[BallType["POISON"] = 6] = "POISON";
        BallType[BallType["EXPLOSIVE"] = 7] = "EXPLOSIVE";
        BallType[BallType["PIERCING"] = 8] = "PIERCING";
        BallType[BallType["SPLITTING"] = 9] = "SPLITTING";
        BallType[BallType["MAGNETIC"] = 10] = "MAGNETIC";
        BallType[BallType["PHASE"] = 11] = "PHASE";
        BallType[BallType["GRAVITY"] = 12] = "GRAVITY";
        BallType[BallType["TIME"] = 13] = "TIME";
        BallType[BallType["HEALING"] = 14] = "HEALING";
        BallType[BallType["CURSED"] = 15] = "CURSED";
        BallType[BallType["LIGHT"] = 16] = "LIGHT";
        BallType[BallType["DARK"] = 17] = "DARK";
        BallType[BallType["CRYSTAL"] = 18] = "CRYSTAL";
        BallType[BallType["RUBBER"] = 19] = "RUBBER";
        BallType[BallType["METAL"] = 20] = "METAL";
        BallType[BallType["VOID"] = 21] = "VOID";
        BallType[BallType["PLASMA"] = 22] = "PLASMA";
        BallType[BallType["QUANTUM"] = 23] = "QUANTUM";
        BallType[BallType["CHAOS"] = 24] = "CHAOS";
        return BallType;
      }({}));

      _export("EnhancedBall", EnhancedBall = (_dec = ccclass('EnhancedBall'), _dec2 = property({
        type: Enum(BallType)
      }), _dec(_class = (_class2 = class EnhancedBall extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "ballType", _descriptor, this);

          _initializerDefineProperty(this, "initialSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "damage", _descriptor3, this);

          _initializerDefineProperty(this, "weight", _descriptor4, this);

          // 影响物理行为
          _initializerDefineProperty(this, "bounciness", _descriptor5, this);

          // 反弹系数
          _initializerDefineProperty(this, "penetrationCount", _descriptor6, this);

          // 穿透次数
          _initializerDefineProperty(this, "effectDuration", _descriptor7, this);

          // 效果持续时间
          _initializerDefineProperty(this, "areaRadius", _descriptor8, this);

          // 范围效果半径
          this._rigidBody = null;
          this._collider = null;
          this._sprite = null;
          this._physicsMaterial = null;
          // Ball state
          this._currentSpeed = 0;
          this._targetSpeed = 0;
          this._speedMultiplier = 1.0;
          this._speedMultiplierTimer = 0;
          this._isElectric = false;
          this._isPoisonous = false;
          this._isPhasing = false;
          this._remainingPenetrations = 0;
          this._effectTimer = 0;
          // Visual effects
          this._originalColor = new Color();
          this._trailNodes = [];
          this._particleTimer = 0;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D);
          this._collider = this.getComponent(Collider2D);
          this._sprite = this.getComponent(Sprite);

          if (this._sprite) {
            this._originalColor = this._sprite.color.clone();
          }

          this.initializeBallType();
          this.setupPhysics();
          this.setupCollisionHandling();
          this._targetSpeed = this.initialSpeed;
          this._currentSpeed = this.initialSpeed;
        }

        start() {
          this.launch();
        }

        update(dt) {
          this.maintainSpeed();
          this.updateEffects(dt);
          this.updateVisualEffects(dt);
          this.updateTimers(dt);
        }

        initializeBallType() {
          switch (this.ballType) {
            case BallType.NORMAL:
              this.setBallColor(Color.WHITE);
              break;

            case BallType.HEAVY:
              this.damage = 3;
              this.weight = 2.5;
              this.initialSpeed = 200; // Slower but powerful

              this.setBallColor(new Color(128, 128, 128)); // Dark gray

              break;

            case BallType.SOFT:
              this.damage = 1;
              this.weight = 0.5;
              this.bounciness = 1.5; // Extra bouncy

              this.setBallColor(new Color(255, 192, 203)); // Pink

              break;

            case BallType.FIRE:
              this.damage = 2;
              this.setBallColor(new Color(255, 100, 0)); // Orange-red

              this._effectTimer = this.effectDuration;
              break;

            case BallType.ICE:
              this.damage = 1;
              this.setBallColor(new Color(173, 216, 230)); // Light blue

              break;

            case BallType.ELECTRIC:
              this.damage = 1;
              this._isElectric = true;
              this.setBallColor(new Color(255, 255, 0)); // Yellow

              break;

            case BallType.POISON:
              this.damage = 1;
              this._isPoisonous = true;
              this.setBallColor(new Color(128, 0, 128)); // Purple

              break;

            case BallType.EXPLOSIVE:
              this.damage = 2;
              this.setBallColor(new Color(255, 0, 0)); // Red

              break;

            case BallType.PIERCING:
              this.damage = 1;
              this.penetrationCount = 3;
              this._remainingPenetrations = 3;
              this.setBallColor(new Color(0, 255, 255)); // Cyan

              break;

            case BallType.SPLITTING:
              this.damage = 1;
              this.setBallColor(new Color(255, 255, 255)); // White with sparkles

              break;

            case BallType.PHASE:
              this.damage = 1;
              this._isPhasing = true;
              this.setBallColor(new Color(128, 128, 255, 150)); // Semi-transparent blue

              break;

            case BallType.PLASMA:
              this.damage = 4;
              this.initialSpeed = 400;
              this.setBallColor(new Color(255, 0, 255)); // Magenta

              break;

            case BallType.QUANTUM:
              this.damage = 2;
              this.setBallColor(new Color(128, 255, 128)); // Light green

              break;

            case BallType.CHAOS:
              this.randomizeBallProperties();
              this.setBallColor(this.getRandomColor());
              break;
          }
        }

        setBallColor(color) {
          if (this._sprite) {
            this._sprite.color = color;
          }
        }

        setupPhysics() {
          if (!this._rigidBody || !this._collider) return; // Create physics material based on ball type

          this._physicsMaterial = new PhysicsMaterial();
          this._physicsMaterial.friction = 0.0;
          this._physicsMaterial.restitution = this.bounciness; // Breakout游戏不需要重力！

          this._rigidBody.gravityScale = 0; // 无重力

          this._rigidBody.linearDamping = 0; // 无阻尼

          this._rigidBody.angularDamping = 0; // 无角阻尼
          // Apply physics material (Cocos Creator handles this automatically)
        }

        setupCollisionHandling() {
          if (!this._collider) return;

          this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          // Handle phase balls
          if (this._isPhasing && Math.random() < 0.3) {
            console.log('Ball phased through object');
            this.showPhaseEffect();
            return;
          } // Apply ball-specific collision effects


          this.applyCollisionEffects(otherCollider); // Handle penetration

          if (this._remainingPenetrations > 0 && otherCollider.tag === 2000) {
            // Brick tag
            this._remainingPenetrations--;
            console.log("Ball penetrated! Remaining: " + this._remainingPenetrations);
            return; // Don't reflect, continue through
          } // Standard collision response


          this.onHitTarget(otherCollider);
        }

        applyCollisionEffects(otherCollider) {
          var position = otherCollider.node.getWorldPosition();

          switch (this.ballType) {
            case BallType.FIRE:
              this.applyFireEffect(otherCollider, position);
              break;

            case BallType.ICE:
              this.applyIceEffect(otherCollider, position);
              break;

            case BallType.ELECTRIC:
              this.applyElectricEffect(otherCollider, position);
              break;

            case BallType.POISON:
              this.applyPoisonEffect(otherCollider, position);
              break;

            case BallType.EXPLOSIVE:
              this.applyExplosiveEffect(position);
              break;

            case BallType.SPLITTING:
              this.applySplittingEffect();
              break;

            case BallType.HEALING:
              this.applyHealingEffect();
              break;

            case BallType.CURSED:
              this.applyCursedEffect();
              break;

            case BallType.CHAOS:
              this.applyRandomEffect(otherCollider, position);
              break;
          }
        }

        applyFireEffect(collider, position) {
          // Apply fire damage over time to nearby objects
          var nearbyObjects = this.findObjectsInRadius(position, this.areaRadius);

          for (var obj of nearbyObjects) {
            var brick = obj.getComponent('EnhancedBrick');

            if (brick && brick.takeDamage) {
              // Schedule fire damage over time
              this.scheduleFireDamage(brick, 3, 0.5); // 3 ticks, every 0.5s
            }
          }

          console.log('Fire effect applied');
        }

        applyIceEffect(collider, position) {
          // Slow down nearby balls and freeze bricks temporarily
          var nearbyObjects = this.findObjectsInRadius(position, this.areaRadius);

          for (var obj of nearbyObjects) {
            var ball = obj.getComponent('EnhancedBall');

            if (ball && ball !== this && ball.setSpeedMultiplier) {
              ball.setSpeedMultiplier(0.5, 3.0);
            }
          }

          console.log('Ice effect applied');
        }

        applyElectricEffect(collider, position) {
          // Chain lightning to nearby objects
          var nearbyObjects = this.findObjectsInRadius(position, this.areaRadius * 1.5);

          for (var obj of nearbyObjects) {
            var brick = obj.getComponent('EnhancedBrick');

            if (brick && brick.takeDamage) {
              brick.takeDamage(1);
              this.createLightningEffect(position, obj.getWorldPosition());
            }
          }

          console.log('Electric chain applied');
        }

        applyPoisonEffect(collider, position) {
          // Spread poison to nearby bricks
          var nearbyObjects = this.findObjectsInRadius(position, this.areaRadius);

          for (var obj of nearbyObjects) {
            var brick = obj.getComponent('EnhancedBrick');

            if (brick) {
              this.schedulePoisonDamage(brick, 5, 1.0); // 5 ticks, every 1s
            }
          }

          console.log('Poison spread');
        }

        applyExplosiveEffect(position) {
          // Create explosion damage
          var nearbyObjects = this.findObjectsInRadius(position, this.areaRadius * 2);

          for (var obj of nearbyObjects) {
            var distance = Vec3.distance(position, obj.getWorldPosition());
            var damage = Math.max(1, Math.floor(this.damage * 2 * (1 - distance / (this.areaRadius * 2))));
            var brick = obj.getComponent('EnhancedBrick');

            if (brick && brick.takeDamage) {
              brick.takeDamage(damage);
            }
          }

          this.createExplosionEffect(position);
          console.log('Explosion triggered');
        }

        applySplittingEffect() {
          // Create multiple smaller balls
          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager && gameManager.createSplitBall) {
            for (var i = 0; i < 3; i++) {
              gameManager.createSplitBall(this.node.getWorldPosition(), this.ballType);
            }
          }

          console.log('Ball split into multiple balls');
        }

        applyHealingEffect() {
          var _this$node$parent;

          // Heal the paddle
          var paddle = (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponentInChildren('EnhancedPaddleController');

          if (paddle && paddle.instantRepair) {
            paddle.instantRepair(15);
            console.log('Paddle healed by healing ball');
          }
        }

        applyCursedEffect() {
          // Apply random negative effect
          var effects = ['slow_paddle', 'damage_paddle', 'reverse_controls', 'reduce_score'];
          var effect = effects[Math.floor(Math.random() * effects.length)];
          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager && gameManager.applyCurse) {
            gameManager.applyCurse(effect, 10.0); // 10 second curse
          }

          console.log("Curse applied: " + effect);
        }

        applyRandomEffect(collider, position) {
          // Randomly apply one of many effects
          var effects = [() => this.applyFireEffect(collider, position), () => this.applyIceEffect(collider, position), () => this.applyElectricEffect(collider, position), () => this.applyExplosiveEffect(position), () => this.applySplittingEffect(), () => this.applyHealingEffect()];
          var randomEffect = effects[Math.floor(Math.random() * effects.length)];
          randomEffect(); // Change color to indicate new effect

          this.setBallColor(this.getRandomColor());
        }

        launch() {
          if (!this._rigidBody) return;
          var angle = Math.PI / 4; // 45 degrees

          var direction = new Vec2(Math.cos(angle), Math.sin(angle));
          var velocity = Vec2.multiplyScalar(new Vec2(), direction, this.initialSpeed);
          this._rigidBody.linearVelocity = velocity;
        }

        maintainSpeed() {
          if (!this._rigidBody) return;
          var currentVelocity = this._rigidBody.linearVelocity;
          var currentSpeed = currentVelocity.length();

          if (Math.abs(currentSpeed - this._targetSpeed * this._speedMultiplier) > 5) {
            var normalizedVelocity = currentVelocity.normalize();
            var newVelocity = Vec2.multiplyScalar(new Vec2(), normalizedVelocity, this._targetSpeed * this._speedMultiplier);
            this._rigidBody.linearVelocity = newVelocity;
          }
        }

        updateEffects(dt) {
          if (this._effectTimer > 0) {
            this._effectTimer -= dt;
          } // Update type-specific continuous effects


          switch (this.ballType) {
            case BallType.QUANTUM:
              this.updateQuantumEffect(dt);
              break;

            case BallType.PLASMA:
              this.updatePlasmaEffect(dt);
              break;
          }
        }

        updateVisualEffects(dt) {
          this._particleTimer += dt; // Create trail effects for special balls

          if (this._particleTimer >= 0.1) {
            this.createTrailEffect();
            this._particleTimer = 0;
          } // Update visual states


          this.updateGlowEffect(dt);
        }

        updateTimers(dt) {
          if (this._speedMultiplierTimer > 0) {
            this._speedMultiplierTimer -= dt;

            if (this._speedMultiplierTimer <= 0) {
              this._speedMultiplier = 1.0;
            }
          }
        } // Utility methods


        findObjectsInRadius(center, radius) {
          var _this$node$parent2;

          var allObjects = ((_this$node$parent2 = this.node.parent) == null ? void 0 : _this$node$parent2.children) || [];
          var nearby = [];

          for (var obj of allObjects) {
            var distance = Vec3.distance(center, obj.getWorldPosition());

            if (distance <= radius && obj !== this.node) {
              nearby.push(obj);
            }
          }

          return nearby;
        }

        randomizeBallProperties() {
          this.damage = Math.floor(Math.random() * 3) + 1;
          this.weight = Math.random() * 2 + 0.5;
          this.bounciness = Math.random() * 0.5 + 0.75;
          this.initialSpeed = Math.random() * 200 + 200;
        }

        getRandomColor() {
          return new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 255);
        } // Public methods


        setSpeedMultiplier(multiplier, duration) {
          this._speedMultiplier = multiplier;
          this._speedMultiplierTimer = duration;
        }

        getSpeed() {
          var _this$_rigidBody;

          return ((_this$_rigidBody = this._rigidBody) == null ? void 0 : _this$_rigidBody.linearVelocity.length()) || 0;
        }
        /**
         * 动态切换BallType - 用于验证25种球类型和颜色
         */


        changeBallType(newType) {
          console.log("\uD83D\uDD04 Changing ball type from " + BallType[this.ballType] + " to " + BallType[newType]); // 保存当前物理状态

          var currentVelocity = this._rigidBody ? this._rigidBody.linearVelocity.clone() : null;
          var isPhysicsEnabled = this._rigidBody ? this._rigidBody.enabled : false;
          this.ballType = newType;
          this.initializeBallType(); // 重新初始化颜色和属性
          // 恢复物理状态 - 防止切换时Ball穿透或物理失效

          if (this._rigidBody && currentVelocity && isPhysicsEnabled) {
            // 保持速度方向和大小，只更新Ball类型特有的属性
            this._rigidBody.linearVelocity = currentVelocity;
            console.log("\u2705 Ball physics state preserved after type change");
          }
        }
        /**
         * 循环切换到下一个BallType - 用于测试
         */


        cycleToNextBallType() {
          console.log('🔄 cycleToNextBallType called!');
          var allTypes = Object.values(BallType).filter(v => typeof v === 'number');
          console.log('All ball types:', allTypes);
          console.log('Current ball type:', this.ballType, BallType[this.ballType]);
          var currentIndex = allTypes.indexOf(this.ballType);
          console.log('Current index:', currentIndex);
          var nextIndex = (currentIndex + 1) % allTypes.length;
          console.log('Next index:', nextIndex, 'Next type:', BallType[allTypes[nextIndex]]);
          this.changeBallType(allTypes[nextIndex]);
        }

        get rigidBody() {
          return this._rigidBody;
        } // Effect scheduling methods


        scheduleFireDamage(target, ticks, interval) {
          if (ticks <= 0) return;
          this.scheduleOnce(() => {
            if (target && target.takeDamage) {
              target.takeDamage(1);
              this.scheduleFireDamage(target, ticks - 1, interval);
            }
          }, interval);
        }

        schedulePoisonDamage(target, ticks, interval) {
          if (ticks <= 0) return;
          this.scheduleOnce(() => {
            if (target && target.takeDamage) {
              target.takeDamage(1);
              this.schedulePoisonDamage(target, ticks - 1, interval);
            }
          }, interval);
        } // Visual effect methods  


        createTrailEffect() {
          console.log('Trail effect created');
        }

        updateGlowEffect(dt) {
          /* Implement glow effect */
        }

        createExplosionEffect(position) {
          console.log('Explosion visual effect');
        }

        createLightningEffect(from, to) {
          console.log('Lightning effect');
        }

        showPhaseEffect() {
          console.log('Phase visual effect');
        }

        updateQuantumEffect(dt) {
          console.log('Quantum effect update');
        }

        updatePlasmaEffect(dt) {
          console.log('Plasma effect update');
        }

        onHitTarget(collider) {
          console.log('Ball hit target');
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ballType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return BallType.NORMAL;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "initialSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "weight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bounciness", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "penetrationCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "effectDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "areaRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3514892ebdc56fa9baf613cbf48b23a056e0cffd.js.map