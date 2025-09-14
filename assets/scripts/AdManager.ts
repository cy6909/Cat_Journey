import { _decorator, Component, Node, sys } from 'cc';

// WeChat Mini Game API types
declare const wx: WechatMinigame.Wx;

const { ccclass, property } = _decorator;

export enum AdRewardType {
    DOUBLE_COINS = 'double_coins',           // 双倍金币
    EXTRA_LIFE = 'extra_life',              // 额外生命
    DAMAGE_BOOST = 'damage_boost',          // 攻击力提升
    SPEED_BOOST = 'speed_boost',            // 速度提升
    ENERGY_REFILL = 'energy_refill',        // 体力恢复
    RARE_RELIC = 'rare_relic',              // 稀有遗物
    CONTINUE_GAME = 'continue_game',         // 复活继续
    UPGRADE_DISCOUNT = 'upgrade_discount',   // 升级折扣
    MYSTERY_BOX = 'mystery_box',            // 神秘宝箱
    FREE_GEMS = 'free_gems'                 // 免费宝石
}

export enum AdPlacement {
    LEVEL_FAILED = 'level_failed',          // 关卡失败时
    LEVEL_COMPLETE = 'level_complete',      // 关卡完成时
    SHOP_BOOST = 'shop_boost',              // 商店增益
    MAIN_MENU = 'main_menu',                // 主菜单
    PAUSE_MENU = 'pause_menu',              // 暂停菜单
    DAILY_REWARD = 'daily_reward',          // 每日奖励
    ENERGY_SHORTAGE = 'energy_shortage',    // 体力不足时
    UPGRADE_STATION = 'upgrade_station',    // 升级站
    TREASURE_DOUBLE = 'treasure_double',    // 宝箱奖励翻倍
    BOSS_PREPARATION = 'boss_preparation'   // Boss战准备
}

interface AdConfig {
    placement: AdPlacement;
    rewardType: AdRewardType;
    title: string;
    description: string;
    rewardAmount: number;
    cooldownSeconds: number;
    maxPerDay: number;
}

interface AdStats {
    totalShown: number;
    totalWatched: number;
    totalSkipped: number;
    lastShownTime: number;
    dailyCount: number;
    lastResetDate: string;
}

@ccclass('AdManager')
export class AdManager extends Component {
    
    // 广告配置
    private _adConfigs: Map<AdPlacement, AdConfig> = new Map();
    
    // 广告统计
    private _adStats: Map<AdPlacement, AdStats> = new Map();
    
    // 广告单元ID (微信小游戏)
    private _adUnitIds = {
        rewardVideo: 'adunit-xxxxxxxxxxxxxxx',  // 激励视频广告
        interstitial: 'adunit-yyyyyyyyyyyyyyy', // 插屏广告
        banner: 'adunit-zzzzzzzzzzzzzzz'        // 横幅广告
    };
    
    // 广告实例缓存
    private _rewardedVideoAd: any = null;
    private _interstitialAd: any = null;
    private _bannerAd: any = null;
    
    // 是否已移除广告
    private _adsRemoved: boolean = false;
    
    protected onLoad(): void {
        this.initializeAdConfigs();
        this.loadAdStats();
        this.initializeWeChatAds();
    }
    
