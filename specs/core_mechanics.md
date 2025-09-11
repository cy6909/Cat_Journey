Specification: Roguelike Breakout Module
1. General
Engine: Cocos Creator 3.x.   

Language: TypeScript.   

Target Platform: WeChat Mini Game.   

Core Gameplay: A 2D "Breakout" / "Arkanoid" style game with Roguelike elements.

2. Game Objects & Components
2.1. Paddle
Prefab: assets/prefabs/Paddle.prefab

Component: assets/scripts/PaddleController.ts

Functionality:

Controlled by the player via touch or mouse drag, moving horizontally.

Must be constrained within the visible screen width.

Physics: Should be a STATIC or KINEMATIC RigidBody2D to be controlled by script, not forces.

Collision: Must have a BoxCollider2D.

2.2. Ball
Prefab: assets/prefabs/Ball.prefab

Component: assets/scripts/Ball.ts

Functionality:

Physics: Must be a DYNAMIC RigidBody2D.

The ball's velocity should remain constant or be explicitly managed by the game logic (i.e., it should not slow down due to friction).

A PhysicsMaterial must be applied with restitution set to 1.0 and friction to 0.0 to ensure perfect bouncing.

Collision: Must have a CircleCollider2D.

2.3. Bricks
Prefab: assets/prefabs/Brick.prefab

Component: assets/scripts/Brick.ts

Functionality:

Standard bricks are destroyed in a single hit.

Must be a STATIC RigidBody2D with a BoxCollider2D.

The Brick.ts script must contain a public property for health (e.g., public health: number = 1;).

On collision with the ball, its health decreases. When health reaches zero, the node is destroyed.

3. Game Flow & Systems
3.1. Game Manager
Script: assets/scripts/GameManager.ts

Functionality:

Must be a singleton accessible from other scripts.

Manages game states: PRE_START, PLAYING, LEVEL_COMPLETE, GAME_OVER.

Responsible for spawning the initial layout of bricks for a level.

Manages player lives and score.

3.2. Level Structure
Levels are defined by a grid of bricks.

The GameManager should read a simple data structure (e.g., a 2D array) to generate the brick layout.

The play area is defined by four invisible walls with BoxCollider2D components.

The bottom wall is a "death zone" trigger. When the ball enters this trigger area, a life is lost.

3.3. Input
The system must listen for Node.EventType.TOUCH_MOVE or equivalent mouse events.

The event listener will update the paddle's horizontal position based on the touch/cursor's X-coordinate.

4. Roguelike Elements (Initial Implementation)
4.1. Power-ups
Power-ups are items dropped by destroyed bricks.

They should be prefabs that fall downwards when spawned.

If the paddle collides with a power-up, the corresponding effect is triggered.

Initial Power-up: Multi-ball. Spawns two additional balls.

4.2. Relics
Relics are passive upgrades that last for an entire run.

A RelicManager.ts script will track which relics the player possesses.

Other game components (like Brick.ts) will query the RelicManager to see if their behavior should be modified.

Initial Relic: Explosive Bricks. When a brick is destroyed, it triggers a small area-of-effect explosion, damaging adjacent bricks.