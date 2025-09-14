import { _decorator, Component, Node, sys } from 'cc';
import { CurrencyType, PurchaseType, MonetizationManager } from './MonetizationManager';

const { ccclass, property } = _decorator;

export enum ShopCategory {
    CURRENCY = 'currency',           // 货币包
    EQUIPMENT = 'equipment',         // 装备商店
    CONSUMABLES = 'consumables',     // 消耗品
    VIP = 'vip',                    // VIP服务
    SPECIAL = 'special',            // 特惠活动
    LEGENDARY = 'legendary'         // 传说商店
}

export enum ItemRarity {
    COMMON = 'common',              // 普通
    RARE = 'rare',                  // 稀有
    EPIC = 'epic',                  // 史诗
    LEGENDARY = 'legendary'         // 传说
}

interface ShopItem {
    id: string;
    name: string;
    description: string;
    category: ShopCategory;
    rarity: ItemRarity;
    
    // 价格信息
    realPrice?: number;             // 人民币价格(分)
    currencyType?: CurrencyType;    // 游戏币类型
    currencyAmount?: number;        // 游戏币价格
    
    // 购买限制
    purchaseLimit?: number;         // 购买次数限制
    oneTimePurchase?: boolean;      // 是否一次性购买
    vipOnly?: boolean;             // VIP专属
    levelRequirement?: number;      // 等级要求
    
    // 折扣信息
    originalPrice?: number;         // 原价
    discountPercent?: number;       // 折扣百分比
    discountEndTime?: number;       // 折扣结束时间
    
    // 商品内容
    contents: ShopItemContent[];
    
    // 显示信息
    iconPath?: string;              // 图标路径
    featured?: boolean;             // 是否推荐
    hot?: boolean;                 // 是否热门
    new?: boolean;                 // 是否新品
}

interface ShopItemContent {
    type: 'currency' | 'item' | 'boost' | 'unlock';
    subType: string;                // 具体类型
    amount: number;                 // 数量
    data?: any;                    // 额外数据
}

interface PurchaseRecord {
    itemId: string;
    purchaseTime: number;
    purchaseCount: number;
}

@ccclass('ShopManager')
export class ShopManager extends Component {
    
    @property({type: MonetizationManager})
    public monetizationManager: MonetizationManager | null = null;
    
    // 商店物品配置
    private _shopItems: Map<string, ShopItem> = new Map();
    
    // 购买记录
    private _purchaseRecords: Map<string, PurchaseRecord> = new Map();
    
    // VIP专享物品
    private _vipExclusiveItems: Set<string> = new Set();
    
    // 限时特惠物品
    private _limitedOffers: Map<string, number> = new Map(); // itemId -> endTime
    
    // 每日刷新物品
    private _dailyRefreshItems: Set<string> = new Set();
    private _lastRefreshDate: string = '';
    
    protected onLoad(): void {
        this.initializeShopItems();
        this.loadPurchaseRecords();
        this.checkDailyRefresh();
    }
    
    protected start(): void {
        if (!this.monetizationManager) {
            this.monetizationManager = this.getComponent(MonetizationManager);
        }
    }
    
    private initializeShopItems(): void {
        this.createCurrencyItems();
        this.createEquipmentItems();
        this.createConsumableItems();
        this.createVIPItems();
        this.createSpecialOffers();
        this.createLegendaryItems();
    }
    
