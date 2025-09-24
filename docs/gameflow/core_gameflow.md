# 核心游戏开发工作流程 - Cat-Conquest Roguelike 弹球

## 概述
本文档提供使用 Cocos Creator 3.8.6 实现 Cat-Conquest Roguelike 弹球游戏的分步指南。每个组件、脚本和功能都有详细的实现说明。

## 前置要求
- 安装 Cocos Creator 3.8.6
- TypeScript 知识
- 微信小游戏开发者账户
- 2D 物理基础理解

## 项目设置阶段

### 1. 项目创建
```bash
1. 打开 Cocos Creator 3.8.6
2. 新建项目 → 2D 模板
3. 项目名称："Cat_Journey"
4. 位置：选择合适的目录
5. 选择 TypeScript 模板
6. 创建项目
```

### 2. 项目配置
1. 打开 `project.json` 并验证：
```json
{
  "type": "2d",
  "version": "3.8.6",
  "template": "typescript"
}
```

2. 配置平台设置：
```
构建 → 平台：微信小游戏
Bundle 标识符：com.yourcompany.catjourney
```

### 3. 文件夹结构设置
在 assets/ 中创建以下文件夹结构：
```
assets/
├── art/              # 视觉资源
│   ├── sprites/      # 精灵图像  
│   ├── textures/     # 背景纹理
│   ├── particles/    # 粒子效果
│   └── ui/          # UI 元素
├── prefabs/         # 可重用游戏对象
│   ├── gameplay/    # 核心游戏预制体
│   ├── ui/          # UI 预制体
│   └── effects/     # 效果预制体
├── resources/       # 运行时可加载资源
├── scenes/         # 游戏场景
└── scripts/        # TypeScript 代码
    ├── core/       # 核心系统
    ├── gameplay/   # 游戏机制
    ├── ui/         # UI 控制器
    └── managers/   # 游戏管理器
```

## 核心游戏玩法实现

### 阶段 1：基础游戏对象

#### 1.1 挡板实现

**步骤 1：创建挡板预制体**
1. 在层级管理器中右键 → 创建 → 2D 对象 → 精灵
2. 名称："Paddle"
3. 设置变换：
   - 位置：(0, -250, 0)
   - 缩放：(1, 1, 1)
4. 添加组件 → 物理2D → 刚体2D
   - 类型：KINEMATIC
   - 重力缩放：0
5. 添加组件 → 物理2D → 盒子碰撞器2D
   - 大小：设置为匹配精灵边界
   - 标签：3000（用于碰撞检测）

**步骤 2：添加挡板控制器脚本**
1. 创建新的 TypeScript 文件：`assets/scripts/gameplay/PaddleController.ts`
2. 复制 PaddleController.ts 实现
3. 将脚本添加到挡板预制体：
   - 在层级管理器中选择挡板
   - 添加组件 → 自定义脚本 → PaddleController
4. 配置属性：
   - 移动速度：300
   - 屏幕边界：根据游戏分辨率设置

**步骤 3：输入处理**
1. 在 PaddleController 脚本中实现触摸/鼠标输入：
```typescript
protected onLoad(): void {
    this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
}
```

**步骤 4：测试挡板移动**
1. 将挡板预制体拖入场景
2. 在模拟器中播放场景
3. 验证挡板随鼠标/触摸在屏幕边界内移动

#### 1.2 弹球实现

**步骤 1：创建弹球预制体**
1. 创建 → 2D 对象 → 精灵
2. 名称："Ball"
3. 将精灵设为圆形图像
4. 添加组件 → 物理2D → 刚体2D
   - 类型：DYNAMIC
   - 重力缩放：0（我们会使用自定义重力）
5. 添加组件 → 物理2D → 圆形碰撞器2D
   - 半径：匹配精灵大小
   - 标签：1000

**步骤 2：物理材质设置**
1. 创建物理材质：
   - 在资源管理器中右键 → 创建 → 物理材质2D
   - 名称："BallMaterial"
   - 恢复系数：1.0（完美弹跳）
   - 摩擦力：0.0（无摩擦）
2. 将材质应用到弹球的圆形碰撞器2D

**步骤 3：弹球脚本实现**
1. 创建 `assets/scripts/gameplay/Ball.ts`
2. 将脚本添加到弹球预制体
3. 配置初始发射参数：
   - 发射速度：400
   - 发射角度范围：45-135度

**步骤 4：弹球物理测试**
1. 将弹球添加到场景
2. 确保弹球完美弹跳墙壁和挡板
3. 验证速度保持恒定

