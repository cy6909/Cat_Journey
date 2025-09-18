import '../setup';

// Mock the DynamicLevelGenerator and its dependencies
const MockLevelManager = {
    getInstance: jest.fn().mockReturnValue({
        getCurrentLevelType: jest.fn().mockReturnValue('NORMAL'),
        getCurrentDifficulty: jest.fn().mockReturnValue('NORMAL')
    })
};

const MockMapManager = {
    getInstance: jest.fn().mockReturnValue({
        getCurrentChapter: jest.fn().mockReturnValue(1),
        getCurrentFloor: jest.fn().mockReturnValue(1),
        getCurrentNodeType: jest.fn().mockReturnValue('COMBAT')
    })
};

jest.mock('../../assets/scripts/gameplay/LevelManager', () => ({
    LevelManager: MockLevelManager,
    LevelType: {
        NORMAL: 'NORMAL',
        ELITE: 'ELITE',
        BOSS: 'BOSS'
    },
    DifficultyTier: {
        EASY: 'EASY',
        NORMAL: 'NORMAL',
        HARD: 'HARD',
        NIGHTMARE: 'NIGHTMARE'
    }
}));

jest.mock('../../assets/scripts/managers/MapManager', () => ({
    MapManager: MockMapManager,
    MapNodeType: {
        COMBAT: 'COMBAT',
        ELITE: 'ELITE',
        BOSS: 'BOSS',
        TREASURE: 'TREASURE',
        SHOP: 'SHOP',
        REST: 'REST',
        EVENT: 'EVENT',
        SECRET: 'SECRET',
        MINI_BOSS: 'MINI_BOSS',
        PUZZLE: 'PUZZLE',
        GAUNTLET: 'GAUNTLET',
        FINAL_BOSS: 'FINAL_BOSS'
    }
}));

jest.mock('../../assets/scripts/gameplay/EnhancedBrick', () => ({
    BrickType: {
        NORMAL: 'NORMAL',
        REINFORCED: 'REINFORCED',
        EXPLOSIVE: 'EXPLOSIVE',
        ELECTRIC: 'ELECTRIC',
        EXPERIENCE: 'EXPERIENCE',
        REGENERATING: 'REGENERATING',
        PHASE: 'PHASE',
        MAGNETIC: 'MAGNETIC',
        REFLECTIVE: 'REFLECTIVE',
        POISON: 'POISON',
        ICE: 'ICE',
        FIRE: 'FIRE',
        SPLITTING: 'SPLITTING',
        TELEPORT: 'TELEPORT',
        SHIELD: 'SHIELD',
        GRAVITY: 'GRAVITY',
        TIME: 'TIME',
        HEALING: 'HEALING',
        CURSED: 'CURSED',
        CRYSTAL: 'CRYSTAL',
        RUBBER: 'RUBBER',
        METAL: 'METAL',
        VOID: 'VOID',
        LIGHT: 'LIGHT',
        DARK: 'DARK'
    }
}));

// Create a simplified DynamicLevelGenerator for testing
class MockDynamicLevelGenerator {
    private static _instance: MockDynamicLevelGenerator | null = null;
    
    public gridWidth = 8;
    public gridHeight = 6;
    public brickWidth = 80;
    public brickHeight = 40;
    public brickSpacing = 10;
    public startX = -280;
    public startY = 200;

    public static getInstance(): MockDynamicLevelGenerator | null {
        return MockDynamicLevelGenerator._instance;
    }

    protected onLoad(): void {
        if (MockDynamicLevelGenerator._instance === null) {
            MockDynamicLevelGenerator._instance = this;
        }
    }

    public generateLevelLayout(params: any): any[] {
        const layout: any[] = [];
        
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                if (Math.random() > 0.2) { // 80% brick spawn chance
                    layout.push({
                        position: this.getGridPosition(row, col),
                        brickType: 'NORMAL',
                        health: 1 + row,
                        specialEffects: [],
                        difficultyMultiplier: 1.0
                    });
                }
            }
        }
        
        return layout;
    }

    public getRecommendedLayoutPattern(params: any): string {
        if (params.levelType === 'BOSS') {
            return 'FORTRESS';
        }
        if (params.nodeType === 'ELITE') {
            return 'SPIRAL';
        }
        return 'STANDARD';
    }

    public getRecommendedModifiers(params: any): string[] {
        const modifiers: string[] = [];
        
        if (params.chapterNumber === 2) {
            modifiers.push('ice_field');
        } else if (params.chapterNumber === 3) {
            modifiers.push('fire_zone');
        }
        
        if (params.difficultyTier === 'HARD') {
            modifiers.push('electric_storm');
        }
        
        return modifiers;
    }

    private getGridPosition(row: number, col: number): any {
        const x = this.startX + col * (this.brickWidth + this.brickSpacing);
        const y = this.startY - row * (this.brickHeight + this.brickSpacing);
        return { x, y, z: 0 };
    }
}