    private createCurrencyItems(): void {
        // 小宝石包
        this._shopItems.set('gems_small', {
            id: 'gems_small',
            name: '小宝石包',
            description: '100宝石，新手推荐',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.COMMON,
            realPrice: 600, // ¥6
            contents: [
                { type: 'currency', subType: 'gems', amount: 100 }
            ],
            iconPath: 'shop/gems_small',
            featured: true
        });
        
        // 中宝石包
        this._shopItems.set('gems_medium', {
            id: 'gems_medium',
            name: '中宝石包',
            description: '600宝石 + 100奖励宝石',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.RARE,
            realPrice: 3000, // ¥30
            contents: [
                { type: 'currency', subType: 'gems', amount: 600 },
                { type: 'currency', subType: 'gems', amount: 100 } // 奖励
            ],
            iconPath: 'shop/gems_medium',
            hot: true
        });
        
        // 大宝石包
        this._shopItems.set('gems_large', {
            id: 'gems_large',
            name: '大宝石包',
            description: '2000宝石 + 500奖励宝石 + 专属头像框',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.EPIC,
            realPrice: 9800, // ¥98
            contents: [
                { type: 'currency', subType: 'gems', amount: 2000 },
                { type: 'currency', subType: 'gems', amount: 500 }, // 奖励
                { type: 'unlock', subType: 'avatar_frame', amount: 1, data: { frameId: 'golden_dragon' } }
            ],
            iconPath: 'shop/gems_large'
        });
        
        // 金币宝石组合包
        this._shopItems.set('combo_pack', {
            id: 'combo_pack',
            name: '财富组合包',
            description: '500宝石 + 50000金币 + 体力药水x3',
            category: ShopCategory.CURRENCY,
            rarity: ItemRarity.RARE,
            realPrice: 1800, // ¥18
            originalPrice: 2400,
            discountPercent: 25,
            contents: [
                { type: 'currency', subType: 'gems', amount: 500 },
                { type: 'currency', subType: 'coins', amount: 50000 },
                { type: 'item', subType: 'energy_potion', amount: 3 }
            ],
            iconPath: 'shop/combo_pack'
        });
    }
    
    private createEquipmentItems(): void {
        // 传说挡板
        this._shopItems.set('legendary_paddle', {
            id: 'legendary_paddle',
            name: '神话破坏者',
            description: '传说级挡板：攻击力+50%，耐久度翻倍，自动修复',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 800,
            oneTimePurchase: true,
            contents: [
                { 
                    type: 'item', 
                    subType: 'paddle', 
                    amount: 1, 
                    data: { 
                        paddleType: 'legendary_destroyer',
                        stats: { damage: 1.5, durability: 2.0, autoRepair: true }
                    } 
                }
            ],
            iconPath: 'shop/legendary_paddle',
            featured: true
        });
        
        // 传说弹球
        this._shopItems.set('legendary_ball', {
            id: 'legendary_ball',
            name: '混沌之球',
            description: '传说级弹球：随机3种效果，穿透+无限反弹',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 1000,
            oneTimePurchase: true,
            levelRequirement: 20,
            contents: [
                { 
                    type: 'item', 
                    subType: 'ball', 
                    amount: 1,
                    data: { 
                        ballType: 'legendary_chaos',
                        effects: ['piercing', 'infinite_bounce', 'random_effects']
                    }
                }
            ],
            iconPath: 'shop/legendary_ball'
        });
        
        // 传说核心
        this._shopItems.set('legendary_core', {
            id: 'legendary_core',
            name: '永恒之心',
            description: '传说级核心：生命值+200%，25%免伤几率',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 1200,
            oneTimePurchase: true,
            levelRequirement: 25,
            contents: [
                { 
                    type: 'item', 
                    subType: 'core', 
                    amount: 1,
                    data: { 
                        coreType: 'legendary_eternal',
                        stats: { health: 3.0, damageReduction: 0.25 }
                    }
                }
            ],
            iconPath: 'shop/legendary_core'
        });
        
        // 稀有装备随机包
        this._shopItems.set('rare_equipment_pack', {
            id: 'rare_equipment_pack',
            name: '稀有装备包',
            description: '随机获得一件稀有品质装备',
            category: ShopCategory.EQUIPMENT,
            rarity: ItemRarity.RARE,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 300,
            purchaseLimit: 5, // 每日限购5个
            contents: [
                { type: 'item', subType: 'equipment_random', amount: 1, data: { rarity: 'rare' } }
            ],
            iconPath: 'shop/rare_equipment_pack'
        });
    }
    
