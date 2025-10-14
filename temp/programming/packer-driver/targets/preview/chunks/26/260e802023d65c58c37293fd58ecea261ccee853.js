System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, EventTarget, GameManager, _dec, _class, _class2, _crd, ccclass, property, ExperienceManager;

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "../gameplay/GameManager", _context.meta, extras);
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
      EventTarget = _cc.EventTarget;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0d903YttgZKmqknruegsYxH", "ExperienceManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'EventTarget']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 经验值管理器 - 单例模式
       *
       * 负责管理玩家的经验值、等级和升级逻辑
       * 遵循"好品味"原则：简单、直接、无特殊情况
       */

      _export("ExperienceManager", ExperienceManager = (_dec = ccclass('ExperienceManager'), _dec(_class = (_class2 = class ExperienceManager extends Component {
        constructor() {
          super(...arguments);
          // 核心数据 - 直接存储，无冗余
          this._currentExp = 0;
          this._currentLevel = 1;
          this._expToNextLevel = 100;
          // 事件系统 - 用于通知UI更新
          this._eventTarget = new EventTarget();
          // 经验值公式常量 - 100 * (1.15)^(level-1)
          this.BASE_EXP = 100;
          this.EXP_GROWTH = 1.15;
        }

        onLoad() {
          // 单例模式 - 确保只有一个实例
          if (ExperienceManager._instance) {
            this.node.destroy();
            return;
          }

          ExperienceManager._instance = this;
        }

        onDestroy() {
          if (ExperienceManager._instance === this) {
            ExperienceManager._instance = null;
          }
        }
        /**
         * 获取单例实例
         */


        static getInstance() {
          return ExperienceManager._instance;
        }
        /**
         * 添加经验值
         * 简单直接的实现 - 没有特殊情况
         */


        addExperience(amount) {
          if (amount <= 0) return;
          this._currentExp += amount; // 检查升级 - 可能连续升级多级

          while (this._currentExp >= this._expToNextLevel) {
            this._currentExp -= this._expToNextLevel;
            this.levelUp();
          } // 触发经验值变化事件


          this._eventTarget.emit(ExperienceManager.EVENT_EXP_CHANGED, {
            currentExp: this._currentExp,
            expToNextLevel: this._expToNextLevel,
            level: this._currentLevel,
            progress: this._currentExp / this._expToNextLevel
          });
        }
        /**
         * 升级处理
         * 核心逻辑集中，无分支
         */


        levelUp() {
          this._currentLevel++;
          this._expToNextLevel = this.calculateExpRequired(this._currentLevel); // 触发升级事件

          this._eventTarget.emit(ExperienceManager.EVENT_LEVEL_UP, {
            newLevel: this._currentLevel,
            expToNextLevel: this._expToNextLevel
          }); // 应用属性提升


          this.applyLevelBonus();
        }
        /**
         * 计算指定等级所需经验值
         * 公式: 100 * (1.15)^(level-1)
         */


        calculateExpRequired(level) {
          return Math.floor(this.BASE_EXP * Math.pow(this.EXP_GROWTH, level - 1));
        }
        /**
         * 应用升级加成
         * 统一的属性提升逻辑
         */


        applyLevelBonus() {
          // 每级提升的属性
          var bonuses = {
            paddleSpeed: 1.02,
            // 移速 +2%
            paddleWidth: 1.01,
            // 宽度 +1%
            ballDamage: 1.03,
            // 伤害 +3%
            maxLives: 0.1 // 10级加1命

          }; // 通知GameManager应用加成

          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            var paddle = gameManager.getPaddle();

            if (paddle) {
              // 简单的线性提升
              var currentSpeed = paddle.speed || 300;
              paddle.speed = currentSpeed * bonuses.paddleSpeed;
            } // 每10级加1命


            if (this._currentLevel % 10 === 0) {
              gameManager.addLife(1);
            }
          }
        }
        /**
         * 重置系统
         * 用于新游戏开始
         */


        reset() {
          this._currentExp = 0;
          this._currentLevel = 1;
          this._expToNextLevel = this.BASE_EXP; // 通知UI重置

          this._eventTarget.emit(ExperienceManager.EVENT_EXP_CHANGED, {
            currentExp: 0,
            expToNextLevel: this._expToNextLevel,
            level: 1,
            progress: 0
          });
        }
        /**
         * 获取当前等级
         */


        getCurrentLevel() {
          return this._currentLevel;
        }
        /**
         * 获取当前经验值
         */


        getCurrentExp() {
          return this._currentExp;
        }
        /**
         * 获取升级所需经验值
         */


        getExpToNextLevel() {
          return this._expToNextLevel;
        }
        /**
         * 获取经验进度百分比
         */


        getExpProgress() {
          return this._currentExp / this._expToNextLevel;
        }
        /**
         * 注册事件监听
         */


        on(event, callback, target) {
          this._eventTarget.on(event, callback, target);
        }
        /**
         * 注销事件监听
         */


        off(event, callback, target) {
          this._eventTarget.off(event, callback, target);
        }
        /**
         * 预计算多个等级的经验需求
         * 用于UI显示
         */


        getExpTable(maxLevel) {
          if (maxLevel === void 0) {
            maxLevel = 20;
          }

          var table = [];

          for (var level = 1; level <= maxLevel; level++) {
            table.push(this.calculateExpRequired(level));
          }

          return table;
        }

      }, _class2._instance = null, _class2.EVENT_EXP_CHANGED = 'exp-changed', _class2.EVENT_LEVEL_UP = 'level-up', _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=260e802023d65c58c37293fd58ecea261ccee853.js.map