System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, LevelManager, LevelType, DifficultyTier, MapManager, NodeType, BrickType, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _class3, _crd, ccclass, property, LevelLayoutPattern, DynamicLevelGenerator;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLevelManager(extras) {
    _reporterNs.report("LevelManager", "./LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLevelType(extras) {
    _reporterNs.report("LevelType", "./LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDifficultyTier(extras) {
    _reporterNs.report("DifficultyTier", "./LevelManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMapManager(extras) {
    _reporterNs.report("MapManager", "../managers/MapManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNodeType(extras) {
    _reporterNs.report("NodeType", "../managers/MapManager", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      LevelManager = _unresolved_2.LevelManager;
      LevelType = _unresolved_2.LevelType;
      DifficultyTier = _unresolved_2.DifficultyTier;
    }, function (_unresolved_3) {
      MapManager = _unresolved_3.MapManager;
      NodeType = _unresolved_3.NodeType;
    }, function (_unresolved_4) {
      BrickType = _unresolved_4.BrickType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f0707wHcNpBWJk7cH0L8cYh", "DynamicLevelGenerator", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Vec3', 'Node', 'instantiate', 'math']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LevelLayoutPattern", LevelLayoutPattern = /*#__PURE__*/function (LevelLayoutPattern) {
        LevelLayoutPattern["STANDARD"] = "standard";
        LevelLayoutPattern["PYRAMID"] = "pyramid";
        LevelLayoutPattern["DIAMOND"] = "diamond";
        LevelLayoutPattern["SPIRAL"] = "spiral";
        LevelLayoutPattern["FORTRESS"] = "fortress";
        LevelLayoutPattern["CHAOS"] = "chaos";
        LevelLayoutPattern["TUNNEL"] = "tunnel";
        LevelLayoutPattern["WAVES"] = "waves";
        return LevelLayoutPattern;
      }({}));

      _export("DynamicLevelGenerator", DynamicLevelGenerator = (_dec = ccclass('DynamicLevelGenerator'), _dec(_class = (_class2 = (_class3 = class DynamicLevelGenerator extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gridWidth", _descriptor, this);

          _initializerDefineProperty(this, "gridHeight", _descriptor2, this);

          _initializerDefineProperty(this, "brickWidth", _descriptor3, this);

          _initializerDefineProperty(this, "brickHeight", _descriptor4, this);

          _initializerDefineProperty(this, "brickSpacing", _descriptor5, this);

          _initializerDefineProperty(this, "startX", _descriptor6, this);

          _initializerDefineProperty(this, "startY", _descriptor7, this);

          this._levelManager = null;
          this._mapManager = null;
          this._currentParams = null;
        }

        static getInstance() {
          return DynamicLevelGenerator._instance;
        }

        onLoad() {
          if (DynamicLevelGenerator._instance === null) {
            DynamicLevelGenerator._instance = this;
          }

          this._levelManager = (_crd && LevelManager === void 0 ? (_reportPossibleCrUseOfLevelManager({
            error: Error()
          }), LevelManager) : LevelManager).getInstance();
          this._mapManager = (_crd && MapManager === void 0 ? (_reportPossibleCrUseOfMapManager({
            error: Error()
          }), MapManager) : MapManager).getInstance();
        }

        onDestroy() {
          if (DynamicLevelGenerator._instance === this) {
            DynamicLevelGenerator._instance = null;
          }
        }
        /**
         * 根据地图选择和难度参数生成关卡布局
         */


        generateLevelLayout(params) {
          this._currentParams = params;
          console.log("\u5F00\u59CB\u751F\u6210\u5173\u5361 - \u7AE0\u8282:" + params.chapterNumber + " \u5C42\u6570:" + params.floorNumber + " \u7C7B\u578B:" + params.levelType);
          var layout = [];

          switch (params.layoutPattern) {
            case LevelLayoutPattern.STANDARD:
              layout = this.generateStandardLayout(params);
              break;

            case LevelLayoutPattern.PYRAMID:
              layout = this.generatePyramidLayout(params);
              break;

            case LevelLayoutPattern.DIAMOND:
              layout = this.generateDiamondLayout(params);
              break;

            case LevelLayoutPattern.SPIRAL:
              layout = this.generateSpiralLayout(params);
              break;

            case LevelLayoutPattern.FORTRESS:
              layout = this.generateFortressLayout(params);
              break;

            case LevelLayoutPattern.CHAOS:
              layout = this.generateChaosLayout(params);
              break;

            case LevelLayoutPattern.TUNNEL:
              layout = this.generateTunnelLayout(params);
              break;

            case LevelLayoutPattern.WAVES:
              layout = this.generateWavesLayout(params);
              break;

            default:
              layout = this.generateStandardLayout(params);
          } // 应用难度修饰符


          layout = this.applyDifficultyModifiers(layout, params); // 应用特殊修饰符

          layout = this.applySpecialModifiers(layout, params);
          console.log("\u5173\u5361\u751F\u6210\u5B8C\u6210 - \u5171" + layout.length + "\u4E2A\u7816\u5757");
          return layout;
        }
        /**
         * 标准矩形布局
         */


        generateStandardLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);

          for (var row = 0; row < this.gridHeight; row++) {
            for (var col = 0; col < this.gridWidth; col++) {
              // 根据节点类型调整砖块密度
              var spawnChance = this.getBrickSpawnChance(params.nodeType, row, col);
              if (Math.random() > spawnChance) continue;
              var position = this.getGridPosition(row, col);
              var brickType = this.selectBrickType(params, row, col);
              layout.push({
                position,
                brickType,
                health: baseHealth + Math.floor(row * 0.5),
                specialEffects: [],
                difficultyMultiplier: 1.0
              });
            }
          }

          return layout;
        }
        /**
         * 金字塔布局
         */


        generatePyramidLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);

          for (var row = 0; row < this.gridHeight; row++) {
            var rowWidth = Math.max(1, this.gridWidth - row);
            var startCol = Math.floor((this.gridWidth - rowWidth) / 2);

            for (var i = 0; i < rowWidth; i++) {
              var col = startCol + i;
              var position = this.getGridPosition(row, col);
              var brickType = this.selectBrickType(params, row, col);
              layout.push({
                position,
                brickType,
                health: baseHealth + row,
                specialEffects: [],
                difficultyMultiplier: 1.0 + row * 0.2
              });
            }
          }

          return layout;
        }
        /**
         * 钻石布局
         */


        generateDiamondLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
          var centerRow = Math.floor(this.gridHeight / 2);

          for (var row = 0; row < this.gridHeight; row++) {
            var distanceFromCenter = Math.abs(row - centerRow);
            var rowWidth = Math.max(1, this.gridWidth - distanceFromCenter * 2);
            var startCol = Math.floor((this.gridWidth - rowWidth) / 2);

            for (var i = 0; i < rowWidth; i++) {
              var col = startCol + i;
              var position = this.getGridPosition(row, col);
              var brickType = this.selectBrickType(params, row, col);
              layout.push({
                position,
                brickType,
                health: baseHealth + distanceFromCenter,
                specialEffects: [],
                difficultyMultiplier: 1.0 + distanceFromCenter * 0.15
              });
            }
          }

          return layout;
        }
        /**
         * 螺旋布局
         */


        generateSpiralLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
          var grid = Array(this.gridHeight).fill(null).map(() => Array(this.gridWidth).fill(false));
          var row = 0,
              col = 0;
          var dr = 0,
              dc = 1; // 开始向右移动

          var spiral = 0;

          for (var i = 0; i < this.gridWidth * this.gridHeight * 0.7; i++) {
            if (row >= 0 && row < this.gridHeight && col >= 0 && col < this.gridWidth && !grid[row][col]) {
              grid[row][col] = true;
              var position = this.getGridPosition(row, col);
              var brickType = this.selectBrickType(params, row, col);
              layout.push({
                position,
                brickType,
                health: baseHealth + Math.floor(spiral / 4),
                specialEffects: [],
                difficultyMultiplier: 1.0 + spiral * 0.05
              });
              spiral++;
            } // 检查是否需要转向


            var nextRow = row + dr;
            var nextCol = col + dc;

            if (nextRow < 0 || nextRow >= this.gridHeight || nextCol < 0 || nextCol >= this.gridWidth || grid[nextRow][nextCol]) {
              // 转向：右->下->左->上
              var temp = dr;
              dr = dc;
              dc = -temp;
            }

            row += dr;
            col += dc;
          }

          return layout;
        }
        /**
         * 要塞布局
         */


        generateFortressLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier); // 外墙

          for (var row = 0; row < this.gridHeight; row++) {
            for (var col = 0; col < this.gridWidth; col++) {
              var isWall = row === 0 || row === this.gridHeight - 1 || col === 0 || col === this.gridWidth - 1;
              var isGate = row === this.gridHeight - 1 && (col === Math.floor(this.gridWidth / 2) - 1 || col === Math.floor(this.gridWidth / 2));

              if (isWall && !isGate) {
                var position = this.getGridPosition(row, col);
                var brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                  error: Error()
                }), BrickType) : BrickType).REINFORCED;
                layout.push({
                  position,
                  brickType,
                  health: baseHealth * 2,
                  specialEffects: ['fortress_wall'],
                  difficultyMultiplier: 1.5
                });
              } // 内部结构


              if (!isWall && Math.random() < 0.4) {
                var _position = this.getGridPosition(row, col);

                var _brickType = this.selectBrickType(params, row, col);

                layout.push({
                  position: _position,
                  brickType: _brickType,
                  health: baseHealth,
                  specialEffects: [],
                  difficultyMultiplier: 1.0
                });
              }
            }
          }

          return layout;
        }
        /**
         * 混沌布局
         */


        generateChaosLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier); // 随机分布，但确保有一定的可玩性

          var brickCount = Math.floor(this.gridWidth * this.gridHeight * (0.5 + Math.random() * 0.3));
          var positions = new Set();

          while (positions.size < brickCount) {
            var row = Math.floor(Math.random() * this.gridHeight);
            var col = Math.floor(Math.random() * this.gridWidth);
            var key = row + "," + col;

            if (!positions.has(key)) {
              positions.add(key);
              var position = this.getGridPosition(row, col);
              var brickType = this.selectBrickType(params, row, col);
              layout.push({
                position,
                brickType,
                health: baseHealth + Math.floor(Math.random() * 3),
                specialEffects: [],
                difficultyMultiplier: 0.8 + Math.random() * 0.4
              });
            }
          }

          return layout;
        }
        /**
         * 隧道布局
         */


        generateTunnelLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);
          var tunnelWidth = 2;
          var tunnelCenter = Math.floor(this.gridWidth / 2);

          for (var row = 0; row < this.gridHeight; row++) {
            for (var col = 0; col < this.gridWidth; col++) {
              var distanceFromTunnel = Math.abs(col - tunnelCenter);
              var isInTunnel = distanceFromTunnel <= tunnelWidth / 2;

              if (!isInTunnel || row % 2 === 0 && Math.random() < 0.3) {
                var position = this.getGridPosition(row, col);
                var brickType = this.selectBrickType(params, row, col);
                layout.push({
                  position,
                  brickType,
                  health: baseHealth + Math.floor(distanceFromTunnel * 0.5),
                  specialEffects: [],
                  difficultyMultiplier: 1.0 + distanceFromTunnel * 0.1
                });
              }
            }
          }

          return layout;
        }
        /**
         * 波浪布局
         */


        generateWavesLayout(params) {
          var layout = [];
          var baseHealth = this.getBaseHealthForDifficulty(params.difficultyTier);

          for (var row = 0; row < this.gridHeight; row++) {
            for (var col = 0; col < this.gridWidth; col++) {
              var waveHeight = Math.sin(col / this.gridWidth * Math.PI * 2) * 2;
              var targetRow = Math.floor(this.gridHeight / 2 + waveHeight);

              if (Math.abs(row - targetRow) <= 1 && Math.random() < 0.8) {
                var position = this.getGridPosition(row, col);
                var brickType = this.selectBrickType(params, row, col);
                layout.push({
                  position,
                  brickType,
                  health: baseHealth + Math.abs(row - targetRow),
                  specialEffects: [],
                  difficultyMultiplier: 1.0 + Math.abs(waveHeight * 0.1)
                });
              }
            }
          }

          return layout;
        }
        /**
         * 应用难度修饰符
         */


        applyDifficultyModifiers(layout, params) {
          var difficultyMultiplier = this.getDifficultyMultiplier(params);
          return layout.map(brick => _extends({}, brick, {
            health: Math.ceil(brick.health * difficultyMultiplier),
            difficultyMultiplier: brick.difficultyMultiplier * difficultyMultiplier
          }));
        }
        /**
         * 应用特殊修饰符
         */


        applySpecialModifiers(layout, params) {
          params.specialModifiers.forEach(modifier => {
            switch (modifier) {
              case 'electric_storm':
                layout = this.applyElectricStorm(layout);
                break;

              case 'fire_zone':
                layout = this.applyFireZone(layout);
                break;

              case 'ice_field':
                layout = this.applyIceField(layout);
                break;

              case 'explosive_cluster':
                layout = this.applyExplosiveCluster(layout);
                break;

              case 'regeneration_field':
                layout = this.applyRegenerationField(layout);
                break;
            }
          });
          return layout;
        }
        /**
         * 电流风暴修饰符
         */


        applyElectricStorm(layout) {
          var electricCount = Math.floor(layout.length * 0.2);
          var shuffled = [...layout].sort(() => Math.random() - 0.5);

          for (var i = 0; i < electricCount && i < shuffled.length; i++) {
            shuffled[i].brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC;
            shuffled[i].specialEffects.push('chain_lightning');
          }

          return layout;
        }
        /**
         * 火焰区域修饰符
         */


        applyFireZone(layout) {
          var centerX = this.gridWidth / 2;
          var centerY = this.gridHeight / 2;
          return layout.map(brick => {
            var gridPos = this.getGridFromPosition(brick.position);
            var distance = Math.sqrt(Math.pow(gridPos.col - centerX, 2) + Math.pow(gridPos.row - centerY, 2));

            if (distance <= 2) {
              brick.brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).FIRE;
              brick.specialEffects.push('burn_aura');
            }

            return brick;
          });
        }
        /**
         * 冰霜领域修饰符
         */


        applyIceField(layout) {
          return layout.map((brick, index) => {
            if (index % 3 === 0) {
              brick.brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).ICE;
              brick.specialEffects.push('slow_aura');
            }

            return brick;
          });
        }
        /**
         * 爆炸集群修饰符
         */


        applyExplosiveCluster(layout) {
          var explosiveCount = Math.floor(layout.length * 0.15);
          var shuffled = [...layout].sort(() => Math.random() - 0.5);

          for (var i = 0; i < explosiveCount && i < shuffled.length; i++) {
            shuffled[i].brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE;
            shuffled[i].specialEffects.push('cluster_bomb');
          }

          return layout;
        }
        /**
         * 再生领域修饰符
         */


        applyRegenerationField(layout) {
          var regenCount = Math.floor(layout.length * 0.1);
          var shuffled = [...layout].sort(() => Math.random() - 0.5);

          for (var i = 0; i < regenCount && i < shuffled.length; i++) {
            shuffled[i].brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING;
            shuffled[i].specialEffects.push('area_regen');
          }

          return layout;
        }
        /**
         * 工具方法
         */


        getGridPosition(row, col) {
          var x = this.startX + col * (this.brickWidth + this.brickSpacing);
          var y = this.startY - row * (this.brickHeight + this.brickSpacing);
          return new Vec3(x, y, 0);
        }

        getGridFromPosition(position) {
          var col = Math.round((position.x - this.startX) / (this.brickWidth + this.brickSpacing));
          var row = Math.round((this.startY - position.y) / (this.brickHeight + this.brickSpacing));
          return {
            row,
            col
          };
        }

        getBaseHealthForDifficulty(tier) {
          switch (tier) {
            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).EASY:
              return 1;

            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).NORMAL:
              return 2;

            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).HARD:
              return 3;

            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).NIGHTMARE:
              return 5;

            default:
              return 2;
          }
        }

        getBrickSpawnChance(nodeType, row, col) {
          var baseChance = {
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).COMBAT]: 0.85,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).ELITE]: 0.9,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).BOSS]: 1.0,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).HIDDEN_BOSS]: 1.0,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).EVENT]: 0.7,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).SHOP]: 0.4,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).TREASURE]: 0.6,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).CAMPFIRE]: 0.3,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).UPGRADE]: 0.5,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).MYSTERY]: 0.8,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).START]: 0.0,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).END]: 0.0,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).REST]: 0.3,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).SECRET]: 0.95,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).MINI_BOSS]: 0.88,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).PUZZLE]: 0.75,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).GAUNTLET]: 0.95,
            [(_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).FINAL_BOSS]: 1.0
          };
          return baseChance[nodeType] || 0.8;
        }

        selectBrickType(params, row, col) {
          var difficultyFactor = this.getDifficultyMultiplier(params);
          var random = Math.random(); // 根据难度和位置选择砖块类型

          if (params.levelType === (_crd && LevelType === void 0 ? (_reportPossibleCrUseOfLevelType({
            error: Error()
          }), LevelType) : LevelType).BOSS || params.nodeType === (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
            error: Error()
          }), NodeType) : NodeType).BOSS) {
            if (random < 0.3) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED;
            if (random < 0.5) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC;
            if (random < 0.7) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE;
            return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL;
          } // 前排砖块更容易是强化型


          var frontRowBonus = (this.gridHeight - row) * 0.1;
          var specialChance = (difficultyFactor - 1.0) * 0.5 + frontRowBonus;
          if (random < specialChance * 0.2) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REINFORCED;
          if (random < specialChance * 0.4) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).ELECTRIC;
          if (random < specialChance * 0.6) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPLOSIVE;
          if (random < specialChance * 0.8) return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPERIENCE;
          return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).NORMAL;
        }

        getDifficultyMultiplier(params) {
          var multiplier = 1.0; // 章节难度

          multiplier += (params.chapterNumber - 1) * 0.5; // 层数难度

          multiplier += params.floorNumber * 0.1; // 难度级别

          switch (params.difficultyTier) {
            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).EASY:
              multiplier *= 0.8;
              break;

            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).NORMAL:
              multiplier *= 1.0;
              break;

            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).HARD:
              multiplier *= 1.3;
              break;

            case (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
              error: Error()
            }), DifficultyTier) : DifficultyTier).NIGHTMARE:
              multiplier *= 1.8;
              break;
          } // 节点类型


          switch (params.nodeType) {
            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).ELITE:
              multiplier *= 1.4;
              break;

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).BOSS:
              multiplier *= 2.0;
              break;

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).MINI_BOSS:
              multiplier *= 1.6;
              break;

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).GAUNTLET:
              multiplier *= 1.5;
              break;

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).FINAL_BOSS:
              multiplier *= 3.0;
              break;
          }

          return multiplier;
        }
        /**
         * 获取推荐的布局模式
         */


        getRecommendedLayoutPattern(params) {
          // 根据关卡类型和难度推荐布局
          if (params.levelType === (_crd && LevelType === void 0 ? (_reportPossibleCrUseOfLevelType({
            error: Error()
          }), LevelType) : LevelType).BOSS) {
            return LevelLayoutPattern.FORTRESS;
          }

          if (params.nodeType === (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
            error: Error()
          }), NodeType) : NodeType).ELITE) {
            var patterns = [LevelLayoutPattern.SPIRAL, LevelLayoutPattern.DIAMOND, LevelLayoutPattern.FORTRESS];
            return patterns[Math.floor(Math.random() * patterns.length)];
          }

          if (params.floorNumber % 5 === 0) {
            return LevelLayoutPattern.PYRAMID;
          }

          var allPatterns = Object.values(LevelLayoutPattern);
          return allPatterns[Math.floor(Math.random() * allPatterns.length)];
        }
        /**
         * 获取特殊修饰符建议
         */


        getRecommendedModifiers(params) {
          var modifiers = []; // 根据章节添加主题修饰符

          if (params.chapterNumber === 2) {
            modifiers.push('ice_field');
          } else if (params.chapterNumber === 3) {
            modifiers.push('fire_zone');
          } // 根据难度添加修饰符


          if (params.difficultyTier === (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
            error: Error()
          }), DifficultyTier) : DifficultyTier).HARD) {
            modifiers.push('electric_storm');
          } else if (params.difficultyTier === (_crd && DifficultyTier === void 0 ? (_reportPossibleCrUseOfDifficultyTier({
            error: Error()
          }), DifficultyTier) : DifficultyTier).NIGHTMARE) {
            modifiers.push('explosive_cluster', 'regeneration_field');
          } // 特殊节点修饰符


          if (params.nodeType === (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
            error: Error()
          }), NodeType) : NodeType).GAUNTLET) {
            modifiers.push('electric_storm', 'fire_zone');
          }

          return modifiers;
        }

        generateFallbackLayout() {
          var layout = [];
          var baseHealth = 1; // Generate a simple 4x6 grid as fallback

          for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 6; col++) {
              var position = this.getGridPosition(row, col);
              layout.push({
                position,
                brickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                  error: Error()
                }), BrickType) : BrickType).NORMAL,
                health: baseHealth,
                specialEffects: [],
                difficultyMultiplier: 1.0
              });
            }
          }

          return layout;
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gridWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gridHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "brickWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 80;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "brickHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 40;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "brickSpacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "startX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -280;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "startY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bfe3dc066d18a2470ec698af41121695fb6dc555.js.map