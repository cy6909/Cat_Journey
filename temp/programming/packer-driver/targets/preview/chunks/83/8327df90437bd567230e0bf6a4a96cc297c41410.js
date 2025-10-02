System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, Vec2, Collider2D, Contact2DType, Vec3, input, Input, RandomLaunchStrategy, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Ball;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfLaunchStrategy(extras) {
    _reporterNs.report("LaunchStrategy", "./LaunchStrategy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLaunchContext(extras) {
    _reporterNs.report("LaunchContext", "./LaunchStrategy", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRandomLaunchStrategy(extras) {
    _reporterNs.report("RandomLaunchStrategy", "./strategies/RandomLaunchStrategy", _context.meta, extras);
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
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      Vec3 = _cc.Vec3;
      input = _cc.input;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      RandomLaunchStrategy = _unresolved_2.RandomLaunchStrategy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ba31691v+lEpIX5npg55beq", "Ball", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'RigidBody2D', 'Vec2', 'Collider2D', 'IPhysics2DContact', 'Contact2DType', 'Vec3', 'input', 'Input', 'EventMouse']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Ball", Ball = (_dec = ccclass('Ball'), _dec(_class = (_class2 = class Ball extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "initialSpeed", _descriptor, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "minSpeed", _descriptor3, this);

          this._rigidBody = null;
          this.isMoving = false;
          this.fireEffectDuration = 0;
          this.iceEffectDuration = 0;
          // 跟随挡板相关状态
          this._isAttachedToPaddle = true;
          // 初始状态：粘在挡板上
          this._paddleNode = null;
          this._initialBallY = 0;
          // 记录Ball的初始Y位置，不再跟随Paddle的Y
          this._launchStrategy = new (_crd && RandomLaunchStrategy === void 0 ? (_reportPossibleCrUseOfRandomLaunchStrategy({
            error: Error()
          }), RandomLaunchStrategy) : RandomLaunchStrategy)();
          this._aimDirection = null;
        }

        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D); // 查找挡板节点

          this.findPaddleNode(); // 注册鼠标事件用于发射控制

          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

          if (this._rigidBody) {
            // 注册碰撞事件
            var colliders = this.node.getComponents(Collider2D);
            colliders.forEach(collider => {
              collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }); // 设置刚体属性以实现无摩擦完美弹性碰撞

            this._rigidBody.gravityScale = 0; // 无重力！Breakout游戏不需要重力

            this._rigidBody.linearDamping = 0; // 无阻尼，保持恒定速度

            this._rigidBody.angularDamping = 0; // 无角阻尼

            console.log('Ball initialized: no gravity, no damping, perfect bouncing');
          }
        }

        start() {
          // 初始状态禁用物理，等待发射
          if (this._rigidBody) {
            this._rigidBody.enabled = false;
          } // 记录初始Y位置


          this._initialBallY = this.node.position.y;
          console.log("Ball ready, attached to paddle. Initial Y: " + this._initialBallY);
        }

        update(dt) {
          // 如果球粘在挡板上，只跟随挡板的X轴移动，Y轴保持初始位置
          if (this._isAttachedToPaddle && this._paddleNode) {
            var paddlePos = this._paddleNode.position; // 只跟随X轴，Y轴使用初始位置

            var newPos = new Vec3(paddlePos.x, this._initialBallY, this.node.position.z);
            this.node.setPosition(newPos); // 每2秒输出一次调试信息

            if (Math.floor(Date.now() / 1000) % 2 === 0 && Date.now() % 1000 < 50) {
              console.log("Ball following paddle X: paddle(" + paddlePos.x.toFixed(1) + ", " + paddlePos.y.toFixed(1) + ") -> ball(" + newPos.x.toFixed(1) + ", " + newPos.y.toFixed(1) + ")");
            }
          } else if (this._isAttachedToPaddle && !this._paddleNode) {
            // 每3秒输出一次找不到挡板的警告
            if (Math.floor(Date.now() / 1000) % 3 === 0 && Date.now() % 1000 < 50) {
              console.warn('Ball attached but no paddle found, retrying...');

              this._findPaddleNodeActual();
            }
          } // 以下逻辑只在刚体存在且球已发射时执行


          if (!this._rigidBody || this._isAttachedToPaddle) return; // 更新特效持续时间

          if (this.fireEffectDuration > 0) {
            this.fireEffectDuration -= dt;

            if (this.fireEffectDuration < 0) {
              this.fireEffectDuration = 0;
            }
          }

          if (this.iceEffectDuration > 0) {
            this.iceEffectDuration -= dt;

            if (this.iceEffectDuration < 0) {
              this.iceEffectDuration = 0;
            }
          } // 速度控制


          var velocity = this._rigidBody.linearVelocity;
          var speed = velocity.length();

          if (speed > this.maxSpeed) {
            velocity.normalize();
            velocity.multiplyScalar(this.maxSpeed);
            this._rigidBody.linearVelocity = velocity;
          } else if (speed < this.initialSpeed * 0.8) {
            velocity.normalize();
            velocity.multiplyScalar(this.initialSpeed);
            this._rigidBody.linearVelocity = velocity;
          }
        }

        onDestroy() {
          // 清理鼠标事件监听
          input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }

        setLaunchStrategy(strategy) {
          this._launchStrategy = strategy;
        }

        setAimDirection(direction) {
          this._aimDirection = direction;
        } // GameManager调用此方法直接设置Paddle引用，避免查找延迟


        setPaddleReference(paddleNode) {
          this._paddleNode = paddleNode;
          console.log('✅ Ball paddle reference set directly by GameManager');
        }

        findPaddleNode() {
          // 延迟查找挡板，确保所有节点都已创建
          this.scheduleOnce(() => {
            this._findPaddleNodeActual();
          }, 0.1);
        }

        _findPaddleNodeActual() {
          // 通过Canvas查找挡板节点
          var canvas = this.node.parent;
          console.log('Ball searching for paddle, canvas children count:', canvas ? canvas.children.length : 0);

          if (canvas) {
            // 遍历Canvas的子节点寻找挡板
            for (var child of canvas.children) {
              console.log("Checking child: " + child.name + ", has PaddleController: " + !!child.getComponent('PaddleController'));

              if (child.name.includes('Paddle') || child.getComponent('PaddleController')) {
                this._paddleNode = child;
                console.log('✅ Ball found paddle node:', child.name);
                return;
              }
            }
          } // 如果还是找不到，尝试通过GameManager获取


          var gameManager = this.node.scene.getComponentInChildren('GameManager');

          if (gameManager && gameManager.getPaddleNode) {
            this._paddleNode = gameManager.getPaddleNode();
            console.log('✅ Ball found paddle via GameManager');
            return;
          }

          console.warn('❌ Ball could not find paddle node');
        }

        onMouseDown(event) {
          if (this._isAttachedToPaddle) {
            console.log('Mouse down - preparing to launch ball');
          }
        }

        onMouseUp(event) {
          if (this._isAttachedToPaddle) {
            this.launchBall();
          }
        }

        launchBall() {
          this._isAttachedToPaddle = false; // 启用物理

          if (this._rigidBody) {
            this._rigidBody.enabled = true;
          }

          var context = {
            paddlePosition: this._paddleNode ? new Vec2(this._paddleNode.position.x, this._paddleNode.position.y) : new Vec2(0, 0),
            ballPosition: new Vec2(0, 0),
            mousePosition: new Vec2(0, 0),
            aimDirection: this._aimDirection || new Vec2(0, 1)
          };

          var params = this._launchStrategy.calculateLaunchParams(context);

          this.launch(params.direction);
          console.log('Aiming relic activated - Ball launch strategy changed');
        }

        launch(direction) {
          if (!this._rigidBody) return;
          var velocity;

          if (direction && (direction.x !== 0 || direction.y !== 0)) {
            // 使用指定方向
            var normalized = direction.normalize();
            velocity = new Vec2(normalized.x * this.initialSpeed, normalized.y * this.initialSpeed);
          } else {
            // 使用默认随机方向
            var angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
            velocity = new Vec2(Math.cos(angle) * this.initialSpeed, Math.sin(angle) * this.initialSpeed);
          }

          this._rigidBody.linearVelocity = velocity;
          this.isMoving = true;
          console.log("Ball launched from position: (" + this.node.position.x + ", " + this.node.position.y + ")");
          console.log("Ball velocity: (" + velocity.x + ", " + velocity.y + "), angle: " + Math.atan2(velocity.y, velocity.x) * 180 / Math.PI + "\xB0");
        }

        launchWithDefaultDirection() {
          this.launch();
        }

        resetBall() {
          if (!this._rigidBody) return;
          this.node.setPosition(0, 0, 0);
          this._rigidBody.linearVelocity = new Vec2(0, 0);
          this.isMoving = false;
          this.scheduleOnce(() => this.launch(), 1.0);
        } // 特效系统方法


        applyFireEffect(duration) {
          if (typeof duration === 'number' && duration > 0) {
            this.fireEffectDuration = duration;
          }
        }

        applyIceEffect(duration) {
          if (typeof duration === 'number' && duration > 0) {
            this.iceEffectDuration = duration;
          }
        }

        hasFireEffect() {
          return this.fireEffectDuration > 0;
        }

        hasIceEffect() {
          return this.iceEffectDuration > 0;
        }

        getFireEffectDuration() {
          return this.fireEffectDuration;
        }

        getIceEffectDuration() {
          return this.iceEffectDuration;
        } // 碰撞处理方法 - 修复测试失败的核心问题


        onBeginContact(_selfCollider, otherCollider, _contact) {
          if (!otherCollider || !otherCollider.node) {
            return;
          }

          var otherNode = otherCollider.node;

          if (otherNode.name === 'Paddle' || otherNode.getComponent('PaddleController')) {
            this.onPaddleHit(otherNode);
          }
        }

        onPaddleHit(paddleNode) {
          var _paddleNode$getCompon;

          if (!this._rigidBody || !paddleNode) return;
          var velocity = this._rigidBody.linearVelocity;
          var ballPos = this.node.position;
          var paddlePos = paddleNode.position; // 计算球相对于挡板中心的偏移量 (-1到1之间)

          var paddleWidth = ((_paddleNode$getCompon = paddleNode.getComponent('UITransform')) == null ? void 0 : _paddleNode$getCompon.width) || 100;
          var offsetX = (ballPos.x - paddlePos.x) / (paddleWidth / 2);
          var clampedOffset = Math.max(-1, Math.min(1, offsetX)); // 根据碰撞位置调整反弹角度 (20度到160度之间)

          var minAngle = 20 * Math.PI / 180; // 最小角度20度

          var maxAngle = 160 * Math.PI / 180; // 最大角度160度

          var targetAngle = minAngle + (1 - (clampedOffset + 1) / 2) * (maxAngle - minAngle); // 保持当前速度大小，只改变方向

          var speed = velocity.length();
          var newVelocity = new Vec2(Math.cos(targetAngle) * speed, Math.sin(targetAngle) * speed); // 确保Y方向始终向上

          if (newVelocity.y < 0) {
            newVelocity.y = Math.abs(newVelocity.y);
          } // 防止完全垂直（90度）的情况


          if (Math.abs(newVelocity.x) < speed * 0.1) {
            newVelocity.x = speed * 0.1 * (Math.random() > 0.5 ? 1 : -1); // 重新归一化并恢复速度

            var normalized = newVelocity.normalize();
            newVelocity.x = normalized.x * speed;
            newVelocity.y = normalized.y * speed;
          }

          this._rigidBody.linearVelocity = newVelocity;
          console.log("Paddle hit - Offset: " + clampedOffset.toFixed(2) + ", Angle: " + (targetAngle * 180 / Math.PI).toFixed(1) + "\xB0, Velocity: (" + newVelocity.x.toFixed(1) + ", " + newVelocity.y.toFixed(1) + ")");
        }

        get velocity() {
          return this._rigidBody ? this._rigidBody.linearVelocity : new Vec2(0, 0);
        }

        set velocity(value) {
          if (this._rigidBody) {
            this._rigidBody.linearVelocity = value;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "initialSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 600;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8327df90437bd567230e0bf6a4a96cc297c41410.js.map