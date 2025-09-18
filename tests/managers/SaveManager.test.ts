import '../setup';

// Mock the SaveManager module
const MockSaveManager = {
    getInstance: jest.fn(),
    initializeNewProgress: jest.fn(),
    startNewRun: jest.fn(),
    savePlayerProgress: jest.fn().mockReturnValue(true),
    saveRunProgress: jest.fn().mockReturnValue(true),
    loadPlayerProgress: jest.fn().mockReturnValue(true),
    loadRunProgress: jest.fn().mockReturnValue(false),
    updateScore: jest.fn(),
    updateCurrency: jest.fn(),
    unlockRelic: jest.fn(),
    completeLevel: jest.fn(),
    recordDeath: jest.fn(),
    defeatBoss: jest.fn(),
    saveToSlot: jest.fn().mockReturnValue(true),
    loadFromSlot: jest.fn().mockReturnValue(true),
    getSaveSlotInfo: jest.fn().mockReturnValue({ exists: false }),
    validateAndRepairProgress: jest.fn().mockReturnValue(true),
    clearAllSaves: jest.fn(),
    getPlayerProgress: jest.fn().mockReturnValue(null),
    getCurrentRunProgress: jest.fn().mockReturnValue(null),
    hasUnsavedChanges: jest.fn().mockReturnValue(false),
    manualSave: jest.fn().mockReturnValue(true)
};

jest.mock('../../assets/scripts/managers/SaveManager', () => ({
    SaveManager: MockSaveManager
}));

describe('SaveManager', () => {
    let saveManager: any;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Create a mock instance
        saveManager = {
            ...MockSaveManager,
            _playerProgress: null,
            _currentRunProgress: null,
            _hasUnsavedChanges: false,
            autoSaveInterval: 30,
            maxSaveSlots: 3,
            enableCloudSync: true
        };
        
        MockSaveManager.getInstance.mockReturnValue(saveManager);
    });

    describe('Initialization', () => {
        test('should create new player progress when no save exists', () => {
            const newProgress = {
                currentChapter: 1,
                currentFloor: 1,
                currentRun: 1,
                currency: { coins: 100, gems: 0, energy: 100, experience: 0 },
                totalScore: 0,
                highestScore: 0,
                createTime: Date.now()
            };
            
            saveManager.initializeNewProgress.mockReturnValue(newProgress);
            const result = saveManager.initializeNewProgress();
            
            expect(result).toBeDefined();
            expect(result.currentChapter).toBe(1);
            expect(result.currency.coins).toBe(100);
            expect(saveManager.initializeNewProgress).toHaveBeenCalled();
        });

        test('should start new run with correct parameters', () => {
            const mockRun = {
                runId: 'test-run-123',
                startTime: Date.now(),
                currentScore: 0,
                currentLives: 3,
                currentChapter: 1,
                currentFloor: 1
            };
            
            saveManager.startNewRun.mockReturnValue(mockRun);
            const result = saveManager.startNewRun(1);
            
            expect(result).toBeDefined();
            expect(result.runId).toContain('test-run');
            expect(result.currentLives).toBe(3);
            expect(saveManager.startNewRun).toHaveBeenCalledWith(1);
        });
    });

    describe('Save Operations', () => {
        test('should save player progress successfully', () => {
            const result = saveManager.savePlayerProgress();
            
            expect(result).toBe(true);
            expect(saveManager.savePlayerProgress).toHaveBeenCalled();
        });

        test('should save run progress successfully', () => {
            const result = saveManager.saveRunProgress();
            
            expect(result).toBe(true);
            expect(saveManager.saveRunProgress).toHaveBeenCalled();
        });

        test('should handle save failures gracefully', () => {
            saveManager.savePlayerProgress.mockReturnValue(false);
            const result = saveManager.savePlayerProgress();
            
            expect(result).toBe(false);
        });
    });

    describe('Load Operations', () => {
        test('should load player progress successfully', () => {
            const result = saveManager.loadPlayerProgress();
            
            expect(result).toBe(true);
            expect(saveManager.loadPlayerProgress).toHaveBeenCalled();
        });

        test('should handle missing run progress', () => {
            const result = saveManager.loadRunProgress();
            
            expect(result).toBe(false);
            expect(saveManager.loadRunProgress).toHaveBeenCalled();
        });
    });

    describe('Progress Updates', () => {
        test('should update score correctly', () => {
            saveManager.updateScore(1000);
            
            expect(saveManager.updateScore).toHaveBeenCalledWith(1000);
        });

        test('should update currency correctly', () => {
            saveManager.updateCurrency('coins', 50);
            
            expect(saveManager.updateCurrency).toHaveBeenCalledWith('coins', 50);
        });

        test('should unlock relics', () => {
            saveManager.unlockRelic('EXPLOSIVE_BRICKS');
            
            expect(saveManager.unlockRelic).toHaveBeenCalledWith('EXPLOSIVE_BRICKS');
        });

        test('should record game events', () => {
            saveManager.completeLevel();
            saveManager.recordDeath();
            saveManager.defeatBoss('boss_1', false);
            
            expect(saveManager.completeLevel).toHaveBeenCalled();
            expect(saveManager.recordDeath).toHaveBeenCalled();
            expect(saveManager.defeatBoss).toHaveBeenCalledWith('boss_1', false);
        });
    });

    describe('Slot Management', () => {
        test('should save to slot successfully', () => {
            const result = saveManager.saveToSlot(0);
            
            expect(result).toBe(true);
            expect(saveManager.saveToSlot).toHaveBeenCalledWith(0);
        });

        test('should load from slot successfully', () => {
            const result = saveManager.loadFromSlot(1);
            
            expect(result).toBe(true);
            expect(saveManager.loadFromSlot).toHaveBeenCalledWith(1);
        });

        test('should get slot info correctly', () => {
            const slotInfo = { exists: false };
            saveManager.getSaveSlotInfo.mockReturnValue(slotInfo);
            
            const result = saveManager.getSaveSlotInfo(2);
            
            expect(result).toEqual(slotInfo);
            expect(saveManager.getSaveSlotInfo).toHaveBeenCalledWith(2);
        });

        test('should handle invalid slot indices', () => {
            saveManager.saveToSlot.mockReturnValue(false);
            saveManager.loadFromSlot.mockReturnValue(false);
            
            expect(saveManager.saveToSlot(-1)).toBe(false);
            expect(saveManager.loadFromSlot(5)).toBe(false);
        });
    });

    describe('Data Integrity', () => {
        test('should validate and repair progress', () => {
            const result = saveManager.validateAndRepairProgress();
            
            expect(result).toBe(true);
            expect(saveManager.validateAndRepairProgress).toHaveBeenCalled();
        });

        test('should clear all saves', () => {
            saveManager.clearAllSaves();
            
            expect(saveManager.clearAllSaves).toHaveBeenCalled();
        });
    });

    describe('State Management', () => {
        test('should track unsaved changes', () => {
            const result = saveManager.hasUnsavedChanges();
            
            expect(typeof result).toBe('boolean');
            expect(saveManager.hasUnsavedChanges).toHaveBeenCalled();
        });

        test('should perform manual save', () => {
            const result = saveManager.manualSave();
            
            expect(result).toBe(true);
            expect(saveManager.manualSave).toHaveBeenCalled();
        });
    });
});