#### 1.3 砖块实现

**步骤 1：创建基础砖块预制体**
1. 创建 → 2D 对象 → 精灵
2. 名称："Brick"
3. 位置：(0, 200, 0)
4. 添加组件 → 物理2D → 刚体2D
   - 类型：STATIC
5. 添加组件 → 物理2D → 盒子碰撞器2D
   - 标签：2000

**步骤 2：砖块脚本**
1. 创建 `assets/scripts/gameplay/Brick.ts`
2. 实现血量系统：
   - 基础血量：根据砖块类型1-5
   - 伤害处理
   - 销毁逻辑
3. 添加到砖块预制体

**步骤 3：砖块变体**
1. 为不同类型创建额外的砖块预制体：
   - NormalBrick（1次击中）
   - ReinforcedBrick（2次击中）
   - SpecialBrick（特殊效果）
2. 为每种类型使用不同的精灵颜色/纹理

### 阶段 2：增强游戏系统

#### 2.1 增强砖块系统集成

**步骤 1：替换基础砖块**
1. 更新现有砖块预制体以使用 `EnhancedBrick.ts`
2. 为每个预制体配置砖块类型枚举值：
```typescript
// 在预制体检查器中
砖块类型：NORMAL、REINFORCED、EXPLOSIVE等
```

**步骤 2：特殊效果设置**
1. 对于爆炸砖块：
   - 添加爆炸效果粒子系统
   - 在检查器中配置爆炸半径
2. 对于电击砖块：
   - 创建闪电粒子效果预制体
   - 设置链式反应参数

**步骤 3：砖块材质分配**
1. 创建不同的物理材质：
   - RubberMaterial（高弹性）
   - MetalMaterial（伤害反射）
   - IceMaterial（减速效果）

#### 2.2 增强弹球系统

**步骤 1：弹球类型配置**
1. 创建多个弹球预制体：
   - NormalBall
   - HeavyBall（更大、更慢）
   - LightBall（更小、更快）
   - FireBall（带粒子轨迹）
   - IceBall（带冰冻效果）

**步骤 2：弹球效果实现**
1. 为弹球预制体添加粒子系统：
   - 火球的火焰轨迹
   - 冰球的冰晶
   - 电球的电火花
2. 配置效果持续时间和强度

#### 2.3 增强挡板系统

**步骤 1：挡板耐久度视觉**
1. 为挡板添加血量条UI：
   - 创建带进度条的UI预制体
   - 位置在挡板上方
   - 根据血量更新颜色（绿→黄→红）

**步骤 2：挡板升级视觉**
1. 创建升级效果：
   - 升级粒子爆发
   - 大小增加动画
   - 不同等级的颜色变化
2. 添加经验收集动画

## 物理系统配置

### 碰撞矩阵设置
1. 打开项目设置 → 物理2D
2. 配置碰撞矩阵：
```
组1000（球）碰撞：
- 组2000（砖块）✓
- 组3000（挡板）✓  
- 组4000（墙壁）✓
- 组5000（Boss）✓

组2000（砖块）碰撞：
- 组1000（球）✓
- 组6000（激光）✓

组3000（挡板）碰撞：
- 组1000（球）✓
- 组7000（经验）✓
```

### 重力配置
1. 设置世界重力：(0, -320)
2. 个别对象可以使用重力缩放覆盖

### 物理调试
1. 启用物理调试绘制：
```typescript
// 在 GameManager 中
protected onLoad(): void {
    if (CC_DEBUG) {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    }
}
```

## 游戏管理器集成

### 场景结构设置
1. 创建主游戏场景："GameScene"
2. 层级结构：
```
Canvas（UI层）
├── GameUI
│   ├── HealthBar
│   ├── ScoreDisplay
│   ├── PauseButton
│   └── PowerUpIcons
└── GameLayer（游戏对象）
    ├── GameManager（空节点）
    ├── Walls
    │   ├── LeftWall
    │   ├── RightWall
    │   ├── TopWall
    │   └── DeathZone（底部）
    ├── BrickContainer（空节点）
    ├── PaddleContainer（空节点）
    └── BallContainer（空节点）
```

### GameManager 脚本配置
1. 将 GameManager.ts 添加到 GameManager 节点
2. 在检查器中配置预制体引用：
   - 弹球预制体：链接到弹球预制体
   - 砖块预制体：链接到增强砖块预制体
   - 挡板预制体：链接到增强挡板预制体
   - 能力道具预制体：链接所有能力道具预制体

