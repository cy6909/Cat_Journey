System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, CameraVisibilityAnalyzer;

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

      _cclegacy._RF.push({}, "3048bMhuERFyo/k9czxJN7Q", "CameraVisibilityAnalyzer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Camera', 'Layers']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CameraVisibilityAnalyzer", CameraVisibilityAnalyzer = (_dec = ccclass('CameraVisibilityAnalyzer'), _dec(_class = class CameraVisibilityAnalyzer extends Component {
        onLoad() {
          this.analyzeCameraVisibility();
        }

        analyzeCameraVisibility() {
          // 从场景文件中看到的摄像机可见性值
          var cameraVisibility = 41943040;
          console.log('=== 摄像机渲染Layer分析 ===');
          console.log("\u6444\u50CF\u673A Visibility \u503C: " + cameraVisibility);
          console.log("\u4E8C\u8FDB\u5236\u8868\u793A: " + cameraVisibility.toString(2)); // 常见Layer值分析

          var commonLayers = {
            'DEFAULT': 1,
            'UI_2D': 33554432,
            // 这是Canvas默认Layer
            'UI_3D': 67108864,
            'SCENE_GIZMO': 1073741824,
            'EDITOR': 2147483648
          };
          console.log('\n--- Layer匹配检测 ---');

          for (var [name, value] of Object.entries(commonLayers)) {
            var isVisible = (cameraVisibility & value) !== 0;
            console.log(name + " (" + value + "): " + (isVisible ? '✅ 可见' : '❌ 不可见'));
          } // BackgroundLayer使用的Layer 1分析


          var backgroundLayer = 1;
          var canRenderBackground = (cameraVisibility & backgroundLayer) !== 0;
          console.log("\n--- \u5173\u952E\u53D1\u73B0 ---");
          console.log("Background Layer (1): " + (canRenderBackground ? '✅ 可以渲染' : '❌ 不能渲染')); // 建议的修复方法

          console.log('\n--- 修复建议 ---');
          console.log('1. 将Background节点Layer改为UI_2D (33554432)');
          console.log('2. 或者修改摄像机Visibility包含Layer 1');
          console.log("   \u65B0Visibility\u503C\u5E94\u8BE5\u662F: " + (cameraVisibility | backgroundLayer));
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6d4b076ac4184424d8d38b8e53e38b138104219f.js.map