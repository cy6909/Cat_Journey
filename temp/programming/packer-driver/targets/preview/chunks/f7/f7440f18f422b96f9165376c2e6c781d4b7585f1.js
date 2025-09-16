System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, Node, Widget, view, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, StarFieldBackgroundFixed;

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
      Node = _cc.Node;
      Widget = _cc.Widget;
      view = _cc.view;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d05b6s42zVJJb+h0QO7FDBA", "StarFieldBackgroundFixed", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'Node', 'Widget', 'Canvas', 'view']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("StarFieldBackgroundFixed", StarFieldBackgroundFixed = (_dec = ccclass('StarFieldBackgroundFixed'), _dec(_class = (_class2 = class StarFieldBackgroundFixed extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "starCount", _descriptor, this);

          _initializerDefineProperty(this, "layerCount", _descriptor2, this);

          _initializerDefineProperty(this, "bgStartColor", _descriptor3, this);

          // 更亮的起始色
          _initializerDefineProperty(this, "bgEndColor", _descriptor4, this);

          // 更亮的结束色
          _initializerDefineProperty(this, "debugMode", _descriptor5, this);
        }

        // 默认开启调试模式
        onLoad() {
          if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: onLoad started');
          }

          this.setupFullScreenBackground();
          this.createLayeredBackground();
        }

        setupFullScreenBackground() {
          // 1. 设置UITransform为全屏尺寸
          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('StarFieldBackgroundFixed: UITransform not found, adding one');
            this.node.addComponent(UITransform);
          } // 获取屏幕尺寸


          var screenSize = view.getVisibleSize();
          var designSize = view.getDesignResolutionSize(); // 使用设计分辨率或屏幕分辨率，取较大值确保全覆盖

          var targetWidth = Math.max(designSize.width, screenSize.width, 960);
          var targetHeight = Math.max(designSize.height, screenSize.height, 640);

          if (this.debugMode) {
            console.log("StarFieldBackgroundFixed: Screen size: " + screenSize.width + "x" + screenSize.height);
            console.log("StarFieldBackgroundFixed: Design size: " + designSize.width + "x" + designSize.height);
            console.log("StarFieldBackgroundFixed: Target size: " + targetWidth + "x" + targetHeight);
          } // 设置UITransform


          var finalTransform = this.node.getComponent(UITransform);
          finalTransform.setContentSize(targetWidth, targetHeight);
          finalTransform.setAnchorPoint(0.5, 0.5); // 2. 添加并配置Widget组件自动适应屏幕

          var widget = this.node.getComponent(Widget);

          if (!widget) {
            widget = this.node.addComponent(Widget);
          } // 配置Widget让背景填满整个屏幕


          widget.isAlignLeft = true;
          widget.isAlignRight = true;
          widget.isAlignTop = true;
          widget.isAlignBottom = true;
          widget.left = 0;
          widget.right = 0;
          widget.top = 0;
          widget.bottom = 0;
          widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE; // 3. 立即更新Widget

          widget.updateAlignment();

          if (this.debugMode) {
            console.log("StarFieldBackgroundFixed: Final size after Widget: " + finalTransform.width + "x" + finalTransform.height);
          }
        }

        createLayeredBackground() {
          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('StarFieldBackgroundFixed: UITransform component not found');
            return;
          }

          if (this.debugMode) {
            console.log("StarFieldBackgroundFixed: Creating background with size " + transform.width + "x" + transform.height);
          } // 清除现有的Sprite组件


          var existingSprites = this.node.getComponents(Sprite);
          existingSprites.forEach(sprite => {
            sprite.destroy();
          }); // 方法1: 创建单独的子节点为每一层

          this.createSeparateLayerNodes(transform);
        }

        createSeparateLayerNodes(transform) {
          // Layer 1: 渐变背景层
          var gradientLayer = this.createLayerNode('GradientLayer', transform, -100);
          this.addGradientToLayer(gradientLayer, transform); // Layer 2: 星星层

          for (var layer = 0; layer < this.layerCount; layer++) {
            var starLayer = this.createLayerNode("StarLayer" + layer, transform, -50 + layer);
            this.addStarsToLayer(starLayer, transform, layer);
          } // Layer 3: 星云层


          var nebulaLayer = this.createLayerNode('NebulaLayer', transform, 0);
          this.addNebulaToLayer(nebulaLayer, transform);

          if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: All layers created');
          }
        }

        createLayerNode(name, parentTransform, zIndex) {
          var layerNode = new Node(name);
          layerNode.setParent(this.node); // 设置UITransform

          var layerTransform = layerNode.addComponent(UITransform);
          layerTransform.setContentSize(parentTransform.width, parentTransform.height);
          layerTransform.setAnchorPoint(0.5, 0.5); // 设置层级

          layerNode.setSiblingIndex(zIndex + 100); // 确保正确的渲染顺序

          return layerNode;
        }

        addGradientToLayer(layerNode, transform) {
          var gradientTexture = this.createGradientTexture(transform.width, transform.height);
          var sprite = layerNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = gradientTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.color = Color.WHITE;

          if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: Gradient layer added');
          }
        }

        addStarsToLayer(layerNode, transform, layerIndex) {
          var starTexture = this.createStarTexture(transform.width, transform.height, layerIndex);
          var sprite = layerNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = starTexture;
          sprite.spriteFrame = spriteFrame; // 设置透明度，让星星层叠加显示

          var alpha = Math.max(100, 255 - layerIndex * 60);
          sprite.color = new Color(255, 255, 255, alpha);

          if (this.debugMode) {
            console.log("StarFieldBackgroundFixed: Star layer " + layerIndex + " added with alpha " + alpha);
          }
        }

        addNebulaToLayer(layerNode, transform) {
          var nebulaTexture = this.createNebulaTexture(transform.width, transform.height);
          var sprite = layerNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = nebulaTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.color = new Color(255, 255, 255, 120); // 提高透明度，避免过暗

          if (this.debugMode) {
            console.log('StarFieldBackgroundFixed: Nebula layer added');
          }
        }

        createGradientTexture(width, height) {
          var texture = new Texture2D();
          var w = Math.max(1, Math.floor(width));
          var h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4);

          for (var y = 0; y < h; y++) {
            var ratio = y / h;
            var r = Math.floor(this.bgStartColor.r + (this.bgEndColor.r - this.bgStartColor.r) * ratio);
            var g = Math.floor(this.bgStartColor.g + (this.bgEndColor.g - this.bgStartColor.g) * ratio);
            var b = Math.floor(this.bgStartColor.b + (this.bgEndColor.b - this.bgStartColor.b) * ratio);

            for (var x = 0; x < w; x++) {
              var index = (y * w + x) * 4;
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
          var texture = new Texture2D();
          var w = Math.max(1, Math.floor(width));
          var h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4);
          var starsInLayer = Math.floor(this.starCount / this.layerCount);
          var starSize = 1 + layerIndex; // 不同层星星大小
          // 初始化为透明

          for (var i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 完全透明
          } // 绘制星星


          for (var _i = 0; _i < starsInLayer; _i++) {
            var x = Math.floor(Math.random() * w);
            var y = Math.floor(Math.random() * h);
            var brightness = 180 + Math.random() * 75; // 180-255，更明亮

            this.drawStar(data, w, h, x, y, starSize, brightness);
          }

          texture.uploadData(data);
          return texture;
        }

        createNebulaTexture(width, height) {
          var texture = new Texture2D();
          var w = Math.max(1, Math.floor(width));
          var h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4);

          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              var index = (y * w + x) * 4; // 简化的噪声函数，创建更明显的星云效果

              var noise1 = this.simpleNoise(x * 0.02, y * 0.02);
              var noise2 = this.simpleNoise(x * 0.01, y * 0.01);
              var combinedNoise = (noise1 + noise2) * 0.5;
              var intensity = Math.max(0, combinedNoise * 150); // 提高强度

              if (intensity > 50) {
                // 只在噪声值较高的地方显示星云
                data[index] = Math.floor(intensity * 1.2); // R - 偏红紫

                data[index + 1] = Math.floor(intensity * 0.6); // G

                data[index + 2] = Math.floor(intensity * 1.5); // B - 偏蓝紫

                data[index + 3] = Math.floor(intensity * 0.8); // A - 适中透明度
              } else {
                data[index + 3] = 0; // 完全透明
              }
            }
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
                  var index = (y * width + x) * 4; // 确保星星是白色且明亮

                  data[index] = Math.min(255, brightness); // R

                  data[index + 1] = Math.min(255, brightness); // G

                  data[index + 2] = Math.min(255, brightness); // B

                  data[index + 3] = Math.min(255, alpha); // A
                }
              }
            }
          }
        }

        simpleNoise(x, y) {
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
          return new Color(10, 30, 60, 255);
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bgEndColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(30, 80, 140, 255);
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "debugMode", [property], {
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
//# sourceMappingURL=f7440f18f422b96f9165376c2e6c781d4b7585f1.js.map