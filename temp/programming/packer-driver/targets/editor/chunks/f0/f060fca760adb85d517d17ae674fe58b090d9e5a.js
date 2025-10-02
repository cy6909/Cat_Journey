System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec2, AimingLaunchStrategy, _crd;

  function _reportPossibleCrUseOfLaunchStrategy(extras) {
    _reporterNs.report("LaunchStrategy", "../LaunchStrategy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLaunchContext(extras) {
    _reporterNs.report("LaunchContext", "../LaunchStrategy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLaunchParams(extras) {
    _reporterNs.report("LaunchParams", "../LaunchStrategy", _context.meta, extras);
  }

  _export("AimingLaunchStrategy", void 0);

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

      _cclegacy._RF.push({}, "1d937IhzqhMgquAuNY8St/+", "AimingLaunchStrategy", undefined);

      __checkObsolete__(['Vec2']);

      _export("AimingLaunchStrategy", AimingLaunchStrategy = class AimingLaunchStrategy {
        calculateLaunchParams(context) {
          if (!context.aimDirection) {
            return {
              direction: new Vec2(0, 1),
              speed: 100
            };
          }

          const normalized = context.aimDirection.clone().normalize();
          return {
            direction: normalized,
            speed: 100
          };
        }

        needsUserInput() {
          return true;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f060fca760adb85d517d17ae674fe58b090d9e5a.js.map