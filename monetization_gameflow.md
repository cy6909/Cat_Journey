# Monetization System Workflow - Cat-Conquest Roguelike Breakout

## Overview
Complete workflow for implementing the monetization systems including payments, advertisements, and shop functionality using Cocos Creator 3.8.6 and WeChat Mini Game APIs.

## Prerequisites
- WeChat Mini Game developer account
- WeChat payment merchant account
- Ad placement approvals
- Basic understanding of WeChat APIs

## Phase 1: Payment System Implementation

### 1.1 WeChat Payment Setup

**Step 1: WeChat Developer Configuration**
1. Log into WeChat Mini Program console
2. Navigate to Development → Development Settings
3. Configure payment parameters:
```
Merchant ID: Your WeChat Pay merchant ID
API Key: Generated from WeChat Pay merchant console
App Secret: From Mini Program settings
```

**Step 2: Payment Certificate Setup**
1. Download payment certificates from WeChat Pay
2. Add certificates to project resources
3. Configure secure communication settings

**Step 3: MonetizationManager Integration**
1. Add MonetizationManager.ts to GameManager node
2. Configure currency settings in inspector:
```typescript
// Initial currency amounts
Coins: 100
Gems: 10  
Energy: 100
Experience: 0
```

### 1.2 Purchase Item Configuration

**Step 1: Product Setup in WeChat Console**
1. Create products in WeChat Mini Program console:
```
Product ID: gems_small
Product Name: 小宝石包
Price: 6.00 CNY
Description: 100宝石，新手推荐

Product ID: vip_monthly  
Product Name: 月度VIP
Price: 30.00 CNY
Description: 30天VIP特权
```

**Step 2: In-Game Shop Configuration**
1. Create ShopUI scene/prefab
2. Add ShopManager.ts to shop interface
3. Configure shop categories:
```
Currency Shop: Gem packs, coin bundles
Equipment Shop: Legendary items
VIP Shop: Subscription services
Special Offers: Limited time deals
```

### 1.3 Payment Flow Implementation

**Step 1: Purchase Button Setup**
```typescript
// In shop UI script
onPurchaseButtonClicked(itemId: string): void {
    const monetization = this.getComponent(MonetizationManager);
    
    // Show loading UI
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

**Step 2: Payment Validation**
1. Implement server-side validation (recommended)
2. Verify payment signatures
3. Handle payment callbacks

## Phase 2: Advertisement System

### 2.1 WeChat Ad Unit Configuration

**Step 1: Ad Unit Registration**
1. Apply for ad placement in WeChat console
2. Get approved ad unit IDs:
```
Rewarded Video: adunit-xxxxxxxxxxxxxxx
Interstitial: adunit-yyyyyyyyyyyyyyy  
Banner: adunit-zzzzzzzzzzzzzzz
```

**Step 2: AdManager Setup**
1. Add AdManager.ts to GameManager
2. Configure ad unit IDs in script:
```typescript
private _adUnitIds = {
    rewardVideo: 'your-reward-video-id',
    interstitial: 'your-interstitial-id',
    banner: 'your-banner-id'
};
```

### 2.2 Ad Placement Implementation

**Step 1: Level Failed Ad**
```typescript
// In level failure UI
onReviveButtonClicked(): void {
    const adManager = this.getComponent(AdManager);
    
    if (adManager.canShowAd(AdPlacement.LEVEL_FAILED)) {
        adManager.showRewardedAd(AdPlacement.LEVEL_FAILED).then(watched => {
            if (watched) {
                // Revive player
                this.revivePlayer();
                this.resumeGame();
            } else {
                // Show alternative options
                this.showRetryOptions();
            }
        });
    }
}
```

**Step 2: Reward Doubling Ad**
```typescript
// In level complete UI  
onDoubleRewardClicked(): void {
    const adManager = this.getComponent(AdManager);
    
    adManager.showRewardedAd(AdPlacement.LEVEL_COMPLETE).then(watched => {
        if (watched) {
            // Double the rewards
            const currentReward = this.getLevelReward();
            this.grantReward(currentReward * 2);
        }
    });
}
```

**Step 3: Energy Refill Ad**
```typescript
// In energy shortage popup
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