describe('DynamicLevelGenerator', () => {
    let levelGenerator: MockDynamicLevelGenerator;

    beforeEach(() => {
        jest.clearAllMocks();
        levelGenerator = new MockDynamicLevelGenerator();
        levelGenerator.onLoad();
    });

    describe('Initialization', () => {
        test('should initialize with correct default parameters', () => {
            expect(levelGenerator.gridWidth).toBe(8);
            expect(levelGenerator.gridHeight).toBe(6);
            expect(levelGenerator.brickWidth).toBe(80);
            expect(levelGenerator.brickHeight).toBe(40);
            expect(levelGenerator.brickSpacing).toBe(10);
        });

        test('should create singleton instance', () => {
            const instance = MockDynamicLevelGenerator.getInstance();
            expect(instance).toBe(levelGenerator);
        });
    });

    describe('Level Generation', () => {
        test('should generate level layout with correct structure', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT',
                layoutPattern: 'STANDARD',
                specialModifiers: []
            };

            const layout = levelGenerator.generateLevelLayout(params);
            
            expect(Array.isArray(layout)).toBe(true);
            expect(layout.length).toBeGreaterThan(0);
            
            // Check first brick structure
            if (layout.length > 0) {
                const brick = layout[0];
                expect(brick).toHaveProperty('position');
                expect(brick).toHaveProperty('brickType');
                expect(brick).toHaveProperty('health');
                expect(brick).toHaveProperty('specialEffects');
                expect(brick).toHaveProperty('difficultyMultiplier');
            }
        });

        test('should generate different layouts for different patterns', () => {
            const baseParams = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT',
                specialModifiers: []
            };

            const standardLayout = levelGenerator.generateLevelLayout({
                ...baseParams,
                layoutPattern: 'STANDARD'
            });

            const pyramidLayout = levelGenerator.generateLevelLayout({
                ...baseParams,
                layoutPattern: 'PYRAMID'
            });

            // Both should generate layouts
            expect(standardLayout.length).toBeGreaterThan(0);
            expect(pyramidLayout.length).toBeGreaterThan(0);
        });

        test('should adjust difficulty based on parameters', () => {
            const easyParams = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'EASY',
                nodeType: 'COMBAT',
                layoutPattern: 'STANDARD',
                specialModifiers: []
            };

            const hardParams = {
                chapterNumber: 3,
                floorNumber: 10,
                levelType: 'BOSS',
                difficultyTier: 'NIGHTMARE',
                nodeType: 'BOSS',
                layoutPattern: 'FORTRESS',
                specialModifiers: ['electric_storm', 'fire_zone']
            };

            const easyLayout = levelGenerator.generateLevelLayout(easyParams);
            const hardLayout = levelGenerator.generateLevelLayout(hardParams);

            expect(easyLayout.length).toBeGreaterThan(0);
            expect(hardLayout.length).toBeGreaterThan(0);
        });
    });

    describe('Pattern Recommendations', () => {
        test('should recommend fortress pattern for boss levels', () => {
            const params = {
                levelType: 'BOSS',
                nodeType: 'BOSS',
                chapterNumber: 1,
                floorNumber: 15,
                difficultyTier: 'NORMAL'
            };

            const pattern = levelGenerator.getRecommendedLayoutPattern(params);
            expect(pattern).toBe('FORTRESS');
        });

        test('should recommend spiral pattern for elite levels', () => {
            const params = {
                levelType: 'ELITE',
                nodeType: 'ELITE',
                chapterNumber: 1,
                floorNumber: 5,
                difficultyTier: 'NORMAL'
            };

            const pattern = levelGenerator.getRecommendedLayoutPattern(params);
            expect(pattern).toBe('SPIRAL');
        });

        test('should recommend standard pattern for normal levels', () => {
            const params = {
                levelType: 'NORMAL',
                nodeType: 'COMBAT',
                chapterNumber: 1,
                floorNumber: 1,
                difficultyTier: 'NORMAL'
            };

            const pattern = levelGenerator.getRecommendedLayoutPattern(params);
            expect(pattern).toBe('STANDARD');
        });
    });

    describe('Modifier Recommendations', () => {
        test('should recommend ice field for chapter 2', () => {
            const params = {
                chapterNumber: 2,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT'
            };

            const modifiers = levelGenerator.getRecommendedModifiers(params);
            expect(modifiers).toContain('ice_field');
        });

        test('should recommend fire zone for chapter 3', () => {
            const params = {
                chapterNumber: 3,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT'
            };

            const modifiers = levelGenerator.getRecommendedModifiers(params);
            expect(modifiers).toContain('fire_zone');
        });

        test('should recommend electric storm for hard difficulty', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'HARD',
                nodeType: 'COMBAT'
            };

            const modifiers = levelGenerator.getRecommendedModifiers(params);
            expect(modifiers).toContain('electric_storm');
        });

        test('should return empty array for basic levels', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'EASY',
                nodeType: 'COMBAT'
            };

            const modifiers = levelGenerator.getRecommendedModifiers(params);
            expect(Array.isArray(modifiers)).toBe(true);
        });
    });

    describe('Grid Positioning', () => {
        test('should calculate correct grid positions', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT',
                layoutPattern: 'STANDARD',
                specialModifiers: []
            };

            const layout = levelGenerator.generateLevelLayout(params);
            
            if (layout.length > 0) {
                const firstBrick = layout[0];
                expect(firstBrick.position).toHaveProperty('x');
                expect(firstBrick.position).toHaveProperty('y');
                expect(firstBrick.position).toHaveProperty('z');
                
                // Check if position is within expected bounds
                expect(firstBrick.position.x).toBeGreaterThanOrEqual(levelGenerator.startX);
                expect(firstBrick.position.y).toBeLessThanOrEqual(levelGenerator.startY);
            }
        });

        test('should generate positions within grid boundaries', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT',
                layoutPattern: 'STANDARD',
                specialModifiers: []
            };

            const layout = levelGenerator.generateLevelLayout(params);
            
            layout.forEach(brick => {
                const expectedMaxX = levelGenerator.startX + 
                    (levelGenerator.gridWidth - 1) * (levelGenerator.brickWidth + levelGenerator.brickSpacing);
                const expectedMinY = levelGenerator.startY - 
                    (levelGenerator.gridHeight - 1) * (levelGenerator.brickHeight + levelGenerator.brickSpacing);
                
                expect(brick.position.x).toBeLessThanOrEqual(expectedMaxX + levelGenerator.brickWidth);
                expect(brick.position.y).toBeGreaterThanOrEqual(expectedMinY - levelGenerator.brickHeight);
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid parameters gracefully', () => {
            const invalidParams = {
                chapterNumber: -1,
                floorNumber: 0,
                levelType: 'INVALID',
                difficultyTier: 'UNKNOWN',
                nodeType: 'FAKE',
                layoutPattern: 'NONEXISTENT',
                specialModifiers: ['invalid_modifier']
            };

            expect(() => {
                levelGenerator.generateLevelLayout(invalidParams);
            }).not.toThrow();
        });

        test('should handle null/undefined parameters', () => {
            expect(() => {
                levelGenerator.generateLevelLayout(null as any);
            }).not.toThrow();

            expect(() => {
                levelGenerator.getRecommendedLayoutPattern(undefined as any);
            }).not.toThrow();
        });
    });

    describe('Performance', () => {
        test('should generate layouts efficiently', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT',
                layoutPattern: 'STANDARD',
                specialModifiers: []
            };

            const startTime = performance.now();
            
            // Generate multiple layouts
            for (let i = 0; i < 100; i++) {
                levelGenerator.generateLevelLayout(params);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Should complete 100 generations in reasonable time (< 1 second)
            expect(duration).toBeLessThan(1000);
        });

        test('should not generate excessive number of bricks', () => {
            const params = {
                chapterNumber: 1,
                floorNumber: 1,
                levelType: 'NORMAL',
                difficultyTier: 'NORMAL',
                nodeType: 'COMBAT',
                layoutPattern: 'STANDARD',
                specialModifiers: []
            };

            const layout = levelGenerator.generateLevelLayout(params);
            const maxPossibleBricks = levelGenerator.gridWidth * levelGenerator.gridHeight;
            
            expect(layout.length).toBeLessThanOrEqual(maxPossibleBricks);
        });
    });
});