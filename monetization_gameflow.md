# 货币化系统工作流程 - Cat-Conquest Roguelike 弹球

## 概述
使用 Cocos Creator 3.8.6 和微信小游戏 API 实现货币化系统的完整工作流程，包括付费、广告和商店功能。

## 前置要求
- 微信小游戏开发者账户
- 微信支付商户账户
- 广告位审核通过
- 微信 API 基础了解

## 阶段 1：支付系统实现

### 1.1 微信支付设置

**步骤 1：微信开发者配置**
1. 登录微信小程序控制台
2. 导航到开发 → 开发设置
3. 配置支付参数：
```
商户ID：您的微信支付商户ID
API密钥：从微信支付商户控制台生成
应用密钥：来自小程序设置
```

**步骤 2：支付证书设置**
1. 从微信支付下载支付证书
2. 将证书添加到项目资源
3. 配置安全通信设置

**步骤 3：MonetizationManager 集成**
1. 将 MonetizationManager.ts 添加到 GameManager 节点
2. 在检查器中配置货币设置：
```typescript
// 初始货币数量
金币：100
宝石：10  
体力：100
经验：0
```

### 1.2 购买物品配置

**步骤 1：在微信控制台设置产品**
1. 在微信小程序控制台中创建产品：
```
产品ID：gems_small
产品名称：小宝石包
价格：6.00 CNY
描述：100宝石，新手推荐

产品ID：vip_monthly  
产品名称：月度VIP
价格：30.00 CNY
描述：30天VIP特权
```

**步骤 2：游戏内商店配置**
1. 创建 ShopUI 场景/预制体
2. 将 ShopManager.ts 添加到商店界面
3. 配置商店类别：
```
货币商店：宝石包、金币包
装备商店：传说物品
VIP商店：订阅服务
特别优惠：限时优惠
```

### 1.3 支付流程实现

**步骤 1：购买按钮设置**
```typescript
// 在商店UI脚本中
onPurchaseButtonClicked(itemId: string): void {
    const monetization = this.getComponent(MonetizationManager);
    
    // 显示加载UI
    this.showPurchaseLoading(true);
    
    monetization.purchaseItem(itemId as PurchaseType).then(success => {
        this.showPurchaseLoading(false);
        if (success) {
            this.showPurchaseSuccess();
            this.updateCurrencyDisplay();
        } else {
            this.showPurchaseError();
        }
    });
}
```

**步骤 2：支付验证**
1. 实现服务端验证（推荐）
2. 验证支付签名
3. 处理支付回调

## 阶段 2：广告系统

### 2.1 微信广告单元配置

**步骤 1：广告单元注册**
1. 在微信控制台申请广告位
2. 获得已审核的广告单元ID：
```
激励视频：adunit-xxxxxxxxxxxxxxx
插屏广告：adunit-yyyyyyyyyyyyyyy  
横幅广告：adunit-zzzzzzzzzzzzzzz
```

**步骤 2：AdManager 设置**
1. 将 AdManager.ts 添加到 GameManager
2. 在脚本中配置广告单元ID：
```typescript
private _adUnitIds = {
    rewardVideo: 'your-reward-video-id',
    interstitial: 'your-interstitial-id',
    banner: 'your-banner-id'
};
```

### 2.2 广告位实现

**步骤 1：关卡失败广告**
```typescript
// 在关卡失败UI中
onReviveButtonClicked(): void {
    const adManager = this.getComponent(AdManager);
    
    if (adManager.canShowAd(AdPlacement.LEVEL_FAILED)) {
        adManager.showRewardedAd(AdPlacement.LEVEL_FAILED).then(watched => {
            if (watched) {
                // 复活玩家
                this.revivePlayer();
                this.resumeGame();
            } else {
                // 显示替代选项
                this.showRetryOptions();
            }
        });
    }
}
```

**步骤 2：奖励翻倍广告**
```typescript
// 在关卡完成UI中  
onDoubleRewardClicked(): void {
    const adManager = this.getComponent(AdManager);
    
    adManager.showRewardedAd(AdPlacement.LEVEL_COMPLETE).then(watched => {
        if (watched) {
            // 奖励翻倍
            const currentReward = this.getLevelReward();
            this.grantReward(currentReward * 2);
        }
    });
}
```

**步骤 3：体力恢复广告**
```typescript
// 在体力不足弹窗中
onWatchAdForEnergy(): void {
    const adManager = this.getComponent(AdManager);
    const remainingAds = adManager.getRemainingDailyCount(AdPlacement.ENERGY_SHORTAGE);
    
    if (remainingAds > 0) {
        adManager.showRewardedAd(AdPlacement.ENERGY_SHORTAGE).then(watched => {
            if (watched) {
                this.addEnergy(30);
                this.updateEnergyDisplay();
            }
        });
    } else {
        this.showMessage('今日免费体力已用完');
    }
}
```

### 2.3 广告频率控制

