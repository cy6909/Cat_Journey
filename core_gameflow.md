# Core Game Development Workflow - Cat-Conquest Roguelike Breakout

## Overview
This document provides a step-by-step guide for implementing the Cat-Conquest Roguelike Breakout game using Cocos Creator 3.8.6. Each component, script, and feature is detailed with specific implementation instructions.

## Prerequisites
- Cocos Creator 3.8.6 installed
- TypeScript knowledge
- WeChat Mini Game development account
- Basic understanding of 2D physics

## Project Setup Phase

### 1. Project Creation
```bash
1. Open Cocos Creator 3.8.6
2. Create New Project → 2D Template
3. Project Name: "Cat_Journey"
4. Location: Choose appropriate directory
5. Select TypeScript template
6. Create Project
```

### 2. Project Configuration
1. Open `project.json` and verify:
```json
{
  "type": "2d",
  "version": "3.8.6",
  "template": "typescript"
}
```

2. Configure platform settings:
```
Build → Platform: WeChat Mini Game
Bundle Identifier: com.yourcompany.catjourney
```

### 3. Folder Structure Setup
Create the following folder structure in assets/:
```
assets/
├── art/              # Visual assets
│   ├── sprites/      # Sprite images  
│   ├── textures/     # Background textures
│   ├── particles/    # Particle effects
│   └── ui/          # UI elements
├── prefabs/         # Reusable game objects
│   ├── gameplay/    # Core gameplay prefabs
│   ├── ui/          # UI prefabs
│   └── effects/     # Effect prefabs
├── resources/       # Runtime loadable resources
├── scenes/         # Game scenes
└── scripts/        # TypeScript code
    ├── core/       # Core systems
    ├── gameplay/   # Gameplay mechanics
    ├── ui/         # UI controllers
    └── managers/   # Game managers
```

## Core Gameplay Implementation

### Phase 1: Basic Game Objects

#### 1.1 Paddle Implementation

**Step 1: Create Paddle Prefab**
1. Right-click in Hierarchy → Create → 2D Object → Sprite
2. Name: "Paddle"
3. Set Transform:
   - Position: (0, -250, 0)
   - Scale: (1, 1, 1)
4. Add Component → Physics2D → RigidBody2D
   - Type: KINEMATIC
   - Gravity Scale: 0
5. Add Component → Physics2D → BoxCollider2D
   - Size: Set to match sprite bounds
   - Tag: 3000 (for collision detection)

**Step 2: Add Paddle Controller Script**
1. Create new TypeScript file: `assets/scripts/gameplay/PaddleController.ts`
2. Copy the PaddleController.ts implementation
3. Add script to Paddle prefab:
   - Select Paddle in Hierarchy
   - Add Component → Custom Script → PaddleController
4. Configure properties:
   - Move Speed: 300
   - Screen Bounds: Set based on game resolution

**Step 3: Input Handling**
1. In PaddleController script, implement touch/mouse input:
```typescript
protected onLoad(): void {
    this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
}
```

**Step 4: Test Paddle Movement**
1. Drag Paddle prefab to scene
2. Play scene in simulator
3. Verify paddle moves with mouse/touch within screen bounds

#### 1.2 Ball Implementation

