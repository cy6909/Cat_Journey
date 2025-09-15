System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Graphics, _dec, _class, _class2, _descriptor, _crd, ccclass, property, SimpleBackgroundTest;

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

      _cclegacy._RF.push({}, "4ecfe+JmR1OpZYTpuhkYfF6", "SimpleBackgroundTest", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'Node', 'Graphics']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SimpleBackgroundTest", SimpleBackgroundTest = (_dec = ccclass('SimpleBackgroundTest'), _dec(_class = (_class2 = class SimpleBackgroundTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "testColor", _descriptor, this);
        }

        // 蓝色测试
        onLoad() {
          console.log('SimpleBackgroundTest: Starting simple test');
          this.createSimpleBackground();
        }

        createSimpleBackground() {
          const transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('SimpleBackgroundTest: UITransform not found');
            return;
          }

          console.log(`SimpleBackgroundTest: Node size is ${transform.width}x${transform.height}`); // 方法1: 使用Graphics组件绘制简单矩形

          this.testWithGraphics(transform); // 方法2: 创建简单纹理测试

          setTimeout(() => {
            this.testWithTexture(transform);
          }, 1000);
        }

        testWithGraphics(transform) {
          console.log('SimpleBackgroundTest: Testing with Graphics');
          const graphics = this.node.addComponent(Graphics);
          graphics.fillColor = this.testColor;
          graphics.rect(-transform.width / 2, -transform.height / 2, transform.width, transform.height);
          graphics.fill();
          console.log('SimpleBackgroundTest: Graphics rect drawn');
        }

        testWithTexture(transform) {
          console.log('SimpleBackgroundTest: Testing with Texture'); // 移除Graphics组件

          const graphics = this.node.getComponent(Graphics);

          if (graphics) {
            graphics.destroy();
          } // 创建简单的纹理


          const texture = this.createSolidTexture(transform.width, transform.height, this.testColor);
          const sprite = this.node.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          sprite.spriteFrame = spriteFrame;
          console.log('SimpleBackgroundTest: Texture sprite created');
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
          return texture;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "testColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(0, 100, 200, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=98e7667979792bda1e1e66ff6e22ddd5fe83cae6.js.map