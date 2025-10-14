System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ProgressBar, Label, tween, Vec3, UIOpacity, ExperienceManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, ExperienceBar;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfExperienceManager(extras) {
    _reporterNs.report("ExperienceManager", "../managers/ExperienceManager", _context.meta, extras);
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
      ProgressBar = _cc.ProgressBar;
      Label = _cc.Label;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
    }, function (_unresolved_2) {
      ExperienceManager = _unresolved_2.ExperienceManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "55724B31RdO+osrlaV0UB8a", "ExperienceBar", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ProgressBar', 'Label', 'tween', 'Vec3', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 经验条UI组件
       *
       * 显示玩家的经验值进度和等级
       * 简洁实现，无冗余动画
       */

      _export("ExperienceBar", ExperienceBar = (_dec = ccclass('ExperienceBar'), _dec2 = property(ProgressBar), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Node), _dec(_class = (_class2 = class ExperienceBar extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "progressBar", _descriptor, this);

          _initializerDefineProperty(this, "levelLabel", _descriptor2, this);

          _initializerDefineProperty(this, "expLabel", _descriptor3, this);

          _initializerDefineProperty(this, "levelUpEffect", _descriptor4, this);

          // 升级特效节点
          this._expManager = null;
          this._lastLevel = 1;
        }

        onLoad() {
          // 初始隐藏升级特效
          if (this.levelUpEffect) {
            this.levelUpEffect.active = false;
          } // 初始化显示


          this.updateDisplay(0, 100, 1);
        }

        start() {
          // 获取经验管理器
          this._expManager = (_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
            error: Error()
          }), ExperienceManager) : ExperienceManager).getInstance();

          if (!this._expManager) {
            console.warn('ExperienceBar: ExperienceManager not found');
            return;
          } // 监听经验值变化事件


          this._expManager.on((_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
            error: Error()
          }), ExperienceManager) : ExperienceManager).EVENT_EXP_CHANGED, this.onExpChanged, this);

          this._expManager.on((_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
            error: Error()
          }), ExperienceManager) : ExperienceManager).EVENT_LEVEL_UP, this.onLevelUp, this); // 初始化显示当前状态


          this.refreshDisplay();
        }

        onDestroy() {
          // 清理事件监听
          if (this._expManager) {
            this._expManager.off((_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
              error: Error()
            }), ExperienceManager) : ExperienceManager).EVENT_EXP_CHANGED, this.onExpChanged, this);

            this._expManager.off((_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
              error: Error()
            }), ExperienceManager) : ExperienceManager).EVENT_LEVEL_UP, this.onLevelUp, this);
          }
        }
        /**
         * 经验值变化处理
         */


        onExpChanged(data) {
          this.updateDisplay(data.currentExp, data.expToNextLevel, data.level); // 平滑更新进度条

          if (this.progressBar) {
            const targetProgress = data.progress;
            tween(this.progressBar).to(0.3, {
              progress: targetProgress
            }, {
              easing: 'quadOut'
            }).start();
          }
        }
        /**
         * 升级处理
         */


        onLevelUp(data) {
          console.log(`Level Up! New level: ${data.newLevel}`); // 显示升级特效

          this.playLevelUpEffect(); // 更新等级显示

          this._lastLevel = data.newLevel;
          this.updateLevelDisplay(data.newLevel);
        }
        /**
         * 更新显示
         */


        updateDisplay(currentExp, expToNext, level) {
          // 更新等级文本
          if (this.levelLabel) {
            this.levelLabel.string = `Lv.${level}`;
          } // 更新经验值文本


          if (this.expLabel) {
            this.expLabel.string = `${Math.floor(currentExp)}/${Math.floor(expToNext)}`;
          } // 更新进度条 (初始不使用动画)


          if (this.progressBar && !this.node.activeInHierarchy) {
            this.progressBar.progress = currentExp / expToNext;
          }
        }
        /**
         * 更新等级显示
         */


        updateLevelDisplay(level) {
          if (this.levelLabel) {
            // 简单的放大缩小动画
            const originalScale = new Vec3(1, 1, 1);
            const bigScale = new Vec3(1.3, 1.3, 1);
            this.levelLabel.string = `Lv.${level}`;
            tween(this.levelLabel.node).to(0.1, {
              scale: bigScale
            }).to(0.2, {
              scale: originalScale
            }).start();
          }
        }
        /**
         * 播放升级特效
         */


        playLevelUpEffect() {
          if (!this.levelUpEffect) return; // 显示特效节点

          this.levelUpEffect.active = true; // 重置透明度

          let opacity = this.levelUpEffect.getComponent(UIOpacity);

          if (!opacity) {
            opacity = this.levelUpEffect.addComponent(UIOpacity);
          }

          opacity.opacity = 255; // 简单的淡出动画

          tween(opacity).to(0.5, {
            opacity: 255
          }).to(0.5, {
            opacity: 0
          }).call(() => {
            this.levelUpEffect.active = false;
          }).start(); // 可选：上升动画

          const startPos = new Vec3(0, 0, 0);
          const endPos = new Vec3(0, 50, 0);
          this.levelUpEffect.setPosition(startPos);
          tween(this.levelUpEffect).to(1.0, {
            position: endPos
          }).start();
        }
        /**
         * 刷新显示
         */


        refreshDisplay() {
          if (!this._expManager) return;

          const currentExp = this._expManager.getCurrentExp();

          const expToNext = this._expManager.getExpToNextLevel();

          const level = this._expManager.getCurrentLevel();

          this.updateDisplay(currentExp, expToNext, level);

          if (this.progressBar) {
            this.progressBar.progress = currentExp / expToNext;
          }
        }
        /**
         * 设置进度条颜色
         * 可根据等级改变颜色
         */


        setProgressBarColor(level) {
          if (!this.progressBar) return; // 简单的颜色分级
          // 1-10: 绿色, 11-20: 蓝色, 21-30: 紫色, 31+: 金色

          const barSprite = this.progressBar.barSprite;
          if (!barSprite) return;

          if (level <= 10) {
            barSprite.color.set(100, 255, 100); // 绿色
          } else if (level <= 20) {
            barSprite.color.set(100, 150, 255); // 蓝色
          } else if (level <= 30) {
            barSprite.color.set(200, 100, 255); // 紫色
          } else {
            barSprite.color.set(255, 215, 0); // 金色
          }
        }
        /**
         * 测试方法 - 用于开发调试
         */


        testAddExp(amount) {
          if (this._expManager) {
            this._expManager.addExperience(amount);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "expLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "levelUpEffect", [_dec5], {
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
//# sourceMappingURL=aef6f3fa296e65b8823c61b50bca8a048571da13.js.map