System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BrickType, DifficultyCalculator, _crd;

  function _reportPossibleCrUseOfBrickType(extras) {
    _reporterNs.report("BrickType", "./EnhancedBrick", _context.meta, extras);
  }

  _export("DifficultyCalculator", void 0);

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

      _cclegacy._RF.push({}, "810fen+Dg9CV4+L9XOpMqFW", "DifficultySystem", undefined);

      /**
       * 难度配置接口
       */

      /**
       * 砖块分布配置
       */

      /**
       * 难度计算器 - 根据关卡数字计算难度参数
       */
      _export("DifficultyCalculator", DifficultyCalculator = class DifficultyCalculator {
        /**
         * 计算指定关卡的难度配置
         * @param level 关卡数字 (1-based)
         */
        static calculateDifficulty(level) {
          // 输入验证
          if (level < 1) level = 1; // 基础生命值: 每5关+1

          const baseHealth = 1 + Math.floor(level / 5); // 特殊砖概率: 每关+2%, 上限50%

          const specialBrickChance = Math.min(level * 0.02, 0.5); // 减益砖概率: 每关+1.5%, 上限30%

          const harmfulBrickChance = Math.min(level * 0.015, 0.3); // 有益砖概率: 固定5%

          const beneficialBrickChance = 0.05; // 布局类型: <10关用Normal, >=10关用Special

          const layoutType = level < 10 ? 'normal' : 'special'; // 密度: 基础60% + 每关+2%, 上限90%

          const density = 0.6 + Math.min(level * 0.02, 0.3); // 网格尺寸: 根据关卡递增

          let gridRows = 8;
          let gridCols = 12;

          if (level >= 15) {
            gridRows = 10;
            gridCols = 14;
          } else if (level >= 10) {
            gridRows = 9;
            gridCols = 13;
          }

          return {
            level,
            baseHealth,
            specialBrickChance,
            harmfulBrickChance,
            beneficialBrickChance,
            layoutType,
            density,
            gridRows,
            gridCols
          };
        }
        /**
         * 获取砖块类型分布配置
         */


        static getBrickDistribution() {
          return {
            beneficial: {
              types: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).EXPERIENCE, // 经验砖
              (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).HEALING // 治疗砖
              ],
              weights: [0.7, 0.3] // 70%经验, 30%治疗

            },
            harmful: {
              types: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).REGENERATING, // 再生砖
              (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).PHASE, // 相位砖
              (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).SHIELD, // 护盾砖
              (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).TELEPORT // 传送砖
              ],
              weights: [0.4, 0.3, 0.2, 0.1] // 递减权重

            },
            reactive: {
              types: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).EXPLOSIVE, // 爆炸砖
              (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                error: Error()
              }), BrickType) : BrickType).ELECTRIC // 电击砖
              ],
              chance: 0.1,
              // 10%概率
              minDistance: 2 // 至少间隔2格

            }
          };
        }
        /**
         * 根据权重随机选择砖块类型
         * @param types 砖块类型数组
         * @param weights 权重数组
         */


        static selectBrickTypeByWeight(types, weights) {
          if (types.length === 0 || types.length !== weights.length) {
            return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL;
          } // 计算总权重


          const totalWeight = weights.reduce((sum, w) => sum + w, 0); // 随机值

          let random = Math.random() * totalWeight; // 选择类型

          for (let i = 0; i < types.length; i++) {
            random -= weights[i];

            if (random <= 0) {
              return types[i];
            }
          } // 默认返回第一个


          return types[0];
        }
        /**
         * 格式化难度配置为可读字符串 (用于DevTools显示)
         */


        static formatConfig(config) {
          return `关卡: ${config.level}
基础生命: ${config.baseHealth} HP
特殊砖概率: ${(config.specialBrickChance * 100).toFixed(1)}%
减益砖概率: ${(config.harmfulBrickChance * 100).toFixed(1)}%
有益砖概率: ${(config.beneficialBrickChance * 100).toFixed(1)}%
布局类型: ${config.layoutType === 'normal' ? 'Normal' : 'Special'}
密度: ${(config.density * 100).toFixed(0)}%
网格: ${config.gridRows}行 × ${config.gridCols}列`;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f561cda516a80a53a2fe50c79b7f317948de309f.js.map