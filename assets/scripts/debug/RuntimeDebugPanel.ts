import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Runtime Debug Panel - Linus式好品味调试工具
 * 
 * 设计原则：
 * 1. 最简单的DOM overlay实现
 * 2. 直接修改组件属性，不重构架构  
 * 3. 只在开发环境启用
 * 4. 消除复杂状态，直接数据驱动
 */
@ccclass('RuntimeDebugPanel')
export class RuntimeDebugPanel extends Component {
    
    private _debugPanel: HTMLElement | null = null;
    private _paddleController: any = null;
    private _ball: any = null;
    
    protected onLoad(): void {
        // 只在开发环境创建调试面板
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            this.createDebugPanel();
            this.findGameComponents();
        }
    }
    
    private createDebugPanel(): void {
        // 创建调试面板容器
        this._debugPanel = document.createElement('div');
        this._debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 280px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 15px;
            color: #00ff00;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            user-select: none;
        `;
        
        // 标题
        const title = document.createElement('div');
        title.innerHTML = '🛠️ Runtime Debug Panel';
        title.style.cssText = `
            margin-bottom: 15px;
            font-weight: bold;
            text-align: center;
            border-bottom: 1px solid #00ff00;
            padding-bottom: 8px;
        `;
        this._debugPanel.appendChild(title);
        
        // 挡板手感控制
        this.createSliderControl(
            'Paddle Damping',
            'paddle-damping',
            0.05,
            0.3,
            0.15,
            0.01,
            (value: number) => {
                if (this._paddleController && this._paddleController._dampingFactor !== undefined) {
                    this._paddleController._dampingFactor = value;
                    console.log(`Paddle damping set to: ${value.toFixed(3)}`);
                }
            }
        );
        
        // 球速度控制
        this.createSliderControl(
            'Ball Speed',
            'ball-speed',
            50,
            300,
            100,
            10,
            (value: number) => {
                if (this._ball && this._ball.initialSpeed !== undefined) {
                    this._ball.initialSpeed = value;
                    console.log(`Ball initial speed set to: ${value}`);
                }
            }
        );
        
        // 挡板最大速度控制
        this.createSliderControl(
            'Paddle Max Speed',
            'paddle-maxspeed',
            200,
            1200,
            800,
            50,
            (value: number) => {
                if (this._paddleController && this._paddleController._maxSpeed !== undefined) {
                    this._paddleController._maxSpeed = value;
                    console.log(`Paddle max speed set to: ${value}`);
                }
            }
        );
        
        // 添加到页面
        document.body.appendChild(this._debugPanel);
        console.log('✅ Runtime Debug Panel created');
    }
    
    private createSliderControl(
        label: string,
        id: string,
        min: number,
        max: number,
        defaultValue: number,
        step: number,
        onChanged: (value: number) => void
    ): void {
        const container = document.createElement('div');
        container.style.marginBottom = '12px';
        
        // 标签和数值显示
        const labelElement = document.createElement('div');
        labelElement.innerHTML = `${label}: <span id="${id}-value">${defaultValue}</span>`;
        labelElement.style.cssText = 'margin-bottom: 5px; font-weight: bold;';
        
        // 滑动条
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = id;
        slider.min = min.toString();
        slider.max = max.toString();
        slider.step = step.toString();
        slider.value = defaultValue.toString();
        slider.style.cssText = `
            width: 100%;
            margin-bottom: 3px;
            accent-color: #00ff00;
        `;
        
        // 事件处理
        slider.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            const valueSpan = document.getElementById(`${id}-value`);
            if (valueSpan) {
                valueSpan.textContent = value.toString();
            }
            onChanged(value);
        });
        
        container.appendChild(labelElement);
        container.appendChild(slider);
        this._debugPanel?.appendChild(container);
    }
    
    private findGameComponents(): void {
        // 延迟查找游戏组件，确保都已创建
        this.scheduleOnce(() => {
            this._findGameComponentsActual();
        }, 0.2);
    }
    
    private _findGameComponentsActual(): void {
        // 查找挡板控制器
        const paddleNodes = this.node.scene.getComponentsInChildren('PaddleController');
        if (paddleNodes.length > 0) {
            this._paddleController = paddleNodes[0];
            console.log('✅ Found PaddleController for debug panel');
        } else {
            console.warn('❌ PaddleController not found for debug panel');
        }
        
        // 查找球组件
        const ballNodes = this.node.scene.getComponentsInChildren('Ball');
        if (ballNodes.length > 0) {
            this._ball = ballNodes[0];
            console.log('✅ Found Ball for debug panel');
        } else {
            console.warn('❌ Ball not found for debug panel');
        }
        
        // 如果组件还未找到，继续重试
        if (!this._paddleController || !this._ball) {
            this.scheduleOnce(() => {
                this._findGameComponentsActual();
            }, 1.0);
        }
    }
    
    protected onDestroy(): void {
        // 清理调试面板
        if (this._debugPanel && this._debugPanel.parentNode) {
            this._debugPanel.parentNode.removeChild(this._debugPanel);
            console.log('Debug panel cleaned up');
        }
    }
}