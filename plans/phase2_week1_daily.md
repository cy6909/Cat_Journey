# Phase 2 每日执行计划 - Week 1

**开始日期**: 2025-10-15
**目标**: 实现地图系统和遗物扩展
**每日时间**: 2-3小时

---

## Day 1 (2025-10-15) - 地图数据结构

### 上午任务 (1.5h)
```typescript
// 1. 创建基础文件
assets/scripts/gameplay/map/MapNode.ts
assets/scripts/gameplay/map/MapGenerator.ts
assets/scripts/gameplay/map/MapSystem.ts

// 2. 定义核心接口
interface IMapNode {
    id: number;
    type: NodeType;
    level: number;  // 第几层 1-15
    position: Vec2;
    connections: number[];  // 连接的节点ID
    status: 'locked' | 'available' | 'completed';
}

// 3. 实现节点类型枚举
enum NodeType {
    NORMAL = 0,      // 普通关卡 +1难度
    ELITE = 1,       // 精英关卡 +5难度
    BOSS = 2,        // Boss关卡 +10难度
    SHOP = 3,        // 商店 (Phase3实现)
    EVENT = 4,       // 随机事件 (Phase3实现)
    REST = 5         // 休息点，回复耐久
}
```

### 下午任务 (1h)
- 实现MapNode类
- 创建节点工厂方法
- 编写单元测试

### 验收标准
- [ ] MapNode类可实例化
- [ ] 节点类型正确分配
- [ ] position计算正确

---

## Day 2 (2025-10-16) - 地图生成算法

### 核心算法
```typescript
class MapGenerator {
    // Linus式简洁生成
    generate(seed?: number): MapNode[] {
        const nodes: MapNode[] = [];
        const layers = 15;

        // Layer 0: 起始点 (3个选择)
        // Layer 1-4: 普通关卡
        // Layer 5: 精英关卡层
        // Layer 6-9: 混合层
        // Layer 10: 精英关卡层
        // Layer 11-14: 高难混合
        // Layer 15: Boss

        return nodes;
    }

    // 连接生成 - 避免交叉
    private connectNodes(nodes: MapNode[]): void {
        // 每个节点连接下一层的1-3个节点
        // 确保所有路径最终汇聚到Boss
    }
}
```

### 任务清单
- [ ] 实现15层节点生成
- [ ] 实现连接算法
- [ ] 难度递增验证
- [ ] 精英后难度回调机制

---

## Day 3 (2025-10-17) - 地图UI基础

### UI结构
```
Canvas/
├── MapScrollView (竖屏滚动)
│   └── MapContainer (15层高度)
│       ├── NodeLayer_0 (底部起点)
│       ├── NodeLayer_1
│       └── ... NodeLayer_15 (顶部Boss)
```

### 任务清单
- [ ] 创建MapUI.ts组件
- [ ] 实现ScrollView配置
- [ ] 节点精灵创建 (圆形)
- [ ] 不同类型不同颜色

### 颜色方案
```typescript
const NODE_COLORS = {
    NORMAL: Color.WHITE,
    ELITE: Color.YELLOW,
    BOSS: Color.RED,
    REST: Color.GREEN,
    SHOP: Color.BLUE,
    EVENT: Color.PURPLE
};
```

---

## Day 4 (2025-10-18) - 连线渲染

### Graphics绘制
```typescript
class MapRenderer {
    drawConnections(nodes: MapNode[]): void {
        const graphics = this.getComponent(Graphics);
        graphics.clear();

        for (const node of nodes) {
            for (const targetId of node.connections) {
                this.drawLine(node, this.getNodeById(targetId));
            }
        }
    }

    private drawLine(from: MapNode, to: MapNode): void {
        // 贝塞尔曲线连接
        graphics.moveTo(from.position.x, from.position.y);
        graphics.quadraticCurveTo(...);
        graphics.stroke();
    }
}
```

### 任务清单
- [ ] Graphics组件配置
- [ ] 连线绘制算法
- [ ] 曲线优化(避免重叠)
- [ ] 路径高亮效果

---

## Day 5 (2025-10-19) - 地图交互

