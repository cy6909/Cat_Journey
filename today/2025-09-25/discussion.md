# 2025-09-25 技术决策讨论记录

**讨论重点**: P0阻塞问题的系统性解决和架构决策  
**参与**: 用户 + Claude Code (Linus Torvalds模式)  
**核心成果**: 物理系统完全修复，Ball正常弹跳系统建立  

## 🎯 重要技术决策

### 【品味评分】🟢 坐标系统一化决策
**决策**: 所有游戏对象统一添加到Canvas下，放弃GameManager作为父节点
**理由**: 
- GameManager位置偏移(-8.79, -58.25)导致累积坐标变换错误
- Ball实际位置计算异常(Y=-6372)，远超屏幕范围
- Canvas提供稳定的世界坐标系，避免层级变换问题

**技术实现**:
```typescript
// 修复前：混乱的层级结构
GameManager.addChild(ball);     // ❌ 导致坐标变换错误
GameManager.addChild(paddle);   // ❌ 位置计算复杂

// 修复后：统一坐标系
const canvas = this.node.parent;
canvas.addChild(ball);          // ✅ 直接世界坐标
canvas.addChild(paddle);        // ✅ 位置计算简单
canvas.addChild(walls);         // ✅ 边界位置精确
```

**影响**: 根本性解决了Ball位置异常问题，所有物理对象位置计算变得可预测。

### 【品味评分】🟢 分辨率方向修正决策
**决策**: 960x640(横屏) → 640x960(竖屏)
**理由**: 
- 微信小游戏标准是竖屏体验
- 用户反馈Ball在"横屏上弹跳"但显示为竖屏
- 物理边界计算完全基于错误的屏幕尺寸

**技术修改**:
```json
// project.json 和 settings/v2/packages/project.json
"designResolution": {
  "width": 640,   // 竖屏宽度
  "height": 960,  // 竖屏高度
  "fitHeight": true,
  "fitWidth": true
}
```

**边界重新计算**:
```typescript
// 横屏边界 (错误)
left: -480, right: +480, top: +320, bottom: -320

// 竖屏边界 (正确)  
left: -320, right: +320, top: +480, bottom: -480
```

### 【品味评分】🟢 时序控制架构决策
**决策**: Ball不在start()自动发射，改为GameManager延迟控制
**理由**:
- Ball.start()立即发射时，物理边界墙尚未完成初始化
- 导致Ball穿透未激活的碰撞体直接飞出屏幕
- 物理系统需要1-2帧时间完成组件激活

**技术实现**:
```typescript
// Ball.ts - 移除自动发射
protected start(): void {
    // this.launch();  // ❌ 移除立即发射
    console.log('Ball ready, waiting for launch command');
}

// GameManager.ts - 控制发射时机
private initializeGame(): void {
    this.createBoundaryWalls();  // 1. 创建边界
    this.createPaddle();         // 2. 创建拍子  
    this.createBall();           // 3. 创建球(不发射)
    this.setupLevel();           // 4. 创建砖块
    
    this.scheduleOnce(() => {    // 5. 延迟2秒
        this.launchBall();       // 6. 手动发射
        this.setState(GameState.PLAYING);
    }, 2.0);
}
```

### 【品味评分】🔴 放弃的技术方案
**放弃**: 直接修改BoxCollider2D.size属性控制墙壁尺寸
**原因**: "这种微操作破坏了组件封装"
- 导致Sprite显示异常，墙壁变成小方块
- setScale()方法更可靠，Cocos Creator优化更好
- 直接操作物理组件属性容易产生不可预测的副作用

**放弃方案**:
```typescript
// ❌ 直接修改collider尺寸 (失败)
const collider = wall.getComponent(BoxCollider2D);
collider.size.width = 50;
collider.size.height = 700;  // 导致显示异常

// ✅ 使用Node缩放 (成功)
wall.setScale(1, 10, 1);     // 简单可靠
```

## 🏗️ 架构演进和优化

