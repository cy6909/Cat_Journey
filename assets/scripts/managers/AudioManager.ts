import { _decorator, Component, AudioSource, AudioClip, resources, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioSource)
    public bgmPlayer: AudioSource = null!;

    @property(AudioSource)
    public sfxPlayer: AudioSource = null!;

    @property([AudioClip])
    public sfxClips: AudioClip[] = [];

    @property
    public bgmVolume: number = 0.8;

    @property
    public sfxVolume: number = 1.0;

    @property
    public enableAudio: boolean = true;

    private static _instance: AudioManager | null = null;
    private currentBGM: string = '';
    private fadeTarget: number = 0;
    private isFading: boolean = false;

    public static get instance(): AudioManager | null {
        return AudioManager._instance;
    }

    protected onLoad(): void {
        AudioManager._instance = this;
        this.initializeAudio();
    }

    protected onDestroy(): void {
        if (AudioManager._instance === this) {
            AudioManager._instance = null;
        }
    }

    private initializeAudio(): void {
        if (!this.bgmPlayer || !this.sfxPlayer) {
            console.warn('AudioManager: BGM or SFX player not configured');
            return;
        }

        // 配置BGM播放器
        this.bgmPlayer.volume = this.bgmVolume;
        this.bgmPlayer.loop = true;

        // 配置SFX播放器
        this.sfxPlayer.volume = this.sfxVolume;
        this.sfxPlayer.loop = false;

        console.log('AudioManager initialized successfully');
    }

    /**
     * 播放背景音乐
     * @param clipName 音频文件名（不含扩展名）
     * @param loop 是否循环播放，默认true
     * @param fadeIn 是否淡入，默认false
     */
    public playBGM(clipName: string, loop: boolean = true, fadeIn: boolean = false): void {
        if (!this.enableAudio || !this.bgmPlayer) return;

        // 避免重复播放同一BGM
        if (this.currentBGM === clipName && this.bgmPlayer.playing) {
            return;
        }

        resources.load(`audio/bgm/${clipName}`, AudioClip, (err, clip) => {
            if (!err && clip) {
                this.currentBGM = clipName;
                this.bgmPlayer.clip = clip;
                this.bgmPlayer.loop = loop;

                if (fadeIn) {
                    this.bgmPlayer.volume = 0;
                    this.bgmPlayer.play();
                    this.fadeBGM(this.bgmVolume, 2.0);
                } else {
                    this.bgmPlayer.volume = this.bgmVolume;
                    this.bgmPlayer.play();
                }

                console.log(`Playing BGM: ${clipName}`);
            } else {
                console.warn(`Failed to load BGM: ${clipName}`, err);
            }
        });
    }

    /**
     * 停止背景音乐
     * @param fadeOut 是否淡出，默认false
     */
    public stopBGM(fadeOut: boolean = false): void {
        if (!this.bgmPlayer) return;

        if (fadeOut) {
            this.fadeBGM(0, 1.0, () => {
                this.bgmPlayer.stop();
                this.currentBGM = '';
            });
        } else {
            this.bgmPlayer.stop();
            this.currentBGM = '';
        }
    }

    /**
     * 暂停背景音乐
     */
    public pauseBGM(): void {
        if (this.bgmPlayer && this.bgmPlayer.playing) {
            this.bgmPlayer.pause();
        }
    }

    /**
     * 恢复背景音乐
     */
    public resumeBGM(): void {
        if (this.bgmPlayer && !this.bgmPlayer.playing && this.currentBGM) {
            this.bgmPlayer.play();
        }
    }

    /**
     * BGM淡入淡出效果
     * @param targetVolume 目标音量
     * @param duration 持续时间（秒）
     * @param callback 完成回调
     */
    public fadeBGM(targetVolume: number, duration: number = 1.0, callback?: () => void): void {
        if (!this.bgmPlayer || this.isFading) return;

        this.isFading = true;
        this.fadeTarget = targetVolume;
        const startVolume = this.bgmPlayer.volume;
        const volumeDiff = targetVolume - startVolume;
        const steps = duration * 60; // 假设60FPS
        const volumeStep = volumeDiff / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                this.bgmPlayer.volume = this.fadeTarget;
                this.isFading = false;
                clearInterval(fadeInterval);
                if (callback) callback();
            } else {
                this.bgmPlayer.volume = startVolume + (volumeStep * currentStep);
            }
        }, 1000 / 60);
    }

    /**
     * 播放音效
     * @param clipName 音效名称
     * @param volume 音量倍数，默认1.0
     */
    public playSFX(clipName: string, volume: number = 1.0): void {
        if (!this.enableAudio || !this.sfxPlayer) return;

        // 首先尝试从预配置的音效列表中查找
        const clip = this.sfxClips.find(c => c && c.name === clipName);
        if (clip) {
            this.sfxPlayer.playOneShot(clip, this.sfxVolume * volume);
            console.log(`Playing SFX: ${clipName}`);
            return;
        }

        // 如果没有找到，尝试动态加载
        resources.load(`audio/sfx/${clipName}`, AudioClip, (err, clip) => {
            if (!err && clip) {
                this.sfxPlayer.playOneShot(clip, this.sfxVolume * volume);
                console.log(`Playing SFX (loaded): ${clipName}`);
            } else {
                console.warn(`Failed to load SFX: ${clipName}`, err);
            }
        });
    }

    /**
     * 播放UI音效
     * @param actionType 动作类型：hover, click, success, error, open, close
     */
    public playUISFX(actionType: 'hover' | 'click' | 'success' | 'error' | 'open' | 'close'): void {
        const sfxMap: Record<string, string> = {
            hover: 'ui_hover',
            click: 'ui_click',
            success: 'ui_success',
            error: 'ui_error',
            open: 'ui_open',
            close: 'ui_close'
        };

        const clipName = sfxMap[actionType];
        if (clipName) {
            this.playSFX(clipName);
        }
    }

    /**
     * 设置BGM音量
     * @param volume 音量值 0.0-1.0
     */
    public setBGMVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmPlayer) {
            this.bgmPlayer.volume = this.bgmVolume;
        }
    }

    /**
     * 设置SFX音量
     * @param volume 音量值 0.0-1.0
     */
    public setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxPlayer) {
            this.sfxPlayer.volume = this.sfxVolume;
        }
    }

    /**
     * 设置总开关
     * @param enable 是否启用音频
     */
    public setAudioEnabled(enable: boolean): void {
        this.enableAudio = enable;
        if (!enable) {
            this.stopBGM();
        }
    }

    /**
     * 获取当前BGM状态
     */
    public getBGMInfo(): { name: string; playing: boolean; volume: number } {
        return {
            name: this.currentBGM,
            playing: this.bgmPlayer ? this.bgmPlayer.playing : false,
            volume: this.bgmPlayer ? this.bgmPlayer.volume : 0
        };
    }

    /**
     * 预加载音频资源
     * @param audioList 音频文件名列表
     * @param callback 完成回调
     */
    public preloadAudio(audioList: { bgm?: string[]; sfx?: string[] }, callback?: () => void): void {
        let loadCount = 0;
        let totalCount = 0;

        if (audioList.bgm) totalCount += audioList.bgm.length;
        if (audioList.sfx) totalCount += audioList.sfx.length;

        if (totalCount === 0) {
            if (callback) callback();
            return;
        }

        const onLoadComplete = () => {
            loadCount++;
            if (loadCount >= totalCount) {
                console.log('All audio preloaded successfully');
                if (callback) callback();
            }
        };

        // 预加载BGM
        if (audioList.bgm) {
            audioList.bgm.forEach(name => {
                resources.load(`audio/bgm/${name}`, AudioClip, (err) => {
                    if (err) console.warn(`Failed to preload BGM: ${name}`);
                    onLoadComplete();
                });
            });
        }

        // 预加载SFX
        if (audioList.sfx) {
            audioList.sfx.forEach(name => {
                resources.load(`audio/sfx/${name}`, AudioClip, (err) => {
                    if (err) console.warn(`Failed to preload SFX: ${name}`);
                    onLoadComplete();
                });
            });
        }
    }
}