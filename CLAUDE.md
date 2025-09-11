# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cat-Conquest: Roguelike Breakout Module** - a WeChat Mini Game built with Cocos Creator 3.x and TypeScript. The game combines classic Breakout/Arkanoid gameplay with roguelike elements like power-ups and passive relics.

## Development Commands

Currently configured in package.json:
- `npm run build` - Build script (will be configured with Cocos Creator)
- `npm run test` - Test runner (not yet configured)

**Note**: The primary development workflow uses Cocos Creator IDE rather than npm scripts. Build and deployment are typically handled through the Cocos Creator interface for WeChat Mini Game platform.

## Project Architecture

### Core Structure
```
assets/
├── art/          # Game art assets
├── prefabs/      # Reusable Cocos Creator prefabs
├── resources/    # Runtime loadable resources
├── scenes/       # Game scenes
└── scripts/      # TypeScript game logic
```

### Key Game Systems (Planned)

**Core Entities:**
- **Paddle** (`assets/scripts/PaddleController.ts`) - Player-controlled horizontal movement, STATIC/KINEMATIC physics
- **Ball** (`assets/scripts/Ball.ts`) - DYNAMIC physics with perfect bounce (restitution=1.0, friction=0.0)
- **Bricks** (`assets/scripts/Brick.ts`) - STATIC physics, health-based destruction system

**Game Management:**
- **GameManager** (`assets/scripts/GameManager.ts`) - Singleton pattern managing game states (PRE_START, PLAYING, LEVEL_COMPLETE, GAME_OVER)
- **RelicManager** (`assets/scripts/RelicManager.ts`) - Tracks passive upgrades for roguelike runs

**Roguelike Elements:**
- **Power-up System** - Base `PowerUp.ts` with derived classes for temporary effects
- **Relic System** - Passive buffs that persist across levels (e.g., "Explosive Bricks")

### Physics Configuration

The project uses Cocos Creator's built-in 2D physics with specific settings:
- Gravity: (0, -320)
- Collision matrix defines Ball ↔ Paddle, Ball ↔ Bricks, Ball ↔ Walls interactions
- Bottom "death zone" trigger for ball loss detection

### Platform Target

- **Primary Platform**: WeChat Mini Game
- **Resolution**: 960x640 with fit width/height enabled
- **Dependencies**: `minigame-api-typings` for WeChat API type safety

### Current Status

Project is in initial setup phase. No game scripts have been implemented yet. Follow the priority-based implementation plan in `@IMPLEMENTATION_PLAN.md` starting with PRIORITY 0 (Project Setup).

## Important Files

- `@IMPLEMENTATION_PLAN.md` - Detailed implementation roadmap with priorities
- `specs/core_mechanics.md` - Technical specifications for game components
- `VALIDATION_PLAN.md` - Testing and validation procedures
- `project/project.json` - Cocos Creator project configuration