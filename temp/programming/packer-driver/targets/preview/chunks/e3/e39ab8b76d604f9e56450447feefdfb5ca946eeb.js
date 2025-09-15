System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, StarFieldBackground;

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d3860HpK+5PtK9+ANP8zsO5", "StarFieldBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("StarFieldBackground", StarFieldBackground = (_dec = ccclass('StarFieldBackground'), _dec(_class = (_class2 = class StarFieldBackground extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "starCount", _descriptor, this);

          _initializerDefineProperty(this, "layerCount", _descriptor2, this);

          // 多层星空效果
          _initializerDefineProperty(this, "bgStartColor", _descriptor3, this);

          // #000814
          _initializerDefineProperty(this, "bgEndColor", _descriptor4, this);
        }

        // #001845
        onLoad() {
          this.createEnhancedBackground();
        }

        createEnhancedBackground() {
          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('UITransform component not found');
            return;
          } // 创建多层背景


          this.createGradientLayer(transform);
          this.createMultiLayerStars(transform);
          this.createNebulaEffect(transform);
        }

        createGradientLayer(transform) {
          var gradientTexture = this.createGradientTexture(transform.width, transform.height);
          var gradientSprite = this.node.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = gradientTexture;
          gradientSprite.spriteFrame = spriteFrame;
        }

        createGradientTexture(width, height) {
          var texture = new Texture2D();
          texture.reset({
            width: Math.floor(width),
            height: Math.floor(height),
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(width * height * 4);

          for (var y = 0; y < height; y++) {
            var ratio = y / height;
            var r = Math.floor(this.bgStartColor.r + (this.bgEndColor.r - this.bgStartColor.r) * ratio);
            var g = Math.floor(this.bgStartColor.g + (this.bgEndColor.g - this.bgStartColor.g) * ratio);
            var b = Math.floor(this.bgStartColor.b + (this.bgEndColor.b - this.bgStartColor.b) * ratio);

            for (var x = 0; x < width; x++) {
              var index = (y * width + x) * 4;
              data[index] = r; // R

              data[index + 1] = g; // G

              data[index + 2] = b; // B

              data[index + 3] = 255; // A
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createMultiLayerStars(transform) {
          for (var layer = 0; layer < this.layerCount; layer++) {
            this.createStarLayer(transform, layer);
          }
        }

        createStarLayer(transform, layerIndex) {
          var starTexture = this.createStarTexture(transform.width, transform.height, layerIndex);
          var starSprite = this.node.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = starTexture;
          starSprite.spriteFrame = spriteFrame; // 设置透明度和层次

          var alpha = 255 - layerIndex * 50;
          starSprite.color = new Color(255, 255, 255, alpha);
        }

        createStarTexture(width, height, layerIndex) {
          var texture = new Texture2D();
          texture.reset({
            width: Math.floor(width),
            height: Math.floor(height),
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(width * height * 4);
          var starsInLayer = Math.floor(this.starCount / this.layerCount);
          var starSize = 2 + layerIndex; // 不同层星星大小不同
          // 初始化为透明

          for (var i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 透明
          } // 绘制星星


          for (var _i = 0; _i < starsInLayer; _i++) {
            var x = Math.floor(Math.random() * width);
            var y = Math.floor(Math.random() * height);
            var brightness = 150 + Math.random() * 105; // 150-255

            this.drawStar(data, width, height, x, y, starSize, brightness);
          }

          texture.uploadData(data);
          return texture;
        }

        drawStar(data, width, height, centerX, centerY, size, brightness) {
          for (var dy = -size; dy <= size; dy++) {
            for (var dx = -size; dx <= size; dx++) {
              var x = centerX + dx;
              var y = centerY + dy;

              if (x >= 0 && x < width && y >= 0 && y < height) {
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= size) {
                  var alpha = Math.max(0, brightness * (1 - distance / size));
                  var index = (y * width + x) * 4;
                  data[index] = brightness; // R

                  data[index + 1] = brightness; // G

                  data[index + 2] = brightness; // B

                  data[index + 3] = alpha; // A
                }
              }
            }
          }
        }

        createNebulaEffect(transform) {
          var nebulaTexture = this.createNebulaTexture(transform.width, transform.height);
          var nebulaSprite = this.node.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = nebulaTexture;
          nebulaSprite.spriteFrame = spriteFrame;
          nebulaSprite.color = new Color(255, 255, 255, 80); // 半透明
        }

        createNebulaTexture(width, height) {
          var texture = new Texture2D();
          texture.reset({
            width: Math.floor(width),
            height: Math.floor(height),
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(width * height * 4); // 使用柏林噪声模拟的简化版本

          for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
              var index = (y * width + x) * 4; // 简单的噪声函数

              var noise = this.simpleNoise(x * 0.01, y * 0.01);
              var intensity = Math.max(0, noise * 100);
              data[index] = Math.floor(intensity * 0.8); // R - 偏红

              data[index + 1] = Math.floor(intensity * 0.4); // G

              data[index + 2] = Math.floor(intensity * 1.2); // B - 偏蓝

              data[index + 3] = Math.floor(intensity * 0.6); // A
            }
          }

          texture.uploadData(data);
          return texture;
        }

        simpleNoise(x, y) {
          // 简单的伪随机噪声函数
          var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          n = n - Math.floor(n);
          return n;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "starCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "layerCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bgStartColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 8, 20, 255);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bgEndColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 24, 69, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e39ab8b76d604f9e56450447feefdfb5ca946eeb.js.map