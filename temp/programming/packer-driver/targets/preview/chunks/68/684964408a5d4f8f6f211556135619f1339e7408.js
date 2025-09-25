System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, Vec3, UITransform, Canvas, BoxCollider2D, Sprite, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, PaddleController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      input = _cc.input;
      Input = _cc.Input;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
      Canvas = _cc.Canvas;
      BoxCollider2D = _cc.BoxCollider2D;
      Sprite = _cc.Sprite;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a1b2cPU5fZ4kKvN7xI0VniQ", "PaddleController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'EventTouch', 'Vec3', 'UITransform', 'Canvas', 'Camera', 'Vec2', 'Touch', 'BoxCollider2D', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PaddleController", PaddleController = (_dec = ccclass('PaddleController'), _dec(_class = (_class2 = class PaddleController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "speed", _descriptor, this);

          _initializerDefineProperty(this, "basePaddleWidth", _descriptor2, this);

          // 基础宽度
          _initializerDefineProperty(this, "basePaddleHeight", _descriptor3, this);

          // 基础高度
          _initializerDefineProperty(this, "boundaryMargin", _descriptor4, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor5, this);

          // 动态属性
          this._currentScale = 1.0;
          // 当前缩放倍数
          this._currentWidth = 120;
          // 当前实际宽度
          this._boxCollider = null;
          this._sprite = null;
          this._canvasComponent = null;
          this._uiTransform = null;
          this._camera = null;
          this._isTouching = false;
          this._lastTouchX = 0;
          this._screenWidth = 640;
        }

        // 竖屏宽度640，不是960
        onLoad() {
          var _this$node$parent, _this$_canvasComponen;

          this._uiTransform = this.getComponent(UITransform);
          this._canvasComponent = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponent(Canvas)) || null;
          this._camera = ((_this$_canvasComponen = this._canvasComponent) == null ? void 0 : _this$_canvasComponen.cameraComponent) || null; // 获取组件引用

          this._boxCollider = this.getComponent(BoxCollider2D);
          this._sprite = this.getComponent(Sprite); // 初始化尺寸

          this._currentWidth = this.basePaddleWidth;
          this.updatePaddleSize();
        }

        onEnable() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        } // 测试需要的移动方法


        moveLeft(deltaTime) {
          var currentPos = this.node.getPosition();
          var newX = currentPos.x - this.speed * deltaTime;
          var clampedX = this.clampToScreenBounds(newX);
          this.node.setPosition(clampedX, currentPos.y, currentPos.z);
        }

        moveRight(deltaTime) {
          var currentPos = this.node.getPosition();
          var newX = currentPos.x + this.speed * deltaTime;
          var clampedX = this.clampToScreenBounds(newX);
          this.node.setPosition(clampedX, currentPos.y, currentPos.z);
        }

        clampToScreenBounds(x) {
          var leftBound = -(this._screenWidth / 2) + this._currentWidth / 2 + this.boundaryMargin;
          var rightBound = this._screenWidth / 2 - this._currentWidth / 2 - this.boundaryMargin;
          return Math.max(leftBound, Math.min(rightBound, x));
        }

        onTouchStart(event) {
          var touches = event.getTouches();

          if (touches.length > 0) {
            var touch = touches[0];
            this._isTouching = true;
            this._lastTouchX = touch.getLocationX();
          }
        }

        onTouchEnd(event) {
          this._isTouching = false;
        }

        onTouchMove(event) {
          this.updatePaddlePosition(event.getLocation());
        }

        onMouseMove(event) {
          this.updatePaddlePosition(event.getLocation());
        }

        updatePaddlePosition(screenPos) {
          var _this$node$parent2;

          if (!this._camera || !this._uiTransform) return;

          var worldPos = this._camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));

          var localPos = ((_this$node$parent2 = this.node.parent) == null || (_this$node$parent2 = _this$node$parent2.getComponent(UITransform)) == null ? void 0 : _this$node$parent2.convertToNodeSpaceAR(worldPos)) || worldPos;
          var clampedX = this.clampToScreenBounds(localPos.x);
          this.node.setPosition(clampedX, this.node.position.y, this.node.position.z);
        } // 公共访问器供测试使用


        get isTouching() {
          return this._isTouching;
        }

        get lastTouchX() {
          return this._lastTouchX;
        }

        get screenWidth() {
          return this._screenWidth;
        }

        set screenWidth(value) {
          this._screenWidth = value;
        } // ===== 动态尺寸管理系统 =====

        /**
         * 更新paddle尺寸 - 同时更新精灵、碰撞器、边界计算
         */


        updatePaddleSize() {
          if (!this._boxCollider || !this._sprite) return; // 更新碰撞器尺寸

          this._boxCollider.size.width = this.basePaddleWidth * this._currentScale;
          this._boxCollider.size.height = this.basePaddleHeight * this._currentScale; // 更新精灵缩放 (保持原始精灵比例)

          this.node.setScale(this._currentScale, this._currentScale, 1); // 更新当前宽度用于边界计算

          this._currentWidth = this.basePaddleWidth * this._currentScale;
          console.log("Paddle size updated: scale=" + this._currentScale + ", width=" + this._currentWidth);
        }
        /**
         * 设置paddle缩放 - 道具效果调用
         * @param scale 缩放倍数 (1.0=正常, 1.5=150%, 0.8=80%)
         */


        setPaddleScale(scale) {
          this._currentScale = Math.max(0.3, Math.min(3.0, scale)); // 限制30%-300%

          this.updatePaddleSize();
        }
        /**
         * 增加paddle尺寸 - 道具效果
         * @param multiplier 倍数增量 (1.2=增加20%)
         */


        enlargePaddle(multiplier) {
          if (multiplier === void 0) {
            multiplier = 1.3;
          }

          this.setPaddleScale(this._currentScale * multiplier);
        }
        /**
         * 缩小paddle尺寸 - 负面效果
         * @param multiplier 倍数减量 (0.8=减少20%)
         */


        shrinkPaddle(multiplier) {
          if (multiplier === void 0) {
            multiplier = 0.7;
          }

          this.setPaddleScale(this._currentScale * multiplier);
        }
        /**
         * 重置paddle到基础尺寸
         */


        resetPaddleSize() {
          this.setPaddleScale(1.0);
        }
        /**
         * 获取当前paddle实际宽度 - 供其他系统使用
         */


        getCurrentWidth() {
          return this._currentWidth;
        }
        /**
         * 获取当前缩放倍数
         */


        getCurrentScale() {
          return this._currentScale;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "basePaddleWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 120;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "basePaddleHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 24;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "boundaryMargin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 500;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=684964408a5d4f8f6f211556135619f1339e7408.js.map