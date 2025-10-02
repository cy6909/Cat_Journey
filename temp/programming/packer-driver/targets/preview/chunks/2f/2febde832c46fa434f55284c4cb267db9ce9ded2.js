System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, EditBox, Button, Label, input, Input, KeyCode, GameManager, DifficultyCalculator, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, DevToolsUI;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "../gameplay/GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDifficultyCalculator(extras) {
    _reporterNs.report("DifficultyCalculator", "../gameplay/DifficultySystem", _context.meta, extras);
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
      EditBox = _cc.EditBox;
      Button = _cc.Button;
      Label = _cc.Label;
      input = _cc.input;
      Input = _cc.Input;
      KeyCode = _cc.KeyCode;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      DifficultyCalculator = _unresolved_3.DifficultyCalculator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5b8dfDyZCFO2ZvQHTMir2HP", "DevToolsUI", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'EditBox', 'Button', 'Label', 'input', 'Input', 'KeyCode', 'EventKeyboard']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 开发者工具UI - 快速测试不同难度关卡
       * 使用方法:
       * 1. 按F1键切换显示/隐藏
       * 2. 在输入框输入关卡数字
       * 3. 点击"应用"按钮加载该关卡
       */

      _export("DevToolsUI", DevToolsUI = (_dec = ccclass('DevToolsUI'), _dec2 = property(EditBox), _dec3 = property(Button), _dec4 = property(Label), _dec5 = property(Node), _dec(_class = (_class2 = class DevToolsUI extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "levelInput", _descriptor, this);

          _initializerDefineProperty(this, "applyButton", _descriptor2, this);

          _initializerDefineProperty(this, "infoLabel", _descriptor3, this);

          _initializerDefineProperty(this, "panelNode", _descriptor4, this);

          // 整个面板节点，用于显示/隐藏
          this._isVisible = false;
        }

        onLoad() {
          // 初始隐藏面板
          this.hidePanel(); // 注册按钮点击事件

          if (this.applyButton) {
            this.applyButton.node.on(Button.EventType.CLICK, this.onApplyButtonClick, this);
          } // 注册键盘快捷键


          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          console.log('🛠️ DevToolsUI initialized - Press F1 to toggle');
        }

        onDestroy() {
          // 清理事件监听
          if (this.applyButton) {
            this.applyButton.node.off(Button.EventType.CLICK, this.onApplyButtonClick, this);
          }

          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        }
        /**
         * 键盘事件处理
         */


        onKeyDown(event) {
          switch (event.keyCode) {
            case KeyCode.F1:
              // F1切换显示/隐藏
              this.togglePanel();
              break;

            case KeyCode.ESCAPE:
              // Esc关闭面板
              if (this._isVisible) {
                this.hidePanel();
              }

              break;

            case KeyCode.ENTER:
              // Enter键快速应用
              if (this._isVisible && this.levelInput && this.levelInput.string) {
                this.onApplyButtonClick();
              }

              break;
          }
        }
        /**
         * 切换面板显示/隐藏
         */


        togglePanel() {
          if (this._isVisible) {
            this.hidePanel();
          } else {
            this.showPanel();
          }
        }
        /**
         * 显示面板
         */


        showPanel() {
          if (this.panelNode) {
            this.panelNode.active = true;
            this._isVisible = true;
            console.log('🛠️ DevTools panel opened'); // 聚焦输入框

            if (this.levelInput) {
              this.levelInput.focus();
            }
          }
        }
        /**
         * 隐藏面板
         */


        hidePanel() {
          if (this.panelNode) {
            this.panelNode.active = false;
            this._isVisible = false;
            console.log('🛠️ DevTools panel closed');
          }
        }
        /**
         * 应用按钮点击事件
         */


        onApplyButtonClick() {
          if (!this.levelInput || !this.levelInput.string) {
            console.warn('⚠️ Please enter a level number');
            this.updateInfoLabel('请输入关卡数字');
            return;
          }

          var level = parseInt(this.levelInput.string); // 验证输入

          if (isNaN(level) || level < 1) {
            console.warn('⚠️ Invalid level number:', this.levelInput.string);
            this.updateInfoLabel('无效的关卡数字\n请输入 >= 1 的整数');
            return;
          }

          if (level > 999) {
            console.warn('⚠️ Level too high, capping at 999');
            this.updateInfoLabel('关卡数字过大\n最大999');
            return;
          } // 计算难度配置


          var config = (_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
            error: Error()
          }), DifficultyCalculator) : DifficultyCalculator).calculateDifficulty(level); // 更新信息显示

          this.updateInfoLabel((_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
            error: Error()
          }), DifficultyCalculator) : DifficultyCalculator).formatConfig(config)); // 通知GameManager加载关卡

          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            gameManager.loadLevel(level);
            console.log("\u2705 Applied level " + level);
          } else {
            console.error('❌ GameManager not found');
            this.updateInfoLabel('错误: GameManager未找到');
          }
        }
        /**
         * 更新信息标签
         */


        updateInfoLabel(text) {
          if (this.infoLabel) {
            this.infoLabel.string = text;
          }
        }
        /**
         * 公开方法 - 设置默认关卡数字
         */


        setDefaultLevel(level) {
          if (this.levelInput) {
            this.levelInput.string = level.toString();
          }
        }
        /**
         * 公开方法 - 刷新当前关卡信息显示
         */


        refreshCurrentLevelInfo() {
          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            var currentLevel = gameManager.level || 1;
            var config = (_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
              error: Error()
            }), DifficultyCalculator) : DifficultyCalculator).calculateDifficulty(currentLevel);
            this.updateInfoLabel((_crd && DifficultyCalculator === void 0 ? (_reportPossibleCrUseOfDifficultyCalculator({
              error: Error()
            }), DifficultyCalculator) : DifficultyCalculator).formatConfig(config));
            this.setDefaultLevel(currentLevel);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "levelInput", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "applyButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "infoLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "panelNode", [_dec5], {
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
//# sourceMappingURL=2febde832c46fa434f55284c4cb267db9ce9ded2.js.map