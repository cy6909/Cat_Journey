System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sys, CurrencyType, PurchaseType, MonetizationManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ShopCategory, ItemRarity, ShopManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCurrencyType(extras) {
    _reporterNs.report("CurrencyType", "./MonetizationManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPurchaseType(extras) {
    _reporterNs.report("PurchaseType", "./MonetizationManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonetizationManager(extras) {
    _reporterNs.report("MonetizationManager", "./MonetizationManager", _context.meta, extras);
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
    }, function (_unresolved_2) {
      CurrencyType = _unresolved_2.CurrencyType;
      PurchaseType = _unresolved_2.PurchaseType;
      MonetizationManager = _unresolved_2.MonetizationManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ee919fd+8xI3otyntXxqiyq", "ShopManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ShopCategory", ShopCategory = /*#__PURE__*/function (ShopCategory) {
        ShopCategory["CURRENCY"] = "currency";
        ShopCategory["EQUIPMENT"] = "equipment";
        ShopCategory["CONSUMABLES"] = "consumables";
        ShopCategory["VIP"] = "vip";
        ShopCategory["SPECIAL"] = "special";
        ShopCategory["LEGENDARY"] = "legendary";
        return ShopCategory;
      }({}));

      _export("ItemRarity", ItemRarity = /*#__PURE__*/function (ItemRarity) {
        ItemRarity["COMMON"] = "common";
        ItemRarity["RARE"] = "rare";
        ItemRarity["EPIC"] = "epic";
        ItemRarity["LEGENDARY"] = "legendary";
        return ItemRarity;
      }({}));

      _export("ShopManager", ShopManager = (_dec = ccclass('ShopManager'), _dec2 = property({
        type: _crd && MonetizationManager === void 0 ? (_reportPossibleCrUseOfMonetizationManager({
          error: Error()
        }), MonetizationManager) : MonetizationManager
      }), _dec(_class = (_class2 = class ShopManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "monetizationManager", _descriptor, this);

          // 商店物品配置
          this._shopItems = new Map();
          // 购买记录
          this._purchaseRecords = new Map();
          // VIP专享物品
          this._vipExclusiveItems = new Set();
          // 限时特惠物品
          this._limitedOffers = new Map();
          // itemId -> endTime
          // 每日刷新物品
          this._dailyRefreshItems = new Set();
          this._lastRefreshDate = '';
        }

        onLoad() {
          this.initializeShopItems();
          this.loadPurchaseRecords();
          this.checkDailyRefresh();
        }

        start() {
          if (!this.monetizationManager) {
            this.monetizationManager = this.getComponent(_crd && MonetizationManager === void 0 ? (_reportPossibleCrUseOfMonetizationManager({
              error: Error()
            }), MonetizationManager) : MonetizationManager);
          }
        }

        initializeShopItems() {
          this.createCurrencyItems();
          this.createEquipmentItems();
          this.createConsumableItems();
          this.createVIPItems();
          this.createSpecialOffers();
          this.createLegendaryItems();
        }

        createCurrencyItems() {
          // 小宝石包
          this._shopItems.set('gems_small', {
            id: 'gems_small',
            name: '小宝石包',
            description: '100宝石，新手推荐',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.COMMON,
            realPrice: 600,
            // ¥6
            contents: [{
              type: 'currency',
              subType: 'gems',
              amount: 100
            }],
            iconPath: 'shop/gems_small',
            featured: true
          }); // 中宝石包


          this._shopItems.set('gems_medium', {
            id: 'gems_medium',
            name: '中宝石包',
            description: '600宝石 + 100奖励宝石',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.RARE,
            realPrice: 3000,
            // ¥30
            contents: [{
              type: 'currency',
              subType: 'gems',
              amount: 600
            }, {
              type: 'currency',
              subType: 'gems',
              amount: 100
            } // 奖励
            ],
            iconPath: 'shop/gems_medium',
            hot: true
          }); // 大宝石包


          this._shopItems.set('gems_large', {
            id: 'gems_large',
            name: '大宝石包',
            description: '2000宝石 + 500奖励宝石 + 专属头像框',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.EPIC,
            realPrice: 9800,
            // ¥98
            contents: [{
              type: 'currency',
              subType: 'gems',
              amount: 2000
            }, {
              type: 'currency',
              subType: 'gems',
              amount: 500
            }, // 奖励
            {
              type: 'unlock',
              subType: 'avatar_frame',
              amount: 1,
              data: {
                frameId: 'golden_dragon'
              }
            }],
            iconPath: 'shop/gems_large'
          }); // 金币宝石组合包


          this._shopItems.set('combo_pack', {
            id: 'combo_pack',
            name: '财富组合包',
            description: '500宝石 + 50000金币 + 体力药水x3',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.RARE,
            realPrice: 1800,
            // ¥18
            originalPrice: 2400,
            discountPercent: 25,
            contents: [{
              type: 'currency',
              subType: 'gems',
              amount: 500
            }, {
              type: 'currency',
              subType: 'coins',
              amount: 50000
            }, {
              type: 'item',
              subType: 'energy_potion',
              amount: 3
            }],
            iconPath: 'shop/combo_pack'
          });
        }

        createEquipmentItems() {
          // 传说挡板
          this._shopItems.set('legendary_paddle', {
            id: 'legendary_paddle',
            name: '神话破坏者',
            description: '传说级挡板：攻击力+50%，耐久度翻倍，自动修复',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 800,
            oneTimePurchase: true,
            contents: [{
              type: 'item',
              subType: 'paddle',
              amount: 1,
              data: {
                paddleType: 'legendary_destroyer',
                stats: {
                  damage: 1.5,
                  durability: 2.0,
                  autoRepair: true
                }
              }
            }],
            iconPath: 'shop/legendary_paddle',
            featured: true
          }); // 传说弹球


          this._shopItems.set('legendary_ball', {
            id: 'legendary_ball',
            name: '混沌之球',
            description: '传说级弹球：随机3种效果，穿透+无限反弹',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 1000,
            oneTimePurchase: true,
            levelRequirement: 20,
            contents: [{
              type: 'item',
              subType: 'ball',
              amount: 1,
              data: {
                ballType: 'legendary_chaos',
                effects: ['piercing', 'infinite_bounce', 'random_effects']
              }
            }],
            iconPath: 'shop/legendary_ball'
          }); // 传说核心


          this._shopItems.set('legendary_core', {
            id: 'legendary_core',
            name: '永恒之心',
            description: '传说级核心：生命值+200%，25%免伤几率',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 1200,
            oneTimePurchase: true,
            levelRequirement: 25,
            contents: [{
              type: 'item',
              subType: 'core',
              amount: 1,
              data: {
                coreType: 'legendary_eternal',
                stats: {
                  health: 3.0,
                  damageReduction: 0.25
                }
              }
            }],
            iconPath: 'shop/legendary_core'
          }); // 稀有装备随机包


          this._shopItems.set('rare_equipment_pack', {
            id: 'rare_equipment_pack',
            name: '稀有装备包',
            description: '随机获得一件稀有品质装备',
            category: ShopCategory.EQUIPMENT,
            rarity: ItemRarity.RARE,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 300,
            purchaseLimit: 5,
            // 每日限购5个
            contents: [{
              type: 'item',
              subType: 'equipment_random',
              amount: 1,
              data: {
                rarity: 'rare'
              }
            }],
            iconPath: 'shop/rare_equipment_pack'
          });
        }

        createConsumableItems() {
          // 体力药水
          this._shopItems.set('energy_potion_small', {
            id: 'energy_potion_small',
            name: '小体力药水',
            description: '立即恢复30点体力',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.COMMON,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 20,
            purchaseLimit: 10,
            contents: [{
              type: 'boost',
              subType: 'energy_restore',
              amount: 30
            }],
            iconPath: 'shop/energy_potion_small'
          });

          this._shopItems.set('energy_potion_large', {
            id: 'energy_potion_large',
            name: '大体力药水',
            description: '立即恢复满体力',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.RARE,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 50,
            purchaseLimit: 5,
            contents: [{
              type: 'boost',
              subType: 'energy_restore',
              amount: 100
            }],
            iconPath: 'shop/energy_potion_large'
          }); // 经验双倍卡


          this._shopItems.set('exp_double_card', {
            id: 'exp_double_card',
            name: '经验双倍卡',
            description: '1小时内获得双倍经验',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.COMMON,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).COINS,
            currencyAmount: 5000,
            contents: [{
              type: 'boost',
              subType: 'exp_multiplier',
              amount: 2,
              data: {
                duration: 3600
              }
            }],
            iconPath: 'shop/exp_double_card'
          }); // 金币双倍卡


          this._shopItems.set('coin_double_card', {
            id: 'coin_double_card',
            name: '金币双倍卡',
            description: '1小时内获得双倍金币',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.COMMON,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 30,
            contents: [{
              type: 'boost',
              subType: 'coin_multiplier',
              amount: 2,
              data: {
                duration: 3600
              }
            }],
            iconPath: 'shop/coin_double_card'
          }); // 复活币


          this._shopItems.set('revival_coin', {
            id: 'revival_coin',
            name: '复活币',
            description: '失败时可使用复活币继续游戏',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.RARE,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 80,
            purchaseLimit: 3,
            contents: [{
              type: 'item',
              subType: 'revival_token',
              amount: 1
            }],
            iconPath: 'shop/revival_coin'
          });
        }

        createVIPItems() {
          // 月度VIP
          this._shopItems.set('vip_monthly', {
            id: 'vip_monthly',
            name: '月度VIP',
            description: '30天VIP特权：双倍经验，体力恢复翻倍，专属商店',
            category: ShopCategory.VIP,
            rarity: ItemRarity.EPIC,
            realPrice: 3000,
            // ¥30
            contents: [{
              type: 'unlock',
              subType: 'vip_status',
              amount: 30
            } // 30天VIP
            ],
            iconPath: 'shop/vip_monthly',
            hot: true
          }); // 季度VIP


          this._shopItems.set('vip_seasonal', {
            id: 'vip_seasonal',
            name: '季度VIP',
            description: '90天VIP特权 + 1000奖励宝石 + 专属称号',
            category: ShopCategory.VIP,
            rarity: ItemRarity.EPIC,
            realPrice: 8000,
            // ¥80
            originalPrice: 9000,
            discountPercent: 11,
            contents: [{
              type: 'unlock',
              subType: 'vip_status',
              amount: 90
            }, {
              type: 'currency',
              subType: 'gems',
              amount: 1000
            }, {
              type: 'unlock',
              subType: 'title',
              amount: 1,
              data: {
                titleId: 'vip_patron'
              }
            }],
            iconPath: 'shop/vip_seasonal'
          }); // VIP专享礼包 - 只有VIP才能看到和购买


          this._shopItems.set('vip_exclusive_pack', {
            id: 'vip_exclusive_pack',
            name: 'VIP专享礼包',
            description: 'VIP专属：稀有遗物x2 + 传说装备碎片x10',
            category: ShopCategory.VIP,
            rarity: ItemRarity.LEGENDARY,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 500,
            vipOnly: true,
            purchaseLimit: 1,
            // 每日限购1个
            contents: [{
              type: 'item',
              subType: 'relic_random',
              amount: 2,
              data: {
                rarity: 'rare'
              }
            }, {
              type: 'item',
              subType: 'legendary_fragments',
              amount: 10
            }],
            iconPath: 'shop/vip_exclusive_pack'
          });

          this._vipExclusiveItems.add('vip_exclusive_pack');
        }

        createSpecialOffers() {
          // 新手特惠包
          this._shopItems.set('starter_pack', {
            id: 'starter_pack',
            name: '新手特惠礼包',
            description: '限时优惠：1000宝石 + 传说遗物 + 新手装备',
            category: ShopCategory.SPECIAL,
            rarity: ItemRarity.EPIC,
            realPrice: 600,
            // ¥6
            originalPrice: 3000,
            discountPercent: 80,
            oneTimePurchase: true,
            levelRequirement: 1,
            // 新手限定
            contents: [{
              type: 'currency',
              subType: 'gems',
              amount: 1000
            }, {
              type: 'item',
              subType: 'relic_random',
              amount: 1,
              data: {
                rarity: 'legendary'
              }
            }, {
              type: 'item',
              subType: 'starter_equipment_set',
              amount: 1
            }],
            iconPath: 'shop/starter_pack',
            featured: true,
            hot: true,
            new: true
          }); // 周末特惠


          this._shopItems.set('weekend_special', {
            id: 'weekend_special',
            name: '周末狂欢包',
            description: '限时特惠：双倍卡x5 + 复活币x3 + 500宝石',
            category: ShopCategory.SPECIAL,
            rarity: ItemRarity.RARE,
            realPrice: 1200,
            // ¥12
            originalPrice: 2000,
            discountPercent: 40,
            purchaseLimit: 2,
            // 周末限购2次
            contents: [{
              type: 'item',
              subType: 'exp_double_card',
              amount: 3
            }, {
              type: 'item',
              subType: 'coin_double_card',
              amount: 2
            }, {
              type: 'item',
              subType: 'revival_token',
              amount: 3
            }, {
              type: 'currency',
              subType: 'gems',
              amount: 500
            }],
            iconPath: 'shop/weekend_special',
            hot: true
          }); // 设置限时特惠结束时间（示例：7天后）


          const weekendEndTime = Date.now() + 7 * 24 * 60 * 60 * 1000;

          this._limitedOffers.set('weekend_special', weekendEndTime);
        }

        createLegendaryItems() {
          // 传说遗物箱
          this._shopItems.set('legendary_relic_box', {
            id: 'legendary_relic_box',
            name: '传说遗物箱',
            description: '保底获得1个传说遗物，小概率获得神话遗物',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 600,
            purchaseLimit: 3,
            // 每日限购3个
            contents: [{
              type: 'item',
              subType: 'relic_box',
              amount: 1,
              data: {
                guaranteedRarity: 'legendary',
                bonusChance: {
                  rarity: 'mythic',
                  probability: 0.05
                }
              }
            }],
            iconPath: 'shop/legendary_relic_box',
            featured: true
          }); // 装备强化石


          this._shopItems.set('enhancement_stones', {
            id: 'enhancement_stones',
            name: '装备强化石',
            description: '用于强化装备，提升装备属性',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.EPIC,
            currencyType: (_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
              error: Error()
            }), CurrencyType) : CurrencyType).GEMS,
            currencyAmount: 150,
            contents: [{
              type: 'item',
              subType: 'enhancement_stone',
              amount: 5
            }],
            iconPath: 'shop/enhancement_stones'
          }); // 终极挑战通行证


          this._shopItems.set('ultimate_pass', {
            id: 'ultimate_pass',
            name: '终极挑战通行证',
            description: '解锁终极挑战模式，获得独特奖励和称号',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            realPrice: 5000,
            // ¥50
            oneTimePurchase: true,
            levelRequirement: 30,
            contents: [{
              type: 'unlock',
              subType: 'game_mode',
              amount: 1,
              data: {
                modeId: 'ultimate_challenge'
              }
            }, {
              type: 'unlock',
              subType: 'title',
              amount: 1,
              data: {
                titleId: 'ultimate_challenger'
              }
            }],
            iconPath: 'shop/ultimate_pass'
          });
        } // 获取商店物品列表


        getShopItems(category) {
          let items = Array.from(this._shopItems.values());

          if (category) {
            items = items.filter(item => item.category === category);
          } // 过滤VIP专享物品


          if (this.monetizationManager && !this.monetizationManager.isVIP()) {
            items = items.filter(item => !item.vipOnly);
          } // 检查限时特惠


          items = items.filter(item => this.isItemAvailable(item.id)); // 按特色和稀有度排序

          items.sort((a, b) => {
            // 推荐物品排在前面
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1; // 热门物品次之

            if (a.hot && !b.hot) return -1;
            if (!a.hot && b.hot) return 1; // 按稀有度排序

            const rarityOrder = {
              common: 0,
              rare: 1,
              epic: 2,
              legendary: 3
            };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
          });
          return items;
        } // 获取单个商店物品


        getShopItem(itemId) {
          return this._shopItems.get(itemId);
        } // 检查物品是否可购买


        canPurchaseItem(itemId) {
          const item = this._shopItems.get(itemId);

          if (!item) {
            return {
              canPurchase: false,
              reason: '物品不存在'
            };
          } // 检查VIP权限


          if (item.vipOnly && this.monetizationManager && !this.monetizationManager.isVIP()) {
            return {
              canPurchase: false,
              reason: '需要VIP权限'
            };
          } // 检查等级要求


          if (item.levelRequirement && this.getPlayerLevel() < item.levelRequirement) {
            return {
              canPurchase: false,
              reason: `需要等级 ${item.levelRequirement}`
            };
          } // 检查限时特惠


          if (!this.isItemAvailable(itemId)) {
            return {
              canPurchase: false,
              reason: '限时特惠已结束'
            };
          } // 检查购买次数限制


          const purchaseRecord = this._purchaseRecords.get(itemId);

          if (item.purchaseLimit && purchaseRecord) {
            this.resetDailyPurchasesIfNeeded();

            if (purchaseRecord.purchaseCount >= item.purchaseLimit) {
              return {
                canPurchase: false,
                reason: '已达购买上限'
              };
            }
          } // 检查一次性购买


          if (item.oneTimePurchase && purchaseRecord && purchaseRecord.purchaseCount > 0) {
            return {
              canPurchase: false,
              reason: '已购买过此物品'
            };
          } // 检查货币是否充足


          if (item.currencyType && item.currencyAmount && this.monetizationManager) {
            const currentAmount = this.monetizationManager.getCurrency(item.currencyType);

            if (currentAmount < item.currencyAmount) {
              return {
                canPurchase: false,
                reason: `${item.currencyType}不足`
              };
            }
          }

          return {
            canPurchase: true
          };
        } // 购买物品


        async purchaseItem(itemId) {
          const purchaseCheck = this.canPurchaseItem(itemId);

          if (!purchaseCheck.canPurchase) {
            return {
              success: false,
              message: purchaseCheck.reason
            };
          }

          const item = this._shopItems.get(itemId);

          let success = false;

          if (item.realPrice) {
            // 真实货币购买
            if (this.monetizationManager) {
              const purchaseType = this.getPurchaseTypeForItem(itemId);

              if (purchaseType) {
                success = await this.monetizationManager.purchaseItem(purchaseType);
              }
            }
          } else if (item.currencyType && item.currencyAmount) {
            // 游戏币购买
            if (this.monetizationManager && this.monetizationManager.subtractCurrency(item.currencyType, item.currencyAmount)) {
              success = true;
              this.grantItemRewards(item);
            }
          }

          if (success) {
            this.recordPurchase(itemId);
            this.savePurchaseRecords();
            return {
              success: true,
              message: '购买成功！'
            };
          } else {
            return {
              success: false,
              message: '购买失败，请重试'
            };
          }
        } // 获取每日刷新物品


        getDailyRefreshItems() {
          this.checkDailyRefresh();
          return Array.from(this._dailyRefreshItems).map(itemId => this._shopItems.get(itemId)).filter(item => item !== undefined);
        } // 手动刷新每日物品（消耗宝石）


        refreshDailyItems() {
          const refreshCost = 50; // 50宝石刷新

          if (this.monetizationManager && this.monetizationManager.subtractCurrency((_crd && CurrencyType === void 0 ? (_reportPossibleCrUseOfCurrencyType({
            error: Error()
          }), CurrencyType) : CurrencyType).GEMS, refreshCost)) {
            this.generateDailyRefreshItems();
            this.savePurchaseRecords();
            return Promise.resolve({
              success: true,
              cost: refreshCost
            });
          }

          return Promise.resolve({
            success: false
          });
        } // 私有辅助方法


        isItemAvailable(itemId) {
          const endTime = this._limitedOffers.get(itemId);

          if (endTime && Date.now() > endTime) {
            return false;
          }

          return true;
        }

        recordPurchase(itemId) {
          let record = this._purchaseRecords.get(itemId);

          if (!record) {
            record = {
              itemId: itemId,
              purchaseTime: Date.now(),
              purchaseCount: 0
            };

            this._purchaseRecords.set(itemId, record);
          }

          record.purchaseCount++;
          record.purchaseTime = Date.now();
        }

        resetDailyPurchasesIfNeeded() {
          const today = new Date().toDateString();

          for (const [itemId, record] of this._purchaseRecords.entries()) {
            const recordDate = new Date(record.purchaseTime).toDateString();

            if (recordDate !== today) {
              const item = this._shopItems.get(itemId);

              if (item && item.purchaseLimit && !item.oneTimePurchase) {
                record.purchaseCount = 0; // 重置每日购买次数
              }
            }
          }
        }

        checkDailyRefresh() {
          const today = new Date().toDateString();

          if (this._lastRefreshDate !== today) {
            this.generateDailyRefreshItems();
            this._lastRefreshDate = today;
            this.savePurchaseRecords();
          }
        }

        generateDailyRefreshItems() {
          this._dailyRefreshItems.clear(); // 随机选择4个每日刷新物品


          const availableItems = Array.from(this._shopItems.keys()).filter(itemId => {
            const item = this._shopItems.get(itemId);

            return !item.oneTimePurchase && item.category !== ShopCategory.VIP;
          });

          for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const selectedItem = availableItems[randomIndex];

            this._dailyRefreshItems.add(selectedItem);

            availableItems.splice(randomIndex, 1);
          }
        }

        grantItemRewards(item) {
          // 通知外部系统发放奖励
          this.node.emit('item-purchased', {
            itemId: item.id,
            contents: item.contents
          });
          console.log(`Item purchased: ${item.name}`, item.contents);
        }

        getPurchaseTypeForItem(itemId) {
          const purchaseTypeMap = {
            'gems_small': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).GEMS_SMALL,
            'gems_medium': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).GEMS_MEDIUM,
            'gems_large': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).GEMS_LARGE,
            'vip_monthly': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).VIP_MONTHLY,
            'starter_pack': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).STARTER_PACK,
            'legendary_paddle': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).LEGENDARY_PADDLE,
            'legendary_ball': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).LEGENDARY_BALL,
            'legendary_core': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).LEGENDARY_CORE,
            'legendary_relic_box': (_crd && PurchaseType === void 0 ? (_reportPossibleCrUseOfPurchaseType({
              error: Error()
            }), PurchaseType) : PurchaseType).LEGENDARY_RELIC
          };
          return purchaseTypeMap[itemId] || null;
        }

        getPlayerLevel() {
          // 获取玩家等级的逻辑，这里简化处理
          return 1;
        } // 数据持久化


        savePurchaseRecords() {
          const data = {
            purchaseRecords: Array.from(this._purchaseRecords.entries()),
            dailyRefreshItems: Array.from(this._dailyRefreshItems),
            lastRefreshDate: this._lastRefreshDate,
            limitedOffers: Array.from(this._limitedOffers.entries())
          };
          sys.localStorage.setItem('shop_manager_data', JSON.stringify(data));
        }

        loadPurchaseRecords() {
          const data = sys.localStorage.getItem('shop_manager_data');

          if (data) {
            const parsed = JSON.parse(data);

            if (parsed.purchaseRecords) {
              this._purchaseRecords = new Map(parsed.purchaseRecords);
            }

            if (parsed.dailyRefreshItems) {
              this._dailyRefreshItems = new Set(parsed.dailyRefreshItems);
            }

            this._lastRefreshDate = parsed.lastRefreshDate || '';

            if (parsed.limitedOffers) {
              this._limitedOffers = new Map(parsed.limitedOffers);
            }
          }
        } // 调试和管理方法


        addSpecialOffer(itemId, discountPercent, durationHours) {
          const item = this._shopItems.get(itemId);

          if (!item) return false;
          item.originalPrice = item.realPrice || item.currencyAmount || 0;
          item.discountPercent = discountPercent;

          if (item.realPrice) {
            item.realPrice = Math.floor(item.realPrice * (100 - discountPercent) / 100);
          } else if (item.currencyAmount) {
            item.currencyAmount = Math.floor(item.currencyAmount * (100 - discountPercent) / 100);
          }

          const endTime = Date.now() + durationHours * 60 * 60 * 1000;

          this._limitedOffers.set(itemId, endTime);

          item.discountEndTime = endTime;
          this.savePurchaseRecords();
          return true;
        }

        getShopStatistics() {
          return {
            totalItems: this._shopItems.size,
            totalPurchases: Array.from(this._purchaseRecords.values()).reduce((sum, record) => sum + record.purchaseCount, 0),
            vipExclusiveItems: this._vipExclusiveItems.size,
            activeLimitedOffers: this._limitedOffers.size,
            dailyRefreshItems: this._dailyRefreshItems.size
          };
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "monetizationManager", [_dec2], {
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
//# sourceMappingURL=a0766e7a898d5287ed8383dc1c281edbd7f95d1b.js.map