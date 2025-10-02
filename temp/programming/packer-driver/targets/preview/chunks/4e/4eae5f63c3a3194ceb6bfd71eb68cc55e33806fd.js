System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BrickType, LayoutGenerator, StandardGridLayout, SymmetricPatternLayout, ClusterRandomLayout, FortressLayout, LayeredDefenseLayout, _crd;

  function _reportPossibleCrUseOfBrickType(extras) {
    _reporterNs.report("BrickType", "../core/Brick", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDifficultyConfig(extras) {
    _reporterNs.report("DifficultyConfig", "./DifficultySystem", _context.meta, extras);
  }

  _export("LayoutGenerator", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      BrickType = _unresolved_2.BrickType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "daa5efjTk5CIJhiyhwPYArw", "LayoutGenerator", undefined);

      /**
       * 砖块数据 - 用于布局生成
       */

      /**
       * 布局模板接口
       */

      /**
       * 布局生成器 - 根据难度配置生成砖块布局
       */
      _export("LayoutGenerator", LayoutGenerator = class LayoutGenerator {
        /**
         * 根据难度配置选择并生成布局
         */
        static generateLayout(config) {
          if (config.layoutType === 'normal') {
            return this.generateNormalLayout(config);
          } else {
            return this.generateSpecialLayout(config);
          }
        }
        /**
         * 生成Normal布局 (关卡1-9)
         */


        static generateNormalLayout(config) {
          // 随机选择Normal布局类型
          var layoutTypes = ['STANDARD_GRID', 'SYMMETRIC_PATTERN', 'CLUSTER_RANDOM'];
          var selectedType = layoutTypes[Math.floor(Math.random() * layoutTypes.length)];

          switch (selectedType) {
            case 'STANDARD_GRID':
              return new StandardGridLayout().generate(config);

            case 'SYMMETRIC_PATTERN':
              return new SymmetricPatternLayout().generate(config);

            case 'CLUSTER_RANDOM':
              return new ClusterRandomLayout().generate(config);

            default:
              return new StandardGridLayout().generate(config);
          }
        }
        /**
         * 生成Special布局 (关卡10+)
         */


        static generateSpecialLayout(config) {
          // 随机选择Special布局类型
          var layoutTypes = ['FORTRESS', 'LAYERED_DEFENSE'];
          var selectedType = layoutTypes[Math.floor(Math.random() * layoutTypes.length)];

          switch (selectedType) {
            case 'FORTRESS':
              return new FortressLayout().generate(config);

            case 'LAYERED_DEFENSE':
              return new LayeredDefenseLayout().generate(config);

            default:
              return new FortressLayout().generate(config);
          }
        }

      });
      /**
       * 标准网格布局 - 矩形阵列 + 随机空缺
       */


      StandardGridLayout = class StandardGridLayout {
        generate(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            density
          } = config;

          for (var row = 0; row < gridRows; row++) {
            for (var col = 0; col < gridCols; col++) {
              // 根据密度随机决定是否放置砖块
              if (Math.random() > density) continue;
              bricks.push({
                type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                  error: Error()
                }), BrickType) : BrickType).NORMAL,
                // 默认类型，后续会被difficulty系统修改
                health: config.baseHealth,
                row,
                col
              });
            }
          }

          return bricks;
        }

      };
      /**
       * 对称图案布局 - 三角形/菱形/十字形
       */

      SymmetricPatternLayout = class SymmetricPatternLayout {
        generate(config) {
          var patterns = ['triangle', 'diamond', 'cross'];
          var selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

          switch (selectedPattern) {
            case 'triangle':
              return this.generateTriangle(config);

            case 'diamond':
              return this.generateDiamond(config);

            case 'cross':
              return this.generateCross(config);

            default:
              return this.generateTriangle(config);
          }
        }

        generateTriangle(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            baseHealth
          } = config;
          var centerCol = Math.floor(gridCols / 2);

          for (var row = 0; row < gridRows; row++) {
            var width = row + 1; // 每行宽度递增

            var startCol = centerCol - Math.floor(width / 2);

            for (var i = 0; i < width && startCol + i < gridCols; i++) {
              bricks.push({
                type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                  error: Error()
                }), BrickType) : BrickType).NORMAL,
                health: baseHealth,
                row,
                col: startCol + i
              });
            }
          }

          return bricks;
        }

        generateDiamond(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            baseHealth
          } = config;
          var centerRow = Math.floor(gridRows / 2);
          var centerCol = Math.floor(gridCols / 2);

          for (var row = 0; row < gridRows; row++) {
            var distanceFromCenter = Math.abs(row - centerRow);
            var width = centerRow + 1 - distanceFromCenter;
            var startCol = centerCol - Math.floor(width / 2);

            for (var i = 0; i < width && startCol + i >= 0 && startCol + i < gridCols; i++) {
              bricks.push({
                type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                  error: Error()
                }), BrickType) : BrickType).NORMAL,
                health: baseHealth,
                row,
                col: startCol + i
              });
            }
          }

          return bricks;
        }

        generateCross(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            baseHealth
          } = config;
          var centerRow = Math.floor(gridRows / 2);
          var centerCol = Math.floor(gridCols / 2);
          var thickness = 2; // 十字粗细
          // 竖线

          for (var row = 0; row < gridRows; row++) {
            for (var offset = -thickness; offset <= thickness; offset++) {
              var col = centerCol + offset;

              if (col >= 0 && col < gridCols) {
                bricks.push({
                  type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                    error: Error()
                  }), BrickType) : BrickType).NORMAL,
                  health: baseHealth,
                  row,
                  col
                });
              }
            }
          } // 横线


          var _loop = function _loop(_col) {
            var _loop2 = function _loop2() {
              var row = centerRow + _offset;

              if (row >= 0 && row < gridRows) {
                // 避免重复添加中心交叉部分
                var exists = bricks.some(b => b.row === row && b.col === _col);

                if (!exists) {
                  bricks.push({
                    type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                      error: Error()
                    }), BrickType) : BrickType).NORMAL,
                    health: baseHealth,
                    row,
                    col: _col
                  });
                }
              }
            };

            for (var _offset = -thickness; _offset <= thickness; _offset++) {
              _loop2();
            }
          };

          for (var _col = 0; _col < gridCols; _col++) {
            _loop(_col);
          }

          return bricks;
        }

      };
      /**
       * 随机团块布局 - 分散的砖块团
       */

      ClusterRandomLayout = class ClusterRandomLayout {
        generate(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            baseHealth
          } = config;
          var clusterCount = 4 + Math.floor(Math.random() * 3); // 4-6个团块

          var clusterSize = 12 + Math.floor(Math.random() * 7); // 12-18个砖块/团

          for (var c = 0; c < clusterCount; c++) {
            var centerRow = Math.floor(Math.random() * gridRows);
            var centerCol = Math.floor(Math.random() * gridCols);

            var _loop3 = function _loop3() {
              var offsetRow = Math.floor(Math.random() * 5) - 2; // -2 to 2

              var offsetCol = Math.floor(Math.random() * 5) - 2;
              var row = centerRow + offsetRow;
              var col = centerCol + offsetCol;

              if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
                // 避免重复
                var exists = bricks.some(b => b.row === row && b.col === col);

                if (!exists) {
                  bricks.push({
                    type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                      error: Error()
                    }), BrickType) : BrickType).NORMAL,
                    health: baseHealth,
                    row,
                    col
                  });
                }
              }
            };

            for (var i = 0; i < clusterSize; i++) {
              _loop3();
            }
          }

          return bricks;
        }

      };
      /**
       * 堡垒布局 - 外墙+小孔+内部密集区
       */

      FortressLayout = class FortressLayout {
        generate(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            baseHealth
          } = config; // 外墙参数

          var wallThickness = 2;
          var wallHealth = baseHealth + 2; // 外墙更厚

          var gateWidth = 3;
          var gatePosition = Math.floor(Math.random() * (gridCols - gateWidth - wallThickness * 2)) + wallThickness; // 生成外墙

          for (var row = 0; row < Math.min(wallThickness + 2, gridRows); row++) {
            for (var col = 0; col < gridCols; col++) {
              // 顶部墙 + 门洞
              if (row < wallThickness) {
                if (col < gatePosition || col >= gatePosition + gateWidth) {
                  bricks.push({
                    type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                      error: Error()
                    }), BrickType) : BrickType).REINFORCED,
                    health: wallHealth,
                    row,
                    col
                  });
                }
              }
            }
          } // 内部密集区 (高价值砖块)


          var innerStartRow = wallThickness + 2;
          var innerDensity = 0.8;

          for (var _row = innerStartRow; _row < gridRows; _row++) {
            for (var _col2 = 2; _col2 < gridCols - 2; _col2++) {
              if (Math.random() < innerDensity) {
                bricks.push({
                  type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                    error: Error()
                  }), BrickType) : BrickType).EXPERIENCE,
                  // 内部多放经验砖
                  health: baseHealth,
                  row: _row,
                  col: _col2
                });
              }
            }
          }

          return bricks;
        }

      };
      /**
       * 分层防御布局 - 不同类型砖块分层
       */

      LayeredDefenseLayout = class LayeredDefenseLayout {
        generate(config) {
          var bricks = [];
          var {
            gridRows,
            gridCols,
            baseHealth
          } = config; // 定义层级

          var layers = [{
            type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE,
            health: 1,
            rows: 2
          }, // 相位砖前排
          {
            type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING,
            health: baseHealth + 1,
            rows: 2
          }, // 再生砖中排
          {
            type: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL,
            health: baseHealth,
            rows: gridRows - 4
          } // 普通砖后排
          ];
          var currentRow = 0;

          for (var layer of layers) {
            for (var r = 0; r < layer.rows && currentRow < gridRows; r++) {
              for (var col = 0; col < gridCols; col++) {
                bricks.push({
                  type: layer.type,
                  health: layer.health,
                  row: currentRow,
                  col
                });
              }

              currentRow++;
            }
          }

          return bricks;
        }

      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4eae5f63c3a3194ceb6bfd71eb68cc55e33806fd.js.map