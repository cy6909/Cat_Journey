System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Node, ParticleSystem2D, tween, Vec3, Vec2, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, ForestThemeBackground;

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

      _cclegacy._RF.push({}, "5eca5482bpB2qV81ooQm4wo", "ForestThemeBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'view', 'Node', 'ParticleSystem2D', 'tween', 'Vec3', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ForestThemeBackground", ForestThemeBackground = (_dec = ccclass('ForestThemeBackground'), _dec(_class = (_class2 = class ForestThemeBackground extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "leafParticleCount", _descriptor, this);

          _initializerDefineProperty(this, "fireflyCount", _descriptor2, this);

          _initializerDefineProperty(this, "vineCount", _descriptor3, this);

          _initializerDefineProperty(this, "enableCatCharacter", _descriptor4, this);

          // 森林主题色彩配置
          _initializerDefineProperty(this, "forestStartColor", _descriptor5, this);

          // #2D5A27
          _initializerDefineProperty(this, "forestEndColor", _descriptor6, this);
        }

        // #90EE90
        onLoad() {
          this.createForestBackground();
        }

        createForestBackground() {
          const transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('UITransform component not found');
            return;
          }

          this.setupNodeSize(transform); // 创建森林主题分层背景

          this.createForestGradient(transform);
          this.createForestSilhouette(transform);
          this.createLeafParticles(transform);
          this.createFireflies(transform);
          this.createVineDecorations(transform);

          if (this.enableCatCharacter) {
            this.createForestCat(transform);
          }
        }

        setupNodeSize(transform) {
          const designSize = view.getDesignResolutionSize();
          const targetWidth = Math.max(designSize.width, 960);
          const targetHeight = Math.max(designSize.height, 640);
          transform.setContentSize(targetWidth, targetHeight);
          transform.setAnchorPoint(0.5, 0.5);
        }

        createForestGradient(transform) {
          const gradientNode = new Node('ForestGradient');
          gradientNode.setParent(this.node);
          const layerTransform = gradientNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          const gradientTexture = this.createForestGradientTexture(transform.width, transform.height);
          const sprite = gradientNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = gradientTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE;
        }

        createForestGradientTexture(width, height) {
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
            const ratio = y / h; // 森林渐变：上方较亮（天空透过树梢），下方较暗（森林深处）

            const r = Math.floor(this.forestStartColor.r + (this.forestEndColor.r - this.forestStartColor.r) * ratio);
            const g = Math.floor(this.forestStartColor.g + (this.forestEndColor.g - this.forestStartColor.g) * ratio);
            const b = Math.floor(this.forestStartColor.b + (this.forestEndColor.b - this.forestStartColor.b) * ratio);

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

        createForestSilhouette(transform) {
          const silhouetteNode = new Node('ForestSilhouette');
          silhouetteNode.setParent(this.node);
          const layerTransform = silhouetteNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          const silhouetteTexture = this.createForestSilhouetteTexture(transform.width, transform.height);
          const sprite = silhouetteNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = silhouetteTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(255, 255, 255, 120); // 半透明
        }

        createForestSilhouetteTexture(width, height) {
          const texture = new Texture2D();
          const w = Math.max(1, Math.floor(width));
          const h = Math.max(1, Math.floor(height));
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(w * h * 4); // 初始化为透明

          for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 0; // 透明
          } // 绘制树木剪影 - 底部1/3区域


          const treeZoneStart = Math.floor(h * 0.7);

          for (let y = treeZoneStart; y < h; y++) {
            for (let x = 0; x < w; x++) {
              // 使用噪声函数创建不规则的树木轮廓
              const treeNoise = this.forestNoise(x * 0.02, y * 0.02);
              const treeHeight = (h - y) / (h - treeZoneStart);

              if (treeNoise > 0.3 - treeHeight * 0.4) {
                const index = (y * w + x) * 4;
                const intensity = 60 + Math.random() * 40; // 深绿色

                data[index] = intensity * 0.3; // R

                data[index + 1] = intensity; // G

                data[index + 2] = intensity * 0.4; // B

                data[index + 3] = 180; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createLeafParticles(transform) {
          const particleNode = new Node('LeafParticles');
          particleNode.setParent(this.node);
          const layerTransform = particleNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          const particleSystem = particleNode.addComponent(ParticleSystem2D); // 配置树叶飘落效果

          particleSystem.duration = -1; // 持续发射

          particleSystem.emissionRate = 3;
          particleSystem.life = 8;
          particleSystem.startSize = 6;
          particleSystem.endSize = 4;
          particleSystem.startColor = new Color(255, 215, 0, 255); // 金黄色

          particleSystem.endColor = new Color(139, 69, 19, 200); // 棕色
          // 重力和运动

          particleSystem.gravity = new Vec2(0, -30);
          particleSystem.speed = 20;
          particleSystem.speedVar = 10;
          particleSystem.angle = 45;
          particleSystem.angleVar = 30; // 旋转效果

          particleSystem.startSpin = 0;
          particleSystem.endSpin = 180;
          particleSystem.startSpinVar = 90; // 创建叶子纹理

          const leafTexture = this.createLeafTexture();
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = leafTexture;
          particleSystem.spriteFrame = spriteFrame;
        }

        createLeafTexture() {
          const texture = new Texture2D();
          const size = 8;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(size * size * 4); // 绘制简单的叶子形状

          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              const centerX = size / 2;
              const centerY = size / 2;
              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 3 && Math.abs(dx) < 2) {
                const index = (y * size + x) * 4;
                data[index] = 34; // R

                data[index + 1] = 139; // G

                data[index + 2] = 34; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createFireflies(transform) {
          for (let i = 0; i < this.fireflyCount; i++) {
            this.createSingleFirefly(transform, i);
          }
        }

        createSingleFirefly(transform, index) {
          const fireflyNode = new Node(`Firefly_${index}`);
          fireflyNode.setParent(this.node); // 随机位置

          const x = (Math.random() - 0.5) * transform.width * 0.8;
          const y = (Math.random() - 0.5) * transform.height * 0.6;
          fireflyNode.setPosition(x, y, 0);
          const fireflyTransform = fireflyNode.addComponent(UITransform);
          fireflyTransform.setContentSize(4, 4);
          fireflyTransform.setAnchorPoint(0.5, 0.5);
          const sprite = fireflyNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createFireflyTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(255, 255, 100, 255); // 黄色光点
          // 添加飘动和闪烁动画

          this.startFireflyAnimation(fireflyNode);
        }

        createFireflyTexture() {
          const texture = new Texture2D();
          const size = 4;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(size * size * 4); // 创建发光点

          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              const centerX = size / 2;
              const centerY = size / 2;
              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 1.5) {
                const index = (y * size + x) * 4;
                const alpha = Math.max(0, 255 * (1 - distance / 1.5));
                data[index] = 255; // R

                data[index + 1] = 255; // G  

                data[index + 2] = 0; // B

                data[index + 3] = alpha; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        startFireflyAnimation(fireflyNode) {
          const originalPos = fireflyNode.position.clone(); // 随机飘动路径

          const floatAnimation = tween(fireflyNode).repeatForever(tween().to(3 + Math.random() * 2, {
            position: new Vec3(originalPos.x + (Math.random() - 0.5) * 100, originalPos.y + (Math.random() - 0.5) * 60, 0)
          }).to(3 + Math.random() * 2, {
            position: new Vec3(originalPos.x + (Math.random() - 0.5) * 100, originalPos.y + (Math.random() - 0.5) * 60, 0)
          }).to(2 + Math.random(), {
            position: originalPos
          })); // 闪烁动画

          const sprite = fireflyNode.getComponent(Sprite);

          if (sprite) {
            const blinkAnimation = tween(sprite).repeatForever(tween().to(0.5 + Math.random(), {
              color: new Color(255, 255, 100, 100)
            }).to(0.5 + Math.random(), {
              color: new Color(255, 255, 100, 255)
            }));
            blinkAnimation.start();
          }

          floatAnimation.start();
        }

        createVineDecorations(transform) {
          // 暂时简化，后续可以添加前景藤蔓装饰
          console.log('森林藤蔓装饰 - 待实现');
        }

        createForestCat(transform) {
          const catNode = new Node('ForestCat');
          catNode.setParent(this.node); // 位置：左下角，不干扰游戏区域

          catNode.setPosition(-350, -200, 0);
          catNode.setScale(0.8, 0.8, 1);
          const catTransform = catNode.addComponent(UITransform);
          catTransform.setContentSize(64, 64);
          catTransform.setAnchorPoint(0.5, 0.5);
          const sprite = catNode.addComponent(Sprite);
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createForestCatTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE; // 添加待机动画

          this.startForestCatAnimation(catNode);
        }

        createForestCatTexture() {
          const texture = new Texture2D();
          const size = 32;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          const data = new Uint8Array(size * size * 4); // 简化的猫咪像素艺术

          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              const index = (y * size + x) * 4; // 基础形状：橘猫轮廓

              if (this.isInCatShape(x, y, size)) {
                data[index] = 255; // R - 橘色

                data[index + 1] = 140; // G

                data[index + 2] = 0; // B

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
          const centerX = size / 2;
          const centerY = size / 2;
          const dx = x - centerX;
          const dy = y - centerY; // 简单的椭圆形作为猫咪身体

          const bodyRadius = size * 0.3;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < bodyRadius;
        }

        startForestCatAnimation(catNode) {
          // 轻微的上下浮动
          tween(catNode).repeatForever(tween().to(2, {
            position: new Vec3(-350, -190, 0)
          }).to(2, {
            position: new Vec3(-350, -210, 0)
          })).start(); // 偶尔的左右摆动（好奇地看向游戏区域）

          this.schedule(() => {
            tween(catNode).to(0.5, {
              eulerAngles: new Vec3(0, 0, 5)
            }).to(1, {
              eulerAngles: new Vec3(0, 0, -5)
            }).to(0.5, {
              eulerAngles: new Vec3(0, 0, 0)
            }).start();
          }, 8 + Math.random() * 4); // 8-12秒随机
        }

        forestNoise(x, y) {
          // 森林专用噪声函数 - 创造更有机的形状
          let n = Math.sin(x * 7.234 + y * 3.845) * 0.5;
          n += Math.sin(x * 3.456 + y * 7.123) * 0.3;
          n += Math.sin(x * 1.789 + y * 2.456) * 0.2;
          return (n + 1) / 2; // 归一化到0-1
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "leafParticleCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fireflyCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "vineCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableCatCharacter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "forestStartColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(45, 90, 39, 255);
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "forestEndColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(144, 238, 144, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cada9b0fa0eb9960777d3c44092d48f0e4dc4393.js.map