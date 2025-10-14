# Cat Journey Phase 2 开发计划 - Roguelike核心系统

**计划版本**: 2.0
**制定日期**: 2025-10-14
**目标周期**: 2-3周
**核心理念**: "简单的深度" - 用最简洁的实现创造最深的策略

---

## 🎯 Phase 2 核心目标

将当前的关卡型游戏转变为真正的Roguelike体验，核心在于：
1. **地图选择机制** - 树状路径，玩家有选择权
2. **遗物系统扩展** - 25种遗物创造Build多样性
3. **升级选择系统** - 每次升级都是策略决策
4. **精英/Boss设计** - 挑战与奖励的平衡

---

## 📊 当前项目状态快照

### ✅ 已完成系统 (45%)
- 核心系统: 25x25球砖交互 (95%)
- 经验系统: 完整实现 (100%)
- 布局系统: 10种布局模板 (100%)
- 难度系统: 自适应难度 (100%)
- 开发工具: DevTools完善 (100%)

### ❌ 待完成系统
- 精灵显示: 程序化生成 (0%)
- 地图系统: 未开始 (0%)
- 遗物扩展: 仅5种基础 (20%)
- 升级选择: 未实现 (0%)
- 音效系统: 未集成 (0%)

---

## 🗺️ 系统1: 竖屏卷轴地图系统

### 设计理念 (Linus式思考)
```
"这是个真问题吗？" - 是的，线性关卡让玩家没有选择权
"有更简单的方法吗？" - 树状结构，最简单的分支选择
"会破坏什么吗？" - 不会，增强而非替代现有系统
```

### 数据结构设计
```typescript
// 极简的节点定义 - 无特殊情况
interface MapNode {
    id: number;
    type: 'normal' | 'elite' | 'boss' | 'shop' | 'event';
    difficulty: number;  // 普通+1, 精英+5, Boss+10
    position: Vec2;      // 屏幕坐标
    children: number[];  // 下一步可选节点ID
}

// 地图生成器 - 纯函数，无副作用
class MapGenerator {
    // 3层缩进以内，符合Linus标准
    generateTree(depth: number = 15): MapNode[] {
        const nodes: MapNode[] = [];
        // 第1层: 3个起点
        // 第2-4层: 每层分叉2-3
        // 第5层: 精英关卡
        // 第6-9层: 混合
        // 第10层: 精英关卡
        // 第11-14层: 高难混合
        // 第15层: Boss
        return nodes;
    }
}
```

### 实现计划
**Day 1-2**: 数据结构与生成算法
- MapNode接口定义
- MapGenerator树生成
- 难度回调机制 (精英后-4)

**Day 3-4**: UI渲染
- ScrollView竖屏滚动
- 节点精灵 (圆形，不同颜色)
- 连线绘制 (Graphics API)

**Day 5**: 交互逻辑
- 点击选择下一节点
- 路径高亮显示
- 进度保存

---

## 🎁 系统2: 遗物系统扩展 (5→25种)

### 设计理念
```
核心判断: ✅ 值得做 - 遗物是Roguelike的灵魂
关键洞察:
- 数据结构: 遗物=被动效果，简单的属性修改器
- 复杂度: 避免遗物间复杂交互，保持独立
- 风险点: 平衡性，需要大量测试
```

### 遗物分类设计
```typescript
enum RelicCategory {
    OFFENSIVE,   // 攻击型 (5种)
    DEFENSIVE,   // 防御型 (5种)
    MECHANICAL,  // 机制型 (5种)
    SPECIAL      // 特殊型 (10种)
}

// 25种遗物定义 - 每个都是独立的简单效果
const RELIC_DEFINITIONS = {
    // 攻击型
    HEAVY_BALL: { weight: 2.0, damage: 1.5 },      // 球变重，伤害+50%
    SPLIT_SHOT: { onHit: () => spawnMiniBalls(2) }, // 撞击分裂
    PIERCING: { penetration: 3 },                   // 穿透3层
    ACCELERATE: { speedGain: 1.02 },               // 每次弹射+2%速度
    AREA_DAMAGE: { explosionRadius: 50 },          // 范围伤害

    // 防御型
    SHIELD_PADDLE: { damageReduction: 0.8 },       // 挡板受损-20%
    REGEN_PADDLE: { regenRate: 1 },                // 每秒回复1耐久
    WIDER_PADDLE: { widthMultiplier: 1.3 },        // 挡板宽度+30%
    STICKY_PADDLE: { catchBall: true },            // 可接住球
    REFLECT_DAMAGE: { returnDamage: 0.2 },         // 反弹20%伤害

    // 机制型
    MULTI_BALL: { startBalls: 2 },                 // 开局2球
    SLOW_TIME: { timeScale: 0.8 },                 // 时间减速20%
    MAGNET_BALL: { attraction: 100 },              // 球吸引掉落物
    COMBO_MASTER: { comboMultiplier: 2.0 },        // 连击加成x2
    LUCKY_DROP: { dropRate: 1.5 },                 // 掉落率+50%

    // 特殊型 (10种略，类似设计)
};
```

