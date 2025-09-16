System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, RigidBody2D, Collider2D, Contact2DType, Sprite, Color, tween, Prefab, instantiate, math, Vec2, Enum, GameManager, EnhancedBrick, BrickType, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, BossType, BossPhase, EnhancedBossController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnhancedBrick(extras) {
    _reporterNs.report("EnhancedBrick", "./EnhancedBrick", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBrickType(extras) {
    _reporterNs.report("BrickType", "./EnhancedBrick", _context.meta, extras);
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
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      RigidBody2D = _cc.RigidBody2D;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      Sprite = _cc.Sprite;
      Color = _cc.Color;
      tween = _cc.tween;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      math = _cc.math;
      Vec2 = _cc.Vec2;
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      EnhancedBrick = _unresolved_3.EnhancedBrick;
      BrickType = _unresolved_3.BrickType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "27557ZJ70FBvYGCwfhm4G8c", "EnhancedBossController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'RigidBody2D', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Sprite', 'Color', 'tween', 'Prefab', 'instantiate', 'math', 'Vec2', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BossType", BossType = /*#__PURE__*/function (BossType) {
        BossType[BossType["GUARDIAN_WALL"] = 0] = "GUARDIAN_WALL";
        BossType[BossType["STORM_CALLER"] = 1] = "STORM_CALLER";
        BossType[BossType["BRICK_SPAWNER"] = 2] = "BRICK_SPAWNER";
        BossType[BossType["GRAVITY_MASTER"] = 3] = "GRAVITY_MASTER";
        BossType[BossType["TIME_MANIPULATOR"] = 4] = "TIME_MANIPULATOR";
        BossType[BossType["SHIELD_GENERATOR"] = 5] = "SHIELD_GENERATOR";
        BossType[BossType["MULTI_PHASE"] = 6] = "MULTI_PHASE";
        BossType[BossType["TELEPORTER"] = 7] = "TELEPORTER";
        BossType[BossType["ELEMENTAL_CHAOS"] = 8] = "ELEMENTAL_CHAOS";
        BossType[BossType["MIRROR_BOSS"] = 9] = "MIRROR_BOSS";
        return BossType;
      }({}));

      _export("BossPhase", BossPhase = /*#__PURE__*/function (BossPhase) {
        BossPhase[BossPhase["PHASE_1"] = 0] = "PHASE_1";
        BossPhase[BossPhase["PHASE_2"] = 1] = "PHASE_2";
        BossPhase[BossPhase["PHASE_3"] = 2] = "PHASE_3";
        BossPhase[BossPhase["ENRAGED"] = 3] = "ENRAGED";
        return BossPhase;
      }({}));

      _export("EnhancedBossController", EnhancedBossController = (_dec = ccclass('EnhancedBossController'), _dec2 = property({
        type: Enum(BossType)
      }), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: Prefab
      }), _dec(_class = (_class2 = class EnhancedBossController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bossType", _descriptor, this);

          _initializerDefineProperty(this, "maxHealth", _descriptor2, this);

          _initializerDefineProperty(this, "attackPower", _descriptor3, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "chapter", _descriptor5, this);

          _initializerDefineProperty(this, "brickPrefab", _descriptor6, this);

          _initializerDefineProperty(this, "projectilePrefab", _descriptor7, this);

          // Boss state
          this._currentHealth = 0;
          this._currentPhase = BossPhase.PHASE_1;
          this._isAttacking = false;
          this._lastAttackTime = 0;
          this._attackCooldown = 3.0;
          this._phaseTransitionHealth = [0.75, 0.5, 0.25];
          // Components
          this._rigidBody = null;
          this._sprite = null;
          this._collider = null;
          // Boss-specific data
          this._attackPatterns = [];
          this._spawnedObjects = [];
          this._moveDirection = new Vec3(1, 0, 0);
          this._specialTimer = 0;
          this._enragedMode = false;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D);
          this._sprite = this.getComponent(Sprite);
          this._collider = this.getComponent(Collider2D);
          this._currentHealth = this.maxHealth;
          this.initializeBossType();
          this.setupCollisionHandling(); // Scale stats based on chapter

          this.scaleStatsForChapter();
        }

        start() {
          this.startBossBehavior();
        }

        update(dt) {
          this._lastAttackTime += dt;
          this._specialTimer += dt;
          this.updateMovement(dt);
          this.updateAttackPatterns(dt);
          this.updateSpecialBehavior(dt);
          this.checkPhaseTransitions();
        }

        initializeBossType() {
          switch (this.bossType) {
            case BossType.GUARDIAN_WALL:
              this.initializeGuardianWall();
              break;

            case BossType.STORM_CALLER:
              this.initializeStormCaller();
              break;

            case BossType.BRICK_SPAWNER:
              this.initializeBrickSpawner();
              break;

            case BossType.GRAVITY_MASTER:
              this.initializeGravityMaster();
              break;

            case BossType.TIME_MANIPULATOR:
              this.initializeTimeManipulator();
              break;

            case BossType.SHIELD_GENERATOR:
              this.initializeShieldGenerator();
              break;

            case BossType.MULTI_PHASE:
              this.initializeMultiPhase();
              break;

            case BossType.TELEPORTER:
              this.initializeTeleporter();
              break;

            case BossType.ELEMENTAL_CHAOS:
              this.initializeElementalChaos();
              break;

            case BossType.MIRROR_BOSS:
              this.initializeMirrorBoss();
              break;
          }

          this.setBossColor();
        }

        initializeGuardianWall() {
          this._attackPatterns = [{
            name: 'Shield Regeneration',
            cooldown: 5.0,
            damage: 0,
            range: 200,
            execute: () => this.regenerateShieldBricks()
          }, {
            name: 'Defensive Burst',
            cooldown: 8.0,
            damage: 15,
            range: 150,
            execute: () => this.createDefensiveBarrier()
          }];
        }

        initializeStormCaller() {
          this._attackPatterns = [{
            name: 'Wind Gust',
            cooldown: 3.0,
            damage: 0,
            range: 300,
            execute: () => this.createWindGust()
          }, {
            name: 'Lightning Strike',
            cooldown: 6.0,
            damage: 20,
            range: 100,
            execute: () => this.lightningStrike()
          }, {
            name: 'Tornado',
            cooldown: 12.0,
            damage: 25,
            range: 200,
            execute: () => this.createTornado()
          }];
        }

        initializeBrickSpawner() {
          this._attackPatterns = [{
            name: 'Spawn Basic Bricks',
            cooldown: 4.0,
            damage: 0,
            range: 0,
            execute: () => this.spawnBasicBricks()
          }, {
            name: 'Spawn Elite Bricks',
            cooldown: 8.0,
            damage: 0,
            range: 0,
            execute: () => this.spawnEliteBricks()
          }, {
            name: 'Brick Rain',
            cooldown: 15.0,
            damage: 30,
            range: 400,
            execute: () => this.createBrickRain()
          }];
        }

        initializeGravityMaster() {
          this._attackPatterns = [{
            name: 'Gravity Flip',
            cooldown: 8.0,
            damage: 0,
            range: 0,
            execute: () => this.flipGravity()
          }, {
            name: 'Gravity Well',
            cooldown: 10.0,
            damage: 15,
            range: 150,
            execute: () => this.createGravityWell()
          }, {
            name: 'Zero Gravity',
            cooldown: 20.0,
            damage: 0,
            range: 0,
            execute: () => this.activateZeroGravity()
          }];
        }

        initializeTimeManipulator() {
          this._attackPatterns = [{
            name: 'Time Slow',
            cooldown: 6.0,
            damage: 0,
            range: 0,
            execute: () => this.slowTime()
          }, {
            name: 'Time Acceleration',
            cooldown: 12.0,
            damage: 20,
            range: 0,
            execute: () => this.accelerateTime()
          }, {
            name: 'Temporal Rift',
            cooldown: 18.0,
            damage: 35,
            range: 200,
            execute: () => this.createTemporalRift()
          }];
        }

        initializeShieldGenerator() {
          this._attackPatterns = [{
            name: 'Shield All Bricks',
            cooldown: 10.0,
            damage: 0,
            range: 0,
            execute: () => this.shieldAllBricks()
          }, {
            name: 'Energy Pulse',
            cooldown: 7.0,
            damage: 18,
            range: 250,
            execute: () => this.energyPulse()
          }];
        }

        initializeMultiPhase() {
          this._attackPatterns = [{
            name: 'Phase Attack',
            cooldown: 4.0,
            damage: 15,
            range: 200,
            execute: () => this.phaseSpecificAttack()
          }];
        }

        initializeTeleporter() {
          this._attackPatterns = [{
            name: 'Teleport Self',
            cooldown: 5.0,
            damage: 0,
            range: 0,
            execute: () => this.teleportSelf()
          }, {
            name: 'Teleport Bricks',
            cooldown: 8.0,
            damage: 0,
            range: 0,
            execute: () => this.teleportBricks()
          }, {
            name: 'Teleport Ball',
            cooldown: 6.0,
            damage: 10,
            range: 0,
            execute: () => this.teleportBall()
          }];
        }

        initializeElementalChaos() {
          this._attackPatterns = [{
            name: 'Random Elemental',
            cooldown: 3.0,
            damage: 20,
            range: 180,
            execute: () => this.randomElementalAttack()
          }, {
            name: 'Elemental Storm',
            cooldown: 15.0,
            damage: 40,
            range: 300,
            execute: () => this.elementalStorm()
          }];
        }

        initializeMirrorBoss() {
          this._attackPatterns = [{
            name: 'Mirror Paddle',
            cooldown: 2.0,
            damage: 0,
            range: 0,
            execute: () => this.mirrorPaddleMovement()
          }, {
            name: 'Copy Ball',
            cooldown: 8.0,
            damage: 0,
            range: 0,
            execute: () => this.copyBallMovement()
          }];
        }

        scaleStatsForChapter() {
          const chapterMultiplier = 1 + (this.chapter - 1) * 0.5;
          this.maxHealth = Math.floor(this.maxHealth * chapterMultiplier);
          this._currentHealth = this.maxHealth;
          this.attackPower = Math.floor(this.attackPower * chapterMultiplier); // Update phase transition thresholds

          this._phaseTransitionHealth = this._phaseTransitionHealth.map(threshold => Math.floor(this.maxHealth * threshold));
        }

        setBossColor() {
          if (!this._sprite) return;

          switch (this.bossType) {
            case BossType.GUARDIAN_WALL:
              this._sprite.color = new Color(100, 100, 255); // Blue

              break;

            case BossType.STORM_CALLER:
              this._sprite.color = new Color(200, 200, 200); // Gray

              break;

            case BossType.BRICK_SPAWNER:
              this._sprite.color = new Color(139, 69, 19); // Brown

              break;

            case BossType.GRAVITY_MASTER:
              this._sprite.color = new Color(128, 0, 128); // Purple

              break;

            case BossType.TIME_MANIPULATOR:
              this._sprite.color = new Color(255, 215, 0); // Gold

              break;

            case BossType.SHIELD_GENERATOR:
              this._sprite.color = new Color(0, 255, 255); // Cyan

              break;

            case BossType.MULTI_PHASE:
              this._sprite.color = new Color(255, 0, 255); // Magenta

              break;

            case BossType.TELEPORTER:
              this._sprite.color = new Color(255, 165, 0); // Orange

              break;

            case BossType.ELEMENTAL_CHAOS:
              this._sprite.color = this.getRandomElementalColor();
              break;

            case BossType.MIRROR_BOSS:
              this._sprite.color = new Color(192, 192, 192); // Silver

              break;
          }
        }

        setupCollisionHandling() {
          if (!this._collider) return;

          this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          // Handle collision with ball or projectiles
          const ball = otherCollider.getComponent('EnhancedBall');

          if (ball) {
            this.takeDamage(ball.damage || 1);
          } // Handle collision with laser or other attacks


          const laser = otherCollider.getComponent('Laser');

          if (laser) {
            this.takeDamage(laser.damage || 5);
          }
        }

        takeDamage(damage) {
          this._currentHealth = Math.max(0, this._currentHealth - damage);
          this.showDamageEffect();
          console.log(`Boss took ${damage} damage. Health: ${this._currentHealth}/${this.maxHealth}`);

          if (this._currentHealth <= 0) {
            this.onBossDefeated();
          }
        }

        updateMovement(dt) {
          if (!this._rigidBody) return;

          switch (this.bossType) {
            case BossType.GUARDIAN_WALL:
              // Stationary boss
              break;

            case BossType.STORM_CALLER:
              this.floatingMovement(dt);
              break;

            case BossType.TELEPORTER:
              // Movement handled by teleportation
              break;

            default:
              this.horizontalMovement(dt);
              break;
          }
        }

        horizontalMovement(dt) {
          const position = this.node.getWorldPosition();
          const velocity = Vec2.multiplyScalar(new Vec2(), new Vec2(this._moveDirection.x, 0), this.moveSpeed); // Bounce off screen edges

          if (position.x <= -400 || position.x >= 400) {
            this._moveDirection.x *= -1;
          }

          if (this._rigidBody) {
            this._rigidBody.linearVelocity = velocity;
          }
        }

        floatingMovement(dt) {
          const time = this._specialTimer;
          const x = Math.sin(time * 2) * 150;
          const y = Math.cos(time * 1.5) * 50;
          this.node.setWorldPosition(x, this.node.worldPosition.y + y * dt * 0.1, 0);
        }

        updateAttackPatterns(dt) {
          if (this._isAttacking) return;

          for (const pattern of this._attackPatterns) {
            if (this._lastAttackTime >= pattern.cooldown) {
              this.executeAttackPattern(pattern);
              this._lastAttackTime = 0;
              break;
            }
          }
        }

        executeAttackPattern(pattern) {
          console.log(`Boss executing: ${pattern.name}`);
          this._isAttacking = true;
          pattern.execute(); // Reset attack state after a short delay

          this.scheduleOnce(() => {
            this._isAttacking = false;
          }, 1.0);
        }

        updateSpecialBehavior(dt) {
          switch (this.bossType) {
            case BossType.ELEMENTAL_CHAOS:
              if (this._specialTimer >= 1.0) {
                this.changeElementalColor();
                this._specialTimer = 0;
              }

              break;

            case BossType.MULTI_PHASE:
              this.updateMultiPhaseVisuals();
              break;
          }
        }

        checkPhaseTransitions() {
          let newPhase = this._currentPhase;

          if (this._currentHealth <= this._phaseTransitionHealth[2] && this._currentPhase < BossPhase.ENRAGED) {
            newPhase = BossPhase.ENRAGED;
          } else if (this._currentHealth <= this._phaseTransitionHealth[1] && this._currentPhase < BossPhase.PHASE_3) {
            newPhase = BossPhase.PHASE_3;
          } else if (this._currentHealth <= this._phaseTransitionHealth[0] && this._currentPhase < BossPhase.PHASE_2) {
            newPhase = BossPhase.PHASE_2;
          }

          if (newPhase !== this._currentPhase) {
            this.transitionToPhase(newPhase);
          }
        }

        transitionToPhase(newPhase) {
          console.log(`Boss transitioning to phase ${newPhase}`);
          this._currentPhase = newPhase; // Adjust attack patterns based on phase

          this.adjustAttackPatternsForPhase(newPhase); // Visual effects for phase transition

          this.showPhaseTransitionEffect();

          if (newPhase === BossPhase.ENRAGED) {
            this._enragedMode = true;
            this.attackPower *= 1.5;
            this._attackCooldown *= 0.7; // Attack faster
          }
        }

        adjustAttackPatternsForPhase(phase) {
          const speedMultiplier = 1 + phase * 0.2;
          const damageMultiplier = 1 + phase * 0.3;

          for (const pattern of this._attackPatterns) {
            pattern.cooldown /= speedMultiplier;
            pattern.damage = Math.floor(pattern.damage * damageMultiplier);
          }
        } // Attack pattern implementations


        regenerateShieldBricks() {
          var _this$node$parent;

          const bricks = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
            error: Error()
          }), EnhancedBrick) : EnhancedBrick)) || [];
          let regenerated = 0;

          for (const brick of bricks) {
            if (brick.currentHealth < brick.maxHealth && regenerated < 3) {
              brick.health = brick.maxHealth;
              this.showRegenerationEffect(brick.node);
              regenerated++;
            }
          }
        }

        createDefensiveBarrier() {
          if (!this.brickPrefab) return; // Create a protective barrier around the boss

          const positions = [new Vec3(-100, -50, 0), new Vec3(100, -50, 0), new Vec3(-100, 50, 0), new Vec3(100, 50, 0)];

          for (const pos of positions) {
            const barrier = instantiate(this.brickPrefab);
            const brick = barrier.getComponent(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick);

            if (brick) {
              brick.brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).SHIELD;
              brick.health = 5;
            }

            barrier.setParent(this.node.parent);
            barrier.setWorldPosition(this.node.worldPosition.add(pos));

            this._spawnedObjects.push(barrier);
          }
        }

        createWindGust() {
          var _this$node$parent2;

          // Apply force to all balls in the scene
          const balls = ((_this$node$parent2 = this.node.parent) == null ? void 0 : _this$node$parent2.getComponentsInChildren('EnhancedBall')) || [];
          const windForce = new Vec2(math.randomRangeInt(-500, 500), math.randomRangeInt(-200, 200));

          for (const ball of balls) {
            const rigidBody = ball.getComponent(RigidBody2D);

            if (rigidBody) {
              rigidBody.applyForceToCenter(windForce, true);
            }
          }
        }

        lightningStrike() {
          var _this$node$parent3;

          // Create lightning at random positions
          const paddleController = (_this$node$parent3 = this.node.parent) == null ? void 0 : _this$node$parent3.getComponentInChildren('EnhancedPaddleController');

          if (paddleController) {
            paddleController.takeDamage(this.attackPower);
          }
        }

        createTornado() {
          // Create a spinning force field
          const tornado = new Node('Tornado');
          tornado.setParent(this.node.parent);
          tornado.setWorldPosition(new Vec3(math.randomRangeInt(-300, 300), 0, 0)); // Tornado effect would be implemented with custom component

          this._spawnedObjects.push(tornado); // Auto-destroy after 5 seconds


          this.scheduleOnce(() => {
            tornado.destroy();
          }, 5.0);
        }

        spawnBasicBricks() {
          if (!this.brickPrefab) return;

          for (let i = 0; i < 3; i++) {
            const brick = instantiate(this.brickPrefab);
            const brickComponent = brick.getComponent(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick);

            if (brickComponent) {
              brickComponent.brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).NORMAL;
            }

            brick.setParent(this.node.parent);
            const randomX = math.randomRangeInt(-300, 300);
            const randomY = math.randomRangeInt(100, 300);
            brick.setWorldPosition(randomX, randomY, 0);

            this._spawnedObjects.push(brick);
          }
        }

        spawnEliteBricks() {
          if (!this.brickPrefab) return;
          const eliteTypes = [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REINFORCED, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPLOSIVE, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).ELECTRIC];

          for (let i = 0; i < 2; i++) {
            const brick = instantiate(this.brickPrefab);
            const brickComponent = brick.getComponent(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick);

            if (brickComponent) {
              brickComponent.brickType = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
            }

            brick.setParent(this.node.parent);
            const randomX = math.randomRangeInt(-300, 300);
            const randomY = math.randomRangeInt(100, 300);
            brick.setWorldPosition(randomX, randomY, 0);

            this._spawnedObjects.push(brick);
          }
        } // Additional attack implementations would continue...


        createBrickRain() {
          console.log('Brick rain attack');
        }

        flipGravity() {
          console.log('Gravity flipped');
        }

        createGravityWell() {
          console.log('Gravity well created');
        }

        activateZeroGravity() {
          console.log('Zero gravity activated');
        }

        slowTime() {
          console.log('Time slowed');
        }

        accelerateTime() {
          console.log('Time accelerated');
        }

        createTemporalRift() {
          console.log('Temporal rift created');
        }

        shieldAllBricks() {
          console.log('All bricks shielded');
        }

        energyPulse() {
          console.log('Energy pulse released');
        }

        phaseSpecificAttack() {
          console.log('Phase-specific attack');
        }

        teleportSelf() {
          console.log('Boss teleported');
        }

        teleportBricks() {
          console.log('Bricks teleported');
        }

        teleportBall() {
          console.log('Ball teleported');
        }

        randomElementalAttack() {
          console.log('Random elemental attack');
        }

        elementalStorm() {
          console.log('Elemental storm');
        }

        mirrorPaddleMovement() {
          console.log('Mirroring paddle movement');
        }

        copyBallMovement() {
          console.log('Copying ball movement');
        } // Utility methods


        getRandomElementalColor() {
          const colors = [new Color(255, 0, 0), // Red (Fire)
          new Color(0, 0, 255), // Blue (Ice)
          new Color(255, 255, 0), // Yellow (Electric)
          new Color(0, 255, 0) // Green (Poison)
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        }

        changeElementalColor() {
          if (this._sprite && this.bossType === BossType.ELEMENTAL_CHAOS) {
            this._sprite.color = this.getRandomElementalColor();
          }
        }

        updateMultiPhaseVisuals() {
          if (this._sprite) {
            const alpha = 150 + Math.sin(this._specialTimer * 4) * 50;
            this._sprite.color = new Color(this._sprite.color.r, this._sprite.color.g, this._sprite.color.b, alpha);
          }
        }

        showDamageEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.1, {
            color: Color.WHITE
          }).to(0.1, {
            color: this._sprite.color
          }).start();
        }

        showPhaseTransitionEffect() {
          if (!this._sprite) return;
          tween(this._sprite).to(0.5, {
            color: Color.RED
          }).to(0.5, {
            color: this._sprite.color
          }).start();
        }

        showRegenerationEffect(target) {
          const sprite = target.getComponent(Sprite);
          if (!sprite) return;
          tween(sprite).to(0.3, {
            color: Color.GREEN
          }).to(0.3, {
            color: sprite.color
          }).start();
        }

        startBossBehavior() {
          console.log(`${BossType[this.bossType]} Boss activated - Chapter ${this.chapter}`);
          console.log(`Boss Health: ${this._currentHealth}/${this.maxHealth}`);
        }

        onBossDefeated() {
          console.log(`Boss defeated! ${BossType[this.bossType]} has fallen.`); // Clean up spawned objects

          for (const obj of this._spawnedObjects) {
            if (obj && obj.isValid) {
              obj.destroy();
            }
          } // Notify GameManager


          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager && gameManager.onBossDefeated) {
            gameManager.onBossDefeated(this.bossType, this.chapter);
          } // Boss death animation


          if (this._sprite) {
            tween(this._sprite).to(1.0, {
              color: Color.TRANSPARENT
            }).call(() => this.node.destroy()).start();
          }
        } // Public accessors


        get currentHealth() {
          return this._currentHealth;
        }

        get maxHealthValue() {
          return this.maxHealth;
        }

        get currentPhase() {
          return this._currentPhase;
        }

        get isEnraged() {
          return this._enragedMode;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bossType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BossType.GUARDIAN_WALL;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "attackPower", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "chapter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "brickPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "projectilePrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=57ce52f1ecacd43f479a39744bd311f256dbbf10.js.map