System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, Vec3, UITransform, Canvas, _dec, _class, _class2, _descriptor, _crd, ccclass, property, PaddleController;

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

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'EventTouch', 'Vec3', 'UITransform', 'Canvas', 'Camera', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PaddleController", PaddleController = (_dec = ccclass('PaddleController'), _dec(_class = (_class2 = class PaddleController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          this._canvasComponent = null;
          this._uiTransform = null;
          this._camera = null;
        }

        onLoad() {
          var _this$node$parent, _this$_canvasComponen;

          this._uiTransform = this.getComponent(UITransform);
          this._canvasComponent = ((_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.getComponent(Canvas)) || null;
          this._camera = ((_this$_canvasComponen = this._canvasComponent) == null ? void 0 : _this$_canvasComponen.cameraComponent) || null;
        }

        onEnable() {
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        }

        onTouchMove(event) {
          this.updatePaddlePosition(event.getLocation());
        }

        onMouseMove(event) {
          this.updatePaddlePosition(event.getLocation());
        }

        updatePaddlePosition(screenPos) {
          var _this$node$parent2, _this$_canvasComponen2;

          if (!this._camera || !this._uiTransform) return;

          const worldPos = this._camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));

          const localPos = ((_this$node$parent2 = this.node.parent) == null || (_this$node$parent2 = _this$node$parent2.getComponent(UITransform)) == null ? void 0 : _this$node$parent2.convertToNodeSpaceAR(worldPos)) || worldPos;
          const paddleHalfWidth = this._uiTransform.width / 2;
          const canvasWidth = ((_this$_canvasComponen2 = this._canvasComponent) == null || (_this$_canvasComponen2 = _this$_canvasComponen2.getComponent(UITransform)) == null ? void 0 : _this$_canvasComponen2.width) || 960;
          const leftBound = -canvasWidth / 2 + paddleHalfWidth;
          const rightBound = canvasWidth / 2 - paddleHalfWidth;
          const clampedX = Math.max(leftBound, Math.min(rightBound, localPos.x));
          this.node.setPosition(clampedX, this.node.position.y, this.node.position.z);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
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
//# sourceMappingURL=c84bdbfddb90f0fe00f6e41a1a573bde60be2d68.js.map