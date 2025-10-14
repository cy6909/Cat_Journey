System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Vec2, Collider2D, Contact2DType, Sprite, Color, GameManager, ExperienceManager, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, SimpleExperienceOrb;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "../gameplay/GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfExperienceManager(extras) {
    _reporterNs.report("ExperienceManager", "./ExperienceManager", _context.meta, extras);
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
      Vec2 = _cc.Vec2;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      Sprite = _cc.Sprite;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      ExperienceManager = _unresolved_3.ExperienceManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d4af8tAW/tGZZPhRhrD1ofS", "SimpleExperienceOrb", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Vec2', 'Collider2D', 'Contact2DType', 'IPhysics2DContact', 'Sprite', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 简化版经验球组件
       *
       * Linus式设计：移除复杂物理，使用简单位置更新
       * "好品味意味着消除特殊情况"
       */

      _export("SimpleExperienceOrb", SimpleExperienceOrb = (_dec = ccclass('SimpleExperienceOrb'), _dec(_class = (_class2 = class SimpleExperienceOrb extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "experienceValue", _descriptor, this);

          _initializerDefineProperty(this, "fallSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "magnetRange", _descriptor3, this);

          _initializerDefineProperty(this, "magnetSpeed", _descriptor4, this);

          this._velocity = new Vec2(0, -150);
          this._paddleNode = null;
          this._isCollected = false;
          this._lifeTime = 0;
        }

        onLoad() {
          // 设置碰撞检测
          var collider = this.getComponent(Collider2D);

          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          } // 初始化随机横向速度


          this._velocity.x = (Math.random() - 0.5) * 50;
          this._velocity.y = -this.fallSpeed;
        }

        start() {
          // 查找挡板节点
          var gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            this._paddleNode = gameManager.getPaddleNode();
          }
        }

        update(dt) {
          if (this._isCollected) return; // 生命周期管理 - 8秒后自动销毁

          this._lifeTime += dt;

          if (this._lifeTime > 8) {
            this.node.destroy();
            return;
          }

          var currentPos = this.node.position; // 磁力吸引效果

          if (this._paddleNode && this._paddleNode.isValid) {
            var distance = Vec3.distance(currentPos, this._paddleNode.position);

            if (distance < this.magnetRange) {
              // 计算吸引方向
              var direction = new Vec3();
              Vec3.subtract(direction, this._paddleNode.position, currentPos);
              direction.normalize(); // 应用磁力

              this._velocity.x = direction.x * this.magnetSpeed;
              this._velocity.y = direction.y * this.magnetSpeed;
            }
          } // 更新位置


          var newPos = new Vec3(currentPos.x + this._velocity.x * dt, currentPos.y + this._velocity.y * dt, currentPos.z); // 边界检查 - 防止飞出屏幕

          if (newPos.y < -400) {
            this.node.destroy();
            return;
          }

          this.node.setPosition(newPos);
        }

        onBeginContact(selfCollider, otherCollider, contact) {
          if (this._isCollected) return;
          var otherNode = otherCollider.node; // 检查是否被挡板收集

          if (otherNode.name.includes('Paddle')) {
            this.collect();
          }
        }

        collect() {
          if (this._isCollected) return;
          this._isCollected = true; // 添加经验值

          var expManager = (_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
            error: Error()
          }), ExperienceManager) : ExperienceManager).getInstance();

          if (expManager) {
            expManager.addExperience(this.experienceValue);
          } // 简单的收集效果


          this.playCollectEffect(); // 延迟销毁，让效果播放

          this.scheduleOnce(() => {
            this.node.destroy();
          }, 0.2);
        }

        playCollectEffect() {
          // 简单的闪光效果
          var sprite = this.getComponent(Sprite);

          if (sprite) {
            sprite.color = new Color(255, 255, 255, 255);
          } // 缩放动画


          this.node.setScale(1.5, 1.5, 1);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "experienceValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fallSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "magnetRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "magnetSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=18e2d5a3b471d6635d936c2c6f4b5061c68562a4.js.map