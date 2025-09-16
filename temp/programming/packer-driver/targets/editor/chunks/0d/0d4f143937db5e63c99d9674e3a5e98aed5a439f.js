System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, RelicManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, RelicUI;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRelicManager(extras) {
    _reporterNs.report("RelicManager", "../managers/RelicManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRelic(extras) {
    _reporterNs.report("Relic", "../managers/RelicManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      RelicManager = _unresolved_2.RelicManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "13f22uTCrVBmJvWanQSnSuh", "RelicUI", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Layout']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RelicUI", RelicUI = (_dec = ccclass('RelicUI'), _dec2 = property(Node), _dec3 = property(Label), _dec(_class = (_class2 = class RelicUI extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "relicContainer", _descriptor, this);

          _initializerDefineProperty(this, "relicCountLabel", _descriptor2, this);

          this._relicManager = null;
        }

        onLoad() {
          this._relicManager = (_crd && RelicManager === void 0 ? (_reportPossibleCrUseOfRelicManager({
            error: Error()
          }), RelicManager) : RelicManager).getInstance();
        }

        start() {
          this.updateRelicDisplay();
          this.schedule(this.updateRelicDisplay, 1.0);
        }

        updateRelicDisplay() {
          if (!this._relicManager) return;

          const activeRelics = this._relicManager.getActiveRelics();

          if (this.relicCountLabel) {
            this.relicCountLabel.string = `Relics: ${activeRelics.length}`;
          }

          if (this.relicContainer) {
            this.relicContainer.removeAllChildren();
            activeRelics.forEach(relic => {
              this.createRelicItem(relic);
            });
          }
        }

        createRelicItem(relic) {
          if (!this.relicContainer) return;
          const relicNode = new Node(`Relic_${relic.id}`);
          const label = relicNode.addComponent(Label);
          label.string = relic.name;
          label.fontSize = 16;
          label.lineHeight = 18;
          this.relicContainer.addChild(relicNode);
        }

        showRelicAcquired(relic) {
          console.log(`🎯 New Relic Acquired: ${relic.name} - ${relic.description}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "relicContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "relicCountLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0d4f143937db5e63c99d9674e3a5e98aed5a439f.js.map