# 杀戮尖塔风格地图美术资源生成指南

## 概述

本指南详细说明如何为Cat-Conquest游戏生成杀戮尖塔风格的地图美术资源，包括节点图标、路径效果、主题化背景和特效元素。

## 一、地图节点图标设计

### 1.1 基础节点类型及图标需求

| 节点类型 | 图标描述 | 尺寸规格 | 设计要点 |
|---------|----------|----------|----------|
| **普通战斗** | 交叉剑刃图标 | 64x64px | 简洁明了，红色调，表现战斗感 |
| **精英战斗** | 带皇冠的剑盾 | 64x64px | 金色边框，威严感，比普通战斗更华丽 |
| **Boss战** | 恶魔头颅/龙头 | 64x64px | 暗红紫色，恐怖威胁感，发光效果 |
| **商店** | 钱袋/天平 | 64x64px | 蓝色调，商业感，金币装饰 |
| **宝藏** | 宝箱 | 64x64px | 金色，闪亮感，珠宝装饰 |
| **篝火** | 燃烧的火堆 | 64x64px | 橙红色，温暖感，火焰动效 |
| **事件** | 问号/书卷 | 64x64px | 神秘绿色，未知感，魔法光晕 |
| **神秘** | 水晶球/符文 | 64x64px | 紫色，神秘感，能量波动 |

### 1.2 ComfyUI生成提示词

#### 普通战斗节点图标
```
Prompt: "Medieval crossed swords icon, simple clean design, red metallic color, 64x64 pixel art style, game UI element, no background, transparent PNG, flat design with subtle shadow"

Negative: "complex details, realistic textures, 3D effects, blurred edges"

样式参数:
- Style: Pixel Art / Game Icon
- Color Palette: Red (#CC0000), Dark Red (#800000), Silver (#C0C0C0)
- Resolution: 512x512 (后续缩放到64x64)
```

#### 精英战斗节点图标
```
Prompt: "Golden crown above shield and sword, elite warrior emblem, luxurious golden color, 64x64 pixel art, game icon, ornate design, royal symbol, transparent background"

Negative: "plain design, dull colors, modern elements"

样式参数:
- Style: Pixel Art / Heraldic Design
- Color Palette: Gold (#FFD700), Dark Gold (#B8860B), Royal Blue (#4169E1)
```

#### Boss战节点图标
```
Prompt: "Menacing dragon head icon, glowing red eyes, dark purple and red colors, intimidating boss symbol, 64x64 pixel art, game UI, evil aura, transparent background"

Negative: "cute design, bright colors, friendly appearance"

样式参数:
- Style: Dark Fantasy Pixel Art
- Color Palette: Dark Purple (#4B0082), Crimson (#DC143C), Black (#000000)
```

### 1.3 节点状态变化设计

每个节点需要4种状态的视觉变体：

1. **锁定状态** - 灰色调，50%透明度，暗淡无光
2. **可用状态** - 正常颜色，100%不透明，清晰可见
3. **当前位置** - 金色发光边框，脉动动画，突出显示
4. **已访问状态** - 颜色降低饱和度，80%透明度，已完成标记

### 1.4 节点边框和装饰元素

- **基础边框**: 圆形或八角形，2px宽度
- **发光效果**: 外发光，模糊半径8px
- **脉动动画**: 缩放范围0.9-1.1倍，周期2秒
- **完成标记**: 绿色对勾，叠加在右上角

## 二、路径连接线设计

### 2.1 主题化路径样式

#### 森林主题路径
```
ComfyUI Prompt: "Natural dirt path texture, brown earth color, organic curved lines, forest theme, top-down view, seamless tileable texture, 32 pixel width"

设计特点:
- 颜色: 土褐色 (#8B4513)
- 纹理: 土路质感，带细小石子
- 边缘: 不规则自然边缘
- 装饰: 偶尔的小草和花朵点缀
```

#### 雪山主题路径
```
ComfyUI Prompt: "Snow-covered mountain path, white and light blue colors, icy texture, frozen trail, winter theme, crystalline details, 32 pixel width"

设计特点:
- 颜色: 雪白色 (#FFFAFA) 到冰蓝色 (#B0E0E6)
- 纹理: 雪花和冰晶纹理
- 边缘: 柔和渐变边缘
- 装饰: 冰晶装饰，寒霜效果
```

#### 深渊主题路径
```
ComfyUI Prompt: "Mystical energy pathway, purple and magenta glowing trail, void theme, ethereal connection, cosmic energy stream, 32 pixel width"

设计特点:
- 颜色: 紫色 (#800080) 到洋红色 (#FF00FF)
- 纹理: 能量流动效果
- 边缘: 发光边缘，能量波动
- 装饰: 能量火花，虚空裂痕
```

### 2.2 路径动画效果

#### 能量流动动画
- **粒子方向**: 从起始节点流向目标节点
- **速度**: 每秒移动路径长度的1/3
- **颜色**: 根据主题调整
- **大小**: 2-4像素的光点