**Step 1: Create Ball Prefab**
1. Create → 2D Object → Sprite
2. Name: "Ball"
3. Set sprite to circular image
4. Add Component → Physics2D → RigidBody2D
   - Type: DYNAMIC
   - Gravity Scale: 0 (we'll use custom gravity)
5. Add Component → Physics2D → CircleCollider2D
   - Radius: Match sprite size
   - Tag: 1000

**Step 2: Physics Material Setup**
1. Create Physics Material:
   - Right-click in Assets → Create → Physics Material 2D
   - Name: "BallMaterial"
   - Restitution: 1.0 (perfect bounce)
   - Friction: 0.0 (no friction)
2. Apply material to Ball's CircleCollider2D

**Step 3: Ball Script Implementation**
1. Create `assets/scripts/gameplay/Ball.ts`
2. Add script to Ball prefab
3. Configure initial launch parameters:
   - Launch Speed: 400
   - Launch Angle Range: 45-135 degrees

**Step 4: Ball Physics Testing**
1. Add Ball to scene
2. Ensure ball bounces perfectly off walls and paddle
3. Verify constant speed maintenance

#### 1.3 Brick Implementation

**Step 1: Create Base Brick Prefab**
1. Create → 2D Object → Sprite
2. Name: "Brick"
3. Position: (0, 200, 0)
4. Add Component → Physics2D → RigidBody2D
   - Type: STATIC
5. Add Component → Physics2D → BoxCollider2D
   - Tag: 2000

**Step 2: Brick Script**
1. Create `assets/scripts/gameplay/Brick.ts`
2. Implement health system:
   - Base health: 1-5 depending on brick type
   - Damage handling
   - Destruction logic
3. Add to Brick prefab

**Step 3: Brick Variations**
1. Create additional brick prefabs for different types:
   - NormalBrick (1 hit)
   - ReinforcedBrick (2 hits)
   - SpecialBrick (special effects)
2. Use different sprite colors/textures for each type

### Phase 2: Enhanced Game Systems

#### 2.1 Enhanced Brick System Integration

**Step 1: Replace Basic Bricks**
1. Update existing brick prefabs to use `EnhancedBrick.ts`
2. Configure BrickType enum values for each prefab:
```typescript
// In prefab inspector
Brick Type: NORMAL, REINFORCED, EXPLOSIVE, etc.
```

**Step 2: Special Effect Setup**
1. For explosive bricks:
   - Add particle system for explosion effect
   - Configure explosion radius in inspector
2. For electric bricks:
   - Create lightning particle effect prefab
   - Set chain reaction parameters

**Step 3: Brick Material Assignment**
1. Create different physics materials:
   - RubberMaterial (high bounciness)
   - MetalMaterial (damage reflection)
   - IceMaterial (slow effects)

#### 2.2 Enhanced Ball System

**Step 1: Ball Type Configuration**
1. Create multiple ball prefabs:
   - NormalBall
   - HeavyBall (larger, slower)
   - LightBall (smaller, faster)
   - FireBall (with particle trail)
   - IceBall (with freeze effect)

**Step 2: Ball Effect Implementation**
1. Add particle systems to ball prefabs:
   - Fire trail for fire balls
   - Ice crystals for ice balls
   - Electric sparks for electric balls
2. Configure effect durations and intensities

#### 2.3 Enhanced Paddle System

**Step 1: Paddle Durability Visual**
1. Add health bar UI to paddle:
   - Create UI prefab with progress bar
   - Position above paddle
   - Update color based on health (green→yellow→red)

**Step 2: Paddle Upgrade Visual**
1. Create upgrade effects:
   - Level up particle burst
   - Size increase animation
   - Color change for different levels
2. Add XP collection animation

## Physics System Configuration

### Collision Matrix Setup
1. Open Project Settings → Physics2D
2. Configure collision matrix:
```
Group 1000 (Ball) collides with:
- Group 2000 (Bricks) ✓
- Group 3000 (Paddle) ✓  
- Group 4000 (Walls) ✓
- Group 5000 (Bosses) ✓

Group 2000 (Bricks) collides with:
- Group 1000 (Ball) ✓
- Group 6000 (Lasers) ✓

Group 3000 (Paddle) collides with:
- Group 1000 (Ball) ✓
- Group 7000 (Experience) ✓
```

### Gravity Configuration
1. Set World Gravity: (0, -320)
2. Individual objects can override with gravityScale

### Physics Debugging
1. Enable physics debug drawing:
```typescript
// In GameManager
protected onLoad(): void {
    if (CC_DEBUG) {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
    }
}
```

## Game Manager Integration

### Scene Structure Setup
1. Create main game scene: "GameScene"
2. Hierarchy structure:
```
Canvas (UI Layer)
├── GameUI
│   ├── HealthBar
│   ├── ScoreDisplay
│   ├── PauseButton
│   └── PowerUpIcons
└── GameLayer (Game Objects)
    ├── GameManager (Empty Node)
    ├── Walls
    │   ├── LeftWall
    │   ├── RightWall
    │   ├── TopWall
    │   └── DeathZone (Bottom)
    ├── BrickContainer (Empty Node)
    ├── PaddleContainer (Empty Node)
    └── BallContainer (Empty Node)
```

### GameManager Script Configuration
1. Add GameManager.ts to GameManager node
2. Configure prefab references in inspector:
   - Ball Prefab: Link to Ball prefab
   - Brick Prefab: Link to EnhancedBrick prefab
   - Paddle Prefab: Link to EnhancedPaddle prefab
   - Power-up Prefabs: Link all power-up prefabs

### Level Generation Setup
1. Add ProceduralLevelGenerator.ts to GameManager
2. Configure level parameters:
   - Rows: 5-8
   - Columns: 8-12
   - Brick Spacing: 80x40
   - Special Brick Ratio: 0.2-0.4

## Boss System Implementation

### Boss Prefab Creation
1. Create boss prefabs for each BossType:
   - GuardianWallBoss
   - StormCallerBoss
   - BrickSpawnerBoss
   - etc.

2. Each boss prefab structure:
```
BossNode
├── Sprite (Boss appearance)
├── RigidBody2D (KINEMATIC)
├── BoxCollider2D (Tag: 5000)
├── EnhancedBossController (Script)
├── HealthBar (UI)
└── Effects (Particle systems)
```

### Boss Behavior Configuration
1. In EnhancedBossController inspector:
   - Boss Type: Select from dropdown
   - Max Health: 100-300 depending on chapter
   - Attack Power: 10-25
   - Move Speed: 100-200
   - Chapter: 1-3

### Boss Attack Patterns
1. Create attack prefabs:
   - BossProjectile
   - LightningStrike
   - GravityField
2. Configure attack timing and patterns per boss type

## Power-up System

### Power-up Prefab Creation
1. Create prefabs for each power-up:
   - MultiBallPowerUp
   - LaserPaddlePowerUp
   - ShieldPowerUp
   - etc.

2. Power-up structure:
```
PowerUpNode
├── Sprite (Power-up icon)
├── RigidBody2D (DYNAMIC)
├── BoxCollider2D (isTrigger: true)
├── PowerUp Script
└── CollectionEffect (Particles)
```

### Power-up Drop System
1. Configure drop rates in EnhancedBrick:
   - Normal bricks: 10% drop chance
   - Special bricks: 25% drop chance
   - Elite level bricks: 40% drop chance

## UI System Implementation

### Game UI Setup
1. Create UI prefabs:
   - HealthBar: Shows paddle/core health
   - ScoreDisplay: Current score and high score
   - PowerUpHUD: Active power-up indicators
   - PauseMenu: Pause game controls
   - GameOverScreen: End game options

### HUD Configuration
1. Health Bar implementation:
```typescript
// Update health bar fill
healthBar.fillRange = currentHealth / maxHealth;
healthBar.color = currentHealth > 50 ? Color.GREEN : Color.RED;
```

2. Score Display:
```typescript
// Update score text
scoreLabel.string = `Score: ${currentScore}`;
highScoreLabel.string = `Best: ${highScore}`;
```

## Map System Implementation

### Map Scene Creation
1. Create "MapScene" for level selection
2. Add MapManager.ts to scene
3. Configure map parameters:
   - Nodes Per Floor: 4
   - Floors Per Chapter: 15
   - Node Spacing: 150
   - Chapter Themes: Forest, Mountain, Abyss

### Node Prefab Setup
1. Create MapNode prefab:
```
MapNode
├── Background (Sprite)
├── Icon (Sprite - node type indicator)
├── Label (Node name)
├── Button (Click handling)
└── ConnectionLines (Line renderers)
```

### Map Generation
1. Generate 3 chapters with 15 floors each
2. Connect nodes with branching paths
3. Implement node selection and progression

## Testing and Validation

### Physics Testing
1. Ball bounce consistency
2. Collision detection accuracy
3. Performance with multiple objects

### Gameplay Testing
1. Level progression difficulty
2. Power-up effectiveness
3. Boss battle balance

### UI Testing
1. Touch input responsiveness
2. UI scaling across devices
3. Menu navigation flow

## Performance Optimization

### Object Pooling
1. Implement pools for frequently created objects:
   - Balls (up to 10 active)
   - Projectiles (up to 20 active)
   - Particle effects (up to 15 active)

### Memory Management
1. Proper resource cleanup
2. Texture compression settings
3. Audio compression and loading

### Rendering Optimization
1. Batch similar sprites
2. Minimize draw calls
3. Use appropriate texture formats

## Build and Deployment Preparation

### WeChat Mini Game Setup
1. Configure manifest.json for WeChat
2. Set up proper asset loading
3. Implement WeChat API integrations

### Testing Framework
1. Test on WeChat DevTools
2. Device testing across different phones
3. Performance profiling

This workflow provides the foundation for implementing the core gameplay. Continue with specialized workflows for monetization, audio, and deployment systems.