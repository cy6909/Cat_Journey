# Cocos Creator 编辑器操作步骤指南

**重要**: 以下所有操作都需要在Cocos Creator 3.x中进行
**场景文件**: testscene.scene

---

## 📋 操作前准备

1. **打开项目**
   - 启动Cocos Creator 3.x
   - 打开项目: `D:\project\claudecode\wx\Cat_Journey`
   - 双击打开场景: `assets/scenes/testscene.scene`

2. **确认层级管理器视图**
   - 左侧应该能看到 Hierarchy (层级管理器)
   - 确认有 Canvas 节点
   - 确认有 GameManager 节点

---

## 🎯 步骤一: 创建经验管理器节点

### 1.1 创建ExperienceManager节点
```
操作步骤:
1. 在 Hierarchy 中右键点击 Canvas
2. 选择 "创建" → "空节点"
3. 重命名为: ExperienceManager
4. 设置位置: Position (0, 0, 0)
```

### 1.2 添加ExperienceManager组件
```
操作步骤:
1. 选中 ExperienceManager 节点
2. 在右侧 Inspector 面板中点击 "添加组件"
3. 选择 "自定义脚本" → "ExperienceManager"
4. 如果找不到，尝试:
   - 点击 "添加组件" → "脚本" → 搜索 "Experience"
   - 或者直接拖拽 assets/scripts/managers/ExperienceManager.ts 到节点上
```

### 1.3 验证单例设置
```
检查项:
- ExperienceManager 组件已挂载
- 没有其他节点挂载了 ExperienceManager
- 保存场景 (Ctrl+S)
```

---

## 🎯 步骤二: 创建经验条UI

### 2.1 创建经验条容器
```
操作步骤:
1. 在 Hierarchy 中右键点击 Canvas
2. 选择 "创建" → "空节点"
3. 重命名为: ExperienceBar
4. 设置 UITransform:
   - Width: 600
   - Height: 40
   - Anchor: (0.5, 1) // 顶部中心
   - Position: (0, -20, 0) // 距离顶部20像素
```

### 2.2 创建进度条背景
```
操作步骤:
1. 右键点击 ExperienceBar 节点
2. 选择 "创建" → "2D对象" → "Sprite"
3. 重命名为: BarBackground
4. 设置 UITransform:
   - Width: 600
   - Height: 30
   - Position: (0, 0, 0)
5. 设置 Sprite 组件:
   - Color: #333333 (深灰色)
   - Type: Sliced
```

### 2.3 创建进度条填充
```
操作步骤:
1. 右键点击 ExperienceBar 节点
2. 选择 "创建" → "2D对象" → "Sprite"
3. 重命名为: BarFill
4. 设置 UITransform:
   - Width: 0 (初始为0，会通过代码控制)
   - Height: 26
   - Anchor: (0, 0.5) // 左侧对齐
   - Position: (-298, 0, 0) // 从左边开始
5. 设置 Sprite 组件:
   - Color: #00FF00 (绿色)
   - Type: Sliced
```

### 2.4 添加ProgressBar组件
```
操作步骤:
1. 选中 ExperienceBar 节点
2. 添加组件 → "UI" → "ProgressBar"
3. 设置 ProgressBar 组件属性:
   - Bar Sprite: 拖入 BarFill 节点
   - Mode: Horizontal
   - Total Length: 596 (比背景略小)
   - Progress: 0
```

### 2.5 创建等级标签
```
操作步骤:
1. 右键点击 ExperienceBar 节点
2. 选择 "创建" → "2D对象" → "Label"
3. 重命名为: LevelLabel
4. 设置 UITransform:
   - Width: 100
   - Height: 30
   - Position: (-350, 0, 0) // 左侧
5. 设置 Label 组件:
   - String: Lv.1
   - Font Size: 20
   - Color: #FFFFFF
   - Horizontal Align: Center
   - Vertical Align: Center
   - Overflow: None
```

### 2.6 创建经验值标签
```
操作步骤:
1. 右键点击 ExperienceBar 节点
2. 选择 "创建" → "2D对象" → "Label"
3. 重命名为: ExpLabel
4. 设置 UITransform:
   - Width: 200
   - Height: 30
   - Position: (0, 0, 0) // 中心
5. 设置 Label 组件:
   - String: 0/100
   - Font Size: 16
   - Color: #FFFFFF
   - Horizontal Align: Center
   - Vertical Align: Center
```

### 2.7 创建升级特效节点
```
操作步骤:
1. 右键点击 ExperienceBar 节点
2. 选择 "创建" → "2D对象" → "Label"
3. 重命名为: LevelUpEffect
4. 设置 UITransform:
   - Width: 200
   - Height: 50
   - Position: (0, 0, 0)
5. 设置 Label 组件:
   - String: LEVEL UP!
   - Font Size: 24
   - Color: #FFD700 (金色)
6. 设置节点 Active: false (默认隐藏)
```