#### 脉冲效果
- **周期**: 每3秒一次脉冲
- **强度**: 路径亮度增加50%
- **传播**: 从玩家当前位置向外扩散

## 三、章节主题背景设计

### 3.1 森林章节背景

#### 主背景层
```
ComfyUI Prompt: "Dense mystical forest background, ancient trees silhouette, dark green to light green gradient, magical atmosphere, side-view perspective, no characters, atmospheric lighting"

技术规格:
- 尺寸: 1920x1080 (适配不同屏幕)
- 格式: PNG with transparency
- 分层: 远景、中景、近景3层视差
- 颜色: #1B5E20 (深绿) → #81C784 (浅绿)
```

#### 装饰元素
- **远景树木**: 暗色剪影，层次感
- **中景细节**: 树干纹理，苔藓
- **近景装饰**: 树叶，藤蔓，花朵
- **动态元素**: 飘落的叶子，闪烁的萤火虫

### 3.2 雪山章节背景

#### 主背景层
```
ComfyUI Prompt: "Majestic snow-capped mountains, aurora borealis in sky, cold blue atmosphere, winter landscape, no characters, ethereal lighting, crystalline details"

技术规格:
- 尺寸: 1920x1080
- 格式: PNG with transparency
- 色调: 冷蓝色为主 (#1565C0 → #E3F2FD)
- 特效: 极光效果，雪花粒子
```

#### 装饰元素
- **山峰轮廓**: 锯齿状雪山剪影
- **天空效果**: 极光带，星空
- **地面装饰**: 雪堆，冰柱，霜花
- **动态元素**: 飘落雪花，极光舞动

### 3.3 深渊章节背景

#### 主背景层
```
ComfyUI Prompt: "Void realm background, purple and magenta cosmos, floating energy crystals, otherworldly atmosphere, no characters, mystical energy effects"

技术规格:
- 尺寸: 1920x1080
- 格式: PNG with transparency
- 色调: 深紫色为主 (#4A148C → #E1BEE7)
- 特效: 能量波动，虚空裂痕
```

#### 装饰元素
- **虚空结构**: 漂浮的平台，能量柱
- **能量效果**: 等离子流，电弧
- **神秘装饰**: 符文，水晶，传送门
- **动态元素**: 能量脉冲，空间扭曲

## 四、UI界面元素设计

### 4.1 地图面板框架

#### 主面板背景
```
ComfyUI Prompt: "Fantasy game UI panel, ornate border design, medieval style, semi-transparent background, decorative corners, no text"

设计规格:
- 尺寸: 1200x800px
- 边框: 装饰性金属边框
- 背景: 半透明暗色 (rgba(0,0,0,0.7))
- 装饰: 角落装饰图案，主题化元素
```

#### 主题化装饰
- **森林主题**: 藤蔓边框，树叶装饰
- **雪山主题**: 冰晶边框，雪花装饰
- **深渊主题**: 能量边框，符文装饰

### 4.2 信息显示面板

#### 节点详情面板
```
尺寸: 400x300px
内容:
- 节点类型图标 (64x64px)
- 节点名称文字区域
- 描述文本区域
- 奖励预览区域
- 确认/取消按钮区域
```

#### 章节进度指示器
```
尺寸: 800x60px
内容:
- 章节标题区域
- 进度条背景
- 当前进度填充
- 里程碑标记点
```

### 4.3 按钮和交互元素

#### 标准按钮设计
```
ComfyUI Prompt: "Fantasy game button, stone texture, medieval style, 3 states: normal/hover/pressed, golden highlights, no text"

规格:
- 尺寸: 120x40px, 160x50px, 200x60px (三种规格)
- 状态: 普通、悬停、按下三种状态
- 材质: 石质纹理，金属边框
- 颜色: 灰色基调，金色高光
```

## 五、特效和粒子元素

### 5.1 环境粒子效果

#### 森林萤火虫
```
粒子属性:
- 纹理: 小光点，黄绿色
- 数量: 15-25个
- 移动: 随机飘浮路径
- 闪烁: 2-4秒周期
- 生命周期: 持续存在
```

#### 雪山雪花
```
粒子属性:
- 纹理: 六角雪花形状
- 数量: 50-80个
- 移动: 垂直下降，轻微摆动
- 速度: 缓慢飘落
- 生命周期: 循环重生
```

#### 深渊能量火花
```
粒子属性:
- 纹理: 能量光球
- 数量: 20-30个
- 移动: 不规则能量跳跃
- 颜色: 紫色到洋红色渐变
- 生命周期: 随机闪现
```

### 5.2 交互特效

#### 节点选择特效
- **发光环**: 从节点中心向外扩散的光环
- **脉冲波**: 规律性的能量脉冲
- **粒子爆发**: 选择时的粒子炸开效果

#### 路径激活特效
- **能量流**: 沿路径移动的能量流
- **光路追踪**: 逐段亮起的路径效果
- **连接确认**: 两端节点的同步闪光

## 六、AI工具生成工作流

### 6.1 ComfyUI工作流配置

