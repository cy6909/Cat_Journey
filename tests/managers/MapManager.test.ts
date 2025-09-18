/**
 * MapManager 单元测试
 * 测试地图管理器的地图生成、路径规划和节点管理功能
 */

import '../setup';
import { MapManager, MapNodeType } from '../../assets/scripts/managers/MapManager';
import { Node } from 'cc';

describe('MapManager 测试套件', () => {
    let mapManager: MapManager;
    let testNode: Node;

    beforeEach(() => {
        testNode = new Node('TestMapManager');
        mapManager = testNode.addComponent(MapManager);
        
        // 清理单例状态
        (MapManager as any)._instance = null;
        mapManager.onLoad();
    });

    afterEach(() => {
        (MapManager as any)._instance = null;
    });

    describe('单例模式测试', () => {
        test('应该正确实现单例模式', () => {
            const instance1 = MapManager.getInstance();
            const instance2 = MapManager.getInstance();
            
            expect(instance1).toBe(instance2);
            expect(instance1).toBe(mapManager);
        });
    });

    describe('地图生成测试', () => {
        test('应该能够生成基础地图结构', () => {
            mapManager.generateMap(1, 15); // 第1章，15层
            
            const map = mapManager.getCurrentMap();
            expect(map).toBeDefined();
            expect(map.floors).toHaveLength(15);
        });

        test('应该正确分布不同类型的节点', () => {
            mapManager.generateMap(1, 10);
            const map = mapManager.getCurrentMap();
            
            let hasShop = false;
            let hasTreasure = false;
            let hasElite = false;
            let hasBoss = false;
            
            map.floors.forEach(floor => {
                floor.nodes.forEach(node => {
                    if (node.type === MapNodeType.SHOP) hasShop = true;
                    if (node.type === MapNodeType.TREASURE) hasTreasure = true;
                    if (node.type === MapNodeType.ELITE) hasElite = true;
                    if (node.type === MapNodeType.BOSS) hasBoss = true;
                });
            });
            
            expect(hasShop).toBe(true);
            expect(hasTreasure).toBe(true);
            expect(hasElite).toBe(true);
            expect(hasBoss).toBe(true);
        });

        test('应该确保地图路径的连通性', () => {
            mapManager.generateMap(1, 8);
            const map = mapManager.getCurrentMap();
            
            // 检查每一层都有可达路径
            for (let i = 0; i < map.floors.length - 1; i++) {
                const currentFloor = map.floors[i];
                const nextFloor = map.floors[i + 1];
                
                let hasConnection = false;
                currentFloor.nodes.forEach(currentNode => {
                    nextFloor.nodes.forEach(nextNode => {
                        if (currentNode.connections.includes(nextNode.id)) {
                            hasConnection = true;
                        }
                    });
                });
                
                expect(hasConnection).toBe(true);
            });
        });
    });

    describe('节点访问和状态管理测试', () => {
        beforeEach(() => {
            mapManager.generateMap(1, 5);
        });

        test('应该能够访问节点', () => {
            const map = mapManager.getCurrentMap();
            const firstNode = map.floors[0].nodes[0];
            
            const visited = mapManager.visitNode(firstNode.id);
            expect(visited).toBe(true);
            expect(mapManager.isNodeVisited(firstNode.id)).toBe(true);
        });

        test('应该正确跟踪当前位置', () => {
            const map = mapManager.getCurrentMap();
            const targetNode = map.floors[0].nodes[0];
            
            mapManager.setCurrentNode(targetNode.id);
            expect(mapManager.getCurrentNodeId()).toBe(targetNode.id);
        });

        test('应该正确验证节点连接', () => {
            const map = mapManager.getCurrentMap();
            const firstFloorNode = map.floors[0].nodes[0];
            const connectedNodeId = firstFloorNode.connections[0];
            
            const canMove = mapManager.canMoveToNode(firstFloorNode.id, connectedNodeId);
            expect(canMove).toBe(true);
            
            // 测试不连接的节点
            const unconnectedNode = map.floors[2].nodes[0];
            const cannotMove = mapManager.canMoveToNode(firstFloorNode.id, unconnectedNode.id);
            expect(cannotMove).toBe(false);
        });
    });

    describe('路径规划测试', () => {
        beforeEach(() => {
            mapManager.generateMap(1, 6);
        });

        test('应该能够找到有效路径', () => {
            const map = mapManager.getCurrentMap();
            const startNode = map.floors[0].nodes[0];
            const endNode = map.floors[map.floors.length - 1].nodes[0];
            
            const path = mapManager.findPath(startNode.id, endNode.id);
            expect(path).toBeDefined();
            expect(path.length).toBeGreaterThan(0);
            expect(path[0]).toBe(startNode.id);
            expect(path[path.length - 1]).toBe(endNode.id);
        });

        test('应该返回最短路径', () => {
            const map = mapManager.getCurrentMap();
            const startNode = map.floors[0].nodes[0];
            const endNode = map.floors[2].nodes[0];
            
            const path = mapManager.findPath(startNode.id, endNode.id);
            
            // 路径长度应该合理（不超过层数+1）
            expect(path.length).toBeLessThanOrEqual(4);
        });

        test('应该能够获取可达节点列表', () => {
            const map = mapManager.getCurrentMap();
            const currentNode = map.floors[1].nodes[0];
            
            mapManager.setCurrentNode(currentNode.id);
            const reachableNodes = mapManager.getReachableNodes();
            
            expect(reachableNodes.length).toBeGreaterThan(0);
            reachableNodes.forEach(nodeId => {
                expect(currentNode.connections).toContain(nodeId);
            });
        });
    });

    describe('特殊节点处理测试', () => {
        beforeEach(() => {
            mapManager.generateMap(2, 8);
        });

        test('应该正确处理商店节点', () => {
            const map = mapManager.getCurrentMap();
            const shopNodes = map.floors.flat()
                .filter(floor => floor.nodes.some(node => node.type === MapNodeType.SHOP))
                .map(floor => floor.nodes.find(node => node.type === MapNodeType.SHOP)!);
            
            if (shopNodes.length > 0) {
                const shopNode = shopNodes[0];
                const result = mapManager.processNodeEvent(shopNode.id);
                
                expect(result).toBeDefined();
                expect(result.type).toBe('shop');
            }
        });

        test('应该正确处理宝藏节点', () => {
            const map = mapManager.getCurrentMap();
            const treasureNodes = map.floors.flat()
                .filter(floor => floor.nodes.some(node => node.type === MapNodeType.TREASURE))
                .map(floor => floor.nodes.find(node => node.type === MapNodeType.TREASURE)!);
            
            if (treasureNodes.length > 0) {
                const treasureNode = treasureNodes[0];
                const result = mapManager.processNodeEvent(treasureNode.id);
                
                expect(result).toBeDefined();
                expect(result.type).toBe('treasure');
                expect(result.reward).toBeDefined();
            }
        });

        test('应该正确处理休息节点', () => {
            const map = mapManager.getCurrentMap();
            const restNodes = map.floors.flat()
                .filter(floor => floor.nodes.some(node => node.type === MapNodeType.REST))
                .map(floor => floor.nodes.find(node => node.type === MapNodeType.REST)!);
            
            if (restNodes.length > 0) {
                const restNode = restNodes[0];
                const result = mapManager.processNodeEvent(restNode.id);
                
                expect(result).toBeDefined();
                expect(result.type).toBe('rest');
                expect(result.healAmount).toBeGreaterThan(0);
            }
        });
    });

    describe('地图状态保存和加载测试', () => {
        test('应该能够保存地图状态', () => {
            mapManager.generateMap(2, 6);
            const firstNode = mapManager.getCurrentMap().floors[0].nodes[0];
            mapManager.visitNode(firstNode.id);
            mapManager.setCurrentNode(firstNode.id);
            
            const saveData = mapManager.getSaveData();
            
            expect(saveData).toBeDefined();
            expect(saveData.currentNodeId).toBe(firstNode.id);
            expect(saveData.visitedNodes).toContain(firstNode.id);
            expect(saveData.mapStructure).toBeDefined();
        });

        test('应该能够加载地图状态', () => {
            mapManager.generateMap(1, 4);
            const originalMap = mapManager.getCurrentMap();
            const saveData = mapManager.getSaveData();
            
            // 清除当前状态
            mapManager.clearMap();
            expect(mapManager.getCurrentMap()).toBeNull();
            
            // 加载保存的状态
            mapManager.loadFromSaveData(saveData);
            const loadedMap = mapManager.getCurrentMap();
            
            expect(loadedMap).toBeDefined();
            expect(loadedMap.floors.length).toBe(originalMap.floors.length);
        });
    });

    describe('地图验证测试', () => {
        test('应该验证地图结构的完整性', () => {
            mapManager.generateMap(1, 5);
            const isValid = mapManager.validateMapStructure();
            
            expect(isValid).toBe(true);
        });

        test('应该检测无效的地图结构', () => {
            // 创建一个有问题的地图
            const invalidMap = {
                id: 'test-map',
                chapter: 1,
                floors: [
                    {
                        id: 'floor-1',
                        level: 1,
                        nodes: [
                            {
                                id: 'node-1',
                                type: MapNodeType.COMBAT,
                                position: { x: 0, y: 0 },
                                connections: ['non-existent-node'], // 无效连接
                                isVisited: false,
                                isAvailable: true
                            }
                        ]
                    }
                ]
            };
            
            (mapManager as any).currentMap = invalidMap;
            const isValid = mapManager.validateMapStructure();
            
            expect(isValid).toBe(false);
        });
    });

    describe('地图清理和重置测试', () => {
        test('应该能够清除地图数据', () => {
            mapManager.generateMap(1, 3);
            expect(mapManager.getCurrentMap()).toBeDefined();
            
            mapManager.clearMap();
            expect(mapManager.getCurrentMap()).toBeNull();
        });

        test('应该能够重置访问状态', () => {
            mapManager.generateMap(1, 3);
            const firstNode = mapManager.getCurrentMap().floors[0].nodes[0];
            
            mapManager.visitNode(firstNode.id);
            expect(mapManager.isNodeVisited(firstNode.id)).toBe(true);
            
            mapManager.resetVisitedNodes();
            expect(mapManager.isNodeVisited(firstNode.id)).toBe(false);
        });
    });

    describe('错误处理测试', () => {
        test('应该处理无效的地图生成参数', () => {
            expect(() => {
                mapManager.generateMap(-1, 10);
                mapManager.generateMap(1, -5);
                mapManager.generateMap(0, 0);
            }).not.toThrow();
            
            // 应该生成有效的默认地图
            const map = mapManager.getCurrentMap();
            if (map) {
                expect(map.floors.length).toBeGreaterThan(0);
            }
        });

        test('应该处理无效的节点操作', () => {
            mapManager.generateMap(1, 3);
            
            expect(() => {
                mapManager.visitNode('non-existent-node');
                mapManager.setCurrentNode('invalid-node');
                mapManager.canMoveToNode('invalid-from', 'invalid-to');
            }).not.toThrow();
        });

        test('应该处理无效的保存数据', () => {
            expect(() => {
                mapManager.loadFromSaveData(null as any);
                mapManager.loadFromSaveData({} as any);
                mapManager.loadFromSaveData({ 
                    mapStructure: null,
                    visitedNodes: null 
                } as any);
            }).not.toThrow();
        });
    });

    describe('性能测试', () => {
        test('大型地图生成应该高效', () => {
            const startTime = performance.now();
            
            mapManager.generateMap(3, 20); // 生成大地图
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(500); // 500ms内完成
        });

        test('路径查找应该高效', () => {
            mapManager.generateMap(2, 15);
            const map = mapManager.getCurrentMap();
            const startNode = map.floors[0].nodes[0];
            const endNode = map.floors[map.floors.length - 1].nodes[0];
            
            const startTime = performance.now();
            
            // 执行100次路径查找
            for (let i = 0; i < 100; i++) {
                mapManager.findPath(startNode.id, endNode.id);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(200); // 200ms内完成100次查找
        });
    });
});