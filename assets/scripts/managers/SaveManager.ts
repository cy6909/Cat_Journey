import { _decorator, Component, sys } from 'cc';
import { MapManager, MapNodeType } from '../managers/MapManager';
import { RelicManager, RelicType } from '../managers/RelicManager';
import { MonetizationManager } from '../managers/MonetizationManager';

const { ccclass, property } = _decorator;

export interface PlayerProgress {
    // 基本进度
    currentChapter: number;
    currentFloor: number;
    currentRun: number;
    
    // 解锁内容
    unlockedChapters: number[];
    unlockedRelics: RelicType[];
    unlockedPaddleTypes: string[];
    unlockedBallTypes: string[];
    unlockedCoreTypes: string[];
    
    // 统计数据
    totalPlayTime: number;
    totalScore: number;
    highestScore: number;
    totalBricksDestroyed: number;
    totalLevelsCompleted: number;
    totalDeaths: number;
    
    // Boss击败记录
    defeatedBosses: string[];
    defeatedHiddenBosses: string[];
    
    // 成就进度
    achievements: { [key: string]: boolean };
    achievementProgress: { [key: string]: number };
    
    // 货币和购买
    currency: {
        coins: number;
        gems: number;
        energy: number;
        experience: number;
    };
    
    purchaseHistory: string[];
    vipStatus: {
        isVip: boolean;
        vipLevel: number;
        vipExpireTime: number;
    };
    
    // 设置
    settings: {
        soundVolume: number;
        musicVolume: number;
        enableNotifications: boolean;
        language: string;
        qualityLevel: number;
    };
    
    // 时间戳
    lastSaveTime: number;
    lastLoginTime: number;
    createTime: number;
}

export interface RunProgress {
    // 当前跑局信息
    runId: string;
    startTime: number;
    currentScore: number;
    currentLives: number;
    
    // 地图进度
    currentChapter: number;
    currentFloor: number;
    currentNodeIndex: number;
    completedNodes: number[];
    mapPath: number[];
    
    // 装备状态
    activeRelics: RelicType[];
    relicStacks: { [key in RelicType]?: number };
    
    // 挡板状态
    paddleLevel: number;
    paddleExperience: number;
    paddleHealth: number;
    paddleMaxHealth: number;
    
    // 核心状态
    coreLevel: number;
    coreExperience: number;
    coreHealth: number;
    coreMaxHealth: number;
    
    // 弹球状态
    ballTypes: string[];
    ballEffects: string[];
    ballCount: number;
    
    // 临时状态
    temporaryBuffs: {
        buffType: string;
        duration: number;
        stackCount: number;
    }[];
    
    // 关卡特殊状态
    levelModifiers: string[];
    bossPhase: number;
    isInCombat: boolean;
}

@ccclass('SaveManager')
export class SaveManager extends Component {
    
    @property
    public autoSaveInterval: number = 30; // 自动保存间隔(秒)
    
    @property
    public maxSaveSlots: number = 3; // 最大存档槽位数
    
    @property
    public enableCloudSync: boolean = true; // 云同步功能

    private static _instance: SaveManager | null = null;
    private _playerProgress: PlayerProgress | null = null;
    private _currentRunProgress: RunProgress | null = null;
    private _autoSaveTimer: number = 0;
    private _hasUnsavedChanges: boolean = false;

    public static getInstance(): SaveManager | null {
        return SaveManager._instance;
    }

    protected onLoad(): void {
        if (SaveManager._instance === null) {
            SaveManager._instance = this;
        }
    }

    protected onDestroy(): void {
        if (SaveManager._instance === this) {
            SaveManager._instance = null;
        }
    }

    protected start(): void {
        this.loadPlayerProgress();
        this.scheduleAutoSave();
    }

    protected update(deltaTime: number): void {
        this._autoSaveTimer += deltaTime;
        
        if (this._autoSaveTimer >= this.autoSaveInterval && this._hasUnsavedChanges) {
            this.autoSave();
            this._autoSaveTimer = 0;
        }
    }