    private initializeAdConfigs(): void {
        // 关卡失败 - 复活机会
        this._adConfigs.set(AdPlacement.LEVEL_FAILED, {
            placement: AdPlacement.LEVEL_FAILED,
            rewardType: AdRewardType.CONTINUE_GAME,
            title: "观看广告复活",
            description: "观看广告获得一次复活机会，保留当前进度继续游戏",
            rewardAmount: 1,
            cooldownSeconds: 0,
            maxPerDay: 5
        });
        
        // 关卡完成 - 双倍奖励
        this._adConfigs.set(AdPlacement.LEVEL_COMPLETE, {
            placement: AdPlacement.LEVEL_COMPLETE,
            rewardType: AdRewardType.DOUBLE_COINS,
            title: "双倍金币奖励",
            description: "观看广告获得双倍金币奖励",
            rewardAmount: 2,
            cooldownSeconds: 0,
            maxPerDay: 10
        });
        
        // 商店增益
        this._adConfigs.set(AdPlacement.SHOP_BOOST, {
            placement: AdPlacement.SHOP_BOOST,
            rewardType: AdRewardType.DAMAGE_BOOST,
            title: "临时攻击力提升",
            description: "观看广告获得10分钟50%攻击力加成",
            rewardAmount: 50,
            cooldownSeconds: 600, // 10分钟冷却
            maxPerDay: 8
        });
        
        // 体力不足
        this._adConfigs.set(AdPlacement.ENERGY_SHORTAGE, {
            placement: AdPlacement.ENERGY_SHORTAGE,
            rewardType: AdRewardType.ENERGY_REFILL,
            title: "免费体力恢复",
            description: "观看广告立即恢复30点体力",
            rewardAmount: 30,
            cooldownSeconds: 1800, // 30分钟冷却
            maxPerDay: 6
        });
        
        // 每日奖励
        this._adConfigs.set(AdPlacement.DAILY_REWARD, {
            placement: AdPlacement.DAILY_REWARD,
            rewardType: AdRewardType.FREE_GEMS,
            title: "每日免费宝石",
            description: "观看广告获得10个免费宝石",
            rewardAmount: 10,
            cooldownSeconds: 86400, // 24小时冷却
            maxPerDay: 1
        });
        
        // 升级站折扣
        this._adConfigs.set(AdPlacement.UPGRADE_STATION, {
            placement: AdPlacement.UPGRADE_STATION,
            rewardType: AdRewardType.UPGRADE_DISCOUNT,
            title: "升级费用减半",
            description: "观看广告获得下次升级50%折扣",
            rewardAmount: 50,
            cooldownSeconds: 3600, // 1小时冷却
            maxPerDay: 4
        });
        
        // 宝箱奖励翻倍
        this._adConfigs.set(AdPlacement.TREASURE_DOUBLE, {
            placement: AdPlacement.TREASURE_DOUBLE,
            rewardType: AdRewardType.MYSTERY_BOX,
            title: "宝箱奖励翻倍",
            description: "观看广告将宝箱奖励翻倍",
            rewardAmount: 2,
            cooldownSeconds: 0,
            maxPerDay: 8
        });
        
        // Boss战准备
        this._adConfigs.set(AdPlacement.BOSS_PREPARATION, {
            placement: AdPlacement.BOSS_PREPARATION,
            rewardType: AdRewardType.EXTRA_LIFE,
            title: "额外生命值",
            description: "观看广告为Boss战获得额外生命值",
            rewardAmount: 1,
            cooldownSeconds: 0,
            maxPerDay: 3
        });
        
        // 主菜单稀有遗物
        this._adConfigs.set(AdPlacement.MAIN_MENU, {
            placement: AdPlacement.MAIN_MENU,
            rewardType: AdRewardType.RARE_RELIC,
            title: "免费稀有遗物",
            description: "观看广告获得一个稀有品质遗物",
            rewardAmount: 1,
            cooldownSeconds: 7200, // 2小时冷却
            maxPerDay: 3
        });
        
        // 暂停菜单速度提升
        this._adConfigs.set(AdPlacement.PAUSE_MENU, {
            placement: AdPlacement.PAUSE_MENU,
            rewardType: AdRewardType.SPEED_BOOST,
            title: "速度提升",
            description: "观看广告获得5分钟30%速度加成",
            rewardAmount: 30,
            cooldownSeconds: 300, // 5分钟冷却
            maxPerDay: 6
        });
    }
    
    private initializeWeChatAds(): void {
        if (sys.platform !== sys.Platform.WECHAT_GAME) {
            console.log('Not in WeChat environment, using mock ads');
            return;
        }
        
        try {
            // 激励视频广告
            this._rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: this._adUnitIds.rewardVideo
            });
            
            this._rewardedVideoAd.onLoad(() => {
                console.log('Rewarded video ad loaded');
            });
            
            this._rewardedVideoAd.onError((err: any) => {
                console.error('Rewarded video ad error:', err);
            });
            
            this._rewardedVideoAd.onClose((res: any) => {
                if (res && res.isEnded) {
                    console.log('Rewarded video ad watched completely');
                } else {
                    console.log('Rewarded video ad closed early');
                }
            });
            
            // 插屏广告
            this._interstitialAd = wx.createInterstitialAd({
                adUnitId: this._adUnitIds.interstitial
            });
            
            this._interstitialAd.onLoad(() => {
                console.log('Interstitial ad loaded');
            });
            
