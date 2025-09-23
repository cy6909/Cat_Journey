System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, Vec3, UITransform, Canvas, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, PaddleController;

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a1b2cPU5fZ4kKvN7xI0VniQ", "PaddleController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'EventTouch', 'Vec3', 'UITransform', 'Canvas', 'Camera', 'Vec2', 'Touch']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PaddleController", PaddleController = (_dec = ccclass('PaddleController'), _dec(_class = (_class2 = class PaddleController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "speed", _descriptor, this);

          _initializerDefineProperty(this, "paddleWidth", _descriptor2, this);

          _initializerDefineProperty(this, "boundaryMargin", _descriptor3, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor4, this);

          this._canvasComponent = null;
          this._uiTransform = null;
          this._camera = null;
          this._isTouching = false;
          this._lastTouchX = 0;
          this._screenWidth = 960;
        }

        onLoad() {
          var _this$node$parent, _this$_canvasComponen;

          this._uiTransform = this.getComponent(UITransform);
          this._canvasComponent = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponent(Canvas)) || null;
          this._camera = ((_this$_canvasComponen = this._canvasComponent) == null ? void 0 : _this$_canvasComponen.cameraComponent) || null;
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
          const currentPos = this.node.getPosition();
          const newX = currentPos.x - this.speed * deltaTime;
          const clampedX = this.clampToScreenBounds(newX);
          this.node.setPosition(clampedX, currentPos.y, currentPos.z);
        }

        moveRight(deltaTime) {
          const currentPos = this.node.getPosition();
          const newX = currentPos.x + this.speed * deltaTime;
          const clampedX = this.clampToScreenBounds(newX);
          this.node.setPosition(clampedX, currentPos.y, currentPos.z);
        }

        clampToScreenBounds(x) {
          const leftBound = -(this._screenWidth / 2) + this.paddleWidth / 2 + this.boundaryMargin;
          const rightBound = this._screenWidth / 2 - this.paddleWidth / 2 - this.boundaryMargin;
          return Math.max(leftBound, Math.min(rightBound, x));
        }

        onTouchStart(event) {
          const touches = event.getTouches();

          if (touches.length > 0) {
            const touch = touches[0];
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

          const worldPos = this._camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));

          const localPos = ((_this$node$parent2 = this.node.parent) == null || (_this$node$parent2 = _this$node$parent2.getComponent(UITransform)) == null ? void 0 : _this$node$parent2.convertToNodeSpaceAR(worldPos)) || worldPos;
          const clampedX = this.clampToScreenBounds(localPos.x);
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
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 300;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "paddleWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "boundaryMargin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=684964408a5d4f8f6f211556135619f1339e7408.js.map