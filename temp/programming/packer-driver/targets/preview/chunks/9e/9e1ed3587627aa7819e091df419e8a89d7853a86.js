System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, _dec, _class, _class2, _crd, ccclass, property, RelicType, RelicManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ebc0cHniBRLxYVKFliDc7qL", "RelicManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RelicType", RelicType = /*#__PURE__*/function (RelicType) {
        RelicType["EXPLOSIVE_BRICKS"] = "explosive_bricks";
        RelicType["MULTI_BALL_START"] = "multi_ball_start";
        RelicType["LASER_DAMAGE_BOOST"] = "laser_damage_boost";
        RelicType["BRICK_PENETRATION"] = "brick_penetration";
        RelicType["SPEED_BOOST"] = "speed_boost";
        return RelicType;
      }({}));

      _export("RelicManager", RelicManager = (_dec = ccclass('RelicManager'), _dec(_class = (_class2 = class RelicManager extends Component {
        constructor() {
          super(...arguments);
          this._activeRelics = new Map();
        }

        static getInstance() {
          return RelicManager._instance;
        }

        onLoad() {
          if (RelicManager._instance === null) {
            RelicManager._instance = this;
            director.addPersistRootNode(this.node);
            this.initializeRelics();
          } else {
            this.node.destroy();
            return;
          }
        }

        onDestroy() {
          if (RelicManager._instance === this) {
            RelicManager._instance = null;
          }
        }

        initializeRelics() {
          console.log('RelicManager initialized');
        }

        addRelic(relicType) {
          var relic = this.createRelic(relicType);

          if (relic) {
            this._activeRelics.set(relicType, relic);

            console.log("Relic acquired: " + relic.name);
            this.onRelicAdded(relicType);
          }
        }

        hasRelic(relicType) {
          return this._activeRelics.has(relicType);
        }

        getRelic(relicType) {
          return this._activeRelics.get(relicType);
        }

        getActiveRelics() {
          return Array.from(this._activeRelics.values());
        }

        removeRelic(relicType) {
          var relic = this._activeRelics.get(relicType);

          if (relic) {
            this._activeRelics.delete(relicType);

            console.log("Relic removed: " + relic.name);
            this.onRelicRemoved(relicType);
          }
        }

        clearAllRelics() {
          this._activeRelics.clear();

          console.log('All relics cleared');
        }

        createRelic(relicType) {
          switch (relicType) {
            case RelicType.EXPLOSIVE_BRICKS:
              return {
                id: 'explosive_bricks',
                name: 'Explosive Bricks',
                description: 'When a brick is destroyed, it deals damage to adjacent bricks'
              };

            case RelicType.MULTI_BALL_START:
              return {
                id: 'multi_ball_start',
                name: 'Multi Ball Start',
                description: 'Start each level with 3 balls instead of 1'
              };

            case RelicType.LASER_DAMAGE_BOOST:
              return {
                id: 'laser_damage_boost',
                name: 'Laser Power',
                description: 'Laser power-up deals double damage'
              };

            case RelicType.BRICK_PENETRATION:
              return {
                id: 'brick_penetration',
                name: 'Penetrating Shots',
                description: 'Ball can pass through bricks, destroying multiple in a row'
              };

            case RelicType.SPEED_BOOST:
              return {
                id: 'speed_boost',
                name: 'Speed Boost',
                description: 'Ball moves 25% faster'
              };

            default:
              return null;
          }
        }

        onRelicAdded(relicType) {
          switch (relicType) {
            case RelicType.EXPLOSIVE_BRICKS:
              break;

            case RelicType.MULTI_BALL_START:
              break;

            case RelicType.LASER_DAMAGE_BOOST:
              break;

            case RelicType.BRICK_PENETRATION:
              break;

            case RelicType.SPEED_BOOST:
              break;
          }
        }

        onRelicRemoved(relicType) {}

        grantRandomRelic() {
          var allRelicTypes = Object.values(RelicType);
          var availableRelics = allRelicTypes.filter(type => !this.hasRelic(type));

          if (availableRelics.length > 0) {
            var randomRelic = availableRelics[Math.floor(Math.random() * availableRelics.length)];
            this.addRelic(randomRelic);
            return randomRelic;
          }

          return null;
        } // 添加测试需要的方法


        getRelicCount() {
          return this._activeRelics.size;
        }

        canAcquireRelic(relicType) {
          return !this.hasRelic(relicType);
        }

        getRelicEffect(relicType) {
          var relic = this.getRelic(relicType);
          return relic ? relic.description : '';
        }

        saveRelics() {
          var relicData = {};

          this._activeRelics.forEach((relic, type) => {
            relicData[type] = relic;
          });

          return relicData;
        }

        loadRelics(data) {
          try {
            this.clearAllRelics();

            for (var [type, relicData] of Object.entries(data)) {
              if (Object.values(RelicType).includes(type)) {
                this._activeRelics.set(type, relicData);
              }
            }

            return true;
          } catch (error) {
            console.error('Failed to load relics:', error);
            return false;
          }
        }

        getRelicCombinations() {
          var activeTypes = Array.from(this._activeRelics.keys());
          var combinations = []; // 生成所有可能的组合

          for (var i = 0; i < activeTypes.length; i++) {
            for (var j = i + 1; j < activeTypes.length; j++) {
              combinations.push([activeTypes[i], activeTypes[j]]);
            }
          }

          return combinations;
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9e1ed3587627aa7819e091df419e8a89d7853a86.js.map