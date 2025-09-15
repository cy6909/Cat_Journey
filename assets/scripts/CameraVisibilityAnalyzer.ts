import { _decorator, Component, Camera, Layers } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraVisibilityAnalyzer')
export class CameraVisibilityAnalyzer extends Component {
    protected onLoad(): void {
        this.analyzeCameraVisibility();
    }
    
    private analyzeCameraVisibility(): void {
        // 从场景文件中看到的摄像机可见性值
        const cameraVisibility = 41943040;
        
        console.log('=== 摄像机渲染Layer分析 ===');
        console.log(`摄像机 Visibility 值: ${cameraVisibility}`);
        console.log(`二进制表示: ${cameraVisibility.toString(2)}`);
        
        // 常见Layer值分析
        const commonLayers = {
            'DEFAULT': 1,
            'UI_2D': 33554432,      // 这是Canvas默认Layer
            'UI_3D': 67108864,
            'SCENE_GIZMO': 1073741824,
            'EDITOR': 2147483648,
        };
        
        console.log('\n--- Layer匹配检测 ---');
        for (const [name, value] of Object.entries(commonLayers)) {
            const isVisible = (cameraVisibility & value) !== 0;
            console.log(`${name} (${value}): ${isVisible ? '✅ 可见' : '❌ 不可见'}`);
        }
        
        // BackgroundLayer使用的Layer 1分析
        const backgroundLayer = 1;
        const canRenderBackground = (cameraVisibility & backgroundLayer) !== 0;
        console.log(`\n--- 关键发现 ---`);
        console.log(`Background Layer (1): ${canRenderBackground ? '✅ 可以渲染' : '❌ 不能渲染'}`);
        
        // 建议的修复方法
        console.log('\n--- 修复建议 ---');
        console.log('1. 将Background节点Layer改为UI_2D (33554432)');
        console.log('2. 或者修改摄像机Visibility包含Layer 1');
        console.log(`   新Visibility值应该是: ${cameraVisibility | backgroundLayer}`);
    }
}