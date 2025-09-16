System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, CanvasLayerFixer;

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d45c3aTY/VNf6msWjCdskRo", "CanvasLayerFixer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CanvasLayerFixer", CanvasLayerFixer = (_dec = ccclass('CanvasLayerFixer'), _dec(_class = (_class2 = class CanvasLayerFixer extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "targetLayerValue", _descriptor, this);

          // Canvas默认Layer值
          _initializerDefineProperty(this, "debugMode", _descriptor2, this);
        }

        onLoad() {
          if (this.debugMode) {
            console.log('CanvasLayerFixer: 开始修复Layer配置');
          }

          this.fixNodeLayers();
        }

        fixNodeLayers() {
          // 修复当前节点
          this.fixSingleNode(this.node); // 递归修复所有子节点

          this.fixChildrenRecursively(this.node);

          if (this.debugMode) {
            console.log(`CanvasLayerFixer: 修复完成，目标Layer: ${this.targetLayerValue}`);
          }
        }

        fixChildrenRecursively(parentNode) {
          parentNode.children.forEach(child => {
            this.fixSingleNode(child);

            if (child.children.length > 0) {
              this.fixChildrenRecursively(child);
            }
          });
        }

        fixSingleNode(node) {
          const oldLayer = node.layer; // 只有Layer不匹配时才修改

          if (oldLayer !== this.targetLayerValue) {
            node.layer = this.targetLayerValue;

            if (this.debugMode) {
              console.log(`CanvasLayerFixer: 修复节点 "${node.name}" Layer: ${oldLayer} -> ${this.targetLayerValue}`);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetLayerValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 33554432;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "debugMode", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6b6d7890f2722c752a481f26d501bd9c31742df0.js.map