### 实现计划
**Day 6-8**: 遗物效果实现
- 每天实现8-9种遗物
- 为每种遗物创建独立的apply()方法
- 测试每种遗物的实际效果

**Day 9**: 遗物UI
- 遗物图标显示 (简单几何形状)
- 遗物描述面板
- 已获得遗物列表

---

## ⬆️ 系统3: 升级选择系统

### 设计理念
```
Linus式方案:
1. 数据结构极简: 升级=3选1
2. 无特殊情况: 每次升级流程相同
3. 清晰实现: 暂停→选择→应用→继续
```

### 升级选项设计
```typescript
interface UpgradeOption {
    type: 'stat' | 'relic' | 'heal';
    icon: string;        // 简单图标
    title: string;       // 一句话描述
    description: string; // 详细效果
    apply: () => void;   // 应用函数
}

class UpgradeManager {
    generateOptions(): UpgradeOption[] {
        // 永远返回3个选项
        const options: UpgradeOption[] = [];

        // 33%概率每种类型
        options.push(this.randomStat());    // 属性提升
        options.push(this.randomRelic());   // 获得遗物
        options.push(this.randomHeal());    // 回复生命

        return options;
    }

    // 示例选项
    private statOptions = [
        { title: "强化挡板", effect: () => paddle.durability *= 1.2 },
        { title: "球速降低", effect: () => ball.speed *= 0.9 },
        { title: "伤害提升", effect: () => ball.damage *= 1.1 },
        { title: "生命上限+1", effect: () => lives.max += 1 },
        { title: "暴击率+5%", effect: () => crit.rate += 0.05 }
    ];
}
```

### 实现计划
**Day 10-11**: 升级系统核心
- UpgradeManager单例
- 选项生成算法
- 选项应用逻辑

**Day 12**: 升级UI
- 3选1界面 (全屏遮罩)
- 选项卡片布局
- 选择动画效果

---

## ⚔️ 系统4: 挡板耐久度机制

### 设计理念
```
核心判断: ✅ 值得做 - 增加风险管理深度
实现方式: 挡板有耐久度，球速越快损耗越大
```

### 耐久度计算
```typescript
class PaddleDurability {
    maxDurability: number = 100;
    current: number = 100;

    // 简单线性关系
    takeDamage(ballSpeed: number): void {
        const damage = ballSpeed / 100;  // 速度300 = 3点伤害
        this.current = Math.max(0, this.current - damage);

        if (this.current <= 0) {
            this.breakPaddle();  // 挡板破碎，损失生命
        }
    }

    repair(amount: number): void {
        this.current = Math.min(this.maxDurability, this.current + amount);
    }
}
```

---

## 👹 系统5: 精英与Boss设计

### 精英关卡 (难度+5)
```typescript
const ELITE_MECHANICS = {
    MIRROR: "左右镜像复制球的轨迹",
    GRAVITY_WELL: "中心引力影响球的路径",
    TIME_DISTORTION: "随机加速/减速区域",
    SHIELD_GENERATOR: "定期为砖块生成护盾",
    BOMBARDMENT: "定期从上方投下砖块"
};
```

### Boss设计 (难度+10)
```typescript
const BOSS_PHASES = {
    PHASE_1: "常规攻击模式",
    PHASE_2: "50%血量后增加特殊机制",
    PHASE_3: "25%血量后狂暴模式"
};
```

---

## 📱 系统6: 微信平台基础适配

