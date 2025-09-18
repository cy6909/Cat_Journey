System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, Label, UITransform, tween, Vec3, Color, view, Camera, Widget, ChapterTheme, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, TransitionType, LevelType, LevelTransitionManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfChapterTheme(extras) {
    _reporterNs.report("ChapterTheme", "../managers/MapManager", _context.meta, extras);
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
      Sprite = _cc.Sprite;
      Label = _cc.Label;
      UITransform = _cc.UITransform;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
      view = _cc.view;
      Camera = _cc.Camera;
      Widget = _cc.Widget;
    }, function (_unresolved_2) {
      ChapterTheme = _unresolved_2.ChapterTheme;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "40c3ekRUQtL3YVrOIbzEIDL", "LevelTransitionManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite', 'Label', 'UITransform', 'tween', 'Vec3', 'Color', 'view', 'Camera', 'Widget']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TransitionType", TransitionType = /*#__PURE__*/function (TransitionType) {
        TransitionType["FADE_TO_BLACK"] = "fade_to_black";
        TransitionType["SLIDE_LEFT"] = "slide_left";
        TransitionType["SLIDE_RIGHT"] = "slide_right";
        TransitionType["ZOOM_IN"] = "zoom_in";
        TransitionType["ZOOM_OUT"] = "zoom_out";
        TransitionType["SPIRAL"] = "spiral";
        TransitionType["SHATTER"] = "shatter";
        TransitionType["RIPPLE"] = "ripple";
        return TransitionType;
      }({}));

      _export("LevelType", LevelType = /*#__PURE__*/function (LevelType) {
        LevelType["COMBAT"] = "combat";
        LevelType["ELITE"] = "elite";
        LevelType["BOSS"] = "boss";
        LevelType["SHOP"] = "shop";
        LevelType["TREASURE"] = "treasure";
        LevelType["CAMPFIRE"] = "campfire";
        LevelType["EVENT"] = "event";
        return LevelType;
      }({}));

      _export("LevelTransitionManager", LevelTransitionManager = (_dec = ccclass('LevelTransitionManager'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: Camera
      }), _dec(_class = (_class2 = class LevelTransitionManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "transitionContainer", _descriptor, this);

          _initializerDefineProperty(this, "backgroundLayer", _descriptor2, this);

          _initializerDefineProperty(this, "contentLayer", _descriptor3, this);

          _initializerDefineProperty(this, "effectsLayer", _descriptor4, this);

          _initializerDefineProperty(this, "transitionCamera", _descriptor5, this);

          _initializerDefineProperty(this, "enableParticleEffects", _descriptor6, this);

          _initializerDefineProperty(this, "enableAudioEffects", _descriptor7, this);

          _initializerDefineProperty(this, "transitionDuration", _descriptor8, this);

          this.transitionConfigs = new Map();
          this.chapterThemes = new Map();
          this.isTransitioning = false;
          this.currentTransition = null;
        }

        onLoad() {
          this.initializeTransitionConfigs();
          this.initializeChapterThemes();
          this.setupTransitionLayers();
        }

        initializeTransitionConfigs() {
          // 普通战斗过场配置
          this.transitionConfigs.set(LevelType.COMBAT, {
            duration: 1.5,
            easing: 'quadInOut',
            effects: [{
              type: 'opacity',
              startValue: 0,
              endValue: 255,
              delay: 0,
              duration: 0.5
            }, {
              type: 'scale',
              startValue: new Vec3(0.8, 0.8, 1),
              endValue: new Vec3(1.2, 1.2, 1),
              delay: 0.2,
              duration: 0.8
            }],
            audioClips: ['battle_start', 'sword_clash'],
            preloadAssets: ['combat_background', 'combat_ui']
          }); // 精英战斗过场配置

          this.transitionConfigs.set(LevelType.ELITE, {
            duration: 2.5,
            easing: 'quartInOut',
            effects: [{
              type: 'color',
              startValue: new Color(255, 255, 255, 255),
              endValue: new Color(255, 215, 0, 255),
              // 金色
              delay: 0,
              duration: 1.0
            }, {
              type: 'rotation',
              startValue: new Vec3(0, 0, -10),
              endValue: new Vec3(0, 0, 10),
              delay: 0.5,
              duration: 1.5
            }],
            audioClips: ['elite_horn', 'thunder_rumble'],
            preloadAssets: ['elite_background', 'elite_effects']
          }); // Boss战过场配置

          this.transitionConfigs.set(LevelType.BOSS, {
            duration: 3.0,
            easing: 'sineInOut',
            effects: [{
              type: 'scale',
              startValue: new Vec3(0, 0, 1),
              endValue: new Vec3(1.5, 1.5, 1),
              delay: 0,
              duration: 2.0
            }, {
              type: 'color',
              startValue: new Color(50, 50, 50, 255),
              endValue: new Color(200, 0, 0, 255),
              // 红色威胁感
              delay: 1.0,
              duration: 2.0
            }],
            audioClips: ['boss_roar', 'dramatic_music'],
            preloadAssets: ['boss_background', 'boss_ui', 'boss_effects']
          }); // 商店过场配置

          this.transitionConfigs.set(LevelType.SHOP, {
            duration: 1.2,
            easing: 'backOut',
            effects: [{
              type: 'position',
              startValue: new Vec3(0, -500, 0),
              endValue: new Vec3(0, 0, 0),
              delay: 0,
              duration: 1.0
            }],
            audioClips: ['shop_bell', 'coin_jingle'],
            preloadAssets: ['shop_background', 'shop_items']
          }); // 宝藏过场配置

          this.transitionConfigs.set(LevelType.TREASURE, {
            duration: 2.0,
            easing: 'elasticOut',
            effects: [{
              type: 'scale',
              startValue: new Vec3(0.1, 0.1, 1),
              endValue: new Vec3(1.0, 1.0, 1),
              delay: 0.3,
              duration: 1.5
            }, {
              type: 'color',
              startValue: new Color(100, 100, 100, 255),
              endValue: new Color(255, 215, 0, 255),
              // 金色宝藏
              delay: 0.8,
              duration: 1.0
            }],
            audioClips: ['treasure_sparkle', 'chest_open'],
            preloadAssets: ['treasure_background', 'treasure_chest']
          }); // 篝火休息过场配置

          this.transitionConfigs.set(LevelType.CAMPFIRE, {
            duration: 1.8,
            easing: 'quadOut',
            effects: [{
              type: 'opacity',
              startValue: 0,
              endValue: 255,
              delay: 0,
              duration: 1.0
            }, {
              type: 'color',
              startValue: new Color(50, 50, 50, 255),
              endValue: new Color(255, 150, 50, 255),
              // 温暖橙色
              delay: 0.5,
              duration: 1.3
            }],
            audioClips: ['fire_crackle', 'peaceful_ambient'],
            preloadAssets: ['campfire_background']
          }); // 随机事件过场配置

          this.transitionConfigs.set(LevelType.EVENT, {
            duration: 1.6,
            easing: 'quartOut',
            effects: [{
              type: 'rotation',
              startValue: new Vec3(0, 0, 0),
              endValue: new Vec3(0, 0, 360),
              delay: 0,
              duration: 1.6
            }, {
              type: 'color',
              startValue: new Color(255, 255, 255, 255),
              endValue: new Color(150, 255, 150, 255),
              // 神秘绿色
              delay: 0.4,
              duration: 1.2
            }],
            audioClips: ['mystery_chime', 'wind_whisper'],
            preloadAssets: ['event_background']
          });
        }

        initializeChapterThemes() {
          // 森林章节过场主题
          this.chapterThemes.set((_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
            error: Error()
          }), ChapterTheme) : ChapterTheme).FOREST, {
            backgroundColor: new Color(20, 60, 30, 255),
            accentColor: new Color(144, 238, 144, 255),
            transitionType: TransitionType.FADE_TO_BLACK,
            particleEffects: ['falling_leaves', 'fireflies', 'pollen_drift'],
            ambientSounds: ['forest_ambient', 'bird_chirps', 'wind_rustling'],
            loadingText: '进入翠绿森林...',
            chapterTitle: '第一章：翠绿森林',
            chapterSubtitle: '古老的树木守护着失落的秘密'
          }); // 雪山章节过场主题

          this.chapterThemes.set((_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
            error: Error()
          }), ChapterTheme) : ChapterTheme).MOUNTAIN, {
            backgroundColor: new Color(30, 50, 80, 255),
            accentColor: new Color(200, 220, 255, 255),
            transitionType: TransitionType.SLIDE_LEFT,
            particleEffects: ['snowfall', 'aurora_shimmer', 'ice_crystals'],
            ambientSounds: ['mountain_wind', 'ice_crack', 'aurora_hum'],
            loadingText: '攀登冰雪山峰...',
            chapterTitle: '第二章：冰雪山峰',
            chapterSubtitle: '在严寒中寻找内心的力量'
          }); // 深渊章节过场主题

          this.chapterThemes.set((_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
            error: Error()
          }), ChapterTheme) : ChapterTheme).ABYSS, {
            backgroundColor: new Color(50, 20, 60, 255),
            accentColor: new Color(255, 100, 255, 255),
            transitionType: TransitionType.SPIRAL,
            particleEffects: ['void_rifts', 'energy_sparks', 'plasma_flows'],
            ambientSounds: ['void_whispers', 'energy_hum', 'reality_distortion'],
            loadingText: '深入虚无深渊...',
            chapterTitle: '第三章：虚无深渊',
            chapterSubtitle: '在黑暗中面对最终的挑战'
          });
        }

        setupTransitionLayers() {
          if (!this.transitionContainer) {
            this.transitionContainer = new Node('TransitionContainer');
            this.transitionContainer.setParent(this.node); // 设置全屏覆盖

            const widget = this.transitionContainer.addComponent(Widget);
            widget.isAlignLeft = widget.isAlignRight = true;
            widget.isAlignTop = widget.isAlignBottom = true;
            widget.left = widget.right = widget.top = widget.bottom = 0;
            widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
          } // 创建分层


          this.backgroundLayer = this.createLayer('BackgroundLayer', -100);
          this.contentLayer = this.createLayer('ContentLayer', 0);
          this.effectsLayer = this.createLayer('EffectsLayer', 100); // 默认隐藏过场容器

          this.transitionContainer.active = false;
        }

        createLayer(name, zIndex) {
          const layer = new Node(name);
          layer.setParent(this.transitionContainer);
          layer.setPosition(0, 0, zIndex);
          const transform = layer.addComponent(UITransform);
          const screenSize = view.getVisibleSize();
          transform.setContentSize(screenSize.width, screenSize.height);
          transform.setAnchorPoint(0.5, 0.5);
          return layer;
        } // 公共接口：开始关卡过场动画


        async startLevelTransition(fromLevel, toLevel, chapter, nodeData) {
          if (this.isTransitioning) {
            console.warn('Transition already in progress');
            return this.currentTransition || Promise.resolve();
          }

          this.isTransitioning = true;
          console.log(`Starting transition: ${fromLevel} -> ${toLevel} (Chapter: ${chapter})`);
          this.currentTransition = this.executeTransition(fromLevel, toLevel, chapter, nodeData);

          try {
            await this.currentTransition;
          } finally {
            this.isTransitioning = false;
            this.currentTransition = null;
          }
        }

        async executeTransition(fromLevel, toLevel, chapter, nodeData) {
          // 显示过场容器
          this.transitionContainer.active = true; // 第一阶段：淡出当前场景

          await this.fadeOutCurrentScene(); // 第二阶段：显示过场内容

          await this.showTransitionContent(toLevel, chapter, nodeData); // 第三阶段：预加载资源

          await this.preloadLevelAssets(toLevel); // 第四阶段：过场动画

          await this.playTransitionAnimation(toLevel, chapter); // 第五阶段：淡入新场景

          await this.fadeInNewScene(); // 隐藏过场容器

          this.transitionContainer.active = false;
          console.log('Transition completed');
        }

        async fadeOutCurrentScene() {
          return new Promise(resolve => {
            // 创建黑色遮罩
            const fadeOverlay = this.createFadeOverlay(); // 淡入黑色遮罩

            tween(fadeOverlay.getComponent(Sprite)).to(0.5, {
              color: new Color(0, 0, 0, 255)
            }).call(() => resolve()).start();
          });
        }

        createFadeOverlay() {
          const overlay = new Node('FadeOverlay');
          overlay.setParent(this.backgroundLayer);
          const transform = overlay.addComponent(UITransform);
          const screenSize = view.getVisibleSize();
          transform.setContentSize(screenSize.width, screenSize.height);
          transform.setAnchorPoint(0.5, 0.5);
          const sprite = overlay.addComponent(Sprite);
          sprite.color = new Color(0, 0, 0, 0); // 初始透明

          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          return overlay;
        }

        async showTransitionContent(levelType, chapter, nodeData) {
          const chapterTheme = this.chapterThemes.get(chapter);
          if (!chapterTheme) return; // 清理之前的内容

          this.contentLayer.removeAllChildren(); // 创建章节背景

          this.createChapterBackground(chapterTheme); // 创建关卡类型显示

          this.createLevelTypeDisplay(levelType, chapterTheme); // 创建加载文本

          this.createLoadingText(chapterTheme.loadingText); // 创建章节信息

          this.createChapterInfo(chapterTheme); // 添加特效

          if (this.enableParticleEffects) {
            this.createTransitionParticles(chapterTheme);
          }
        }

        createChapterBackground(theme) {
          const bgNode = new Node('ChapterBackground');
          bgNode.setParent(this.contentLayer);
          const transform = bgNode.addComponent(UITransform);
          const screenSize = view.getVisibleSize();
          transform.setContentSize(screenSize.width, screenSize.height);
          transform.setAnchorPoint(0.5, 0.5);
          const sprite = bgNode.addComponent(Sprite);
          sprite.color = theme.backgroundColor;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        createLevelTypeDisplay(levelType, theme) {
          const displayNode = new Node('LevelTypeDisplay');
          displayNode.setParent(this.contentLayer);
          displayNode.setPosition(0, 100, 0);
          const transform = displayNode.addComponent(UITransform);
          transform.setContentSize(300, 80);
          transform.setAnchorPoint(0.5, 0.5);
          const label = displayNode.addComponent(Label);
          label.string = this.getLevelTypeDisplayName(levelType);
          label.fontSize = 48;
          label.color = theme.accentColor; // 添加入场动画

          displayNode.setScale(0, 0, 1);
          tween(displayNode).to(0.8, {
            scale: new Vec3(1, 1, 1)
          }).start();
        }

        getLevelTypeDisplayName(levelType) {
          switch (levelType) {
            case LevelType.COMBAT:
              return '战斗关卡';

            case LevelType.ELITE:
              return '精英挑战';

            case LevelType.BOSS:
              return 'Boss战';

            case LevelType.SHOP:
              return '神秘商店';

            case LevelType.TREASURE:
              return '宝藏房间';

            case LevelType.CAMPFIRE:
              return '休息篝火';

            case LevelType.EVENT:
              return '随机事件';

            default:
              return '未知关卡';
          }
        }

        createLoadingText(loadingText) {
          const textNode = new Node('LoadingText');
          textNode.setParent(this.contentLayer);
          textNode.setPosition(0, -100, 0);
          const transform = textNode.addComponent(UITransform);
          transform.setContentSize(400, 40);
          transform.setAnchorPoint(0.5, 0.5);
          const label = textNode.addComponent(Label);
          label.string = loadingText;
          label.fontSize = 24;
          label.color = new Color(255, 255, 255, 255); // 添加脉动动画

          tween(label).repeatForever(tween().to(1.0, {
            color: new Color(255, 255, 255, 150)
          }).to(1.0, {
            color: new Color(255, 255, 255, 255)
          })).start();
        }

        createChapterInfo(theme) {
          const infoContainer = new Node('ChapterInfo');
          infoContainer.setParent(this.contentLayer);
          infoContainer.setPosition(0, -200, 0); // 章节标题

          const titleNode = new Node('ChapterTitle');
          titleNode.setParent(infoContainer);
          titleNode.setPosition(0, 20, 0);
          const titleTransform = titleNode.addComponent(UITransform);
          titleTransform.setContentSize(500, 40);
          titleTransform.setAnchorPoint(0.5, 0.5);
          const titleLabel = titleNode.addComponent(Label);
          titleLabel.string = theme.chapterTitle;
          titleLabel.fontSize = 32;
          titleLabel.color = theme.accentColor; // 章节副标题

          const subtitleNode = new Node('ChapterSubtitle');
          subtitleNode.setParent(infoContainer);
          subtitleNode.setPosition(0, -20, 0);
          const subtitleTransform = subtitleNode.addComponent(UITransform);
          subtitleTransform.setContentSize(600, 30);
          subtitleTransform.setAnchorPoint(0.5, 0.5);
          const subtitleLabel = subtitleNode.addComponent(Label);
          subtitleLabel.string = theme.chapterSubtitle;
          subtitleLabel.fontSize = 18;
          subtitleLabel.color = new Color(200, 200, 200, 255); // 入场动画

          infoContainer.setPosition(0, -300, 0);
          tween(infoContainer).delay(0.5).to(1.0, {
            position: new Vec3(0, -200, 0)
          }).start();
        }

        createTransitionParticles(theme) {
          theme.particleEffects.forEach((effectType, index) => {
            const particleNode = new Node(`Particle_${effectType}`);
            particleNode.setParent(this.effectsLayer); // 这里应该添加具体的粒子系统

            console.log(`Creating transition particle: ${effectType}`); // 延迟启动不同的粒子效果

            this.scheduleOnce(() => {
              console.log(`Starting particle effect: ${effectType}`);
            }, index * 0.3);
          });
        }

        async preloadLevelAssets(levelType) {
          const config = this.transitionConfigs.get(levelType);
          if (!config) return;
          console.log(`Preloading assets for ${levelType}:`, config.preloadAssets); // 模拟资源加载时间

          return new Promise(resolve => {
            setTimeout(() => {
              console.log('Assets preloaded successfully');
              resolve();
            }, 800);
          });
        }

        async playTransitionAnimation(levelType, chapter) {
          const config = this.transitionConfigs.get(levelType);
          const theme = this.chapterThemes.get(chapter);
          if (!config || !theme) return;
          console.log(`Playing transition animation: ${theme.transitionType}`); // 根据主题类型播放不同的过场动画

          switch (theme.transitionType) {
            case TransitionType.FADE_TO_BLACK:
              await this.playFadeTransition();
              break;

            case TransitionType.SLIDE_LEFT:
              await this.playSlideTransition('left');
              break;

            case TransitionType.SPIRAL:
              await this.playSpiralTransition();
              break;

            default:
              await this.playFadeTransition();
          }
        }

        async playFadeTransition() {
          return new Promise(resolve => {
            const duration = this.transitionDuration; // 创建渐变效果

            tween(this.contentLayer).to(duration * 0.3, {
              scale: new Vec3(1.1, 1.1, 1)
            }).to(duration * 0.4, {
              scale: new Vec3(0.9, 0.9, 1)
            }).to(duration * 0.3, {
              scale: new Vec3(1.0, 1.0, 1)
            }).call(() => resolve()).start();
          });
        }

        async playSlideTransition(direction) {
          return new Promise(resolve => {
            const screenSize = view.getVisibleSize();
            const startX = direction === 'left' ? screenSize.width : -screenSize.width;
            this.contentLayer.setPosition(startX, 0, 0);
            tween(this.contentLayer).to(this.transitionDuration, {
              position: new Vec3(0, 0, 0)
            }).call(() => resolve()).start();
          });
        }

        async playSpiralTransition() {
          return new Promise(resolve => {
            const spiralTween = tween(this.contentLayer).to(this.transitionDuration, {
              eulerAngles: new Vec3(0, 0, 720),
              // 旋转两圈
              scale: new Vec3(0.1, 0.1, 1)
            }).to(this.transitionDuration * 0.5, {
              eulerAngles: new Vec3(0, 0, 0),
              scale: new Vec3(1.0, 1.0, 1)
            }).call(() => resolve()).start();
          });
        }

        async fadeInNewScene() {
          return new Promise(resolve => {
            // 淡出过场遮罩
            const fadeOverlay = this.backgroundLayer.getChildByName('FadeOverlay');

            if (fadeOverlay) {
              const sprite = fadeOverlay.getComponent(Sprite);

              if (sprite) {
                tween(sprite).to(0.5, {
                  color: new Color(0, 0, 0, 0)
                }).call(() => {
                  fadeOverlay.destroy();
                  resolve();
                }).start();
              } else {
                resolve();
              }
            } else {
              resolve();
            }
          });
        } // 快速过场（用于非重要场景切换）


        async quickTransition(toLevel) {
          if (this.isTransitioning) return;
          this.isTransitioning = true;

          try {
            this.transitionContainer.active = true; // 简单的淡入淡出

            const overlay = this.createFadeOverlay();
            const sprite = overlay.getComponent(Sprite); // 淡入黑色

            await new Promise(resolve => {
              tween(sprite).to(0.3, {
                color: new Color(0, 0, 0, 255)
              }).call(() => resolve()).start();
            }); // 显示简单的加载信息

            this.createLoadingText(`进入${this.getLevelTypeDisplayName(toLevel)}...`); // 短暂等待

            await new Promise(resolve => {
              setTimeout(resolve, 500);
            }); // 淡出黑色

            await new Promise(resolve => {
              tween(sprite).to(0.3, {
                color: new Color(0, 0, 0, 0)
              }).call(() => {
                overlay.destroy();
                resolve();
              }).start();
            });
            this.transitionContainer.active = false;
          } finally {
            this.isTransitioning = false;
          }
        } // 章节切换特殊过场


        async chapterTransition(fromChapter, toChapter) {
          if (this.isTransitioning) return;
          console.log(`Chapter transition: ${fromChapter} -> ${toChapter}`);
          const fromTheme = this.chapterThemes.get(fromChapter);
          const toTheme = this.chapterThemes.get(toChapter);
          if (!fromTheme || !toTheme) return;
          this.isTransitioning = true;

          try {
            this.transitionContainer.active = true; // 创建章节过渡动画

            await this.playChapterTransitionSequence(fromTheme, toTheme);
            this.transitionContainer.active = false;
          } finally {
            this.isTransitioning = false;
          }
        }

        async playChapterTransitionSequence(fromTheme, toTheme) {
          // 第一阶段：展示前章节结束
          await this.showChapterEnd(fromTheme); // 第二阶段：过渡动画

          await this.playChapterBridgeAnimation(); // 第三阶段：展示新章节开始

          await this.showChapterBegin(toTheme);
        }

        async showChapterEnd(theme) {
          // 显示章节完成信息
          const endNode = new Node('ChapterEnd');
          endNode.setParent(this.contentLayer);
          const label = endNode.addComponent(Label);
          label.string = `${theme.chapterTitle} - 完成`;
          label.fontSize = 36;
          label.color = theme.accentColor;
          return new Promise(resolve => {
            tween(endNode).to(1.0, {
              scale: new Vec3(1.2, 1.2, 1)
            }).to(1.0, {
              scale: new Vec3(0.8, 0.8, 1)
            }).call(() => {
              endNode.destroy();
              resolve();
            }).start();
          });
        }

        async playChapterBridgeAnimation() {
          // 过渡动画：螺旋或漩涡效果
          return new Promise(resolve => {
            setTimeout(resolve, 1000);
          });
        }

        async showChapterBegin(theme) {
          // 显示新章节开始信息
          this.createChapterInfo(theme);
          return new Promise(resolve => {
            setTimeout(resolve, 2000);
          });
        } // 获取当前过场状态


        isCurrentlyTransitioning() {
          return this.isTransitioning;
        } // 强制停止当前过场


        forceStopTransition() {
          if (this.isTransitioning) {
            this.isTransitioning = false;
            this.transitionContainer.active = false;
            this.currentTransition = null;
            console.log('Transition force stopped');
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "transitionContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "backgroundLayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "contentLayer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "effectsLayer", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "transitionCamera", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "enableParticleEffects", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableAudioEffects", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "transitionDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=77e708640bf32a81f6c57d96114af8d21cd25be1.js.map