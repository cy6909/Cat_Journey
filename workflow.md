# Cat-Conquest Roguelike Breakout - Complete Development Workflow

## Overview
Complete workflow for developing Cat-Conquest Roguelike Breakout using Cocos Creator 3.8.6, ComfyUI for art generation, and WeChat Mini Game deployment.

## Art Asset Pipeline

### 1. Asset Requirements Analysis

#### Paddle Assets
- **Base Sprite**: 120x20 px paddle sprite
- **Upgrade States**: 5 visual progression states showing wear and enhancement
- **Visual Effects**: Glow, shield, laser attachment overlays
- **Required Files**:
  - `paddle_base.png` (120x20)
  - `paddle_enhanced_1.png` through `paddle_enhanced_5.png`
  - `paddle_shield_overlay.png` (transparency enabled)
  - `paddle_laser_attachment.png`
  - `paddle_damage_crack_1.png` through `paddle_damage_3.png`

#### Ball Assets
- **Base Balls**: 25 different ball types (24x24 px each)
- **Particle Trails**: Fire, ice, electric, poison effect trails
- **Special Effects**: Explosion, split, phase visual indicators
- **Required Files**:
  - 25 individual ball sprites: `ball_{type}.png` (e.g., `ball_fire.png`, `ball_heavy.png`)
  - Particle textures: `trail_{effect}.png`
  - Impact effects: `impact_{type}.png`
  - Status overlays: `effect_overlay_{type}.png`

#### Brick Assets
- **Basic Bricks**: 25 brick types with distinct visual identity (60x30 px)
- **Damage States**: Each brick needs 3 damage states (100%, 66%, 33% health)
- **Special Effects**: Glowing, pulsing, cracking animations
- **Required Files**:
  - 75 brick state sprites: `brick_{type}_state_{1-3}.png`
  - Effect overlays: `brick_overlay_{effect}.png`
  - Destruction particles: `brick_destroy_{type}.png`

#### UI Assets
- **HUD Elements**: Health bars, score displays, pause menu
- **Shop Interface**: Category tabs, item frames, purchase buttons
- **Map Screen**: Node icons, connection lines, chapter backgrounds
- **Required Files**:
  - UI frames: `ui_frame_{style}.9.png` (9-slice sprites)
  - Icons: 50+ individual icons for items, abilities, statuses
  - Backgrounds: Chapter-themed backgrounds for each area
  - Buttons: Various button states (normal, pressed, disabled)

#### Background Assets
- **Chapter Backgrounds**: 3 distinct environments (Forest, Mountain, Abyss)
- **Level Variations**: Multiple background variants per chapter
- **Animated Elements**: Parallax layers, ambient animations
- **Required Files**:
  - Main backgrounds: `bg_chapter_{1-3}.png` (960x640)
  - Parallax layers: `bg_chapter_{1-3}_layer_{1-3}.png`
  - Animated objects: `bg_anim_{object}.png` (sprite sheets)

### 2. ComfyUI Art Generation Workflow

