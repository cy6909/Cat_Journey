import { _decorator, Component, AudioSource, resources, AudioClip, tween, Node } from 'cc';
import { AudioManager } from '../managers/AudioManager';

const { ccclass, property } = _decorator;

export enum SoundEffectType {
    // 基础UI音效
    UI_CLICK = 'ui_click',
    UI_HOVER = 'ui_hover', 
    UI_SUCCESS = 'ui_success',
    UI_ERROR = 'ui_error',
    UI_OPEN = 'ui_open',
    UI_CLOSE = 'ui_close',
    
    // 游戏核心音效
    BALL_BOUNCE_PADDLE = 'ball_bounce_paddle',
    BALL_BOUNCE_WALL = 'ball_bounce_wall',
    BALL_BOUNCE_BRICK = 'ball_bounce_brick',
    BALL_LOST = 'ball_lost',
    BALL_SPAWN = 'ball_spawn',
    
    // 砖块音效
    BRICK_HIT = 'brick_hit',
    BRICK_DESTROYED = 'brick_destroyed',
    BRICK_SPECIAL_HIT = 'brick_special_hit',
    BRICK_EXPLOSION = 'brick_explosion',
    BRICK_ELECTRIC = 'brick_electric',
    BRICK_ICE_BREAK = 'brick_ice_break',
    BRICK_FIRE_BURN = 'brick_fire_burn',
    
    // 挡板音效
    PADDLE_MOVE = 'paddle_move',
    PADDLE_DAMAGED = 'paddle_damaged',
    PADDLE_REPAIRED = 'paddle_repaired',
    PADDLE_LEVEL_UP = 'paddle_level_up',
    PADDLE_LASER_SHOOT = 'paddle_laser_shoot',
    
    // 核心音效
    CORE_DAMAGED = 'core_damaged',
    CORE_CRITICAL = 'core_critical',
    CORE_HEALED = 'core_healed',
    CORE_LEVEL_UP = 'core_level_up',
    CORE_DESTROYED = 'core_destroyed',
    
    // 道具音效
    POWERUP_SPAWN = 'powerup_spawn',
    POWERUP_COLLECT = 'powerup_collect',
    POWERUP_ACTIVATE = 'powerup_activate',
    POWERUP_EXPIRE = 'powerup_expire',
    
    // 遗物音效
    RELIC_FOUND = 'relic_found',
    RELIC_ACTIVATE = 'relic_activate',
    RELIC_PROC = 'relic_proc',
    
    // Boss音效
    BOSS_APPEAR = 'boss_appear',
    BOSS_ATTACK = 'boss_attack',
    BOSS_DAMAGED = 'boss_damaged',
    BOSS_PHASE_CHANGE = 'boss_phase_change',
    BOSS_DEFEATED = 'boss_defeated',
    
    // 关卡音效
    LEVEL_START = 'level_start',
    LEVEL_COMPLETE = 'level_complete',
    LEVEL_FAILED = 'level_failed',
    CHAPTER_COMPLETE = 'chapter_complete',
    
    // 环境音效
    AMBIENT_WIND = 'ambient_wind',
    AMBIENT_SPARKS = 'ambient_sparks',
    AMBIENT_WATER = 'ambient_water',
    AMBIENT_FIRE = 'ambient_fire',
    
    // 商店和货币音效
    COIN_COLLECT = 'coin_collect',
    GEM_COLLECT = 'gem_collect',
    PURCHASE_SUCCESS = 'purchase_success',
    PURCHASE_FAILED = 'purchase_failed',
    
    // 成就和奖励音效
    ACHIEVEMENT_UNLOCK = 'achievement_unlock',
    REWARD_CLAIM = 'reward_claim',
    EXP_GAIN = 'exp_gain',
    LEVEL_UP = 'level_up'
}

export interface SoundEffectConfig {
    clipName: string;
    volume: number;
    pitch: number;
    loop: boolean;
    fadeIn: boolean;
    fadeOut: boolean;
    delay: number;
    randomPitch: boolean;
    spatialAudio: boolean;
    priority: number;
}

