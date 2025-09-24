System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, Color, Sprite, Label, Button, UITransform, Graphics, tween, Camera, view, Widget, MapManager, NodeType, ChapterTheme, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, MapIconType, SlayTheSpireMapVisualizer;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMapManager(extras) {
    _reporterNs.report("MapManager", "../managers/MapManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNodeType(extras) {
    _reporterNs.report("NodeType", "../managers/MapManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfChapterTheme(extras) {
    _reporterNs.report("ChapterTheme", "../managers/MapManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      Label = _cc.Label;
      Button = _cc.Button;
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
      tween = _cc.tween;
      Camera = _cc.Camera;
      view = _cc.view;
      Widget = _cc.Widget;
    }, function (_unresolved_2) {
      MapManager = _unresolved_2.MapManager;
      NodeType = _unresolved_2.NodeType;
      ChapterTheme = _unresolved_2.ChapterTheme;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c59b2ZOk39MNaq2/X+9AhE3", "SlayTheSpireMapVisualizer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Prefab', 'instantiate', 'Color', 'Sprite', 'Label', 'Button', 'UITransform', 'Vec2', 'Graphics', 'tween', 'Camera', 'view', 'Widget']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MapIconType", MapIconType = /*#__PURE__*/function (MapIconType) {
        MapIconType["COMBAT"] = "combat";
        MapIconType["ELITE"] = "elite";
        MapIconType["BOSS"] = "boss";
        MapIconType["SHOP"] = "shop";
        MapIconType["TREASURE"] = "treasure";
        MapIconType["CAMPFIRE"] = "campfire";
        MapIconType["EVENT"] = "event";
        MapIconType["MYSTERY"] = "mystery";
        return MapIconType;
      }({}));

      _export("SlayTheSpireMapVisualizer", SlayTheSpireMapVisualizer = (_dec = ccclass('SlayTheSpireMapVisualizer'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: Camera
      }), _dec(_class = (_class2 = class SlayTheSpireMapVisualizer extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "currentChapter", _descriptor, this);

          _initializerDefineProperty(this, "enableAnimations", _descriptor2, this);

          _initializerDefineProperty(this, "enableParticleEffects", _descriptor3, this);

          _initializerDefineProperty(this, "mapScrollEnabled", _descriptor4, this);

          _initializerDefineProperty(this, "mapContainer", _descriptor5, this);

          _initializerDefineProperty(this, "pathContainer", _descriptor6, this);

          _initializerDefineProperty(this, "nodeContainer", _descriptor7, this);

          _initializerDefineProperty(this, "effectsContainer", _descriptor8, this);

          _initializerDefineProperty(this, "mapCamera", _descriptor9, this);

          this.visualNodes = new Map();
          this.pathLines = new Map();
          this.chapterConfigs = new Map();
          this.currentPlayerPosition = '';
          this.mapManager = null;
        }

        onLoad() {
          this.initializeChapterConfigurations();
          this.setupMapContainers();
          this.findMapManager();
        }

        initializeChapterConfigurations() {
          // 森林主题配置
          this.chapterConfigs.set((_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
            error: Error()
          }), ChapterTheme) : ChapterTheme).FOREST, {
            backgroundColor: new Color(20, 60, 30, 255),
            pathColor: new Color(139, 69, 19, 255),
            // 土路色
            availableNodeColor: new Color(255, 255, 255, 255),
            visitedNodeColor: new Color(150, 150, 150, 180),
            currentNodeColor: new Color(255, 215, 0, 255),
            // 金色
            lockedNodeColor: new Color(80, 80, 80, 120),
            particleEffects: ['leaves', 'fireflies', 'pollen'],
            ambientAnimations: ['tree_sway', 'fog_drift']
          }); // 雪山主题配置  

          this.chapterConfigs.set((_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
            error: Error()
          }), ChapterTheme) : ChapterTheme).MOUNTAIN, {
            backgroundColor: new Color(30, 50, 80, 255),
            pathColor: new Color(200, 200, 255, 255),
            // 雪路色
            availableNodeColor: new Color(255, 255, 255, 255),
            visitedNodeColor: new Color(150, 150, 200, 180),
            currentNodeColor: new Color(100, 200, 255, 255),
            // 冰蓝色
            lockedNodeColor: new Color(60, 60, 100, 120),
            particleEffects: ['snow', 'aurora', 'ice_crystals'],
            ambientAnimations: ['aurora_dance', 'snow_drift']
          }); // 深渊主题配置

          this.chapterConfigs.set((_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
            error: Error()
          }), ChapterTheme) : ChapterTheme).ABYSS, {
            backgroundColor: new Color(50, 20, 60, 255),
            pathColor: new Color(150, 50, 150, 255),
            // 紫色能量路径
            availableNodeColor: new Color(255, 255, 255, 255),
            visitedNodeColor: new Color(120, 80, 120, 180),
            currentNodeColor: new Color(255, 100, 255, 255),
            // 紫红色
            lockedNodeColor: new Color(60, 40, 60, 120),
            particleEffects: ['energy_sparks', 'void_rifts', 'plasma_flows'],
            ambientAnimations: ['energy_pulse', 'void_distortion']
          });
        }

        setupMapContainers() {
          if (!this.mapContainer) {
            this.mapContainer = new Node('MapContainer');
            this.mapContainer.setParent(this.node); // 添加Widget适配全屏

            const widget = this.mapContainer.addComponent(Widget);
            widget.isAlignLeft = widget.isAlignRight = true;
            widget.isAlignTop = widget.isAlignBottom = true;
            widget.left = widget.right = widget.top = widget.bottom = 0;
            widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
          } // 创建分层容器


          this.pathContainer = this.createContainer('PathContainer', -50);
          this.nodeContainer = this.createContainer('NodeContainer', 0);
          this.effectsContainer = this.createContainer('EffectsContainer', 50); // 设置滚动支持

          if (this.mapScrollEnabled) {
            this.setupMapScrolling();
          }
        }

        createContainer(name, zIndex) {
          const container = new Node(name);
          container.setParent(this.mapContainer);
          container.setPosition(0, 0, zIndex);
          const transform = container.addComponent(UITransform);
          const screenSize = view.getVisibleSize();
          transform.setContentSize(screenSize.width * 2, screenSize.height * 3); // 可滚动的大地图

          transform.setAnchorPoint(0.5, 0.5);
          return container;
        }

        setupMapScrolling() {
          // 实现地图滚动逻辑
          // 这里可以添加触摸/鼠标拖拽支持
          this.node.on(Node.EventType.TOUCH_START, this.onMapTouchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.onMapTouchMove, this);
          this.node.on(Node.EventType.TOUCH_END, this.onMapTouchEnd, this);
        }

        onMapTouchStart(event) {// 记录初始触摸位置
        }

        onMapTouchMove(event) {
          // 实现地图拖拽
          if (this.mapContainer) {
            const deltaMove = event.getDelta();
            const currentPos = this.mapContainer.getPosition();
            this.mapContainer.setPosition(currentPos.x + deltaMove.x, currentPos.y + deltaMove.y, currentPos.z);
          }
        }

        onMapTouchEnd(event) {// 地图拖拽结束处理
        }

        findMapManager() {
          this.mapManager = this.getComponent(_crd && MapManager === void 0 ? (_reportPossibleCrUseOfMapManager({
            error: Error()
          }), MapManager) : MapManager) || this.node.getComponent(_crd && MapManager === void 0 ? (_reportPossibleCrUseOfMapManager({
            error: Error()
          }), MapManager) : MapManager);

          if (!this.mapManager) {
            console.warn('SlayTheSpireMapVisualizer: MapManager not found');
          }
        }

        generateVisualMap(chapter) {
          this.currentChapter = chapter;
          this.clearCurrentMap();

          if (!this.mapManager) {
            console.error('MapManager not available for visual map generation');
            return;
          } // 获取地图数据


          const mapData = this.mapManager.generateChapterMap(chapter);
          const theme = this.getChapterTheme(chapter); // 设置章节主题

          this.applyChapterTheme(theme); // 创建可视化节点

          this.createVisualNodes(mapData); // 创建连接路径

          this.createConnectionPaths(); // 添加动画效果

          if (this.enableAnimations) {
            this.startAmbientAnimations(theme);
          } // 添加粒子效果


          if (this.enableParticleEffects) {
            this.createParticleEffects(theme);
          }

          console.log(`Visual map generated for Chapter ${chapter} (${theme})`);
        }

        clearCurrentMap() {
          this.visualNodes.clear();
          this.pathLines.clear();

          if (this.nodeContainer) {
            this.nodeContainer.removeAllChildren();
          }

          if (this.pathContainer) {
            this.pathContainer.removeAllChildren();
          }

          if (this.effectsContainer) {
            this.effectsContainer.removeAllChildren();
          }
        }

        getChapterTheme(chapter) {
          switch (chapter) {
            case 1:
              return (_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
                error: Error()
              }), ChapterTheme) : ChapterTheme).FOREST;

            case 2:
              return (_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
                error: Error()
              }), ChapterTheme) : ChapterTheme).MOUNTAIN;

            case 3:
              return (_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
                error: Error()
              }), ChapterTheme) : ChapterTheme).ABYSS;

            default:
              return (_crd && ChapterTheme === void 0 ? (_reportPossibleCrUseOfChapterTheme({
                error: Error()
              }), ChapterTheme) : ChapterTheme).FOREST;
          }
        }

        applyChapterTheme(theme) {
          const config = this.chapterConfigs.get(theme);
          if (!config) return; // 应用背景色

          this.createThemedBackground(config.backgroundColor);
          console.log(`Applied theme: ${theme}`);
        }

        createThemedBackground(backgroundColor) {
          const bgNode = new Node('ThemedBackground');
          bgNode.setParent(this.mapContainer);
          bgNode.setSiblingIndex(0); // 置于最底层

          const bgTransform = bgNode.addComponent(UITransform);
          const screenSize = view.getVisibleSize();
          bgTransform.setContentSize(screenSize.width * 2, screenSize.height * 3);
          bgTransform.setAnchorPoint(0.5, 0.5);
          const bgSprite = bgNode.addComponent(Sprite);
          const bgTexture = this.createSolidColorTexture(backgroundColor);
          bgSprite.spriteFrame = bgTexture;
          bgSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        createSolidColorTexture(color) {
          // 这里应该创建纯色纹理
          // 实际实现中需要使用Cocos Creator的纹理创建API
          return null; // 占位符
        }

        createVisualNodes(mapData) {
          // 根据MapManager生成的数据创建可视化节点
          const floors = 15; // 每章15层

          const nodesPerFloor = 4; // 每层最多4个节点

          for (let floor = 0; floor < floors; floor++) {
            this.createFloorNodes(floor, nodesPerFloor);
          }
        }

        createFloorNodes(floor, nodeCount) {
          const floorY = -floor * 100; // 每层间距100像素

          const startX = -(nodeCount - 1) * 120 / 2; // 节点水平分布

          for (let i = 0; i < nodeCount; i++) {
            const nodeX = startX + i * 120;
            const nodePos = new Vec3(nodeX, floorY, 0); // 确定节点类型

            const nodeType = this.determineNodeType(floor, i); // 创建视觉节点

            const visualNode = this.createSingleVisualNode(`node_${floor}_${i}`, nodeType, nodePos, this.currentChapter, floor);
            this.visualNodes.set(visualNode.id, visualNode);
          }
        }

        determineNodeType(floor, index) {
          // 第0层必须是START
          if (floor === 0) return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
            error: Error()
          }), NodeType) : NodeType).START; // 最后一层必须是BOSS

          if (floor === 14) return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
            error: Error()
          }), NodeType) : NodeType).BOSS; // 根据层数和随机性确定节点类型

          const rand = Math.random();

          if (floor % 5 === 4) {
            // 每5层有一个精英
            return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).ELITE;
          } else if (rand < 0.7) {
            return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).COMBAT;
          } else if (rand < 0.8) {
            return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).SHOP;
          } else if (rand < 0.9) {
            return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).CAMPFIRE;
          } else {
            return (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).TREASURE;
          }
        }

        createSingleVisualNode(id, type, position, chapter, floor) {
          const nodeUI = new Node(`MapNode_${id}`);
          nodeUI.setParent(this.nodeContainer);
          nodeUI.setPosition(position); // 添加UITransform

          const transform = nodeUI.addComponent(UITransform);
          transform.setContentSize(60, 60);
          transform.setAnchorPoint(0.5, 0.5); // 创建节点图标

          const iconSprite = this.createNodeIcon(nodeUI, type); // 添加按钮功能

          const button = nodeUI.addComponent(Button);
          button.target = nodeUI; // 绑定点击事件

          button.node.on(Button.EventType.CLICK, () => {
            this.onNodeClicked(id);
          }, this); // 添加节点标签

          this.createNodeLabel(nodeUI, type);
          return {
            id,
            type,
            position,
            uiNode: nodeUI,
            iconSprite,
            connections: [],
            isVisited: false,
            isAvailable: floor === 0,
            // 只有第一层可用
            isCurrentPosition: false,
            chapter,
            floor
          };
        }

        createNodeIcon(parentNode, type) {
          const iconNode = new Node('Icon');
          iconNode.setParent(parentNode);
          const iconTransform = iconNode.addComponent(UITransform);
          iconTransform.setContentSize(40, 40);
          iconTransform.setAnchorPoint(0.5, 0.5);
          const sprite = iconNode.addComponent(Sprite); // 根据节点类型设置图标

          const iconColor = this.getNodeTypeColor(type);
          this.setNodeIconAppearance(sprite, type, iconColor);
          return sprite;
        }

        getNodeTypeColor(type) {
          switch (type) {
            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).COMBAT:
              return new Color(255, 100, 100, 255);
            // 红色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).ELITE:
              return new Color(255, 200, 0, 255);
            // 金色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).BOSS:
              return new Color(150, 0, 255, 255);
            // 紫色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).SHOP:
              return new Color(0, 200, 255, 255);
            // 蓝色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).TREASURE:
              return new Color(255, 215, 0, 255);
            // 金宝箱色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).CAMPFIRE:
              return new Color(255, 150, 0, 255);
            // 橙色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).EVENT:
              return new Color(0, 255, 150, 255);
            // 绿色

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).MYSTERY:
              return new Color(200, 0, 200, 255);
            // 紫红色

            default:
              return new Color(255, 255, 255, 255);
          }
        }

        setNodeIconAppearance(sprite, type, color) {
          // 这里应该设置具体的图标纹理
          // 暂时使用颜色区分
          sprite.color = color;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        createNodeLabel(parentNode, type) {
          const labelNode = new Node('Label');
          labelNode.setParent(parentNode);
          labelNode.setPosition(0, -40, 0);
          const labelTransform = labelNode.addComponent(UITransform);
          labelTransform.setContentSize(80, 20);
          labelTransform.setAnchorPoint(0.5, 0.5);
          const label = labelNode.addComponent(Label);
          label.string = this.getNodeTypeDisplayName(type);
          label.fontSize = 12;
          label.color = new Color(255, 255, 255, 255);
        }

        getNodeTypeDisplayName(type) {
          switch (type) {
            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).COMBAT:
              return '战斗';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).ELITE:
              return '精英';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).BOSS:
              return 'Boss';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).SHOP:
              return '商店';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).TREASURE:
              return '宝藏';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).CAMPFIRE:
              return '篝火';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).EVENT:
              return '事件';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).MYSTERY:
              return '神秘';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).START:
              return '开始';

            case (_crd && NodeType === void 0 ? (_reportPossibleCrUseOfNodeType({
              error: Error()
            }), NodeType) : NodeType).END:
              return '结束';

            default:
              return '未知';
          }
        }

        createConnectionPaths() {
          // 创建节点间的连接路径
          this.visualNodes.forEach((node, nodeId) => {
            node.connections.forEach(connectionId => {
              const targetNode = this.visualNodes.get(connectionId);

              if (targetNode) {
                this.createPathLine(node, targetNode);
              }
            });
          });
        }

        createPathLine(fromNode, toNode) {
          const pathNode = new Node(`Path_${fromNode.id}_to_${toNode.id}`);
          pathNode.setParent(this.pathContainer);
          const graphics = pathNode.addComponent(Graphics); // 获取主题配置

          const theme = this.getChapterTheme(this.currentChapter);
          const config = this.chapterConfigs.get(theme);
          const pathColor = (config == null ? void 0 : config.pathColor) || new Color(200, 200, 200, 255); // 绘制路径线条

          graphics.strokeColor = pathColor;
          graphics.lineWidth = 4;
          graphics.moveTo(fromNode.position.x, fromNode.position.y);
          graphics.lineTo(toNode.position.x, toNode.position.y);
          graphics.stroke();
          this.pathLines.set(`${fromNode.id}_${toNode.id}`, pathNode);
        }

        startAmbientAnimations(theme) {
          const config = this.chapterConfigs.get(theme);
          if (!config) return; // 启动环境动画

          config.ambientAnimations.forEach(animType => {
            this.createAmbientAnimation(animType);
          });
        }

        createAmbientAnimation(animType) {
          switch (animType) {
            case 'tree_sway':
              this.createTreeSwayAnimation();
              break;

            case 'fog_drift':
              this.createFogDriftAnimation();
              break;

            case 'aurora_dance':
              this.createAuroraDanceAnimation();
              break;

            case 'snow_drift':
              this.createSnowDriftAnimation();
              break;

            case 'energy_pulse':
              this.createEnergyPulseAnimation();
              break;

            case 'void_distortion':
              this.createVoidDistortionAnimation();
              break;
          }
        }

        createTreeSwayAnimation() {
          // 森林主题：树木摇摆动画
          console.log('Creating tree sway animation');
        }

        createFogDriftAnimation() {
          // 森林主题：雾气飘动动画
          console.log('Creating fog drift animation');
        }

        createAuroraDanceAnimation() {
          // 雪山主题：极光舞动动画
          console.log('Creating aurora dance animation');
        }

        createSnowDriftAnimation() {
          // 雪山主题：雪花飘落动画
          console.log('Creating snow drift animation');
        }

        createEnergyPulseAnimation() {
          // 深渊主题：能量脉冲动画
          console.log('Creating energy pulse animation');
        }

        createVoidDistortionAnimation() {
          // 深渊主题：虚空扭曲动画
          console.log('Creating void distortion animation');
        }

        createParticleEffects(theme) {
          const config = this.chapterConfigs.get(theme);
          if (!config) return; // 创建粒子效果

          config.particleEffects.forEach(effectType => {
            this.createParticleEffect(effectType);
          });
        }

        createParticleEffect(effectType) {
          const effectNode = new Node(`ParticleEffect_${effectType}`);
          effectNode.setParent(this.effectsContainer); // 这里应该添加粒子系统组件
          // 暂时用日志记录

          console.log(`Creating particle effect: ${effectType}`);
        }

        onNodeClicked(nodeId) {
          const node = this.visualNodes.get(nodeId);
          if (!node) return;
          console.log(`Node clicked: ${nodeId} (${node.type})`);

          if (!node.isAvailable) {
            console.log('Node is not available');
            return;
          } // 更新当前位置


          this.setCurrentPlayerPosition(nodeId); // 开始关卡切换过渡

          this.startLevelTransition(node);
        }

        setCurrentPlayerPosition(nodeId) {
          // 清除旧的当前位置
          if (this.currentPlayerPosition) {
            const oldNode = this.visualNodes.get(this.currentPlayerPosition);

            if (oldNode) {
              oldNode.isCurrentPosition = false;
              this.updateNodeVisuals(oldNode);
            }
          } // 设置新的当前位置


          const newNode = this.visualNodes.get(nodeId);

          if (newNode) {
            newNode.isCurrentPosition = true;
            newNode.isVisited = true;
            this.updateNodeVisuals(newNode); // 解锁连接的节点

            this.unlockConnectedNodes(newNode);
          }

          this.currentPlayerPosition = nodeId;
        }

        updateNodeVisuals(node) {
          const theme = this.getChapterTheme(this.currentChapter);
          const config = this.chapterConfigs.get(theme);
          if (!config) return;
          let targetColor;

          if (node.isCurrentPosition) {
            targetColor = config.currentNodeColor;
          } else if (node.isVisited) {
            targetColor = config.visitedNodeColor;
          } else if (node.isAvailable) {
            targetColor = config.availableNodeColor;
          } else {
            targetColor = config.lockedNodeColor;
          } // 应用颜色变化动画


          if (this.enableAnimations) {
            tween(node.iconSprite).to(0.3, {
              color: targetColor
            }).start();
          } else {
            node.iconSprite.color = targetColor;
          }
        }

        unlockConnectedNodes(node) {
          node.connections.forEach(connectionId => {
            const connectedNode = this.visualNodes.get(connectionId);

            if (connectedNode && !connectedNode.isAvailable) {
              connectedNode.isAvailable = true;
              this.updateNodeVisuals(connectedNode); // 播放解锁动画

              if (this.enableAnimations) {
                this.playNodeUnlockAnimation(connectedNode);
              }
            }
          });
        }

        playNodeUnlockAnimation(node) {
          // 解锁动画：闪光效果
          tween(node.uiNode).to(0.2, {
            scale: new Vec3(1.2, 1.2, 1)
          }).to(0.2, {
            scale: new Vec3(1.0, 1.0, 1)
          }).start();
        }

        startLevelTransition(node) {
          console.log(`Starting transition to ${node.type} level`); // 这里可以触发场景切换或关卡加载
          // 触发MapManager的关卡加载逻辑

          if (this.mapManager) {// this.mapManager.loadLevel(node.id);
          } // 可以在这里添加过场动画


          this.playTransitionAnimation(node);
        }

        playTransitionAnimation(node) {
          // 过场动画：地图淡出，准备切换到游戏场景
          if (this.mapContainer && this.enableAnimations) {
            tween(this.mapContainer).to(0.5, {
              position: new Vec3(0, 0, 0),
              scale: new Vec3(0.8, 0.8, 1)
            }).call(() => {
              console.log('Transition animation completed'); // 这里可以触发实际的场景切换
            }).start();
          }
        } // 公共接口方法


        getCurrentPlayerPosition() {
          return this.currentPlayerPosition;
        }

        getVisibleNodes() {
          return Array.from(this.visualNodes.values()).filter(node => node.isAvailable || node.isVisited);
        }

        centerMapOnCurrentNode() {
          if (!this.currentPlayerPosition || !this.mapContainer) return;
          const currentNode = this.visualNodes.get(this.currentPlayerPosition);
          if (!currentNode) return; // 将地图中心移动到当前节点

          const targetPos = new Vec3(-currentNode.position.x, -currentNode.position.y, 0);

          if (this.enableAnimations) {
            tween(this.mapContainer).to(0.8, {
              position: targetPos
            }).start();
          } else {
            this.mapContainer.setPosition(targetPos);
          }
        }

        resetMap() {
          this.clearCurrentMap();
          this.currentPlayerPosition = '';
        }

        saveMapProgress() {
          // 保存地图进度数据
          const saveData = {
            currentChapter: this.currentChapter,
            currentPosition: this.currentPlayerPosition,
            visitedNodes: Array.from(this.visualNodes.values()).filter(node => node.isVisited).map(node => node.id),
            availableNodes: Array.from(this.visualNodes.values()).filter(node => node.isAvailable).map(node => node.id)
          };
          return saveData;
        }

        loadMapProgress(saveData) {
          // 加载地图进度数据
          if (saveData.currentChapter) {
            this.generateVisualMap(saveData.currentChapter);
          }

          if (saveData.currentPosition) {
            this.setCurrentPlayerPosition(saveData.currentPosition);
          }

          if (saveData.visitedNodes) {
            saveData.visitedNodes.forEach(nodeId => {
              const node = this.visualNodes.get(nodeId);

              if (node) {
                node.isVisited = true;
                this.updateNodeVisuals(node);
              }
            });
          }

          if (saveData.availableNodes) {
            saveData.availableNodes.forEach(nodeId => {
              const node = this.visualNodes.get(nodeId);

              if (node) {
                node.isAvailable = true;
                this.updateNodeVisuals(node);
              }
            });
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "currentChapter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableAnimations", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enableParticleEffects", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "mapScrollEnabled", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "mapContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "pathContainer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "nodeContainer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "effectsContainer", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "mapCamera", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=963bc8d4c1243438fbb97b0ce8a047a10df8b8bb.js.map