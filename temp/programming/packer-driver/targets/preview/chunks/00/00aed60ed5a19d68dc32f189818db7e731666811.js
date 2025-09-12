System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, director, RelicManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _class3, _crd, ccclass, property, GameState, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRelicManager(extras) {
    _reporterNs.report("RelicManager", "./RelicManager", _context.meta, extras);
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

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property(Prefab), _dec5 = property(Prefab), _dec6 = property(Prefab), _dec7 = property(Node), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "brickPrefab", _descriptor, this);

          _initializerDefineProperty(this, "paddlePrefab", _descriptor2, this);

          _initializerDefineProperty(this, "ballPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "multiBallPowerUpPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "laserPaddlePowerUpPrefab", _descriptor5, this);

          _initializerDefineProperty(this, "powerUpDropChance", _descriptor6, this);

          _initializerDefineProperty(this, "brickContainer", _descriptor7, this);

          _initializerDefineProperty(this, "lives", _descriptor8, this);

          _initializerDefineProperty(this, "score", _descriptor9, this);

          _initializerDefineProperty(this, "level", _descriptor10, this);

          this._currentState = GameState.PRE_START;
          this._bricks = [];
          this._ballNode = null;
          this._paddleNode = null;
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

        createPaddle() {
          if (!this.paddlePrefab) return;
          this._paddleNode = instantiate(this.paddlePrefab);

          this._paddleNode.setPosition(0, -250, 0);

          this.node.addChild(this._paddleNode);
        }

        createBall() {
          if (!this.ballPrefab) return;
          this._ballNode = instantiate(this.ballPrefab);

          this._ballNode.setPosition(0, -150, 0);

          this.node.addChild(this._ballNode);
        }

        setupLevel() {
          this.clearBricks();
          var layout = this.getLevelLayout(this.level);
          this.createBricksFromLayout(layout);
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
                brickScript.setHealth(brickType);
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

        onBrickDestroyed(scoreValue, brickPosition) {
          if (scoreValue === void 0) {
            scoreValue = 10;
          }

          this.score += scoreValue;

          if (brickPosition && Math.random() < this.powerUpDropChance) {
            this.dropPowerUp(brickPosition);
          }

          this._bricks = this._bricks.filter(brick => brick && brick.isValid);

          if (this._bricks.length === 0) {
            this.onLevelComplete();
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
          this.lives--;

          if (this.lives <= 0) {
            this.setState(GameState.GAME_OVER);
          } else {
            this.resetBall();
          }
        }

        resetBall() {
          if (this._ballNode) {
            var ballScript = this._ballNode.getComponent('Ball');

            if (ballScript) {
              ballScript.resetBall();
            }
          }
        }

        onLevelComplete() {
          this.setState(GameState.LEVEL_COMPLETE);
          this.level++;
          var relicManager = (_crd && RelicManager === void 0 ? (_reportPossibleCrUseOfRelicManager({
            error: Error()
          }), RelicManager) : RelicManager).getInstance();

          if (relicManager) {
            relicManager.grantRandomRelic();
          }

          this.scheduleOnce(() => {
            this.setupLevel();
            this.setState(GameState.PLAYING);
          }, 3.0);
        }

        setState(newState) {
          this._currentState = newState;
          console.log("Game State Changed: " + newState);
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
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "powerUpDropChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "brickContainer", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lives", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "score", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "level", [property], {
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
//# sourceMappingURL=00aed60ed5a19d68dc32f189818db7e731666811.js.map