    private createConsumableItems(): void {
        // 体力药水
        this._shopItems.set('energy_potion_small', {
            id: 'energy_potion_small',
            name: '小体力药水',
            description: '立即恢复30点体力',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.COMMON,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 20,
            purchaseLimit: 10,
            contents: [
                { type: 'boost', subType: 'energy_restore', amount: 30 }
            ],
            iconPath: 'shop/energy_potion_small'
        });
        
        this._shopItems.set('energy_potion_large', {
            id: 'energy_potion_large',
            name: '大体力药水',
            description: '立即恢复满体力',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.RARE,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 50,
            purchaseLimit: 5,
            contents: [
                { type: 'boost', subType: 'energy_restore', amount: 100 }
            ],
            iconPath: 'shop/energy_potion_large'
        });
        
        // 经验双倍卡
        this._shopItems.set('exp_double_card', {
            id: 'exp_double_card',
            name: '经验双倍卡',
            description: '1小时内获得双倍经验',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.COMMON,
            currencyType: CurrencyType.COINS,
            currencyAmount: 5000,
            contents: [
                { type: 'boost', subType: 'exp_multiplier', amount: 2, data: { duration: 3600 } }
            ],
            iconPath: 'shop/exp_double_card'
        });
        
        // 金币双倍卡
        this._shopItems.set('coin_double_card', {
            id: 'coin_double_card',
            name: '金币双倍卡',
            description: '1小时内获得双倍金币',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.COMMON,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 30,
            contents: [
                { type: 'boost', subType: 'coin_multiplier', amount: 2, data: { duration: 3600 } }
            ],
            iconPath: 'shop/coin_double_card'
        });
        
        // 复活币
        this._shopItems.set('revival_coin', {
            id: 'revival_coin',
            name: '复活币',
            description: '失败时可使用复活币继续游戏',
            category: ShopCategory.CONSUMABLES,
            rarity: ItemRarity.RARE,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 80,
            purchaseLimit: 3,
            contents: [
                { type: 'item', subType: 'revival_token', amount: 1 }
            ],
            iconPath: 'shop/revival_coin'
        });
    }
    
    private createVIPItems(): void {
        // 月度VIP
        this._shopItems.set('vip_monthly', {
            id: 'vip_monthly',
            name: '月度VIP',
            description: '30天VIP特权：双倍经验，体力恢复翻倍，专属商店',
            category: ShopCategory.VIP,
            rarity: ItemRarity.EPIC,
            realPrice: 3000, // ¥30
            contents: [
                { type: 'unlock', subType: 'vip_status', amount: 30 } // 30天VIP
            ],
            iconPath: 'shop/vip_monthly',
            hot: true
        });
        
        // 季度VIP
        this._shopItems.set('vip_seasonal', {
            id: 'vip_seasonal',
            name: '季度VIP',
            description: '90天VIP特权 + 1000奖励宝石 + 专属称号',
            category: ShopCategory.VIP,
            rarity: ItemRarity.EPIC,
            realPrice: 8000, // ¥80
            originalPrice: 9000,
            discountPercent: 11,
            contents: [
                { type: 'unlock', subType: 'vip_status', amount: 90 },
                { type: 'currency', subType: 'gems', amount: 1000 },
                { type: 'unlock', subType: 'title', amount: 1, data: { titleId: 'vip_patron' } }
            ],
            iconPath: 'shop/vip_seasonal'
        });
        
        // VIP专享礼包 - 只有VIP才能看到和购买
        this._shopItems.set('vip_exclusive_pack', {
            id: 'vip_exclusive_pack',
            name: 'VIP专享礼包',
            description: 'VIP专属：稀有遗物x2 + 传说装备碎片x10',
            category: ShopCategory.VIP,
            rarity: ItemRarity.LEGENDARY,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 500,
            vipOnly: true,
            purchaseLimit: 1, // 每日限购1个
            contents: [
                { type: 'item', subType: 'relic_random', amount: 2, data: { rarity: 'rare' } },
                { type: 'item', subType: 'legendary_fragments', amount: 10 }
            ],
            iconPath: 'shop/vip_exclusive_pack'
        });
        
        this._vipExclusiveItems.add('vip_exclusive_pack');
    }
    
