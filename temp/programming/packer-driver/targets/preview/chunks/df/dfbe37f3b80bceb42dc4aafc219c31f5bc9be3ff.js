System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, ParticleSystem2D, Texture2D, SpriteFrame, Color, Vec2, tween, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, EnhancedParticleEffect;

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
      ParticleSystem2D = _cc.ParticleSystem2D;
      Texture2D = _cc.Texture2D;
      SpriteFrame = _cc.SpriteFrame;
      Color = _cc.Color;
      Vec2 = _cc.Vec2;
      tween = _cc.tween;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b8abarKvbBOn6CtzxEnlUCH", "EnhancedParticleEffect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'ParticleSystem2D', 'Texture2D', 'SpriteFrame', 'Color', 'Vec2', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EnhancedParticleEffect", EnhancedParticleEffect = (_dec = ccclass('EnhancedParticleEffect'), _dec2 = property({
        type: String,
        tooltip: "粒子效果类型: star, magic, energy, leaf, snow"
      }), _dec3 = property({
        tooltip: "粒子数量"
      }), _dec4 = property({
        tooltip: "启用动态颜色变化"
      }), _dec5 = property({
        tooltip: "启用音频响应"
      }), _dec6 = property({
        tooltip: "动画强度"
      }), _dec(_class = (_class2 = class EnhancedParticleEffect extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "effectType", _descriptor, this);

          _initializerDefineProperty(this, "particleCount", _descriptor2, this);

          _initializerDefineProperty(this, "enableColorAnimation", _descriptor3, this);

          _initializerDefineProperty(this, "enableAudioReactive", _descriptor4, this);

          _initializerDefineProperty(this, "animationIntensity", _descriptor5, this);

          this.particleSystem = null;
          this.originalEmissionRate = 0;
          this.colorAnimationTween = null;
        }

        onLoad() {
          this.particleSystem = this.node.getComponent(ParticleSystem2D);

          if (!this.particleSystem) {
            this.particleSystem = this.node.addComponent(ParticleSystem2D);
          }

          this.setupParticleEffect();
        }

        start() {
          if (this.enableColorAnimation) {
            this.startColorAnimation();
          }
        }

        setupParticleEffect() {
          if (!this.particleSystem) return;
          this.originalEmissionRate = this.particleCount / 10;

          switch (this.effectType) {
            case "star":
              this.setupStarEffect();
              break;

            case "magic":
              this.setupMagicEffect();
              break;

            case "energy":
              this.setupEnergyEffect();
              break;

            case "leaf":
              this.setupLeafEffect();
              break;

            case "snow":
              this.setupSnowEffect();
              break;

            default:
              this.setupDefaultEffect();
          }
        }

        setupStarEffect() {
          if (!this.particleSystem) return;
          this.particleSystem.duration = -1;
          this.particleSystem.emissionRate = this.originalEmissionRate;
          this.particleSystem.life = 4;
          this.particleSystem.startSize = 2;
          this.particleSystem.endSize = 0;
          this.particleSystem.startColor = new Color(255, 255, 255, 255);
          this.particleSystem.endColor = new Color(255, 255, 255, 0);
          this.particleSystem.gravity = new Vec2(0, 0);
          this.particleSystem.speed = 10;
          this.particleSystem.speedVar = 5;
          this.particleSystem.angle = 90;
          this.particleSystem.angleVar = 360;
          this.particleSystem.startSpin = 0;
          this.particleSystem.endSpin = 360;
          this.particleSystem.spriteFrame = this.createStarTexture();
        }

        setupMagicEffect() {
          if (!this.particleSystem) return;
          this.particleSystem.duration = -1;
          this.particleSystem.emissionRate = this.originalEmissionRate * 0.8;
          this.particleSystem.life = 6;
          this.particleSystem.startSize = 4;
          this.particleSystem.endSize = 1;
          this.particleSystem.startColor = new Color(255, 100, 255, 255);
          this.particleSystem.endColor = new Color(100, 255, 255, 0);
          this.particleSystem.gravity = new Vec2(0, 15);
          this.particleSystem.speed = 25;
          this.particleSystem.speedVar = 10;
          this.particleSystem.angle = 90;
          this.particleSystem.angleVar = 45;
          this.particleSystem.startSpin = 0;
          this.particleSystem.endSpin = 720;
          this.particleSystem.spriteFrame = this.createMagicTexture();
        }

        setupEnergyEffect() {
          if (!this.particleSystem) return;
          this.particleSystem.duration = -1;
          this.particleSystem.emissionRate = this.originalEmissionRate * 1.2;
          this.particleSystem.life = 3;
          this.particleSystem.startSize = 3;
          this.particleSystem.endSize = 0;
          this.particleSystem.startColor = new Color(255, 255, 0, 255);
          this.particleSystem.endColor = new Color(255, 100, 0, 0);
          this.particleSystem.gravity = new Vec2(0, -10);
          this.particleSystem.speed = 30;
          this.particleSystem.speedVar = 15;
          this.particleSystem.angle = 90;
          this.particleSystem.angleVar = 180;
          this.particleSystem.spriteFrame = this.createEnergyTexture();
        }

        setupLeafEffect() {
          if (!this.particleSystem) return;
          this.particleSystem.duration = -1;
          this.particleSystem.emissionRate = this.originalEmissionRate * 0.6;
          this.particleSystem.life = 8;
          this.particleSystem.startSize = 5;
          this.particleSystem.endSize = 3;
          this.particleSystem.startColor = new Color(255, 200, 0, 255);
          this.particleSystem.endColor = new Color(200, 100, 0, 180);
          this.particleSystem.gravity = new Vec2(0, -20);
          this.particleSystem.speed = 15;
          this.particleSystem.speedVar = 8;
          this.particleSystem.angle = 0;
          this.particleSystem.angleVar = 30;
          this.particleSystem.startSpin = 0;
          this.particleSystem.endSpin = 180;
          this.particleSystem.spriteFrame = this.createLeafTexture();
        }

        setupSnowEffect() {
          if (!this.particleSystem) return;
          this.particleSystem.duration = -1;
          this.particleSystem.emissionRate = this.originalEmissionRate * 0.5;
          this.particleSystem.life = 12;
          this.particleSystem.startSize = 4;
          this.particleSystem.endSize = 2;
          this.particleSystem.startColor = new Color(255, 255, 255, 255);
          this.particleSystem.endColor = new Color(200, 220, 255, 180);
          this.particleSystem.gravity = new Vec2(0, -20);
          this.particleSystem.speed = 15;
          this.particleSystem.speedVar = 8;
          this.particleSystem.angle = 0;
          this.particleSystem.angleVar = 15;
          this.particleSystem.startSpin = 0;
          this.particleSystem.endSpin = 360;
          this.particleSystem.spriteFrame = this.createSnowTexture();
        }

        setupDefaultEffect() {
          if (!this.particleSystem) return;
          this.particleSystem.duration = -1;
          this.particleSystem.emissionRate = this.originalEmissionRate;
          this.particleSystem.life = 3;
          this.particleSystem.startSize = 3;
          this.particleSystem.endSize = 1;
          this.particleSystem.startColor = new Color(255, 255, 255, 255);
          this.particleSystem.endColor = new Color(255, 255, 255, 0);
          this.particleSystem.spriteFrame = this.createDefaultTexture();
        }

        createStarTexture() {
          var texture = new Texture2D();
          var size = 4;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4);

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var centerX = size / 2;
              var centerY = size / 2;
              var dx = Math.abs(x - centerX);
              var dy = Math.abs(y - centerY);

              if (dx < 0.8 && dy < 2 || dy < 0.8 && dx < 2) {
                var index = (y * size + x) * 4;
                data[index] = 255; // R

                data[index + 1] = 255; // G

                data[index + 2] = 255; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          return spriteFrame;
        }

        createMagicTexture() {
          var texture = new Texture2D();
          var size = 6;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4);

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var centerX = size / 2;
              var centerY = size / 2;
              var distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

              if (distance <= size / 2) {
                var index = (y * size + x) * 4;
                var intensity = 255 * (1 - distance / (size / 2));
                data[index] = 255; // R

                data[index + 1] = intensity; // G

                data[index + 2] = 255; // B

                data[index + 3] = intensity; // A
              }
            }
          }

          texture.uploadData(data);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          return spriteFrame;
        }

        createEnergyTexture() {
          var texture = new Texture2D();
          var size = 4;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4);

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var centerX = size / 2;
              var centerY = size / 2;
              var dx = Math.abs(x - centerX);
              var dy = Math.abs(y - centerY);

              if (dx + dy <= size / 2) {
                var index = (y * size + x) * 4;
                data[index] = 255; // R

                data[index + 1] = 255; // G

                data[index + 2] = 0; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          return spriteFrame;
        }

        createLeafTexture() {
          var texture = new Texture2D();
          var size = 6;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4);

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var index = (y * size + x) * 4; // 椭圆形叶子

              var centerX = size / 2;
              var centerY = size / 2;
              var dx = (x - centerX) / (size / 2);
              var dy = (y - centerY) / (size / 3);

              if (dx * dx + dy * dy <= 1) {
                data[index] = 200; // R

                data[index + 1] = 150; // G

                data[index + 2] = 0; // B

                data[index + 3] = 255; // A
              }
            }
          }

          texture.uploadData(data);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          return spriteFrame;
        }

        createSnowTexture() {
          var texture = new Texture2D();
          var size = 6;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4);

          for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
              var centerX = size / 2;
              var centerY = size / 2;
              var dx = x - centerX;
              var dy = y - centerY; // 六角雪花

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
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          return spriteFrame;
        }

        createDefaultTexture() {
          var texture = new Texture2D();
          var size = 4;
          texture.reset({
            width: size,
            height: size,
            format: Texture2D.PixelFormat.RGBA8888
          });
          var data = new Uint8Array(size * size * 4);

          for (var i = 0; i < data.length; i += 4) {
            data[i] = 255; // R

            data[i + 1] = 255; // G

            data[i + 2] = 255; // B

            data[i + 3] = 255; // A
          }

          texture.uploadData(data);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          return spriteFrame;
        }

        startColorAnimation() {
          if (!this.particleSystem) return;
          var originalStartColor = this.particleSystem.startColor.clone();
          var originalEndColor = this.particleSystem.endColor.clone();
          this.colorAnimationTween = tween(this.particleSystem).repeatForever(tween().to(3, {
            startColor: new Color(Math.min(255, originalStartColor.r + 50), Math.min(255, originalStartColor.g + 30), Math.min(255, originalStartColor.b + 70), originalStartColor.a)
          }).to(3, {
            startColor: originalStartColor
          })).start();
        }
        /**
         * 设置粒子强度（用于音频响应）
         */


        setIntensity(intensity) {
          if (!this.particleSystem) return;
          var normalizedIntensity = Math.max(0, Math.min(2, intensity));
          this.particleSystem.emissionRate = this.originalEmissionRate * normalizedIntensity;

          if (this.enableAudioReactive) {
            var scale = 0.8 + normalizedIntensity * 0.4;
            this.node.setScale(scale, scale, 1);
          }
        }
        /**
         * 触发爆发效果
         */


        triggerBurst(burstCount) {
          if (burstCount === void 0) {
            burstCount = 20;
          }

          if (!this.particleSystem) return;
          var originalRate = this.particleSystem.emissionRate;
          this.particleSystem.emissionRate = burstCount * 10;
          this.scheduleOnce(() => {
            this.particleSystem.emissionRate = originalRate;
          }, 0.1);
        }
        /**
         * 设置效果类型
         */


        setEffectType(type) {
          this.effectType = type;
          this.setupParticleEffect();
        }

        onDestroy() {
          if (this.colorAnimationTween) {
            this.colorAnimationTween.stop();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "effectType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "star";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "particleCount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enableColorAnimation", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableAudioReactive", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "animationIntensity", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=dfbe37f3b80bceb42dc4aafc219c31f5bc9be3ff.js.map