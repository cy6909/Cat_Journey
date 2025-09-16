System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Prefab, instantiate, Color, Sprite, Label, Button, UITransform, EliteType, BossType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, NodeType, ChapterTheme, MapManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEliteType(extras) {
    _reporterNs.report("EliteType", "./EliteAndHiddenBossManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBossType(extras) {
    _reporterNs.report("BossType", "../gameplay/EnhancedBossController", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Color = _cc.Color;
      Sprite = _cc.Sprite;
      Label = _cc.Label;
      Button = _cc.Button;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      EliteType = _unresolved_2.EliteType;
    }, function (_unresolved_3) {
      BossType = _unresolved_3.BossType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "04ad1dkDENAUoOuKjeeliwP", "MapManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Prefab', 'instantiate', 'Color', 'Sprite', 'Label', 'Button', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("NodeType", NodeType = /*#__PURE__*/function (NodeType) {
        NodeType["COMBAT"] = "combat";
        NodeType["ELITE"] = "elite";
        NodeType["BOSS"] = "boss";
        NodeType["HIDDEN_BOSS"] = "hidden_boss";
        NodeType["EVENT"] = "event";
        NodeType["SHOP"] = "shop";
        NodeType["TREASURE"] = "treasure";
        NodeType["CAMPFIRE"] = "campfire";
        NodeType["UPGRADE"] = "upgrade";
        NodeType["MYSTERY"] = "mystery";
        NodeType["START"] = "start";
        NodeType["END"] = "end";
        return NodeType;
      }({}));

      _export("ChapterTheme", ChapterTheme = /*#__PURE__*/function (ChapterTheme) {
        ChapterTheme["FOREST"] = "forest";
        ChapterTheme["MOUNTAIN"] = "mountain";
        ChapterTheme["ABYSS"] = "abyss";
        return ChapterTheme;
      }({}));

      _export("MapManager", MapManager = (_dec = ccclass('MapManager'), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Prefab
      }), _dec(_class = (_class2 = class MapManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "mapNodePrefab", _descriptor, this);

          _initializerDefineProperty(this, "connectionLinePrefab", _descriptor2, this);

          _initializerDefineProperty(this, "nodesPerFloor", _descriptor3, this);

          _initializerDefineProperty(this, "floorsPerChapter", _descriptor4, this);

          _initializerDefineProperty(this, "nodeSpacing", _descriptor5, this);

          _initializerDefineProperty(this, "floorSpacing", _descriptor6, this);

          // Map state
          this._currentChapter = 1;
          this._currentFloor = 0;
          this._currentNodeId = '';
          this._mapNodes = new Map();
          this._completedNodes = [];
          this._chapterTheme = ChapterTheme.FOREST;
          // Map generation parameters
          this._nodeTypeDistribution = new Map();
          this._chapterBossTypes = new Map();
          this._availableEliteTypes = [];
          // Visual elements
          this._nodeVisuals = new Map();
          this._connectionLines = [];
        }

        onLoad() {
          this.initializeNodeDistribution();
          this.initializeChapterBosses();
          this.loadMapProgress();
        }

        start() {
          this.generateChapterMap(1);
        }

        initializeNodeDistribution() {
          // Distribution for regular floors (not boss floors)
          this._nodeTypeDistribution.set(NodeType.COMBAT, 45); // 45% 普通战斗


          this._nodeTypeDistribution.set(NodeType.ELITE, 15); // 15% 精英战斗


          this._nodeTypeDistribution.set(NodeType.EVENT, 15); // 15% 随机事件


          this._nodeTypeDistribution.set(NodeType.SHOP, 8); // 8% 商店


          this._nodeTypeDistribution.set(NodeType.TREASURE, 7); // 7% 宝藏


          this._nodeTypeDistribution.set(NodeType.CAMPFIRE, 5); // 5% 篝火休息


          this._nodeTypeDistribution.set(NodeType.UPGRADE, 3); // 3% 升级台


          this._nodeTypeDistribution.set(NodeType.MYSTERY, 2); // 2% 神秘节点

        }

        initializeChapterBosses() {
          // Chapter 1 bosses
          this._chapterBossTypes.set(1, [(_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).GUARDIAN_WALL, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).STORM_CALLER, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).BRICK_SPAWNER]); // Chapter 2 bosses  


          this._chapterBossTypes.set(2, [(_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).GRAVITY_MASTER, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).TIME_MANIPULATOR, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).SHIELD_GENERATOR]); // Chapter 3 bosses


          this._chapterBossTypes.set(3, [(_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).MULTI_PHASE, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).TELEPORTER, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).ELEMENTAL_CHAOS, (_crd && BossType === void 0 ? (_reportPossibleCrUseOfBossType({
            error: Error()
          }), BossType) : BossType).MIRROR_BOSS]); // Initialize available elite types


          this._availableEliteTypes = [(_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).BRICK_FORTRESS, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).SPEED_DEMON, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).REGENERATOR, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).ELEMENTAL_CHAOS, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).GRAVITY_ANOMALY, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).TIME_DISTORTION, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).PHASE_SHIFTER, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).MAGNETIC_STORM, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).SHIELD_MATRIX, (_crd && EliteType === void 0 ? (_reportPossibleCrUseOfEliteType({
            error: Error()
          }), EliteType) : EliteType).VOID_CORRUPTION];
        }

        generateChapterMap(chapter) {
          this._currentChapter = chapter;
          this._currentFloor = 0;
          this._chapterTheme = this.getChapterTheme(chapter);
          console.log(`Generating Chapter ${chapter} Map: ${this._chapterTheme}`); // Clear existing map

          this.clearCurrentMap(); // Generate map structure

          this.generateMapNodes();
          this.generateConnections();
          this.calculateAvailableNodes(); // Create visual representation

          this.createMapVisuals(); // Set starting position

          const startNodes = this.getNodesByType(NodeType.START);

          if (startNodes.length > 0) {
            this._currentNodeId = startNodes[0].id;
            this.updateNodeAvailability();
          }
        }

        generateMapNodes() {
          this._mapNodes.clear(); // Generate each floor


          for (let floor = 0; floor < this.floorsPerChapter; floor++) {
            this.generateFloorNodes(floor);
          }

          console.log(`Generated ${this._mapNodes.size} nodes for Chapter ${this._currentChapter}`);
        }

        generateFloorNodes(floor) {
          const nodeCount = this.getNodeCountForFloor(floor);

          if (floor === 0) {
            // Start floor - single start node
            this.createNode('start_0', NodeType.START, floor, 0);
          } else if (floor === this.floorsPerChapter - 1) {
            // Boss floor
            const bossTypes = this._chapterBossTypes.get(this._currentChapter) || [];
            const randomBoss = bossTypes[Math.floor(Math.random() * bossTypes.length)];
            const bossNode = this.createNode(`boss_${floor}`, NodeType.BOSS, floor, 0);
            bossNode.bossData = {
              bossType: randomBoss,
              chapter: this._currentChapter
            };
          } else if (floor === this.floorsPerChapter - 2) {
            // Pre-boss floor - always has campfire and shop
            this.createNode(`campfire_${floor}_0`, NodeType.CAMPFIRE, floor, 0);
            this.createNode(`shop_${floor}_1`, NodeType.SHOP, floor, 1); // Fill remaining slots with combat

            for (let i = 2; i < nodeCount; i++) {
              this.createCombatNode(`combat_${floor}_${i}`, floor, i);
            }
          } else {
            // Regular floors
            this.generateRegularFloor(floor, nodeCount);
          }
        }

        generateRegularFloor(floor, nodeCount) {
          const nodesToCreate = []; // Determine node types for this floor

          for (let i = 0; i < nodeCount; i++) {
            const nodeType = this.selectRandomNodeType();
            nodesToCreate.push(nodeType);
          } // Ensure at least one combat node per floor


          if (!nodesToCreate.includes(NodeType.COMBAT)) {
            nodesToCreate[Math.floor(Math.random() * nodesToCreate.length)] = NodeType.COMBAT;
          } // Create nodes


          for (let i = 0; i < nodeCount; i++) {
            const nodeId = `${nodesToCreate[i]}_${floor}_${i}`;
            this.createNodeByType(nodeId, nodesToCreate[i], floor, i);
          }
        }

        createNodeByType(nodeId, nodeType, floor, position) {
          const node = this.createNode(nodeId, nodeType, floor, position);

          switch (nodeType) {
            case NodeType.COMBAT:
              this.setupCombatNode(node, floor);
              break;

            case NodeType.ELITE:
              this.setupEliteNode(node, floor);
              break;

            case NodeType.EVENT:
              this.setupEventNode(node, floor);
              break;

            case NodeType.SHOP:
              this.setupShopNode(node, floor);
              break;

            case NodeType.TREASURE:
              this.setupTreasureNode(node, floor);
              break;

            case NodeType.MYSTERY:
              this.setupMysteryNode(node, floor);
              break;
          }
        }

        createNode(nodeId, nodeType, floor, position) {
          const node = {
            id: nodeId,
            type: nodeType,
            position: new Vec3((position - (this.getNodeCountForFloor(floor) - 1) / 2) * this.nodeSpacing, floor * this.floorSpacing, 0),
            connections: [],
            isVisited: false,
            isAvailable: floor === 0,
            // Only start nodes are initially available
            isCurrentPath: false,
            chapter: this._currentChapter,
            floor: floor
          };

          this._mapNodes.set(nodeId, node);

          return node;
        }

        createCombatNode(nodeId, floor, position) {
          const node = this.createNode(nodeId, NodeType.COMBAT, floor, position);
          this.setupCombatNode(node, floor);
        }

        setupCombatNode(node, floor) {
          const baseDifficulty = 1 + (this._currentChapter - 1) * 0.5 + floor * 0.1;
          node.combatData = {
            difficulty: baseDifficulty,
            brickCount: Math.floor(20 + baseDifficulty * 5),
            specialBrickRatio: Math.min(0.4, 0.2 + baseDifficulty * 0.05)
          };
        }

        setupEliteNode(node, floor) {
          const randomElite = this._availableEliteTypes[Math.floor(Math.random() * this._availableEliteTypes.length)];

          const baseDifficulty = 1 + (this._currentChapter - 1) * 0.5 + floor * 0.1;
          node.eliteData = {
            eliteType: randomElite,
            difficulty: baseDifficulty * 1.4
          };
        }

        setupEventNode(node, floor) {
          const events = this.getAvailableEvents(this._chapterTheme, floor);
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          node.eventData = {
            eventType: randomEvent.type,
            choices: randomEvent.choices
          };
        }

        setupShopNode(node, floor) {
          node.shopData = {
            items: this.generateShopItems(floor),
            currency: 0 // Player's currency will be checked when entering

          };
        }

        setupTreasureNode(node, floor) {
          const treasureTypes = ['relic', 'currency', 'upgrade_material'];
          const randomType = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
          node.treasureData = {
            rewardType: randomType,
            rewardValue: this.generateTreasureReward(randomType, floor)
          };
        }

        setupMysteryNode(node, floor) {
          // Mystery nodes have random effects that are revealed when entered
          node.treasureData = {
            rewardType: 'mystery',
            rewardValue: {
              floor: floor,
              chapter: this._currentChapter
            }
          };
        }

        generateConnections() {
          const nodesByFloor = this.groupNodesByFloor();

          for (let floor = 0; floor < this.floorsPerChapter - 1; floor++) {
            const currentFloorNodes = nodesByFloor.get(floor) || [];
            const nextFloorNodes = nodesByFloor.get(floor + 1) || [];
            this.connectFloors(currentFloorNodes, nextFloorNodes, floor);
          }
        }

        connectFloors(currentFloor, nextFloor, floorIndex) {
          if (currentFloor.length === 0 || nextFloor.length === 0) return; // Each node in current floor connects to 1-3 nodes in next floor

          for (const currentNode of currentFloor) {
            const connectionCount = Math.min(nextFloor.length, Math.floor(Math.random() * 3) + 1); // Choose random nodes to connect to, preferring nearby positions

            const targetIndices = this.selectConnectionTargets(currentFloor.indexOf(currentNode), nextFloor.length, connectionCount);

            for (const targetIndex of targetIndices) {
              const targetNode = nextFloor[targetIndex];
              currentNode.connections.push(targetNode.id);
            }
          } // Ensure all next floor nodes are reachable


          this.ensureNodesReachable(currentFloor, nextFloor);
        }

        selectConnectionTargets(sourceIndex, targetCount, connectionCount) {
          const targets = [];
          const sourcePosition = sourceIndex / Math.max(1, targetCount - 1); // Normalize to 0-1
          // Prefer connections to nearby nodes

          for (let i = 0; i < connectionCount; i++) {
            let targetIndex;

            if (i === 0) {
              // First connection: closest node
              targetIndex = Math.round(sourcePosition * (targetCount - 1));
            } else {
              // Additional connections: random nearby nodes
              const range = Math.min(2, Math.floor(targetCount / 2));
              const centerIndex = Math.round(sourcePosition * (targetCount - 1));
              const minIndex = Math.max(0, centerIndex - range);
              const maxIndex = Math.min(targetCount - 1, centerIndex + range);

              do {
                targetIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
              } while (targets.includes(targetIndex));
            }

            targets.push(targetIndex);
          }

          return targets;
        }

        ensureNodesReachable(currentFloor, nextFloor) {
          const reachableNodes = new Set(); // Find all reachable nodes

          for (const currentNode of currentFloor) {
            for (const connectionId of currentNode.connections) {
              reachableNodes.add(connectionId);
            }
          } // Connect unreachable nodes to random current floor nodes


          for (const nextNode of nextFloor) {
            if (!reachableNodes.has(nextNode.id)) {
              const randomCurrentNode = currentFloor[Math.floor(Math.random() * currentFloor.length)];
              randomCurrentNode.connections.push(nextNode.id);
            }
          }
        }

        createMapVisuals() {
          this.clearMapVisuals(); // Create node visuals

          for (const [nodeId, node] of this._mapNodes) {
            this.createNodeVisual(node);
          } // Create connection lines


          this.createConnectionVisuals();
        }

        createNodeVisual(node) {
          if (!this.mapNodePrefab) return;
          const nodeVisual = instantiate(this.mapNodePrefab);
          const sprite = nodeVisual.getComponent(Sprite);
          const label = nodeVisual.getComponentInChildren(Label);
          const button = nodeVisual.getComponent(Button);

          if (sprite) {
            sprite.color = this.getNodeColor(node.type);
          }

          if (label) {
            label.string = this.getNodeDisplayName(node.type);
          }

          if (button) {
            button.node.on(Button.EventType.CLICK, () => this.onNodeClicked(node.id), this);
          }

          nodeVisual.setParent(this.node);
          nodeVisual.setPosition(node.position); // Set availability visual state

          this.updateNodeVisualState(nodeVisual, node);

          this._nodeVisuals.set(node.id, nodeVisual);
        }

        createConnectionVisuals() {
          if (!this.connectionLinePrefab) return;

          for (const [nodeId, node] of this._mapNodes) {
            for (const connectionId of node.connections) {
              const targetNode = this._mapNodes.get(connectionId);

              if (!targetNode) continue;
              const line = instantiate(this.connectionLinePrefab);
              line.setParent(this.node); // Position and scale line between nodes

              const startPos = node.position;
              const endPos = targetNode.position;
              const midPos = Vec3.lerp(new Vec3(), startPos, endPos, 0.5);
              const distance = Vec3.distance(startPos, endPos);
              line.setPosition(midPos);
              const transform = line.getComponent(UITransform);

              if (transform) {
                transform.width = distance; // Rotate line to connect nodes

                const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
                line.setRotationFromEuler(0, 0, angle * 180 / Math.PI);
              }

              this._connectionLines.push(line);
            }
          }
        }

        getNodeColor(nodeType) {
          switch (nodeType) {
            case NodeType.COMBAT:
              return new Color(150, 150, 150);
            // Gray

            case NodeType.ELITE:
              return new Color(255, 165, 0);
            // Orange

            case NodeType.BOSS:
              return new Color(255, 0, 0);
            // Red

            case NodeType.EVENT:
              return new Color(0, 255, 255);
            // Cyan

            case NodeType.SHOP:
              return new Color(255, 255, 0);
            // Yellow

            case NodeType.TREASURE:
              return new Color(255, 215, 0);
            // Gold

            case NodeType.CAMPFIRE:
              return new Color(255, 100, 0);
            // Orange-red

            case NodeType.UPGRADE:
              return new Color(128, 0, 128);
            // Purple

            case NodeType.MYSTERY:
              return new Color(128, 128, 255);
            // Light blue

            case NodeType.START:
              return new Color(0, 255, 0);
            // Green

            default:
              return new Color(255, 255, 255);
            // White
          }
        }

        getNodeDisplayName(nodeType) {
          switch (nodeType) {
            case NodeType.COMBAT:
              return "战斗";

            case NodeType.ELITE:
              return "精英";

            case NodeType.BOSS:
              return "BOSS";

            case NodeType.EVENT:
              return "事件";

            case NodeType.SHOP:
              return "商店";

            case NodeType.TREASURE:
              return "宝藏";

            case NodeType.CAMPFIRE:
              return "篝火";

            case NodeType.UPGRADE:
              return "升级";

            case NodeType.MYSTERY:
              return "神秘";

            case NodeType.START:
              return "开始";

            default:
              return "未知";
          }
        }

        onNodeClicked(nodeId) {
          const node = this._mapNodes.get(nodeId);

          if (!node || !node.isAvailable) {
            console.log(`Node ${nodeId} is not available`);
            return;
          }

          console.log(`Player selected node: ${nodeId} (${node.type})`); // Mark current node as visited

          node.isVisited = true;
          node.isCurrentPath = true;
          this._currentNodeId = nodeId; // Update node availability

          this.updateNodeAvailability(); // Trigger node action

          this.executeNodeAction(node); // Update visuals

          this.updateAllNodeVisuals();
        }

        executeNodeAction(node) {
          switch (node.type) {
            case NodeType.COMBAT:
              this.startCombat(node);
              break;

            case NodeType.ELITE:
              this.startEliteCombat(node);
              break;

            case NodeType.BOSS:
              this.startBossCombat(node);
              break;

            case NodeType.EVENT:
              this.triggerEvent(node);
              break;

            case NodeType.SHOP:
              this.enterShop(node);
              break;

            case NodeType.TREASURE:
              this.openTreasure(node);
              break;

            case NodeType.CAMPFIRE:
              this.restAtCampfire(node);
              break;

            case NodeType.UPGRADE:
              this.enterUpgradeStation(node);
              break;

            case NodeType.MYSTERY:
              this.encounterMystery(node);
              break;
          }
        } // Node action implementations


        startCombat(node) {
          var _node$combatData;

          console.log(`Starting combat with difficulty ${(_node$combatData = node.combatData) == null ? void 0 : _node$combatData.difficulty}`); // Integrate with GameManager to start combat
        }

        startEliteCombat(node) {
          var _node$eliteData;

          console.log(`Starting elite combat: ${(_node$eliteData = node.eliteData) == null ? void 0 : _node$eliteData.eliteType}`); // Integrate with EliteAndHiddenBossManager
        }

        startBossCombat(node) {
          var _node$bossData;

          console.log(`Starting boss combat: ${(_node$bossData = node.bossData) == null ? void 0 : _node$bossData.bossType}`); // Integrate with EnhancedBossController
        }

        triggerEvent(node) {
          var _node$eventData;

          console.log(`Triggered event: ${(_node$eventData = node.eventData) == null ? void 0 : _node$eventData.eventType}`); // Show event UI with choices
        }

        enterShop(node) {
          var _node$shopData;

          console.log(`Entered shop with ${(_node$shopData = node.shopData) == null ? void 0 : _node$shopData.items.length} items`); // Show shop UI
        }

        openTreasure(node) {
          var _node$treasureData;

          console.log(`Found treasure: ${(_node$treasureData = node.treasureData) == null ? void 0 : _node$treasureData.rewardType}`); // Award treasure and show UI
        }

        restAtCampfire(node) {
          console.log('Resting at campfire'); // Restore health, show rest options
        }

        enterUpgradeStation(node) {
          console.log('Entered upgrade station'); // Show upgrade options
        }

        encounterMystery(node) {
          console.log('Encountered mystery node'); // Random effect
        } // Utility methods


        selectRandomNodeType() {
          const totalWeight = Array.from(this._nodeTypeDistribution.values()).reduce((sum, weight) => sum + weight, 0);
          let random = Math.random() * totalWeight;

          for (const [nodeType, weight] of this._nodeTypeDistribution.entries()) {
            random -= weight;

            if (random <= 0) {
              return nodeType;
            }
          }

          return NodeType.COMBAT; // Fallback
        }

        getNodeCountForFloor(floor) {
          if (floor === 0 || floor === this.floorsPerChapter - 1) {
            return 1; // Start and boss floors have single nodes
          } else if (floor === this.floorsPerChapter - 2) {
            return this.nodesPerFloor - 1; // Pre-boss floor has slightly fewer options
          } else {
            return this.nodesPerFloor;
          }
        }

        getChapterTheme(chapter) {
          switch (chapter) {
            case 1:
              return ChapterTheme.FOREST;

            case 2:
              return ChapterTheme.MOUNTAIN;

            case 3:
              return ChapterTheme.ABYSS;

            default:
              return ChapterTheme.FOREST;
          }
        }

        groupNodesByFloor() {
          const floorGroups = new Map();

          for (const node of this._mapNodes.values()) {
            if (!floorGroups.has(node.floor)) {
              floorGroups.set(node.floor, []);
            }

            floorGroups.get(node.floor).push(node);
          }

          return floorGroups;
        }

        getNodesByType(nodeType) {
          return Array.from(this._mapNodes.values()).filter(node => node.type === nodeType);
        }

        updateNodeAvailability() {
          // Reset availability
          for (const node of this._mapNodes.values()) {
            node.isAvailable = false;
          } // Make connected nodes available


          const currentNode = this._mapNodes.get(this._currentNodeId);

          if (currentNode) {
            for (const connectionId of currentNode.connections) {
              const connectedNode = this._mapNodes.get(connectionId);

              if (connectedNode && !connectedNode.isVisited) {
                connectedNode.isAvailable = true;
              }
            }
          }
        }

        updateAllNodeVisuals() {
          for (const [nodeId, node] of this._mapNodes) {
            const visual = this._nodeVisuals.get(nodeId);

            if (visual) {
              this.updateNodeVisualState(visual, node);
            }
          }
        }

        updateNodeVisualState(visual, node) {
          const sprite = visual.getComponent(Sprite);
          if (!sprite) return;

          if (node.isVisited) {
            sprite.color = new Color(100, 100, 100, 180); // Dark and semi-transparent
          } else if (node.isAvailable) {
            sprite.color = this.getNodeColor(node.type);
          } else {
            sprite.color = new Color(80, 80, 80, 100); // Very dark and transparent
          } // Highlight current node


          if (node.id === this._currentNodeId) {
            sprite.color = Color.WHITE;
          }
        }

        clearCurrentMap() {
          this._mapNodes.clear();

          this.clearMapVisuals();
        }

        clearMapVisuals() {
          // Clear node visuals
          for (const visual of this._nodeVisuals.values()) {
            visual.destroy();
          }

          this._nodeVisuals.clear(); // Clear connection lines


          for (const line of this._connectionLines) {
            line.destroy();
          }

          this._connectionLines = [];
        } // Event and shop data generation


        getAvailableEvents(theme, floor) {
          // This would be expanded with actual event data
          return [{
            type: 'mysterious_shrine',
            choices: [{
              id: 'pray',
              text: '祈祷获得祝福',
              consequences: [{
                type: 'relic',
                value: 'random',
                description: '获得随机遗物'
              }]
            }, {
              id: 'ignore',
              text: '无视神龛',
              consequences: [{
                type: 'currency',
                value: 20,
                description: '获得20金币'
              }]
            }]
          }];
        }

        generateShopItems(floor) {
          // Generate shop items based on floor and chapter
          return [{
            id: 'health_potion',
            name: '生命药水',
            description: '恢复50点生命值',
            type: 'consumable',
            cost: 75,
            data: {
              healing: 50
            }
          }, {
            id: 'damage_relic',
            name: '力量护符',
            description: '永久增加10%伤害',
            type: 'relic',
            cost: 150,
            data: {
              damageBonus: 0.1
            }
          }];
        }

        generateTreasureReward(rewardType, floor) {
          switch (rewardType) {
            case 'relic':
              return {
                relicType: 'random',
                tier: 'common'
              };

            case 'currency':
              return {
                amount: 50 + floor * 10
              };

            case 'upgrade_material':
              return {
                type: 'enhancement_stone',
                quantity: 2
              };

            default:
              return null;
          }
        }

        saveMapProgress() {
          // Save current map state
          console.log('Map progress saved');
        }

        loadMapProgress() {
          // Load saved map state
          console.log('Map progress loaded');
        } // Public accessors


        getCurrentNode() {
          return this._mapNodes.get(this._currentNodeId);
        }

        getCurrentChapter() {
          return this._currentChapter;
        }

        getCurrentFloor() {
          const currentNode = this.getCurrentNode();
          return currentNode ? currentNode.floor : 0;
        }

        isChapterComplete() {
          const currentNode = this.getCurrentNode();
          return (currentNode == null ? void 0 : currentNode.type) === NodeType.BOSS && currentNode.isVisited;
        }

        getNextChapterAvailable() {
          return this.isChapterComplete() && this._currentChapter < 3;
        }

        calculateAvailableNodes() {
          // Calculate which nodes are available based on current progress
          // Initially only starting nodes are available
          for (const [nodeId, node] of this._mapNodes) {
            if (node.type === NodeType.START) {
              node.isAvailable = true;
            } else {
              node.isAvailable = false;
            }
          } // Update available nodes based on completed nodes


          this.updateAvailableNodes();
        }

        updateAvailableNodes() {
          // Unlock nodes that are connected to completed nodes
          for (const completedNode of this._completedNodes) {
            for (const connectionId of completedNode.connections) {
              const connectedNode = this.getNodeById(connectionId);

              if (connectedNode) {
                connectedNode.isAvailable = true;
              }
            }
          }
        }

        getNodeById(nodeId) {
          return this._mapNodes.get(nodeId);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mapNodePrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "connectionLinePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodesPerFloor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "floorsPerChapter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "nodeSpacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "floorSpacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=21916edbf4b8302f70395956a2391201daf71d5e.js.map