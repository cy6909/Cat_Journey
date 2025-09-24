System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sys, _dec, _class, _crd, ccclass, property, CurrencyType, PurchaseType, AdType, MonetizationManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      sys = _cc.sys;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8efbbbc0mdNjo/kTkX62oBP", "MonetizationManager", undefined);

      // WeChat Mini Game API types
      /// <reference types="minigame-api-typings" />
      __checkObsolete__(['_decorator', 'Component', 'Node', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CurrencyType", CurrencyType = /*#__PURE__*/function (CurrencyType) {
        CurrencyType["COINS"] = "coins";
        CurrencyType["GEMS"] = "gems";
        CurrencyType["ENERGY"] = "energy";
        CurrencyType["EXPERIENCE"] = "experience";
        return CurrencyType;
      }({}));

      _export("PurchaseType", PurchaseType = /*#__PURE__*/function (PurchaseType) {
        PurchaseType["REMOVE_ADS"] = "remove_ads";
        PurchaseType["VIP_MONTHLY"] = "vip_monthly";
        PurchaseType["STARTER_PACK"] = "starter_pack";
        PurchaseType["GEMS_SMALL"] = "gems_small";
        PurchaseType["GEMS_MEDIUM"] = "gems_medium";
        PurchaseType["GEMS_LARGE"] = "gems_large";
        PurchaseType["ENERGY_REFILL"] = "energy_refill";
        PurchaseType["LEGENDARY_PADDLE"] = "legendary_paddle";
        PurchaseType["LEGENDARY_BALL"] = "legendary_ball";
        PurchaseType["LEGENDARY_CORE"] = "legendary_core";
        PurchaseType["LEGENDARY_RELIC"] = "legendary_relic";
        return PurchaseType;
      }({}));

      _export("AdType", AdType = /*#__PURE__*/function (AdType) {
        AdType["REWARD_VIDEO"] = "reward_video";
        AdType["INTERSTITIAL"] = "interstitial";
        AdType["BANNER"] = "banner";
        return AdType;
      }({}));

      _export("MonetizationManager", MonetizationManager = (_dec = ccclass('MonetizationManager'), _dec(_class = class MonetizationManager extends Component {
        constructor() {
          super(...arguments);
          // 货币系统
          this._currencies = new Map();
          // 购买项目配置
          this._purchaseItems = new Map();
          // VIP状态
          this._isVIP = false;
          this._vipExpireTime = 0;
          // 广告状态
          this._adsRemoved = false;
          this._lastAdTime = new Map();
          // 游戏平衡参数
          this._difficultyScaling = {
            chapter1: {
              easy: 1.0,
              medium: 1.2,
              hard: 1.5
            },
            chapter2: {
              easy: 1.3,
              medium: 1.6,
              hard: 2.0
            },
            chapter3: {
              easy: 1.8,
              medium: 2.3,
              hard: 3.0
            }
          };
          // 付费增益参数
          this._monetizationBoosts = {
            adBoostDamage: 1.5,
            // 看广告伤害提升
            adBoostSpeed: 1.3,
            // 看广告速度提升
            adBoostCurrency: 2.0,
            // 看广告货币翻倍
            vipExpBonus: 2.0,
            // VIP经验加成
            vipCurrencyBonus: 1.5,
            // VIP货币加成
            vipEnergyRegenBonus: 2.0 // VIP体力恢复加成

          };
        }

        onLoad() {
          this.initializeCurrencies();
          this.initializePurchaseItems();
          this.loadPlayerData();
          this.scheduleEnergyRegeneration();
        }

        initializeCurrencies() {
          // 金币 - 主要游戏货币
          this._currencies.set(CurrencyType.COINS, {
            type: CurrencyType.COINS,
            amount: 100,
            // 初始100金币
            maxAmount: 999999
          }); // 宝石 - 付费货币


          this._currencies.set(CurrencyType.GEMS, {
            type: CurrencyType.GEMS,
            amount: 10,
            // 初始10宝石
            maxAmount: 99999
          }); // 体力 - 限制游戏次数


          this._currencies.set(CurrencyType.ENERGY, {
            type: CurrencyType.ENERGY,
            amount: 100,
            // 初始满体力
            maxAmount: 100,
            regenRate: 20,
            // 每小时恢复20点
            lastRegenTime: Date.now()
          }); // 经验


          this._currencies.set(CurrencyType.EXPERIENCE, {
            type: CurrencyType.EXPERIENCE,
            amount: 0,
            maxAmount: 999999
          });
        }

        initializePurchaseItems() {
          // 功能性购买
          this._purchaseItems.set(PurchaseType.REMOVE_ADS, {
            id: PurchaseType.REMOVE_ADS,
            name: "移除广告",
            description: "永久移除所有广告，享受纯净游戏体验",
            price: 1200,
            // 12元
            value: {
              removeAds: true
            },
            oneTime: true
          });

          this._purchaseItems.set(PurchaseType.VIP_MONTHLY, {
            id: PurchaseType.VIP_MONTHLY,
            name: "月度VIP",
            description: "30天VIP特权：双倍经验、体力恢复+100%、专属商店",
            price: 3000,
            // 30元
            value: {
              vipDays: 30
            },
            oneTime: false
          }); // 新手礼包


          this._purchaseItems.set(PurchaseType.STARTER_PACK, {
            id: PurchaseType.STARTER_PACK,
            name: "新手特惠礼包",
            description: "包含1000宝石、传说遗物、能量恢复道具",
            price: 600,
            // 6元
            value: {
              gems: 1000,
              items: ['legendary_relic_starter', 'energy_potion_large'],
              paddle: 'enhanced_starter_paddle'
            },
            oneTime: true,
            discountPercent: 80 // 80%折扣

          }); // 宝石包


          this._purchaseItems.set(PurchaseType.GEMS_SMALL, {
            id: PurchaseType.GEMS_SMALL,
            name: "小宝石包",
            description: "100宝石，物超所值",
            price: 600,
            // 6元
            value: {
              gems: 100
            }
          });

          this._purchaseItems.set(PurchaseType.GEMS_MEDIUM, {
            id: PurchaseType.GEMS_MEDIUM,
            name: "中宝石包",
            description: "600宝石，送100额外宝石",
            price: 3000,
            // 30元
            value: {
              gems: 700
            }
          });

          this._purchaseItems.set(PurchaseType.GEMS_LARGE, {
            id: PurchaseType.GEMS_LARGE,
            name: "大宝石包",
            description: "2000宝石，送500额外宝石",
            price: 9800,
            // 98元
            value: {
              gems: 2500
            }
          }); // 体力恢复


          this._purchaseItems.set(PurchaseType.ENERGY_REFILL, {
            id: PurchaseType.ENERGY_REFILL,
            name: "体力恢复",
            description: "立即恢复满体力",
            price: 0,
            // 使用游戏货币购买
            currency: CurrencyType.GEMS,
            currencyAmount: 50,
            value: {
              energyRefill: 100
            }
          }); // 传说装备


          this._purchaseItems.set(PurchaseType.LEGENDARY_PADDLE, {
            id: PurchaseType.LEGENDARY_PADDLE,
            name: "传说挡板",
            description: "『神话破坏者』- 攻击力+50%，耐久度+100%，自动修复",
            price: 0,
            // 使用游戏货币购买
            currency: CurrencyType.GEMS,
            currencyAmount: 800,
            value: {
              paddleType: 'legendary_destroyer',
              stats: {
                damage: 1.5,
                durability: 2.0,
                autoRepair: true
              }
            },
            vipOnly: false
          });

          this._purchaseItems.set(PurchaseType.LEGENDARY_BALL, {
            id: PurchaseType.LEGENDARY_BALL,
            name: "传说弹球",
            description: "『混沌之球』- 随机获得3种球效果，穿透+无限反弹",
            price: 0,
            // 使用游戏货币购买
            currency: CurrencyType.GEMS,
            currencyAmount: 1000,
            value: {
              ballType: 'legendary_chaos',
              effects: ['piercing', 'infinite_bounce', 'random_effects']
            }
          });

          this._purchaseItems.set(PurchaseType.LEGENDARY_CORE, {
            id: PurchaseType.LEGENDARY_CORE,
            name: "传说核心",
            description: "『永恒之心』- 生命值+200%，被击中时25%几率免伤",
            price: 0,
            // 使用游戏货币购买
            currency: CurrencyType.GEMS,
            currencyAmount: 1200,
            value: {
              coreType: 'legendary_eternal',
              stats: {
                health: 3.0,
                damageReduction: 0.25
              }
            }
          });

          this._purchaseItems.set(PurchaseType.LEGENDARY_RELIC, {
            id: PurchaseType.LEGENDARY_RELIC,
            name: "传说遗物",
            description: "随机获得一个传说级遗物，效果强大",
            price: 0,
            // 使用游戏货币购买
            currency: CurrencyType.GEMS,
            currencyAmount: 600,
            value: {
              relicTier: 'legendary',
              random: true
            }
          });
        } // 货币管理


        getCurrency(type) {
          var currency = this._currencies.get(type);

          return currency ? currency.amount : 0;
        }

        addCurrency(type, amount) {
          var currency = this._currencies.get(type);

          if (!currency) return false;
          var newAmount = currency.amount + amount;
          var maxAmount = currency.maxAmount || Number.MAX_SAFE_INTEGER;
          currency.amount = Math.min(newAmount, maxAmount);
          this.savePlayerData(); // VIP加成

          if (this._isVIP && (type === CurrencyType.COINS || type === CurrencyType.EXPERIENCE)) {
            var bonus = Math.floor(amount * (this._monetizationBoosts.vipCurrencyBonus - 1));
            currency.amount = Math.min(currency.amount + bonus, maxAmount);
          }

          return true;
        }

        subtractCurrency(type, amount) {
          var currency = this._currencies.get(type);

          if (!currency || currency.amount < amount) {
            return false;
          }

          currency.amount -= amount;
          this.savePlayerData();
          return true;
        } // 体力恢复系统


        scheduleEnergyRegeneration() {
          this.schedule(this.regenerateEnergy, 60, Number.MAX_SAFE_INTEGER, 0); // 每分钟检查一次
        }

        regenerateEnergy() {
          var energyData = this._currencies.get(CurrencyType.ENERGY);

          if (!energyData || !energyData.regenRate || !energyData.lastRegenTime) return;
          var now = Date.now();
          var hoursSinceLastRegen = (now - energyData.lastRegenTime) / (1000 * 60 * 60);

          if (hoursSinceLastRegen >= 1.0) {
            var regenAmount = Math.floor(hoursSinceLastRegen * energyData.regenRate); // VIP加成

            if (this._isVIP) {
              regenAmount = Math.floor(regenAmount * this._monetizationBoosts.vipEnergyRegenBonus);
            }

            if (regenAmount > 0) {
              var newAmount = Math.min(energyData.amount + regenAmount, energyData.maxAmount);
              energyData.amount = newAmount;
              energyData.lastRegenTime = now;
              this.savePlayerData();
            }
          }
        } // 购买系统


        purchaseItem(purchaseType) {
          var item = this._purchaseItems.get(purchaseType);

          if (!item) {
            console.error("Purchase item not found: " + purchaseType);
            return Promise.resolve(false);
          } // 检查VIP权限


          if (item.vipOnly && !this._isVIP) {
            console.warn("Item " + purchaseType + " requires VIP");
            return Promise.resolve(false);
          } // 检查是否已购买（一次性商品）


          if (item.oneTime && this.hasPurchased(purchaseType)) {
            console.warn("Item " + purchaseType + " already purchased");
            return Promise.resolve(false);
          } // 游戏内货币购买


          if (item.currency && item.currencyAmount) {
            if (this.subtractCurrency(item.currency, item.currencyAmount)) {
              this.applyPurchaseReward(item);
              this.recordPurchase(purchaseType);
              return Promise.resolve(true);
            } else {
              console.warn("Insufficient " + item.currency + " for " + purchaseType);
              return Promise.resolve(false);
            }
          } // 真实货币购买 - 集成微信支付


          return this.processRealMoneyPurchase(item);
        }

        processRealMoneyPurchase(item) {
          return new Promise(resolve => {
            // 微信小游戏支付集成
            if (sys.platform === sys.Platform.WECHAT_GAME) {
              wx.requestPayment({
                timeStamp: Date.now().toString(),
                nonceStr: this.generateNonceStr(),
                package: "prepay_id=" + this.generatePrepayId(item),
                signType: 'MD5',
                paySign: this.generatePaySign(item),
                success: res => {
                  console.log('Payment success:', res);
                  this.applyPurchaseReward(item);
                  this.recordPurchase(item.id);
                  resolve(true);
                },
                fail: err => {
                  console.error('Payment failed:', err);
                  resolve(false);
                }
              });
            } else {
              // 开发环境模拟购买成功
              console.log("Simulated purchase: " + item.name);
              this.applyPurchaseReward(item);
              this.recordPurchase(item.id);
              resolve(true);
            }
          });
        }

        applyPurchaseReward(item) {
          var value = item.value; // 处理不同类型的奖励

          if (value.removeAds) {
            this._adsRemoved = true;
          }

          if (value.vipDays) {
            var now = Date.now();
            var vipDuration = value.vipDays * 24 * 60 * 60 * 1000;
            this._vipExpireTime = Math.max(now, this._vipExpireTime) + vipDuration;
            this._isVIP = true;
          }

          if (value.gems) {
            this.addCurrency(CurrencyType.GEMS, value.gems);
          }

          if (value.energyRefill) {
            var energyData = this._currencies.get(CurrencyType.ENERGY);

            energyData.amount = energyData.maxAmount;
          } // 处理装备奖励


          if (value.paddleType || value.ballType || value.coreType) {
            this.grantLegendaryItem(value);
          }

          if (value.relicTier) {
            this.grantRandomRelic(value.relicTier, value.random);
          }

          this.savePlayerData();
        } // 广告系统


        showRewardedAd(adType, reward) {
          if (this._adsRemoved) {
            // 如果已移除广告，直接给奖励
            this.applyAdReward(reward);
            return Promise.resolve(true);
          }

          return new Promise(resolve => {
            if (sys.platform === sys.Platform.WECHAT_GAME) {
              wx.createRewardedVideoAd({
                adUnitId: this.getAdUnitId(adType)
              }).show().then(() => {
                console.log('Rewarded ad shown');
                this.applyAdReward(reward);

                this._lastAdTime.set(adType, Date.now());

                resolve(true);
              }).catch(err => {
                console.error('Failed to show rewarded ad:', err);
                resolve(false);
              });
            } else {
              // 开发环境模拟观看广告
              console.log("Simulated ad watch: " + adType);
              this.applyAdReward(reward);
              resolve(true);
            }
          });
        }

        applyAdReward(reward) {
          if (reward.type !== 'item' && reward.amount) {
            var amount = reward.amount; // 广告奖励可能有加成

            if (this._isVIP) {
              amount = Math.floor(amount * this._monetizationBoosts.vipCurrencyBonus);
            }

            this.addCurrency(reward.type, amount);
          } else if (reward.type === 'item' && reward.itemType) {
            this.grantItemReward(reward.itemType, reward.itemData);
          }
        } // 游戏增益系统


        getAdDamageBoost() {
          return this._monetizationBoosts.adBoostDamage;
        }

        getAdSpeedBoost() {
          return this._monetizationBoosts.adBoostSpeed;
        }

        requestTemporaryBoost(boostType, duration) {
          var reward = {
            type: 'item',
            itemType: "boost_" + boostType,
            itemData: {
              duration: duration
            }
          };
          return this.showRewardedAd(AdType.REWARD_VIDEO, reward);
        } // VIP系统


        isVIP() {
          if (this._vipExpireTime > 0 && Date.now() > this._vipExpireTime) {
            this._isVIP = false;
            this._vipExpireTime = 0;
            this.savePlayerData();
          }

          return this._isVIP;
        }

        getVIPExpireTime() {
          return this._vipExpireTime;
        } // 数值平衡分析


        analyzeDifficultyBalancing() {
          return {
            earlyGame: {
              description: "前期爽快体验设计",
              difficultyMultiplier: 1.0,
              currencyGainRate: 1.5,
              energyCost: 10,
              adFrequency: "低频率",
              paymentPressure: "无"
            },
            midGame: {
              description: "中期挑战增加",
              difficultyMultiplier: 1.8,
              currencyGainRate: 1.0,
              energyCost: 20,
              adFrequency: "中等频率",
              paymentPressure: "引导购买VIP/宝石包"
            },
            lateGame: {
              description: "后期高难度，强烈付费引导",
              difficultyMultiplier: 3.0,
              currencyGainRate: 0.6,
              energyCost: 30,
              adFrequency: "高频率",
              paymentPressure: "传说装备/大量资源需求"
            },
            optimization: {
              suggestion: "在第二章中期开始引入付费点，第三章强化付费收益",
              metrics: {
                retentionRate: "通过合理难度曲线保持70%+留存",
                conversionRate: "目标5%付费转化率",
                arpu: "人均收入30-50元"
              }
            }
          };
        } // 工具方法


        generateNonceStr() {
          return Math.random().toString(36).substr(2, 15);
        }

        generatePrepayId(item) {
          return "prepay_" + item.id + "_" + Date.now();
        }

        generatePaySign(item) {
          // 实际实现需要根据微信支付规范生成签名
          return "sign_" + item.id;
        }

        getAdUnitId(adType) {
          // 返回对应的广告单元ID
          var adUnits = {
            [AdType.REWARD_VIDEO]: 'adunit-reward-video-id',
            [AdType.INTERSTITIAL]: 'adunit-interstitial-id',
            [AdType.BANNER]: 'adunit-banner-id'
          };
          return adUnits[adType] || '';
        }

        grantLegendaryItem(value) {
          // 发放传说装备
          console.log('Granted legendary item:', value);
        }

        grantRandomRelic(tier, random) {
          // 发放随机遗物
          console.log("Granted " + tier + " relic, random: " + random);
        }

        grantItemReward(itemType, itemData) {
          // 发放物品奖励
          console.log("Granted item: " + itemType, itemData);
        }

        recordPurchase(purchaseType) {
          // 记录购买历史
          var purchases = this.getPurchaseHistory();
          purchases.push({
            type: purchaseType,
            timestamp: Date.now()
          });
          sys.localStorage.setItem('purchase_history', JSON.stringify(purchases));
        }

        hasPurchased(purchaseType) {
          var purchases = this.getPurchaseHistory();
          return purchases.some(p => p.type === purchaseType);
        }

        getPurchaseHistory() {
          var data = sys.localStorage.getItem('purchase_history');
          return data ? JSON.parse(data) : [];
        } // 数据持久化


        savePlayerData() {
          var data = {
            currencies: Array.from(this._currencies.entries()),
            isVIP: this._isVIP,
            vipExpireTime: this._vipExpireTime,
            adsRemoved: this._adsRemoved,
            lastAdTimes: Array.from(this._lastAdTime.entries())
          };
          sys.localStorage.setItem('monetization_data', JSON.stringify(data));
        }

        loadPlayerData() {
          var data = sys.localStorage.getItem('monetization_data');

          if (data) {
            var parsed = JSON.parse(data); // 恢复货币数据

            if (parsed.currencies) {
              for (var [type, currencyData] of parsed.currencies) {
                this._currencies.set(type, currencyData);
              }
            }

            this._isVIP = parsed.isVIP || false;
            this._vipExpireTime = parsed.vipExpireTime || 0;
            this._adsRemoved = parsed.adsRemoved || false;

            if (parsed.lastAdTimes) {
              this._lastAdTime = new Map(parsed.lastAdTimes);
            }
          }
        } // 公开接口


        getAllCurrencies() {
          return new Map(this._currencies);
        }

        getPurchaseItems() {
          return Array.from(this._purchaseItems.values());
        }

        canAfford(purchaseType) {
          var item = this._purchaseItems.get(purchaseType);

          if (!item) return false;

          if (item.currency && item.currencyAmount) {
            return this.getCurrency(item.currency) >= item.currencyAmount;
          }

          return true; // 真实货币购买总是可以尝试
        }

        getDifficultyMultiplier(chapter, playerLevel) {
          var chapterKey = "chapter" + chapter;
          var scaling = this._difficultyScaling[chapterKey];
          if (!scaling) return 1.0; // 根据玩家等级调整难度

          if (playerLevel < 10) return scaling.easy;else if (playerLevel < 25) return scaling.medium;else return scaling.hard;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2ef1de70a34dfec50d26443e1669fa3ab562b2a3.js.map