#### ComfyUI Setup
1. **Installation**:
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   pip install -r requirements.txt
   python main.py
   ```

2. **Model Requirements**:
   - Base Model: SDXL 1.0 or Stable Diffusion 1.5
   - ControlNet: For consistent sprite generation
   - LoRA: Pixel art and game asset specialized models
   - Upscaler: Real-ESRGAN for clean sprite scaling

#### Paddle Generation Workflow
1. **Base Paddle Creation**:
   ```
   Prompt: "pixel art game paddle, horizontal bar, blue metal material, top-down view, clean edges, video game asset, white background"
   Settings: 512x512, CFG 7, Steps 20
   ControlNet: Enable for consistent proportions
   ```

2. **Enhancement States**:
   - Use img2img workflow with base paddle
   - Progressive enhancement prompts:
     - Level 1: "slightly glowing blue paddle"
     - Level 5: "legendary golden paddle with energy aura"

3. **Post-Processing**:
   - Remove backgrounds using ComfyUI's masking nodes
   - Scale to exact dimensions (120x20)
   - Apply pixel-perfect edge cleanup

#### Brick Generation Workflow
1. **Batch Generation Setup**:
   ```
   Workflow: XY Plot with prompt variations
   Base Prompt: "pixel art brick block, {color} {material}, game asset, white background, top view"
   Variables: 
   - Colors: red, blue, green, purple, orange, etc.
   - Materials: stone, metal, crystal, ice, fire, electric
   ```

2. **Damage State Generation**:
   - Use ControlNet to maintain shape consistency
   - Progressive damage prompts:
     - State 1: "pristine brick"
     - State 2: "cracked brick, minor damage"
     - State 3: "heavily damaged brick, about to break"

#### Ball Generation Workflow
1. **Sphere Base Generation**:
   ```
   Prompt: "pixel art sphere ball, {effect} element, glowing, game asset, white background, perfect circle"
   Effects: fire, ice, lightning, poison, metal, crystal, etc.
   Settings: 256x256, then crop to 24x24
   ```

2. **Effect Variations**:
   - Fire: "flaming orange sphere with fire particles"
   - Ice: "blue crystal sphere with frost effects"
   - Electric: "yellow sphere with lightning bolts"
   - Heavy: "dark metal sphere, dense appearance"

#### UI Asset Generation
1. **Frame Generation**:
   ```
   Prompt: "game UI frame border, fantasy medieval style, ornate decorative edges, transparent center, gold trim"
   Output: 9-slice compatible frames
   ```

2. **Icon Generation**:
   ```
   Batch Process: 50+ icons
   Prompt Template: "pixel art icon, {item} symbol, simple design, clear silhouette, game UI asset"
   Items: sword, shield, potion, gem, coin, etc.
   ```

### 3. FreeTexturePacker Integration

#### Installation and Setup
1. **Download**: FreeTexturePacker from official website
2. **Configuration**:
   - Format: Cocos2d-x (.plist + .png)
   - Algorithm: MaxRects
   - Padding: 2px between sprites
   - Pot: Enable (Power of Two sizing)

#### Sprite Sheet Creation Process
1. **Organize Assets**:
   ```
   sprites/
   ├── balls/          # 25 ball sprites
   ├── bricks/         # 75 brick state sprites  
   ├── paddles/        # 10 paddle variation sprites
   ├── ui/            # UI elements and icons
   └── effects/       # Particle and effect textures
   ```

2. **Atlas Generation**:
   - **gameplay_atlas.png/plist**: Balls, bricks, paddles (max 2048x2048)
   - **ui_atlas.png/plist**: All UI elements (max 1024x1024)
   - **effects_atlas.png/plist**: Particles and effect textures (max 1024x1024)
   - **backgrounds.png/plist**: Background elements and parallax layers

3. **FreeTexturePacker Settings**:
   ```
   Data Format: cocos2d-x
   Texture format: PNG-32
   Image format: RGBA8888
   Size constraints: POT (Power of Two)
   Multipack: Enable for large collections
   Trim: Enable to remove transparent edges
   ```

4. **Output Integration**:
   - Copy generated .png and .plist files to `assets/art/atlases/`
   - Import in Cocos Creator: Drag .plist files into Assets panel
   - Cocos automatically parses and creates SpriteFrame assets

### 4. Cocos Creator Asset Integration

#### Asset Import Process
1. **Project Structure Setup**:
   ```
   assets/
   ├── art/
   │   ├── atlases/        # Generated sprite atlases
   │   ├── backgrounds/    # Individual background images
   │   ├── particles/      # Particle system textures
   │   └── audio/         # Sound effects and music
   ├── prefabs/
   ├── scenes/
   └── scripts/
   ```

2. **Atlas Configuration in Cocos Creator**:
   - Import .plist files: Drag into Assets/art/atlases
   - Set texture properties: Pixel Art filtering for crisp pixels
   - Configure compression: Default for WeChat Mini Game
   - Verify SpriteFrames: Check that individual sprites are accessible

#### Prefab Creation with Assets

##### Ball Prefab Setup
1. **Create Ball Prefab**:
   - Create 2D Node → Sprite
   - Add EnhancedBall.ts script
   - Add RigidBody2D (DYNAMIC)
   - Add CircleCollider2D

2. **Asset Binding Process**:
   ```typescript
   // In EnhancedBall.ts
   export class EnhancedBall extends Component {
       @property({type: SpriteAtlas})
       public ballAtlas: SpriteAtlas | null = null;
       
       private changeBallSprite(ballType: BallType): void {
           if (this.ballAtlas) {
               const sprite = this.getComponent(Sprite);
               sprite.spriteFrame = this.ballAtlas.getSpriteFrame(`ball_${ballType}`);
           }
       }
   }
   ```

3. **Inspector Configuration**:
   - Ball Atlas: Assign gameplay_atlas asset
   - Default Sprite Frame: Select ball_normal from atlas
   - Physics Material: Create bouncy material (restitution=1.0)

##### Brick Prefab Setup
1. **Create Brick Prefab**:
   - Create 2D Node → Sprite
   - Add EnhancedBrick.ts script
   - Add BoxCollider2D (STATIC)

2. **Multi-State Sprite System**:
   ```typescript
   // In EnhancedBrick.ts
   export class EnhancedBrick extends Component {
       @property({type: [SpriteFrame]})
       public damageStates: SpriteFrame[] = [];
       
       private updateVisualState(): void {
           const healthPercent = this.health / this.maxHealth;
           let stateIndex = 0;
           
           if (healthPercent > 0.66) stateIndex = 0;      // Pristine
           else if (healthPercent > 0.33) stateIndex = 1; // Damaged
           else stateIndex = 2;                            // Critical
           
           const sprite = this.getComponent(Sprite);
           sprite.spriteFrame = this.damageStates[stateIndex];
       }
   }
   ```

3. **Inspector Configuration**:
   - Damage States Array: Assign 3 sprite frames for each brick type
   - Default State: Set to pristine (index 0)
   - Destruction Effect: Assign particle system prefab

##### Paddle Prefab Setup
1. **Create Paddle Prefab**:
   - Create 2D Node → Sprite
   - Add EnhancedPaddleController.ts script
   - Add RigidBody2D (KINEMATIC)
   - Add BoxCollider2D

2. **Level-Based Visual System**:
   ```typescript
   // In EnhancedPaddleController.ts
   export class EnhancedPaddleController extends Component {
       @property({type: [SpriteFrame]})
       public levelSprites: SpriteFrame[] = [];
       
       @property({type: [SpriteFrame]})
       public damageOverlays: SpriteFrame[] = [];
       
       private updateVisualState(): void {
           // Update base paddle sprite based on level
           const sprite = this.getComponent(Sprite);
           sprite.spriteFrame = this.levelSprites[Math.min(this.level - 1, this.levelSprites.length - 1)];
           
           // Add damage overlay if damaged
           if (this.durability < this.maxDurability * 0.5) {
               this.showDamageOverlay();
           }
       }
   }
   ```

### 5. Particle Effects Integration

#### Effect Creation Workflow

##### ComfyUI Particle Texture Generation
1. **Fire Particle**:
   ```
   Prompt: "fire particle texture, orange flame wisp, transparent background, glowing ember"
   Settings: 64x64, high contrast, transparent PNG output
   ```

2. **Ice Crystal Particle**:
   ```
   Prompt: "ice crystal shard, blue translucent, sparkle effect, transparent background"
   Settings: 32x32, crystal-like appearance
   ```

3. **Lightning Effect**:
   ```
   Prompt: "electric spark texture, bright yellow lightning bolt, energy discharge, transparent background"
   Settings: 16x64, vertical orientation
   ```

##### Cocos Creator Particle System Setup
1. **Create Particle Systems**:
   - Fire Trail: Following fire balls
   - Ice Aura: Surrounding ice balls
   - Lightning Chain: Between electric bricks
   - Destruction Effects: When bricks are destroyed

2. **Particle Configuration Example**:
   ```typescript
   // Fire trail particle setup
   const fireTrail = this.node.getComponent(ParticleSystem2D);
   fireTrail.file = fireParticleTexture; // Assign ComfyUI generated texture
   fireTrail.emissionRate = 30;
   fireTrail.life = 0.5;
   fireTrail.startSize = 8;
   fireTrail.endSize = 2;
   fireTrail.startColor = cc.color(255, 100, 0, 255);
   fireTrail.endColor = cc.color(255, 255, 0, 0);
   ```

### 6. Audio Asset Pipeline

#### Sound Requirements
- **Impact Sounds**: 25 variations for different ball-brick collisions
- **Power-up Sounds**: Collection and activation audio
- **UI Sounds**: Button clicks, menu transitions
- **Background Music**: Chapter-themed ambient tracks
- **Boss Music**: Intense combat tracks for boss encounters

#### Audio Generation with AI Tools
1. **Use ElevenLabs or similar AI audio tools**:
   - Generate impact sounds with different materials (metal, stone, crystal)
   - Create power-up collection sounds (magical chimes, energy bursts)
   - Produce ambient background music loops

2. **Audio Processing**:
   - Format: OGG Vorbis for web compatibility
   - Quality: 44.1kHz, medium compression for file size optimization
   - Loop points: Set for background music tracks

## Cocos Creator Development Workflow

### 1. Scene Setup Process

#### GameScene Configuration
1. **Canvas Setup**:
   - Resolution: 960x640
   - Fit Height: Enabled
   - Design Resolution: Match game resolution

2. **Layer Organization**:
   ```
   Canvas
   ├── GameLayer (z-index: 0)
   │   ├── Background
   │   ├── BrickContainer
   │   ├── BallContainer
   │   ├── PaddleContainer
   │   └── EffectsContainer
   ├── UILayer (z-index: 100)
   │   ├── HUD
   │   ├── PauseMenu
   │   └── GameOverScreen
   └── DebugLayer (z-index: 200)
   ```

#### Script Binding Process
1. **GameManager Integration**:
   ```
   GameScene Root Node:
   - Add Script: GameManager.ts
   - Configure References:
     - Ball Prefab: Drag Ball.prefab from assets
     - Brick Prefab: Drag EnhancedBrick.prefab
     - Paddle Prefab: Drag EnhancedPaddle.prefab
     - Container Nodes: Link to scene containers
   ```

2. **Component Dependencies**:
   - Ensure all scripts have proper @ccclass decorators
   - Configure @property references in Inspector
   - Set up Node references and component connections

### 2. Physics Configuration

#### Physics2D World Setup
1. **Project Settings**:
   ```
   Physics2D:
   - Gravity: (0, -320)
   - Velocity Iterations: 8
   - Position Iterations: 3
   - Enable Debug Draw: true (development only)
   ```

2. **Collision Matrix Configuration**:
   ```
   Collision Groups:
   - Group 0 (Default): Walls
   - Group 1 (Balls): All ball types
   - Group 2 (Bricks): All brick types  
   - Group 3 (Paddle): Player paddle
   - Group 4 (PowerUps): Collectible items
   
   Collision Rules:
   - Balls collide with: Walls, Bricks, Paddle
   - Bricks collide with: Balls only
   - Paddle collides with: Balls, PowerUps
   - PowerUps collide with: Paddle only
   ```

#### Material Creation
1. **Physics Materials**:
   ```
   Ball Material:
   - Restitution: 1.0 (perfect bounce)
   - Friction: 0.0 (no energy loss)
   
   Paddle Material:
   - Restitution: 1.1 (slight energy gain)
   - Friction: 0.1 (slight trajectory change)
   
   Brick Material:
   - Restitution: 0.8 (energy absorption)
   - Friction: 0.0
   ```

### 3. Animation and Visual Effects

#### Animation Creation Process
1. **Paddle Upgrade Animation**:
   ```typescript
   // Create upgrade animation sequence
   public playUpgradeAnimation(): void {
       const upgradeSequence = tween(this.node)
           .to(0.1, { scale: cc.v3(1.2, 1.2, 1) })
           .to(0.1, { scale: cc.v3(1.0, 1.0, 1) })
           .call(() => {
               this.updatePaddleSprite();
               this.showLevelUpEffect();
           });
       upgradeSequence.start();
   }
   ```

2. **Brick Destruction Sequence**:
   ```typescript
   public playDestructionAnimation(): void {
       // Flash effect
       const flash = tween(this.node)
           .to(0.05, { color: cc.Color.WHITE })
           .to(0.05, { color: this.originalColor })
           .repeat(3);
       
       // Scale down and fade
       const destroy = tween(this.node)
           .to(0.2, { scale: cc.v3(0, 0, 0), opacity: 0 })
           .call(() => {
               this.spawnDestructionParticles();
               this.node.destroy();
           });
       
       sequence(flash, destroy).start();
   }
   ```

#### Visual Effect Implementation
1. **Screen Shake for Impact**:
   ```typescript
   public triggerScreenShake(intensity: number): void {
       const camera = this.node.getComponent(Camera);
       const originalPos = camera.node.position;
       
       const shakeSequence = tween(camera.node)
           .by(0.05, { position: cc.v3(intensity * 2, 0, 0) })
           .by(0.05, { position: cc.v3(-intensity * 4, intensity, 0) })
           .by(0.05, { position: cc.v3(intensity * 2, -intensity, 0) })
           .to(0.05, { position: originalPos });
       
       shakeSequence.start();
   }
   ```

2. **Ball Trail Effect**:
   ```typescript
   public createBallTrail(): void {
       if (this.ballType === BallType.FIRE) {
           const trail = this.node.getChildByName("FireTrail");
           const particle = trail.getComponent(ParticleSystem2D);
           particle.resetSystem();
       }
   }
   ```

### 4. UI System Integration

#### HUD Implementation
1. **Health Bar Component**:
   ```typescript
   @ccclass('HealthBarUI')
   export class HealthBarUI extends Component {
       @property({type: Sprite})
       public healthFill: Sprite | null = null;
       
       public updateHealth(current: number, max: number): void {
           const healthPercent = current / max;
           this.healthFill.fillRange = healthPercent;
           
           // Color coding
           if (healthPercent > 0.6) this.healthFill.color = cc.Color.GREEN;
           else if (healthPercent > 0.3) this.healthFill.color = cc.Color.YELLOW;
           else this.healthFill.color = cc.Color.RED;
       }
   }
   ```

2. **Shop UI Integration**:
   ```typescript
   // Link ShopManager to UI elements
   @property({type: Node})
   public shopContainer: Node | null = null;
   
   @property({type: Prefab})
   public shopItemPrefab: Prefab | null = null;
   
   protected onLoad(): void {
       // Initialize shop UI with ShopManager data
       this.populateShopItems();
       this.bindPurchaseEvents();
   }
   ```

## WeChat Mini Game Deployment

### 1. Build Configuration

#### Cocos Creator Build Settings
1. **Platform Selection**:
   ```
   Build Panel:
   - Platform: WeChat Mini Game
   - Bundle Identifier: com.yourcompany.catconquest
   - App Version: 1.0.0
   - Start Scene: GameScene
   ```

2. **Optimization Settings**:
   ```
   WeChat Mini Game Options:
   - Compress Textures: True
   - Asset Bundle Config: Auto
   - Subpackage: Enable for assets > 4MB
   - Orientation: Landscape
   - Remote Server Address: (if using remote assets)
   ```

#### Asset Optimization
1. **Texture Compression**:
   - PNG assets: Compress to ETC2 for Android, PVRTC for iOS
   - Maximum texture size: 1024x1024 for most assets
   - Use power-of-two dimensions when possible

2. **Audio Compression**:
   - Background music: OGG format, 128kbps
   - Sound effects: OGG format, 64kbps
   - Total audio size limit: 10MB

### 2. WeChat Developer Account Setup

#### Account Registration
1. **WeChat Official Account Platform**:
   - Register at: https://mp.weixin.qq.com/
   - Select "Mini Program" account type
   - Complete enterprise verification (if applicable)

2. **Developer Console Configuration**:
   ```
   App Configuration:
   - App ID: Generated by WeChat
   - App Name: Cat-Conquest
   - Category: Games
   - Target Users: All ages
   ```

#### Payment Integration Setup
1. **WeChat Pay Merchant Registration**:
   - Apply for merchant account at: https://pay.weixin.qq.com/
   - Complete business verification
   - Obtain merchant ID and API keys

2. **Payment Configuration in Code**:
   ```typescript
   // Already implemented in MonetizationManager.ts
   private processRealMoneyPurchase(item: PurchaseItem): Promise<boolean> {
       return new Promise((resolve) => {
           wx.requestPayment({
               timeStamp: Date.now().toString(),
               nonceStr: this.generateNonceStr(),
               package: `prepay_id=${this.generatePrepayId(item)}`,
               signType: 'MD5',
               paySign: this.generatePaySign(item),
               success: (res: any) => {
                   this.applyPurchaseReward(item);
                   resolve(true);
               },
               fail: (err: any) => {
                   console.error('Payment failed:', err);
                   resolve(false);
               }
           });
       });
   }
   ```

#### Advertisement Setup
1. **Ad Unit Registration**:
   - Apply for ad placement in WeChat Console
   - Wait for approval (typically 1-3 business days)
   - Obtain ad unit IDs for different placement types

2. **Ad Integration Verification**:
   ```typescript
   // Already implemented in AdManager.ts
   private initializeWeChatAds(): void {
       this._rewardedVideoAd = wx.createRewardedVideoAd({
           adUnitId: this._adUnitIds.rewardVideo
       });
       
       this._interstitialAd = wx.createInterstitialAd({
           adUnitId: this._adUnitIds.interstitial
       });
   }
   ```

### 3. Testing and Deployment Process

#### Development Testing
1. **WeChat DevTools Setup**:
   - Download: WeChat Developer Tools from official website
   - Install and login with developer account
   - Import built project directory

2. **Testing Checklist**:
   ```
   Core Functionality:
   ✓ Game loads without errors
   ✓ All sprites render correctly
   ✓ Physics simulation works properly
   ✓ Audio plays on supported devices
   ✓ Touch input responds correctly
   
   WeChat Integration:
   ✓ Payment flow works in sandbox mode
   ✓ Advertisement loading and display
   ✓ User authorization flows
   ✓ Share functionality (if implemented)
   
   Performance:
   ✓ Consistent 60fps on target devices
   ✓ Memory usage under 200MB
   ✓ Package size under 20MB total
   ```

#### Device Testing
1. **Physical Device Testing**:
   - Test on multiple Android devices (different versions)
   - Test on multiple iOS devices (iPhone/iPad)
   - Verify performance on low-end devices
   - Check audio playback across different devices

2. **WeChat Environment Testing**:
   - Test within WeChat app on devices
   - Verify social sharing features work
   - Test payment flows with real money (small amounts)
   - Check ad display and reward delivery

### 4. Submission and Review Process

#### Pre-Submission Checklist
1. **Content Review Preparation**:
   ```
   Required Materials:
   - Game description (Chinese and English)
   - Screenshots (5-10 high-quality images)
   - Privacy policy document
   - Terms of service
   - Age rating justification
   - Content rating (violence, in-app purchases, etc.)
   ```

2. **Technical Compliance**:
   - All APIs used are approved by WeChat
   - No access to sensitive device features without permission
   - Proper error handling for network failures
   - Graceful handling of WeChat feature unavailability

#### Submission Process
1. **Upload Built Package**:
   - Use WeChat Developer Tools to upload
   - Include version notes and update description
   - Set release percentage (start with 5% rollout)

2. **Review Wait Time**:
   - Initial review: 1-7 business days
   - Updates: 1-3 business days
   - Content changes: May require longer review

#### Post-Launch Monitoring
1. **Performance Metrics**:
   - Monitor crash reports in WeChat Console
   - Track user retention and session length
   - Monitor payment success rates
   - Track advertisement click-through rates

2. **User Feedback Management**:
   - Respond to user reviews within 24 hours
   - Address common issues with app updates
   - Collect feedback for future feature development

## Advanced Workflow Tips

### 1. Version Control Integration

#### Git Workflow for Game Development
1. **Repository Structure**:
   ```
   .gitignore contents:
   /build/
   /temp/
   /library/
   *.tmp
   .DS_Store
   
   Include:
   /assets/
   /project/
   /settings/
   package.json
   ```

2. **Branch Strategy**:
   ```
   main: Production-ready releases
   develop: Integration branch for features
   feature/*: Individual feature development
   hotfix/*: Critical bug fixes
   art/*: Art asset integration branches
   ```

#### Asset Version Control
1. **Large File Management**:
   - Use Git LFS for texture atlases > 10MB
   - Separate repository for source art files
   - Automated build process for asset pipeline

2. **Collaboration Workflow**:
   ```
   Artist Workflow:
   1. Create assets in ComfyUI/external tools
   2. Process through FreeTexturePacker
   3. Commit processed assets to art/* branch
   4. Create pull request for art integration
   
   Programmer Workflow:
   1. Feature development on feature/* branch
   2. Integration testing with latest art assets
   3. Code review and testing before merge
   ```

### 2. Performance Optimization

#### Runtime Optimization
1. **Object Pooling Implementation**:
   ```typescript
   // Ball pooling system
   export class BallPool {
       private static _instance: BallPool = null;
       private _availableBalls: Node[] = [];
       
       public static getInstance(): BallPool {
           if (!BallPool._instance) {
               BallPool._instance = new BallPool();
           }
           return BallPool._instance;
       }
       
       public getBall(ballType: BallType): Node {
           if (this._availableBalls.length > 0) {
               const ball = this._availableBalls.pop();
               this.configureBall(ball, ballType);
               return ball;
           } else {
               return this.createNewBall(ballType);
           }
       }
   }
   ```

2. **Texture Memory Management**:
   - Use texture compression for all sprites
   - Implement dynamic texture loading for different game areas
   - Release unused textures when transitioning between scenes

#### Build Optimization
1. **Asset Bundle Strategy**:
   ```
   Bundle Configuration:
   - core: Essential gameplay assets (< 2MB)
   - chapter1: Chapter 1 specific assets
   - chapter2: Chapter 2 specific assets  
   - chapter3: Chapter 3 specific assets
   - audio: All audio assets (separate loading)
   ```

2. **Code Splitting**:
   - Lazy load boss controllers only when needed
   - Separate monetization systems for non-paying users
   - Dynamic import of advanced features

### 3. Quality Assurance Workflow

#### Automated Testing Setup
1. **Unit Test Framework**:
   ```typescript
   // Test configuration for core game logic
   describe('GameManager', () => {
       test('should initialize with correct default values', () => {
           const gameManager = new GameManager();
           expect(gameManager.gameState).toBe(GameState.PRE_START);
           expect(gameManager.lives).toBe(3);
       });
       
       test('should handle ball-brick collision correctly', () => {
           // Test collision detection and brick destruction
       });
   });
   ```

2. **Integration Testing**:
   - Test complete level playthrough scenarios
   - Verify save/load functionality
   - Test monetization flows end-to-end
   - Performance benchmarking on target devices

#### Manual Testing Protocols
1. **Core Gameplay Testing**:
   ```
   Test Cases:
   1. Paddle Movement:
      - Touch/mouse input responsiveness
      - Boundary constraints working
      - Multi-touch handling
   
   2. Ball Physics:
      - Consistent bounce angles
      - Speed maintenance across collisions
      - Multiple ball scenarios
   
   3. Brick Interactions:
      - All 25 brick types behave correctly
      - Chain reactions work as designed
      - Performance with maximum brick count
   ```

2. **Monetization Testing**:
   ```
   Payment Testing:
   1. WeChat Pay integration:
      - Successful purchases
      - Failed payment handling
      - Receipt validation
   
   2. Advertisement Testing:
      - All ad placements load correctly
      - Reward delivery works properly
      - Ad frequency limits respected
      - Graceful handling of ad failures
   ```

## Troubleshooting Guide

### Common Development Issues

#### Asset Loading Problems
1. **Sprites Not Displaying**:
   ```
   Problem: White/transparent sprites in game
   Solution: 
   - Check sprite frames are assigned in prefabs
   - Verify texture atlases imported correctly
   - Confirm sprite names match code references
   ```

2. **Performance Issues**:
   ```
   Problem: Frame rate drops during gameplay
   Solution:
   - Enable texture compression
   - Implement object pooling for frequent objects
   - Reduce particle system complexity
   - Use texture atlases instead of individual sprites
   ```

#### WeChat Integration Issues
1. **Payment Failures**:
   ```
   Problem: wx.requestPayment() fails
   Solution:
   - Verify merchant account is active
   - Check payment signature generation
   - Ensure proper error handling for network issues
   - Test in WeChat DevTools first
   ```

2. **Ad Loading Failures**:
   ```
   Problem: Rewarded ads won't load
   Solution:
   - Confirm ad unit IDs are correct
   - Check if ads are approved in WeChat Console
   - Implement fallback UI when ads unavailable
   - Test ad frequency limits aren't exceeded
   ```

### Performance Optimization Guide

#### Memory Management
1. **Texture Memory**:
   - Monitor total VRAM usage (target < 100MB)
   - Use texture compression (ETC2/PVRTC)
   - Implement dynamic texture loading
   - Release textures when changing scenes

2. **Script Memory**:
   - Avoid memory leaks in scheduled callbacks
   - Properly dispose of event listeners
   - Use object pooling for frequently created objects
   - Monitor garbage collection frequency

#### Rendering Optimization
1. **Draw Call Reduction**:
   - Use texture atlases to batch sprites
   - Minimize different materials used
   - Combine static sprites where possible
   - Use sprite batching for UI elements

2. **Particle System Optimization**:
   - Limit maximum particle count per system
   - Use simple particle shapes
   - Implement particle culling for off-screen effects
   - Pool particle systems for reuse

This comprehensive workflow provides everything needed to develop Cat-Conquest from initial art creation through final WeChat Mini Game deployment, ensuring a smooth development process with proper asset management, performance optimization, and platform integration.