### 关卡生成设置
1. 将 ProceduralLevelGenerator.ts 添加到 GameManager
2. 配置关卡参数：
   - 行数：5-8
   - 列数：8-12
   - 砖块间距：80x40
   - 特殊砖块比率：0.2-0.4

## Boss 系统实现

### Boss 预制体创建
1. 为每个Boss类型创建boss预制体：
   - GuardianWallBoss
   - StormCallerBoss
   - BrickSpawnerBoss
   - 等等

2. 每个boss预制体结构：
```
BossNode
├── Sprite（Boss外观）
├── RigidBody2D（KINEMATIC）
├── BoxCollider2D（标签：5000）
├── EnhancedBossController（脚本）
├── HealthBar（UI）
└── Effects（粒子系统）
```

### Boss 行为配置
1. 在 EnhancedBossController 检查器中：
   - Boss类型：从下拉菜单选择
   - 最大血量：根据章节100-300
   - 攻击力：10-25
   - 移动速度：100-200
   - 章节：1-3

### Boss 攻击模式
1. 创建攻击预制体：
   - BossProjectile
   - LightningStrike
   - GravityField
2. 为每个boss类型配置攻击时机和模式

## 能力道具系统

### 能力道具预制体创建
1. 为每个能力道具创建预制体：
   - MultiBallPowerUp
   - LaserPaddlePowerUp
   - ShieldPowerUp
   - 等等

2. 能力道具结构：
```
PowerUpNode
├── Sprite（能力道具图标）
├── RigidBody2D（DYNAMIC）
├── BoxCollider2D（isTrigger：true）
├── PowerUp Script
└── CollectionEffect（粒子）
```

### 能力道具掉落系统
1. 在 EnhancedBrick 中配置掉落率：
   - 普通砖块：10%掉落几率
   - 特殊砖块：25%掉落几率
   - 精英关卡砖块：40%掉落几率

## UI 系统实现

### 游戏UI设置
1. 创建UI预制体：
   - HealthBar：显示挡板/核心血量
   - ScoreDisplay：当前分数和最高分
   - PowerUpHUD：激活的能力道具指示器
   - PauseMenu：暂停游戏控制
   - GameOverScreen：游戏结束选项

### HUD 配置
1. 血量条实现：
```typescript
// 更新血量条填充
healthBar.fillRange = currentHealth / maxHealth;
healthBar.color = currentHealth > 50 ? Color.GREEN : Color.RED;
```

2. 分数显示：
```typescript
// 更新分数文本
scoreLabel.string = `分数：${currentScore}`;
highScoreLabel.string = `最佳：${highScore}`;
```

## 地图系统实现

### 地图场景创建
1. 为关卡选择创建"MapScene"
2. 将 MapManager.ts 添加到场景
3. 配置地图参数：
   - 每层节点数：4
   - 每章层数：15
   - 节点间距：150
   - 章节主题：森林、山脉、深渊

### 节点预制体设置
1. 创建 MapNode 预制体：
```
MapNode
├── Background（精灵）
├── Icon（精灵 - 节点类型指示器）
├── Label（节点名称）
├── Button（点击处理）
└── ConnectionLines（线条渲染器）
```

### 地图生成
1. 生成3个章节，每章15层
2. 用分支路径连接节点
3. 实现节点选择和进度

## 测试和验证

### 物理测试
1. 弹球弹跳一致性
2. 碰撞检测精度
3. 多对象性能

### 游戏玩法测试
1. 关卡进度难度
2. 能力道具效果
3. Boss战平衡

### UI测试
1. 触摸输入响应性
2. UI在不同设备上的缩放
3. 菜单导航流程

## 性能优化

### 对象池
1. 为频繁创建的对象实现池：
   - 弹球（最多10个活动）
   - 抛射物（最多20个活动）
   - 粒子效果（最多15个活动）

### 内存管理
1. 正确的资源清理
2. 纹理压缩设置
3. 音频压缩和加载

### 渲染优化
1. 批处理相似精灵
2. 最小化绘制调用
3. 使用适当的纹理格式

## 构建和部署准备

### 微信小游戏设置
1. 为微信配置 manifest.json
2. 设置正确的资源加载
3. 实现微信API集成

### 测试框架
1. 在微信开发者工具上测试
2. 在不同手机上进行设备测试
3. 性能分析

本工作流程为实现核心游戏玩法提供了基础。继续使用专门的货币化、音频和部署系统工作流程。