System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Graphics, _dec, _class, _class2, _descriptor, _crd, ccclass, property, CanvasBackgroundTest;

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
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Texture2D = _cc.Texture2D;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      Graphics = _cc.Graphics;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3c943BswZVIWLxACyBLp3L5", "CanvasBackgroundTest", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'Graphics']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CanvasBackgroundTest", CanvasBackgroundTest = (_dec = ccclass('CanvasBackgroundTest'), _dec(_class = (_class2 = class CanvasBackgroundTest extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "useGraphics", _descriptor, this);
        }

        // 优先使用Graphics
        onLoad() {
          console.log('=== CanvasBackgroundTest: Canvas相机背景测试 ===');
          this.setupBackground();
        }

        setupBackground() {
          // 1. 设置节点尺寸
          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            transform = this.node.addComponent(UITransform);
          }

          transform.setContentSize(960, 640);
          transform.setAnchorPoint(0.5, 0.5);
          console.log("\u8BBE\u7F6E\u8282\u70B9\u5C3A\u5BF8: " + transform.width + "x" + transform.height); // 2. 清除现有组件

          var existingGraphics = this.node.getComponent(Graphics);
          var existingSprites = this.node.getComponents(Sprite);
          if (existingGraphics) existingGraphics.destroy();
          existingSprites.forEach(sprite => sprite.destroy());

          if (this.useGraphics) {
            this.createGraphicsBackground();
          } else {
            this.createSpriteBackground();
          }
        }

        createGraphicsBackground() {
          console.log('使用Graphics创建背景');
          var graphics = this.node.addComponent(Graphics);
          var transform = this.node.getComponent(UITransform); // 创建洋红色矩形

          graphics.fillColor = new Color(255, 0, 255, 255);
          graphics.rect(-transform.width / 2, -transform.height / 2, transform.width, transform.height);
          graphics.fill();
          console.log("Graphics\u77E9\u5F62\u521B\u5EFA\u5B8C\u6210: " + transform.width + "x" + transform.height);
        }

        createSpriteBackground() {
          console.log('使用Sprite创建背景');
          var transform = this.node.getComponent(UITransform); // 创建1x1像素纹理

          var texture = new Texture2D();
          texture.reset({
            width: 1,
            height: 1,
            format: Texture2D.PixelFormat.RGBA8888
          }); // 洋红色像素数据

          var data = new Uint8Array([255, 0, 255, 255]);
          texture.uploadData(data); // 创建SpriteFrame

          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture; // 添加Sprite组件

          var sprite = this.node.addComponent(Sprite);
          sprite.spriteFrame = spriteFrame;
          sprite.type = Sprite.Type.SIMPLE;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE;
          console.log("Sprite\u80CC\u666F\u521B\u5EFA\u5B8C\u6210");
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "useGraphics", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0843fc114b8d9a95740215e1b33426f17fea630f.js.map