@ccclass('LevelSoundManager')
export class LevelSoundManager extends Component {
    
    @property(AudioSource)
    public soundEffectSource: AudioSource | null = null;
    
    @property(AudioSource) 
    public ambientSource: AudioSource | null = null;
    
    @property(AudioSource)
    public uiSource: AudioSource | null = null;
    
    @property
    public maxConcurrentSounds: number = 8;
    
    @property
    public soundEffectVolume: number = 1.0;
    
    @property
    public ambientVolume: number = 0.5;
    
    @property
    public enableSpatialAudio: boolean = true;

    private static _instance: LevelSoundManager | null = null;
    private _soundPool: AudioSource[] = [];
    private _activeSounds: Map<string, AudioSource> = new Map();
    private _soundConfigs: Map<SoundEffectType, SoundEffectConfig> = new Map();
    private _audioClips: Map<string, AudioClip> = new Map();
    private _currentAmbientLoop: string = '';

    public static getInstance(): LevelSoundManager | null {
        return LevelSoundManager._instance;
    }

    protected onLoad(): void {
        if (LevelSoundManager._instance === null) {
            LevelSoundManager._instance = this;
        }
        
        this.initializeSoundPool();
        this.initializeSoundConfigs();
        this.preloadAudioClips();
    }

    protected onDestroy(): void {
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
    private initializeSoundPool(): void {
        for (let i = 0; i < this.maxConcurrentSounds; i++) {
            const audioNode = new Node(`SoundPool_${i}`);
            const audioSource = audioNode.addComponent(AudioSource);
            audioSource.volume = this.soundEffectVolume;
            
            this.node.addChild(audioNode);
            this._soundPool.push(audioSource);
        }
        
        console.log(`Sound pool initialized with ${this.maxConcurrentSounds} sources`);
    }

    /**
     * 初始化音效配置
     */
    private initializeSoundConfigs(): void {
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
        });

