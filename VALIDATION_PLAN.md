Cat-Conquest: Roguelike Breakout Module Validation Plan
PRIORITY 0: Project Setup Validation
[ ] ✅ validate project setup:

[ ] Check that a Cocos Creator project exists in the root directory.

[ ] Open the project in Cocos Creator and confirm it loads without errors.

[ ] Run the GameScene in the simulator; it should display a blank screen without crashing.

PRIORITY 1: Core Gameplay Entities Validation
[ ] ✅ validate paddle functionality:

[ ] Place the Paddle prefab in GameScene.

[ ] Run the scene. Verify that the paddle moves left and right with mouse/touch input.

[ ] Verify the paddle is constrained within the screen's horizontal boundaries.

[ ] ✅ validate ball physics:

[ ] Place the Ball prefab in GameScene.

[ ] Launch the ball. Verify it moves and bounces off the walls and paddle according to physics principles.

[ ] ✅ validate brick destruction:

[ ] Place a Brick prefab in the scene.

[ ] Manually position the ball to collide with the brick.

[ ] Verify the brick is destroyed after one hit (for a 1-HP brick).

PRIORITY 2: Core Game Loop Validation
[ ] ✅ validate level loading:

[ ] Run the GameScene. Verify that a grid of bricks is automatically generated and displayed at the start.

[ ] ✅ validate loss condition:

[ ] Let the ball fall past the paddle into the bottom of the screen.

[ ] Verify that the game enters a "Game Over" state or that a life is correctly deducted.

[ ] ✅ validate win condition:

[ ] Destroy all bricks in the level.

[ ] Verify that the game enters a "Level Complete" state.