### 最小化实现
- 基础分享功能
- 简单排行榜
- 广告观看复活
- 不做复杂社交功能

---

## 📅 时间线规划

### Week 1: 核心系统 (7天)
| 日期 | 任务 | 预计时间 |
|-----|------|---------|
| Day 1-2 | 地图系统数据结构 | 4h |
| Day 3-4 | 地图UI渲染 | 4h |
| Day 5 | 地图交互逻辑 | 2h |
| Day 6-7 | 遗物扩展(前15种) | 4h |

### Week 2: 系统完善 (7天)
| 日期 | 任务 | 预计时间 |
|-----|------|---------|
| Day 8-9 | 遗物扩展(后10种) | 4h |
| Day 10-11 | 升级选择系统 | 4h |
| Day 12 | 升级UI | 2h |
| Day 13-14 | 挡板耐久+精英设计 | 4h |

### Week 3: 打磨优化 (7天)
| 日期 | 任务 | 预计时间 |
|-----|------|---------|
| Day 15-16 | Boss战设计 | 4h |
| Day 17-18 | 平衡性调整 | 4h |
| Day 19-20 | 微信平台适配 | 4h |
| Day 21 | 最终测试 | 2h |

---

## 🎮 游戏循环验证

### 核心循环 (30秒)
1. 选择地图节点 (5秒)
2. 进入关卡战斗 (20秒)
3. 获得奖励/升级 (5秒)

### 局内循环 (5-10分钟)
1. 从叶子节点开始
2. 经过3-5个普通关卡
3. 挑战1个精英关卡
4. 继续3-5个关卡
5. 挑战Boss

### 局外循环 (30分钟)
1. 完成一次完整运行
2. 解锁新遗物
3. 尝试新Build
4. 追求更高分数

---

## 💡 Linus式代码原则检查

### ✅ 符合原则
1. **数据结构简单**: MapNode、Relic、Upgrade都是简单结构
2. **无特殊情况**: 所有系统流程统一，无if/else地狱
3. **3层缩进内**: 所有函数设计控制在3层内
4. **实用主义**: 解决真实问题(选择权、多样性、策略深度)

### ⚠️ 风险控制
1. **不破坏现有系统**: 所有新系统都是增量添加
2. **性能可控**: 每个系统都有简化版本备选
3. **复杂度可控**: 分阶段实现，每阶段可独立验证

---

## 🚀 第一步行动计划

### 立即开始 (Day 1)
```typescript
// 1. 创建地图系统文件
assets/scripts/gameplay/MapSystem.ts
assets/scripts/gameplay/MapNode.ts
assets/scripts/gameplay/MapGenerator.ts

// 2. 定义基础数据结构
interface MapNode {
    id: number;
    type: NodeType;
    position: Vec2;
    children: number[];
}

// 3. 实现最简生成器
function generateSimpleTree(): MapNode[] {
    // 15层，每层1-3个节点
    // 返回60-80个节点的数组
}
```

---

## 📊 成功指标

### 技术指标
- [ ] 地图系统可生成15层树状结构
- [ ] 25种遗物全部实现并测试
- [ ] 升级选择UI流畅无卡顿
- [ ] 精英关卡有独特机制
- [ ] Boss有3阶段变化

### 体验指标
- [ ] 每次运行都有不同路径选择
- [ ] 遗物组合产生明显差异
- [ ] 升级选择有策略深度
- [ ] 精英关卡有挑战性但公平
- [ ] Boss战有史诗感

### 商业指标
- [ ] 单次游戏时长10-30分钟
- [ ] 重玩价值高(至少10次不同体验)
- [ ] 适合碎片时间游玩
- [ ] 有"再来一局"的冲动

---

## 🎯 最终愿景

一个**简单但深邃**的Roguelike打砖块游戏：
- **简单**: 点击选择路径，移动挡板接球
- **深邃**: 25x25交互系统 + 25种遗物 + 路径选择
- **爽快**: 每次撞击都有反馈，连击有成就感
- **策略**: 遗物Build + 路径规划 + 风险管理

**座右铭应用**:
> "Talk is cheap. Show me the code."

不空谈游戏设计理论，直接用代码实现核心循环。每个系统都是可运行、可测试、可迭代的代码。

---

**下一步**: 立即创建MapSystem.ts，开始实现地图生成器。