### 物理系统边界设计
**最终架构**:
```typescript
// 边界墙规格 - 竖屏640x960适配
Left/Right Wall:  position(±325, 0), scale(1, 10, 1)  
Top/Bottom Wall:  position(0, ±485), scale(7, 1, 1)

// 碰撞组分配
Ball:     Group 2 (Dynamic)
Wall:     Group 1 (Static) 
Paddle:   Group 3 (Kinematic)
Brick:    Group 3 (Static)
DeathZone: Group 4 (Sensor)
```

### 调试可视化系统  
**颜色编码标准**:
- 🔴 左右墙: 红色 `Color(255, 0, 0, 128)`
- 🟢 上墙: 绿色 `Color(0, 255, 0, 128)` 
- 🔵 下墙: 蓝色 `Color(0, 0, 255, 128)`
- 半透明(alpha=128)便于观察Ball轨迹

**重要发现**: Cocos Creator Sprite组件必须先绑定SpriteFrame才能显示，仅设置color无效。

## 🚨 关键问题解决记录

### 问题1: Ball碰撞组不一致
**症状**: Ball RigidBody2D和CircleCollider2D在不同碰撞组
```typescript
// 问题诊断
RigidBody2D._group = 1      // Wall组
CircleCollider2D._group = 2  // Ball组  
// 结果：物理引擎不知道如何处理这种不一致性
```

**解决方案**: 统一Ball所有组件到Group 2
```typescript
// 修复后两个组件组设置一致
RigidBody2D._group = 2      // Ball组
CircleCollider2D._group = 2  // Ball组
// 结果：碰撞检测正常工作
```

### 问题2: 碰撞组配置不生效
**症状**: Cocos Creator编辑器中Group显示为空
**根因**: 碰撞组配置放错了文件位置

**解决过程**:
1. ❌ 配置在`project/project.json` - 编辑器不读取
2. ✅ 配置在`settings/v2/packages/project.json` - 编辑器读取生效

### 问题3: Wall可视化失效
**症状**: Wall有物理碰撞但不可见
**发现**: Sprite组件需要SpriteFrame，不能仅设置颜色
**解决**: 用户手动在编辑器中为Wall.prefab绑定SpriteFrame

## 📊 技术测试验证结果

### 物理系统验证 ✅
- **Ball发射**: 初始速度100，角度45°-135°向上
- **边界弹跳**: 完美弹性碰撞，无能量损失
- **坐标范围**: Ball在(-320,+320)x(-480,+480)内弹跳
- **时序稳定**: 2秒延迟确保物理系统完全激活

### 碰撞矩阵验证 ✅  
```
Ball(2) ↔ Wall(1): matrix[2][1] = true  ✅
Ball(2) ↔ Brick(3): matrix[2][3] = true ✅  
Ball(2) ↔ DeathZone(4): matrix[2][4] = true ✅
Wall(1) ↔ Wall(1): matrix[1][1] = true ✅
```

### 坐标系一致性验证 ✅
- Ball位置日志: `(-0.0000050862630303072365, -20.35882568359375)` ✅ 正常范围
- Wall位置计算: 精确贴合屏幕边界 ✅
- 无坐标变换累积误差 ✅

## 🎯 明日技术计划

### P1优先任务: 游戏功能完整性恢复
1. **取消Brick创建的注释** (5分钟)
2. **验证Ball-Paddle交互** (20分钟)  
3. **测试Ball-Brick碰撞销毁** (20分钟)

### P2优先任务: 25x25系统集成测试
1. **BallType枚举完整性检查** (30分钟)
2. **BrickType交互矩阵验证** (60分钟)
3. **单元测试覆盖率确认** (30分钟)

### 风险控制
- **保持25x25核心系统100%不动** - "Never break userspace"
- **所有测试通过后再进行任何核心逻辑修改**
- **优先修复表现层问题，避免触碰游戏机制**

---

**核心技术哲学**: "修复基础设施比重写游戏逻辑更有价值。今日完成的物理边界系统为25x25球砖交互提供了稳定的运行环境，没有破坏任何现有的游戏机制设计深度。"

**明日重点**: 在稳定的物理环境中恢复完整游戏体验，验证核心交互系统的设计价值。