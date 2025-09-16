import { _decorator, Component, director, Node } from 'cc';
import { AudioManager } from '../managers/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('MainMenuController')
export class MainMenuController extends Component {
    @property(Node)
    public backgroundLayer: Node = null!;

    @property(Node)
    public uiLayer: Node = null!;

    @property(Node)
    public audioManager: Node = null!;

    @property
    public enableAutoPlay: boolean = true;

    @property
    public preloadAudioOnStart: boolean = true;

    protected onLoad(): void {
        this.initializeScene();
    }

    protected start(): void {
        if (this.preloadAudioOnStart) {
            this.preloadAudioResources();
        }
        
        if (this.enableAutoPlay) {
            this.startBackgroundMusic();
        }

        this.startBackgroundAnimations();
    }

    private initializeScene(): void {
        console.log("主界面场景初始化中...");

        // 确保AudioManager存在并初始化
        if (this.audioManager && !AudioManager.instance) {
            console.warn("AudioManager instance not found, scene may need AudioManager component");
        }

        // 验证必要的组件
        this.validateSceneSetup();
    }

    private validateSceneSetup(): void {
        if (!this.backgroundLayer) {
            console.warn("MainMenuController: backgroundLayer not assigned");
        }

        if (!this.uiLayer) {
            console.warn("MainMenuController: uiLayer not assigned");
        }

        if (!this.audioManager) {
            console.warn("MainMenuController: audioManager not assigned");
        }
    }

    private preloadAudioResources(): void {
        if (!AudioManager.instance) {
            console.warn("AudioManager not available for preloading");
            return;
        }

        const audioList = {
            bgm: [
                'main_theme',
                'forest_theme',
                'snow_theme',
                'abyss_theme'
            ],
            sfx: [
                'ui_click',
                'ui_hover',
                'ui_success',
                'ui_error',
                'ui_open',
                'ui_close'
            ]
        };

        AudioManager.instance.preloadAudio(audioList, () => {
            console.log("主界面音频资源预加载完成");
        });
    }

    private startBackgroundMusic(): void {
        if (AudioManager.instance) {
            // 播放主题音乐，带淡入效果
            AudioManager.instance.playBGM('main_theme', true, true);
        }
    }

    private startBackgroundAnimations(): void {
        console.log("主界面背景动画启动");
        
        // 这里可以添加额外的场景级动画
        // 比如整体的呼吸效果、光线变化等
        this.addSceneBreathingEffect();
    }

    private addSceneBreathingEffect(): void {
        // 添加非常轻微的整体呼吸效果
        if (this.backgroundLayer) {
            const { tween, Vec3 } = require('cc');
            
            tween(this.backgroundLayer)
                .repeatForever(
                    tween()
                        .to(8, { scale: new Vec3(1.01, 1.01, 1) })
                        .to(8, { scale: new Vec3(1.0, 1.0, 1) })
                )
                .start();
        }
    }

    /**
     * 场景跳转方法
     */
    public onStartGame(): void {
        this.fadeOutAndLoadScene('GameScene');
    }

    public onContinueGame(): void {
        // TODO: 加载存档数据
        this.fadeOutAndLoadScene('GameScene');
    }

    public onOpenSettings(): void {
        this.openPanel('SettingsPanel');
    }

    public onOpenLeaderboard(): void {
        this.openPanel('LeaderboardPanel');
    }

    public onOpenShop(): void {
        this.openPanel('ShopPanel');
    }

    public onOpenAchievements(): void {
        this.openPanel('AchievementsPanel');
    }

    public onOpenMail(): void {
        this.openPanel('MailPanel');
    }

    public onOpenHelp(): void {
        this.openPanel('HelpPanel');
    }

    private fadeOutAndLoadScene(sceneName: string): void {
        const audioManager = AudioManager.instance;
        if (audioManager) {
            // 音乐淡出
            audioManager.fadeBGM(0, 1.0, () => {
                const mgr = AudioManager.instance;
                if (mgr) {
                    mgr.stopBGM();
                }
                director.loadScene(sceneName);
            });
        } else {
            director.loadScene(sceneName);
        }
    }

    private openPanel(panelName: string): void {
        console.log(`打开面板: ${panelName}`);
        
        // TODO: 实现面板打开逻辑
        // 这里可以实例化预制体或者显示隐藏的UI面板
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    /**
     * 切换背景主题（用于测试不同主题背景）
     */
    public switchBackgroundTheme(themeName: 'forest' | 'snow' | 'abyss' | 'space'): void {
        if (!this.backgroundLayer) return;

        console.log(`切换背景主题到: ${themeName}`);

        // 移除当前背景组件
        const currentBgComponents = [
            'StarFieldBackground',
            'ForestThemeBackground', 
            'SnowMountainBackground',
            'AbyssBackground'
        ];

        currentBgComponents.forEach(componentName => {
            const component = this.backgroundLayer.getComponent(componentName);
            if (component) {
                this.backgroundLayer.removeComponent(component);
            }
        });

        // 添加新的背景组件
        let newComponentName = '';
        let bgmName = '';
        
        switch (themeName) {
            case 'forest':
                newComponentName = 'ForestThemeBackground';
                bgmName = 'forest_theme';
                break;
            case 'snow':
                newComponentName = 'SnowMountainBackground';
                bgmName = 'snow_theme';
                break;
            case 'abyss':
                newComponentName = 'AbyssBackground';
                bgmName = 'abyss_theme';
                break;
            case 'space':
            default:
                newComponentName = 'StarFieldBackground';
                bgmName = 'main_theme';
                break;
        }

        // 这里需要动态导入对应的背景组件类
        // 在实际使用中，需要确保这些组件已经在项目中注册
        console.log(`应用背景组件: ${newComponentName}`);
        
        // 切换对应的背景音乐
        const audioManager = AudioManager.instance;
        if (audioManager && bgmName) {
            audioManager.playBGM(bgmName, true, true);
        }
    }

    /**
     * 设置音频选项
     */
    public setAudioSettings(bgmVolume: number, sfxVolume: number, enabled: boolean): void {
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.setBGMVolume(bgmVolume);
            audioManager.setSFXVolume(sfxVolume);
            audioManager.setAudioEnabled(enabled);
        }
    }

    /**
     * 获取当前音频状态（用于设置面板）
     */
    public getAudioSettings(): { bgmVolume: number; sfxVolume: number; enabled: boolean } {
        const audioManager = AudioManager.instance;
        if (audioManager) {
            return {
                bgmVolume: audioManager.bgmVolume,
                sfxVolume: audioManager.sfxVolume,
                enabled: audioManager.enableAudio
            };
        }
        
        return { bgmVolume: 0.8, sfxVolume: 1.0, enabled: true };
    }

    /**
     * 场景清理
     */
    protected onDestroy(): void {
        // 停止所有动画和音效
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.stopBGM();
        }
        
        console.log("主界面场景清理完成");
    }
}