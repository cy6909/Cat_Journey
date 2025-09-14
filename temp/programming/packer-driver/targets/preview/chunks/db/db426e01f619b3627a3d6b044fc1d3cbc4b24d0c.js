System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, instantiate, math, EnhancedBossController, BossType, EnhancedBrick, BrickType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, EliteType, HiddenBossType, EliteAndHiddenBossManager;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEnhancedBossController(extras) {
    _reporterNs.report("EnhancedBossController", "./EnhancedBossController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBossType(extras) {
    _reporterNs.report("BossType", "./EnhancedBossController", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      math = _cc.math;
    }, function (_unresolved_2) {
      EnhancedBossController = _unresolved_2.EnhancedBossController;
      BossType = _unresolved_2.BossType;
    }, function (_unresolved_3) {
      EnhancedBrick = _unresolved_3.EnhancedBrick;
      BrickType = _unresolved_3.BrickType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b2923cOEE9GQp8bIBjEnVSu", "EliteAndHiddenBossManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'math']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EliteType", EliteType = /*#__PURE__*/function (EliteType) {
        EliteType[EliteType["BRICK_FORTRESS"] = 0] = "BRICK_FORTRESS";
        EliteType[EliteType["SPEED_DEMON"] = 1] = "SPEED_DEMON";
        EliteType[EliteType["REGENERATOR"] = 2] = "REGENERATOR";
        EliteType[EliteType["ELEMENTAL_CHAOS"] = 3] = "ELEMENTAL_CHAOS";
        EliteType[EliteType["GRAVITY_ANOMALY"] = 4] = "GRAVITY_ANOMALY";
        EliteType[EliteType["TIME_DISTORTION"] = 5] = "TIME_DISTORTION";
        EliteType[EliteType["PHASE_SHIFTER"] = 6] = "PHASE_SHIFTER";
        EliteType[EliteType["MAGNETIC_STORM"] = 7] = "MAGNETIC_STORM";
        EliteType[EliteType["SHIELD_MATRIX"] = 8] = "SHIELD_MATRIX";
        EliteType[EliteType["VOID_CORRUPTION"] = 9] = "VOID_CORRUPTION";
        EliteType[EliteType["EXPLOSIVE_MINE"] = 10] = "EXPLOSIVE_MINE";
        EliteType[EliteType["ICE_AGE"] = 11] = "ICE_AGE";
        EliteType[EliteType["FIRE_STORM"] = 12] = "FIRE_STORM";
        EliteType[EliteType["ELECTRIC_GRID"] = 13] = "ELECTRIC_GRID";
        EliteType[EliteType["POISON_CLOUD"] = 14] = "POISON_CLOUD";
        EliteType[EliteType["CRYSTAL_PRISON"] = 15] = "CRYSTAL_PRISON";
        EliteType[EliteType["RUBBER_NIGHTMARE"] = 16] = "RUBBER_NIGHTMARE";
        EliteType[EliteType["METAL_FORTRESS"] = 17] = "METAL_FORTRESS";
        EliteType[EliteType["LIGHT_PUZZLE"] = 18] = "LIGHT_PUZZLE";
        EliteType[EliteType["DARK_LABYRINTH"] = 19] = "DARK_LABYRINTH";
        return EliteType;
      }({}));

      _export("HiddenBossType", HiddenBossType = /*#__PURE__*/function (HiddenBossType) {
        HiddenBossType[HiddenBossType["ANCIENT_GUARDIAN"] = 0] = "ANCIENT_GUARDIAN";
        HiddenBossType[HiddenBossType["VOID_LORD"] = 1] = "VOID_LORD";
        HiddenBossType[HiddenBossType["TIME_WEAVER"] = 2] = "TIME_WEAVER";
        HiddenBossType[HiddenBossType["ELEMENTAL_AVATAR"] = 3] = "ELEMENTAL_AVATAR";
        HiddenBossType[HiddenBossType["MIRROR_SHADOW"] = 4] = "MIRROR_SHADOW";
        return HiddenBossType;
      }({}));

      _export("EliteAndHiddenBossManager", EliteAndHiddenBossManager = (_dec = ccclass('EliteAndHiddenBossManager'), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Prefab
      }), _dec(_class = (_class2 = class EliteAndHiddenBossManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "enhancedBossPrefab", _descriptor, this);

          _initializerDefineProperty(this, "enhancedBrickPrefab", _descriptor2, this);

          // Elite level configurations
          this._eliteConfigs = new Map();
          // Hidden boss configurations
          this._hiddenBossConfigs = new Map();
          // Unlock tracking
          this._unlockedHiddenBosses = new Set();
          this._playerStats = {
            perfectRuns: 0,
            collectedRelics: new Set(),
            timeRecords: new Map(),
            usedElements: new Set(),
            secretSequence: []
          };
        }

        onLoad() {
          this.initializeEliteConfigs();
          this.initializeHiddenBossConfigs();
          this.loadUnlockProgress();
        }

        initializeEliteConfigs() {
          // Elite Type 0-4: Basic Elite Mechanics
          this._eliteConfigs.set(EliteType.BRICK_FORTRESS, {
            name: "砖块要塞",
            description: "大量强化砖块构成的坚固防线",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).METAL],
            specialMechanic: "fortress_defense"
          });

          this._eliteConfigs.set(EliteType.SPEED_DEMON, {
            name: "速度恶魔",
            description: "快速移动的球和压迫性时间限制",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.6,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).TIME, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).GRAVITY],
            specialMechanic: "speed_pressure"
          });

          this._eliteConfigs.set(EliteType.REGENERATOR, {
            name: "再生者",
            description: "砖块持续自我修复的噩梦关卡",
            difficultyMultiplier: 1.5,
            specialBrickRatio: 0.7,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).HEALING, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPERIENCE],
            specialMechanic: "regeneration_field"
          });

          this._eliteConfigs.set(EliteType.ELEMENTAL_CHAOS, {
            name: "元素混沌",
            description: "随机元素效果不断变化",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.9,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).FIRE,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ICE, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).POISON],
            specialMechanic: "elemental_chaos"
          });

          this._eliteConfigs.set(EliteType.GRAVITY_ANOMALY, {
            name: "重力异常",
            description: "重力场持续扭曲变化",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.6,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).GRAVITY,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).MAGNETIC, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE],
            specialMechanic: "gravity_chaos"
          }); // Elite Type 5-9: Advanced Elite Mechanics


          this._eliteConfigs.set(EliteType.TIME_DISTORTION, {
            name: "时间扭曲",
            description: "时间流速随机变化，考验反应能力",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).TIME,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).TELEPORT],
            specialMechanic: "time_chaos"
          });

          this._eliteConfigs.set(EliteType.PHASE_SHIFTER, {
            name: "相位转换者",
            description: "砖块随机在可见和不可见间切换",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).TELEPORT, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID],
            specialMechanic: "phase_shifting"
          });

          this._eliteConfigs.set(EliteType.MAGNETIC_STORM, {
            name: "磁暴",
            description: "强磁场持续影响球的轨迹",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).MAGNETIC,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).METAL],
            specialMechanic: "magnetic_chaos"
          });

          this._eliteConfigs.set(EliteType.SHIELD_MATRIX, {
            name: "护盾矩阵",
            description: "砖块互相提供护盾保护",
            difficultyMultiplier: 1.5,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING],
            specialMechanic: "shield_network"
          });

          this._eliteConfigs.set(EliteType.VOID_CORRUPTION, {
            name: "虚空腐蚀",
            description: "虚空砖块持续扩散腐蚀其他砖块",
            difficultyMultiplier: 1.6,
            specialBrickRatio: 0.5,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).DARK, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).CURSED],
            specialMechanic: "void_spread"
          }); // Elite Type 10-14: Elemental Elite Mechanics


          this._eliteConfigs.set(EliteType.EXPLOSIVE_MINE, {
            name: "爆炸地雷",
            description: "连锁爆炸威力巨大",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.6,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).FIRE, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).CRYSTAL],
            specialMechanic: "chain_explosion"
          });

          this._eliteConfigs.set(EliteType.ICE_AGE, {
            name: "冰河时代",
            description: "冰冻效果持续扩散",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ICE,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).CRYSTAL, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).TIME],
            specialMechanic: "ice_spread"
          });

          this._eliteConfigs.set(EliteType.FIRE_STORM, {
            name: "火焰风暴",
            description: "火焰持续伤害和蔓延",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).FIRE,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).LIGHT],
            specialMechanic: "fire_spread"
          });

          this._eliteConfigs.set(EliteType.ELECTRIC_GRID, {
            name: "电网",
            description: "电流在砖块间形成复杂网络",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).METAL, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).CRYSTAL],
            specialMechanic: "electric_network"
          });

          this._eliteConfigs.set(EliteType.POISON_CLOUD, {
            name: "毒云",
            description: "毒素持续扩散和累积",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.7,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).POISON,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).DARK, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID],
            specialMechanic: "poison_spread"
          }); // Elite Type 15-19: Special Material Elite Mechanics


          this._eliteConfigs.set(EliteType.CRYSTAL_PRISON, {
            name: "水晶监狱",
            description: "水晶砖块形成复杂连锁反应",
            difficultyMultiplier: 1.5,
            specialBrickRatio: 0.9,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).CRYSTAL,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).LIGHT, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC],
            specialMechanic: "crystal_network"
          });

          this._eliteConfigs.set(EliteType.RUBBER_NIGHTMARE, {
            name: "橡胶噩梦",
            description: "超强反弹效果让球难以控制",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).RUBBER,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).BOUNCY, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).MAGNETIC],
            specialMechanic: "hyper_bounce"
          });

          this._eliteConfigs.set(EliteType.METAL_FORTRESS, {
            name: "金属要塞",
            description: "金属砖块反弹攻击伤害",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.7,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).METAL,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD],
            specialMechanic: "damage_reflection"
          });

          this._eliteConfigs.set(EliteType.LIGHT_PUZZLE, {
            name: "光影谜题",
            description: "特殊视觉效果和光线机制",
            difficultyMultiplier: 1.3,
            specialBrickRatio: 0.6,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).LIGHT,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).CRYSTAL, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE],
            specialMechanic: "light_mechanics"
          });

          this._eliteConfigs.set(EliteType.DARK_LABYRINTH, {
            name: "黑暗迷宫",
            description: "视野限制增加游戏难度",
            difficultyMultiplier: 1.4,
            specialBrickRatio: 0.8,
            primaryBrickType: (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).DARK,
            secondaryBrickTypes: [(_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID, (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE],
            specialMechanic: "vision_limit"
          });
        }

        initializeHiddenBossConfigs() {
          this._hiddenBossConfigs.set(HiddenBossType.ANCIENT_GUARDIAN, {
            name: "远古守护者",
            description: "沉睡千年的远古力量苏醒",
            unlockCondition: "perfect_runs_3",
            unlockDescription: "完成3次无伤通关",
            bossType: (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
              error: Error()
            }), BossType) : BossType).GUARDIAN_WALL,
            difficultyMultiplier: 2.5,
            specialReward: "legendary_relic_ancient_power"
          });

          this._hiddenBossConfigs.set(HiddenBossType.VOID_LORD, {
            name: "虚空领主",
            description: "来自虚无深渊的恐怖存在",
            unlockCondition: "collect_void_relics_5",
            unlockDescription: "收集5个虚空系遗物",
            bossType: (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
              error: Error()
            }), BossType) : BossType).TELEPORTER,
            difficultyMultiplier: 3.0,
            specialReward: "legendary_relic_void_mastery"
          });

          this._hiddenBossConfigs.set(HiddenBossType.TIME_WEAVER, {
            name: "时间编织者",
            description: "操控时间线的神秘实体",
            unlockCondition: "speed_run_records_10",
            unlockDescription: "在10个关卡创造速通记录",
            bossType: (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
              error: Error()
            }), BossType) : BossType).TIME_MANIPULATOR,
            difficultyMultiplier: 2.8,
            specialReward: "legendary_relic_time_control"
          });

          this._hiddenBossConfigs.set(HiddenBossType.ELEMENTAL_AVATAR, {
            name: "元素化身",
            description: "四大元素力量的完美融合",
            unlockCondition: "use_all_elements_100",
            unlockDescription: "使用所有元素攻击累计100次",
            bossType: (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
              error: Error()
            }), BossType) : BossType).ELEMENTAL_CHAOS,
            difficultyMultiplier: 2.7,
            specialReward: "legendary_relic_elemental_mastery"
          });

          this._hiddenBossConfigs.set(HiddenBossType.MIRROR_SHADOW, {
            name: "镜像阴影",
            description: "玩家内心黑暗面的具现化",
            unlockCondition: "secret_sequence_complete",
            unlockDescription: "在特定关卡执行神秘操作序列",
            bossType: (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
              error: Error()
            }), BossType) : BossType).MIRROR_BOSS,
            difficultyMultiplier: 3.2,
            specialReward: "legendary_relic_shadow_mastery"
          });
        }

        generateEliteLevel(eliteType, chapter, levelNumber) {
          var config = this._eliteConfigs.get(eliteType);

          if (!config) {
            console.error("Elite config not found for type: " + eliteType);
            return;
          }

          console.log("Generating Elite Level: " + config.name); // Calculate difficulty based on chapter and elite multiplier

          var baseDifficulty = 1 + (chapter - 1) * 0.5 + levelNumber * 0.1;
          var eliteDifficulty = baseDifficulty * config.difficultyMultiplier; // Generate elite-specific brick layout

          this.createEliteBrickLayout(config, eliteDifficulty); // Apply special mechanics

          this.activateEliteMechanic(config.specialMechanic, eliteDifficulty); // Update UI to show elite level info

          this.displayEliteLevelInfo(config);
        }

        createEliteBrickLayout(config, difficulty) {
          if (!this.enhancedBrickPrefab) return;
          var brickCount = Math.floor(30 + difficulty * 5); // More bricks than normal

          var specialCount = Math.floor(brickCount * config.specialBrickRatio);
          var normalCount = brickCount - specialCount; // Create primary special bricks

          var primaryCount = Math.floor(specialCount * 0.6);

          for (var i = 0; i < primaryCount; i++) {
            this.createEliteBrick(config.primaryBrickType, difficulty);
          } // Create secondary special bricks


          var secondaryCount = specialCount - primaryCount;

          for (var _i = 0; _i < secondaryCount; _i++) {
            var randomSecondary = config.secondaryBrickTypes[Math.floor(Math.random() * config.secondaryBrickTypes.length)];
            this.createEliteBrick(randomSecondary, difficulty);
          } // Create normal bricks


          for (var _i2 = 0; _i2 < normalCount; _i2++) {
            this.createEliteBrick((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL, difficulty);
          }
        }

        createEliteBrick(brickType, difficulty) {
          if (!this.enhancedBrickPrefab) return null;
          var brick = instantiate(this.enhancedBrickPrefab);
          var brickComponent = brick.getComponent(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
            error: Error()
          }), EnhancedBrick) : EnhancedBrick);

          if (brickComponent) {
            brickComponent.brickType = brickType; // Enhanced stats for elite levels

            var baseHealth = this.getEliteHealthForBrickType(brickType);
            brickComponent.health = Math.max(1, Math.floor(baseHealth * difficulty * 1.5));
            var baseScore = this.getEliteScoreForBrickType(brickType);
            brickComponent.scoreValue = Math.floor(baseScore * difficulty * 1.3);
          } // Random position within elite level bounds


          var x = math.randomRangeInt(-350, 350);
          var y = math.randomRangeInt(100, 400);
          brick.setWorldPosition(x, y, 0);
          brick.setParent(this.node.parent);
          return brick;
        }

        activateEliteMechanic(mechanic, difficulty) {
          switch (mechanic) {
            case "fortress_defense":
              this.activateFortressDefense(difficulty);
              break;

            case "speed_pressure":
              this.activateSpeedPressure(difficulty);
              break;

            case "regeneration_field":
              this.activateRegenerationField(difficulty);
              break;

            case "elemental_chaos":
              this.activateElementalChaos(difficulty);
              break;

            case "gravity_chaos":
              this.activateGravityChaos(difficulty);
              break;

            case "time_chaos":
              this.activateTimeChaos(difficulty);
              break;

            case "phase_shifting":
              this.activatePhaseShifting(difficulty);
              break;

            case "magnetic_chaos":
              this.activateMagneticChaos(difficulty);
              break;

            case "shield_network":
              this.activateShieldNetwork(difficulty);
              break;

            case "void_spread":
              this.activateVoidSpread(difficulty);
              break;
            // Additional mechanics...

            default:
              console.log("Elite mechanic not implemented: " + mechanic);
          }
        } //TODO:完成一个特殊效果的编写
        // Elite mechanic implementations


        activateFortressDefense(difficulty) {
          console.log('Fortress Defense mechanics activated'); // Fortress Defense: Periodically creates shield barriers around remaining bricks

          this.schedule(() => {
            var _this$node$parent;

            var allBricks = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick)) || [];
            var activeBricks = allBricks.filter(brick => brick.node.active && brick.health > 0); // Create shield effect for 30% of remaining bricks

            var shieldCount = Math.floor(activeBricks.length * 0.3);

            for (var i = 0; i < shieldCount; i++) {
              var randomBrick = activeBricks[Math.floor(Math.random() * activeBricks.length)];

              if (randomBrick) {
                // Add temporary shield (implementation would add visual effect and damage immunity)
                this.addShieldEffect(randomBrick, 5000); // 5 seconds shield
              }
            }
          }, 8, 10, 2); // Every 8 seconds, max 10 times, start after 2 seconds
        }

        activateSpeedPressure(difficulty) {
          console.log('Speed Pressure mechanics activated'); // Speed Pressure: Gradually increases ball speed and adds time pressure

          var speedMultiplier = 1.0;
          var maxSpeedMultiplier = 1.5 + difficulty * 0.1;
          this.schedule(() => {
            var _this$node$parent2;

            speedMultiplier = Math.min(speedMultiplier + 0.1, maxSpeedMultiplier); // Apply speed boost to all balls

            var allBalls = ((_this$node$parent2 = this.node.parent) == null ? void 0 : _this$node$parent2.getComponentsInChildren(EnhancedBall)) || [];
            allBalls.forEach(ball => {
              if (ball.rigidBody) {
                var currentVelocity = ball.rigidBody.linearVelocity;
                currentVelocity.multiplyScalar(1.1); // 10% speed increase

                ball.rigidBody.linearVelocity = currentVelocity;
              }
            }); // Add time pressure visual effect

            this.addTimePressureEffect(speedMultiplier);
          }, 3, 15, 1); // Every 3 seconds, increase speed
        }

        activateRegenerationField(difficulty) {
          console.log('Regeneration Field mechanics activated'); // Regeneration Field: Damaged bricks slowly regenerate health

          var regenRate = Math.floor(1 + difficulty * 0.5); // Health points per interval

          this.schedule(() => {
            var _this$node$parent3;

            var allBricks = ((_this$node$parent3 = this.node.parent) == null ? void 0 : _this$node$parent3.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick)) || [];
            allBricks.forEach(brick => {
              if (brick.node.active && brick.health > 0 && brick.health < brick.maxHealth) {
                brick.health = Math.min(brick.health + regenRate, brick.maxHealth); // Add regeneration visual effect

                this.addRegenerationEffect(brick);
              }
            });
          }, 2, Number.MAX_VALUE, 0); // Every 2 seconds, indefinitely
        }

        activateElementalChaos(difficulty) {
          console.log('Elemental Chaos mechanics activated'); // Elemental Chaos: Random elemental effects applied to random areas

          var elements = ['fire', 'ice', 'electric', 'poison'];
          this.schedule(() => {
            var randomElement = elements[Math.floor(Math.random() * elements.length)];
            var effectRadius = 100 + difficulty * 20; // Random position in game area

            var randomX = (Math.random() - 0.5) * 700; // Assume game width ~700

            var randomY = Math.random() * 400 + 100; // Height range

            var effectPos = {
              x: randomX,
              y: randomY
            }; // Apply elemental effect to nearby bricks and balls

            this.applyElementalEffect(randomElement, effectPos, effectRadius, difficulty);
          }, 5, 20, 3); // Every 5 seconds, max 20 times, start after 3 seconds
        }

        activateGravityChaos(difficulty) {
          console.log('Gravity Chaos mechanics activated'); // Gravity Chaos: Periodically changes gravity direction and strength

          var gravityDirections = [{
            x: 0,
            y: -320
          }, // Normal down
          {
            x: 0,
            y: 320
          }, // Up
          {
            x: -320,
            y: 0
          }, // Left
          {
            x: 320,
            y: 0
          }, // Right
          {
            x: 0,
            y: -160
          } // Reduced down
          ];
          this.schedule(() => {
            var randomGravity = gravityDirections[Math.floor(Math.random() * gravityDirections.length)]; // Apply gravity change (would need physics world access)

            this.applyGravityChange(randomGravity, 3000); // 3 seconds duration
            // Visual indicator of gravity change

            this.showGravityChangeEffect(randomGravity);
          }, 8, 10, 4); // Every 8 seconds, max 10 changes
        }

        activateTimeChaos(difficulty) {
          console.log('Time Chaos mechanics activated'); // Time Chaos: Game speed fluctuates randomly

          var speedVariations = [0.5, 0.7, 1.0, 1.3, 1.5];
          this.schedule(() => {
            var newTimeScale = speedVariations[Math.floor(Math.random() * speedVariations.length)]; // Apply time scale change (would affect all game objects)

            this.applyTimeScale(newTimeScale, 4000); // 4 seconds duration
            // Visual time distortion effect

            this.showTimeDistortionEffect(newTimeScale);
          }, 6, 15, 2); // Every 6 seconds
        }

        activatePhaseShifting(difficulty) {
          console.log('Phase Shifting mechanics activated'); // Phase Shifting: Bricks randomly become intangible for short periods

          this.schedule(() => {
            var _this$node$parent4;

            var allBricks = ((_this$node$parent4 = this.node.parent) == null ? void 0 : _this$node$parent4.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick)) || [];
            var phaseCount = Math.floor(allBricks.length * 0.2); // 20% of bricks

            for (var i = 0; i < phaseCount; i++) {
              var randomBrick = allBricks[Math.floor(Math.random() * allBricks.length)];

              if (randomBrick && randomBrick.node.active) {
                // Make brick intangible
                this.makePhaseShifted(randomBrick, 3000); // 3 seconds intangible
              }
            }
          }, 7, 12, 3); // Every 7 seconds
        }

        activateMagneticChaos(difficulty) {
          console.log('Magnetic Chaos mechanics activated'); // Magnetic Chaos: Creates magnetic fields that affect ball trajectory

          this.schedule(() => {
            var magneticStrength = 50 + difficulty * 20;
            var fieldCount = 2 + Math.floor(difficulty * 0.5);

            for (var i = 0; i < fieldCount; i++) {
              var fieldX = (Math.random() - 0.5) * 600;
              var fieldY = Math.random() * 300 + 150; // Create magnetic field effect

              this.createMagneticField(fieldX, fieldY, magneticStrength, 5000); // 5 seconds
            }
          }, 10, 8, 2); // Every 10 seconds
        }

        activateShieldNetwork(difficulty) {
          var _this$node$parent5;

          console.log('Shield Network mechanics activated'); // Shield Network: Bricks share shield protection with nearby bricks

          var allBricks = ((_this$node$parent5 = this.node.parent) == null ? void 0 : _this$node$parent5.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
            error: Error()
          }), EnhancedBrick) : EnhancedBrick)) || [];
          var networkRange = 150; // Distance for shield sharing
          // Create shield networks

          var networks = [];
          allBricks.forEach(brick => {
            if (!brick.node.active) return; // Find nearby bricks

            var nearbyBricks = allBricks.filter(otherBrick => {
              if (otherBrick === brick || !otherBrick.node.active) return false;
              var distance = this.getDistance(brick.node.position, otherBrick.node.position);
              return distance <= networkRange;
            });

            if (nearbyBricks.length > 0) {
              networks.push([brick, ...nearbyBricks]);
            }
          }); // Apply shield network effects

          networks.forEach(network => {
            this.createShieldNetwork(network, difficulty);
          });
        }

        activateVoidSpread(difficulty) {
          console.log('Void Spread mechanics activated'); // Void Spread: Void effect spreads to adjacent bricks over time

          var spreadInterval = Math.max(3, 6 - difficulty); // Faster spread with higher difficulty

          this.schedule(() => {
            var _this$node$parent6;

            var allBricks = ((_this$node$parent6 = this.node.parent) == null ? void 0 : _this$node$parent6.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
              error: Error()
            }), EnhancedBrick) : EnhancedBrick)) || [];
            var voidBricks = allBricks.filter(brick => brick.node.active && brick.brickType === (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID);
            voidBricks.forEach(voidBrick => {
              // Find adjacent bricks to corrupt
              var adjacentBricks = this.getAdjacentBricks(voidBrick, allBricks, 120);
              adjacentBricks.forEach(adjacentBrick => {
                if (adjacentBrick.brickType !== (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
                  error: Error()
                }), BrickType) : BrickType).VOID && Math.random() < 0.3) {
                  // Convert to void brick with corruption effect
                  this.corruptToVoid(adjacentBrick);
                }
              });
            });
          }, spreadInterval, 20, 1); // Spread every few seconds
        } // Hidden Boss Management


        checkHiddenBossUnlocks() {
          for (var [bossType, config] of this._hiddenBossConfigs.entries()) {
            if (!this._unlockedHiddenBosses.has(bossType)) {
              if (this.checkUnlockCondition(config.unlockCondition)) {
                this.unlockHiddenBoss(bossType);
              }
            }
          }
        }

        checkUnlockCondition(condition) {
          switch (condition) {
            case "perfect_runs_3":
              return this._playerStats.perfectRuns >= 3;

            case "collect_void_relics_5":
              return Array.from(this._playerStats.collectedRelics).filter(relic => relic.includes('void')).length >= 5;

            case "speed_run_records_10":
              return this._playerStats.timeRecords.size >= 10;

            case "use_all_elements_100":
              return this._playerStats.usedElements.size >= 4 && Array.from(this._playerStats.usedElements).length >= 100;

            case "secret_sequence_complete":
              return this.checkSecretSequence();

            default:
              return false;
          }
        }

        checkSecretSequence() {
          var requiredSequence = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
          if (this._playerStats.secretSequence.length < requiredSequence.length) return false;

          var lastSequence = this._playerStats.secretSequence.slice(-requiredSequence.length);

          return JSON.stringify(lastSequence) === JSON.stringify(requiredSequence);
        }

        unlockHiddenBoss(bossType) {
          this._unlockedHiddenBosses.add(bossType);

          var config = this._hiddenBossConfigs.get(bossType);

          console.log("Hidden Boss Unlocked: " + (config == null ? void 0 : config.name));
          this.showHiddenBossUnlockNotification(config);
          this.saveUnlockProgress();
        }

        spawnHiddenBoss(bossType, chapter) {
          if (!this._unlockedHiddenBosses.has(bossType) || !this.enhancedBossPrefab) {
            return null;
          }

          var config = this._hiddenBossConfigs.get(bossType);

          if (!config) return null;
          var boss = instantiate(this.enhancedBossPrefab);
          var bossController = boss.getComponent(_crd && EnhancedBossController === void 0 ? (_reportPossibleCrUseOfEnhancedBossController({
            error: Error()
          }), EnhancedBossController) : EnhancedBossController);

          if (bossController) {
            bossController.bossType = config.bossType;
            bossController.chapter = chapter; // Apply hidden boss difficulty scaling

            var baseDifficulty = 100 + chapter * 50;
            bossController.maxHealth = Math.floor(baseDifficulty * config.difficultyMultiplier);
            bossController.attackPower = Math.floor(20 * config.difficultyMultiplier);
          }

          boss.setParent(this.node.parent);
          boss.setWorldPosition(0, 300, 0);
          console.log("Hidden Boss Spawned: " + config.name);
          return boss;
        } // Player stats tracking for unlock conditions


        recordPerfectRun() {
          this._playerStats.perfectRuns++;
          this.checkHiddenBossUnlocks();
        }

        recordRelicCollected(relicName) {
          this._playerStats.collectedRelics.add(relicName);

          this.checkHiddenBossUnlocks();
        }

        recordSpeedRun(level, time) {
          var currentRecord = this._playerStats.timeRecords.get(level);

          if (!currentRecord || time < currentRecord) {
            this._playerStats.timeRecords.set(level, time);

            this.checkHiddenBossUnlocks();
          }
        }

        recordElementUsed(element) {
          this._playerStats.usedElements.add(element);

          this.checkHiddenBossUnlocks();
        }

        recordSecretInput(input) {
          this._playerStats.secretSequence.push(input); // Keep only last 20 inputs to prevent memory issues


          if (this._playerStats.secretSequence.length > 20) {
            this._playerStats.secretSequence.shift();
          }

          this.checkHiddenBossUnlocks();
        } // Utility methods


        getEliteHealthForBrickType(brickType) {
          switch (brickType) {
            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL:
              return 2;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED:
              return 5;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD:
              return 7;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).METAL:
              return 8;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING:
              return 4;

            default:
              return 3;
          }
        }

        getEliteScoreForBrickType(brickType) {
          switch (brickType) {
            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL:
              return 20;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED:
              return 60;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE:
              return 50;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD:
              return 80;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID:
              return 200;

            default:
              return 30;
          }
        }

        displayEliteLevelInfo(config) {
          console.log("=== ELITE LEVEL ===");
          console.log("Name: " + config.name);
          console.log("Description: " + config.description);
          console.log("Difficulty: " + config.difficultyMultiplier + "x");
          console.log("==================");
        }

        showHiddenBossUnlockNotification(config) {
          console.log("*** HIDDEN BOSS UNLOCKED ***");
          console.log(config.name + ": " + config.description);
          console.log("Reward: " + config.specialReward);
          console.log("****************************");
        }

        saveUnlockProgress() {
          // Save progress to local storage or game save system
          var saveData = {
            unlockedBosses: Array.from(this._unlockedHiddenBosses),
            playerStats: {
              perfectRuns: this._playerStats.perfectRuns,
              collectedRelics: Array.from(this._playerStats.collectedRelics),
              timeRecords: Array.from(this._playerStats.timeRecords.entries()),
              usedElements: Array.from(this._playerStats.usedElements),
              secretSequence: this._playerStats.secretSequence
            }
          }; // In a real implementation, this would use proper save system

          console.log('Progress saved:', saveData);
        }

        loadUnlockProgress() {
          // Load progress from save system
          // For now, just initialize empty state
          console.log('Unlock progress loaded');
        } // Public accessors


        getEliteConfig(eliteType) {
          return this._eliteConfigs.get(eliteType);
        }

        getHiddenBossConfig(bossType) {
          return this._hiddenBossConfigs.get(bossType);
        }

        isHiddenBossUnlocked(bossType) {
          return this._unlockedHiddenBosses.has(bossType);
        }

        getAllUnlockedHiddenBosses() {
          return Array.from(this._unlockedHiddenBosses);
        }

        getPlayerStats() {
          return _extends({}, this._playerStats);
        } // Helper methods for elite mechanics


        addShieldEffect(brick, duration) {
          // Add visual shield effect and temporary damage immunity
          console.log("Adding shield to brick " + brick.node.name + " for " + duration + "ms"); // Implementation would add particle effect and modify damage handling
        }

        addTimePressureEffect(speedMultiplier) {
          // Add visual indicators for increased speed/pressure
          console.log("Time pressure effect: " + speedMultiplier + "x speed"); // Implementation would add screen effects, UI warnings
        }

        addRegenerationEffect(brick) {
          // Add healing particle effect
          console.log("Regenerating brick " + brick.node.name); // Implementation would show green healing particles
        }

        applyElementalEffect(element, position, radius, difficulty) {
          var _this$node$parent7, _this$node$parent8;

          console.log("Applying " + element + " effect at (" + position.x + ", " + position.y + ") with radius " + radius); // Find all bricks and balls within radius

          var allBricks = ((_this$node$parent7 = this.node.parent) == null ? void 0 : _this$node$parent7.getComponentsInChildren(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
            error: Error()
          }), EnhancedBrick) : EnhancedBrick)) || [];
          var allBalls = ((_this$node$parent8 = this.node.parent) == null ? void 0 : _this$node$parent8.getComponentsInChildren(EnhancedBall)) || []; // Apply effects based on element type

          [...allBricks, ...allBalls].forEach(target => {
            var distance = Math.sqrt(Math.pow(target.node.position.x - position.x, 2) + Math.pow(target.node.position.y - position.y, 2));

            if (distance <= radius) {
              switch (element) {
                case 'fire':
                  // Apply fire damage over time
                  this.applyBurnEffect(target, difficulty * 2, 3000);
                  break;

                case 'ice':
                  // Apply slow effect
                  this.applyFreezeEffect(target, 0.5, 2000);
                  break;

                case 'electric':
                  // Apply chain lightning
                  this.applyElectricEffect(target, difficulty, radius);
                  break;

                case 'poison':
                  // Apply poison damage
                  this.applyPoisonEffect(target, difficulty, 4000);
                  break;
              }
            }
          });
        }

        applyGravityChange(newGravity, duration) {
          console.log("Changing gravity to (" + newGravity.x + ", " + newGravity.y + ") for " + duration + "ms"); // Implementation would access physics world and change gravity
        }

        showGravityChangeEffect(gravity) {
          console.log("Showing gravity change effect for direction (" + gravity.x + ", " + gravity.y + ")"); // Implementation would show directional arrows and visual effects
        }

        applyTimeScale(timeScale, duration) {
          console.log("Changing time scale to " + timeScale + " for " + duration + "ms"); // Implementation would affect all scheduled actions and animations
        }

        showTimeDistortionEffect(timeScale) {
          console.log("Showing time distortion effect: " + timeScale + "x speed"); // Implementation would add visual warping effects
        }

        makePhaseShifted(brick, duration) {
          console.log("Making brick " + brick.node.name + " phase-shifted for " + duration + "ms"); // Implementation would disable collider and add transparency effect

          var collider = brick.getComponent('Collider2D');

          if (collider) {
            collider.enabled = false;
            this.scheduleOnce(() => {
              if (collider && brick.node.isValid) {
                collider.enabled = true;
              }
            }, duration / 1000);
          }
        }

        createMagneticField(x, y, strength, duration) {
          console.log("Creating magnetic field at (" + x + ", " + y + ") with strength " + strength + " for " + duration + "ms"); // Implementation would create invisible node that affects nearby balls
        }

        getDistance(pos1, pos2) {
          return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
        }

        createShieldNetwork(network, difficulty) {
          console.log("Creating shield network with " + network.length + " bricks"); // Implementation would create shared damage reduction system
        }

        getAdjacentBricks(centerBrick, allBricks, maxDistance) {
          return allBricks.filter(brick => {
            if (brick === centerBrick || !brick.node.active) return false;
            var distance = this.getDistance(centerBrick.node.position, brick.node.position);
            return distance <= maxDistance;
          });
        }

        corruptToVoid(brick) {
          console.log("Corrupting brick " + brick.node.name + " to void type");
          brick.brickType = (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).VOID; // Implementation would change brick appearance and behavior
        }

        applyBurnEffect(target, damage, duration) {
          console.log("Applying burn effect: " + damage + " damage over " + duration + "ms"); // Implementation would apply damage over time
        }

        applyFreezeEffect(target, slowFactor, duration) {
          console.log("Applying freeze effect: " + slowFactor + "x speed for " + duration + "ms"); // Implementation would reduce movement/animation speed
        }

        applyElectricEffect(target, damage, radius) {
          console.log("Applying electric effect: " + damage + " damage with " + radius + " chain radius"); // Implementation would create chain lightning to nearby targets
        }

        applyPoisonEffect(target, damage, duration) {
          console.log("Applying poison effect: " + damage + " damage over " + duration + "ms"); // Implementation would apply continuous poison damage
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enhancedBossPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enhancedBrickPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=db426e01f619b3627a3d6b044fc1d3cbc4b24d0c.js.map