### 2.8 挂载ExperienceBar脚本
```
操作步骤:
1. 选中 ExperienceBar 节点
2. 添加组件 → "自定义脚本" → "ExperienceBar"
3. 设置组件属性 (拖拽对应节点):
   - Progress Bar: ExperienceBar节点自身 (已有ProgressBar组件)
   - Level Label: LevelLabel 节点
   - Exp Label: ExpLabel 节点
   - Level Up Effect: LevelUpEffect 节点
```

---

## 🎯 步骤三: 验证DevTools功能

### 3.1 检查DevToolsPanel设置
```
操作步骤:
1. 在 Hierarchy 中找到 DevToolsPanel 节点
2. 确认已挂载 DevToolsUI 组件
3. 检查组件属性是否正确绑定:
   - Level Input: 应该指向 LevelInput 节点
   - Apply Button: 应该指向 ApplyButton 节点
   - Info Label: 应该指向 InfoLabel 节点
   - Panel Node: 应该指向 DevToolsPanel 自身
```

### 3.2 如果DevToolsUI未挂载
```
操作步骤:
1. 选中 DevToolsPanel 节点
2. 添加组件 → "自定义脚本" → "DevToolsUI"
3. 逐个拖拽子节点到对应属性:
   - 展开 DevToolsPanel 查看子节点
   - 找到 LevelInput (EditBox) → 拖到 Level Input 属性
   - 找到 ApplyButton (Button) → 拖到 Apply Button 属性
   - 找到 InfoLabel (Label) → 拖到 Info Label 属性
   - DevToolsPanel 自身 → 拖到 Panel Node 属性
```

---

## 🎯 步骤四: 测试布局系统

### 4.1 运行游戏测试
```
操作步骤:
1. 保存场景 (Ctrl+S)
2. 点击编辑器顶部的 "运行" 按钮 (▶)
3. 等待游戏启动
```

### 4.2 测试DevTools
```
测试步骤:
1. 按 F1 键 - 应该显示/隐藏 DevTools 面板
2. 在输入框输入 "1" → 点击应用 → 观察矩形布局
3. 输入 "5" → 点击应用 → 观察简单图案布局
4. 输入 "8" → 点击应用 → 观察复杂图案布局
5. 输入 "12" → 点击应用 → 观察防御型布局
6. 输入 "20" → 点击应用 → 观察混沌布局
```

### 4.3 验证布局递进感
```
检查要点:
- 1-3关: 应该看到规整的矩形网格
- 4-6关: 应该看到三角形、菱形或金字塔
- 7-9关: 应该看到螺旋、十字或六边形
- 10-15关: 应该看到堡垒、分层或棋盘格
- 16+关: 应该看到混合的复杂布局
```

---

## 🎯 步骤五: 验证经验系统

### 5.1 测试经验获取
```
测试步骤:
1. 开始游戏
2. 击破砖块 - 应该看到经验条增长
3. 观察不同砖块类型的经验值:
   - 普通砖块: 1点
   - 特殊砖块: 2-5点
```

### 5.2 测试升级效果
```
测试步骤:
1. 持续击破砖块直到升级
2. 观察升级时:
   - 等级标签更新 (Lv.1 → Lv.2)
   - 升级特效显示 (LEVEL UP! 文字)
   - 经验条重置
   - 挡板速度增加 (每级+2%)
```

### 5.3 测试关卡完成奖励
```
测试步骤:
1. 清空所有砖块完成关卡
2. 应该获得50点经验奖励
3. 观察经验条大幅增长
```

---

## 🚨 常见问题排查

### 问题1: 组件找不到
```
解决方案:
1. 确保TypeScript文件已保存
2. 在编辑器中点击 "项目" → "刷新资源"
3. 尝试重启编辑器
```

### 问题2: 节点属性无法拖拽
```
解决方案:
1. 确保目标节点有正确的组件类型
2. 检查节点是否在正确的父节点下
3. 尝试手动输入节点路径
```

### 问题3: 运行时报错
```
排查步骤:
1. 打开浏览器控制台 (F12)
2. 查看具体错误信息
3. 检查组件属性是否都已正确绑定
4. 确认所有必需的节点都存在
```

---

## ✅ 完成检查清单

- [ ] ExperienceManager 节点创建并挂载组件
- [ ] ExperienceBar UI 完整创建
- [ ] 所有Label和ProgressBar正确配置
- [ ] ExperienceBar 脚本属性全部绑定
- [ ] DevToolsUI 组件正确挂载和配置
- [ ] F1 快捷键可以切换DevTools
- [ ] 不同关卡显示不同布局类型
- [ ] 经验系统正常工作
- [ ] 升级特效正常显示
- [ ] 场景已保存

---

**注意事项**:
1. 每完成一个大步骤都要保存场景 (Ctrl+S)
2. 如果修改了脚本，可能需要刷新资源
3. 测试时注意查看控制台是否有错误
4. 确保所有节点的名称与脚本中引用的名称一致