### 2.3 Ad Frequency Control

**Step 1: Cooldown Management**
```typescript
// Check if ad is available
public updateAdButtonStates(): void {
    const adManager = this.getComponent(AdManager);
    
    // Energy ad button
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

**Step 2: Daily Limit Tracking**
```typescript
// Update daily limits at midnight
protected onLoad(): void {
    this.schedule(this.checkDailyReset, 3600, Number.MAX_VALUE); // Check hourly
}

private checkDailyReset(): void {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        // Reset daily counters
        this.adManager.resetDailyStats();
    }
}
```

## Phase 3: VIP System Implementation

### 3.1 VIP Status Management

**Step 1: VIP Purchase Integration**
```typescript
// VIP purchase button
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

**Step 2: VIP Benefits Implementation**
```typescript
// Apply VIP bonuses
private applyVIPBonuses(): void {
    const monetization = this.getComponent(MonetizationManager);
    
    if (monetization.isVIP()) {
        // Double experience gain
        this.experienceMultiplier = 2.0;
        
        // Faster energy regeneration  
        this.energyRegenRate = 40; // Double rate
        
        // Show VIP UI elements
        this.vipIcon.active = true;
        this.vipBadge.active = true;
    }
}
```

**Step 3: VIP Expiration Handling**
```typescript
// Check VIP status regularly
protected update(): void {
    const monetization = this.getComponent(MonetizationManager);
    
    if (!monetization.isVIP() && this.wasVIP) {
        // VIP expired
        this.onVIPExpired();
        this.wasVIP = false;
    } else if (monetization.isVIP() && !this.wasVIP) {
        // VIP activated
        this.onVIPActivated();
        this.wasVIP = true;
    }
}
```

## Phase 4: Shop System Implementation

### 4.1 Shop UI Creation

**Step 1: Shop Scene Structure**
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
└── ShopManager (Script Node)
```

**Step 2: Item Display Implementation**
```typescript
// Create shop item UI
private createShopItemUI(item: ShopItem): Node {
    const itemNode = instantiate(this.shopItemPrefab);
    
    // Set item information
    itemNode.getChildByName('Icon').getComponent(Sprite).spriteFrame = this.getItemIcon(item.id);
    itemNode.getChildByName('Name').getComponent(Label).string = item.name;
    itemNode.getChildByName('Description').getComponent(Label).string = item.description;
    
    // Set price display
    const priceLabel = itemNode.getChildByName('Price').getComponent(Label);
    if (item.realPrice) {
        priceLabel.string = `¥${(item.realPrice / 100).toFixed(2)}`;
    } else {
        priceLabel.string = `${item.currencyAmount} ${item.currencyType}`;
    }
    
    // Set discount badge
    if (item.discountPercent) {
        const discountBadge = itemNode.getChildByName('DiscountBadge');
        discountBadge.active = true;
        discountBadge.getComponentInChildren(Label).string = `${item.discountPercent}% OFF`;
    }
    
    return itemNode;
}
```

### 4.2 Category Management

**Step 1: Tab System Implementation**
```typescript
// Category tab switching
onCategoryTabClicked(category: ShopCategory): void {
    // Update tab visual states
    this.updateTabStates(category);
    
    // Clear current items
    this.clearItemContainer();
    
    // Load category items
    const items = this.shopManager.getShopItems(category);
    items.forEach(item => {
        const itemUI = this.createShopItemUI(item);
        this.itemContainer.addChild(itemUI);
    });
}
```

**Step 2: VIP Exclusive Items**
```typescript
// Filter items based on VIP status
private updateItemVisibility(): void {
    const isVIP = this.monetizationManager.isVIP();
    
    this.itemContainer.children.forEach(itemNode => {
        const itemId = itemNode.name;
        const item = this.shopManager.getShopItem(itemId);
        
        if (item && item.vipOnly && !isVIP) {
            // Show locked state for non-VIP users
            this.showVIPLockOverlay(itemNode);
        }
    });
}
```

### 4.3 Daily Refresh System

**Step 1: Daily Items Generation**
```typescript
// Generate daily refresh items
private generateDailyItems(): void {
    const dailyContainer = this.node.getChildByName('DailyRefresh');
    dailyContainer.removeAllChildren();
    
    const dailyItems = this.shopManager.getDailyRefreshItems();
    dailyItems.forEach((item, index) => {
        const itemUI = this.createShopItemUI(item);
        itemUI.setPosition(index * 200, 0);
        dailyContainer.addChild(itemUI);
    });
    
    // Set refresh button state
    this.updateRefreshButtonState();
}
```

**Step 2: Manual Refresh Implementation**
```typescript
// Refresh daily items with gems
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

