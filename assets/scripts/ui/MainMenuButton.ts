import { _decorator, Component, Button, Color, tween, Vec3, UITransform, Node, Label } from 'cc';
import { AudioManager } from '../managers/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('MainMenuButton')
export class MainMenuButton extends Component {
    @property
    public buttonType: string = "normal";

    @property
    public enableSoundEffects: boolean = true;

    @property
    public enableClickAnimation: boolean = true;

    @property
    public enableHoverEffect: boolean = true;

    // 按钮颜色配置
    @property
    public normalColor: Color = Color.WHITE;

    @property
    public hoverColor: Color = new Color(100, 200, 255, 255);

    @property
    public pressedColor: Color = new Color(0, 150, 255, 255);

    @property
    public disabledColor: Color = Color.GRAY;

    private button: Button | null = null;
    private isHovered: boolean = false;
    private originalScale: Vec3 = new Vec3(1, 1, 1);

    protected onLoad(): void {
        this.button = this.node.getComponent(Button);
        if (this.button) {
            this.setupButtonStyle();
            this.bindEvents();
            this.originalScale = this.node.scale.clone();
        } else {
            console.warn('MainMenuButton: No Button component found');
        }
    }

    private setupButtonStyle(): void {
        if (!this.button) return;

        this.button.transition = Button.Transition.COLOR;
        this.button.normalColor = this.normalColor;
        this.button.hoverColor = this.hoverColor;
        this.button.pressedColor = this.pressedColor;
        this.button.disabledColor = this.disabledColor;

        // 设置按钮动画持续时间
        this.button.duration = 0.1;
    }

    private bindEvents(): void {
        if (!this.button) return;

        // 点击事件
        this.node.on(Button.EventType.CLICK, this.onButtonClick, this);
        
        // 悬停事件（如果支持）
        if (this.enableHoverEffect) {
            this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        }

        // 触摸事件（移动端）
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onButtonClick(): void {
        // 播放点击音效
        if (this.enableSoundEffects) {
            const audioManager = AudioManager.instance;
            if (audioManager) {
                audioManager.playUISFX('click');
            }
        }

        // 点击动画
        if (this.enableClickAnimation) {
            this.playClickAnimation();
        }

        // 处理按钮功能
        this.handleButtonFunction();
    }

    private onMouseEnter(): void {
        if (!this.isHovered && this.enableHoverEffect) {
            this.isHovered = true;
            
            // 播放悬停音效
            if (this.enableSoundEffects) {
                const audioManager = AudioManager.instance;
                if (audioManager) {
                    audioManager.playUISFX('hover');
                }
            }

            // 悬停动画
            this.playHoverAnimation(true);
        }
    }

    private onMouseLeave(): void {
        if (this.isHovered) {
            this.isHovered = false;
            this.playHoverAnimation(false);
        }
    }

    private onTouchStart(): void {
        // 移动端按下效果
        this.playPressAnimation(true);
    }

    private onTouchEnd(): void {
        // 移动端释放效果
        this.playPressAnimation(false);
    }

    private onTouchCancel(): void {
        // 取消触摸
        this.playPressAnimation(false);
    }

    private playClickAnimation(): void {
        // 快速缩放动画
        tween(this.node)
            .to(0.08, { scale: new Vec3(0.95, 0.95, 1) })
            .to(0.12, { scale: this.originalScale })
            .start();
    }

    private playHoverAnimation(isEntering: boolean): void {
        const targetScale = isEntering ? 
            new Vec3(1.05, 1.05, 1) : 
            this.originalScale;

        tween(this.node)
            .to(0.2, { scale: targetScale })
            .start();
    }

    private playPressAnimation(isPressed: boolean): void {
        const targetScale = isPressed ? 
            new Vec3(0.98, 0.98, 1) : 
            this.originalScale;

        tween(this.node)
            .to(0.1, { scale: targetScale })
            .start();
    }

    private handleButtonFunction(): void {
        switch (this.buttonType) {
            case "start":
                this.onStartGame();
                break;
            case "continue":
                this.onContinueGame();
                break;
            case "settings":
                this.onOpenSettings();
                break;
            case "leaderboard":
                this.onOpenLeaderboard();
                break;
            case "shop":
                this.onOpenShop();
                break;
            case "achievements":
                this.onOpenAchievements();
                break;
            case "mail":
                this.onOpenMail();
                break;
            case "help":
                this.onOpenHelp();
                break;
            default:
                console.log(`Button clicked: ${this.buttonType}`);
        }
    }

    private onStartGame(): void {
        console.log("开始游戏");
        // TODO: 实现场景切换逻辑
        // director.loadScene('GameScene');
        
        // 播放成功音效
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('success');
        }
    }

    private onContinueGame(): void {
        console.log("继续游戏");
        // TODO: 加载存档并继续游戏
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('success');
        }
    }

    private onOpenSettings(): void {
        console.log("打开设置");
        // TODO: 打开设置面板
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    private onOpenLeaderboard(): void {
        console.log("打开排行榜");
        // TODO: 打开排行榜界面
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    private onOpenShop(): void {
        console.log("打开商店");
        // TODO: 打开商店界面
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    private onOpenAchievements(): void {
        console.log("打开成就");
        // TODO: 打开成就界面
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    private onOpenMail(): void {
        console.log("打开邮件");
        // TODO: 打开邮件界面
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    private onOpenHelp(): void {
        console.log("打开帮助");
        // TODO: 打开帮助界面
        
        const audioManager = AudioManager.instance;
        if (audioManager) {
            audioManager.playUISFX('open');
        }
    }

    /**
     * 设置按钮文本
     * @param text 按钮文本
     */
    public setButtonText(text: string): void {
        const label = this.node.getComponentInChildren(Label);
        if (label) {
            label.string = text;
        }
    }

    /**
     * 设置按钮启用状态
     * @param enabled 是否启用
     */
    public setButtonEnabled(enabled: boolean): void {
        if (this.button) {
            this.button.interactable = enabled;
        }
    }

    /**
     * 设置按钮类型
     * @param type 按钮类型
     */
    public setButtonType(type: string): void {
        this.buttonType = type;
    }

    /**
     * 播放自定义点击动画
     * @param intensity 动画强度
     */
    public playCustomClickEffect(intensity: number = 1.0): void {
        const scale = 1.0 - (0.05 * intensity);
        tween(this.node)
            .to(0.08 * intensity, { scale: new Vec3(scale, scale, 1) })
            .to(0.12 * intensity, { scale: this.originalScale })
            .start();
    }

    protected onDestroy(): void {
        // 清理事件监听
        this.node.off(Button.EventType.CLICK, this.onButtonClick, this);
        this.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
}