            this._interstitialAd.onError((err: any) => {
                console.error('Interstitial ad error:', err);
            });
            
            // 横幅广告
            this._bannerAd = wx.createBannerAd({
                adUnitId: this._adUnitIds.banner,
                style: {
                    left: 0,
                    top: 0,
                    width: 320
                }
            });
            
        } catch (error) {
            console.error('Failed to initialize WeChat ads:', error);
        }
    }
    
    // 显示激励视频广告
    public showRewardedAd(placement: AdPlacement): Promise<boolean> {
        return new Promise((resolve) => {
            if (this._adsRemoved) {
                // 如果已移除广告，直接给予奖励
                this.grantAdReward(placement);
                resolve(true);
                return;
            }
            
            const config = this._adConfigs.get(placement);
            if (!config) {
                console.error(`Ad config not found for placement: ${placement}`);
                resolve(false);
                return;
            }
            
            // 检查冷却时间和每日限制
            if (!this.canShowAd(placement)) {
                resolve(false);
                return;
            }
            
            // 记录广告展示
            this.recordAdShown(placement);
            
            if (sys.platform === sys.Platform.WECHAT_GAME && this._rewardedVideoAd) {
                // 微信环境显示真实广告
                this._rewardedVideoAd.show().then(() => {
                    // 等待广告完成回调
                    const onAdClose = (res: any) => {
                        this._rewardedVideoAd.offClose(onAdClose);
                        
                        if (res && res.isEnded) {
                            this.recordAdWatched(placement);
                            this.grantAdReward(placement);
                            resolve(true);
                        } else {
                            this.recordAdSkipped(placement);
                            resolve(false);
                        }
                    };
                    
                    this._rewardedVideoAd.onClose(onAdClose);
                }).catch((err: any) => {
                    console.error('Failed to show rewarded video:', err);
                    resolve(false);
                });
            } else {
                // 开发环境或其他平台模拟观看
                console.log(`Mock ad watched: ${placement}`);
                setTimeout(() => {
                    this.recordAdWatched(placement);
                    this.grantAdReward(placement);
                    resolve(true);
                }, 1000); // 模拟1秒广告时间
            }
        });
    }
    
    // 显示插屏广告
    public showInterstitialAd(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this._adsRemoved) {
                resolve(true);
                return;
            }
            
            if (sys.platform === sys.Platform.WECHAT_GAME && this._interstitialAd) {
                this._interstitialAd.show().then(() => {
                    console.log('Interstitial ad shown');
                    resolve(true);
                }).catch((err: any) => {
                    console.error('Failed to show interstitial:', err);
                    resolve(false);
                });
            } else {
                console.log('Mock interstitial ad shown');
                resolve(true);
            }
        });
    }
    
    // 显示横幅广告
    public showBannerAd(): void {
        if (this._adsRemoved || sys.platform !== sys.Platform.WECHAT_GAME) {
            return;
        }
        
        if (this._bannerAd) {
            this._bannerAd.show().catch((err: any) => {
                console.error('Failed to show banner ad:', err);
            });
        }
    }
    
    // 隐藏横幅广告
    public hideBannerAd(): void {
        if (this._bannerAd) {
            this._bannerAd.hide();
        }
    }
    
    // 检查是否可以显示广告
    public canShowAd(placement: AdPlacement): boolean {
        const config = this._adConfigs.get(placement);
        const stats = this._adStats.get(placement);
        
        if (!config || !stats) return false;
        
        // 检查每日限制
        this.resetDailyCountIfNeeded(placement);
        if (stats.dailyCount >= config.maxPerDay) {
            return false;
        }
        
        // 检查冷却时间
        const now = Date.now();
        const cooldownMs = config.cooldownSeconds * 1000;
        if (now - stats.lastShownTime < cooldownMs) {
            return false;
        }
        
        return true;
    }
    
    // 获取广告配置
    public getAdConfig(placement: AdPlacement): AdConfig | undefined {
        return this._adConfigs.get(placement);
    }
    
    // 获取剩余冷却时间
    public getRemainingCooldown(placement: AdPlacement): number {
        const config = this._adConfigs.get(placement);
        const stats = this._adStats.get(placement);
        
        if (!config || !stats) return 0;
        
        const now = Date.now();
        const cooldownMs = config.cooldownSeconds * 1000;
        const elapsed = now - stats.lastShownTime;
        
        return Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
    }
    
    // 获取今日剩余次数
    public getRemainingDailyCount(placement: AdPlacement): number {
        const config = this._adConfigs.get(placement);
        const stats = this._adStats.get(placement);
        
        if (!config || !stats) return 0;
        
        this.resetDailyCountIfNeeded(placement);
        return Math.max(0, config.maxPerDay - stats.dailyCount);
    }
    
    // 设置广告移除状态
    public setAdsRemoved(removed: boolean): void {
        this._adsRemoved = removed;
        this.saveAdStats();
        
        if (removed) {
            this.hideBannerAd();
        }
    }
    
    public isAdsRemoved(): boolean {
        return this._adsRemoved;
    }
    
    // 私有方法
    private grantAdReward(placement: AdPlacement): void {
        const config = this._adConfigs.get(placement);
        if (!config) return;
        
        // 通知外部系统发放奖励
        this.node.emit('ad-reward-granted', {
            placement: placement,
            rewardType: config.rewardType,
            amount: config.rewardAmount
        });
        
        console.log(`Ad reward granted: ${config.rewardType}, amount: ${config.rewardAmount}`);
    }
    
    private recordAdShown(placement: AdPlacement): void {
        let stats = this._adStats.get(placement);
        if (!stats) {
            stats = {
                totalShown: 0,
                totalWatched: 0,
                totalSkipped: 0,
                lastShownTime: 0,
                dailyCount: 0,
                lastResetDate: new Date().toDateString()
            };
            this._adStats.set(placement, stats);
        }
        
        stats.totalShown++;
        stats.lastShownTime = Date.now();
        stats.dailyCount++;
        
        this.saveAdStats();
    }
    
    private recordAdWatched(placement: AdPlacement): void {
        const stats = this._adStats.get(placement);
        if (stats) {
            stats.totalWatched++;
            this.saveAdStats();
        }
    }
    
    private recordAdSkipped(placement: AdPlacement): void {
        const stats = this._adStats.get(placement);
        if (stats) {
            stats.totalSkipped++;
            stats.dailyCount--; // 跳过的广告不计入每日限制
            this.saveAdStats();
        }
    }
    
    private resetDailyCountIfNeeded(placement: AdPlacement): void {
        const stats = this._adStats.get(placement);
        if (!stats) return;
        
        const today = new Date().toDateString();
        if (stats.lastResetDate !== today) {
            stats.dailyCount = 0;
            stats.lastResetDate = today;
        }
    }
    
    private saveAdStats(): void {
        const data = {
            stats: Array.from(this._adStats.entries()),
            adsRemoved: this._adsRemoved
        };
        
        sys.localStorage.setItem('ad_manager_data', JSON.stringify(data));
    }
    
    private loadAdStats(): void {
        const data = sys.localStorage.getItem('ad_manager_data');
        if (data) {
            const parsed = JSON.parse(data);
            
            if (parsed.stats) {
                this._adStats = new Map(parsed.stats);
            }
            
            this._adsRemoved = parsed.adsRemoved || false;
        }
        
        // 初始化所有placement的统计数据
        for (const placement of this._adConfigs.keys()) {
            if (!this._adStats.has(placement)) {
                this._adStats.set(placement, {
                    totalShown: 0,
                    totalWatched: 0,
                    totalSkipped: 0,
                    lastShownTime: 0,
                    dailyCount: 0,
                    lastResetDate: new Date().toDateString()
                });
            }
        }
    }
    
    // 获取广告统计数据
    public getAdStats(placement?: AdPlacement): any {
        if (placement) {
            return this._adStats.get(placement);
        }
        
        // 返回所有统计数据
        const allStats: any = {};
        for (const [place, stats] of this._adStats.entries()) {
            allStats[place] = {
                ...stats,
                watchRate: stats.totalShown > 0 ? (stats.totalWatched / stats.totalShown * 100).toFixed(1) + '%' : '0%'
            };
        }
        
        return allStats;
    }
    
    // 重置统计数据(调试用)
    public resetStats(placement?: AdPlacement): void {
        if (placement) {
            this._adStats.delete(placement);
        } else {
            this._adStats.clear();
        }
        
        this.loadAdStats(); // 重新初始化
    }
}