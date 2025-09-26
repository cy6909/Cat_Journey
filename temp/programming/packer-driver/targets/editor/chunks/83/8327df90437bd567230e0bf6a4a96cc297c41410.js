System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, Vec2, Collider2D, Contact2DType, Vec3, input, Input, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Ball;

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
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
      Collider2D = _cc.Collider2D;
      Contact2DType = _cc.Contact2DType;
      Vec3 = _cc.Vec3;
      input = _cc.input;
      Input = _cc.Input;
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
        constructor(...args) {
          super(...args);

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
        }

        // 记录Ball的初始Y位置，不再跟随Paddle的Y
        onLoad() {
          this._rigidBody = this.getComponent(RigidBody2D); // 查找挡板节点

          this.findPaddleNode(); // 注册鼠标事件用于发射控制

          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

          if (this._rigidBody) {
            // 注册碰撞事件
            const colliders = this.node.getComponents(Collider2D);
            colliders.forEach(collider => {
              collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            }); // 设置刚体属性以实现无摩擦完美弹性碰撞

            console.log('Ball initialized with collision detection and paddle following');
          }
        }

        start() {
          // 初始状态禁用物理，等待发射
          if (this._rigidBody) {
            this._rigidBody.enabled = false;
          } // 记录初始Y位置


          this._initialBallY = this.node.position.y;
          console.log(`Ball ready, attached to paddle. Initial Y: ${this._initialBallY}`);
        }

        update(dt) {
          // 如果球粘在挡板上，只跟随挡板的X轴移动，Y轴保持初始位置
          if (this._isAttachedToPaddle && this._paddleNode) {
            const paddlePos = this._paddleNode.position; // 只跟随X轴，Y轴使用初始位置

            const newPos = new Vec3(paddlePos.x, this._initialBallY, this.node.position.z);
            this.node.setPosition(newPos); // 每2秒输出一次调试信息

            if (Math.floor(Date.now() / 1000) % 2 === 0 && Date.now() % 1000 < 50) {
              console.log(`Ball following paddle X: paddle(${paddlePos.x.toFixed(1)}, ${paddlePos.y.toFixed(1)}) -> ball(${newPos.x.toFixed(1)}, ${newPos.y.toFixed(1)})`);
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


          const velocity = this._rigidBody.linearVelocity;
          const speed = velocity.length();

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
          const canvas = this.node.parent;
          console.log('Ball searching for paddle, canvas children count:', canvas ? canvas.children.length : 0);

          if (canvas) {
            // 遍历Canvas的子节点寻找挡板
            for (const child of canvas.children) {
              console.log(`Checking child: ${child.name}, has PaddleController: ${!!child.getComponent('PaddleController')}`);

              if (child.name.includes('Paddle') || child.getComponent('PaddleController')) {
                this._paddleNode = child;
                console.log('✅ Ball found paddle node:', child.name);
                return;
              }
            }
          } // 如果还是找不到，尝试通过GameManager获取


          const gameManager = this.node.scene.getComponentInChildren('GameManager');

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
          } // 在Y轴总计30度内随机发射 (向上75-105度)


          const baseAngle = Math.PI / 2; // 90度，向上

          const randomOffset = (Math.random() - 0.5) * (Math.PI / 6); // ±15度 = 30度范围

          const angle = baseAngle + randomOffset;
          const direction = new Vec2(Math.cos(angle), Math.sin(angle));
          this.launch(direction);
          console.log(`Ball launched at angle: ${(angle * 180 / Math.PI).toFixed(1)}°`);
        }

        launch(direction) {
          if (!this._rigidBody) return;
          let velocity;

          if (direction && (direction.x !== 0 || direction.y !== 0)) {
            // 使用指定方向
            const normalized = direction.normalize();
            velocity = new Vec2(normalized.x * this.initialSpeed, normalized.y * this.initialSpeed);
          } else {
            // 使用默认随机方向
            const angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
            velocity = new Vec2(Math.cos(angle) * this.initialSpeed, Math.sin(angle) * this.initialSpeed);
          }

          this._rigidBody.linearVelocity = velocity;
          this.isMoving = true;
          console.log(`Ball launched from position: (${this.node.position.x}, ${this.node.position.y})`);
          console.log(`Ball velocity: (${velocity.x}, ${velocity.y}), angle: ${Math.atan2(velocity.y, velocity.x) * 180 / Math.PI}°`);
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

          const otherNode = otherCollider.node;

          if (otherNode.name === 'Paddle' || otherNode.getComponent('PaddleController')) {
            this.onPaddleHit(otherNode);
          }
        }

        onPaddleHit(paddleNode) {
          if (!this._rigidBody || !paddleNode) return;
          const velocity = this._rigidBody.linearVelocity; // 修复测试失败的问题：确保球向上反弹

          if (velocity.y < 0) {
            velocity.y = Math.abs(velocity.y);
            this._rigidBody.linearVelocity = velocity;
          }
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
        initializer: function () {
          return 100;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 600;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8327df90437bd567230e0bf6a4a96cc297c41410.js.map