    private createSpecialOffers(): void {
        // 新手特惠包
        this._shopItems.set('starter_pack', {
            id: 'starter_pack',
            name: '新手特惠礼包',
            description: '限时优惠：1000宝石 + 传说遗物 + 新手装备',
            category: ShopCategory.SPECIAL,
            rarity: ItemRarity.EPIC,
            realPrice: 600, // ¥6
            originalPrice: 3000,
            discountPercent: 80,
            oneTimePurchase: true,
            levelRequirement: 1, // 新手限定
            contents: [
                { type: 'currency', subType: 'gems', amount: 1000 },
                { type: 'item', subType: 'relic_random', amount: 1, data: { rarity: 'legendary' } },
                { type: 'item', subType: 'starter_equipment_set', amount: 1 }
            ],
            iconPath: 'shop/starter_pack',
            featured: true,
            hot: true,
            new: true
        });
        
        // 周末特惠
        this._shopItems.set('weekend_special', {
            id: 'weekend_special',
            name: '周末狂欢包',
            description: '限时特惠：双倍卡x5 + 复活币x3 + 500宝石',
            category: ShopCategory.SPECIAL,
            rarity: ItemRarity.RARE,
            realPrice: 1200, // ¥12
            originalPrice: 2000,
            discountPercent: 40,
            purchaseLimit: 2, // 周末限购2次
            contents: [
                { type: 'item', subType: 'exp_double_card', amount: 3 },
                { type: 'item', subType: 'coin_double_card', amount: 2 },
                { type: 'item', subType: 'revival_token', amount: 3 },
                { type: 'currency', subType: 'gems', amount: 500 }
            ],
            iconPath: 'shop/weekend_special',
            hot: true
        });
        
        // 设置限时特惠结束时间（示例：7天后）
        const weekendEndTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        this._limitedOffers.set('weekend_special', weekendEndTime);
    }
    
    private createLegendaryItems(): void {
        // 传说遗物箱
        this._shopItems.set('legendary_relic_box', {
            id: 'legendary_relic_box',
            name: '传说遗物箱',
            description: '保底获得1个传说遗物，小概率获得神话遗物',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 600,
            purchaseLimit: 3, // 每日限购3个
            contents: [
                { 
                    type: 'item', 
                    subType: 'relic_box', 
                    amount: 1, 
                    data: { 
                        guaranteedRarity: 'legendary',
                        bonusChance: { rarity: 'mythic', probability: 0.05 }
                    } 
                }
            ],
            iconPath: 'shop/legendary_relic_box',
            featured: true
        });
        
        // 装备强化石
        this._shopItems.set('enhancement_stones', {
            id: 'enhancement_stones',
            name: '装备强化石',
            description: '用于强化装备，提升装备属性',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.EPIC,
            currencyType: CurrencyType.GEMS,
            currencyAmount: 150,
            contents: [
                { type: 'item', subType: 'enhancement_stone', amount: 5 }
            ],
            iconPath: 'shop/enhancement_stones'
        });
        
        // 终极挑战通行证
        this._shopItems.set('ultimate_pass', {
            id: 'ultimate_pass',
            name: '终极挑战通行证',
            description: '解锁终极挑战模式，获得独特奖励和称号',
            category: ShopCategory.LEGENDARY,
            rarity: ItemRarity.LEGENDARY,
            realPrice: 5000, // ¥50
            oneTimePurchase: true,
            levelRequirement: 30,
            contents: [
                { type: 'unlock', subType: 'game_mode', amount: 1, data: { modeId: 'ultimate_challenge' } },
                { type: 'unlock', subType: 'title', amount: 1, data: { titleId: 'ultimate_challenger' } }
            ],
            iconPath: 'shop/ultimate_pass'
        });
    }
    
