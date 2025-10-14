System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, Vec3, director, Color, Sprite, PhysicsSystem2D, input, Input, KeyCode, Vec2, RelicManager, CoreController, ExperienceManager, DifficultyCalculator, LayoutGenerator, BrickType, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class3, _crd, ccclass, property, GameState, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRelicManager(extras) {
    _reporterNs.report("RelicManager", "../managers/RelicManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelManager(extras) {
    _reporterNs.report("LevelManager", "./LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCoreController(extras) {
    _reporterNs.report("CoreController", "../managers/CoreController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfExperienceManager(extras) {
    _reporterNs.report("ExperienceManager", "../managers/ExperienceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDifficultyCalculator(extras) {
    _reporterNs.report("DifficultyCalculator", "./DifficultySystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDifficultyConfig(extras) {
    _reporterNs.report("DifficultyConfig", "./DifficultySystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBrickDistribution(extras) {
    _reporterNs.report("BrickDistribution", "./DifficultySystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLayoutGenerator(extras) {
    _reporterNs.report("LayoutGenerator", "./LayoutGenerator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBrickData(extras) {
    _reporterNs.report("BrickData", "./LayoutGenerator", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Vec3 = _cc.Vec3;
      director = _cc.director;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      PhysicsSystem2D = _cc.PhysicsSystem2D;
      input = _cc.input;
      Input = _cc.Input;
      KeyCode = _cc.KeyCode;
      Vec2 = _cc.Vec2;
    }, function (_unresolved_2) {
      RelicManager = _unresolved_2.RelicManager;
    }, function (_unresolved_3) {
      CoreController = _unresolved_3.CoreController;
    }, function (_unresolved_4) {
      ExperienceManager = _unresolved_4.ExperienceManager;
    }, function (_unresolved_5) {
      DifficultyCalculator = _unresolved_5.DifficultyCalculator;
    }, function (_unresolved_6) {
      LayoutGenerator = _unresolved_6.LayoutGenerator;
    }, function (_unresolved_7) {
      BrickType = _unresolved_7.BrickType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1112eqYJQlDHrb6soEdZnHr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'director', 'Color', 'Sprite', 'PhysicsSystem2D', 'input', 'Input', 'EventKeyboard', 'KeyCode', 'Vec2']);

      // import { RuntimeDebugPanel } from '../debug/RuntimeDebugPanel';
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
        constructor(...args) {
          super(...args);

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
          this._currentDifficulty = null;
          this._brickDistribution = null;
        }

        static getInstance() {
          return GameManager._instance;
        }

        onLoad() {
          if (GameManager._instance === null) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node); // 添加键盘监听用于测试BallType切换

            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          } else {
            this.node.destroy();
            return;
          }
        }

        onDestroy() {
          if (GameManager._instance === this) {
            GameManager._instance = null; // 移除键盘监听

            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          }
        }

        start() {
          this.initializeGame();
          this.initializeCore(); // this.initializeLevelManager(); // 暂时注释掉
        }

        onKeyDown(event) {
          switch (event.keyCode) {
            case KeyCode.SPACE:
              // 空格键：切换Ball类型来验证25种颜色
              this.cycleBallType();
              break;

            default:
              break;
          }
        }

        cycleBallType() {
          if (this._ballNode) {
            // 尝试获取EnhancedBall组件
            let ballScript = this._ballNode.getComponent('EnhancedBall'); // 如果没有EnhancedBall，尝试获取Ball组件


            if (!ballScript) {
              ballScript = this._ballNode.getComponent('Ball');
            }

            if (ballScript) {
              // 检查是否有cycleToNextBallType方法
              if (typeof ballScript.cycleToNextBallType === 'function') {
                ballScript.cycleToNextBallType();
              }
            }
          }
        }

        initializeGame() {
          this.setState(GameState.PRE_START); // 关闭物理调试显示

          PhysicsSystem2D.instance.debugDrawFlags = 0; // 设置物理系统重力为0 - Breakout游戏不需要重力！

          PhysicsSystem2D.instance.gravity = new Vec2(0, 0);
          this.createBoundaryWalls();
          this.createPaddle(); // 延迟创建Ball，确保Paddle完全初始化

          this.scheduleOnce(() => {
            this.createBallBasedOnPaddle();
          }, 0.1);
          this.setupLevel(); // this.createDebugPanel(); // 暂时注释掉，先修复场景加载问题
          // Ball现在由鼠标点击控制发射，不需要自动延迟发射

          this.setState(GameState.PLAYING);
        }

        initializeCore() {
          if (this.coreNode) {
            this._coreController = this.coreNode.getComponent(_crd && CoreController === void 0 ? (_reportPossibleCrUseOfCoreController({
              error: Error()
            }), CoreController) : CoreController);

            if (!this._coreController) {}
          }
        }
        /*
        private initializeLevelManager(): void {
            this._levelManager = LevelManager.getInstance();
            if (!this._levelManager) {
                
            }
        }
        */


        createPaddle() {
          try {
            if (!this.paddlePrefab) {
              // Silently skip if prefab not assigned
              return;
            }

            this._paddleNode = instantiate(this.paddlePrefab);

            if (this._paddleNode) {
              this._paddleNode.setPosition(0, -300, 0); // 统一添加到Canvas下


              const canvas = this.node.parent;

              if (canvas) {
                canvas.addChild(this._paddleNode);
              } else {
                this.node.addChild(this._paddleNode);
              }
            } else {}
          } catch (error) {// Silently handle error
          }
        }

        createBallBasedOnPaddle() {
          try {
            if (!this.ballPrefab) {
              return;
            }

            if (!this._paddleNode) {
              return;
            } // 获取Paddle的实际位置


            const paddlePos = this._paddleNode.position;
            this._ballNode = instantiate(this.ballPrefab);

            if (this._ballNode) {
              // Ball位置基于Paddle实际位置，上方20像素
              const ballPos = new Vec3(paddlePos.x, paddlePos.y + 20, paddlePos.z);

              this._ballNode.setPosition(ballPos); // 将Ball添加到Canvas下，与Paddle同级


              const canvas = this.node.parent;

              if (canvas) {
                canvas.addChild(this._ballNode);
              } else {
                this.node.addChild(this._ballNode);
              } // 通知Ball找到Paddle引用


              const ballScript = this._ballNode.getComponent('EnhancedBall') || this._ballNode.getComponent('Ball');

              if (ballScript && typeof ballScript.setPaddleReference === 'function') {
                ballScript.setPaddleReference(this._paddleNode);
              }
            } else {}
          } catch (error) {}
        }

        createBall() {
          try {
            if (!this.ballPrefab) {
              return;
            }

            this._ballNode = instantiate(this.ballPrefab);

            if (this._ballNode) {
              this._ballNode.setPosition(0, -250, 0); // 与跟随逻辑一致：-300 + 50 = -250
              // 将Ball添加到Canvas下，而不是GameManager下


              const canvas = this.node.parent;

              if (canvas) {
                canvas.addChild(this._ballNode);
              } else {
                this.node.addChild(this._ballNode);
              }
            } else {}
          } catch (error) {}
        }

        createBoundaryWalls() {
          try {
            if (!this.wallPrefab) {
              return;
            } // Screen boundaries for 640x960 portrait: left=-320, right=+320, top=+480, bottom=-480


            const canvas = this.node.parent;
            const parentNode = canvas || this.node; // Left wall

            const leftWall = instantiate(this.wallPrefab);
            leftWall.setPosition(-325, 0, 0); // 竖屏左边界

            leftWall.setScale(1, 10, 1); // 高一些适应竖屏

            const leftSprite = leftWall.getComponent(Sprite);

            if (leftSprite) {
              leftSprite.color = new Color(255, 0, 0, 128);
            }

            parentNode.addChild(leftWall); // Right wall  

            const rightWall = instantiate(this.wallPrefab);
            rightWall.setPosition(325, 0, 0); // 竖屏右边界

            rightWall.setScale(1, 10, 1);
            const rightSprite = rightWall.getComponent(Sprite);

            if (rightSprite) {
              rightSprite.color = new Color(255, 0, 0, 128);
            }

            parentNode.addChild(rightWall); // Top wall

            const topWall = instantiate(this.wallPrefab);
            topWall.setPosition(0, 485, 0); // 竖屏上边界

            topWall.setScale(7, 1, 1); // 宽一些覆盖竖屏宽度

            const topSprite = topWall.getComponent(Sprite);

            if (topSprite) {
              topSprite.color = new Color(0, 255, 0, 128);
            }

            parentNode.addChild(topWall); // Bottom wall

            const bottomWall = instantiate(this.wallPrefab);
            bottomWall.setPosition(0, -485, 0); // 竖屏下边界

            bottomWall.setScale(7, 1, 1);
            const bottomSprite = bottomWall.getComponent(Sprite);

            if (bottomSprite) {
              bottomSprite.color = new Color(0, 0, 255, 128);
            }

            parentNode.addChild(bottomWall);
          } catch (error) {}
        }
        /*
        private createDebugPanel(): void {
            try {
                // 创建调试面板节点
                const debugNode = new Node('RuntimeDebugPanel');
                const debugPanel = debugNode.addComponent(RuntimeDebugPanel);
                
                // 添加到Canvas下，确保在UI层次结构中
                const canvas = this.node.parent;
                if (canvas) {
                    canvas.addChild(debugNode);
                    
                } else {
                    this.node.addChild(debugNode);
                    
                }
            } catch (error) {
                
            }
        }
        */


        launchBall() {
          if (this._ballNode) {
            const ballScript = this._ballNode.getComponent('EnhancedBall') || this._ballNode.getComponent('Ball');

            if (ballScript && typeof ballScript.launch === 'function') {
              ballScript.launch();
            } else {}
          } else {}
        }

        setupLevel() {
          // 计算当前关卡难度
          this._currentDifficulty = (_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
            error: Error()
          }), DifficultyCalculator) : DifficultyCalculator).calculateDifficulty(this.level);
          this._brickDistribution = (_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
            error: Error()
          }), DifficultyCalculator) : DifficultyCalculator).getBrickDistribution(); // 清除旧砖块

          this.clearBricks(); // 使用新的布局生成系统

          const brickData = (_crd && LayoutGenerator === void 0 ? (_reportPossibleCrUseOfLayoutGenerator({
            error: Error()
          }), LayoutGenerator) : LayoutGenerator).generateLayout(this._currentDifficulty);
          this.createBricksFromData(brickData);
        }
        /**
         * 从BrickData数组创建砖块 - 替代旧的createBricksFromLayout
         */


        createBricksFromData(brickDataArray) {
          if (!this.brickPrefab || !this.brickContainer || !this._currentDifficulty) {
            return;
          }

          const config = this._currentDifficulty; // 基于真实砖块尺寸计算布局

          const wallInnerBoundary = 310; // 墙壁内边界 (325 wall - 15 safety margin)

          const actualBrickWidth = 80 * 0.625; // 50像素实际宽度

          const actualBrickHeight = 30 * 0.625; // 18.75像素实际高度

          const spacing = 4; // 间距
          // 计算可用宽度和实际可放置的列数

          const availableWidth = wallInnerBoundary * 2; // 左右各310，总共620

          let finalCols = config.gridCols;
          let finalTotalWidth = finalCols * actualBrickWidth + (finalCols - 1) * spacing; // 如果砖块网格超出边界，减少列数

          while (finalTotalWidth > availableWidth && finalCols > 1) {
            finalCols--;
            finalTotalWidth = finalCols * actualBrickWidth + (finalCols - 1) * spacing;
          } // 过滤掉超出列数的砖块


          const filteredBricks = finalCols < config.gridCols ? brickDataArray.filter(brick => brick.col < finalCols) : brickDataArray;
          const startX = -finalTotalWidth / 2 + actualBrickWidth / 2;
          const startY = 300; // 应用难度系统: 随机分配特殊砖块类型

          this.applyDifficultyToBricks(filteredBricks);

          for (const data of filteredBricks) {
            const brick = instantiate(this.brickPrefab);
            const x = startX + data.col * (actualBrickWidth + spacing);
            const y = startY - data.row * (actualBrickHeight + spacing);
            brick.setPosition(x, y, 0);
            brick.setScale(0.625, 0.625, 1); // 配置砖块类型和生命值

            const brickScript = brick.getComponent('EnhancedBrick') || brick.getComponent('Brick');

            if (brickScript) {
              // 先设置类型
              brickScript.brickType = data.type; // 调用initializeBrickType初始化颜色和默认属性

              if (typeof brickScript.initializeBrickType === 'function') {
                brickScript.initializeBrickType();
              } // 检查是否需要覆盖生命值 (只覆盖不硬编码生命值的类型)


              const typesWithHardcodedHealth = [1, 5, 14, 21]; // REINFORCED, REGENERATING, SHIELD, METAL

              if (!typesWithHardcodedHealth.includes(data.type)) {
                // 对于其他类型，使用难度系统计算的生命值
                brickScript.health = data.health;
                brickScript._maxHealth = data.health;
              }
            }

            this.brickContainer.addChild(brick);

            this._bricks.push(brick);
          }
        }
        /**
         * 应用难度配置到砖块数据 - 根据概率分配特殊砖块类型
         */


        applyDifficultyToBricks(brickDataArray) {
          if (!this._currentDifficulty || !this._brickDistribution) return;
          const config = this._currentDifficulty;
          const dist = this._brickDistribution; // 记录已使用的reactive砖块位置

          const reactiveBricks = [];

          for (const brick of brickDataArray) {
            let finalType = brick.type; // 1. 检查是否应该是有益砖块

            if (Math.random() < config.beneficialBrickChance) {
              finalType = (_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
                error: Error()
              }), DifficultyCalculator) : DifficultyCalculator).selectBrickTypeByWeight(dist.beneficial.types, dist.beneficial.weights);
            } // 2. 检查是否应该是减益砖块
            else if (Math.random() < config.harmfulBrickChance) {
              finalType = (_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
                error: Error()
              }), DifficultyCalculator) : DifficultyCalculator).selectBrickTypeByWeight(dist.harmful.types, dist.harmful.weights);
            } // 3. 检查是否应该是爆炸性砖块
            else if (Math.random() < dist.reactive.chance) {
              // 检查与其他reactive砖块的距离
              let tooClose = false;

              for (const pos of reactiveBricks) {
                const distance = Math.abs(brick.row - pos.row) + Math.abs(brick.col - pos.col);

                if (distance < dist.reactive.minDistance) {
                  tooClose = true;
                  break;
                }
              }

              if (!tooClose) {
                finalType = dist.reactive.types[Math.floor(Math.random() * dist.reactive.types.length)];
                reactiveBricks.push({
                  row: brick.row,
                  col: brick.col
                });
              }
            }

            brick.type = finalType;
          }
        }
        /**
         * 公开方法 - 供DevTools调用，加载指定关卡
         */


        loadLevel(level, customConfig) {
          this.level = level;

          if (customConfig) {
            this._currentDifficulty = customConfig;
          }

          this.setupLevel();
        }

        getLevelLayout(level) {
          // 已废弃 - 保留用于向后兼容
          // 更多砖块：从8x4增加到12x6，提升内容密度
          const basicLayout = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

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
          if (!this.brickPrefab || !this.brickContainer) return; // 基于真实砖块尺寸计算布局 - 消除缩放特殊情况

          const wallInnerBoundary = 320; // 墙壁内边界 (325-5)

          const actualBrickWidth = 80 * 0.625; // 50像素实际宽度

          const actualBrickHeight = 40 * 0.625; // 25像素实际高度

          const spacing = 4; // 减小间距适应更多砖块

          const cols = layout[0] ? layout[0].length : 0;
          const totalBrickArea = cols * actualBrickWidth + (cols - 1) * spacing; // 如果12列太宽，减少到10列

          let finalCols = cols;
          let finalLayout = layout;

          if (totalBrickArea > wallInnerBoundary * 2) {
            finalCols = 10;
            finalLayout = layout.map(row => row.slice(0, 10)); // 截取前10列
          }

          const finalTotalWidth = finalCols * actualBrickWidth + (finalCols - 1) * spacing;
          const startX = -finalTotalWidth / 2 + actualBrickWidth / 2;
          const startY = 300;

          for (let row = 0; row < finalLayout.length; row++) {
            for (let col = 0; col < finalCols; col++) {
              const brickType = finalLayout[row][col];
              if (brickType === 0) continue;
              const brick = instantiate(this.brickPrefab);
              const x = startX + col * (actualBrickWidth + spacing);
              const y = startY - row * (actualBrickHeight + spacing);
              brick.setPosition(x, y, 0); // 缩放砖块到新尺寸

              brick.setScale(0.625, 0.625, 1); // Use EnhancedBrick component with programmatic types

              const brickScript = brick.getComponent('EnhancedBrick') || brick.getComponent('Brick');

              if (brickScript) {
                // Convert layout value to diverse brick types
                const enhancedBrickType = this.getBrickTypeFromValue(brickType, row, col);

                if (brickScript.brickType !== undefined) {
                  // EnhancedBrick system
                  brickScript.brickType = enhancedBrickType; // Trigger initialization after type assignment

                  if (brickScript.initializeBrickType) {
                    brickScript.initializeBrickType();
                  }
                } else {
                  // Legacy Brick system fallback
                  brickScript.setHealth(brickType);
                } // Some bricks drop experience orbs
                // 提高经验球掉落率到30%，让游戏更有收集感


                if (Math.random() < 0.3) {
                  // 30% chance
                  brickScript.setDropsExperience && brickScript.setDropsExperience(true);
                }
              }

              this.brickContainer.addChild(brick);

              this._bricks.push(brick);
            }
          }
        }
        /**
         * Convert layout value to enhanced brick type with strategic diversity
         * 为每个砖块分配有意义的类型，而不是简单的随机化
         */


        getBrickTypeFromValue(layoutValue, row, col) {
          // Import BrickType enum values  
          const BrickType = {
            NORMAL: 0,
            REINFORCED: 1,
            EXPLOSIVE: 2,
            ELECTRIC: 3,
            EXPERIENCE: 4,
            REGENERATING: 5,
            PHASE: 6,
            MAGNETIC: 7,
            REFLECTIVE: 8,
            POISON: 9,
            ICE: 10,
            FIRE: 11,
            SPLITTING: 12,
            TELEPORT: 13,
            SHIELD: 14,
            GRAVITY: 15,
            TIME: 16,
            HEALING: 17,
            CURSED: 18,
            CRYSTAL: 19,
            RUBBER: 20,
            METAL: 21,
            VOID: 22,
            LIGHT: 23,
            DARK: 24
          }; // Strategic brick placement based on position and level

          const totalPositions = row * 8 + col; // Unique position identifier

          const levelDifficulty = this.level; // Base distribution: mostly normal bricks

          if (layoutValue === 1) {
            // Row-based strategy
            switch (row) {
              case 0:
                // Top row - defensive types
                if (col % 3 === 0) return BrickType.SHIELD;
                if (col % 4 === 1) return BrickType.REINFORCED;
                return BrickType.NORMAL;

              case 1:
                // Second row - special effects
                if (col % 5 === 0) return BrickType.EXPLOSIVE;
                if (col % 5 === 2) return BrickType.ELECTRIC;
                if (col % 7 === 3) return BrickType.EXPERIENCE;
                return BrickType.NORMAL;

              case 2:
                // Third row - element effects
                if (col % 4 === 0) return BrickType.FIRE;
                if (col % 4 === 2) return BrickType.ICE;
                if (col % 6 === 1) return BrickType.POISON;
                return BrickType.NORMAL;

              default:
                // Bottom rows - utility and rare types
                if (col === 0 || col === 7) return BrickType.HEALING; // Corner healing

                if (totalPositions % 11 === 0) return BrickType.TELEPORT;
                if (totalPositions % 13 === 0) return BrickType.CRYSTAL;
                return BrickType.NORMAL;
            }
          } // Enhanced bricks for higher layout values


          if (layoutValue === 2) {
            const rareTypes = [BrickType.GRAVITY, BrickType.TIME, BrickType.VOID, BrickType.METAL, BrickType.PHASE, BrickType.MAGNETIC]; // Add level scaling for rare types

            if (levelDifficulty > 2) {
              const typeIndex = (totalPositions + levelDifficulty) % rareTypes.length;
              return rareTypes[typeIndex];
            } else {
              // Early levels: safer special types
              const earlySpecial = [BrickType.REINFORCED, BrickType.EXPERIENCE, BrickType.HEALING];
              return earlySpecial[totalPositions % earlySpecial.length];
            }
          }

          return BrickType.NORMAL;
        }

        clearBricks() {
          this._bricks.forEach(brick => {
            if (brick && brick.isValid) {
              brick.destroy();
            }
          });

          this._bricks = [];
        }

        onBrickDestroyed(scoreValue = 10, brickPosition, dropsExperience = false, brickType) {
          this.score += scoreValue; // 不再直接添加经验值，而是通过经验球收集来获得
          // 根据砖块类型决定经验球的经验值

          let orbExpValue = 1; // 默认经验值
          // 特殊砖块的经验球包含更多经验

          if (brickType !== undefined) {
            if (brickType === (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPERIENCE) {
              orbExpValue = 5; // 经验砖块的球给予5点

              dropsExperience = true; // 经验砖块一定掉落经验球
            } else if (brickType === (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED || brickType === (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD) {
              orbExpValue = 3; // 坚固砖块的球给予3点
            } else if (brickType === (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE || brickType === (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC) {
              orbExpValue = 2; // 爆炸/电击砖块的球给予2点
            }
          }

          if (brickPosition) {
            // Drop power-ups
            if (Math.random() < this.powerUpDropChance) {
              this.dropPowerUp(brickPosition);
            } // Drop experience orbs with calculated exp value


            if (dropsExperience) {
              this.dropExperienceOrb(brickPosition, orbExpValue);
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
            powerUpNode.setPosition(position); // Add to Canvas for consistent coordinate system

            const canvas = this.node.parent;

            if (canvas) {
              canvas.addChild(powerUpNode);
            } else {
              this.node.addChild(powerUpNode);
            }
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
          if (this._coreController) {
            this._coreController.takeDamage(damage, 'External attack');
          }
        }

        onCoreDestroyed() {
          this.lives = 0;
          this.setState(GameState.GAME_OVER);
        }

        onBossDefeated(scoreValue) {
          this.score += scoreValue; // Boss defeat triggers level completion

          this.onLevelComplete();
        }

        dropExperienceOrb(position, expValue = 1) {
          if (!this.experienceOrbPrefab) return;
          const orbNode = instantiate(this.experienceOrbPrefab); // 设置经验球的经验值

          const orbScript = orbNode.getComponent('UltraSimpleExperienceOrb');

          if (orbScript) {
            orbScript.experienceValue = expValue;
          } // 添加到Canvas而不是GameManager，确保坐标系正确


          const canvas = this.node.parent;

          if (canvas) {
            // 先添加到Canvas
            canvas.addChild(orbNode); // 然后设置世界位置

            orbNode.setWorldPosition(position);
          } else {
            // 后备方案
            this.node.addChild(orbNode);
            orbNode.setPosition(position);
          }
        }

        resetBall() {
          if (this._ballNode) {
            const ballScript = this._ballNode.getComponent('EnhancedBall') || this._ballNode.getComponent('Ball');

            if (ballScript && typeof ballScript.resetBall === 'function') {
              ballScript.resetBall();
            }
          }
        }

        checkLevelComplete() {
          // 暂时简化：直接完成关卡，不检查Boss类型
          this.onLevelComplete();
          /*
          const levelType = this._levelManager ? this._levelManager.getCurrentLevelType() : LevelType.NORMAL;
          
          if (levelType === LevelType.BOSS) {
              // Boss levels complete when boss is defeated (handled in onBossDefeated)
              return;
          }
          
          this.onLevelComplete();
          */
        }

        onLevelComplete() {
          this.setState(GameState.LEVEL_COMPLETE);
          this.level++; // 关卡完成奖励经验

          const expManager = (_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
            error: Error()
          }), ExperienceManager) : ExperienceManager).getInstance();

          if (expManager) {
            expManager.addExperience(50); // 关卡完成奖励50经验
          }

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
              return;
            }

            const validStates = Object.values(GameState);

            if (!validStates.includes(newState)) {
              return;
            }

            const oldState = this._currentState;
            this._currentState = newState; // Handle state-specific logic

            this.onStateChanged(oldState, newState);
          } catch (error) {}
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
          } catch (error) {}
        }

        handleGameOver() {// Stop any ongoing animations or sounds
          // Save final score if needed
        }

        handleLevelComplete() {// Award experience, update progression
        }

        handleGamePlaying() {// Ensure all game systems are ready
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

        getPaddle() {
          if (this._paddleNode) {
            return this._paddleNode.getComponent('EnhancedPaddleController') || this._paddleNode.getComponent('PaddleController');
          }

          return null;
        }

        addLife(amount) {
          this.lives += amount;
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
        }

        decreaseLives(amount = 1) {
          this.lives = Math.max(0, this.lives - amount);

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
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "wallPrefab", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "deathZonePrefab", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "powerUpDropChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "brickContainer", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "coreNode", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "experienceOrbPrefab", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "lives", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "score", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "level", [property], {
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