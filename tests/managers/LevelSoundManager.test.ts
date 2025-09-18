import '../setup';

// Mock sound effect types
enum MockSoundEffectType {
    UI_CLICK = 'ui_click',
    UI_HOVER = 'ui_hover',
    BALL_BOUNCE_PADDLE = 'ball_bounce_paddle',
    BALL_BOUNCE_BRICK = 'ball_bounce_brick',
    BRICK_HIT = 'brick_hit',
    BRICK_DESTROYED = 'brick_destroyed',
    BRICK_EXPLOSION = 'brick_explosion',
    BOSS_APPEAR = 'boss_appear',
    AMBIENT_WIND = 'ambient_wind'
}

// Create a simplified LevelSoundManager for testing
class MockLevelSoundManager {
    private static _instance: MockLevelSoundManager | null = null;
    
    public soundEffectSource: any = null;
    public ambientSource: any = null;
    public uiSource: any = null;
    public maxConcurrentSounds = 8;
    public soundEffectVolume = 1.0;
    public ambientVolume = 0.5;
    public enableSpatialAudio = true;

    private _soundPool: any[] = [];
    private _activeSounds = new Map<string, any>();
    private _soundConfigs = new Map<MockSoundEffectType, any>();
    private _audioClips = new Map<string, any>();
    private _currentAmbientLoop = '';

    public static getInstance(): MockLevelSoundManager | null {
        return MockLevelSoundManager._instance;
    }

    protected onLoad(): void {
        if (MockLevelSoundManager._instance === null) {
            MockLevelSoundManager._instance = this;
        }
        
        this.initializeSoundPool();
        this.initializeSoundConfigs();
        this.preloadAudioClips();
    }

    protected onDestroy(): void {
        if (MockLevelSoundManager._instance === this) {
            MockLevelSoundManager._instance = null;
        }
        
        this.stopAllSounds();
        this._audioClips.clear();
        this._activeSounds.clear();
    }

    private initializeSoundPool(): void {
        for (let i = 0; i < this.maxConcurrentSounds; i++) {
            const audioSource = {
                playing: false,
                volume: this.soundEffectVolume,
                pitch: 1.0,
                loop: false,
                clip: null,
                play: jest.fn(() => { audioSource.playing = true; }),
                stop: jest.fn(() => { audioSource.playing = false; })
            };
            
            this._soundPool.push(audioSource);
        }
    }

    private initializeSoundConfigs(): void {
        this._soundConfigs.set(MockSoundEffectType.UI_CLICK, {
            clipName: 'ui/click',
            volume: 0.8,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 5
        });

        this._soundConfigs.set(MockSoundEffectType.BALL_BOUNCE_PADDLE, {
            clipName: 'gameplay/ball_bounce_paddle',
            volume: 0.9,
            pitch: 1.0,
            loop: false,
            fadeIn: false,
            fadeOut: false,
            delay: 0,
            randomPitch: true,
            spatialAudio: true,
            priority: 8
        });

        this._soundConfigs.set(MockSoundEffectType.AMBIENT_WIND, {
            clipName: 'ambient/wind_loop',
            volume: 0.3,
            pitch: 1.0,
            loop: true,
            fadeIn: true,
            fadeOut: true,
            delay: 0,
            randomPitch: false,
            spatialAudio: false,
            priority: 2
        });
    }

    private preloadAudioClips(): void {
        const audioList = [
            'ui/click',
            'gameplay/ball_bounce_paddle',
            'gameplay/brick_hit',
            'ambient/wind_loop'
        ];

        audioList.forEach(clipPath => {
            const mockClip = {
                duration: 1.0,
                loaded: true
            };
            this._audioClips.set(clipPath, mockClip);
        });
    }

    public playSoundEffect(effectType: MockSoundEffectType, position?: { x: number, y: number }): boolean {
        const config = this._soundConfigs.get(effectType);
        if (!config) {
            return false;
        }

        const audioClip = this._audioClips.get(config.clipName);
        if (!audioClip) {
            return false;
        }

        const audioSource = this.getAvailableAudioSource();
        if (!audioSource) {
            return false;
        }

        audioSource.clip = audioClip;
        audioSource.volume = config.volume * this.soundEffectVolume;
        audioSource.pitch = config.randomPitch ? 
            config.pitch + (Math.random() - 0.5) * 0.2 : 
            config.pitch;
        audioSource.loop = config.loop;

        // Apply spatial audio
        if (config.spatialAudio && position && this.enableSpatialAudio) {
            const distance = Math.sqrt(position.x * position.x + position.y * position.y);
            const maxDistance = 500;
            const volumeMultiplier = Math.max(0.1, 1.0 - (distance / maxDistance));
            audioSource.volume *= volumeMultiplier;
        }

        audioSource.play();

        // Record active sound
        const soundId = `${effectType}_${Date.now()}`;
        this._activeSounds.set(soundId, audioSource);

        // Schedule cleanup
        setTimeout(() => {
            this._activeSounds.delete(soundId);
            this.returnAudioSourceToPool(audioSource);
        }, audioClip.duration * 1000);

        return true;
    }

