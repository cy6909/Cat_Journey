import { _decorator, Component, Node, EditBox, Button, Label, input, Input, KeyCode, EventKeyboard } from 'cc';
import { GameManager } from '../gameplay/GameManager';
import { DifficultyCalculator } from '../gameplay/DifficultySystem';

const { ccclass, property } = _decorator;

/**
 * 开发者工具UI - 快速测试不同难度关卡
 * 使用方法:
 * 1. 按F1键切换显示/隐藏
 * 2. 在输入框输入关卡数字
 * 3. 点击"应用"按钮加载该关卡
 */
@ccclass('DevToolsUI')
export class DevToolsUI extends Component {
    @property(EditBox)
    public levelInput: EditBox | null = null;

    @property(Button)
    public applyButton: Button | null = null;

    @property(Label)
    public infoLabel: Label | null = null;

    @property(Node)
    public panelNode: Node | null = null;  // 整个面板节点，用于显示/隐藏

    private _isVisible: boolean = false;

    protected onLoad(): void {
        // 初始隐藏面板
        this.hidePanel();

        // 注册按钮点击事件
        if (this.applyButton) {
            this.applyButton.node.on(Button.EventType.CLICK, this.onApplyButtonClick, this);
        }

        // 注册键盘快捷键
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        console.log('🛠️ DevToolsUI initialized - Press F1 to toggle');
    }

    protected onDestroy(): void {
        // 清理事件监听
        if (this.applyButton) {
            this.applyButton.node.off(Button.EventType.CLICK, this.onApplyButtonClick, this);
        }

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    /**
     * 键盘事件处理
     */
    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.F1:
                // F1切换显示/隐藏
                this.togglePanel();
                break;

            case KeyCode.ESCAPE:
                // Esc关闭面板
                if (this._isVisible) {
                    this.hidePanel();
                }
                break;

            case KeyCode.ENTER:
                // Enter键快速应用
                if (this._isVisible && this.levelInput && this.levelInput.string) {
                    this.onApplyButtonClick();
                }
                break;
        }
    }

    /**
     * 切换面板显示/隐藏
     */
    private togglePanel(): void {
        if (this._isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    /**
     * 显示面板
     */
    private showPanel(): void {
        if (this.panelNode) {
            this.panelNode.active = true;
            this._isVisible = true;
            console.log('🛠️ DevTools panel opened');

            // 聚焦输入框
            if (this.levelInput) {
                this.levelInput.focus();
            }
        }
    }

    /**
     * 隐藏面板
     */
    private hidePanel(): void {
        if (this.panelNode) {
            this.panelNode.active = false;
            this._isVisible = false;
            console.log('🛠️ DevTools panel closed');
        }
    }

    /**
     * 应用按钮点击事件
     */
    private onApplyButtonClick(): void {
        if (!this.levelInput || !this.levelInput.string) {
            console.warn('⚠️ Please enter a level number');
            this.updateInfoLabel('请输入关卡数字');
            return;
        }

        const level = parseInt(this.levelInput.string);

        // 验证输入
        if (isNaN(level) || level < 1) {
            console.warn('⚠️ Invalid level number:', this.levelInput.string);
            this.updateInfoLabel('无效的关卡数字\n请输入 >= 1 的整数');
            return;
        }

        if (level > 999) {
            console.warn('⚠️ Level too high, capping at 999');
            this.updateInfoLabel('关卡数字过大\n最大999');
            return;
        }

        // 计算难度配置
        const config = DifficultyCalculator.calculateDifficulty(level);

        // 更新信息显示
        this.updateInfoLabel(DifficultyCalculator.formatConfig(config));

        // 通知GameManager加载关卡
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            gameManager.loadLevel(level);
            console.log(`✅ Applied level ${level}`);
        } else {
            console.error('❌ GameManager not found');
            this.updateInfoLabel('错误: GameManager未找到');
        }
    }

    /**
     * 更新信息标签
     */
    private updateInfoLabel(text: string): void {
        if (this.infoLabel) {
            this.infoLabel.string = text;
        }
    }

    /**
     * 公开方法 - 设置默认关卡数字
     */
    public setDefaultLevel(level: number): void {
        if (this.levelInput) {
            this.levelInput.string = level.toString();
        }
    }

    /**
     * 公开方法 - 刷新当前关卡信息显示
     */
    public refreshCurrentLevelInfo(): void {
        const gameManager = GameManager.getInstance();
        if (gameManager) {
            const currentLevel = (gameManager as any).level || 1;
            const config = DifficultyCalculator.calculateDifficulty(currentLevel);
            this.updateInfoLabel(DifficultyCalculator.formatConfig(config));
            this.setDefaultLevel(currentLevel);
        }
    }
}