**步骤 1：冷却时间管理**
```typescript
// 检查广告是否可用
public updateAdButtonStates(): void {
    const adManager = this.getComponent(AdManager);
    
    // 体力广告按钮
    const energyCooldown = adManager.getRemainingCooldown(AdPlacement.ENERGY_SHORTAGE);
    this.energyAdButton.interactable = (energyCooldown === 0);
    
    if (energyCooldown > 0) {
        this.energyAdLabel.string = `体力恢复(${energyCooldown}s)`;
    } else {
        const remaining = adManager.getRemainingDailyCount(AdPlacement.ENERGY_SHORTAGE);
        this.energyAdLabel.string = `体力恢复(${remaining}/6)`;
    }
}
```

**步骤 2：每日限制跟踪**
```typescript
// 在午夜更新每日限制
protected onLoad(): void {
    this.schedule(this.checkDailyReset, 3600, Number.MAX_VALUE); // 每小时检查
}

private checkDailyReset(): void {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        // 重置每日计数器
        this.adManager.resetDailyStats();
    }
}
```

## 阶段 3：VIP系统实现

### 3.1 VIP状态管理

**步骤 1：VIP购买集成**
```typescript
// VIP购买按钮
onPurchaseVIP(duration: number): void {
    const monetization = this.getComponent(MonetizationManager);
    const vipType = duration === 30 ? PurchaseType.VIP_MONTHLY : PurchaseType.VIP_SEASONAL;
    
    monetization.purchaseItem(vipType).then(success => {
        if (success) {
            this.updateVIPStatus();
            this.showVIPWelcome();
        }
    });
}
```

**步骤 2：VIP福利实现**
```typescript
// 应用VIP奖励
private applyVIPBonuses(): void {
    const monetization = this.getComponent(MonetizationManager);
    
    if (monetization.isVIP()) {
        // 双倍经验获得
        this.experienceMultiplier = 2.0;
        
        // 更快的体力恢复  
        this.energyRegenRate = 40; // 双倍速率
        
        // 显示VIP UI元素
        this.vipIcon.active = true;
        this.vipBadge.active = true;
    }
}
```

**步骤 3：VIP过期处理**
```typescript
// 定期检查VIP状态
protected update(): void {
    const monetization = this.getComponent(MonetizationManager);
    
    if (!monetization.isVIP() && this.wasVIP) {
        // VIP已过期
        this.onVIPExpired();
        this.wasVIP = false;
    } else if (monetization.isVIP() && !this.wasVIP) {
        // VIP已激活
        this.onVIPActivated();
        this.wasVIP = true;
    }
}
```

## 阶段 4：商店系统实现

### 4.1 商店UI创建

**步骤 1：商店场景结构**
```
ShopScene
├── Canvas
│   ├── Background
│   ├── TopBar
│   │   ├── CloseButton
│   │   └── CurrencyDisplay
│   ├── CategoryTabs
│   │   ├── CurrencyTab
│   │   ├── EquipmentTab
│   │   ├── VIPTab
│   │   └── SpecialTab
│   ├── ItemScrollView
│   │   └── ItemContainer
│   ├── PurchaseDialog
│   └── SuccessEffect
└── ShopManager（脚本节点）
```

**步骤 2：物品显示实现**
```typescript
// 创建商店物品UI
private createShopItemUI(item: ShopItem): Node {
    const itemNode = instantiate(this.shopItemPrefab);
    
    // 设置物品信息
    itemNode.getChildByName('Icon').getComponent(Sprite).spriteFrame = this.getItemIcon(item.id);
    itemNode.getChildByName('Name').getComponent(Label).string = item.name;
    itemNode.getChildByName('Description').getComponent(Label).string = item.description;
    
    // 设置价格显示
    const priceLabel = itemNode.getChildByName('Price').getComponent(Label);
    if (item.realPrice) {
        priceLabel.string = `¥${(item.realPrice / 100).toFixed(2)}`;
    } else {
        priceLabel.string = `${item.currencyAmount} ${item.currencyType}`;
    }
    
    // 设置折扣标签
    if (item.discountPercent) {
        const discountBadge = itemNode.getChildByName('DiscountBadge');
        discountBadge.active = true;
        discountBadge.getComponentInChildren(Label).string = `${item.discountPercent}% OFF`;
    }
    
    return itemNode;
}
```

### 4.2 类别管理

**步骤 1：标签系统实现**
```typescript
// 类别标签切换
onCategoryTabClicked(category: ShopCategory): void {
    // 更新标签视觉状态
    this.updateTabStates(category);
    
    // 清空当前物品
    this.clearItemContainer();
    
    // 加载类别物品
    const items = this.shopManager.getShopItems(category);
    items.forEach(item => {
        const itemUI = this.createShopItemUI(item);
        this.itemContainer.addChild(itemUI);
    });
}
```

**步骤 2：VIP专享物品**
```typescript
// 根据VIP状态过滤物品
private updateItemVisibility(): void {
    const isVIP = this.monetizationManager.isVIP();
    
    this.itemContainer.children.forEach(itemNode => {
        const itemId = itemNode.name;
        const item = this.shopManager.getShopItem(itemId);
        
        if (item && item.vipOnly && !isVIP) {
            // 为非VIP用户显示锁定状态
            this.showVIPLockOverlay(itemNode);
        }
    });
}
```

