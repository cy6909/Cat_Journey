System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Vec2, GameManager, ExperienceManager, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, UltraSimpleExperienceOrb;

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
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      ExperienceManager = _unresolved_3.ExperienceManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3d5f8gYdwNNuI4m+hBKL38s", "UltraSimpleExperienceOrb", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 极简经验球组件 - 无物理依赖版本
       *
       * Linus式设计：删除所有不必要的复杂性
       * - 无RigidBody2D
       * - 无Collider2D
       * - 纯位置检测
       */

      _export("UltraSimpleExperienceOrb", UltraSimpleExperienceOrb = (_dec = ccclass('UltraSimpleExperienceOrb'), _dec(_class = (_class2 = class UltraSimpleExperienceOrb extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "experienceValue", _descriptor, this);

          _initializerDefineProperty(this, "fallSpeed", _descriptor2, this);

          // 掉落速度
          this._velocity = new Vec2(0, -150);
          this._paddleNode = null;
          this._isCollected = false;
          this._lifeTime = 0;
        }

        start() {
          // 查找挡板
          const gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance();

          if (gameManager) {
            this._paddleNode = gameManager.getPaddleNode();
          } // 初始速度 - 直接向下掉落


          this._velocity.x = 0;
          this._velocity.y = -this.fallSpeed;
        }

        update(dt) {
          if (this._isCollected) return; // 生命周期管理 - 10秒后消失

          this._lifeTime += dt;

          if (this._lifeTime > 10) {
            this.node.destroy();
            return;
          } // 使用世界坐标进行碰撞检测


          const currentWorldPos = this.node.getWorldPosition(); // 检查是否碰到挡板

          if (this._paddleNode && this._paddleNode.isValid) {
            const paddleWorldPos = this._paddleNode.getWorldPosition(); // 简单的矩形碰撞检测


            const xDiff = Math.abs(currentWorldPos.x - paddleWorldPos.x);
            const yDiff = Math.abs(currentWorldPos.y - paddleWorldPos.y); // 挡板宽度约80，高度约20；经验球约20x20
            // 碰撞检测：x方向 < 50 (40+10), y方向 < 30 (10+20)

            if (xDiff < 50 && yDiff < 30) {
              this.collect();
              return;
            }
          } // 更新位置 - 简单的向下掉落


          const currentLocalPos = this.node.position;
          const newPos = new Vec3(currentLocalPos.x, currentLocalPos.y + this._velocity.y * dt, currentLocalPos.z); // 底部边界检查 - 掉出屏幕则销毁

          if (newPos.y < -400) {
            this.node.destroy();
            return;
          }

          this.node.setPosition(newPos);
        }

        collect() {
          if (this._isCollected) return;
          this._isCollected = true; // 添加经验值

          const expManager = (_crd && ExperienceManager === void 0 ? (_reportPossibleCrUseOfExperienceManager({
            error: Error()
          }), ExperienceManager) : ExperienceManager).getInstance();

          if (expManager) {
            expManager.addExperience(this.experienceValue);
          } // 直接销毁，不播放动画


          this.node.destroy();
        } // 公开方法，用于测试


        forceCollect() {
          this.collect();
        }

        setPaddleNode(paddle) {
          this._paddleNode = paddle;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "experienceValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fallSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f2462285db90f142907e93500820a0be734391ef.js.map