        // 弹球音效配置
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
        });

        // 砖块音效配置
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
        });

        // Boss音效配置
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
        });

        // 环境音效配置
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

        console.log(`Initialized ${this._soundConfigs.size} sound configurations`);
    }

    /**
     * 预加载音频资源
     */
    private preloadAudioClips(): void {
        const audioList = [
            // UI音效
            'ui/click', 'ui/hover', 'ui/success', 'ui/error', 'ui/open', 'ui/close',
            
            // 游戏核心音效
            'gameplay/ball_bounce_paddle', 'gameplay/ball_bounce_wall', 'gameplay/ball_bounce_brick',
            'gameplay/ball_lost', 'gameplay/ball_spawn',
            
            // 砖块音效
            'gameplay/brick_hit', 'gameplay/brick_destroyed', 'gameplay/brick_explosion',
            'gameplay/brick_electric', 'gameplay/brick_ice_break', 'gameplay/brick_fire_burn',
            
            // 挡板音效
            'gameplay/paddle_move', 'gameplay/paddle_damaged', 'gameplay/paddle_repaired',
            'gameplay/paddle_level_up', 'gameplay/paddle_laser_shoot',
            
            // Boss音效
            'boss/boss_appear', 'boss/boss_attack', 'boss/boss_damaged',
            'boss/boss_phase_change', 'boss/boss_defeated',
            
            // 环境音效
            'ambient/wind_loop', 'ambient/sparks_loop', 'ambient/water_loop', 'ambient/fire_loop'
        ];

        let loadedCount = 0;
        const totalCount = audioList.length;

        audioList.forEach(clipPath => {
            resources.load(`audio/${clipPath}`, AudioClip, (err, clip) => {
                loadedCount++;
                
                if (err) {
                    console.warn(`Failed to load audio clip: ${clipPath}`, err);
                } else {
                    this._audioClips.set(clipPath, clip);
                    console.log(`Loaded audio clip: ${clipPath}`);
                }

                if (loadedCount === totalCount) {
                    console.log(`All audio clips loaded (${this._audioClips.size}/${totalCount})`);
                }
            });
        });
    }

    /**
     * 播放音效
     */
    public playSoundEffect(effectType: SoundEffectType, position?: { x: number, y: number }): boolean {
        const config = this._soundConfigs.get(effectType);
        if (!config) {
            console.warn(`Sound effect config not found: ${effectType}`);
            return false;
        }

        const audioClip = this._audioClips.get(config.clipName);
        if (!audioClip) {
            console.warn(`Audio clip not found: ${config.clipName}`);
            return false;
        }

        const audioSource = this.getAvailableAudioSource();
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
        }

        // 记录活跃音效
        const soundId = `${effectType}_${Date.now()}`;
        this._activeSounds.set(soundId, audioSource);

        // 设置音效结束回调
        this.scheduleOnce(() => {
            this._activeSounds.delete(soundId);
            this.returnAudioSourceToPool(audioSource);
        }, audioClip.duration);

        return true;
    }

    /**
     * 播放环境音效循环
     */
    public playAmbientLoop(effectType: SoundEffectType): boolean {
        if (this._currentAmbientLoop === effectType) {
            return true; // 已经在播放
        }

        // 停止当前环境音效
        this.stopAmbientLoop();

        const config = this._soundConfigs.get(effectType);
        if (!config || !config.loop) {
            console.warn(`Ambient sound config not found or not looped: ${effectType}`);
            return false;
        }

        const audioClip = this._audioClips.get(config.clipName);
        if (!audioClip || !this.ambientSource) {
            console.warn(`Ambient audio clip or source not found: ${config.clipName}`);
            return false;
        }

        this.ambientSource.clip = audioClip;
        this.ambientSource.volume = config.volume * this.ambientVolume;
        this.ambientSource.pitch = config.pitch;
        this.ambientSource.loop = true;

        if (config.fadeIn) {
            this.ambientSource.volume = 0;
            this.ambientSource.play();
            
            tween(this.ambientSource)
                .to(2.0, { volume: config.volume * this.ambientVolume })
                .start();
        } else {
            this.ambientSource.play();
        }

        this._currentAmbientLoop = effectType;
        console.log(`Started ambient loop: ${effectType}`);
        return true;
    }

    /**
     * 停止环境音效循环
     */
    public stopAmbientLoop(): void {
        if (!this.ambientSource || !this._currentAmbientLoop) {
            return;
        }

        const config = this._soundConfigs.get(this._currentAmbientLoop as SoundEffectType);
        
        if (config && config.fadeOut) {
            tween(this.ambientSource)
                .to(1.0, { volume: 0 })
                .call(() => {
                    if (this.ambientSource) {
                        this.ambientSource.stop();
                    }
                })
                .start();
        } else {
            this.ambientSource.stop();
        }

        console.log(`Stopped ambient loop: ${this._currentAmbientLoop}`);
        this._currentAmbientLoop = '';
    }

    /**
     * 播放UI音效
     */
    public playUISound(effectType: SoundEffectType): boolean {
        const config = this._soundConfigs.get(effectType);
        if (!config) return false;

        const audioClip = this._audioClips.get(config.clipName);
        if (!audioClip || !this.uiSource) return false;

        this.uiSource.clip = audioClip;
        this.uiSource.volume = config.volume * this.soundEffectVolume;
        this.uiSource.pitch = config.randomPitch ? 
            config.pitch + (Math.random() - 0.5) * 0.2 : 
            config.pitch;
        this.uiSource.play();

        return true;
    }

    /**
     * 获取可用的音频源
     */
    private getAvailableAudioSource(): AudioSource | null {
        // 查找空闲的音频源
        for (const source of this._soundPool) {
            if (!source.playing) {
                return source;
            }
        }

        // 如果没有空闲的，找到优先级最低的音频源
        let lowestPriority = 10;
        let targetSource: AudioSource | null = null;

        for (const [soundId, source] of this._activeSounds) {
            // 这里需要根据音效类型获取优先级
            // 简化处理，直接使用第一个找到的
            if (!targetSource) {
                targetSource = source;
                break;
            }
        }

        return targetSource || this._soundPool[0];
    }

    /**
     * 设置音频源参数
     */
    private setupAudioSource(source: AudioSource, config: SoundEffectConfig, clip: AudioClip, position?: { x: number, y: number }): void {
        source.clip = clip;
        source.volume = config.volume * this.soundEffectVolume;
        source.pitch = config.randomPitch ? 
            config.pitch + (Math.random() - 0.5) * 0.2 : 
            config.pitch;
        source.loop = config.loop;

        // 空间音频设置
        if (config.spatialAudio && position && this.enableSpatialAudio) {
            // 根据位置调整音量和声道
            const screenCenter = { x: 0, y: 0 };
            const distance = Math.sqrt(
                Math.pow(position.x - screenCenter.x, 2) + 
                Math.pow(position.y - screenCenter.y, 2)
            );
            
            // 距离衰减
            const maxDistance = 500;
            const volumeMultiplier = Math.max(0.1, 1.0 - (distance / maxDistance));
            source.volume *= volumeMultiplier;
        }
    }

    /**
     * 播放音频源
     */
    private playAudioSource(source: AudioSource, config: SoundEffectConfig): void {
        if (config.fadeIn) {
            source.volume = 0;
            source.play();
            
            tween(source)
                .to(0.3, { volume: config.volume * this.soundEffectVolume })
                .start();
        } else {
            source.play();
        }
    }

    /**
     * 归还音频源到池中
     */
    private returnAudioSourceToPool(source: AudioSource): void {
        source.stop();
        source.clip = null;
        source.volume = this.soundEffectVolume;
        source.pitch = 1.0;
        source.loop = false;
    }

    /**
     * 停止所有音效
     */
    public stopAllSounds(): void {
        // 停止所有音效源
        this._soundPool.forEach(source => {
            source.stop();
        });

        // 停止环境音效
        this.stopAmbientLoop();

        // 停止UI音效
        if (this.uiSource) {
            this.uiSource.stop();
        }

        // 清除活跃音效记录
        this._activeSounds.clear();

        console.log('All sounds stopped');
    }

    /**
     * 设置音量
     */
    public setSoundEffectVolume(volume: number): void {
        this.soundEffectVolume = Math.max(0, Math.min(1, volume));
        
        // 更新所有活跃的音效源音量
        this._soundPool.forEach(source => {
            if (source.playing) {
                const config = this.getConfigForSource(source);
                if (config) {
                    source.volume = config.volume * this.soundEffectVolume;
                }
            }
        });
    }

    public setAmbientVolume(volume: number): void {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        
        if (this.ambientSource && this.ambientSource.playing) {
            const config = this._soundConfigs.get(this._currentAmbientLoop as SoundEffectType);
            if (config) {
                this.ambientSource.volume = config.volume * this.ambientVolume;
            }
        }
    }

    /**
     * 工具方法
     */
    private getConfigForSource(source: AudioSource): SoundEffectConfig | null {
        // 这里可以通过某种方式追踪音频源对应的配置
        // 简化实现
        return null;
    }

    /**
     * 快捷方法
     */
    public playBallBounce(position?: { x: number, y: number }): void {
        this.playSoundEffect(SoundEffectType.BALL_BOUNCE_BRICK, position);
    }

    public playBrickDestroyed(position?: { x: number, y: number }): void {
        this.playSoundEffect(SoundEffectType.BRICK_DESTROYED, position);
    }

    public playUIClick(): void {
        this.playUISound(SoundEffectType.UI_CLICK);
    }

    public playBossAppear(): void {
        this.playSoundEffect(SoundEffectType.BOSS_APPEAR);
    }

    public setAmbientForChapter(chapter: number): void {
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
    public getDebugInfo(): string {
        const activeCount = Array.from(this._soundPool).filter(s => s.playing).length;
        const ambientPlaying = this.ambientSource?.playing ? this._currentAmbientLoop : 'None';
        
        return `Active Sounds: ${activeCount}/${this.maxConcurrentSounds}, Ambient: ${ambientPlaying}, Volume: ${this.soundEffectVolume}`;
    }
}