### 4.3 每日刷新系统

**步骤 1：每日物品生成**
```typescript
// 生成每日刷新物品
private generateDailyItems(): void {
    const dailyContainer = this.node.getChildByName('DailyRefresh');
    dailyContainer.removeAllChildren();
    
    const dailyItems = this.shopManager.getDailyRefreshItems();
    dailyItems.forEach((item, index) => {
        const itemUI = this.createShopItemUI(item);
        itemUI.setPosition(index * 200, 0);
        dailyContainer.addChild(itemUI);
    });
    
    // 设置刷新按钮状态
    this.updateRefreshButtonState();
}
```

**步骤 2：手动刷新实现**
```typescript
// 用宝石刷新每日物品
onRefreshButtonClicked(): void {
    const refreshCost = 50;
    const currentGems = this.monetizationManager.getCurrency(CurrencyType.GEMS);
    
    if (currentGems >= refreshCost) {
        this.showConfirmDialog(
            '刷新每日商品',
            `花费${refreshCost}宝石刷新商品？`,
            () => {
                this.shopManager.refreshDailyItems().then(result => {
                    if (result.success) {
                        this.generateDailyItems();
                        this.showMessage('商品已刷新！');
                    }
                });
            }
        );
    } else {
        this.showInsufficientGemsDialog();
    }
}
```

## 阶段 5：分析和优化

### 5.1 购买分析

**步骤 1：事件跟踪**
```typescript
// 跟踪购买事件
private trackPurchaseEvent(itemId: string, success: boolean, amount: number): void {
    const eventData = {
        item_id: itemId,
        success: success,
        amount: amount,
        currency: success ? 'CNY' : 'none',
        timestamp: Date.now()
    };
    
    // 发送到分析服务
    this.sendAnalyticsEvent('purchase_attempt', eventData);
}
```

**步骤 2：转化漏斗跟踪**
```typescript
// 跟踪用户在货币化漏斗中的路径
private trackConversionFunnel(step: string, additionalData?: any): void {
    const funnelData = {
        step: step,
        user_id: this.getUserId(),
        session_id: this.getSessionId(),
        timestamp: Date.now(),
        ...additionalData
    };
    
    this.sendAnalyticsEvent('conversion_funnel', funnelData);
}
```

### 5.2 A/B测试框架

**步骤 1：价格测试**
```typescript
// A/B测试不同的定价策略
private getItemPrice(itemId: string): number {
    const basePrice = this.shopManager.getShopItem(itemId).realPrice;
    const testGroup = this.getABTestGroup();
    
    switch (testGroup) {
        case 'A': return basePrice;
        case 'B': return basePrice * 0.8; // 20%折扣
        case 'C': return basePrice * 1.2; // 20%溢价
        default: return basePrice;
    }
}
```

## 阶段 6：错误处理和边界情况

### 6.1 支付错误处理

**步骤 1：网络错误恢复**
```typescript
// 处理支付网络错误
private async retryPayment(itemId: string, maxRetries: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await this.monetizationManager.purchaseItem(itemId);
            if (result) return true;
        } catch (error) {
            console.warn(`支付尝试 ${attempt} 失败:`, error);
            
            if (attempt === maxRetries) {
                this.showPaymentErrorDialog();
                return false;
            }
            
            // 重试前等待（指数退避）
            await this.delay(1000 * Math.pow(2, attempt - 1));
        }
    }
    return false;
}
```

### 6.2 广告加载失败

**步骤 1：广告回退系统**
```typescript
// 处理广告加载失败
private handleAdError(placement: AdPlacement, error: any): void {
    console.error(`${placement}广告加载失败:`, error);
    
    // 显示替代选项
    switch (placement) {
        case AdPlacement.LEVEL_FAILED:
            this.showReviveAlternatives(); // 显示基于宝石的复活
            break;
        case AdPlacement.ENERGY_SHORTAGE:
            this.showEnergyPurchaseOptions(); // 直接宝石购买
            break;
        default:
            this.showGeneralError();
    }
}
```

## 阶段 7：测试和验证

### 7.1 支付测试
1. 在微信开发者工具沙箱环境中测试
2. 验证所有产品类型的支付流程
3. 测试支付取消和失败场景
4. 验证货币更新和库存变更

### 7.2 广告测试
1. 在开发环境测试所有广告位
2. 验证广告频率限制和冷却时间
3. 测试广告奖励发放
4. 验证付费用户的广告移除

### 7.3 用户体验测试
1. 在不同设备上测试货币化流程
2. 验证UI缩放和触摸目标
3. 测试离线/在线状态转换
4. 验证跨会话数据持久化

## 性能考虑

### 内存管理
- 缓存经常访问的商店数据
- 正确处理UI元素
- 限制并发广告实例

### 网络优化
- 批量分析事件
- 实现请求排队
- 优雅处理离线状态

### 用户体验
- 最小化加载时间
- 为所有操作提供清晰反馈
- 实现正确的错误恢复

本货币化工作流程确保了为微信小游戏平台优化的支付系统、广告集成和商店功能的完整实现。