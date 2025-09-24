System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, director, Color, Sprite, RelicManager, LevelManager, LevelType, CoreController, Ball, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class3, _crd, ccclass, property, GameState, GameManager;

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

  function _reportPossibleCrUseOfBall(extras) {
    _reporterNs.report("Ball", "../core/Ball", _context.meta, extras);
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
      Color = _cc.Color;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      RelicManager = _unresolved_2.RelicManager;
    }, function (_unresolved_3) {
      LevelManager = _unresolved_3.LevelManager;
      LevelType = _unresolved_3.LevelType;
    }, function (_unresolved_4) {
      CoreController = _unresolved_4.CoreController;
    }, function (_unresolved_5) {
      Ball = _unresolved_5.Ball;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1112eqYJQlDHrb6soEdZnHr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'director', 'Color', 'Sprite', 'BoxCollider2D']);

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

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(Prefab), _dec5 = property(Prefab), _dec6 = property(Prefab), _dec7 = property(Prefab), _dec8 = property(Prefab), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Prefab), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "brickPrefab", _descriptor, this);

          _initializerDefineProperty(this, "paddlePrefab", _descriptor2, this);

          _initializerDefineProperty(this, "ballPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "multiBallPowerUpPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "laserPaddlePowerUpPrefab", _descriptor5, this);

          _initializerDefineProperty(this, "wallPrefab", _descriptor6, this);

          _initializerDefineProperty(this, "deathZonePrefab", _descriptor7, this);

          _initializerDefineProperty(this, "powerUpDropChance", _descriptor8, this);

          _initializerDefineProperty(this, "brickContainer", _descriptor9, this);

          _initializerDefineProperty(this, "coreNode", _descriptor10, this);

          _initializerDefineProperty(this, "experienceOrbPrefab", _descriptor11, this);

          _initializerDefineProperty(this, "lives", _descriptor12, this);

          _initializerDefineProperty(this, "score", _descriptor13, this);

          _initializerDefineProperty(this, "level", _descriptor14, this);

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
          this.createBoundaryWalls();
          this.createPaddle();
          this.createBall();
          this.setupLevel(); // 延迟发射球，确保所有物理对象都已初始化

          this.scheduleOnce(() => {
            this.launchBall();
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
              this._paddleNode.setPosition(0, -250, 0); // 统一添加到Canvas下


              var canvas = this.node.parent;

              if (canvas) {
                canvas.addChild(this._paddleNode);
                console.log('Paddle created successfully and added to Canvas');
              } else {
                this.node.addChild(this._paddleNode);
                console.log('Paddle created successfully and added to GameManager');
              }
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
              this._ballNode.setPosition(0, -100, 0); // 相对Canvas中心的位置
              // 将Ball添加到Canvas下，而不是GameManager下


              var canvas = this.node.parent;

              if (canvas) {
                canvas.addChild(this._ballNode);
                console.log('Ball created successfully and added to Canvas');
              } else {
                this.node.addChild(this._ballNode);
                console.log('Ball created successfully and added to GameManager');
              }
            } else {
              console.error('Failed to instantiate ball prefab');
            }
          } catch (error) {
            console.error('Error creating ball:', error);
          }
        }

        createBoundaryWalls() {
          try {
            if (!this.wallPrefab) {
              console.warn('Wall prefab not assigned - skipping boundary creation');
              return;
            } // Screen boundaries for 640x960 portrait: left=-320, right=+320, top=+480, bottom=-480


            var canvas = this.node.parent;
            var parentNode = canvas || this.node; // Left wall

            var leftWall = instantiate(this.wallPrefab);
            leftWall.setPosition(-325, 0, 0); // 竖屏左边界

            leftWall.setScale(1, 10, 1); // 高一些适应竖屏

            var leftSprite = leftWall.getComponent(Sprite);

            if (leftSprite) {
              leftSprite.color = new Color(255, 0, 0, 128);
            }

            parentNode.addChild(leftWall); // Right wall  

            var rightWall = instantiate(this.wallPrefab);
            rightWall.setPosition(325, 0, 0); // 竖屏右边界

            rightWall.setScale(1, 10, 1);
            var rightSprite = rightWall.getComponent(Sprite);

            if (rightSprite) {
              rightSprite.color = new Color(255, 0, 0, 128);
            }

            parentNode.addChild(rightWall); // Top wall

            var topWall = instantiate(this.wallPrefab);
            topWall.setPosition(0, 485, 0); // 竖屏上边界

            topWall.setScale(7, 1, 1); // 宽一些覆盖竖屏宽度

            var topSprite = topWall.getComponent(Sprite);

            if (topSprite) {
              topSprite.color = new Color(0, 255, 0, 128);
            }

            parentNode.addChild(topWall); // Bottom wall

            var bottomWall = instantiate(this.wallPrefab);
            bottomWall.setPosition(0, -485, 0); // 竖屏下边界

            bottomWall.setScale(7, 1, 1);
            var bottomSprite = bottomWall.getComponent(Sprite);

            if (bottomSprite) {
              bottomSprite.color = new Color(0, 0, 255, 128);
            }

            parentNode.addChild(bottomWall);
            console.log('Boundary walls created successfully');
          } catch (error) {
            console.error('Error creating boundary walls:', error);
          }
        }

        launchBall() {
          if (this._ballNode) {
            var ballScript = this._ballNode.getComponent(_crd && Ball === void 0 ? (_reportPossibleCrUseOfBall({
              error: Error()
            }), Ball) : Ball);

            if (ballScript && typeof ballScript.launch === 'function') {
              ballScript.launch();
              console.log('Ball launched after physics initialization');
            } else {
              console.warn('Ball script not found or launch method not available');
            }
          } else {
            console.warn('Ball node not found, cannot launch');
          }
        }

        setupLevel() {
          console.log('SetupLevel called - temporarily skipping brick creation for physics testing'); // 暂时注释掉brick创建，专注测试Ball和Wall物理

          /*
          this.clearBricks();
          
          if (this._levelManager) {
              this._levelManager.initializeLevel();
              
              const levelType = this._levelManager.getCurrentLevelType();
              if (levelType !== LevelType.BOSS) {
                  const layout = this.getLevelLayout(this.level);
                  this.createBricksFromLayout(layout);
              }
          } else {
              const layout = this.getLevelLayout(this.level);
              this.createBricksFromLayout(layout);
          }
          */
        }

        getLevelLayout(level) {
          var basicLayout = [[1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1]];

          if (level > 1) {
            for (var row = 0; row < basicLayout.length; row++) {
              for (var col = 0; col < basicLayout[row].length; col++) {
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
          var startX = -280;
          var startY = 200;
          var brickWidth = 80;
          var brickHeight = 40;
          var spacing = 10;

          for (var row = 0; row < layout.length; row++) {
            for (var col = 0; col < layout[row].length; col++) {
              var brickType = layout[row][col];
              if (brickType === 0) continue;
              var brick = instantiate(this.brickPrefab);
              var x = startX + col * (brickWidth + spacing);
              var y = startY - row * (brickHeight + spacing);
              brick.setPosition(x, y, 0);
              var brickScript = brick.getComponent('Brick');

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

        onBrickDestroyed(scoreValue, brickPosition, dropsExperience) {
          if (scoreValue === void 0) {
            scoreValue = 10;
          }

          if (dropsExperience === void 0) {
            dropsExperience = false;
          }

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
          var powerUps = [this.multiBallPowerUpPrefab, this.laserPaddlePowerUpPrefab];
          var availablePowerUps = powerUps.filter(prefab => prefab !== null);
          if (availablePowerUps.length === 0) return;
          var randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];

          if (randomPowerUp) {
            var powerUpNode = instantiate(randomPowerUp);
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
          console.log("Core attacked for " + damage + " damage");

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
          console.log("Boss defeated! Awarded " + scoreValue + " points");
          this.score += scoreValue; // Boss defeat triggers level completion

          this.onLevelComplete();
        }

        dropExperienceOrb(position) {
          if (!this.experienceOrbPrefab) return;
          var orbNode = instantiate(this.experienceOrbPrefab);
          orbNode.setPosition(position);
          this.node.addChild(orbNode);
          console.log('Experience orb dropped');
        }

        resetBall() {
          if (this._ballNode) {
            var ballScript = this._ballNode.getComponent('Ball');

            if (ballScript) {
              ballScript.resetBall();
            }
          }
        }

        checkLevelComplete() {
          var levelType = this._levelManager ? this._levelManager.getCurrentLevelType() : (_crd && LevelType === void 0 ? (_reportPossibleCrUseOfLevelType({
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
          var relicManager = (_crd && RelicManager === void 0 ? (_reportPossibleCrUseOfRelicManager({
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

            var validStates = Object.values(GameState);

            if (!validStates.includes(newState)) {
              console.warn('Unknown game state:', newState);
              return;
            }

            var oldState = this._currentState;
            this._currentState = newState;
            console.log("Game State Changed: " + oldState + " -> " + newState); // Handle state-specific logic

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
          console.log("Score increased by " + points + ". Total: " + this.score);
        }

        decreaseLives(amount) {
          if (amount === void 0) {
            amount = 1;
          }

          this.lives = Math.max(0, this.lives - amount);
          console.log("Lives decreased by " + amount + ". Remaining: " + this.lives);

          if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
          }
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "brickPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "paddlePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ballPrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "multiBallPowerUpPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "laserPaddlePowerUpPrefab", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "wallPrefab", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "deathZonePrefab", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "powerUpDropChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "brickContainer", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "coreNode", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "experienceOrbPrefab", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "lives", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "score", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "level", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=41cb27b694788051d071d7ef99fc9f0fcbb9b240.js.map