System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, AudioSource, AudioClip, resources, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _crd, ccclass, property, AudioManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      AudioSource = _cc.AudioSource;
      AudioClip = _cc.AudioClip;
      resources = _cc.resources;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d29aeiYNYhHb6PWR+0x4Yu3", "AudioManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'AudioSource', 'AudioClip', 'resources', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AudioManager", AudioManager = (_dec = ccclass('AudioManager'), _dec2 = property(AudioSource), _dec3 = property(AudioSource), _dec4 = property([AudioClip]), _dec(_class = (_class2 = (_class3 = class AudioManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bgmPlayer", _descriptor, this);

          _initializerDefineProperty(this, "sfxPlayer", _descriptor2, this);

          _initializerDefineProperty(this, "sfxClips", _descriptor3, this);

          _initializerDefineProperty(this, "bgmVolume", _descriptor4, this);

          _initializerDefineProperty(this, "sfxVolume", _descriptor5, this);

          _initializerDefineProperty(this, "enableAudio", _descriptor6, this);

          this.currentBGM = '';
          this.fadeTarget = 0;
          this.isFading = false;
        }

        static get instance() {
          return AudioManager._instance;
        }

        onLoad() {
          AudioManager._instance = this;
          this.initializeAudio();
        }

        onDestroy() {
          if (AudioManager._instance === this) {
            AudioManager._instance = null;
          }
        }

        initializeAudio() {
          if (!this.bgmPlayer || !this.sfxPlayer) {
            console.warn('AudioManager: BGM or SFX player not configured');
            return;
          } // 配置BGM播放器


          this.bgmPlayer.volume = this.bgmVolume;
          this.bgmPlayer.loop = true; // 配置SFX播放器

          this.sfxPlayer.volume = this.sfxVolume;
          this.sfxPlayer.loop = false;
          console.log('AudioManager initialized successfully');
        }
        /**
         * 播放背景音乐
         * @param clipName 音频文件名（不含扩展名）
         * @param loop 是否循环播放，默认true
         * @param fadeIn 是否淡入，默认false
         */


        playBGM(clipName, loop = true, fadeIn = false) {
          if (!this.enableAudio || !this.bgmPlayer) return; // 避免重复播放同一BGM

          if (this.currentBGM === clipName && this.bgmPlayer.playing) {
            return;
          }

          resources.load(`audio/bgm/${clipName}`, AudioClip, (err, clip) => {
            if (!err && clip) {
              this.currentBGM = clipName;
              this.bgmPlayer.clip = clip;
              this.bgmPlayer.loop = loop;

              if (fadeIn) {
                this.bgmPlayer.volume = 0;
                this.bgmPlayer.play();
                this.fadeBGM(this.bgmVolume, 2.0);
              } else {
                this.bgmPlayer.volume = this.bgmVolume;
                this.bgmPlayer.play();
              }

              console.log(`Playing BGM: ${clipName}`);
            } else {
              console.warn(`Failed to load BGM: ${clipName}`, err);
            }
          });
        }
        /**
         * 停止背景音乐
         * @param fadeOut 是否淡出，默认false
         */


        stopBGM(fadeOut = false) {
          if (!this.bgmPlayer) return;

          if (fadeOut) {
            this.fadeBGM(0, 1.0, () => {
              this.bgmPlayer.stop();
              this.currentBGM = '';
            });
          } else {
            this.bgmPlayer.stop();
            this.currentBGM = '';
          }
        }
        /**
         * 暂停背景音乐
         */


        pauseBGM() {
          if (this.bgmPlayer && this.bgmPlayer.playing) {
            this.bgmPlayer.pause();
          }
        }
        /**
         * 恢复背景音乐
         */


        resumeBGM() {
          if (this.bgmPlayer && !this.bgmPlayer.playing && this.currentBGM) {
            this.bgmPlayer.play();
          }
        }
        /**
         * BGM淡入淡出效果
         * @param targetVolume 目标音量
         * @param duration 持续时间（秒）
         * @param callback 完成回调
         */


        fadeBGM(targetVolume, duration = 1.0, callback) {
          if (!this.bgmPlayer || this.isFading) return;
          this.isFading = true;
          this.fadeTarget = targetVolume;
          const startVolume = this.bgmPlayer.volume;
          const volumeDiff = targetVolume - startVolume;
          const steps = duration * 60; // 假设60FPS

          const volumeStep = volumeDiff / steps;
          let currentStep = 0;
          const fadeInterval = setInterval(() => {
            currentStep++;

            if (currentStep >= steps) {
              this.bgmPlayer.volume = this.fadeTarget;
              this.isFading = false;
              clearInterval(fadeInterval);
              if (callback) callback();
            } else {
              this.bgmPlayer.volume = startVolume + volumeStep * currentStep;
            }
          }, 1000 / 60);
        }
        /**
         * 播放音效
         * @param clipName 音效名称
         * @param volume 音量倍数，默认1.0
         */


        playSFX(clipName, volume = 1.0) {
          if (!this.enableAudio || !this.sfxPlayer) return; // 首先尝试从预配置的音效列表中查找

          const clip = this.sfxClips.find(c => c && c.name === clipName);

          if (clip) {
            this.sfxPlayer.playOneShot(clip, this.sfxVolume * volume);
            console.log(`Playing SFX: ${clipName}`);
            return;
          } // 如果没有找到，尝试动态加载


          resources.load(`audio/sfx/${clipName}`, AudioClip, (err, clip) => {
            if (!err && clip) {
              this.sfxPlayer.playOneShot(clip, this.sfxVolume * volume);
              console.log(`Playing SFX (loaded): ${clipName}`);
            } else {
              console.warn(`Failed to load SFX: ${clipName}`, err);
            }
          });
        }
        /**
         * 播放UI音效
         * @param actionType 动作类型：hover, click, success, error, open, close
         */


        playUISFX(actionType) {
          const sfxMap = {
            hover: 'ui_hover',
            click: 'ui_click',
            success: 'ui_success',
            error: 'ui_error',
            open: 'ui_open',
            close: 'ui_close'
          };
          const clipName = sfxMap[actionType];

          if (clipName) {
            this.playSFX(clipName);
          }
        }
        /**
         * 设置BGM音量
         * @param volume 音量值 0.0-1.0
         */


        setBGMVolume(volume) {
          this.bgmVolume = Math.max(0, Math.min(1, volume));

          if (this.bgmPlayer) {
            this.bgmPlayer.volume = this.bgmVolume;
          }
        }
        /**
         * 设置SFX音量
         * @param volume 音量值 0.0-1.0
         */


        setSFXVolume(volume) {
          this.sfxVolume = Math.max(0, Math.min(1, volume));

          if (this.sfxPlayer) {
            this.sfxPlayer.volume = this.sfxVolume;
          }
        }
        /**
         * 设置总开关
         * @param enable 是否启用音频
         */


        setAudioEnabled(enable) {
          this.enableAudio = enable;

          if (!enable) {
            this.stopBGM();
          }
        }
        /**
         * 获取当前BGM状态
         */


        getBGMInfo() {
          return {
            name: this.currentBGM,
            playing: this.bgmPlayer ? this.bgmPlayer.playing : false,
            volume: this.bgmPlayer ? this.bgmPlayer.volume : 0
          };
        }
        /**
         * 预加载音频资源
         * @param audioList 音频文件名列表
         * @param callback 完成回调
         */


        preloadAudio(audioList, callback) {
          let loadCount = 0;
          let totalCount = 0;
          if (audioList.bgm) totalCount += audioList.bgm.length;
          if (audioList.sfx) totalCount += audioList.sfx.length;

          if (totalCount === 0) {
            if (callback) callback();
            return;
          }

          const onLoadComplete = () => {
            loadCount++;

            if (loadCount >= totalCount) {
              console.log('All audio preloaded successfully');
              if (callback) callback();
            }
          }; // 预加载BGM


          if (audioList.bgm) {
            audioList.bgm.forEach(name => {
              resources.load(`audio/bgm/${name}`, AudioClip, err => {
                if (err) console.warn(`Failed to preload BGM: ${name}`);
                onLoadComplete();
              });
            });
          } // 预加载SFX


          if (audioList.sfx) {
            audioList.sfx.forEach(name => {
              resources.load(`audio/sfx/${name}`, AudioClip, err => {
                if (err) console.warn(`Failed to preload SFX: ${name}`);
                onLoadComplete();
              });
            });
          }
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bgmPlayer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sfxPlayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sfxClips", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bgmVolume", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sfxVolume", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "enableAudio", [property], {
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
//# sourceMappingURL=93af70795a31f84dbf66493b0245a63bf6f719a0.js.map