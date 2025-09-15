System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, director, GameManager, BossController, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _crd, ccclass, property, LevelType, LevelManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBossController(extras) {
    _reporterNs.report("BossController", "./BossController", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      director = _cc.director;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      BossController = _unresolved_3.BossController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8d048PfnOZHObphjIEvCabr", "LevelManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'director']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LevelType", LevelType = /*#__PURE__*/function (LevelType) {
        LevelType["NORMAL"] = "NORMAL";
        LevelType["BOSS"] = "BOSS";
        LevelType["ELITE"] = "ELITE";
        LevelType["TIME_ATTACK"] = "TIME_ATTACK";
        return LevelType;
      }({}));

      _export("LevelManager", LevelManager = (_dec = ccclass('LevelManager'), _dec2 = property(Prefab), _dec3 = property(Node), _dec(_class = (_class2 = (_class3 = class LevelManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "pressureMoveSpeed", _descriptor, this);

          // Speed at which bricks move down
          _initializerDefineProperty(this, "pressureStartDelay", _descriptor2, this);

          // Seconds before pressure begins
          _initializerDefineProperty(this, "pressureAcceleration", _descriptor3, this);

          // Speed multiplier per level
          _initializerDefineProperty(this, "bossPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "brickContainer", _descriptor5, this);

          this._pressureTimer = 0;
          this._pressureActive = false;
          this._currentLevelType = LevelType.NORMAL;
          this._bossNode = null;
          this._levelStartTime = 0;
        }

        static getInstance() {
          return LevelManager._instance;
        }

        onLoad() {
          if (LevelManager._instance === null) {
            LevelManager._instance = this;
          }
        }

        onDestroy() {
          if (LevelManager._instance === this) {
            LevelManager._instance = null;
          }
        }

        start() {
          this.initializeLevel();
        }

        update(dt) {
          this.updatePressureSystem(dt);
        }

        initializeLevel() {
          this._levelStartTime = director.getTotalTime();
          this._pressureTimer = 0;
          this._pressureActive = false;
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();
          if (!gameManager) return;
          const currentLevel = gameManager.getLevel();
          this._currentLevelType = this.determineLevelType(currentLevel);
          console.log(`Starting ${this._currentLevelType} level ${currentLevel}`);

          if (this._currentLevelType === LevelType.BOSS) {
            this.setupBossLevel();
          } else {
            this.setupNormalLevel();
          }
        }

        determineLevelType(level) {
          // Boss levels every 10 levels
          if (level % 10 === 0) {
            return LevelType.BOSS;
          } // Elite levels every 5 levels (but not boss levels)


          if (level % 5 === 0) {
            return LevelType.ELITE;
          } // Time attack levels occasionally


          if (level > 5 && Math.random() < 0.15) {
            return LevelType.TIME_ATTACK;
          }

          return LevelType.NORMAL;
        }

        setupBossLevel() {
          // Clear existing bricks for boss fight
          this.clearAllBricks(); // Spawn boss

          this.spawnBoss(); // No pressure system during boss fights

          this._pressureActive = false;
        }

        setupNormalLevel() {
          // Enable pressure system for normal levels
          this._pressureActive = true;
          this._pressureTimer = this.pressureStartDelay;
        }

        spawnBoss() {
          if (!this.bossPrefab) {
            console.error('Boss prefab not assigned!');
            return;
          }

          this._bossNode = instantiate(this.bossPrefab);

          this._bossNode.setPosition(0, 150, 0); // Position at top of screen
          // Configure boss based on level


          const bossScript = this._bossNode.getComponent(_crd && BossController === void 0 ? (_reportPossibleCrUseOfBossController({
            error: Error()
          }), BossController) : BossController);

          if (bossScript) {
            const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).getInstance();
            const level = gameManager ? gameManager.getLevel() : 1; // Scale boss health and damage with level

            const healthMultiplier = 1 + level / 10;
            const damageMultiplier = 1 + level / 20;
            bossScript.maxHealth = Math.floor(100 * healthMultiplier);
            bossScript.attackDamage = Math.floor(1 * damageMultiplier);
            bossScript.scoreValue = Math.floor(500 * healthMultiplier);
          }

          this.node.addChild(this._bossNode);
        }

        updatePressureSystem(dt) {
          if (!this._pressureActive || this._currentLevelType === LevelType.BOSS) {
            return;
          }

          this._pressureTimer -= dt;

          if (this._pressureTimer <= 0) {
            this.applyBrickPressure(dt);
          }
        }

        applyBrickPressure(dt) {
          if (!this.brickContainer) return;
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();
          if (!gameManager) return;
          const level = gameManager.getLevel();
          const adjustedSpeed = this.pressureMoveSpeed * Math.pow(this.pressureAcceleration, level / 5); // Move all bricks down

          const children = this.brickContainer.children;
          let paddleHit = false;

          for (const child of children) {
            const currentPos = child.position;
            const newY = currentPos.y - adjustedSpeed * dt;
            child.setPosition(currentPos.x, newY, currentPos.z); // Check if bricks reached paddle level (danger zone)

            if (newY < -200 && !paddleHit) {
              paddleHit = true;
              this.onBricksReachPaddle();
            }
          }
        }

        onBricksReachPaddle() {
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();
          if (!gameManager) return; // Calculate damage based on remaining brick rows

          const remainingBricks = this.countRemainingBricks();
          const rowsRemaining = Math.ceil(remainingBricks / 8); // Assuming 8 bricks per row

          const damage = Math.max(1, rowsRemaining);
          console.log(`Bricks reached paddle! Taking ${damage} damage from ${rowsRemaining} rows`);
          gameManager.onCoreAttacked(damage); // Reset all bricks to higher position to continue pressure

          this.resetBrickPositions();
        }

        resetBrickPositions() {
          if (!this.brickContainer) return;
          const children = this.brickContainer.children;

          for (const child of children) {
            const currentPos = child.position;
            child.setPosition(currentPos.x, currentPos.y + 100, currentPos.z);
          }
        }

        countRemainingBricks() {
          if (!this.brickContainer) return 0;
          return this.brickContainer.children.length;
        }

        clearAllBricks() {
          if (!this.brickContainer) return;
          const children = [...this.brickContainer.children];

          for (const child of children) {
            child.destroy();
          }
        }

        getCurrentLevelType() {
          return this._currentLevelType;
        }

        isPressureActive() {
          return this._pressureActive;
        }

        getPressureTimer() {
          return this._pressureTimer;
        }

        onBossDefeated() {
          console.log('Boss defeated! Level complete!');
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            // Boss levels give extra rewards
            gameManager.onLevelComplete();
          }
        }

        resetLevel() {
          this._pressureTimer = this.pressureStartDelay;
          this._pressureActive = false;

          if (this._bossNode && this._bossNode.isValid) {
            this._bossNode.destroy();

            this._bossNode = null;
          }
        }

        adjustDifficulty(level) {
          // Adjust pressure system based on level
          const difficultyMultiplier = 1 + level / 10;
          this.pressureMoveSpeed = 10 * difficultyMultiplier;
          this.pressureStartDelay = Math.max(15, 30 - level);
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pressureMoveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10.0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "pressureStartDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30.0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "pressureAcceleration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bossPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "brickContainer", [_dec3], {
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
//# sourceMappingURL=6b49b51d2b56d9f9db805c6e7a66b02dc85cf0bf.js.map