    /**
     * 初始化新的玩家进度
     */
    public initializeNewProgress(): PlayerProgress {
        const now = Date.now();
        
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
    public startNewRun(chapterNumber: number = 1): RunProgress {
        const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
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
    public savePlayerProgress(): boolean {
        try {
            if (!this._playerProgress) {
                console.warn('No player progress to save');
                return false;
            }
            
            this._playerProgress.lastSaveTime = Date.now();
            const saveData = JSON.stringify(this._playerProgress);
            
            // 保存到本地存储
            sys.localStorage.setItem('cat_conquest_progress', saveData);
            
            // 如果启用云同步，保存到云端
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
    public saveRunProgress(): boolean {
        try {
            if (!this._currentRunProgress) {
                console.warn('No run progress to save');
                return false;
            }
            
            const saveData = JSON.stringify(this._currentRunProgress);
            
            // 保存到本地存储
            sys.localStorage.setItem('cat_conquest_current_run', saveData);
            
            // 如果启用云同步，保存到云端
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
    public loadPlayerProgress(): boolean {
        try {
            // 尝试从云端加载
            if (this.enableCloudSync) {
                const cloudData = this.loadFromCloud('progress');
                if (cloudData) {
                    this._playerProgress = JSON.parse(cloudData);
                    console.log('Player progress loaded from cloud');
                    return true;
                }
            }
            
            // 从本地存储加载
            const localData = sys.localStorage.getItem('cat_conquest_progress');
            if (localData) {
                this._playerProgress = JSON.parse(localData);
                console.log('Player progress loaded from local storage');
                return true;
            }
            
            // 没有存档，创建新的进度
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
    public loadRunProgress(): boolean {
        try {
            // 尝试从云端加载
            if (this.enableCloudSync) {
                const cloudData = this.loadFromCloud('current_run');
                if (cloudData) {
                    this._currentRunProgress = JSON.parse(cloudData);
                    console.log('Run progress loaded from cloud');
                    return true;
                }
            }
            
            // 从本地存储加载
            const localData = sys.localStorage.getItem('cat_conquest_current_run');
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
    private autoSave(): void {
        console.log('Auto-saving progress...');
        this.savePlayerProgress();
        
        if (this._currentRunProgress) {
            this.saveRunProgress();
        }
    }

    /**
     * 手动保存
     */
    public manualSave(): boolean {
        console.log('Manual save triggered');
        const progressSaved = this.savePlayerProgress();
        const runSaved = this._currentRunProgress ? this.saveRunProgress() : true;
        
        return progressSaved && runSaved;
    }

    /**
     * 云同步相关方法
     */
    private saveToCloud(key: string, data: string): void {
        try {
            // 使用微信云存储或其他云服务
            if (typeof wx !== 'undefined' && wx.cloud) {
                wx.cloud.database().collection('cat_conquest_saves').doc(key).set({
                    data: {
                        saveData: data,
                        timestamp: Date.now()
                    }
                }).then(() => {
                    console.log(`Data saved to cloud: ${key}`);
                }).catch((error: any) => {
                    console.error(`Failed to save to cloud: ${key}`, error);
                });
            }
        } catch (error) {
            console.error('Cloud save error:', error);
        }
    }

    private loadFromCloud(key: string): string | null {
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
    public updateScore(score: number): void {
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

    public updateCurrency(type: 'coins' | 'gems' | 'energy' | 'experience', amount: number): void {
        if (this._playerProgress) {
            this._playerProgress.currency[type] = Math.max(0, this._playerProgress.currency[type] + amount);
            this.markDirty();
        }
    }

    public unlockRelic(relicType: RelicType): void {
        if (this._playerProgress && !this._playerProgress.unlockedRelics.includes(relicType)) {
            this._playerProgress.unlockedRelics.push(relicType);
            this.markDirty();
        }
    }

    public completeLevel(): void {
        if (this._playerProgress) {
            this._playerProgress.totalLevelsCompleted++;
            this.markDirty();
        }
    }

    public recordDeath(): void {
        if (this._playerProgress) {
            this._playerProgress.totalDeaths++;
            this.markDirty();
        }
    }

    public defeatBoss(bossId: string, isHidden: boolean = false): void {
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
    public saveToSlot(slotIndex: number): boolean {
        if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
            console.error(`Invalid save slot: ${slotIndex}`);
            return false;
        }
        
        try {
            const saveData = {
                playerProgress: this._playerProgress,
                runProgress: this._currentRunProgress,
                timestamp: Date.now()
            };
            
            const key = `cat_conquest_slot_${slotIndex}`;
            sys.localStorage.setItem(key, JSON.stringify(saveData));
            
            console.log(`Game saved to slot ${slotIndex}`);
            return true;
            
        } catch (error) {
            console.error(`Failed to save to slot ${slotIndex}:`, error);
            return false;
        }
    }

    public loadFromSlot(slotIndex: number): boolean {
        if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
            console.error(`Invalid save slot: ${slotIndex}`);
            return false;
        }
        
        try {
            const key = `cat_conquest_slot_${slotIndex}`;
            const saveData = sys.localStorage.getItem(key);
            
            if (!saveData) {
                console.log(`No save data in slot ${slotIndex}`);
                return false;
            }
            
            const parsed = JSON.parse(saveData);
            this._playerProgress = parsed.playerProgress;
            this._currentRunProgress = parsed.runProgress;
            
            console.log(`Game loaded from slot ${slotIndex}`);
            return true;
            
        } catch (error) {
            console.error(`Failed to load from slot ${slotIndex}:`, error);
            return false;
        }
    }

    public getSaveSlotInfo(slotIndex: number): { exists: boolean; timestamp?: number; chapter?: number; score?: number } {
        try {
            const key = `cat_conquest_slot_${slotIndex}`;
            const saveData = sys.localStorage.getItem(key);
            
            if (!saveData) {
                return { exists: false };
            }
            
            const parsed = JSON.parse(saveData);
            return {
                exists: true,
                timestamp: parsed.timestamp,
                chapter: parsed.playerProgress?.currentChapter,
                score: parsed.playerProgress?.totalScore
            };
            
        } catch (error) {
            console.error(`Failed to get slot info ${slotIndex}:`, error);
            return { exists: false };
        }
    }

    /**
     * 工具方法
     */
    private markDirty(): void {
        this._hasUnsavedChanges = true;
    }

    private scheduleAutoSave(): void {
        // 自动保存在update中处理
        console.log(`Auto-save scheduled every ${this.autoSaveInterval} seconds`);
    }

    public getPlayerProgress(): PlayerProgress | null {
        return this._playerProgress;
    }

    public getCurrentRunProgress(): RunProgress | null {
        return this._currentRunProgress;
    }

    public hasUnsavedChanges(): boolean {
        return this._hasUnsavedChanges;
    }

    /**
     * 数据验证和修复
     */
    public validateAndRepairProgress(): boolean {
        if (!this._playerProgress) return false;
        
        try {
            // 验证基本数据
            this._playerProgress.currentChapter = Math.max(1, Math.min(3, this._playerProgress.currentChapter));
            this._playerProgress.currentFloor = Math.max(1, Math.min(45, this._playerProgress.currentFloor));
            
            // 验证货币
            Object.keys(this._playerProgress.currency).forEach(key => {
                this._playerProgress!.currency[key as keyof typeof this._playerProgress.currency] = 
                    Math.max(0, this._playerProgress!.currency[key as keyof typeof this._playerProgress.currency]);
            });
            
            // 验证设置
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
    public clearAllSaves(): void {
        try {
            // 清除主要进度
            sys.localStorage.removeItem('cat_conquest_progress');
            sys.localStorage.removeItem('cat_conquest_current_run');
            
            // 清除存档槽位
            for (let i = 0; i < this.maxSaveSlots; i++) {
                sys.localStorage.removeItem(`cat_conquest_slot_${i}`);
            }
            
            // 重置内存数据
            this._playerProgress = this.initializeNewProgress();
            this._currentRunProgress = null;
            this._hasUnsavedChanges = false;
            
            console.log('All saves cleared');
            
        } catch (error) {
            console.error('Failed to clear saves:', error);
        }
    }

    private saveToLocalStorage(key: string, data: string): boolean {
        try {
            if (!key || !data) {
                console.warn('Invalid localStorage save parameters');
                return false;
            }
            
            // Check localStorage availability
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

    private loadFromLocalStorage(key: string): string | null {
        try {
            if (!key) {
                console.warn('Invalid localStorage load key');
                return null;
            }
            
            // Check localStorage availability
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

    // 添加测试期望的方法
    public saveToSlot(slotIndex: number, data: any): boolean {
        try {
            if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
                console.warn('Invalid save slot index');
                return false;
            }
            
            const saveKey = `cat_conquest_slot_${slotIndex}`;
            const saveData = JSON.stringify(data);
            return this.saveToLocalStorage(saveKey, saveData);
            
        } catch (error) {
            console.error('Failed to save to slot:', error);
            return false;
        }
    }

    public loadFromSlot(slotIndex: number): any {
        try {
            if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
                console.warn('Invalid save slot index');
                return null;
            }
            
            const saveKey = `cat_conquest_slot_${slotIndex}`;
            const saveData = this.loadFromLocalStorage(saveKey);
            
            if (saveData) {
                return JSON.parse(saveData);
            }
            
            return null;
            
        } catch (error) {
            console.error('Failed to load from slot:', error);
            return null;
        }
    }

    public getSaveSlotInfo(slotIndex: number): { exists: boolean, data?: any } {
        try {
            if (slotIndex < 0 || slotIndex >= this.maxSaveSlots) {
                return { exists: false };
            }
            
            const data = this.loadFromSlot(slotIndex);
            return {
                exists: data !== null,
                data: data
            };
            
        } catch (error) {
            console.error('Failed to get save slot info:', error);
            return { exists: false };
        }
    }

    public validateAndRepairProgress(progress?: PlayerProgress): boolean {
        try {
            const targetProgress = progress || this._playerProgress;
            if (!targetProgress) {
                console.warn('No progress to validate');
                return false;
            }
            
            // 基本验证和修复
            if (!targetProgress.currency) {
                targetProgress.currency = {
                    coins: 100,
                    gems: 0,
                    energy: 100,
                    experience: 0
                };
            }
            
            if (!Array.isArray(targetProgress.unlockedChapters)) {
                targetProgress.unlockedChapters = [1];
            }
            
            if (!Array.isArray(targetProgress.unlockedRelics)) {
                targetProgress.unlockedRelics = [];
            }
            
            // 确保基本数值不为负
            targetProgress.totalScore = Math.max(0, targetProgress.totalScore || 0);
            targetProgress.highestScore = Math.max(0, targetProgress.highestScore || 0);
            targetProgress.totalPlayTime = Math.max(0, targetProgress.totalPlayTime || 0);
            
            this.markDirty();
            return true;
            
        } catch (error) {
            console.error('Failed to validate progress:', error);
            return false;
        }
    }

    public getPlayerProgress(): PlayerProgress | null {
        return this._playerProgress;
    }

    public getCurrentRunProgress(): RunProgress | null {
        return this._currentRunProgress;
    }

    public hasUnsavedChanges(): boolean {
        return this._hasUnsavedChanges;
    }

    public manualSave(): boolean {
        try {
            const progressSaved = this.savePlayerProgress();
            const runSaved = this.saveRunProgress();
            
            return progressSaved && runSaved;
            
        } catch (error) {
            console.error('Manual save failed:', error);
            return false;
        }
    }
}