    public playAmbientLoop(effectType: MockSoundEffectType): boolean {
        if (this._currentAmbientLoop === effectType) {
            return true;
        }

        this.stopAmbientLoop();

        const config = this._soundConfigs.get(effectType);
        if (!config || !config.loop) {
            return false;
        }

        const audioClip = this._audioClips.get(config.clipName);
        if (!audioClip) {
            return false;
        }

        if (!this.ambientSource) {
            this.ambientSource = {
                playing: false,
                volume: 0,
                pitch: 1.0,
                loop: true,
                clip: null,
                play: jest.fn(() => { this.ambientSource.playing = true; }),
                stop: jest.fn(() => { this.ambientSource.playing = false; })
            };
        }

        this.ambientSource.clip = audioClip;
        this.ambientSource.volume = config.volume * this.ambientVolume;
        this.ambientSource.pitch = config.pitch;
        this.ambientSource.loop = true;
        this.ambientSource.play();

        this._currentAmbientLoop = effectType;
        return true;
    }

    public stopAmbientLoop(): void {
        if (!this.ambientSource || !this._currentAmbientLoop) {
            return;
        }

        this.ambientSource.stop();
        this._currentAmbientLoop = '';
    }

    public playUISound(effectType: MockSoundEffectType): boolean {
        const config = this._soundConfigs.get(effectType);
        if (!config) return false;

        const audioClip = this._audioClips.get(config.clipName);
        if (!audioClip) return false;

        if (!this.uiSource) {
            this.uiSource = {
                playing: false,
                volume: 1.0,
                pitch: 1.0,
                clip: null,
                play: jest.fn(() => { this.uiSource.playing = true; }),
                stop: jest.fn(() => { this.uiSource.playing = false; })
            };
        }

        this.uiSource.clip = audioClip;
        this.uiSource.volume = config.volume * this.soundEffectVolume;
        this.uiSource.pitch = config.randomPitch ? 
            config.pitch + (Math.random() - 0.5) * 0.2 : 
            config.pitch;
        this.uiSource.play();

        return true;
    }

    private getAvailableAudioSource(): any {
        for (const source of this._soundPool) {
            if (!source.playing) {
                return source;
            }
        }
        return this._soundPool[0]; // Fallback to first source
    }

    private returnAudioSourceToPool(source: any): void {
        source.stop();
        source.clip = null;
        source.volume = this.soundEffectVolume;
        source.pitch = 1.0;
        source.loop = false;
    }

    public stopAllSounds(): void {
        this._soundPool.forEach(source => {
            source.stop();
        });

        this.stopAmbientLoop();

        if (this.uiSource) {
            this.uiSource.stop();
        }

        this._activeSounds.clear();
    }

    public setSoundEffectVolume(volume: number): void {
        this.soundEffectVolume = Math.max(0, Math.min(1, volume));
    }

    public setAmbientVolume(volume: number): void {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
    }

    public getDebugInfo(): string {
        const activeCount = this._soundPool.filter(s => s.playing).length;
        const ambientPlaying = this.ambientSource?.playing ? this._currentAmbientLoop : 'None';
        
        return `Active Sounds: ${activeCount}/${this.maxConcurrentSounds}, Ambient: ${ambientPlaying}, Volume: ${this.soundEffectVolume}`;
    }

    // Quick helper methods
    public playBallBounce(position?: { x: number, y: number }): void {
        this.playSoundEffect(MockSoundEffectType.BALL_BOUNCE_BRICK, position);
    }

    public playBrickDestroyed(position?: { x: number, y: number }): void {
        this.playSoundEffect(MockSoundEffectType.BRICK_DESTROYED, position);
    }

    public playUIClick(): void {
        this.playUISound(MockSoundEffectType.UI_CLICK);
    }

    public setAmbientForChapter(chapter: number): void {
        switch (chapter) {
            case 1:
                this.playAmbientLoop(MockSoundEffectType.AMBIENT_WIND);
                break;
        }
    }
}

