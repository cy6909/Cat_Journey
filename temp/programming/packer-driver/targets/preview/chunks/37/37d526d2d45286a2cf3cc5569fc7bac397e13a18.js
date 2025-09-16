System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, SpriteFrame, Texture2D, Color, UITransform, view, Canvas, _dec, _class, _class2, _descriptor, _crd, ccclass, property, BackgroundDiagnostic;

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
      Canvas = _cc.Canvas;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7c70fK5xIdO06njxLPoa0xb", "BackgroundDiagnostic", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'Texture2D', 'Color', 'UITransform', 'view', 'Canvas', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BackgroundDiagnostic", BackgroundDiagnostic = (_dec = ccclass('BackgroundDiagnostic'), _dec(_class = (_class2 = class BackgroundDiagnostic extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "testColor", _descriptor, this);
        }

        // 洋红色，非常显眼
        onLoad() {
          console.log('=== BackgroundDiagnostic: 开始全面诊断 ===');
          this.diagnoseEnvironment();
          this.diagnoseNode();
          this.createVisibleBackground();
          this.scheduleOnce(() => {
            this.finalDiagnosis();
          }, 0.5);
        }

        diagnoseEnvironment() {
          console.log('--- 环境诊断 ---'); // 1. 检查Canvas设置 - 遍历父节点查找Canvas

          var currentNode = this.node;
          var canvas = null;

          while (currentNode && !canvas) {
            canvas = currentNode.getComponent(Canvas);

            if (!canvas) {
              currentNode = currentNode.parent;
            }
          }

          if (canvas) {
            console.log("Canvas found: " + canvas.node.name);
            var canvasTransform = canvas.getComponent(UITransform);

            if (canvasTransform) {
              console.log("Canvas size: " + canvasTransform.width + "x" + canvasTransform.height);
            }

            console.log("Canvas renderMode: " + canvas.renderMode);
            console.log("Canvas priority: " + canvas.priority);
          } else {
            console.error('❌ Canvas not found in parent nodes!');
          } // 2. 检查屏幕信息


          var designSize = view.getDesignResolutionSize();
          var screenSize = view.getVisibleSize();
          console.log("Design resolution: " + designSize.width + "x" + designSize.height);
          console.log("Screen size: " + screenSize.width + "x" + screenSize.height);
        }

        diagnoseNode() {
          console.log('--- 节点诊断 ---'); // 1. 检查节点层级

          console.log("Node name: " + this.node.name);
          console.log("Node active: " + this.node.active);
          console.log("Node parent: " + (this.node.parent ? this.node.parent.name : 'none'));
          console.log("Node children count: " + this.node.children.length);
          console.log("Node position: (" + this.node.position.x + ", " + this.node.position.y + ", " + this.node.position.z + ")");
          console.log("Node scale: (" + this.node.scale.x + ", " + this.node.scale.y + ", " + this.node.scale.z + ")");
          console.log("Node siblingIndex: " + this.node.getSiblingIndex()); // 2. 检查现有组件

          var components = this.node.components;
          console.log("Total components: " + components.length);
          components.forEach((comp, index) => {
            console.log("Component " + index + ": " + comp.constructor.name);
          }); // 3. 检查UITransform

          var transform = this.node.getComponent(UITransform);

          if (transform) {
            console.log("UITransform size: " + transform.width + "x" + transform.height);
            console.log("UITransform anchor: (" + transform.anchorX + ", " + transform.anchorY + ")");
          } else {
            console.error('❌ UITransform not found!');
          } // 4. 检查现有的Sprite组件


          var sprites = this.node.getComponents(Sprite);
          console.log("Existing Sprite components: " + sprites.length);
          sprites.forEach((sprite, index) => {
            console.log("Sprite " + index + ": spriteFrame=" + (sprite.spriteFrame ? 'exists' : 'null') + ", color=(" + sprite.color.r + "," + sprite.color.g + "," + sprite.color.b + "," + sprite.color.a + ")");
          });
        }

        createVisibleBackground() {
          console.log('--- 创建可见背景 ---'); // 1. 强制设置节点尺寸

          var transform = this.node.getComponent(UITransform);

          if (!transform) {
            transform = this.node.addComponent(UITransform);
            console.log('Added UITransform component');
          } // 设置为固定的大尺寸，忽略其他设置


          transform.setContentSize(960, 640);
          transform.setAnchorPoint(0.5, 0.5);
          console.log("Set UITransform to: " + transform.width + "x" + transform.height); // 2. 移除所有现有的Sprite

          var existingSprites = this.node.getComponents(Sprite);
          console.log("Removing " + existingSprites.length + " existing sprites");
          existingSprites.forEach(sprite => sprite.destroy()); // 3. 创建简单的4x4像素纹理（避免大纹理问题）

          var texture = new Texture2D();
          texture.reset({
            width: 4,
            height: 4,
            format: Texture2D.PixelFormat.RGBA8888
          }); // 创建4x4红色像素

          var data = new Uint8Array(4 * 4 * 4);

          for (var i = 0; i < data.length; i += 4) {
            data[i] = this.testColor.r; // R

            data[i + 1] = this.testColor.g; // G

            data[i + 2] = this.testColor.b; // B

            data[i + 3] = this.testColor.a; // A
          }

          texture.uploadData(data);
          console.log('Created 4x4 red texture'); // 4. 创建SpriteFrame并设置到Sprite

          var spriteFrame = new SpriteFrame();
          spriteFrame.texture = texture;
          console.log('Created SpriteFrame'); // 5. 添加Sprite组件

          var sprite = this.node.addComponent(Sprite);
          sprite.spriteFrame = spriteFrame;
          sprite.color = Color.WHITE; // 确保没有颜色调制

          sprite.type = Sprite.Type.SIMPLE;
          sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 自定义尺寸模式

          console.log('Added and configured Sprite component'); // 6. 强制更新渲染

          sprite.markForUpdateRenderData();
          console.log('Marked sprite for render update'); // 7. 移到最前层

          this.node.setSiblingIndex(-1); // 移到最后（最前层）

          console.log("Node moved to siblingIndex: " + this.node.getSiblingIndex());
        }

        finalDiagnosis() {
          console.log('--- 最终诊断 ---');
          var transform = this.node.getComponent(UITransform);
          var sprite = this.node.getComponent(Sprite);

          if (transform) {
            console.log("Final UITransform size: " + transform.width + "x" + transform.height);
          }

          if (sprite) {
            console.log("Final Sprite: spriteFrame=" + (sprite.spriteFrame ? 'exists' : 'null'));
            console.log("Final Sprite color: (" + sprite.color.r + "," + sprite.color.g + "," + sprite.color.b + "," + sprite.color.a + ")");
            console.log("Final Sprite type: " + sprite.type);
            console.log("Final Sprite sizeMode: " + sprite.sizeMode);
          }

          console.log("Final node active: " + this.node.active);
          console.log("Final node position: (" + this.node.position.x + ", " + this.node.position.y + ")");
          console.log("Final node scale: (" + this.node.scale.x + ", " + this.node.scale.y + ")");
          console.log("Final siblingIndex: " + this.node.getSiblingIndex());
          console.log('=== 诊断完成 ===');
          console.log('如果还是看不到红色背景，问题可能在于：');
          console.log('1. 节点被其他UI遮挡');
          console.log('2. Canvas或Camera配置问题');
          console.log('3. 节点不在可视区域内');
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "testColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 0, 255, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=37d526d2d45286a2cf3cc5569fc7bac397e13a18.js.map