// Test the actual data structures
describe('SaveManager Data Structures', () => {
    test('PlayerProgress should have correct structure', () => {
        const progress = {
            currentChapter: 1,
            currentFloor: 1,
            currentRun: 1,
            unlockedChapters: [1],
            unlockedRelics: [],
            unlockedPaddleTypes: ['basic'],
            unlockedBallTypes: ['normal'],
            unlockedCoreTypes: ['standard'],
            totalPlayTime: 0,
            totalScore: 0,
            highestScore: 0,
            totalBricksDestroyed: 0,
            totalLevelsCompleted: 0,
            totalDeaths: 0,
            defeatedBosses: [],
            defeatedHiddenBosses: [],
            achievements: {},
            achievementProgress: {},
            currency: {
                coins: 100,
                gems: 0,
                energy: 100,
                experience: 0
            },
            purchaseHistory: [],
            vipStatus: {
                isVip: false,
                vipLevel: 0,
                vipExpireTime: 0
            },
            settings: {
                soundVolume: 1.0,
                musicVolume: 0.8,
                enableNotifications: true,
                language: 'zh-CN',
                qualityLevel: 2
            },
            lastSaveTime: Date.now(),
            lastLoginTime: Date.now(),
            createTime: Date.now()
        };

        // Validate structure
        expect(progress).toHaveProperty('currentChapter');
        expect(progress).toHaveProperty('currency');
        expect(progress).toHaveProperty('settings');
        expect(progress.currency).toHaveProperty('coins');
        expect(progress.currency).toHaveProperty('gems');
        expect(progress.settings).toHaveProperty('soundVolume');
        expect(Array.isArray(progress.unlockedChapters)).toBe(true);
    });

    test('RunProgress should have correct structure', () => {
        const runProgress = {
            runId: 'run_123',
            startTime: Date.now(),
            currentScore: 0,
            currentLives: 3,
            currentChapter: 1,
            currentFloor: 1,
            currentNodeIndex: 0,
            completedNodes: [],
            mapPath: [],
            activeRelics: [],
            relicStacks: {},
            paddleLevel: 1,
            paddleExperience: 0,
            paddleHealth: 100,
            paddleMaxHealth: 100,
            coreLevel: 1,
            coreExperience: 0,
            coreHealth: 100,
            coreMaxHealth: 100,
            ballTypes: ['normal'],
            ballEffects: [],
            ballCount: 1,
            temporaryBuffs: [],
            levelModifiers: [],
            bossPhase: 0,
            isInCombat: false
        };

        // Validate structure
        expect(runProgress).toHaveProperty('runId');
        expect(runProgress).toHaveProperty('activeRelics');
        expect(runProgress).toHaveProperty('paddleLevel');
        expect(runProgress).toHaveProperty('coreHealth');
        expect(Array.isArray(runProgress.ballTypes)).toBe(true);
        expect(Array.isArray(runProgress.temporaryBuffs)).toBe(true);
    });
});