System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ParticleSystem2D, tween, Color, Vec3, Vec2, UITransform, Sprite, SpriteFrame, Texture2D, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _crd, ccclass, property, VisualEffectType, AdvancedEffectSystem;

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
      Node = _cc.Node;
      ParticleSystem2D = _cc.ParticleSystem2D;
      tween = _cc.tween;
      Color = _cc.Color;
      Vec3 = _cc.Vec3;
      Vec2 = _cc.Vec2;
      UITransform = _cc.UITransform;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Texture2D = _cc.Texture2D;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cf3d5JF8JVEiJ3TxzCRIcDn", "AdvancedEffectSystem", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ParticleSystem2D', 'tween', 'Color', 'Vec3', 'Vec2', 'UITransform', 'Sprite', 'SpriteFrame', 'Texture2D']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("VisualEffectType", VisualEffectType = /*#__PURE__*/function (VisualEffectType) {
        VisualEffectType["BALL_FIRE_TRAIL"] = "ball_fire_trail";
        VisualEffectType["BALL_ICE_AURA"] = "ball_ice_aura";
        VisualEffectType["BALL_ELECTRIC_SPARK"] = "ball_electric_spark";
        VisualEffectType["BALL_POISON_MIST"] = "ball_poison_mist";
        VisualEffectType["BALL_EXPLOSIVE_CHARGE"] = "ball_explosive_charge";
        VisualEffectType["BALL_PIERCING_GLOW"] = "ball_piercing_glow";
        VisualEffectType["BALL_MAGNETIC_FIELD"] = "ball_magnetic_field";
        VisualEffectType["BALL_PHASE_SHIMMER"] = "ball_phase_shimmer";
        VisualEffectType["BALL_GRAVITY_DISTORTION"] = "ball_gravity_distortion";
        VisualEffectType["BALL_TIME_RIPPLE"] = "ball_time_ripple";
        VisualEffectType["BALL_HEALING_LIGHT"] = "ball_healing_light";
        VisualEffectType["BALL_CHAOS_SWIRL"] = "ball_chaos_swirl";
        VisualEffectType["BRICK_FIRE_BURN"] = "brick_fire_burn";
        VisualEffectType["BRICK_ICE_FREEZE"] = "brick_ice_freeze";
        VisualEffectType["BRICK_ELECTRIC_CHAIN"] = "brick_electric_chain";
        VisualEffectType["BRICK_POISON_CORRODE"] = "brick_poison_corrode";
        VisualEffectType["BRICK_EXPLOSION"] = "brick_explosion";
        VisualEffectType["BRICK_SPLITTING"] = "brick_splitting";
        VisualEffectType["BRICK_MAGNETIC_ATTRACT"] = "brick_magnetic_attract";
        VisualEffectType["BRICK_PHASE_FADE"] = "brick_phase_fade";
        VisualEffectType["BRICK_REGENERATION"] = "brick_regeneration";
        VisualEffectType["BRICK_CRYSTAL_SHATTER"] = "brick_crystal_shatter";
        VisualEffectType["PADDLE_FIRE_ARMOR"] = "paddle_fire_armor";
        VisualEffectType["PADDLE_ICE_SHIELD"] = "paddle_ice_shield";
        VisualEffectType["PADDLE_ELECTRIC_CHARGE"] = "paddle_electric_charge";
        VisualEffectType["PADDLE_DAMAGE_SPARKS"] = "paddle_damage_sparks";
        VisualEffectType["PADDLE_REPAIR_GLOW"] = "paddle_repair_glow";
        VisualEffectType["PADDLE_LEVEL_UP_BURST"] = "paddle_level_up_burst";
        VisualEffectType["PADDLE_LASER_CHARGE"] = "paddle_laser_charge";
        VisualEffectType["CORE_DAMAGE_CRACK"] = "core_damage_crack";
        VisualEffectType["CORE_CRITICAL_PULSE"] = "core_critical_pulse";
        VisualEffectType["CORE_HEALING_AURA"] = "core_healing_aura";
        VisualEffectType["CORE_LEVEL_UP_NOVA"] = "core_level_up_nova";
        VisualEffectType["CORE_DESTRUCTION"] = "core_destruction";
        VisualEffectType["ENV_FIRE_PARTICLES"] = "env_fire_particles";
        VisualEffectType["ENV_ICE_CRYSTALS"] = "env_ice_crystals";
        VisualEffectType["ENV_ELECTRIC_ARCS"] = "env_electric_arcs";
        VisualEffectType["ENV_POISON_FOG"] = "env_poison_fog";
        VisualEffectType["ENV_EXPLOSION_SHOCKWAVE"] = "env_explosion_shockwave";
        VisualEffectType["ENV_LIGHT_RAYS"] = "env_light_rays";
        VisualEffectType["UI_BUTTON_GLOW"] = "ui_button_glow";
        VisualEffectType["UI_TRANSITION_FADE"] = "ui_transition_fade";
        VisualEffectType["UI_SUCCESS_SPARKLE"] = "ui_success_sparkle";
        VisualEffectType["UI_ERROR_SHAKE"] = "ui_error_shake";
        return VisualEffectType;
      }({}));

      _export("AdvancedEffectSystem", AdvancedEffectSystem = (_dec = ccclass('AdvancedEffectSystem'), _dec(_class = (_class2 = (_class3 = class AdvancedEffectSystem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "maxEffectNodes", _descriptor, this);

          _initializerDefineProperty(this, "enableEffectStacking", _descriptor2, this);

          _initializerDefineProperty(this, "effectQualityLevel", _descriptor3, this);

          // 0-低, 1-中, 2-高
          _initializerDefineProperty(this, "enableParticlePooling", _descriptor4, this);

          this._effectPool = [];
          this._activeEffects = new Map();
          this._effectStacks = new Map();
          this._particlePool = [];
          this._effectConfigs = new Map();
        }

        static getInstance() {
          return AdvancedEffectSystem._instance;
        }

        onLoad() {
          if (AdvancedEffectSystem._instance === null) {
            AdvancedEffectSystem._instance = this;
          }

          this.initializeEffectPool();
          this.initializeEffectConfigs();
        }

        onDestroy() {
          if (AdvancedEffectSystem._instance === this) {
            AdvancedEffectSystem._instance = null;
          }

          this.clearAllEffects();
        }
        /**
         * 初始化特效池
         */


        initializeEffectPool() {
          for (var i = 0; i < this.maxEffectNodes; i++) {
            var effectNode = new Node("Effect_" + i);
            effectNode.active = false;
            this.node.addChild(effectNode);

            this._effectPool.push(effectNode);
          }

          console.log("Effect pool initialized with " + this.maxEffectNodes + " nodes");
        }
        /**
         * 初始化特效配置
         */


        initializeEffectConfigs() {
          // 弹球火焰尾迹配置
          this._effectConfigs.set(VisualEffectType.BALL_FIRE_TRAIL, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(100, 50, 25),
            lifetime: 1.5,
            startColor: new Color(255, 100, 0, 255),
            endColor: new Color(255, 0, 0, 0),
            startSize: 8,
            endSize: 2,
            speed: 50,
            gravity: {
              x: 0,
              y: -100
            },
            emission: 60,
            shape: 'point',
            blend: 'additive',
            texture: 'fire_particle'
          }); // 弹球冰霜光环配置


          this._effectConfigs.set(VisualEffectType.BALL_ICE_AURA, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(80, 40, 20),
            lifetime: 2.0,
            startColor: new Color(150, 200, 255, 180),
            endColor: new Color(100, 150, 255, 0),
            startSize: 12,
            endSize: 20,
            speed: 20,
            gravity: {
              x: 0,
              y: 0
            },
            emission: 30,
            shape: 'circle',
            blend: 'normal',
            texture: 'ice_crystal'
          }); // 弹球电击火花配置


          this._effectConfigs.set(VisualEffectType.BALL_ELECTRIC_SPARK, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(60, 30, 15),
            lifetime: 0.8,
            startColor: new Color(255, 255, 100, 255),
            endColor: new Color(100, 100, 255, 0),
            startSize: 4,
            endSize: 1,
            speed: 100,
            gravity: {
              x: 0,
              y: 0
            },
            emission: 80,
            shape: 'cone',
            blend: 'additive',
            texture: 'electric_spark'
          }); // 砖块爆炸配置


          this._effectConfigs.set(VisualEffectType.BRICK_EXPLOSION, {
            type: 'particle',
            particleCount: this.getParticleCountByQuality(150, 75, 35),
            lifetime: 1.0,
            startColor: new Color(255, 150, 0, 255),
            endColor: new Color(100, 50, 0, 0),
            startSize: 15,
            endSize: 5,
            speed: 150,
            gravity: {
              x: 0,
              y: -200
            },
            emission: 200,
            shape: 'sphere',
            blend: 'additive',
            texture: 'explosion_fragment',
            burst: true,
            shockwave: true
          }); // 挡板火焰护甲配置


          this._effectConfigs.set(VisualEffectType.PADDLE_FIRE_ARMOR, {
            type: 'composite',
            layers: [{
              type: 'particle',
              particleCount: this.getParticleCountByQuality(40, 20, 10),
              lifetime: 1.5,
              startColor: new Color(255, 100, 0, 200),
              endColor: new Color(255, 0, 0, 0),
              startSize: 6,
              endSize: 12,
              speed: 30,
              emission: 25,
              shape: 'box',
              texture: 'fire_armor'
            }, {
              type: 'glow',
              color: new Color(255, 50, 0, 100),
              intensity: 0.8,
              radius: 20,
              pulsate: true
            }]
          });

          console.log("Initialized " + this._effectConfigs.size + " effect configurations");
        }
        /**
         * 添加特效到对象
         */


        addEffectToObject(targetNode, effectType, duration, stackLevel) {
          if (duration === void 0) {
            duration = -1;
          }

          if (stackLevel === void 0) {
            stackLevel = 1;
          }

          var objectId = targetNode.uuid;
          var effectId = effectType + "_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5); // 检查是否启用特效叠加

          if (this.enableEffectStacking) {
            if (!this._effectStacks.has(objectId)) {
              this._effectStacks.set(objectId, []);
            }

            var existingStack = this._effectStacks.get(objectId);

            var existingEffect = existingStack.find(layer => layer.effectType === effectType);

            if (existingEffect) {
              // 更新现有特效的叠加层级
              existingEffect.stackLevel = Math.min(existingEffect.stackLevel + stackLevel, 5);
              this.updateEffectIntensity(existingEffect);
              return effectId;
            }
          } // 创建新的特效层


          var effectNode = this.getEffectNode();

          if (!effectNode) {
            console.warn('No available effect nodes');
            return '';
          }

          var effectLayer = this.createEffectLayer(effectNode, targetNode, effectType, duration, stackLevel);

          if (!effectLayer) {
            this.returnEffectNode(effectNode);
            return '';
          } // 添加到堆栈


          if (!this._effectStacks.has(objectId)) {
            this._effectStacks.set(objectId, []);
          }

          this._effectStacks.get(objectId).push(effectLayer); // 如果有持续时间，设置自动清理


          if (duration > 0) {
            this.scheduleOnce(() => {
              this.removeEffectFromObject(targetNode, effectType);
            }, duration);
          }

          console.log("Added effect " + effectType + " to object " + objectId + ", stack level: " + stackLevel);
          return effectId;
        }
        /**
         * 从对象移除特效
         */


        removeEffectFromObject(targetNode, effectType) {
          var objectId = targetNode.uuid;

          var effectStack = this._effectStacks.get(objectId);

          if (!effectStack) return;

          if (effectType) {
            // 移除特定类型的特效
            var index = effectStack.findIndex(layer => layer.effectType === effectType);

            if (index !== -1) {
              var layer = effectStack[index];
              this.destroyEffectLayer(layer);
              effectStack.splice(index, 1);
            }
          } else {
            // 移除所有特效
            effectStack.forEach(layer => this.destroyEffectLayer(layer));
            effectStack.length = 0;
          }

          if (effectStack.length === 0) {
            this._effectStacks.delete(objectId);
          }
        }
        /**
         * 创建特效层
         */


        createEffectLayer(effectNode, targetNode, effectType, duration, stackLevel) {
          var config = this._effectConfigs.get(effectType);

          if (!config) {
            console.warn("Effect config not found: " + effectType);
            return null;
          }

          effectNode.active = true;
          effectNode.parent = targetNode;
          effectNode.setPosition(0, 0, 0); // 根据配置类型创建特效

          switch (config.type) {
            case 'particle':
              this.createParticleEffect(effectNode, config, stackLevel);
              break;

            case 'composite':
              this.createCompositeEffect(effectNode, config, stackLevel);
              break;

            case 'shader':
              this.createShaderEffect(effectNode, config, stackLevel);
              break;

            default:
              console.warn("Unknown effect type: " + config.type);
              return null;
          }

          return {
            effectType,
            node: effectNode,
            duration,
            stackLevel,
            blendMode: config.blend || 'normal',
            priority: config.priority || 5,
            isActive: true
          };
        }
        /**
         * 创建粒子特效
         */


        createParticleEffect(effectNode, config, stackLevel) {
          var particle = effectNode.addComponent(ParticleSystem2D); // 基础粒子配置

          particle.totalParticles = Math.floor(config.particleCount * stackLevel);
          particle.duration = config.lifetime;
          particle.emissionRate = config.emission * stackLevel; // 颜色配置

          particle.startColor = config.startColor;
          particle.endColor = config.endColor; // 大小配置

          particle.startSize = config.startSize;
          particle.endSize = config.endSize; // 运动配置

          particle.speed = config.speed;
          particle.speedVar = config.speed * 0.3; // 重力配置

          if (config.gravity) {
            particle.gravity = new Vec2(config.gravity.x, config.gravity.y);
          } // 发射形状配置


          switch (config.shape) {
            case 'point':
              particle.positionType = ParticleSystem2D.PositionType.FREE;
              break;

            case 'circle':
              particle.positionType = ParticleSystem2D.PositionType.RELATIVE;
              break;

            case 'sphere':
              particle.positionType = ParticleSystem2D.PositionType.GROUPED;
              break;
          } // 爆发模式


          if (config.burst) {
            particle.emissionRate = 0;
            particle.totalParticles = config.particleCount * stackLevel;
            this.scheduleOnce(() => {
              particle.resetSystem();
            }, 0.1);
          } // 创建震荡波效果


          if (config.shockwave) {
            this.createShockwaveEffect(effectNode, stackLevel);
          }

          particle.resetSystem();
        }
        /**
         * 创建复合特效
         */


        createCompositeEffect(effectNode, config, stackLevel) {
          config.layers.forEach((layerConfig, index) => {
            var layerNode = new Node("Layer_" + index);
            effectNode.addChild(layerNode);

            switch (layerConfig.type) {
              case 'particle':
                this.createParticleEffect(layerNode, layerConfig, stackLevel);
                break;

              case 'glow':
                this.createGlowEffect(layerNode, layerConfig, stackLevel);
                break;

              case 'distortion':
                this.createDistortionEffect(layerNode, layerConfig, stackLevel);
                break;
            }
          });
        }
        /**
         * 创建发光效果
         */


        createGlowEffect(effectNode, config, stackLevel) {
          var sprite = effectNode.addComponent(Sprite);
          var uiTransform = effectNode.addComponent(UITransform); // 创建发光贴图

          var glowTexture = this.createGlowTexture(config.radius * stackLevel, config.color);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = glowTexture;
          sprite.spriteFrame = spriteFrame;
          uiTransform.setContentSize(config.radius * 2 * stackLevel, config.radius * 2 * stackLevel);
          sprite.color = config.color; // 脉冲动画

          if (config.pulsate) {
            var originalScale = effectNode.scale.clone();
            tween(effectNode).repeatForever(tween().to(0.8, {
              scale: originalScale.multiplyScalar(1.2)
            }).to(0.8, {
              scale: originalScale
            })).start();
          }
        }
        /**
         * 创建震荡波效果
         */


        createShockwaveEffect(effectNode, stackLevel) {
          var shockwaveNode = new Node('Shockwave');
          effectNode.addChild(shockwaveNode);
          var sprite = shockwaveNode.addComponent(Sprite);
          var uiTransform = shockwaveNode.addComponent(UITransform); // 创建环形贴图

          var ringTexture = this.createRingTexture(50 * stackLevel);
          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = ringTexture;
          sprite.spriteFrame = spriteFrame;
          uiTransform.setContentSize(20, 20);
          sprite.color = new Color(255, 255, 255, 200); // 震荡波扩散动画

          tween(shockwaveNode).parallel(tween().to(0.5, {
            scale: new Vec3(5 * stackLevel, 5 * stackLevel, 1)
          }), tween().to(0.5, {
            scale: new Vec3(5 * stackLevel, 5 * stackLevel, 1),
            color: new Color(255, 255, 255, 0)
          })).call(() => {
            shockwaveNode.destroy();
          }).start();
        }
        /**
         * 更新特效强度
         */


        updateEffectIntensity(effectLayer) {
          var particle = effectLayer.node.getComponent(ParticleSystem2D);

          if (particle) {
            var config = this._effectConfigs.get(effectLayer.effectType);

            if (config) {
              particle.totalParticles = Math.floor(config.particleCount * effectLayer.stackLevel);
              particle.emissionRate = config.emission * effectLayer.stackLevel;
              particle.resetSystem();
            }
          }
        }
        /**
         * 工具方法
         */


        getEffectNode() {
          for (var node of this._effectPool) {
            if (!node.active) {
              return node;
            }
          }

          return null;
        }

        returnEffectNode(node) {
          node.active = false;
          node.parent = this.node;
          node.removeAllChildren(); // Remove all components except Transform and UITransform

          var components = node.getComponents(Component);
          components.forEach(component => {
            if (component.constructor.name !== 'Transform' && component.constructor.name !== 'UITransform') {
              component.destroy();
            }
          });
        }

        destroyEffectLayer(layer) {
          layer.isActive = false;
          this.returnEffectNode(layer.node);
        }

        getParticleCountByQuality(high, medium, low) {
          switch (this.effectQualityLevel) {
            case 2:
              return high;

            case 1:
              return medium;

            case 0:
              return low;

            default:
              return medium;
          }
        }

        createGlowTexture(radius, color) {
          var size = radius * 2;
          var canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          var ctx = canvas.getContext('2d');
          var gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
          gradient.addColorStop(0, "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a / 255 + ")");
          gradient.addColorStop(1, "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
          var texture = new Texture2D(); // initWithElement is not available in Cocos Creator 3.x
          // Using a workaround for texture creation

          texture.reset({
            width: canvas.width,
            height: canvas.height
          });
          return texture;
        }

        createRingTexture(radius) {
          var size = radius * 2;
          var canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          var ctx = canvas.getContext('2d');
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
          ctx.stroke();
          var texture = new Texture2D(); // initWithElement is not available in Cocos Creator 3.x
          // Using a workaround for texture creation

          texture.reset({
            width: canvas.width,
            height: canvas.height
          });
          return texture;
        }
        /**
         * 特效管理方法
         */


        clearAllEffects() {
          this._effectStacks.forEach(stack => {
            stack.forEach(layer => this.destroyEffectLayer(layer));
          });

          this._effectStacks.clear();
        }

        setEffectQuality(level) {
          try {
            var oldQuality = this.effectQualityLevel;
            this.effectQualityLevel = Math.max(0, Math.min(2, Math.round(level || 0)));

            if (this.effectQualityLevel !== oldQuality) {
              console.log("Effect quality changed from " + oldQuality + " to " + this.effectQualityLevel); // Update existing effects if needed

              this.updateEffectsForQualityChange();
            }
          } catch (error) {
            console.error('Error setting effect quality:', error);
            this.effectQualityLevel = 2; // Default to high quality
          }
        }

        updateEffectsForQualityChange() {
          try {
            // Update all active effects to match new quality level
            this._effectStacks.forEach(stack => {
              stack.forEach(layer => {
                if (layer.isActive) {
                  this.updateEffectIntensity(layer);
                }
              });
            });
          } catch (error) {
            console.warn('Error updating effects for quality change:', error);
          }
        }

        pauseAllEffects() {
          this._effectStacks.forEach(stack => {
            stack.forEach(layer => {
              var particle = layer.node.getComponent(ParticleSystem2D);

              if (particle && layer.isActive) {
                particle.stopSystem();
              }
            });
          });
        }

        resumeAllEffects() {
          this._effectStacks.forEach(stack => {
            stack.forEach(layer => {
              var particle = layer.node.getComponent(ParticleSystem2D);

              if (particle && layer.isActive) {
                particle.resetSystem();
              }
            });
          });
        }
        /**
         * 快捷方法
         */


        addFireTrailToBall(ballNode, duration) {
          if (duration === void 0) {
            duration = -1;
          }

          return this.addEffectToObject(ballNode, VisualEffectType.BALL_FIRE_TRAIL, duration);
        }

        addIceAuraToBall(ballNode, duration) {
          if (duration === void 0) {
            duration = -1;
          }

          return this.addEffectToObject(ballNode, VisualEffectType.BALL_ICE_AURA, duration);
        }

        addElectricSparksToBall(ballNode, duration) {
          if (duration === void 0) {
            duration = -1;
          }

          return this.addEffectToObject(ballNode, VisualEffectType.BALL_ELECTRIC_SPARK, duration);
        }

        createBrickExplosion(brickNode) {
          this.addEffectToObject(brickNode, VisualEffectType.BRICK_EXPLOSION, 1.0);
        }

        addFireArmorToPaddle(paddleNode, duration) {
          if (duration === void 0) {
            duration = -1;
          }

          return this.addEffectToObject(paddleNode, VisualEffectType.PADDLE_FIRE_ARMOR, duration);
        }

        createShaderEffect(effectNode, config, stackLevel) {
          // 着色器特效的实现留待后续扩展
          console.log('Shader effects not implemented yet');
        }

        createDistortionEffect(effectNode, config, stackLevel) {
          // 扭曲特效的实现留待后续扩展
          console.log('Distortion effects not implemented yet');
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxEffectNodes", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableEffectStacking", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "effectQualityLevel", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableParticlePooling", [property], {
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
//# sourceMappingURL=34d8323b3c31ac963c665e41b376eb95c0459bd0.js.map