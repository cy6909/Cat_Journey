System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sys, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, SaveManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRelicType(extras) {
    _reporterNs.report("RelicType", "../managers/RelicManager", _context.meta, extras);
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
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "94e43A95xBEF4EOcCu4U2Bj", "SaveManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SaveManager", SaveManager = (_dec = ccclass('SaveManager'), _dec(_class = (_class2 = (_class3 = class SaveManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "autoSaveInterval", _descriptor, this);

          // 自动保存间隔(秒)
          _initializerDefineProperty(this, "maxSaveSlots", _descriptor2, this);

          // 最大存档槽位数
          _initializerDefineProperty(this, "enableCloudSync", _descriptor3, this);

          this._playerProgress = null;
          this._currentRunProgress = null;
          this._autoSaveTimer = 0;
          this._hasUnsavedChanges = false;
        }

        static getInstance() {
          return SaveManager._instance;
        }

        onLoad() {
          if (SaveManager._instance === null) {
            SaveManager._instance = this;
          }
        }

        onDestroy() {
          if (SaveManager._instance === this) {
            SaveManager._instance = null;
          }
        }

        start() {
          this.loadPlayerProgress();
          this.scheduleAutoSave();
        }

        update(deltaTime) {
          this._autoSaveTimer += deltaTime;

          if (this._autoSaveTimer >= this.autoSaveInterval && this._hasUnsavedChanges) {
            this.autoSave();
            this._autoSaveTimer = 0;
          }
        }
        /**
         * 初始化新的玩家进度
         */


        initializeNewProgress() {
          var now = Date.now();
          return {
            currentChapter: 1,
            currentFloor: 1,
            currentRun: 1,
            unlockedChapters: [1],
            unlockedRelics: [],
            unlockedPaddleTypes: ['basic'],
            unlockedBallTypes: ['normal'],
            unlockedCoreTypes: ['standard'],
            totalPlayTime: 0,
            totalScore: 0,
            highestScore: 0,
            totalBricksDestroyed: 0,
            totalLevelsCompleted: 0,
            totalDeaths: 0,
            defeatedBosses: [],
            defeatedHiddenBosses: [],
            achievements: {},
            achievementProgress: {},
            currency: {
              coins: 100,
              gems: 0,
              energy: 100,
              experience: 0
            },
            purchaseHistory: [],
            vipStatus: {
              isVip: false,
              vipLevel: 0,
              vipExpireTime: 0
            },
            settings: {
              soundVolume: 1.0,
              musicVolume: 0.8,
              enableNotifications: true,
              language: 'zh-CN',
              qualityLevel: 2
            },
            lastSaveTime: now,
            lastLoginTime: now,
            createTime: now
          };
        }
        /**
         * 开始新的游戏运行
         */


        startNewRun(chapterNumber) {
          if (chapterNumber === void 0) {
            chapterNumber = 1;
          }

          var runId = "run_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
          this._currentRunProgress = {
            runId,
            startTime: Date.now(),
            currentScore: 0,
            currentLives: 3,
            currentChapter: chapterNumber,
            currentFloor: (chapterNumber - 1) * 15 + 1,
            currentNodeIndex: 0,
            completedNodes: [],
            mapPath: [],
            activeRelics: [],
            relicStacks: {},
            paddleLevel: 1,
            paddleExperience: 0,
            paddleHealth: 100,
            paddleMaxHealth: 100,
            coreLevel: 1,
            coreExperience: 0,
            coreHealth: 100,
            coreMaxHealth: 100,
            ballTypes: ['normal'],
            ballEffects: [],
            ballCount: 1,
            temporaryBuffs: [],
            levelModifiers: [],
            bossPhase: 0,
            isInCombat: false
          };
          this.markDirty();
          return this._currentRunProgress;
        }
        /**
         * 保存玩家进度
         */


        savePlayerProgress() {
          try {
            if (!this._playerProgress) {
              console.warn('No player progress to save');
              return false;
            }

            this._playerProgress.lastSaveTime = Date.now();
            var saveData = JSON.stringify(this._playerProgress); // 保存到本地存储

            sys.localStorage.setItem('cat_conquest_progress', saveData); // 如果启用云同步，保存到云端

            if (this.enableCloudSync) {
              this.saveToCloud('progress', saveData);
            }

            console.log('Player progress saved successfully');
            this._hasUnsavedChanges = false;
            return true;
          } catch (error) {
            console.error('Failed to save player progress:', error);
            return false;
          }
        }
        /**
         * 保存当前运行进度
         */


        saveRunProgress() {
          try {
            if (!this._currentRunProgress) {
              console.warn('No run progress to save');
              return false;
            }

            var saveData = JSON.stringify(this._currentRunProgress); // 保存到本地存储

            sys.localStorage.setItem('cat_conquest_current_run', saveData); // 如果启用云同步，保存到云端

            if (this.enableCloudSync) {
              this.saveToCloud('current_run', saveData);
            }

            console.log('Run progress saved successfully');
            return true;
          } catch (error) {
            console.error('Failed to save run progress:', error);
            return false;
          }
        }
        /**
         * 加载玩家进度
         */


        loadPlayerProgress() {
          try {
            // 尝试从云端加载
            if (this.enableCloudSync) {
              var cloudData = this.loadFromCloud('progress');

              if (cloudData) {
                this._playerProgress = JSON.parse(cloudData);
                console.log('Player progress loaded from cloud');
                return true;
              }
            } // 从本地存储加载


            var localData = sys.localStorage.getItem('cat_conquest_progress');

            if (localData) {
              this._playerProgress = JSON.parse(localData);
              console.log('Player progress loaded from local storage');
              return true;
            } // 没有存档，创建新的进度


            this._playerProgress = this.initializeNewProgress();
            console.log('Created new player progress');
            return true;
          } catch (error) {
            console.error('Failed to load player progress:', error);
            this._playerProgress = this.initializeNewProgress();
            return false;
          }
        }
        /**
         * 加载运行进度
         */


        loadRunProgress() {
          try {
            // 尝试从云端加载
            if (this.enableCloudSync) {
              var cloudData = this.loadFromCloud('current_run');

              if (cloudData) {
                this._currentRunProgress = JSON.parse(cloudData);
                console.log('Run progress loaded from cloud');
                return true;
              }
            } // 从本地存储加载


            var localData = sys.localStorage.getItem('cat_conquest_current_run');

            if (localData) {
              this._currentRunProgress = JSON.parse(localData);
              console.log('Run progress loaded from local storage');
              return true;
            }

            console.log('No run progress found');
            return false;
          } catch (error) {
            console.error('Failed to load run progress:', error);
            return false;
          }
        }
        /**
         * 自动保存
         */


        autoSave() {
          console.log('Auto-saving progress...');
          this.savePlayerProgress();

          if (this._currentRunProgress) {
            this.saveRunProgress();
          }
        }
        /**
         * 手动保存
         */


        manualSave() {
          console.log('Manual save triggered');
          var progressSaved = this.savePlayerProgress();
          var runSaved = this._currentRunProgress ? this.saveRunProgress() : true;
          return progressSaved && runSaved;
        }
        /**
         * 云同步相关方法
         */


        saveToCloud(key, data) {
          try {
            // 使用微信云存储或其他云服务
            if (typeof wx !== 'undefined' && wx.cloud) {
              wx.cloud.database().collection('cat_conquest_saves').doc(key).set({
                data: {
                  saveData: data,
                  timestamp: Date.now()
                }
              }).then(() => {
                console.log("Data saved to cloud: " + key);
              }).catch(error => {
                console.error("Failed to save to cloud: " + key, error);
              });
            }
          } catch (error) {
            console.error('Cloud save error:', error);
          }
        }

        loadFromCloud(key) {
          try {
            // 这里应该是异步操作，为了简化示例使用同步方式
            // 实际实现中应该使用Promise或回调
            return null;
          } catch (error) {
            console.error('Cloud load error:', error);
            return null;
          }
        }
        /**
         * 进度更新方法
         */


        updateScore(score) {
          if (!this._playerProgress) {
            console.warn('Cannot update score: no player progress loaded');
            return;
          }

          if (typeof score !== 'number' || isNaN(score) || score < 0) {
            console.warn('Invalid score value:', score);
            return;
          }

          this._playerProgress.totalScore += score;

          if (score > this._playerProgress.highestScore) {
            this._playerProgress.highestScore = score;
          }

          if (this._currentRunProgress) {
            this._currentRunProgress.currentScore += score;
          }

          this.markDirty();
        }

        updateCurrency(type, amount) {
          if (this._playerProgress) {
            this._playerProgress.currency[type] = Math.max(0, this._playerProgress.currency[type] + amount);
            this.markDirty();
          }
        }

        unlockRelic(relicType) {
          if (this._playerProgress && !this._playerProgress.unlockedRelics.includes(relicType)) {
            this._playerProgress.unlockedRelics.push(relicType);

            this.markDirty();
          }
        }

        completeLevel() {
          if (this._playerProgress) {
            this._playerProgress.totalLevelsCompleted++;
            this.markDirty();
          }
        }

        recordDeath() {
          if (this._playerProgress) {
            this._playerProgress.totalDeaths++;
            this.markDirty();
          }
        }

        defeatBoss(bossId, isHidden) {
          if (isHidden === void 0) {
            isHidden = false;
          }

          if (this._playerProgress) {
            if (isHidden) {
              if (!this._playerProgress.defeatedHiddenBosses.includes(bossId)) {
                this._playerProgress.defeatedHiddenBosses.push(bossId);
              }
            } else {
              if (!this._playerProgress.defeatedBosses.includes(bossId)) {
                this._playerProgress.defeatedBosses.push(bossId);
              }
            }

            this.markDirty();
          }
        }
        /**
         * 存档槽位管理
         */


        saveToSlot(slotIndex) {
          if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
            console.error("Invalid save slot: " + slotIndex);
            return false;
          }

          try {
            var saveData = {
              playerProgress: this._playerProgress,
              runProgress: this._currentRunProgress,
              timestamp: Date.now()
            };

            var _key = "cat_conquest_slot_" + slotIndex;

            sys.localStorage.setItem(_key, JSON.stringify(saveData));
            console.log("Game saved to slot " + slotIndex);
            return true;
          } catch (error) {
            console.error("Failed to save to slot " + slotIndex + ":", error);
            return false;
          }
        }

        loadFromSlot(slotIndex) {
          if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
            console.error("Invalid save slot: " + slotIndex);
            return false;
          }

          try {
            var _key2 = "cat_conquest_slot_" + slotIndex;

            var saveData = sys.localStorage.getItem(_key2);

            if (!saveData) {
              console.log("No save data in slot " + slotIndex);
              return false;
            }

            var parsed = JSON.parse(saveData);
            this._playerProgress = parsed.playerProgress;
            this._currentRunProgress = parsed.runProgress;
            console.log("Game loaded from slot " + slotIndex);
            return true;
          } catch (error) {
            console.error("Failed to load from slot " + slotIndex + ":", error);
            return false;
          }
        }

        getSaveSlotInfo(slotIndex) {
          try {
            var _parsed$playerProgres, _parsed$playerProgres2;

            var _key3 = "cat_conquest_slot_" + slotIndex;

            var saveData = sys.localStorage.getItem(_key3);

            if (!saveData) {
              return {
                exists: false
              };
            }

            var parsed = JSON.parse(saveData);
            return {
              exists: true,
              timestamp: parsed.timestamp,
              chapter: (_parsed$playerProgres = parsed.playerProgress) == null ? void 0 : _parsed$playerProgres.currentChapter,
              score: (_parsed$playerProgres2 = parsed.playerProgress) == null ? void 0 : _parsed$playerProgres2.totalScore
            };
          } catch (error) {
            console.error("Failed to get slot info " + slotIndex + ":", error);
            return {
              exists: false
            };
          }
        }
        /**
         * 工具方法
         */


        markDirty() {
          this._hasUnsavedChanges = true;
        }

        scheduleAutoSave() {
          // 自动保存在update中处理
          console.log("Auto-save scheduled every " + this.autoSaveInterval + " seconds");
        }

        getPlayerProgress() {
          return this._playerProgress;
        }

        getCurrentRunProgress() {
          return this._currentRunProgress;
        }

        hasUnsavedChanges() {
          return this._hasUnsavedChanges;
        }
        /**
         * 数据验证和修复
         */


        validateAndRepairProgress() {
          if (!this._playerProgress) return false;

          try {
            // 验证基本数据
            this._playerProgress.currentChapter = Math.max(1, Math.min(3, this._playerProgress.currentChapter));
            this._playerProgress.currentFloor = Math.max(1, Math.min(45, this._playerProgress.currentFloor)); // 验证货币

            Object.keys(this._playerProgress.currency).forEach(key => {
              this._playerProgress.currency[key] = Math.max(0, this._playerProgress.currency[key]);
            }); // 验证设置

            this._playerProgress.settings.soundVolume = Math.max(0, Math.min(1, this._playerProgress.settings.soundVolume));
            this._playerProgress.settings.musicVolume = Math.max(0, Math.min(1, this._playerProgress.settings.musicVolume));
            console.log('Progress validation completed');
            this.markDirty();
            return true;
          } catch (error) {
            console.error('Progress validation failed:', error);
            return false;
          }
        }
        /**
         * 清除存档
         */


        clearAllSaves() {
          try {
            // 清除主要进度
            sys.localStorage.removeItem('cat_conquest_progress');
            sys.localStorage.removeItem('cat_conquest_current_run'); // 清除存档槽位

            for (var i = 0; i < this.maxSaveSlots; i++) {
              sys.localStorage.removeItem("cat_conquest_slot_" + i);
            } // 重置内存数据


            this._playerProgress = this.initializeNewProgress();
            this._currentRunProgress = null;
            this._hasUnsavedChanges = false;
            console.log('All saves cleared');
          } catch (error) {
            console.error('Failed to clear saves:', error);
          }
        }

        saveToLocalStorage(key, data) {
          try {
            if (!key || !data) {
              console.warn('Invalid localStorage save parameters');
              return false;
            } // Check localStorage availability


            if (typeof sys === 'undefined' || !sys.localStorage) {
              console.warn('localStorage not available');
              return false;
            }

            sys.localStorage.setItem(key, data);
            return true;
          } catch (error) {
            console.error('localStorage save failed:', error);
            return false;
          }
        }

        loadFromLocalStorage(key) {
          try {
            if (!key) {
              console.warn('Invalid localStorage load key');
              return null;
            } // Check localStorage availability


            if (typeof sys === 'undefined' || !sys.localStorage) {
              console.warn('localStorage not available');
              return null;
            }

            return sys.localStorage.getItem(key);
          } catch (error) {
            console.error('localStorage load failed:', error);
            return null;
          }
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "autoSaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxSaveSlots", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enableCloudSync", [property], {
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
//# sourceMappingURL=5f0b5bdbdad2e4f57b914af13fc35ddd66076f69.js.map