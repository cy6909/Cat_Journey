# Cat-Conquest: Roguelike Breakout Module

A WeChat Mini Game built with Cocos Creator 3.x and TypeScript that combines classic Breakout/Arkanoid gameplay with roguelike elements including power-ups and passive relics.

## 🚀 Compilation & Startup

### Prerequisites
- Cocos Creator 3.x (recommended: 3.8.0 or later)
- WeChat Developer Tools for Mini Game development
- Node.js and npm for dependency management

### Build Process

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Open in Cocos Creator**
   - Launch Cocos Creator 3.x
   - Open the project directory: `D:\project\claudecode\wx\Cat_Journey`
   - The main scene will load automatically: `assets/scenes/GameScene.scene`

3. **Build for WeChat Mini Game**
   - In Cocos Creator: Project → Build
   - Select Platform: "WeChat Mini Game"
   - Configure build settings:
     - Title: "Cat-Conquest: Roguelike Breakout"
     - Orientation: Landscape
     - Resolution: 960x640 (fit width/height enabled)
   - Click "Build"

4. **Deploy to WeChat Developer Tools**
   - Open WeChat Developer Tools
   - Import the built project from `build/wechatgame/`
   - Preview and test on device/simulator

## 🎮 Gameplay Introduction

### Core Mechanics
**Breakout with a Twist** - Control a paddle to keep the ball in play while destroying all bricks to complete levels. But this isn't your ordinary breakout game!

### Controls
- **Touch/Mouse**: Move paddle horizontally by touching or dragging
- **Laser Power-up**: Touch/click to fire lasers when laser paddle power-up is active
- **Boundary Constraints**: Paddle automatically stays within screen bounds

### Roguelike Elements

#### 🔋 Power-ups (Temporary Effects)
Power-ups drop randomly from destroyed bricks (20% chance) and activate when collected by the paddle:

- **MultiBall Power-up** (Yellow)
  - Spawns 2 additional balls in a spread pattern
  - Instant effect, no duration limit
  
- **Laser Paddle Power-up** (Red)
  - Duration: 10 seconds
  - Enables paddle to shoot lasers upward
  - Fire rate: 0.5 seconds between shots
  - Lasers deal 1 damage to bricks

#### 🛡️ Relics (Permanent Upgrades)
Relics are passive upgrades that persist across levels. One random relic is granted after completing each level:

- **Explosive Bricks** 💥
  - When any brick is destroyed, it deals 1 damage to all bricks within 100 units
  - Creates satisfying chain reactions

- **Multi Ball Start** (Future expansion)
  - Start each level with 3 balls instead of 1

- **Laser Power** (Future expansion)  
  - Laser power-up deals double damage

- **Penetrating Shots** (Future expansion)
  - Ball can pass through bricks, destroying multiple in a row

- **Speed Boost** (Future expansion)
  - Ball moves 25% faster

### Game Flow
1. **Pre-Start Phase** (2 seconds)
   - Level initializes with brick layout
   - Ball and paddle spawn in starting positions

2. **Playing Phase**
   - Ball launches automatically at angle
   - Destroy all bricks to complete level
   - Collect power-ups for temporary advantages

3. **Level Complete Phase** (3 seconds)
   - Random relic is awarded
   - Next level generates with increased difficulty

4. **Game Over Phase**
   - Triggered when all lives are lost
   - Ball falls into bottom death zone

### Progression System
- **Lives**: Start with 3 lives, lose 1 when ball hits death zone
- **Score**: 10 points per brick destroyed
- **Levels**: Procedurally generated layouts, higher levels include multi-hit bricks
- **Difficulty**: Later levels feature bricks with 2 hit points (50% chance)

## 🏗️ Technical Architecture

### Core Components
- **GameManager.ts**: Singleton managing game states and level progression
- **PaddleController.ts**: Touch/mouse input handling with boundary constraints  
- **Ball.ts**: Physics-based movement with perfect bounce mechanics
- **Brick.ts**: Health system and collision detection with power-up drops
- **DeathZone.ts**: Bottom boundary trigger for life loss

### Power-up System
- **PowerUp.ts**: Abstract base class for all power-up effects
- **MultiBallPowerUp.ts**: Multi-ball spawning implementation
- **LaserPaddlePowerUp.ts**: Laser shooting mechanics
- **Laser.ts**: Projectile physics and brick damage

### Relic System  
- **RelicManager.ts**: Singleton tracking persistent upgrades
- **RelicUI.ts**: Display component for active relics
- **Explosive Bricks**: Implemented AoE damage system

### Physics Configuration
- **Gravity**: (0, -320) for realistic power-up falling
- **Collision Matrix**: Configured for Ball ↔ Paddle, Ball ↔ Bricks, Ball ↔ Walls
- **Materials**: Perfect bounce (restitution=1.0, friction=0.0) for consistent gameplay

## 📱 Platform Optimization
- **WeChat Mini Game**: Fully configured for WeChat ecosystem
- **Resolution**: 960x640 with responsive scaling
- **Performance**: Optimized physics timestep and collision detection
- **Input**: Touch and mouse support for broad device compatibility

---

**Ready to test the addictive combination of classic breakout action with modern roguelike progression!** 🎯

*Generated with [Claude Code](https://claude.ai/code)*