## Phase 5: Analytics and Optimization

### 5.1 Purchase Analytics

**Step 1: Event Tracking**
```typescript
// Track purchase events
private trackPurchaseEvent(itemId: string, success: boolean, amount: number): void {
    const eventData = {
        item_id: itemId,
        success: success,
        amount: amount,
        currency: success ? 'CNY' : 'none',
        timestamp: Date.now()
    };
    
    // Send to analytics service
    this.sendAnalyticsEvent('purchase_attempt', eventData);
}
```

**Step 2: Conversion Funnel Tracking**
```typescript
// Track user journey through monetization funnel
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

### 5.2 A/B Testing Framework

**Step 1: Price Testing**
```typescript
// A/B test different pricing strategies
private getItemPrice(itemId: string): number {
    const basePrice = this.shopManager.getShopItem(itemId).realPrice;
    const testGroup = this.getABTestGroup();
    
    switch (testGroup) {
        case 'A': return basePrice;
        case 'B': return basePrice * 0.8; // 20% discount
        case 'C': return basePrice * 1.2; // 20% premium
        default: return basePrice;
    }
}
```

## Phase 6: Error Handling and Edge Cases

### 6.1 Payment Error Handling

**Step 1: Network Error Recovery**
```typescript
// Handle payment network errors
private async retryPayment(itemId: string, maxRetries: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await this.monetizationManager.purchaseItem(itemId);
            if (result) return true;
        } catch (error) {
            console.warn(`Payment attempt ${attempt} failed:`, error);
            
            if (attempt === maxRetries) {
                this.showPaymentErrorDialog();
                return false;
            }
            
            // Wait before retry (exponential backoff)
            await this.delay(1000 * Math.pow(2, attempt - 1));
        }
    }
    return false;
}
```

### 6.2 Ad Loading Failures

**Step 1: Ad Fallback System**
```typescript
// Handle ad loading failures
private handleAdError(placement: AdPlacement, error: any): void {
    console.error(`Ad failed to load for ${placement}:`, error);
    
    // Show alternative options
    switch (placement) {
        case AdPlacement.LEVEL_FAILED:
            this.showReviveAlternatives(); // Show gem-based revive
            break;
        case AdPlacement.ENERGY_SHORTAGE:
            this.showEnergyPurchaseOptions(); // Direct gem purchase
            break;
        default:
            this.showGeneralError();
    }
}
```

## Phase 7: Testing and Validation

### 7.1 Payment Testing
1. Test in WeChat DevTools sandbox environment
2. Verify payment flows for all product types
3. Test payment cancellation and failure scenarios
4. Validate currency updates and inventory changes

### 7.2 Ad Testing
1. Test all ad placements in development
2. Verify ad frequency limits and cooldowns
3. Test ad reward delivery
4. Validate ad removal for paying users

### 7.3 User Experience Testing
1. Test monetization flow on different devices
2. Validate UI scaling and touch targets
3. Test offline/online state transitions
4. Verify data persistence across sessions

## Performance Considerations

### Memory Management
- Cache frequently accessed shop data
- Properly dispose of UI elements
- Limit concurrent ad instances

### Network Optimization
- Batch analytics events
- Implement request queuing
- Handle offline states gracefully

### User Experience
- Minimize loading times
- Provide clear feedback for all actions
- Implement proper error recovery

This monetization workflow ensures a complete implementation of payment systems, advertisement integration, and shop functionality optimized for WeChat Mini Game platform.