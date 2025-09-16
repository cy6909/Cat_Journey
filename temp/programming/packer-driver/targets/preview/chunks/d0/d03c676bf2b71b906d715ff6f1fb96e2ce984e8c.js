System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, instantiate, Vec3, EnhancedBrick, BrickType, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, LevelType, ProceduralLevelGenerator;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEnhancedBrick(extras) {
    _reporterNs.report("EnhancedBrick", "./EnhancedBrick", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBrickType(extras) {
    _reporterNs.report("BrickType", "./EnhancedBrick", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EnhancedBrick = _unresolved_2.EnhancedBrick;
      BrickType = _unresolved_2.BrickType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "21fceE5IB1ONbE0zWk1bImR", "ProceduralLevelGenerator", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'math']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LevelType", LevelType = /*#__PURE__*/function (LevelType) {
        LevelType["NORMAL"] = "normal";
        LevelType["ELITE"] = "elite";
        LevelType["BOSS"] = "boss";
        LevelType["HIDDEN_BOSS"] = "hidden_boss";
        LevelType["EVENT"] = "event";
        LevelType["SHOP"] = "shop";
        LevelType["TREASURE"] = "treasure";
        return LevelType;
      }({}));

      _export("ProceduralLevelGenerator", ProceduralLevelGenerator = (_dec = ccclass('ProceduralLevelGenerator'), _dec2 = property({
        type: Prefab
      }), _dec(_class = (_class2 = class ProceduralLevelGenerator extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "enhancedBrickPrefab", _descriptor, this);

          _initializerDefineProperty(this, "gridWidth", _descriptor2, this);

          _initializerDefineProperty(this, "gridHeight", _descriptor3, this);

          _initializerDefineProperty(this, "brickSpacing", _descriptor4, this);

          _initializerDefineProperty(this, "startY", _descriptor5, this);

          // Level difficulty scaling
          this._baseDifficulty = 1.0;
          this._currentChapter = 1;
          this._currentLevel = 1;
          // Brick type distribution templates
          this._normalLevelWeights = new Map();
          this._eliteLevelWeights = new Map();
          this._bossLevelWeights = new Map();
        }

        onLoad() {
          this.initializeBrickWeights();
        }

        initializeBrickWeights() {
          // Normal level weights (40% normal, 30% reinforced, 20% special, 10% rare)
          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).NORMAL, 40);

          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REINFORCED, 30);

          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPERIENCE, 15);

          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPLOSIVE, 5);

          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).ELECTRIC, 5);

          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).ICE, 3);

          this._normalLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).FIRE, 2); // Elite level weights (20% normal, 40% reinforced, 30% special, 10% rare)


          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).NORMAL, 20);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REINFORCED, 40);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPLOSIVE, 10);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).ELECTRIC, 8);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REGENERATING, 7);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).PHASE, 5);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).MAGNETIC, 5);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).SHIELD, 3);

          this._eliteLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).GRAVITY, 2); // Boss level weights (10% normal, 30% reinforced, 40% special, 20% rare)


          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).NORMAL, 10);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REINFORCED, 30);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).EXPLOSIVE, 15);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).ELECTRIC, 10);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).REGENERATING, 10);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).SHIELD, 8);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).PHASE, 7);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).TELEPORT, 5);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).TIME, 3);

          this._bossLevelWeights.set((_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).VOID, 2);
        }

        generateLevel(levelType, chapter, levelNumber) {
          this._currentChapter = chapter;
          this._currentLevel = levelNumber;
          var difficulty = this.calculateDifficulty(chapter, levelNumber);

          switch (levelType) {
            case LevelType.NORMAL:
              return this.generateNormalLevel(difficulty);

            case LevelType.ELITE:
              return this.generateEliteLevel(difficulty);

            case LevelType.BOSS:
              return this.generateBossLevel(difficulty);

            case LevelType.HIDDEN_BOSS:
              return this.generateHiddenBossLevel(difficulty);

            default:
              return this.generateNormalLevel(difficulty);
          }
        }

        calculateDifficulty(chapter, levelNumber) {
          // Base difficulty increases with chapter and level
          var chapterMultiplier = 1 + (chapter - 1) * 0.5;
          var levelProgress = levelNumber / 10; // Assuming 10 levels per chapter

          return this._baseDifficulty * chapterMultiplier * (1 + levelProgress);
        }

        generateNormalLevel(difficulty) {
          var brickCount = Math.min(this.gridWidth * this.gridHeight, Math.floor(20 + difficulty * 8));
          return {
            name: "Normal Level " + this._currentLevel,
            difficulty: difficulty,
            brickCount: brickCount,
            specialBrickRatio: Math.min(0.4, 0.2 + difficulty * 0.05),
            bossLevel: false,
            eliteLevel: false,
            brickTypeWeights: this._normalLevelWeights
          };
        }

        generateEliteLevel(difficulty) {
          var brickCount = Math.min(this.gridWidth * this.gridHeight, Math.floor(30 + difficulty * 10));
          return {
            name: "Elite Level " + this._currentLevel,
            difficulty: difficulty * 1.3,
            brickCount: brickCount,
            specialBrickRatio: Math.min(0.6, 0.4 + difficulty * 0.1),
            bossLevel: false,
            eliteLevel: true,
            brickTypeWeights: this._eliteLevelWeights
          };
        }

        generateBossLevel(difficulty) {
          var brickCount = Math.floor(this.gridWidth * this.gridHeight * 0.7); // Less bricks for boss fights

          return {
            name: "Boss Level " + this._currentLevel,
            difficulty: difficulty * 1.5,
            brickCount: brickCount,
            specialBrickRatio: Math.min(0.8, 0.6 + difficulty * 0.1),
            bossLevel: true,
            eliteLevel: false,
            brickTypeWeights: this._bossLevelWeights
          };
        }

        generateHiddenBossLevel(difficulty) {
          var brickCount = Math.floor(this.gridWidth * this.gridHeight * 0.5);
          return {
            name: "Hidden Boss " + this._currentLevel,
            difficulty: difficulty * 2.0,
            brickCount: brickCount,
            specialBrickRatio: 0.9,
            // Almost all special bricks
            bossLevel: true,
            eliteLevel: false,
            brickTypeWeights: this._bossLevelWeights
          };
        }

        placeBricksFromTemplate(template, parent) {
          var bricks = [];
          var positions = this.generateBrickPositions(template.brickCount);

          for (var i = 0; i < positions.length; i++) {
            var brickType = this.selectBrickType(template.brickTypeWeights, template.difficulty);
            var brick = this.createBrick(brickType, positions[i], template.difficulty);

            if (brick && parent) {
              brick.setParent(parent);
              bricks.push(brick);
            }
          }

          return bricks;
        }

        generateBrickPositions(count) {
          var positions = [];
          var availablePositions = []; // Generate all possible positions

          for (var row = 0; row < this.gridHeight; row++) {
            for (var col = 0; col < this.gridWidth; col++) {
              var x = (col - this.gridWidth / 2 + 0.5) * this.brickSpacing;
              var y = this.startY - row * (this.brickSpacing * 0.6);
              availablePositions.push(new Vec3(x, y, 0));
            }
          } // Randomly select positions


          while (positions.length < count && availablePositions.length > 0) {
            var randomIndex = Math.floor(Math.random() * availablePositions.length);
            positions.push(availablePositions.splice(randomIndex, 1)[0]);
          }

          return positions;
        }

        selectBrickType(weights, difficulty) {
          var totalWeight = Array.from(weights.values()).reduce((sum, weight) => sum + weight, 0);
          var random = Math.random() * totalWeight;

          for (var [brickType, weight] of weights.entries()) {
            random -= weight;

            if (random <= 0) {
              return brickType;
            }
          }

          return (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
            error: Error()
          }), BrickType) : BrickType).NORMAL; // Fallback
        }

        createBrick(brickType, position, difficulty) {
          if (!this.enhancedBrickPrefab) return null;
          var brickNode = instantiate(this.enhancedBrickPrefab);
          var brickComponent = brickNode.getComponent(_crd && EnhancedBrick === void 0 ? (_reportPossibleCrUseOfEnhancedBrick({
            error: Error()
          }), EnhancedBrick) : EnhancedBrick);

          if (brickComponent) {
            brickComponent.brickType = brickType; // Scale health based on difficulty

            var baseHealth = this.getBaseHealthForBrickType(brickType);
            brickComponent.health = Math.max(1, Math.floor(baseHealth * (1 + difficulty * 0.3))); // Scale score based on difficulty and brick type

            var baseScore = this.getBaseScoreForBrickType(brickType);
            brickComponent.scoreValue = Math.floor(baseScore * (1 + difficulty * 0.2));
          }

          brickNode.setWorldPosition(position);
          return brickNode;
        }

        getBaseHealthForBrickType(brickType) {
          switch (brickType) {
            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL:
              return 1;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED:
              return 3;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING:
              return 2;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).SHIELD:
              return 4;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).METAL:
              return 5;

            default:
              return 1;
          }
        }

        getBaseScoreForBrickType(brickType) {
          switch (brickType) {
            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).NORMAL:
              return 10;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REINFORCED:
              return 30;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPLOSIVE:
              return 25;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).ELECTRIC:
              return 20;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).EXPERIENCE:
              return 15;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).REGENERATING:
              return 40;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).PHASE:
              return 35;

            case (_crd && BrickType === void 0 ? (_reportPossibleCrUseOfBrickType({
              error: Error()
            }), BrickType) : BrickType).VOID:
              return 100;

            default:
              return 15;
          }
        } // Pattern generation methods


        generateSymmetricPattern(template) {
          var positions = [];
          var centerX = this.gridWidth / 2;

          for (var row = 0; row < Math.min(this.gridHeight, 4); row++) {
            for (var col = 0; col < Math.floor(this.gridWidth / 2); col++) {
              if (Math.random() < 0.7) {
                // 70% chance to place brick
                var x1 = (col - centerX + 0.5) * this.brickSpacing;
                var x2 = (this.gridWidth - col - 1 - centerX + 0.5) * this.brickSpacing;
                var y = this.startY - row * (this.brickSpacing * 0.6);
                positions.push(new Vec3(x1, y, 0));

                if (col !== Math.floor(this.gridWidth / 2) - 1) {
                  // Don't duplicate center column
                  positions.push(new Vec3(x2, y, 0));
                }
              }
            }
          }

          return positions.slice(0, template.brickCount);
        }

        generateCorridorPattern(template) {
          var positions = []; // Create corridors with walls

          for (var row = 0; row < this.gridHeight; row++) {
            for (var col = 0; col < this.gridWidth; col++) {
              var isWall = col === 0 || col === this.gridWidth - 1 || row % 2 === 0 && col % 3 === 1;

              if (isWall && Math.random() < 0.8) {
                var x = (col - this.gridWidth / 2 + 0.5) * this.brickSpacing;
                var y = this.startY - row * (this.brickSpacing * 0.6);
                positions.push(new Vec3(x, y, 0));
              }
            }
          }

          return positions.slice(0, template.brickCount);
        }

        generateSpiralPattern(template) {
          var positions = [];
          var centerRow = Math.floor(this.gridHeight / 2);
          var centerCol = Math.floor(this.gridWidth / 2);
          var currentRow = centerRow;
          var currentCol = centerCol;
          var direction = 0; // 0: right, 1: down, 2: left, 3: up

          var steps = 1;
          var stepCount = 0;
          var directionChanges = 0;

          while (positions.length < template.brickCount && currentRow >= 0 && currentRow < this.gridHeight && currentCol >= 0 && currentCol < this.gridWidth) {
            var x = (currentCol - this.gridWidth / 2 + 0.5) * this.brickSpacing;
            var y = this.startY - currentRow * (this.brickSpacing * 0.6);
            positions.push(new Vec3(x, y, 0)); // Move in current direction

            switch (direction) {
              case 0:
                currentCol++;
                break;
              // right

              case 1:
                currentRow++;
                break;
              // down

              case 2:
                currentCol--;
                break;
              // left

              case 3:
                currentRow--;
                break;
              // up
            }

            stepCount++; // Check if we need to change direction

            if (stepCount === steps) {
              direction = (direction + 1) % 4;
              stepCount = 0;
              directionChanges++; // Increase steps every two direction changes

              if (directionChanges % 2 === 0) {
                steps++;
              }
            }
          }

          return positions;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enhancedBrickPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gridWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gridHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "brickSpacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 65;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "startY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d03c676bf2b71b906d715ff6f1fb96e2ce984e8c.js.map