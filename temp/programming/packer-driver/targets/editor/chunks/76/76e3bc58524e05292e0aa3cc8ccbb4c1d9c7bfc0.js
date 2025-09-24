System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, Node, AudioManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, MainMenuController;

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
      director = _cc.director;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      AudioManager = _unresolved_2.AudioManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "02738bKAMhGwJH1RdtLYg/y", "MainMenuController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MainMenuController", MainMenuController = (_dec = ccclass('MainMenuController'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class MainMenuController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "backgroundLayer", _descriptor, this);

          _initializerDefineProperty(this, "uiLayer", _descriptor2, this);

          _initializerDefineProperty(this, "audioManager", _descriptor3, this);

          _initializerDefineProperty(this, "enableAutoPlay", _descriptor4, this);

          _initializerDefineProperty(this, "preloadAudioOnStart", _descriptor5, this);
        }

        onLoad() {
          this.initializeScene();
        }

        start() {
          if (this.preloadAudioOnStart) {
            this.preloadAudioResources();
          }

          if (this.enableAutoPlay) {
            this.startBackgroundMusic();
          }

          this.startBackgroundAnimations();
        }

        initializeScene() {
          console.log("主界面场景初始化中..."); // 确保AudioManager存在并初始化

          if (this.audioManager && !(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance) {
            console.warn("AudioManager instance not found, scene may need AudioManager component");
          } // 验证必要的组件


          this.validateSceneSetup();
        }

        validateSceneSetup() {
          if (!this.backgroundLayer) {
            console.warn("MainMenuController: backgroundLayer not assigned");
          }

          if (!this.uiLayer) {
            console.warn("MainMenuController: uiLayer not assigned");
          }

          if (!this.audioManager) {
            console.warn("MainMenuController: audioManager not assigned");
          }
        }

        preloadAudioResources() {
          if (!(_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance) {
            console.warn("AudioManager not available for preloading");
            return;
          }

          const audioList = {
            bgm: ['main_theme', 'forest_theme', 'snow_theme', 'abyss_theme'],
            sfx: ['ui_click', 'ui_hover', 'ui_success', 'ui_error', 'ui_open', 'ui_close']
          };
          (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance.preloadAudio(audioList, () => {
            console.log("主界面音频资源预加载完成");
          });
        }

        startBackgroundMusic() {
          if ((_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance) {
            // 播放主题音乐，带淡入效果
            (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
              error: Error()
            }), AudioManager) : AudioManager).instance.playBGM('main_theme', true, true);
          }
        }

        startBackgroundAnimations() {
          console.log("主界面背景动画启动"); // 这里可以添加额外的场景级动画
          // 比如整体的呼吸效果、光线变化等

          this.addSceneBreathingEffect();
        }

        addSceneBreathingEffect() {
          // 添加非常轻微的整体呼吸效果
          if (this.backgroundLayer) {
            const {
              tween,
              Vec3
            } = require('cc');

            tween(this.backgroundLayer).repeatForever(tween().to(8, {
              scale: new Vec3(1.01, 1.01, 1)
            }).to(8, {
              scale: new Vec3(1.0, 1.0, 1)
            })).start();
          }
        }
        /**
         * 场景跳转方法
         */


        onStartGame() {
          this.fadeOutAndLoadScene('GameScene');
        }

        onContinueGame() {
          // TODO: 加载存档数据
          this.fadeOutAndLoadScene('GameScene');
        }

        onOpenSettings() {
          this.openPanel('SettingsPanel');
        }

        onOpenLeaderboard() {
          this.openPanel('LeaderboardPanel');
        }

        onOpenShop() {
          this.openPanel('ShopPanel');
        }

        onOpenAchievements() {
          this.openPanel('AchievementsPanel');
        }

        onOpenMail() {
          this.openPanel('MailPanel');
        }

        onOpenHelp() {
          this.openPanel('HelpPanel');
        }

        fadeOutAndLoadScene(sceneName) {
          const audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            // 音乐淡出
            audioManager.fadeBGM(0, 1.0, () => {
              const mgr = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
                error: Error()
              }), AudioManager) : AudioManager).instance;

              if (mgr) {
                mgr.stopBGM();
              }

              director.loadScene(sceneName);
            });
          } else {
            director.loadScene(sceneName);
          }
        }

        openPanel(panelName) {
          console.log(`打开面板: ${panelName}`); // TODO: 实现面板打开逻辑
          // 这里可以实例化预制体或者显示隐藏的UI面板

          const audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.playUISFX('open');
          }
        }
        /**
         * 切换背景主题（用于测试不同主题背景）
         */


        switchBackgroundTheme(themeName) {
          if (!this.backgroundLayer) return;
          console.log(`切换背景主题到: ${themeName}`); // 移除当前背景组件

          const currentBgComponents = ['StarFieldBackground', 'ForestThemeBackground', 'SnowMountainBackground', 'AbyssBackground'];
          currentBgComponents.forEach(componentName => {
            const component = this.backgroundLayer.getComponent(componentName);

            if (component) {
              this.backgroundLayer.removeComponent(component);
            }
          }); // 添加新的背景组件

          let newComponentName = '';
          let bgmName = '';

          switch (themeName) {
            case 'forest':
              newComponentName = 'ForestThemeBackground';
              bgmName = 'forest_theme';
              break;

            case 'snow':
              newComponentName = 'SnowMountainBackground';
              bgmName = 'snow_theme';
              break;

            case 'abyss':
              newComponentName = 'AbyssBackground';
              bgmName = 'abyss_theme';
              break;

            case 'space':
            default:
              newComponentName = 'StarFieldBackground';
              bgmName = 'main_theme';
              break;
          } // 这里需要动态导入对应的背景组件类
          // 在实际使用中，需要确保这些组件已经在项目中注册


          console.log(`应用背景组件: ${newComponentName}`); // 切换对应的背景音乐

          const audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager && bgmName) {
            audioManager.playBGM(bgmName, true, true);
          }
        }
        /**
         * 设置音频选项
         */


        setAudioSettings(bgmVolume, sfxVolume, enabled) {
          const audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.setBGMVolume(bgmVolume);
            audioManager.setSFXVolume(sfxVolume);
            audioManager.setAudioEnabled(enabled);
          }
        }
        /**
         * 获取当前音频状态（用于设置面板）
         */


        getAudioSettings() {
          const audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            return {
              bgmVolume: audioManager.bgmVolume,
              sfxVolume: audioManager.sfxVolume,
              enabled: audioManager.enableAudio
            };
          }

          return {
            bgmVolume: 0.8,
            sfxVolume: 1.0,
            enabled: true
          };
        }
        /**
         * 场景清理
         */


        onDestroy() {
          // 停止所有动画和音效
          const audioManager = (_crd && AudioManager === void 0 ? (_reportPossibleCrUseOfAudioManager({
            error: Error()
          }), AudioManager) : AudioManager).instance;

          if (audioManager) {
            audioManager.stopBGM();
          }

          console.log("主界面场景清理完成");
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "backgroundLayer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "uiLayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoPlay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "preloadAudioOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=76e3bc58524e05292e0aa3cc8ccbb4c1d9c7bfc0.js.map