#### 基础节点配置
```
Workflow Steps:
1. Load Checkpoint (模型选择): 
   - 推荐: "pixel_art_xl_v1.5" 或 "fantasy_game_ui_v2.0"
   
2. Positive Prompt (正面描述):
   - 详细的设计需求描述
   - 风格和色彩要求
   - 技术规格要求

3. Negative Prompt (负面描述):
   - 排除不需要的元素
   - 避免的风格和效果

4. Sampler Settings (采样设置):
   - Sampler: DPM++ 2M Karras
   - Steps: 25-30
   - CFG Scale: 7-9

5. Image Settings (图像设置):
   - Width: 512-1024
   - Height: 512-1024
   - Batch Size: 4 (生成多个候选)
```

#### 批量生成工作流
```
For Each Node Type:
1. 设置基础参数
2. 添加LoRA增强 (如果需要特定风格)
3. 使用XY Plot生成多种变体
4. 应用后处理 (锐化、颜色调整)
5. 导出多种格式 (PNG, SVG)
```

### 6.2 后处理工作流

#### 使用Photoshop/GIMP
1. **尺寸标准化**: 批量调整到标准尺寸
2. **背景移除**: 制作透明背景版本
3. **状态变体**: 生成不同状态的颜色版本
4. **优化导出**: 针对游戏引擎优化文件大小

#### 使用TexturePacker
1. **图集打包**: 将所有图标打包成图集
2. **格式优化**: 选择最适合的压缩格式
3. **多分辨率**: 生成@1x, @2x, @3x版本
4. **元数据导出**: 生成Cocos Creator可用的配置文件

### 6.3 资源管理建议

#### 文件夹结构
```
art_assets/
├── map_icons/
│   ├── combat/
│   ├── elite/
│   ├── boss/
│   ├── shop/
│   └── ...
├── backgrounds/
│   ├── forest/
│   ├── mountain/
│   └── abyss/
├── ui_elements/
│   ├── panels/
│   ├── buttons/
│   └── decorations/
├── effects/
│   ├── particles/
│   ├── animations/
│   └── transitions/
└── atlases/
    ├── map_icons.json
    ├── ui_elements.json
    └── effects.json
```

#### 命名规范
```
节点图标: map_icon_[type]_[state].png
例如: map_icon_combat_normal.png, map_icon_boss_locked.png

背景: bg_[chapter]_[layer].png
例如: bg_forest_far.png, bg_mountain_near.png

UI元素: ui_[type]_[variant].png
例如: ui_button_normal.png, ui_panel_decorated.png
```

## 七、集成到Cocos Creator

### 7.1 资源导入步骤

1. **创建资源文件夹结构**
```
assets/art/
├── map/
│   ├── icons/
│   ├── backgrounds/
│   └── effects/
└── ui/
    ├── panels/
    └── buttons/
```

2. **导入图片资源**
   - 拖拽PNG文件到对应文件夹
   - 设置图片类型为Sprite Frame
   - 配置Filter Mode为Point (像素艺术)

3. **创建图集资源**
   - 选择多个图标文件
   - 右键选择"创建图集"
   - 配置图集大小和压缩格式

### 7.2 脚本绑定配置

#### 在SlayTheSpireMapVisualizer中配置资源引用
```typescript
@property({type: [SpriteFrame]})
public nodeIcons: SpriteFrame[] = [];

@property({type: [SpriteFrame]})
public backgroundLayers: SpriteFrame[] = [];

@property({type: [Prefab]})
public particleEffects: Prefab[] = [];
```

#### 动态加载资源
```typescript
private loadNodeIcon(nodeType: NodeType, state: string): SpriteFrame {
    const iconName = `map_icon_${nodeType}_${state}`;
    return resources.load(iconName, SpriteFrame);
}
```

### 7.3 性能优化建议

1. **图集优化**
   - 将相关图标打包到同一图集
   - 使用合适的图集大小 (512x512 或 1024x1024)
   - 启用图集压缩

2. **内存管理**
   - 按章节分别加载背景资源
   - 及时释放不需要的资源
   - 使用对象池管理粒子效果

3. **渲染优化**
   - 合理设置渲染层级
   - 避免频繁的动态批次切换
   - 使用静态批次合并相似元素

## 八、质量检查清单

### 8.1 视觉质量检查

- [ ] 所有图标在64x64尺寸下清晰可见
- [ ] 颜色搭配符合章节主题
- [ ] 透明背景正确处理
- [ ] 不同状态变体一致性良好
- [ ] 动画效果流畅自然

### 8.2 技术规格检查

- [ ] 文件格式正确 (PNG for sprites, JSON for atlases)
- [ ] 命名规范统一
- [ ] 文件大小在合理范围内
- [ ] 图集打包无错误
- [ ] 在不同分辨率设备上显示正常

### 8.3 游戏集成检查

- [ ] 资源正确导入到Cocos Creator
- [ ] 脚本绑定无错误
- [ ] 运行时加载正常
- [ ] 内存使用在预期范围内
- [ ] 没有渲染性能问题

通过遵循本指南，可以创建出专业水准的杀戮尖塔风格地图美术资源，为游戏提供优秀的视觉体验。