# 经验球预制体创建指南

## 问题诊断
经验球不掉落的原因：
1. GameManager中的 `experienceOrbPrefab` 属性为 null
2. 需要在编辑器中创建经验球预制体并绑定

---

## 创建经验球预制体步骤

### 步骤1: 创建经验球节点
```
操作:
1. 在 Hierarchy 中右键点击 Canvas
2. 选择 "创建" → "2D对象" → "Sprite"
3. 重命名为: ExperienceOrb
4. 设置 UITransform:
   - Width: 20
   - Height: 20
```

### 步骤2: 添加物理组件
```
操作:
1. 选中 ExperienceOrb 节点
2. 添加组件 → "Physics 2D" → "RigidBody2D"
3. 设置 RigidBody2D:
   - Type: Dynamic
   - Gravity Scale: 0.5 (缓慢下落)
   - Linear Damping: 0.2

4. 添加组件 → "Physics 2D" → "CircleCollider2D"
5. 设置 CircleCollider2D:
   - Radius: 10
   - Is Trigger: true (触发器模式)
   - Tag: 3000 (经验球标签)
```

### 步骤3: 设置视觉效果
```
操作:
1. 选中 ExperienceOrb 的 Sprite 组件
2. 设置颜色:
   - Color: #00FF00 (绿色) 或 #FFD700 (金色)
3. 可选: 添加简单动画
   - 添加组件 → "Animation" → "Animation"
   - 创建缓慢旋转或闪烁动画
```

### 步骤4: 挂载ExperienceOrb脚本
```
操作:
1. 选中 ExperienceOrb 节点
2. 添加组件 → "自定义脚本" → "ExperienceOrb"
3. 设置组件属性:
   - Fall Speed: 200
   - Experience Value: 10
   - Life Time: 8
   - Magnet Range: 150
```

### 步骤5: 保存为预制体
```
操作:
1. 选中 ExperienceOrb 节点
2. 拖拽到 assets/prefabs 文件夹
3. 创建预制体文件: ExperienceOrb.prefab
4. 删除场景中的原始节点
```

### 步骤6: 绑定到GameManager
```
操作:
1. 在 Hierarchy 中选择 GameManager 节点
2. 在 Inspector 中找到 GameManager 组件
3. 找到 Experience Orb Prefab 属性
4. 拖拽 ExperienceOrb.prefab 到这个属性槽
5. 保存场景 (Ctrl+S)
```

---

## 测试经验球掉落

### 测试步骤
1. 运行游戏
2. 击破砖块
3. 观察是否有经验球掉落（30%概率）
4. 经验砖块(绿色)应该100%掉落经验球

### 如果仍不掉落
1. 检查控制台是否有错误
2. 确认 experienceOrbPrefab 不为 null
3. 检查 EnhancedBrick 第311行的掉落逻辑
4. 临时修改概率到 1.0 进行测试

---

## 经验球行为说明

### 掉落机制
- **普通砖块**: 30%概率掉落
- **经验砖块**: 100%掉落
- **掉落位置**: 砖块原位置
- **初始速度**: 缓慢下落 (200 units/s)

### 磁力吸引
- **吸引范围**: 150像素
- **吸引目标**: 挡板或核心
- **吸引力**: 500 units/s

### 收集效果
- **经验值**: 10点（可配置）
- **生存时间**: 8秒后自动消失
- **收集反馈**: 闪光效果

---

## 代码检查清单

- [ ] ExperienceOrb.prefab 已创建
- [ ] GameManager.experienceOrbPrefab 已绑定
- [ ] ExperienceOrb 脚本已挂载
- [ ] 物理组件正确配置
- [ ] 碰撞检测工作正常
- [ ] 经验值正确添加到玩家

---

**注意**: 经验球需要与ExperienceManager配合工作，确保ExperienceManager已在场景中初始化。