    // 获取商店物品列表
    public getShopItems(category?: ShopCategory): ShopItem[] {
        let items = Array.from(this._shopItems.values());
        
        if (category) {
            items = items.filter(item => item.category === category);
        }
        
        // 过滤VIP专享物品
        if (this.monetizationManager && !this.monetizationManager.isVIP()) {
            items = items.filter(item => !item.vipOnly);
        }
        
        // 检查限时特惠
        items = items.filter(item => this.isItemAvailable(item.id));
        
        // 按特色和稀有度排序
        items.sort((a, b) => {
            // 推荐物品排在前面
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // 热门物品次之
            if (a.hot && !b.hot) return -1;
            if (!a.hot && b.hot) return 1;
            
            // 按稀有度排序
            const rarityOrder = { 
                common: 0, 
                rare: 1, 
                epic: 2, 
                legendary: 3 
            };
            
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        });
        
        return items;
    }
    
    // 获取单个商店物品
    public getShopItem(itemId: string): ShopItem | undefined {
        return this._shopItems.get(itemId);
    }
    
    // 检查物品是否可购买
    public canPurchaseItem(itemId: string): { canPurchase: boolean; reason?: string } {
        const item = this._shopItems.get(itemId);
        if (!item) {
            return { canPurchase: false, reason: '物品不存在' };
        }
        
        // 检查VIP权限
        if (item.vipOnly && this.monetizationManager && !this.monetizationManager.isVIP()) {
            return { canPurchase: false, reason: '需要VIP权限' };
        }
        
        // 检查等级要求
        if (item.levelRequirement && this.getPlayerLevel() < item.levelRequirement) {
            return { canPurchase: false, reason: `需要等级 ${item.levelRequirement}` };
        }
        
        // 检查限时特惠
        if (!this.isItemAvailable(itemId)) {
            return { canPurchase: false, reason: '限时特惠已结束' };
        }
        
        // 检查购买次数限制
        const purchaseRecord = this._purchaseRecords.get(itemId);
        if (item.purchaseLimit && purchaseRecord) {
            this.resetDailyPurchasesIfNeeded();
            if (purchaseRecord.purchaseCount >= item.purchaseLimit) {
                return { canPurchase: false, reason: '已达购买上限' };
            }
        }
        
        // 检查一次性购买
        if (item.oneTimePurchase && purchaseRecord && purchaseRecord.purchaseCount > 0) {
            return { canPurchase: false, reason: '已购买过此物品' };
        }
        
        // 检查货币是否充足
        if (item.currencyType && item.currencyAmount && this.monetizationManager) {
            const currentAmount = this.monetizationManager.getCurrency(item.currencyType);
            if (currentAmount < item.currencyAmount) {
                return { canPurchase: false, reason: `${item.currencyType}不足` };
            }
        }
        
        return { canPurchase: true };
    }
    
    // 购买物品
    public async purchaseItem(itemId: string): Promise<{ success: boolean; message?: string }> {
        const purchaseCheck = this.canPurchaseItem(itemId);
        if (!purchaseCheck.canPurchase) {
            return { success: false, message: purchaseCheck.reason };
        }
        
        const item = this._shopItems.get(itemId)!;
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
            if (this.monetizationManager && 
                this.monetizationManager.subtractCurrency(item.currencyType, item.currencyAmount)) {
                success = true;
                this.grantItemRewards(item);
            }
        }
        
