System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec2, RandomLaunchStrategy, _crd;

  function _reportPossibleCrUseOfLaunchStrategy(extras) {
    _reporterNs.report("LaunchStrategy", "../LaunchStrategy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLaunchContext(extras) {
    _reporterNs.report("LaunchContext", "../LaunchStrategy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLaunchParams(extras) {
    _reporterNs.report("LaunchParams", "../LaunchStrategy", _context.meta, extras);
  }

  _export("RandomLaunchStrategy", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5f0db0B5h1Aea6xYKcRWjK/", "RandomLaunchStrategy", undefined);

      __checkObsolete__(['Vec2']);

      _export("RandomLaunchStrategy", RandomLaunchStrategy = class RandomLaunchStrategy {
        calculateLaunchParams(context) {
          const baseAngle = Math.PI / 2;
          const randomOffset = (Math.random() - 0.5) * (Math.PI / 6);
          const angle = baseAngle + randomOffset;
          const direction = new Vec2(Math.cos(angle), Math.sin(angle));
          return {
            direction,
            speed: 100
          };
        }

        needsUserInput() {
          return false;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c505a83248edc52276cd5babf117d8813f4c77f0.js.map