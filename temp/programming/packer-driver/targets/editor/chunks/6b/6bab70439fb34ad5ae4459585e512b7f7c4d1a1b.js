System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Widget, view, _dec, _class, _class2, _descriptor, _crd, ccclass, property, QuickBackgroundFix;

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
      Widget = _cc.Widget;
      view = _cc.view;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3c005LTXvNKP7TYDV0macB8", "QuickBackgroundFix", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'Widget', 'view']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("QuickBackgroundFix", QuickBackgroundFix = (_dec = ccclass('QuickBackgroundFix'), _dec(_class = (_class2 = class QuickBackgroundFix extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "backgroundColor", _descriptor, this);
        }

        // 明亮的蓝色
        onLoad() {
          console.log('QuickBackgroundFix: Starting quick fix');
          this.setupFullScreenBackground();
        }

        setupFullScreenBackground() {
          // 1. 确保有UITransform组件
          let transform = this.node.getComponent(UITransform);

          if (!transform) {
            transform = this.node.addComponent(UITransform);
          } // 2. 获取并设置全屏尺寸


          const designSize = view.getDesignResolutionSize();
          const screenSize = view.getVisibleSize(); // 使用最大尺寸确保覆盖全屏

          const width = Math.max(designSize.width, screenSize.width, 960);
          const height = Math.max(designSize.height, screenSize.height, 640);
          console.log(`QuickBackgroundFix: Setting size to ${width}x${height}`);
          transform.setContentSize(width, height);
          transform.setAnchorPoint(0.5, 0.5); // 3. 添加Widget自动适配

          let widget = this.node.getComponent(Widget);

          if (!widget) {
            widget = this.node.addComponent(Widget);
          } // Widget配置 - 填满整个屏幕


          widget.isAlignLeft = true;
          widget.isAlignRight = true;
          widget.isAlignTop = true;
          widget.isAlignBottom = true;
          widget.left = 0;
          widget.right = 0;
          widget.top = 0;
          widget.bottom = 0;
          widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
          widget.updateAlignment(); // 4. 创建简单的纯色背景

          this.createSolidBackground();
          console.log(`QuickBackgroundFix: Background created with final size ${transform.width}x${transform.height}`);
        }

        createSolidBackground() {
          const transform = this.node.getComponent(UITransform);
          const texture = this.createSolidTexture(transform.width, transform.height, this.backgroundColor); // 移除现有的Sprite组件

          const existingSprites = this.node.getComponents(Sprite);
          existingSprites.forEach(sprite => sprite.destroy()); // 添加新的Sprite

          const sprite = this.node.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          sprite.spriteFrame = spriteFrame;
          sprite.color = Color.WHITE;
          console.log('QuickBackgroundFix: Solid background texture applied');
        }

        createSolidTexture(width, height, color) {
          const texture = new Texture2D();
          const w = Math.max(1, Math.floor(width));
          const h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(w * h * 4); // 填充纯色

          for (let i = 0; i < data.length; i += 4) {
            data[i] = color.r; // R

            data[i + 1] = color.g; // G

            data[i + 2] = color.b; // B

            data[i + 3] = color.a; // A
          }

          texture.uploadData(data);
          console.log(`QuickBackgroundFix: Created texture ${w}x${h} with color (${color.r},${color.g},${color.b},${color.a})`);
          return texture;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "backgroundColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(30, 60, 120, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6bab70439fb34ad5ae4459585e512b7f7c4d1a1b.js.map