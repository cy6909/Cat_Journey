import { _decorator, Component, Node, EventTarget } from 'cc';
import { GameManager } from '../gameplay/GameManager';

const { ccclass, property } = _decorator;

/**
 * 经验值管理器 - 单例模式
 *
 * 负责管理玩家的经验值、等级和升级逻辑
 * 遵循"好品味"原则：简单、直接、无特殊情况
 */
@ccclass('ExperienceManager')
export class ExperienceManager extends Component {
    private static _instance: ExperienceManager | null = null;

    // 核心数据 - 直接存储，无冗余
    private _currentExp: number = 0;
    private _currentLevel: number = 1;
    private _expToNextLevel: number = 100;

    // 事件系统 - 用于通知UI更新
    private _eventTarget: EventTarget = new EventTarget();

    // 经验值公式常量 - 100 * (1.15)^(level-1)
    private readonly BASE_EXP: number = 100;
    private readonly EXP_GROWTH: number = 1.15;

    // 事件类型定义
    public static readonly EVENT_EXP_CHANGED = 'exp-changed';
    public static readonly EVENT_LEVEL_UP = 'level-up';

    protected onLoad(): void {
        // 单例模式 - 确保只有一个实例
        if (ExperienceManager._instance) {
            this.node.destroy();
            return;
        }
        ExperienceManager._instance = this;
    }

    protected onDestroy(): void {
        if (ExperienceManager._instance === this) {
            ExperienceManager._instance = null;
        }
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): ExperienceManager | null {
        return ExperienceManager._instance;
    }

    /**
     * 添加经验值
     * 简单直接的实现 - 没有特殊情况
     */
    public addExperience(amount: number): void {
        if (amount <= 0) return;

        this._currentExp += amount;

        // 检查升级 - 可能连续升级多级
        while (this._currentExp >= this._expToNextLevel) {
            this._currentExp -= this._expToNextLevel;
            this.levelUp();
        }

        // 触发经验值变化事件
        this._eventTarget.emit(ExperienceManager.EVENT_EXP_CHANGED, {
            currentExp: this._currentExp,
            expToNextLevel: this._expToNextLevel,
            level: this._currentLevel,
            progress: this._currentExp / this._expToNextLevel
        });
    }

    /**
     * 升级处理
     * 核心逻辑集中，无分支
     */
    private levelUp(): void {
        this._currentLevel++;
        this._expToNextLevel = this.calculateExpRequired(this._currentLevel);

        // 触发升级事件
        this._eventTarget.emit(ExperienceManager.EVENT_LEVEL_UP, {
            newLevel: this._currentLevel,
            expToNextLevel: this._expToNextLevel
        });

        // 应用属性提升
        this.applyLevelBonus();
    }

    /**
     * 计算指定等级所需经验值
     * 公式: 100 * (1.15)^(level-1)
     */
    private calculateExpRequired(level: number): number {
        return Math.floor(this.BASE_EXP * Math.pow(this.EXP_GROWTH, level - 1));
    }

    /**
     * 应用升级加成
     * 统一的属性提升逻辑
     */
    private applyLevelBonus(): void {
        // 每级提升的属性
        const bonuses = {
            paddleSpeed: 1.02,    // 移速 +2%
            paddleWidth: 1.01,    // 宽度 +1%
            ballDamage: 1.03,     // 伤害 +3%
            maxLives: 0.1         // 10级加1命
        };

        // 通知GameManager应用加成
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            const paddle = gameManager.getPaddle();
            if (paddle) {
                // 简单的线性提升
                const currentSpeed = paddle.speed || 300;
                paddle.speed = currentSpeed * bonuses.paddleSpeed;
            }

            // 每10级加1命
            if (this._currentLevel % 10 === 0) {
                gameManager.addLife(1);
            }
        }
    }

    /**
     * 重置系统
     * 用于新游戏开始
     */
    public reset(): void {
        this._currentExp = 0;
        this._currentLevel = 1;
        this._expToNextLevel = this.BASE_EXP;

        // 通知UI重置
        this._eventTarget.emit(ExperienceManager.EVENT_EXP_CHANGED, {
            currentExp: 0,
            expToNextLevel: this._expToNextLevel,
            level: 1,
            progress: 0
        });
    }

    /**
     * 获取当前等级
     */
    public getCurrentLevel(): number {
        return this._currentLevel;
    }

    /**
     * 获取当前经验值
     */
    public getCurrentExp(): number {
        return this._currentExp;
    }

    /**
     * 获取升级所需经验值
     */
    public getExpToNextLevel(): number {
        return this._expToNextLevel;
    }

    /**
     * 获取经验进度百分比
     */
    public getExpProgress(): number {
        return this._currentExp / this._expToNextLevel;
    }

    /**
     * 注册事件监听
     */
    public on(event: string, callback: Function, target?: any): void {
        this._eventTarget.on(event, callback, target);
    }

    /**
     * 注销事件监听
     */
    public off(event: string, callback: Function, target?: any): void {
        this._eventTarget.off(event, callback, target);
    }

    /**
     * 预计算多个等级的经验需求
     * 用于UI显示
     */
    public getExpTable(maxLevel: number = 20): number[] {
        const table: number[] = [];
        for (let level = 1; level <= maxLevel; level++) {
            table.push(this.calculateExpRequired(level));
        }
        return table;
    }
}