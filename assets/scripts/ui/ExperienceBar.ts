import { _decorator, Component, Node, ProgressBar, Label, tween, Vec3, UIOpacity } from 'cc';
import { ExperienceManager } from '../managers/ExperienceManager';

const { ccclass, property } = _decorator;

/**
 * 经验条UI组件
 *
 * 显示玩家的经验值进度和等级
 * 简洁实现，无冗余动画
 */
@ccclass('ExperienceBar')
export class ExperienceBar extends Component {
    @property(ProgressBar)
    public progressBar: ProgressBar | null = null;

    @property(Label)
    public levelLabel: Label | null = null;

    @property(Label)
    public expLabel: Label | null = null;

    @property(Node)
    public levelUpEffect: Node | null = null;  // 升级特效节点

    private _expManager: ExperienceManager | null = null;
    private _lastLevel: number = 1;

    protected onLoad(): void {
        // 初始隐藏升级特效
        if (this.levelUpEffect) {
            this.levelUpEffect.active = false;
        }

        // 初始化显示
        this.updateDisplay(0, 100, 1);
    }

    protected start(): void {
        // 获取经验管理器
        this._expManager = ExperienceManager.getInstance();
        if (!this._expManager) {
            console.warn('ExperienceBar: ExperienceManager not found');
            return;
        }

        // 监听经验值变化事件
        this._expManager.on(ExperienceManager.EVENT_EXP_CHANGED, this.onExpChanged, this);
        this._expManager.on(ExperienceManager.EVENT_LEVEL_UP, this.onLevelUp, this);

        // 初始化显示当前状态
        this.refreshDisplay();
    }

    protected onDestroy(): void {
        // 清理事件监听
        if (this._expManager) {
            this._expManager.off(ExperienceManager.EVENT_EXP_CHANGED, this.onExpChanged, this);
            this._expManager.off(ExperienceManager.EVENT_LEVEL_UP, this.onLevelUp, this);
        }
    }

    /**
     * 经验值变化处理
     */
    private onExpChanged(data: any): void {
        this.updateDisplay(data.currentExp, data.expToNextLevel, data.level);

        // 平滑更新进度条
        if (this.progressBar) {
            const targetProgress = data.progress;
            tween(this.progressBar)
                .to(0.3, { progress: targetProgress }, { easing: 'quadOut' })
                .start();
        }
    }

    /**
     * 升级处理
     */
    private onLevelUp(data: any): void {
        console.log(`Level Up! New level: ${data.newLevel}`);

        // 显示升级特效
        this.playLevelUpEffect();

        // 更新等级显示
        this._lastLevel = data.newLevel;
        this.updateLevelDisplay(data.newLevel);
    }

    /**
     * 更新显示
     */
    private updateDisplay(currentExp: number, expToNext: number, level: number): void {
        // 更新等级文本
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${level}`;
        }

        // 更新经验值文本
        if (this.expLabel) {
            this.expLabel.string = `${Math.floor(currentExp)}/${Math.floor(expToNext)}`;
        }

        // 更新进度条 (初始不使用动画)
        if (this.progressBar && !this.node.activeInHierarchy) {
            this.progressBar.progress = currentExp / expToNext;
        }
    }

    /**
     * 更新等级显示
     */
    private updateLevelDisplay(level: number): void {
        if (this.levelLabel) {
            // 简单的放大缩小动画
            const originalScale = new Vec3(1, 1, 1);
            const bigScale = new Vec3(1.3, 1.3, 1);

            this.levelLabel.string = `Lv.${level}`;

            tween(this.levelLabel.node)
                .to(0.1, { scale: bigScale })
                .to(0.2, { scale: originalScale })
                .start();
        }
    }

    /**
     * 播放升级特效
     */
    private playLevelUpEffect(): void {
        if (!this.levelUpEffect) return;

        // 显示特效节点
        this.levelUpEffect.active = true;

        // 重置透明度
        let opacity = this.levelUpEffect.getComponent(UIOpacity);
        if (!opacity) {
            opacity = this.levelUpEffect.addComponent(UIOpacity);
        }
        opacity.opacity = 255;

        // 简单的淡出动画
        tween(opacity)
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.levelUpEffect!.active = false;
            })
            .start();

        // 可选：上升动画
        const startPos = new Vec3(0, 0, 0);
        const endPos = new Vec3(0, 50, 0);

        this.levelUpEffect.setPosition(startPos);
        tween(this.levelUpEffect)
            .to(1.0, { position: endPos })
            .start();
    }

    /**
     * 刷新显示
     */
    public refreshDisplay(): void {
        if (!this._expManager) return;

        const currentExp = this._expManager.getCurrentExp();
        const expToNext = this._expManager.getExpToNextLevel();
        const level = this._expManager.getCurrentLevel();

        this.updateDisplay(currentExp, expToNext, level);

        if (this.progressBar) {
            this.progressBar.progress = currentExp / expToNext;
        }
    }

    /**
     * 设置进度条颜色
     * 可根据等级改变颜色
     */
    public setProgressBarColor(level: number): void {
        if (!this.progressBar) return;

        // 简单的颜色分级
        // 1-10: 绿色, 11-20: 蓝色, 21-30: 紫色, 31+: 金色
        const barSprite = this.progressBar.barSprite;
        if (!barSprite) return;

        if (level <= 10) {
            barSprite.color.set(100, 255, 100);  // 绿色
        } else if (level <= 20) {
            barSprite.color.set(100, 150, 255);  // 蓝色
        } else if (level <= 30) {
            barSprite.color.set(200, 100, 255);  // 紫色
        } else {
            barSprite.color.set(255, 215, 0);    // 金色
        }
    }

    /**
     * 测试方法 - 用于开发调试
     */
    public testAddExp(amount: number): void {
        if (this._expManager) {
            this._expManager.addExperience(amount);
        }
    }
}