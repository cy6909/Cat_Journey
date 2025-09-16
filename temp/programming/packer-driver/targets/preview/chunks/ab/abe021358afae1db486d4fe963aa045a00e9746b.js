System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Button, Color, tween, Vec3, Node, Label, AudioManager, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, MainMenuButton;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAudioManager(extras) {
    _reporterNs.report("AudioManager", "../managers/AudioManager", _context.meta, extras);
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
      Button = _cc.Button;
      Color = _cc.Color;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Node = _cc.Node;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "07417HEZdZEiKk3u/cEHLNN", "MainMenuButton", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Button', 'Color', 'tween', 'Vec3', 'UITransform', 'Node', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MainMenuButton", MainMenuButton = (_dec = ccclass('MainMenuButton'), _dec(_class = (_class2 = class MainMenuButton extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "buttonType", _descriptor, this);

          _initializerDefineProperty(this, "enableSoundEffects", _descriptor2, this);

          _initializerDefineProperty(this, "enableClickAnimation", _descriptor3, this);

          _initializerDefineProperty(this, "enableHoverEffect", _descriptor4, this);

          // 按钮颜色配置
          _initializerDefineProperty(this, "normalColor", _descriptor5, this);

          _initializerDefineProperty(this, "hoverColor", _descriptor6, this);

          _initializerDefineProperty(this, "pressedColor", _descriptor7, this);

          _initializerDefineProperty(this, "disabledColor", _descriptor8, this);

          this.button = null;
          this.isHovered = false;
          this.originalScale = new Vec3(1, 1, 1);
        }

        onLoad() {
          this.button = this.node.getComponent(Button);

          if (this.button) {
            this.setupButtonStyle();
            this.bindEvents();
            this.originalScale = this.node.scale.clone();
          } else {
            console.warn('MainMenuButton: No Button component found');
          }
        }

        setupButtonStyle() {
          if (!this.button) return;
          this.button.transition = Button.Transition.COLOR;
          this.button.normalColor = this.normalColor;
          this.button.hoverColor = this.hoverColor;
          this.button.pressedColor = this.pressedColor;
          this.button.disabledColor = this.disabledColor; // 设置按钮动画持续时间

          this.button.duration = 0.1;
        }

        bindEvents() {
          if (!this.button) return; // 点击事件

          this.node.on(Button.EventType.CLICK, this.onButtonClick, this); // 悬停事件（如果支持）

          if (this.enableHoverEffect) {
            this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
          } // 触摸事件（移动端）


          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onButtonClick() {
          // 播放点击音效
          if (this.enableSoundEffects) {
            var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).instance;

            if (audioManager) {
              audioManager.playUISFX('click');
            }
          } // 点击动画


          if (this.enableClickAnimation) {
            this.playClickAnimation();
          } // 处理按钮功能


          this.handleButtonFunction();
        }

        onMouseEnter() {
          if (!this.isHovered && this.enableHoverEffect) {
            this.isHovered = true; // 播放悬停音效

            if (this.enableSoundEffects) {
              var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
                error: Error()
              }), AudioManager) : AudioManager).instance;

              if (audioManager) {
                audioManager.playUISFX('hover');
              }
            } // 悬停动画


            this.playHoverAnimation(true);
          }
        }

        onMouseLeave() {
          if (this.isHovered) {
            this.isHovered = false;
            this.playHoverAnimation(false);
          }
        }

        onTouchStart() {
          // 移动端按下效果
          this.playPressAnimation(true);
        }

        onTouchEnd() {
          // 移动端释放效果
          this.playPressAnimation(false);
        }

        onTouchCancel() {
          // 取消触摸
          this.playPressAnimation(false);
        }

        playClickAnimation() {
          // 快速缩放动画
          tween(this.node).to(0.08, {
            scale: new Vec3(0.95, 0.95, 1)
          }).to(0.12, {
            scale: this.originalScale
          }).start();
        }

        playHoverAnimation(isEntering) {
          var targetScale = isEntering ? new Vec3(1.05, 1.05, 1) : this.originalScale;
          tween(this.node).to(0.2, {
            scale: targetScale
          }).start();
        }

        playPressAnimation(isPressed) {
          var targetScale = isPressed ? new Vec3(0.98, 0.98, 1) : this.originalScale;
          tween(this.node).to(0.1, {
            scale: targetScale
          }).start();
        }

        handleButtonFunction() {
          switch (this.buttonType) {
            case "start":
              this.onStartGame();
              break;

            case "continue":
              this.onContinueGame();
              break;

            case "settings":
              this.onOpenSettings();
              break;

            case "leaderboard":
              this.onOpenLeaderboard();
              break;

            case "shop":
              this.onOpenShop();
              break;

            case "achievements":
              this.onOpenAchievements();
              break;

            case "mail":
              this.onOpenMail();
              break;

            case "help":
              this.onOpenHelp();
              break;

            default:
              console.log("Button clicked: " + this.buttonType);
          }
        }

        onStartGame() {
          console.log("开始游戏"); // TODO: 实现场景切换逻辑
          // director.loadScene('GameScene');
          // 播放成功音效

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('success');
          }
        }

        onContinueGame() {
          console.log("继续游戏"); // TODO: 加载存档并继续游戏

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('success');
          }
        }

        onOpenSettings() {
          console.log("打开设置"); // TODO: 打开设置面板

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }

        onOpenLeaderboard() {
          console.log("打开排行榜"); // TODO: 打开排行榜界面

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }

        onOpenShop() {
          console.log("打开商店"); // TODO: 打开商店界面

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }

        onOpenAchievements() {
          console.log("打开成就"); // TODO: 打开成就界面

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }

        onOpenMail() {
          console.log("打开邮件"); // TODO: 打开邮件界面

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }

        onOpenHelp() {
          console.log("打开帮助"); // TODO: 打开帮助界面

          var audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }
        /**
         * 设置按钮文本
         * @param text 按钮文本
         */


        setButtonText(text) {
          var label = this.node.getComponentInChildren(Label);

          if (label) {
            label.string = text;
          }
        }
        /**
         * 设置按钮启用状态
         * @param enabled 是否启用
         */


        setButtonEnabled(enabled) {
          if (this.button) {
            this.button.interactable = enabled;
          }
        }
        /**
         * 设置按钮类型
         * @param type 按钮类型
         */


        setButtonType(type) {
          this.buttonType = type;
        }
        /**
         * 播放自定义点击动画
         * @param intensity 动画强度
         */


        playCustomClickEffect(intensity) {
          if (intensity === void 0) {
            intensity = 1.0;
          }

          var scale = 1.0 - 0.05 * intensity;
          tween(this.node).to(0.08 * intensity, {
            scale: new Vec3(scale, scale, 1)
          }).to(0.12 * intensity, {
            scale: this.originalScale
          }).start();
        }

        onDestroy() {
          // 清理事件监听
          this.node.off(Button.EventType.CLICK, this.onButtonClick, this);
          this.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
          this.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
          this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "buttonType", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "normal";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableSoundEffects", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enableClickAnimation", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableHoverEffect", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "normalColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return Color.WHITE;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "hoverColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(100, 200, 255, 255);
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pressedColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 150, 255, 255);
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "disabledColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return Color.GRAY;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=abe021358afae1db486d4fe963aa045a00e9746b.js.map