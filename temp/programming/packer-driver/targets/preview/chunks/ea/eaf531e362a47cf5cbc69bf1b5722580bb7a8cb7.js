System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, AudioSource, resources, AudioClip, tween, Node, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _class3, _crd, ccclass, property, SoundEffectType, LevelSoundManager;

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
      resources = _cc.resources;
      AudioClip = _cc.AudioClip;
      tween = _cc.tween;
      Node = _cc.Node;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7c2fdMzh2JMY4YmhGrTr4eJ", "LevelSoundManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'AudioSource', 'resources', 'AudioClip', 'tween', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SoundEffectType", SoundEffectType = /*#__PURE__*/function (SoundEffectType) {
        SoundEffectType["UI_CLICK"] = "ui_click";
        SoundEffectType["UI_HOVER"] = "ui_hover";
        SoundEffectType["UI_SUCCESS"] = "ui_success";
        SoundEffectType["UI_ERROR"] = "ui_error";
        SoundEffectType["UI_OPEN"] = "ui_open";
        SoundEffectType["UI_CLOSE"] = "ui_close";
        SoundEffectType["BALL_BOUNCE_PADDLE"] = "ball_bounce_paddle";
        SoundEffectType["BALL_BOUNCE_WALL"] = "ball_bounce_wall";
        SoundEffectType["BALL_BOUNCE_BRICK"] = "ball_bounce_brick";
        SoundEffectType["BALL_LOST"] = "ball_lost";
        SoundEffectType["BALL_SPAWN"] = "ball_spawn";
        SoundEffectType["BRICK_HIT"] = "brick_hit";
        SoundEffectType["BRICK_DESTROYED"] = "brick_destroyed";
        SoundEffectType["BRICK_SPECIAL_HIT"] = "brick_special_hit";
        SoundEffectType["BRICK_EXPLOSION"] = "brick_explosion";
        SoundEffectType["BRICK_ELECTRIC"] = "brick_electric";
        SoundEffectType["BRICK_ICE_BREAK"] = "brick_ice_break";
        SoundEffectType["BRICK_FIRE_BURN"] = "brick_fire_burn";
        SoundEffectType["PADDLE_MOVE"] = "paddle_move";
        SoundEffectType["PADDLE_DAMAGED"] = "paddle_damaged";
        SoundEffectType["PADDLE_REPAIRED"] = "paddle_repaired";
        SoundEffectType["PADDLE_LEVEL_UP"] = "paddle_level_up";
        SoundEffectType["PADDLE_LASER_SHOOT"] = "paddle_laser_shoot";
        SoundEffectType["CORE_DAMAGED"] = "core_damaged";
        SoundEffectType["CORE_CRITICAL"] = "core_critical";
        SoundEffectType["CORE_HEALED"] = "core_healed";
        SoundEffectType["CORE_LEVEL_UP"] = "core_level_up";
        SoundEffectType["CORE_DESTROYED"] = "core_destroyed";
        SoundEffectType["POWERUP_SPAWN"] = "powerup_spawn";
        SoundEffectType["POWERUP_COLLECT"] = "powerup_collect";
        SoundEffectType["POWERUP_ACTIVATE"] = "powerup_activate";
        SoundEffectType["POWERUP_EXPIRE"] = "powerup_expire";
        SoundEffectType["RELIC_FOUND"] = "relic_found";
        SoundEffectType["RELIC_ACTIVATE"] = "relic_activate";
        SoundEffectType["RELIC_PROC"] = "relic_proc";
        SoundEffectType["BOSS_APPEAR"] = "boss_appear";
        SoundEffectType["BOSS_ATTACK"] = "boss_attack";
        SoundEffectType["BOSS_DAMAGED"] = "boss_damaged";
        SoundEffectType["BOSS_PHASE_CHANGE"] = "boss_phase_change";
        SoundEffectType["BOSS_DEFEATED"] = "boss_defeated";
        SoundEffectType["LEVEL_START"] = "level_start";
        SoundEffectType["LEVEL_COMPLETE"] = "level_complete";
        SoundEffectType["LEVEL_FAILED"] = "level_failed";
        SoundEffectType["CHAPTER_COMPLETE"] = "chapter_complete";
        SoundEffectType["AMBIENT_WIND"] = "ambient_wind";
        SoundEffectType["AMBIENT_SPARKS"] = "ambient_sparks";
        SoundEffectType["AMBIENT_WATER"] = "ambient_water";
        SoundEffectType["AMBIENT_FIRE"] = "ambient_fire";
        SoundEffectType["COIN_COLLECT"] = "coin_collect";
        SoundEffectType["GEM_COLLECT"] = "gem_collect";
        SoundEffectType["PURCHASE_SUCCESS"] = "purchase_success";
        SoundEffectType["PURCHASE_FAILED"] = "purchase_failed";
        SoundEffectType["ACHIEVEMENT_UNLOCK"] = "achievement_unlock";
        SoundEffectType["REWARD_CLAIM"] = "reward_claim";
        SoundEffectType["EXP_GAIN"] = "exp_gain";
        SoundEffectType["LEVEL_UP"] = "level_up";
        return SoundEffectType;
      }({}));

      _export("LevelSoundManager", LevelSoundManager = (_dec = ccclass('LevelSoundManager'), _dec2 = property(AudioSource), _dec3 = property(AudioSource), _dec4 = property(AudioSource), _dec(_class = (_class2 = (_class3 = class LevelSoundManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "soundEffectSource", _descriptor, this);

          _initializerDefineProperty(this, "ambientSource", _descriptor2, this);

          _initializerDefineProperty(this, "uiSource", _descriptor3, this);

          _initializerDefineProperty(this, "maxConcurrentSounds", _descriptor4, this);

          _initializerDefineProperty(this, "soundEffectVolume", _descriptor5, this);

          _initializerDefineProperty(this, "ambientVolume", _descriptor6, this);

          _initializerDefineProperty(this, "enableSpatialAudio", _descriptor7, this);

          this._soundPool = [];
          this._activeSounds = new Map();
          this._soundConfigs = new Map();
          this._audioClips = new Map();
          this._currentAmbientLoop = '';
        }

        static getInstance() {
          return LevelSoundManager._instance;
        }

        onLoad() {
          if (LevelSoundManager._instance === null) {
            LevelSoundManager._instance = this;
          }

          this.initializeSoundPool();
          this.initializeSoundConfigs();
          this.preloadAudioClips();
        }

        onDestroy() {
          if (LevelSoundManager._instance === this) {
            LevelSoundManager._instance = null;
          }

          this.stopAllSounds();

          this._audioClips.clear();

          this._activeSounds.clear();
        }
        /**
         * 初始化音效池
         */


        initializeSoundPool() {
          for (var i = 0; i < this.maxConcurrentSounds; i++) {
            var audioNode = new Node("SoundPool_" + i);
            var audioSource = audioNode.addComponent(AudioSource);
            audioSource.volume = this.soundEffectVolume;
            this.node.addChild(audioNode);

            this._soundPool.push(audioSource);
          }

          console.log("Sound pool initialized with " + this.maxConcurrentSounds + " sources");
        }
        /**
         * 初始化音效配置
         */


        initializeSoundConfigs() {
          // UI音效配置
          this._soundConfigs.set(SoundEffectType.UI_CLICK, {
            clipName: 'ui/click',
            volume: 0.8,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 5
          });

          this._soundConfigs.set(SoundEffectType.UI_HOVER, {
            clipName: 'ui/hover',
            volume: 0.5,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 3
          }); // 弹球音效配置


          this._soundConfigs.set(SoundEffectType.BALL_BOUNCE_PADDLE, {
            clipName: 'gameplay/ball_bounce_paddle',
            volume: 0.9,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: true,
            spatialAudio: true,
            priority: 8
          });

          this._soundConfigs.set(SoundEffectType.BALL_BOUNCE_BRICK, {
            clipName: 'gameplay/ball_bounce_brick',
            volume: 0.7,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: true,
            spatialAudio: true,
            priority: 7
          });

          this._soundConfigs.set(SoundEffectType.BALL_LOST, {
            clipName: 'gameplay/ball_lost',
            volume: 1.0,
            pitch: 0.8,
            loop: false,
            fadeIn: false,
            fadeOut: true,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 9
          }); // 砖块音效配置


          this._soundConfigs.set(SoundEffectType.BRICK_HIT, {
            clipName: 'gameplay/brick_hit',
            volume: 0.6,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: true,
            spatialAudio: true,
            priority: 6
          });

          this._soundConfigs.set(SoundEffectType.BRICK_DESTROYED, {
            clipName: 'gameplay/brick_destroyed',
            volume: 0.8,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: true,
            spatialAudio: true,
            priority: 7
          });

          this._soundConfigs.set(SoundEffectType.BRICK_EXPLOSION, {
            clipName: 'gameplay/brick_explosion',
            volume: 1.0,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: false,
            spatialAudio: true,
            priority: 9
          });

          this._soundConfigs.set(SoundEffectType.BRICK_ELECTRIC, {
            clipName: 'gameplay/brick_electric',
            volume: 0.9,
            pitch: 1.2,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: true,
            spatialAudio: true,
            priority: 8
          }); // Boss音效配置


          this._soundConfigs.set(SoundEffectType.BOSS_APPEAR, {
            clipName: 'boss/boss_appear',
            volume: 1.0,
            pitch: 0.9,
            loop: false,
            fadeIn: true,
            fadeOut: false,
            delay: 0.5,
            randomPitch: false,
            spatialAudio: false,
            priority: 10
          });

          this._soundConfigs.set(SoundEffectType.BOSS_DEFEATED, {
            clipName: 'boss/boss_defeated',
            volume: 1.0,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: true,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 10
          }); // 环境音效配置


          this._soundConfigs.set(SoundEffectType.AMBIENT_WIND, {
            clipName: 'ambient/wind_loop',
            volume: 0.3,
            pitch: 1.0,
            loop: true,
            fadeIn: true,
            fadeOut: true,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 2
          });

          this._soundConfigs.set(SoundEffectType.AMBIENT_SPARKS, {
            clipName: 'ambient/sparks_loop',
            volume: 0.4,
            pitch: 1.0,
            loop: true,
            fadeIn: true,
            fadeOut: true,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 2
          });

          console.log("Initialized " + this._soundConfigs.size + " sound configurations");
        }
        /**
         * 预加载音频资源
         */


        preloadAudioClips() {
          var audioList = [// UI音效
          'ui/click', 'ui/hover', 'ui/success', 'ui/error', 'ui/open', 'ui/close', // 游戏核心音效
          'gameplay/ball_bounce_paddle', 'gameplay/ball_bounce_wall', 'gameplay/ball_bounce_brick', 'gameplay/ball_lost', 'gameplay/ball_spawn', // 砖块音效
          'gameplay/brick_hit', 'gameplay/brick_destroyed', 'gameplay/brick_explosion', 'gameplay/brick_electric', 'gameplay/brick_ice_break', 'gameplay/brick_fire_burn', // 挡板音效
          'gameplay/paddle_move', 'gameplay/paddle_damaged', 'gameplay/paddle_repaired', 'gameplay/paddle_level_up', 'gameplay/paddle_laser_shoot', // Boss音效
          'boss/boss_appear', 'boss/boss_attack', 'boss/boss_damaged', 'boss/boss_phase_change', 'boss/boss_defeated', // 环境音效
          'ambient/wind_loop', 'ambient/sparks_loop', 'ambient/water_loop', 'ambient/fire_loop'];
          var loadedCount = 0;
          var totalCount = audioList.length;
          audioList.forEach(clipPath => {
            resources.load("audio/" + clipPath, AudioClip, (err, clip) => {
              loadedCount++;

              if (err) {
                console.warn("Failed to load audio clip: " + clipPath, err);
              } else {
                this._audioClips.set(clipPath, clip);

                console.log("Loaded audio clip: " + clipPath);
              }

              if (loadedCount === totalCount) {
                console.log("All audio clips loaded (" + this._audioClips.size + "/" + totalCount + ")");
              }
            });
          });
        }
        /**
         * 播放音效
         */


        playSoundEffect(effectType, position) {
          var config = this._soundConfigs.get(effectType);

          if (!config) {
            console.warn("Sound effect config not found: " + effectType);
            return false;
          }

          var audioClip = this._audioClips.get(config.clipName);

          if (!audioClip) {
            console.warn("Audio clip not found: " + config.clipName);
            return false;
          }

          var audioSource = this.getAvailableAudioSource();

          if (!audioSource) {
            console.warn('No available audio source for sound effect');
            return false;
          }

          this.setupAudioSource(audioSource, config, audioClip, position);

          if (config.delay > 0) {
            this.scheduleOnce(() => {
              this.playAudioSource(audioSource, config);
            }, config.delay);
          } else {
            this.playAudioSource(audioSource, config);
          } // 记录活跃音效


          var soundId = effectType + "_" + Date.now();

          this._activeSounds.set(soundId, audioSource); // 设置音效结束回调


          this.scheduleOnce(() => {
            this._activeSounds.delete(soundId);

            this.returnAudioSourceToPool(audioSource);
          }, 5.0); // Default duration since audioClip.duration is not available

          return true;
        }
        /**
         * 播放环境音效循环
         */


        playAmbientLoop(effectType) {
          if (this._currentAmbientLoop === effectType) {
            return true; // 已经在播放
          } // 停止当前环境音效


          this.stopAmbientLoop();

          var config = this._soundConfigs.get(effectType);

          if (!config || !config.loop) {
            console.warn("Ambient sound config not found or not looped: " + effectType);
            return false;
          }

          var audioClip = this._audioClips.get(config.clipName);

          if (!audioClip || !this.ambientSource) {
            console.warn("Ambient audio clip or source not found: " + config.clipName);
            return false;
          }

          this.ambientSource.clip = audioClip;
          this.ambientSource.volume = config.volume * this.ambientVolume; // AudioSource pitch property not available in Cocos Creator 3.x
          // this.ambientSource.pitch = config.pitch;

          this.ambientSource.loop = true;

          if (config.fadeIn) {
            this.ambientSource.volume = 0;
            this.ambientSource.play();
            tween(this.ambientSource).to(2.0, {
              volume: config.volume * this.ambientVolume
            }).start();
          } else {
            this.ambientSource.play();
          }

          this._currentAmbientLoop = effectType;
          console.log("Started ambient loop: " + effectType);
          return true;
        }
        /**
         * 停止环境音效循环
         */


        stopAmbientLoop() {
          if (!this.ambientSource || !this._currentAmbientLoop) {
            return;
          }

          var config = this._soundConfigs.get(this._currentAmbientLoop);

          if (config && config.fadeOut) {
            tween(this.ambientSource).to(1.0, {
              volume: 0
            }).call(() => {
              if (this.ambientSource) {
                this.ambientSource.stop();
              }
            }).start();
          } else {
            this.ambientSource.stop();
          }

          console.log("Stopped ambient loop: " + this._currentAmbientLoop);
          this._currentAmbientLoop = '';
        }
        /**
         * 播放UI音效
         */


        playUISound(effectType) {
          var config = this._soundConfigs.get(effectType);

          if (!config) return false;

          var audioClip = this._audioClips.get(config.clipName);

          if (!audioClip || !this.uiSource) return false;
          this.uiSource.clip = audioClip;
          this.uiSource.volume = config.volume * this.soundEffectVolume; // AudioSource pitch property not available in Cocos Creator 3.x
          // this.uiSource.pitch = config.randomPitch ? 
          //     config.pitch + (Math.random() - 0.5) * 0.2 : 
          //     config.pitch;

          this.uiSource.play();
          return true;
        }
        /**
         * 获取可用的音频源
         */


        getAvailableAudioSource() {
          // 查找空闲的音频源
          for (var source of this._soundPool) {
            if (!source.playing) {
              return source;
            }
          } // 如果没有空闲的，找到优先级最低的音频源


          var lowestPriority = 10;
          var targetSource = null;

          for (var [soundId, _source] of this._activeSounds) {
            // 这里需要根据音效类型获取优先级
            // 简化处理，直接使用第一个找到的
            if (!targetSource) {
              targetSource = _source;
              break;
            }
          }

          return targetSource || this._soundPool[0];
        }
        /**
         * 设置音频源参数
         */


        setupAudioSource(source, config, clip, position) {
          source.clip = clip;
          source.volume = config.volume * this.soundEffectVolume; // AudioSource pitch property not available in Cocos Creator 3.x
          // source.pitch = config.randomPitch ? 
          //     config.pitch + (Math.random() - 0.5) * 0.2 : 
          //     config.pitch;

          source.loop = config.loop; // 空间音频设置

          if (config.spatialAudio && position && this.enableSpatialAudio) {
            // 根据位置调整音量和声道
            var screenCenter = {
              x: 0,
              y: 0
            };
            var distance = Math.sqrt(Math.pow(position.x - screenCenter.x, 2) + Math.pow(position.y - screenCenter.y, 2)); // 距离衰减

            var maxDistance = 500;
            var volumeMultiplier = Math.max(0.1, 1.0 - distance / maxDistance);
            source.volume *= volumeMultiplier;
          }
        }
        /**
         * 播放音频源
         */


        playAudioSource(source, config) {
          if (config.fadeIn) {
            source.volume = 0;
            source.play();
            tween(source).to(0.3, {
              volume: config.volume * this.soundEffectVolume
            }).start();
          } else {
            source.play();
          }
        }
        /**
         * 归还音频源到池中
         */


        returnAudioSourceToPool(source) {
          source.stop();
          source.clip = null;
          source.volume = this.soundEffectVolume; // AudioSource pitch property not available in Cocos Creator 3.x
          // source.pitch = 1.0;

          source.loop = false;
        }
        /**
         * 停止所有音效
         */


        stopAllSounds() {
          // 停止所有音效源
          this._soundPool.forEach(source => {
            source.stop();
          }); // 停止环境音效


          this.stopAmbientLoop(); // 停止UI音效

          if (this.uiSource) {
            this.uiSource.stop();
          } // 清除活跃音效记录


          this._activeSounds.clear();

          console.log('All sounds stopped');
        }
        /**
         * 设置音量
         */


        setSoundEffectVolume(volume) {
          this.soundEffectVolume = Math.max(0, Math.min(1, volume)); // 更新所有活跃的音效源音量

          this._soundPool.forEach(source => {
            if (source.playing) {
              var config = this.getConfigForSource(source);

              if (config) {
                source.volume = config.volume * this.soundEffectVolume;
              }
            }
          });
        }

        setAmbientVolume(volume) {
          this.ambientVolume = Math.max(0, Math.min(1, volume));

          if (this.ambientSource && this.ambientSource.playing) {
            var config = this._soundConfigs.get(this._currentAmbientLoop);

            if (config) {
              this.ambientSource.volume = config.volume * this.ambientVolume;
            }
          }
        }
        /**
         * 工具方法
         */


        getConfigForSource(source) {
          // 这里可以通过某种方式追踪音频源对应的配置
          // 简化实现
          return null;
        }
        /**
         * 快捷方法
         */


        playBallBounce(position) {
          this.playSoundEffect(SoundEffectType.BALL_BOUNCE_BRICK, position);
        }

        playBrickDestroyed(position) {
          this.playSoundEffect(SoundEffectType.BRICK_DESTROYED, position);
        }

        playUIClick() {
          this.playUISound(SoundEffectType.UI_CLICK);
        }

        playBossAppear() {
          this.playSoundEffect(SoundEffectType.BOSS_APPEAR);
        }

        setAmbientForChapter(chapter) {
          switch (chapter) {
            case 1:
              this.playAmbientLoop(SoundEffectType.AMBIENT_WIND);
              break;

            case 2:
              this.playAmbientLoop(SoundEffectType.AMBIENT_SPARKS);
              break;

            case 3:
              this.playAmbientLoop(SoundEffectType.AMBIENT_FIRE);
              break;
          }
        }
        /**
         * 调试信息
         */


        getDebugInfo() {
          var _this$ambientSource;

          var activeCount = Array.from(this._soundPool).filter(s => s.playing).length;
          var ambientPlaying = (_this$ambientSource = this.ambientSource) != null && _this$ambientSource.playing ? this._currentAmbientLoop : 'None';
          return "Active Sounds: " + activeCount + "/" + this.maxConcurrentSounds + ", Ambient: " + ambientPlaying + ", Volume: " + this.soundEffectVolume;
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "soundEffectSource", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ambientSource", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "uiSource", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxConcurrentSounds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "soundEffectVolume", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "ambientVolume", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableSpatialAudio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=eaf531e362a47cf5cbc69bf1b5722580bb7a8cb7.js.map