System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Node, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, StarFieldBackground;

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
      view = _cc.view;
      Node = _cc.Node;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d3860HpK+5PtK9+ANP8zsO5", "StarFieldBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'view', 'Widget', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("StarFieldBackground", StarFieldBackground = (_dec = ccclass('StarFieldBackground'), _dec(_class = (_class2 = class StarFieldBackground extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "starCount", _descriptor, this);

          _initializerDefineProperty(this, "layerCount", _descriptor2, this);

          _initializerDefineProperty(this, "bgStartColor", _descriptor3, this);

          // 保持原始颜色
          _initializerDefineProperty(this, "bgEndColor", _descriptor4, this);
        }

        // 保持原始颜色
        onLoad() {
          this.createEnhancedBackground();
        }

        createEnhancedBackground() {
          const transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('UITransform component not found');
            return;
          } // 确保尺寸设置正确


          this.setupNodeSize(transform); // 创建多层背景 - 使用独立子节点避免多Sprite冲突

          this.createGradientLayer(transform);
          this.createMultiLayerStars(transform);
          this.createNebulaEffect(transform);
        }

        setupNodeSize(transform) {
          // 获取合适的尺寸
          const designSize = view.getDesignResolutionSize();
          const targetWidth = Math.max(designSize.width, 960);
          const targetHeight = Math.max(designSize.height, 640);
          transform.setContentSize(targetWidth, targetHeight);
          transform.setAnchorPoint(0.5, 0.5);
        }

        createGradientLayer(transform) {
          const gradientNode = new Node('GradientLayer');
          gradientNode.setParent(this.node); // 设置子节点的UITransform

          const layerTransform = gradientNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5); // 创建渐变纹理

          const gradientTexture = this.createGradientTexture(transform.width, transform.height);
          const sprite = gradientNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = gradientTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 关键：防止尺寸自动调整

          sprite.color = Color.WHITE;
        }

        createMultiLayerStars(transform) {
          for (let layer = 0; layer < this.layerCount; layer++) {
            this.createStarLayer(transform, layer);
          }
        }

        createStarLayer(transform, layerIndex) {
          const starNode = new Node(`StarLayer${layerIndex}`);
          starNode.setParent(this.node); // 设置子节点的UITransform

          const layerTransform = starNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5); // 创建星星纹理

          const starTexture = this.createStarTexture(transform.width, transform.height, layerIndex);
          const sprite = starNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = starTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 关键：防止尺寸自动调整
          // 设置透明度和层次

          const alpha = 255 - layerIndex * 50;
          sprite.color = new Color(255, 255, 255, alpha);
        }

        createNebulaEffect(transform) {
          const nebulaNode = new Node('NebulaLayer');
          nebulaNode.setParent(this.node); // 设置子节点的UITransform

          const layerTransform = nebulaNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5); // 创建星云纹理

          const nebulaTexture = this.createNebulaTexture(transform.width, transform.height);
          const sprite = nebulaNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = nebulaTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 关键：防止尺寸自动调整

          sprite.color = new Color(255, 255, 255, 80); // 半透明
        }

        createGradientTexture(width, height) {
          const texture = new Texture2D();
          const w = Math.max(1, Math.floor(width));
          const h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(w * h * 4);

          for (let y = 0; y < h; y++) {
            const ratio = y / h;
            const r = Math.floor(this.bgStartColor.r + (this.bgEndColor.r - this.bgStartColor.r) * ratio);
            const g = Math.floor(this.bgStartColor.g + (this.bgEndColor.g - this.bgStartColor.g) * ratio);
            const b = Math.floor(this.bgStartColor.b + (this.bgEndColor.b - this.bgStartColor.b) * ratio);

            for (let x = 0; x < w; x++) {
              const index = (y * w + x) * 4;
              data[index] = r; // R

              data[index + 1] = g; // G

              data[index + 2] = b; // B

              data[index + 3] = 255; // A
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createStarTexture(width, height, layerIndex) {
          const texture = new Texture2D();
          const w = Math.max(1, Math.floor(width));
          const h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(w * h * 4);
          const starsInLayer = Math.floor(this.starCount / this.layerCount);
          const starSize = 2 + layerIndex; // 不同层星星大小不同
          // 初始化为透明

          for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 透明
          } // 绘制星星


          for (let i = 0; i < starsInLayer; i++) {
            const x = Math.floor(Math.random() * w);
            const y = Math.floor(Math.random() * h);
            const brightness = 150 + Math.random() * 105; // 150-255

            this.drawStar(data, w, h, x, y, starSize, brightness);
          }

          texture.uploadData(data);
          return texture;
        }

        createNebulaTexture(width, height) {
          const texture = new Texture2D();
          const w = Math.max(1, Math.floor(width));
          const h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(w * h * 4); // 使用柏林噪声模拟的简化版本

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const index = (y * w + x) * 4; // 简单的噪声函数

              const noise = this.simpleNoise(x * 0.01, y * 0.01);
              const intensity = Math.max(0, noise * 100);
              data[index] = Math.floor(intensity * 0.8); // R - 偏红

              data[index + 1] = Math.floor(intensity * 0.4); // G

              data[index + 2] = Math.floor(intensity * 1.2); // B - 偏蓝

              data[index + 3] = Math.floor(intensity * 0.6); // A
            }
          }

          texture.uploadData(data);
          return texture;
        }

        drawStar(data, width, height, centerX, centerY, size, brightness) {
          for (let dy = -size; dy <= size; dy++) {
            for (let dx = -size; dx <= size; dx++) {
              const x = centerX + dx;
              const y = centerY + dy;

              if (x >= 0 && x < width && y >= 0 && y < height) {
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= size) {
                  const alpha = Math.max(0, brightness * (1 - distance / size));
                  const index = (y * width + x) * 4;
                  data[index] = brightness; // R

                  data[index + 1] = brightness; // G

                  data[index + 2] = brightness; // B

                  data[index + 3] = alpha; // A
                }
              }
            }
          }
        }

        simpleNoise(x, y) {
          // 简单的伪随机噪声函数
          let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          n = n - Math.floor(n);
          return n;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "starCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 150;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "layerCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bgStartColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(0, 8, 20, 255);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bgEndColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(0, 24, 69, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=074a44263cdf1b2a586a1cafb9cce8ffad9ca2b1.js.map