### 交互逻辑
```typescript
class MapInteraction {
    onNodeClick(node: MapNode): void {
        if (node.status !== 'available') return;

        // 1. 记录选择
        this.selectedPath.push(node.id);

        // 2. 标记完成
        node.status = 'completed';

        // 3. 解锁下一层
        this.unlockNextNodes(node);

        // 4. 进入关卡
        this.enterLevel(node);
    }
}
```

### 任务清单
- [ ] 节点点击事件
- [ ] 状态管理
- [ ] 路径记录
- [ ] 场景切换集成

---

## Day 6-7 (2025-10-20~21) - 遗物扩展第一批

### Day 6: 攻击型遗物 (5种)
```typescript
// 1. HEAVY_BALL - 重球
effect: {
    weight: 2.0,
    damage: 1.5,
    speed: 0.8
}

// 2. SPLIT_SHOT - 分裂弹
onBrickHit: () => {
    const miniball1 = instantiate(this.miniballPrefab);
    const miniball2 = instantiate(this.miniballPrefab);
    // 45度角分裂
}

// 3. PIERCING - 穿透
effect: {
    penetration: 3,  // 可穿透3个砖块
    damageReduction: 0.9  // 每次穿透伤害递减
}

// 4. ACCELERATE - 加速球
onBounce: () => {
    this.velocity *= 1.02;  // 每次弹射+2%速度
    this.damage *= 1.01;     // 伤害也略微提升
}

// 5. AREA_DAMAGE - 范围伤害
onBrickDestroy: (pos) => {
    const nearby = this.getBricksInRadius(pos, 100);
    nearby.forEach(brick => brick.takeDamage(this.damage * 0.5));
}
```

### Day 7: 防御型遗物 (5种)
```typescript
// 1. SHIELD_PADDLE - 护盾挡板
effect: {
    damageReduction: 0.8,  // 受到伤害-20%
    visual: "蓝色光晕"
}

// 2. REGEN_PADDLE - 再生挡板
update: (dt) => {
    this.durability += dt * 1;  // 每秒回复1点
}

// 3. WIDER_PADDLE - 宽挡板
effect: {
    width: this.baseWidth * 1.3
}

// 4. STICKY_PADDLE - 粘性挡板
onBallContact: () => {
    this.holdBall = true;  // 可按空格重新发射
}

// 5. REFLECT_DAMAGE - 反伤
onDurabilityLoss: (damage) => {
    this.lastBrick?.takeDamage(damage * 0.2);
}
```

---

## 📝 每日检查清单

### 开发前 (5分钟)
- [ ] 查看昨日进度
- [ ] 确认今日目标
- [ ] 准备开发环境

### 开发中 (2-3小时)
- [ ] 专注当前任务
- [ ] 及时记录问题
- [ ] 保持代码简洁

### 开发后 (10分钟)
- [ ] 更新progress.md
- [ ] 提交代码
- [ ] 记录明日计划

---

## 🎯 Week 1 预期成果

### 可交付成果
1. **完整的地图系统**
   - 15层树状结构
   - 5种节点类型
   - 路径选择机制

2. **10种新遗物**
   - 5种攻击型
   - 5种防御型
   - 全部测试通过

### 技术指标
- [ ] 地图生成 < 100ms
- [ ] 节点渲染流畅 60fps
- [ ] 遗物效果无冲突
- [ ] 内存占用 < 150MB

### 体验指标
- [ ] 路径选择有意义
- [ ] 遗物效果明显
- [ ] 难度曲线合理
- [ ] 无卡顿和bug

---

## ⚠️ 风险预案

### 风险1: 地图生成算法复杂
**预案**: 先实现固定模板，后期再随机

### 风险2: 遗物平衡性
**预案**: 先实现效果，数值后期调整

### 风险3: UI性能问题
**预案**: 限制同屏节点数量，分层加载

---

## 🚀 立即行动

### Now (30分钟内)
1. 创建map文件夹
2. 写MapNode.ts
3. 提交第一个commit

### Today (3小时内)
1. 完成数据结构
2. 实现简单生成
3. 写单元测试

### Tomorrow
1. 优化生成算法
2. 开始UI开发
3. 集成到主流程

---

**座右铭**: "Good programmers worry about data structures and their relationships."

地图系统的核心是节点关系，而不是渲染。先把数据结构做对，UI自然水到渠成。