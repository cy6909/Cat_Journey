System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Node, ParticleSystem2D, tween, Vec3, Vec2, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, AbyssBackground;

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

      _cclegacy._RF.push({}, "dde91JJrSxO2J5JlOtxyiTh", "AbyssBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'view', 'Node', 'ParticleSystem2D', 'tween', 'Vec3', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AbyssBackground", AbyssBackground = (_dec = ccclass('AbyssBackground'), _dec(_class = (_class2 = class AbyssBackground extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "energySparkCount", _descriptor, this);

          _initializerDefineProperty(this, "dataStreamCount", _descriptor2, this);

          _initializerDefineProperty(this, "mechanicalPipeCount", _descriptor3, this);

          _initializerDefineProperty(this, "enableCatCharacter", _descriptor4, this);

          // 深渊主题色彩配置
          _initializerDefineProperty(this, "abyssStartColor", _descriptor5, this);

          // #4C1D95 深紫
          _initializerDefineProperty(this, "abyssEndColor", _descriptor6, this);
        }

        // #7F1D1D 暗红
        onLoad() {
          this.createAbyssBackground();
        }

        createAbyssBackground() {
          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            console.error('UITransform component not found');
            return;
          }

          this.setupNodeSize(transform); // 创建深渊主题分层背景

          this.createAbyssGradient(transform);
          this.createMechanicalStructure(transform);
          this.createEnergySparkParticles(transform);
          this.createDataStreams(transform);
          this.createEnergyPipes(transform);

          if (this.enableCatCharacter) {
            this.createCyberCat(transform);
          }
        }

        setupNodeSize(transform) {
          var designSize = view.getDesignResolutionSize();
          var targetWidth = Math.max(designSize.width, 960);
          var targetHeight = Math.max(designSize.height, 640);
          transform.setContentSize(targetWidth, targetHeight);
          transform.setAnchorPoint(0.5, 0.5);
        }

        createAbyssGradient(transform) {
          var gradientNode = new Node('AbyssGradient');
          gradientNode.setParent(this.node);
          var layerTransform = gradientNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          var gradientTexture = this.createAbyssGradientTexture(transform.width, transform.height);
          var sprite = gradientNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = gradientTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE;
        }

        createAbyssGradientTexture(width, height) {
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
            var ratio = y / h; // 深渊渐变：上方深紫（深空），下方暗红（地狱）

            var r = Math.floor(this.abyssStartColor.r + (this.abyssEndColor.r - this.abyssStartColor.r) * ratio);
            var g = Math.floor(this.abyssStartColor.g + (this.abyssEndColor.g - this.abyssStartColor.g) * ratio);
            var b = Math.floor(this.abyssStartColor.b + (this.abyssEndColor.b - this.abyssStartColor.b) * ratio);

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

        createMechanicalStructure(transform) {
          var structureNode = new Node('MechanicalStructure');
          structureNode.setParent(this.node);
          var layerTransform = structureNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          var structureTexture = this.createMechanicalTexture(transform.width, transform.height);
          var sprite = structureNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = structureTexture;
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(255, 255, 255, 100); // 半透明
        }

        createMechanicalTexture(width, height) {
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
          } // 绘制机械结构 - 网格和管道


          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              var index = (y * w + x) * 4; // 垂直网格线

              if (x % 60 === 0 || x % 60 === 1) {
                data[index] = 100; // R

                data[index + 1] = 100; // G

                data[index + 2] = 120; // B

                data[index + 3] = 150; // A
              } // 水平网格线


              if (y % 80 === 0 || y % 80 === 1) {
                data[index] = 100; // R

                data[index + 1] = 100; // G

                data[index + 2] = 120; // B

                data[index + 3] = 150; // A
              } // 添加一些机械纹理噪声


              var mechNoise = this.mechanicalNoise(x * 0.05, y * 0.05);

              if (mechNoise > 0.7) {
                data[index] = 80; // R

                data[index + 1] = 80; // G

                data[index + 2] = 100; // B

                data[index + 3] = 100; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createEnergySparkParticles(transform) {
          var particleNode = new Node('EnergySparkParticles');
          particleNode.setParent(this.node);
          var layerTransform = particleNode.addComponent(UITransform);
          layerTransform.setContentSize(transform.width, transform.height);
          layerTransform.setAnchorPoint(0.5, 0.5);
          var particleSystem = particleNode.addComponent(ParticleSystem2D); // 配置能量火花效果

          particleSystem.duration = -1; // 持续发射

          particleSystem.emissionRate = 4;
          particleSystem.life = 6;
          particleSystem.startSize = 3;
          particleSystem.endSize = 1;
          particleSystem.startColor = new Color(255, 50, 100, 255); // 红色火花

          particleSystem.endColor = new Color(150, 50, 255, 100); // 紫色
          // 浮动运动

          particleSystem.gravity = new Vec2(0, 10);
          particleSystem.speed = 25;
          particleSystem.speedVar = 15;
          particleSystem.angle = 90;
          particleSystem.angleVar = 360; // 旋转效果

          particleSystem.startSpin = 0;
          particleSystem.endSpin = 720;
          particleSystem.startSpinVar = 360; // 创建火花纹理

          var sparkTexture = this.createSparkTexture();
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = sparkTexture;
          particleSystem.spriteFrame = spriteFrame;
        }

        createSparkTexture() {
          var texture = new Texture2D();
          var size = 4;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4); // 绘制菱形火花

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var centerX = size / 2;
              var centerY = size / 2;
              var dx = Math.abs(x - centerX);
              var dy = Math.abs(y - centerY);

              if (dx + dy <= size / 2) {
                var index = (y * size + x) * 4;
                data[index] = 255; // R

                data[index + 1] = 100; // G

                data[index + 2] = 150; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        createDataStreams(transform) {
          for (var i = 0; i < this.dataStreamCount; i++) {
            this.createSingleDataStream(transform, i);
          }
        }

        createSingleDataStream(transform, index) {
          var streamNode = new Node("DataStream_" + index);
          streamNode.setParent(this.node); // 数据流位置 - 垂直移动

          var x = (Math.random() - 0.5) * transform.width * 0.9;
          var y = transform.height * 0.5;
          streamNode.setPosition(x, y, 0);
          var streamTransform = streamNode.addComponent(UITransform);
          streamTransform.setContentSize(2, 100);
          streamTransform.setAnchorPoint(0.5, 0.5);
          var sprite = streamNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createDataStreamTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(0, 255, 100, 200); // 绿色数据流
          // 添加下降动画

          this.startDataStreamAnimation(streamNode, transform);
        }

        createDataStreamTexture() {
          var texture = new Texture2D();
          var w = 2;
          var h = 20;
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4); // 创建垂直线条

          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              var index = (y * w + x) * 4;
              var alpha = Math.random() > 0.3 ? 255 : 0; // 随机间断

              data[index] = 0; // R

              data[index + 1] = 255; // G

              data[index + 2] = 100; // B

              data[index + 3] = alpha; // A
            }
          }

          texture.uploadData(data);
          return texture;
        }

        startDataStreamAnimation(streamNode, transform) {
          var startY = transform.height * 0.6;
          var endY = -transform.height * 0.6; // 重置位置并开始下降

          var resetAndFall = () => {
            streamNode.setPosition((Math.random() - 0.5) * transform.width * 0.9, startY, 0);
            tween(streamNode).to(8 + Math.random() * 4, {
              position: new Vec3(streamNode.position.x, endY, 0)
            }).call(resetAndFall).start();
          };

          resetAndFall();
        }

        createEnergyPipes(transform) {
          for (var i = 0; i < this.mechanicalPipeCount; i++) {
            this.createSingleEnergyPipe(transform, i);
          }
        }

        createSingleEnergyPipe(transform, index) {
          var pipeNode = new Node("EnergyPipe_" + index);
          pipeNode.setParent(this.node); // 能量管道位置 - 水平分布

          var x = -transform.width * 0.4 + index / this.mechanicalPipeCount * transform.width * 0.8;
          var y = (Math.random() - 0.5) * transform.height * 0.4;
          pipeNode.setPosition(x, y, 0);
          var pipeTransform = pipeNode.addComponent(UITransform);
          pipeTransform.setContentSize(100, 8);
          pipeTransform.setAnchorPoint(0.5, 0.5);
          var sprite = pipeNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createEnergyPipeTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = new Color(255, 100, 50, 180); // 橙红色管道
          // 添加脉动动画

          this.startEnergyPipeAnimation(pipeNode);
        }

        createEnergyPipeTexture() {
          var texture = new Texture2D();
          var w = 20;
          var h = 4;
          texture.reset({
            width: w,
            height: h,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(w * h * 4); // 创建管道纹理

          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              var index = (y * w + x) * 4; // 管道边缘

              if (y === 0 || y === h - 1) {
                data[index] = 150; // R

                data[index + 1] = 150; // G

                data[index + 2] = 150; // B

                data[index + 3] = 255; // A
              } else {
                // 管道内部 - 能量流
                var flow = Math.sin(x * 0.5) * 0.5 + 0.5;
                data[index] = Math.floor(255 * flow); // R

                data[index + 1] = Math.floor(100 * flow); // G

                data[index + 2] = Math.floor(50 * flow); // B

                data[index + 3] = 200; // A
              }
            }
          }

          texture.uploadData(data);
          return texture;
        }

        startEnergyPipeAnimation(pipeNode) {
          var sprite = pipeNode.getComponent(Sprite);

          if (sprite) {
            var originalColor = sprite.color.clone();
            var brightColor = new Color(255, 150, 100, 220); // 脉动效果

            tween(sprite).repeatForever(tween().to(1 + Math.random(), {
              color: brightColor
            }).to(1 + Math.random(), {
              color: originalColor
            })).start();
          }
        }

        createCyberCat(transform) {
          var catNode = new Node('CyberCat');
          catNode.setParent(this.node); // 位置：左下角，不干扰游戏区域

          catNode.setPosition(-350, -200, 0);
          catNode.setScale(0.8, 0.8, 1);
          var catTransform = catNode.addComponent(UITransform);
          catTransform.setContentSize(64, 64);
          catTransform.setAnchorPoint(0.5, 0.5);
          var sprite = catNode.addComponent(Sprite);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = this.createCyberCatTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.color = Color.WHITE; // 添加待机动画

          this.startCyberCatAnimation(catNode);
        }

        createCyberCatTexture() {
          var texture = new Texture2D();
          var size = 32;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4); // 简化的赛博猫咪像素艺术（黑猫+霓虹边框）

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var index = (y * size + x) * 4; // 基础形状：黑猫轮廓

              if (this.isInCatShape(x, y, size)) {
                data[index] = 40; // R - 暗色

                data[index + 1] = 40; // G

                data[index + 2] = 60; // B

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

        startCyberCatAnimation(catNode) {
          // 轻微的上下浮动（机械悬浮效果）
          tween(catNode).repeatForever(tween().to(1.5, {
            position: new Vec3(-350, -190, 0)
          }).to(1.5, {
            position: new Vec3(-350, -210, 0)
          })).start(); // 霓虹发光效果

          var sprite = catNode.getComponent(Sprite);

          if (sprite) {
            tween(sprite).repeatForever(tween().to(2, {
              color: new Color(100, 255, 255, 255)
            }) // 青色发光
            .to(2, {
              color: new Color(255, 100, 255, 255)
            }) // 紫色发光
            .to(2, {
              color: Color.WHITE
            })).start();
          }
        }

        mechanicalNoise(x, y) {
          // 机械专用噪声函数 - 创造电路板纹理
          var n = Math.sin(x * 8.123 + y * 6.789) * 0.4;
          n += Math.sin(x * 4.456 + y * 3.123) * 0.3;
          n += Math.sin(x * 2.789 + y * 1.456) * 0.3;
          return (n + 1) / 2; // 归一化到0-1
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "energySparkCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 25;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "dataStreamCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mechanicalPipeCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableCatCharacter", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "abyssStartColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(76, 29, 149, 255);
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "abyssEndColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(127, 29, 29, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=44b49019cd2d101ed781160bf897fdfcf41751fa.js.map