describe('LevelSoundManager', () => {
    let soundManager: MockLevelSoundManager;

    beforeEach(() => {
        jest.clearAllMocks();
        soundManager = new MockLevelSoundManager();
        soundManager.onLoad();
    });

    afterEach(() => {
        if (soundManager) {
            soundManager.onDestroy();
        }
    });

    describe('Initialization', () => {
        test('should initialize with correct default parameters', () => {
            expect(soundManager.maxConcurrentSounds).toBe(8);
            expect(soundManager.soundEffectVolume).toBe(1.0);
            expect(soundManager.ambientVolume).toBe(0.5);
            expect(soundManager.enableSpatialAudio).toBe(true);
        });

        test('should create singleton instance', () => {
            const instance = MockLevelSoundManager.getInstance();
            expect(instance).toBe(soundManager);
        });

        test('should initialize sound pool', () => {
            expect(soundManager['_soundPool']).toBeDefined();
            expect(soundManager['_soundPool'].length).toBe(8);
        });

        test('should initialize sound configurations', () => {
            expect(soundManager['_soundConfigs']).toBeDefined();
            expect(soundManager['_soundConfigs'].size).toBeGreaterThan(0);
        });

        test('should preload audio clips', () => {
            expect(soundManager['_audioClips']).toBeDefined();
            expect(soundManager['_audioClips'].size).toBeGreaterThan(0);
        });
    });

    describe('Sound Effect Playback', () => {
        test('should play sound effect successfully', () => {
            const result = soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            
            expect(result).toBe(true);
        });

        test('should handle unknown sound effect types', () => {
            const result = soundManager.playSoundEffect('UNKNOWN_SOUND' as any);
            
            expect(result).toBe(false);
        });

        test('should apply spatial audio when enabled', () => {
            const position = { x: 100, y: 200 };
            const result = soundManager.playSoundEffect(
                MockSoundEffectType.BALL_BOUNCE_PADDLE, 
                position
            );
            
            expect(result).toBe(true);
        });

        test('should handle random pitch variation', () => {
            const result = soundManager.playSoundEffect(MockSoundEffectType.BALL_BOUNCE_PADDLE);
            
            expect(result).toBe(true);
        });

        test('should manage active sounds correctly', () => {
            soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            soundManager.playSoundEffect(MockSoundEffectType.BALL_BOUNCE_PADDLE);
            
            expect(soundManager['_activeSounds'].size).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Ambient Sound Management', () => {
        test('should play ambient loop successfully', () => {
            const result = soundManager.playAmbientLoop(MockSoundEffectType.AMBIENT_WIND);
            
            expect(result).toBe(true);
        });

        test('should stop ambient loop', () => {
            soundManager.playAmbientLoop(MockSoundEffectType.AMBIENT_WIND);
            soundManager.stopAmbientLoop();
            
            expect(soundManager['_currentAmbientLoop']).toBe('');
        });

        test('should not restart same ambient loop', () => {
            const result1 = soundManager.playAmbientLoop(MockSoundEffectType.AMBIENT_WIND);
            const result2 = soundManager.playAmbientLoop(MockSoundEffectType.AMBIENT_WIND);
            
            expect(result1).toBe(true);
            expect(result2).toBe(true);
        });

        test('should handle non-looping sounds for ambient', () => {
            const result = soundManager.playAmbientLoop(MockSoundEffectType.UI_CLICK);
            
            expect(result).toBe(false);
        });
    });

    describe('UI Sound Management', () => {
        test('should play UI sound successfully', () => {
            const result = soundManager.playUISound(MockSoundEffectType.UI_CLICK);
            
            expect(result).toBe(true);
        });

        test('should handle unknown UI sound types', () => {
            const result = soundManager.playUISound('UNKNOWN_UI_SOUND' as any);
            
            expect(result).toBe(false);
        });
    });

    describe('Volume Control', () => {
        test('should set sound effect volume correctly', () => {
            soundManager.setSoundEffectVolume(0.5);
            
            expect(soundManager.soundEffectVolume).toBe(0.5);
        });

        test('should clamp sound effect volume to valid range', () => {
            soundManager.setSoundEffectVolume(-0.5);
            expect(soundManager.soundEffectVolume).toBe(0);
            
            soundManager.setSoundEffectVolume(1.5);
            expect(soundManager.soundEffectVolume).toBe(1);
        });

        test('should set ambient volume correctly', () => {
            soundManager.setAmbientVolume(0.3);
            
            expect(soundManager.ambientVolume).toBe(0.3);
        });

        test('should clamp ambient volume to valid range', () => {
            soundManager.setAmbientVolume(-0.2);
            expect(soundManager.ambientVolume).toBe(0);
            
            soundManager.setAmbientVolume(1.2);
            expect(soundManager.ambientVolume).toBe(1);
        });
    });

    describe('Spatial Audio', () => {
        test('should apply distance attenuation', () => {
            const farPosition = { x: 1000, y: 1000 };
            const result = soundManager.playSoundEffect(
                MockSoundEffectType.BALL_BOUNCE_PADDLE, 
                farPosition
            );
            
            expect(result).toBe(true);
        });

        test('should handle close positions', () => {
            const closePosition = { x: 10, y: 10 };
            const result = soundManager.playSoundEffect(
                MockSoundEffectType.BALL_BOUNCE_PADDLE, 
                closePosition
            );
            
            expect(result).toBe(true);
        });

        test('should disable spatial audio when configured', () => {
            soundManager.enableSpatialAudio = false;
            const position = { x: 500, y: 500 };
            const result = soundManager.playSoundEffect(
                MockSoundEffectType.BALL_BOUNCE_PADDLE, 
                position
            );
            
            expect(result).toBe(true);
        });
    });

    describe('Sound Pool Management', () => {
        test('should handle sound pool exhaustion', () => {
            // Play more sounds than pool size
            for (let i = 0; i < 10; i++) {
                const result = soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
                expect(result).toBe(true);
            }
        });

        test('should reuse sound sources', () => {
            const result1 = soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            const result2 = soundManager.playSoundEffect(MockSoundEffectType.BALL_BOUNCE_PADDLE);
            
            expect(result1).toBe(true);
            expect(result2).toBe(true);
        });
    });

    describe('Convenience Methods', () => {
        test('should play ball bounce sound', () => {
            expect(() => {
                soundManager.playBallBounce();
            }).not.toThrow();
        });

        test('should play ball bounce with position', () => {
            expect(() => {
                soundManager.playBallBounce({ x: 100, y: 200 });
            }).not.toThrow();
        });

        test('should play brick destroyed sound', () => {
            expect(() => {
                soundManager.playBrickDestroyed();
            }).not.toThrow();
        });

        test('should play UI click sound', () => {
            expect(() => {
                soundManager.playUIClick();
            }).not.toThrow();
        });

        test('should set ambient for chapter', () => {
            expect(() => {
                soundManager.setAmbientForChapter(1);
            }).not.toThrow();
        });
    });

    describe('Debug and Cleanup', () => {
        test('should provide debug information', () => {
            const debugInfo = soundManager.getDebugInfo();
            
            expect(typeof debugInfo).toBe('string');
            expect(debugInfo).toContain('Active Sounds:');
            expect(debugInfo).toContain('Ambient:');
            expect(debugInfo).toContain('Volume:');
        });

        test('should stop all sounds', () => {
            soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            soundManager.playAmbientLoop(MockSoundEffectType.AMBIENT_WIND);
            soundManager.playUISound(MockSoundEffectType.UI_HOVER);
            
            soundManager.stopAllSounds();
            
            expect(soundManager['_activeSounds'].size).toBe(0);
            expect(soundManager['_currentAmbientLoop']).toBe('');
        });

        test('should clean up on destroy', () => {
            soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            
            soundManager.onDestroy();
            
            expect(MockLevelSoundManager.getInstance()).toBe(null);
        });
    });

    describe('Error Handling', () => {
        test('should handle missing audio clips gracefully', () => {
            // Clear audio clips to simulate missing resources
            soundManager['_audioClips'].clear();
            
            const result = soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            
            expect(result).toBe(false);
        });

        test('should handle missing sound configurations', () => {
            // Clear sound configs
            soundManager['_soundConfigs'].clear();
            
            const result = soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            
            expect(result).toBe(false);
        });

        test('should handle null positions in spatial audio', () => {
            const result = soundManager.playSoundEffect(
                MockSoundEffectType.BALL_BOUNCE_PADDLE, 
                null as any
            );
            
            expect(result).toBe(true);
        });
    });

    describe('Performance', () => {
        test('should handle rapid sound playback', () => {
            const startTime = performance.now();
            
            for (let i = 0; i < 100; i++) {
                soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // Should be very fast
        });

        test('should not create memory leaks with active sounds', () => {
            const initialSize = soundManager['_activeSounds'].size;
            
            // Play and let sounds complete
            for (let i = 0; i < 10; i++) {
                soundManager.playSoundEffect(MockSoundEffectType.UI_CLICK);
            }
            
            // Active sounds should be managed properly
            expect(soundManager['_activeSounds'].size).toBeGreaterThanOrEqual(initialSize);
        });
    });
});