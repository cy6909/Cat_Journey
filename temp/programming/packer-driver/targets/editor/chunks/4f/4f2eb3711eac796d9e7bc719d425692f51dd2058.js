System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, director, RelicManager, LevelManager, LevelType, CoreController, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _class3, _crd, ccclass, property, GameState, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRelicManager(extras) {
    _reporterNs.report("RelicManager", "../managers/RelicManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelManager(extras) {
    _reporterNs.report("LevelManager", "./LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelType(extras) {
    _reporterNs.report("LevelType", "./LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCoreController(extras) {
    _reporterNs.report("CoreController", "../managers/CoreController", _context.meta, extras);
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
      RelicManager = _unresolved_2.RelicManager;
    }, function (_unresolved_3) {
      LevelManager = _unresolved_3.LevelManager;
      LevelType = _unresolved_3.LevelType;
    }, function (_unresolved_4) {
      CoreController = _unresolved_4.CoreController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1112eqYJQlDHrb6soEdZnHr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'director']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameState", GameState = /*#__PURE__*/function (GameState) {
        GameState["PRE_START"] = "PRE_START";
        GameState["PLAYING"] = "PLAYING";
        GameState["LEVEL_COMPLETE"] = "LEVEL_COMPLETE";
        GameState["GAME_OVER"] = "GAME_OVER";
        return GameState;
      }({}));

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(Prefab), _dec5 = property(Prefab), _dec6 = property(Prefab), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Prefab), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "brickPrefab", _descriptor, this);

          _initializerDefineProperty(this, "paddlePrefab", _descriptor2, this);

          _initializerDefineProperty(this, "ballPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "multiBallPowerUpPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "laserPaddlePowerUpPrefab", _descriptor5, this);

          _initializerDefineProperty(this, "powerUpDropChance", _descriptor6, this);

          _initializerDefineProperty(this, "brickContainer", _descriptor7, this);

          _initializerDefineProperty(this, "coreNode", _descriptor8, this);

          _initializerDefineProperty(this, "experienceOrbPrefab", _descriptor9, this);

          _initializerDefineProperty(this, "lives", _descriptor10, this);

          _initializerDefineProperty(this, "score", _descriptor11, this);

          _initializerDefineProperty(this, "level", _descriptor12, this);

          this._currentState = GameState.PRE_START;
          this._bricks = [];
          this._ballNode = null;
          this._paddleNode = null;
          this._coreController = null;
          this._levelManager = null;
        }

        static getInstance() {
          return GameManager._instance;
        }

        onLoad() {
          if (GameManager._instance === null) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);
          } else {
            this.node.destroy();
            return;
          }
        }

        onDestroy() {
          if (GameManager._instance === this) {
            GameManager._instance = null;
          }
        }

        start() {
          this.initializeGame();
          this.initializeCore();
          this.initializeLevelManager();
        }

        initializeGame() {
          this.setState(GameState.PRE_START);
          this.createPaddle();
          this.createBall();
          this.setupLevel();
          this.scheduleOnce(() => {
            this.setState(GameState.PLAYING);
          }, 2.0);
        }

        initializeCore() {
          if (this.coreNode) {
            this._coreController = this.coreNode.getComponent(_crd && CoreController === void 0 ? (_reportPossibleCrUseOfCoreController({
              error: Error()
            }), CoreController) : CoreController);

            if (!this._coreController) {
              console.warn('CoreController not found on coreNode');
            }
          }
        }

        initializeLevelManager() {
          this._levelManager = (_crd && LevelManager === void 0 ? (_reportPossibleCrUseOfLevelManager({
            error: Error()
          }), LevelManager) : LevelManager).getInstance();

          if (!this._levelManager) {
            console.warn('LevelManager instance not found');
          }
        }

        createPaddle() {
          try {
            if (!this.paddlePrefab) {
              console.warn('Paddle prefab not assigned - skipping paddle creation');
              return;
            }

            this._paddleNode = instantiate(this.paddlePrefab);

            if (this._paddleNode) {
              this._paddleNode.setPosition(0, -250, 0);

              this.node.addChild(this._paddleNode);
              console.log('Paddle created successfully');
            } else {
              console.error('Failed to instantiate paddle prefab');
            }
          } catch (error) {
            console.error('Error creating paddle:', error);
          }
        }

        createBall() {
          try {
            if (!this.ballPrefab) {
              console.warn('Ball prefab not assigned - skipping ball creation');
              return;
            }

            this._ballNode = instantiate(this.ballPrefab);

            if (this._ballNode) {
              this._ballNode.setPosition(0, -150, 0);

              this.node.addChild(this._ballNode);
              console.log('Ball created successfully');
            } else {
              console.error('Failed to instantiate ball prefab');
            }
          } catch (error) {
            console.error('Error creating ball:', error);
          }
        }

        setupLevel() {
          this.clearBricks();

          if (this._levelManager) {
            this._levelManager.initializeLevel();

            const levelType = this._levelManager.getCurrentLevelType();

            if (levelType !== (_crd && LevelType === void 0 ? (_reportPossibleCrUseOfLevelType({
              error: Error()
            }), LevelType) : LevelType).BOSS) {
              const layout = this.getLevelLayout(this.level);
              this.createBricksFromLayout(layout);
            }
          } else {
            const layout = this.getLevelLayout(this.level);
            this.createBricksFromLayout(layout);
          }
        }

        getLevelLayout(level) {
          const basicLayout = [[1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]];

          if (level > 1) {
            for (let row = 0; row < basicLayout.length; row++) {
              for (let col = 0; col < basicLayout[row].length; col++) {
                if (Math.random() < 0.3) {
                  basicLayout[row][col] = 2;
                }
              }
            }
          }

          return basicLayout;
        }

        createBricksFromLayout(layout) {
          if (!this.brickPrefab || !this.brickContainer) return;
          const startX = -280;
          const startY = 200;
          const brickWidth = 80;
          const brickHeight = 40;
          const spacing = 10;

          for (let row = 0; row < layout.length; row++) {
            for (let col = 0; col < layout[row].length; col++) {
              const brickType = layout[row][col];
              if (brickType === 0) continue;
              const brick = instantiate(this.brickPrefab);
              const x = startX + col * (brickWidth + spacing);
              const y = startY - row * (brickHeight + spacing);
              brick.setPosition(x, y, 0);
              const brickScript = brick.getComponent('Brick');

              if (brickScript) {
                brickScript.setHealth(brickType); // Some bricks drop experience orbs

                if (Math.random() < 0.1) {
                  // 10% chance
                  brickScript.setDropsExperience(true);
                }
              }

              this.brickContainer.addChild(brick);

              this._bricks.push(brick);
            }
          }
        }

        clearBricks() {
          this._bricks.forEach(brick => {
            if (brick && brick.isValid) {
              brick.destroy();
            }
          });

          this._bricks = [];
        }

        onBrickDestroyed(scoreValue = 10, brickPosition, dropsExperience = false) {
          this.score += scoreValue;

          if (brickPosition) {
            // Drop power-ups
            if (Math.random() < this.powerUpDropChance) {
              this.dropPowerUp(brickPosition);
            } // Drop experience orbs


            if (dropsExperience) {
              this.dropExperienceOrb(brickPosition);
            }
          }

          this._bricks = this._bricks.filter(brick => brick && brick.isValid);

          if (this._bricks.length === 0) {
            this.checkLevelComplete();
          }
        }

        dropPowerUp(position) {
          const powerUps = [this.multiBallPowerUpPrefab, this.laserPaddlePowerUpPrefab];
          const availablePowerUps = powerUps.filter(prefab => prefab !== null);
          if (availablePowerUps.length === 0) return;
          const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];

          if (randomPowerUp) {
            const powerUpNode = instantiate(randomPowerUp);
            powerUpNode.setPosition(position);
            this.node.addChild(powerUpNode);
          }
        }

        onBallLost() {
          this.lives--; // Ball hitting core also deals damage

          if (this._coreController) {
            this._coreController.takeDamage(1, 'Ball lost');
          }

          if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
          } else {
            this.resetBall();
          }
        }

        onCoreAttacked(damage) {
          console.log(`Core attacked for ${damage} damage`);

          if (this._coreController) {
            this._coreController.takeDamage(damage, 'External attack');
          }
        }

        onCoreDestroyed() {
          console.log('Core destroyed! Immediate game over!');
          this.lives = 0;
          this.setState(GameState.GAME_OVER);
        }

        onBossDefeated(scoreValue) {
          console.log(`Boss defeated! Awarded ${scoreValue} points`);
          this.score += scoreValue; // Boss defeat triggers level completion

          this.onLevelComplete();
        }

        dropExperienceOrb(position) {
          if (!this.experienceOrbPrefab) return;
          const orbNode = instantiate(this.experienceOrbPrefab);
          orbNode.setPosition(position);
          this.node.addChild(orbNode);
          console.log('Experience orb dropped');
        }

        resetBall() {
          if (this._ballNode) {
            const ballScript = this._ballNode.getComponent('Ball');

            if (ballScript) {
              ballScript.resetBall();
            }
          }
        }

        checkLevelComplete() {
          const levelType = this._levelManager ? this._levelManager.getCurrentLevelType() : (_crd && LevelType === void 0 ? (_reportPossibleCrUseOfLevelType({
            error: Error()
          }), LevelType) : LevelType).NORMAL;

          if (levelType === (_crd && LevelType === void 0 ? (_reportPossibleCrUseOfLevelType({
            error: Error()
          }), LevelType) : LevelType).BOSS) {
            // Boss levels complete when boss is defeated (handled in onBossDefeated)
            return;
          }

          this.onLevelComplete();
        }

        onLevelComplete() {
          this.setState(GameState.LEVEL_COMPLETE);
          this.level++;
          const relicManager = (_crd && RelicManager === void 0 ? (_reportPossibleCrUseOfRelicManager({
            error: Error()
          }), RelicManager) : RelicManager).getInstance();

          if (relicManager) {
            relicManager.grantRandomRelic();
          } // Reset level manager for next level


          if (this._levelManager) {
            this._levelManager.resetLevel();

            this._levelManager.adjustDifficulty(this.level);
          }

          this.scheduleOnce(() => {
            this.setupLevel();
            this.setState(GameState.PLAYING);
          }, 3.0);
        }

        setState(newState) {
          try {
            if (!newState || typeof newState !== 'string') {
              console.warn('Invalid game state:', newState);
              return;
            }

            const validStates = Object.values(GameState);

            if (!validStates.includes(newState)) {
              console.warn('Unknown game state:', newState);
              return;
            }

            const oldState = this._currentState;
            this._currentState = newState;
            console.log(`Game State Changed: ${oldState} -> ${newState}`); // Handle state-specific logic

            this.onStateChanged(oldState, newState);
          } catch (error) {
            console.error('Error setting game state:', error);
          }
        }

        onStateChanged(_oldState, newState) {
          try {
            switch (newState) {
              case GameState.GAME_OVER:
                this.handleGameOver();
                break;

              case GameState.LEVEL_COMPLETE:
                this.handleLevelComplete();
                break;

              case GameState.PLAYING:
                this.handleGamePlaying();
                break;
            }
          } catch (error) {
            console.warn('Error in state change handler:', error);
          }
        }

        handleGameOver() {
          console.log('Game Over - cleaning up resources'); // Stop any ongoing animations or sounds
          // Save final score if needed
        }

        handleLevelComplete() {
          console.log('Level Complete - preparing next level'); // Award experience, update progression
        }

        handleGamePlaying() {
          console.log('Game Playing - all systems active'); // Ensure all game systems are ready
        }

        getCurrentState() {
          return this._currentState;
        }

        getBallPrefab() {
          return this.ballPrefab;
        }

        getScore() {
          return this.score;
        }

        getLives() {
          return this.lives;
        }

        getLevel() {
          return this.level;
        } // 添加测试期望的方法


        getBrickCount() {
          return this._bricks.length;
        }

        getBricks() {
          return this._bricks;
        }

        getBallNode() {
          return this._ballNode;
        }

        getPaddleNode() {
          return this._paddleNode;
        }

        getCoreController() {
          return this._coreController;
        }

        getLevelManager() {
          return this._levelManager;
        }

        getGameState() {
          return this._currentState;
        }

        addScore(points) {
          this.score += points;
          console.log(`Score increased by ${points}. Total: ${this.score}`);
        }

        decreaseLives(amount = 1) {
          this.lives = Math.max(0, this.lives - amount);
          console.log(`Lives decreased by ${amount}. Remaining: ${this.lives}`);

          if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
          }
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "brickPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "paddlePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ballPrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "multiBallPowerUpPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "laserPaddlePowerUpPrefab", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "powerUpDropChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "brickContainer", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "coreNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "experienceOrbPrefab", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "lives", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "score", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "level", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4f2eb3711eac796d9e7bc719d425692f51dd2058.js.map