        if (success) {
            this.recordPurchase(itemId);
            this.savePurchaseRecords();
            return { success: true, message: '购买成功！' };
        } else {
            return { success: false, message: '购买失败，请重试' };
        }
    }
    
    // 获取每日刷新物品
    public getDailyRefreshItems(): ShopItem[] {
        this.checkDailyRefresh();
        
        return Array.from(this._dailyRefreshItems)
            .map(itemId => this._shopItems.get(itemId))
            .filter(item => item !== undefined) as ShopItem[];
    }
    
    // 手动刷新每日物品（消耗宝石）
    public refreshDailyItems(): Promise<{ success: boolean; cost?: number }> {
        const refreshCost = 50; // 50宝石刷新
        
        if (this.monetizationManager && 
            this.monetizationManager.subtractCurrency(CurrencyType.GEMS, refreshCost)) {
            this.generateDailyRefreshItems();
            this.savePurchaseRecords();
            return Promise.resolve({ success: true, cost: refreshCost });
        }
        
        return Promise.resolve({ success: false });
    }
    
    // 私有辅助方法
    private isItemAvailable(itemId: string): boolean {
        const endTime = this._limitedOffers.get(itemId);
        if (endTime && Date.now() > endTime) {
            return false;
        }
        return true;
    }
    
    private recordPurchase(itemId: string): void {
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
    
    private resetDailyPurchasesIfNeeded(): void {
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
    
    private checkDailyRefresh(): void {
        const today = new Date().toDateString();
        if (this._lastRefreshDate !== today) {
            this.generateDailyRefreshItems();
            this._lastRefreshDate = today;
            this.savePurchaseRecords();
        }
    }
    
    private generateDailyRefreshItems(): void {
        this._dailyRefreshItems.clear();
        
        // 随机选择4个每日刷新物品
        const availableItems = Array.from(this._shopItems.keys()).filter(itemId => {
            const item = this._shopItems.get(itemId)!;
            return !item.oneTimePurchase && item.category !== ShopCategory.VIP;
        });
        
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const selectedItem = availableItems[randomIndex];
            this._dailyRefreshItems.add(selectedItem);
            availableItems.splice(randomIndex, 1);
        }
    }
    
    private grantItemRewards(item: ShopItem): void {
        // 通知外部系统发放奖励
        this.node.emit('item-purchased', {
            itemId: item.id,
            contents: item.contents
        });
        
        console.log(`Item purchased: ${item.name}`, item.contents);
    }
    
    private getPurchaseTypeForItem(itemId: string): PurchaseType | null {
        const purchaseTypeMap: { [key: string]: PurchaseType } = {
            'gems_small': PurchaseType.GEMS_SMALL,
            'gems_medium': PurchaseType.GEMS_MEDIUM,
            'gems_large': PurchaseType.GEMS_LARGE,
            'vip_monthly': PurchaseType.VIP_MONTHLY,
            'starter_pack': PurchaseType.STARTER_PACK,
            'legendary_paddle': PurchaseType.LEGENDARY_PADDLE,
            'legendary_ball': PurchaseType.LEGENDARY_BALL,
            'legendary_core': PurchaseType.LEGENDARY_CORE,
            'legendary_relic_box': PurchaseType.LEGENDARY_RELIC
        };
        
        return purchaseTypeMap[itemId] || null;
    }
    
    private getPlayerLevel(): number {
        // 获取玩家等级的逻辑，这里简化处理
        return 1;
    }
    
    // 数据持久化
    private savePurchaseRecords(): void {
        const data = {
            purchaseRecords: Array.from(this._purchaseRecords.entries()),
            dailyRefreshItems: Array.from(this._dailyRefreshItems),
            lastRefreshDate: this._lastRefreshDate,
            limitedOffers: Array.from(this._limitedOffers.entries())
        };
        
        sys.localStorage.setItem('shop_manager_data', JSON.stringify(data));
    }
    
    private loadPurchaseRecords(): void {
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
    }
    
    // 调试和管理方法
    public addSpecialOffer(itemId: string, discountPercent: number, durationHours: number): boolean {
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
    
    public getShopStatistics(): any {
        return {
            totalItems: this._shopItems.size,
            totalPurchases: Array.from(this._purchaseRecords.values())
                .reduce((sum, record) => sum + record.purchaseCount, 0),
            vipExclusiveItems: this._vipExclusiveItems.size,
            activeLimitedOffers: this._limitedOffers.size,
            dailyRefreshItems: this._dailyRefreshItems.size
        };
    }
}