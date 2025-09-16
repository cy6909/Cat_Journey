System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Node, ParticleSystem2D, tween, Vec3, Vec2, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, SnowMountainBackground;

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
      ParticleSystem2D = _cc.ParticleSystem2D;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cac6aedBU5IrbgAyZpkz4gq", "SnowMountainBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'view', 'Node', 'ParticleSystem2D', 'tween', 'Vec3', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SnowMountainBackground", SnowMountainBackground = (_dec = ccclass('SnowMountainBackground'), _dec(_class = (_class2 = class SnowMountainBackground extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "snowflakeCount", _descriptor, this);

          _initializerDefineProperty(this, "auroraCount", _descriptor2, this);

          _initializerDefineProperty(this, "icicleCount", _descriptor3, this);

          _initializerDefineProperty(this, "enableCatCharacter", _descriptor4, this);

          // 雪山主题色彩配置
          _initializerDefineProperty(this, "mountainStartColor", _descriptor5, this);

          // #1E3A8A 深蓝
          _initializerDefineProperty(this, "mountainEndColor", _descriptor6, this);
        }

        // #F8FAFC 雪白
        onLoad() {
          this.createSnowMountainBackground();
        }

        createSnowMountainBackground() {
          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('UITransform component not found');
            return;
          }

          this.setupNodeSize(transform); // 创建雪山主题分层背景

          this.createMountainGradient(transform);
          this.createMountainSilhouette(transform);
          this.createSnowflakeParticles(transform);
          this.createAuroraEffect(transform);
          this.createIcicleDecorations(transform);

          if (this.enableCatCharacter) {
            this.createSnowCat(transform);
          }
        }

        setupNodeSize(transform) {
          var designSize = view.getDesignResolutionSize();
          var targetWidth = Math.max(designSize.width, 960);
          var targetHeight = Math.max(designSize.height, 640);
          transform.setContentSize(targetWidth, targetHeight);
          transform.setAnchorPoint(0.5, 0.5);
        }

        createMountainGradient(transform) {
          var gradientNode = new Node('MountainGradient');
          gradientNode.setParent(this.node);
          var layerTransform = gradientNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          var gradientTexture = this.createMountainGradientTexture(transform.width, transform.height);
          var sprite = gradientNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = gradientTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE;
        }

        createMountainGradientTexture(width, height) {
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
            var ratio = y / h; // 雪山渐变：上方深蓝（夜空），下方雪白（雪地）

            var r = Math.floor(this.mountainStartColor.r + (this.mountainEndColor.r - this.mountainStartColor.r) * ratio);
            var g = Math.floor(this.mountainStartColor.g + (this.mountainEndColor.g - this.mountainStartColor.g) * ratio);
            var b = Math.floor(this.mountainStartColor.b + (this.mountainEndColor.b - this.mountainStartColor.b) * ratio);

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

        createMountainSilhouette(transform) {
          var silhouetteNode = new Node('MountainSilhouette');
          silhouetteNode.setParent(this.node);
          var layerTransform = silhouetteNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          var silhouetteTexture = this.createMountainSilhouetteTexture(transform.width, transform.height);
          var sprite = silhouetteNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = silhouetteTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(255, 255, 255, 150); // 半透明白色
        }

        createMountainSilhouetteTexture(width, height) {
          var texture = new Texture2D();
          var w = Math.max(1, Math.floor(width));
          var h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4); // 初始化为透明

          for (var i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 透明
          } // 绘制山峰剪影 - 底部1/2区域


          var mountainZoneStart = Math.floor(h * 0.5);

          for (var y = mountainZoneStart; y < h; y++) {
            for (var x = 0; x < w; x++) {
              // 使用多层噪声创建山峰轮廓
              var mountainNoise = this.mountainNoise(x * 0.01, y * 0.015);
              var heightFactor = (h - y) / (h - mountainZoneStart);

              if (mountainNoise > 0.2 - heightFactor * 0.5) {
                var index = (y * w + x) * 4;
                var intensity = 200 + Math.random() * 55; // 亮白色

                data[index] = intensity; // R

                data[index + 1] = intensity; // G

                data[index + 2] = intensity; // B

                data[index + 3] = 200; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createSnowflakeParticles(transform) {
          var particleNode = new Node('SnowflakeParticles');
          particleNode.setParent(this.node);
          var layerTransform = particleNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          var particleSystem = particleNode.addComponent(ParticleSystem2D); // 配置雪花飘落效果

          particleSystem.duration = -1; // 持续发射

          particleSystem.emissionRate = 5;
          particleSystem.life = 12;
          particleSystem.startSize = 4;
          particleSystem.endSize = 2;
          particleSystem.startColor = new Color(255, 255, 255, 255); // 纯白

          particleSystem.endColor = new Color(200, 220, 255, 180); // 蓝白色
          // 重力和运动

          particleSystem.gravity = new Vec2(0, -20);
          particleSystem.speed = 15;
          particleSystem.speedVar = 8;
          particleSystem.angle = 0;
          particleSystem.angleVar = 15; // 旋转效果

          particleSystem.startSpin = 0;
          particleSystem.endSpin = 360;
          particleSystem.startSpinVar = 180; // 创建雪花纹理

          var snowflakeTexture = this.createSnowflakeTexture();
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = snowflakeTexture;
          particleSystem.spriteFrame = spriteFrame;
        }

        createSnowflakeTexture() {
          var texture = new Texture2D();
          var size = 6;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4); // 绘制六角雪花形状

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var centerX = size / 2;
              var centerY = size / 2;
              var dx = x - centerX;
              var dy = y - centerY; // 创建十字形和对角线的雪花图案

              if (Math.abs(dx) < 0.8 && Math.abs(dy) < 2.5 || Math.abs(dy) < 0.8 && Math.abs(dx) < 2.5 || Math.abs(dx - dy) < 0.8 || Math.abs(dx + dy) < 0.8) {
                var index = (y * size + x) * 4;
                data[index] = 255; // R

                data[index + 1] = 255; // G

                data[index + 2] = 255; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createAuroraEffect(transform) {
          for (var i = 0; i < this.auroraCount; i++) {
            this.createSingleAurora(transform, i);
          }
        }

        createSingleAurora(transform, index) {
          var auroraNode = new Node("Aurora_" + index);
          auroraNode.setParent(this.node); // 极光位置在屏幕上方

          var x = (Math.random() - 0.5) * transform.width * 0.8;
          var y = transform.height * 0.2 + Math.random() * 100;
          auroraNode.setPosition(x, y, 0);
          var auroraTransform = auroraNode.addComponent(UITransform);
          auroraTransform.setContentSize(200, 80);
          auroraTransform.setAnchorPoint(0.5, 0.5);
          var sprite = auroraNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createAuroraTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 极光颜色（绿色、紫色变化）

          var colors = [new Color(50, 255, 50, 100), // 绿色
          new Color(150, 50, 255, 100), // 紫色
          new Color(50, 150, 255, 100) // 蓝色
          ];
          sprite.color = colors[index % colors.length]; // 添加波动动画

          this.startAuroraAnimation(auroraNode);
        }

        createAuroraTexture() {
          var texture = new Texture2D();
          var w = 40;
          var h = 16;
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4); // 创建波浪形极光纹理

          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              var index = (y * w + x) * 4; // 使用正弦波创建极光形状

              var waveHeight = Math.sin(x * 0.3) * 3 + h / 2;
              var distance = Math.abs(y - waveHeight);

              if (distance < 4) {
                var alpha = Math.max(0, 255 * (1 - distance / 4));
                data[index] = 255; // R

                data[index + 1] = 255; // G

                data[index + 2] = 255; // B

                data[index + 3] = alpha; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        startAuroraAnimation(auroraNode) {
          var originalPos = auroraNode.position.clone(); // 缓慢飘动

          tween(auroraNode).repeatForever(tween().to(8 + Math.random() * 4, {
            position: new Vec3(originalPos.x + (Math.random() - 0.5) * 50, originalPos.y + (Math.random() - 0.5) * 30, 0)
          }).to(8 + Math.random() * 4, {
            position: originalPos
          })).start(); // 透明度变化

          var sprite = auroraNode.getComponent(Sprite);

          if (sprite) {
            var originalColor = sprite.color.clone();
            tween(sprite).repeatForever(tween().to(3 + Math.random() * 2, {
              color: new Color(originalColor.r, originalColor.g, originalColor.b, 50)
            }).to(3 + Math.random() * 2, {
              color: originalColor
            })).start();
          }
        }

        createIcicleDecorations(transform) {
          // 创建冰柱装饰效果 - 简化实现
          console.log('雪山冰柱装饰 - 基础实现');

          for (var i = 0; i < this.icicleCount; i++) {
            this.createSingleIcicle(transform, i);
          }
        }

        createSingleIcicle(transform, index) {
          var icicleNode = new Node("Icicle_" + index);
          icicleNode.setParent(this.node); // 冰柱位置在屏幕边缘

          var x = index % 2 === 0 ? -transform.width * 0.4 + Math.random() * 50 : transform.width * 0.4 - Math.random() * 50;
          var y = (Math.random() - 0.5) * transform.height * 0.6;
          icicleNode.setPosition(x, y, 0);
          var icicleTransform = icicleNode.addComponent(UITransform);
          icicleTransform.setContentSize(8, 30);
          icicleTransform.setAnchorPoint(0.5, 0.5);
          var sprite = icicleNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createIcicleTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(200, 230, 255, 200); // 冰蓝色
        }

        createIcicleTexture() {
          var texture = new Texture2D();
          var w = 4;
          var h = 15;
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4); // 创建锥形冰柱

          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              var centerX = w / 2;
              var width = (h - y) / h * (w / 2);

              if (Math.abs(x - centerX) < width) {
                var index = (y * w + x) * 4;
                data[index] = 200; // R

                data[index + 1] = 230; // G

                data[index + 2] = 255; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createSnowCat(transform) {
          var catNode = new Node('SnowCat');
          catNode.setParent(this.node); // 位置：左下角，不干扰游戏区域

          catNode.setPosition(-350, -200, 0);
          catNode.setScale(0.8, 0.8, 1);
          var catTransform = catNode.addComponent(UITransform);
          catTransform.setContentSize(64, 64);
          catTransform.setAnchorPoint(0.5, 0.5);
          var sprite = catNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createSnowCatTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE; // 添加待机动画

          this.startSnowCatAnimation(catNode);
        }

        createSnowCatTexture() {
          var texture = new Texture2D();
          var size = 32;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4); // 简化的雪地猫咪像素艺术（白猫+蓝色装饰）

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var index = (y * size + x) * 4; // 基础形状：白猫轮廓

              if (this.isInCatShape(x, y, size)) {
                data[index] = 240; // R - 近白色

                data[index + 1] = 248; // G

                data[index + 2] = 255; // B

                data[index + 3] = 255; // A
              } else {
                data[index + 3] = 0; // 透明
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        isInCatShape(x, y, size) {
          var centerX = size / 2;
          var centerY = size / 2;
          var dx = x - centerX;
          var dy = y - centerY; // 简单的椭圆形作为猫咪身体

          var bodyRadius = size * 0.3;
          var distance = Math.sqrt(dx * dx + dy * dy);
          return distance < bodyRadius;
        }

        startSnowCatAnimation(catNode) {
          // 轻微的上下浮动（在雪地里）
          tween(catNode).repeatForever(tween().to(3, {
            position: new Vec3(-350, -190, 0)
          }).to(3, {
            position: new Vec3(-350, -210, 0)
          })).start(); // 偶尔的抖动（抖掉雪花）

          this.schedule(() => {
            tween(catNode).to(0.1, {
              scale: new Vec3(0.85, 0.85, 1)
            }).to(0.1, {
              scale: new Vec3(0.8, 0.8, 1)
            }).to(0.1, {
              scale: new Vec3(0.85, 0.85, 1)
            }).to(0.1, {
              scale: new Vec3(0.8, 0.8, 1)
            }).start();
          }, 12 + Math.random() * 8); // 12-20秒随机
        }

        mountainNoise(x, y) {
          // 雪山专用噪声函数 - 创造尖锐的山峰形状
          var n = Math.sin(x * 5.123 + y * 2.456) * 0.6;
          n += Math.sin(x * 2.789 + y * 4.123) * 0.3;
          n += Math.sin(x * 1.234 + y * 1.789) * 0.1;
          return (n + 1) / 2; // 归一化到0-1
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "snowflakeCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "auroraCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "icicleCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableCatCharacter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "mountainStartColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(30, 58, 138, 255);
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "mountainEndColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(248, 250, 252, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3a1375487b689d55f15f5d5e264197d2e27a0508.js.map