# GameManager 架构分析与调用时序

**分析目标**: 理解GameManager的组件交互关系和初始化时序，为系统验证提供技术基础

## 🏗️ GameManager 核心架构

```mermaid
graph TD
    A[GameManager Singleton] --> B[初始化阶段]
    A --> C[游戏循环阶段]
    A --> D[状态管理阶段]
    
    B --> B1[onLoad]
    B --> B2[start]
    B1 --> B3[物理世界初始化]
    B1 --> B4[组件引用获取]
    B2 --> B5[创建游戏对象]
    
    B5 --> B6[createPaddle]
    B5 --> B7[延迟创建Ball]
    B5 --> B8[setupLevel砖块创建]
    
    C --> C1[update循环]
    C --> C2[物理碰撞处理]
    C --> C3[输入事件处理]
    
    D --> D1[GameState管理]
    D --> D2[分数系统]
    D --> D3[关卡推进]
```

## ⏱️ 详细初始化时序流程

```mermaid
sequenceDiagram
    participant GM as GameManager
    participant PW as PhysicsWorld
    participant P as Paddle
    participant B as Ball
    participant BR as Bricks
    participant RM as RelicManager
    
    Note over GM: === 初始化阶段 ===
    GM->>+PW: onLoad() - 物理世界初始化
    PW-->>-GM: 物理参数配置完成
    
    GM->>GM: start() - 开始游戏初始化
    
    Note over GM,P: === Paddle创建 (立即) ===
    GM->>+P: createPaddle() - 创建挡板
    P->>P: 设置Kinematic物理 + Y轴锁定
    P-->>-GM: Paddle创建完成，位置(-300Y)
    
    Note over GM,B: === Ball创建 (延迟0.1秒) ===
    GM->>GM: scheduleOnce(0.1s)
    GM->>+B: createBallBasedOnPaddle()
    B->>B: 基于Paddle位置计算初始位置
    B->>B: 设置Ball引用和跟随逻辑
    B-->>-GM: Ball创建完成(Paddle上方20px)
    
    Note over GM,BR: === Brick网格创建 ===
    GM->>+BR: setupLevel() -> createBricksFromLayout()
    BR->>BR: 创建12x6砖块网格(72个)
    BR->>BR: 分配25种BrickType和颜色
    BR-->>-GM: 砖块网格创建完成
    
    Note over GM,RM: === 系统管理器初始化 ===
    GM->>+RM: RelicManager初始化
    RM-->>-GM: Build系统准备就绪
    
    Note over GM: === 游戏准备就绪 ===
    GM->>GM: setState(PRE_START)
```

## 🔄 运行时调用关系

```mermaid
graph LR
    subgraph "每帧更新 (update)"
        A[GameManager.update] --> A1[状态检查]
        A1 --> A2[输入处理]
        A2 --> A3[物理更新]
        A3 --> A4[UI更新]
    end
    
    subgraph "物理碰撞事件"
        B[Ball碰撞检测] --> B1{碰撞对象判断}
        B1 -->|Paddle| B2[Paddle反弹逻辑]
        B1 -->|Brick| B3[Brick销毁逻辑]
        B1 -->|Wall| B4[Wall反弹]
        B1 -->|DeathZone| B5[Ball死亡重置]
        
        B3 --> B6[通知GameManager]
        B6 --> B7[分数更新]
        B6 --> B8[检查关卡完成]
        B6 --> B9[Build系统检查]
    end
    
    subgraph "状态转换"
        C[GameState] --> C1[PRE_START]
        C1 --> C2[PLAYING]
        C2 --> C3[LEVEL_COMPLETE]
        C2 --> C4[GAME_OVER]
        C3 --> C5[下一关卡]
        C4 --> C6[重新开始]
    end
```

## 🧩 组件依赖关系

```mermaid
graph TD
    subgraph "Core Components 核心组件"
        GM[GameManager]
        B[Ball/EnhancedBall]
        P[Paddle]
        BR[Brick/EnhancedBrick]
    end
    
    subgraph "Manager Components 管理组件"
        RM[RelicManager]
        LM[LevelManager]
        CC[CoreController]
    end
    
    subgraph "UI Components 界面组件"
        UI[UI系统]
        PP[PowerUp显示]
    end
    
    GM --> RM
    GM --> LM
    GM --> CC
    GM --> B
    GM --> P
    GM --> BR
    
    B --> GM
    BR --> GM
    BR --> RM
    
    RM --> UI
    GM --> PP
```

## 📊 关键数据流

```mermaid
flowchart TD
    subgraph "游戏数据流"
        A[用户输入] --> A1[PaddleController]
        A1 --> A2[Paddle位置更新]
        A2 --> A3[Ball跟随逻辑]
        
        B[Ball发射] --> B1[物理碰撞]
        B1 --> B2[Brick销毁]
        B2 --> B3[分数计算]
        B3 --> B4[Build检查]
        B4 --> B5[RelicManager状态更新]
        
        C[关卡数据] --> C1[砖块布局生成]
        C1 --> C2[BrickType分配]
        C2 --> C3[程序化颜色应用]
    end
```

## 🎯 核心技术特征

### 1. 初始化时序控制
- **延迟创建机制**: Paddle先创建 → 延迟0.1s → Ball基于Paddle位置创建
- **引用传递**: 避免节点查找，直接传递对象引用
- **防御性编程**: 每步都有null检查和错误处理

### 2. 物理约束机制  
- **多重保护**: Prefab配置 + 代码强制 + 位置锁定
- **Y轴锁定**: Paddle每帧强制恢复到固定Y位置
- **碰撞矩阵**: 9x9碰撞组精确控制交互关系

### 3. 25x25系统集成
- **枚举驱动**: BallType和BrickType枚举控制所有交互
- **程序化颜色**: 每种类型有独特的颜色标识
- **Build系统**: RelicManager追踪组合状态

## 🔍 潜在验证点

### P0 基础验证
1. **初始化顺序**: Paddle → Ball → Bricks 是否按预期执行
2. **Prefab引用**: 三个核心prefab是否正确分配到GameManager
3. **物理碰撞**: Ball-Paddle-Brick-Wall基础碰撞是否正常

### P1 系统验证  
1. **程序化颜色**: 25种Ball和25种Brick颜色是否正确显示
2. **Build识别**: RelicManager是否正确追踪玩家状态
3. **状态转换**: GameState是否在适当时机正确转换

### P2 性能验证
1. **帧率稳定**: 72个砖块同时存在时是否保持60fps
2. **内存使用**: 对象池和垃圾回收是否高效
3. **错误处理**: 异常情况下系统是否稳定降级

---

**架构总结**: GameManager采用单例模式作为核心协调器，通过精确的初始化时序和直接引用传递，确保25x25系统的稳定运行。关键在于物理约束的多重保护和程序化颜色的枚举驱动设计。