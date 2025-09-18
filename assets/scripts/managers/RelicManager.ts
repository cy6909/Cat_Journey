import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

export interface Relic {
    id: string;
    name: string;
    description: string;
    icon?: string;
}

export enum RelicType {
    EXPLOSIVE_BRICKS = 'explosive_bricks',
    MULTI_BALL_START = 'multi_ball_start',
    LASER_DAMAGE_BOOST = 'laser_damage_boost',
    BRICK_PENETRATION = 'brick_penetration',
    SPEED_BOOST = 'speed_boost'
}

@ccclass('RelicManager')
export class RelicManager extends Component {
    private static _instance: RelicManager | null = null;
    private _activeRelics: Map<RelicType, Relic> = new Map();

    public static getInstance(): RelicManager | null {
        return RelicManager._instance;
    }

    protected onLoad(): void {
        if (RelicManager._instance === null) {
            RelicManager._instance = this;
            director.addPersistRootNode(this.node);
            this.initializeRelics();
        } else {
            this.node.destroy();
            return;
        }
    }

    protected onDestroy(): void {
        if (RelicManager._instance === this) {
            RelicManager._instance = null;
        }
    }

    private initializeRelics(): void {
        console.log('RelicManager initialized');
    }

    public addRelic(relicType: RelicType): void {
        const relic = this.createRelic(relicType);
        if (relic) {
            this._activeRelics.set(relicType, relic);
            console.log(`Relic acquired: ${relic.name}`);
            this.onRelicAdded(relicType);
        }
    }

    public hasRelic(relicType: RelicType): boolean {
        return this._activeRelics.has(relicType);
    }

    public getRelic(relicType: RelicType): Relic | undefined {
        return this._activeRelics.get(relicType);
    }

    public getActiveRelics(): Relic[] {
        return Array.from(this._activeRelics.values());
    }

    public removeRelic(relicType: RelicType): void {
        const relic = this._activeRelics.get(relicType);
        if (relic) {
            this._activeRelics.delete(relicType);
            console.log(`Relic removed: ${relic.name}`);
            this.onRelicRemoved(relicType);
        }
    }

    public clearAllRelics(): void {
        this._activeRelics.clear();
        console.log('All relics cleared');
    }

    private createRelic(relicType: RelicType): Relic | null {
        switch (relicType) {
            case RelicType.EXPLOSIVE_BRICKS:
                return {
                    id: 'explosive_bricks',
                    name: 'Explosive Bricks',
                    description: 'When a brick is destroyed, it deals damage to adjacent bricks'
                };
            case RelicType.MULTI_BALL_START:
                return {
                    id: 'multi_ball_start',
                    name: 'Multi Ball Start',
                    description: 'Start each level with 3 balls instead of 1'
                };
            case RelicType.LASER_DAMAGE_BOOST:
                return {
                    id: 'laser_damage_boost',
                    name: 'Laser Power',
                    description: 'Laser power-up deals double damage'
                };
            case RelicType.BRICK_PENETRATION:
                return {
                    id: 'brick_penetration',
                    name: 'Penetrating Shots',
                    description: 'Ball can pass through bricks, destroying multiple in a row'
                };
            case RelicType.SPEED_BOOST:
                return {
                    id: 'speed_boost',
                    name: 'Speed Boost',
                    description: 'Ball moves 25% faster'
                };
            default:
                return null;
        }
    }

    private onRelicAdded(relicType: RelicType): void {
        switch (relicType) {
            case RelicType.EXPLOSIVE_BRICKS:
                break;
            case RelicType.MULTI_BALL_START:
                break;
            case RelicType.LASER_DAMAGE_BOOST:
                break;
            case RelicType.BRICK_PENETRATION:
                break;
            case RelicType.SPEED_BOOST:
                break;
        }
    }

    private onRelicRemoved(relicType: RelicType): void {
    }

    public grantRandomRelic(): RelicType | null {
        const allRelicTypes = Object.values(RelicType);
        const availableRelics = allRelicTypes.filter((type: RelicType) => !this.hasRelic(type));
        
        if (availableRelics.length > 0) {
            const randomRelic = availableRelics[Math.floor(Math.random() * availableRelics.length)];
            this.addRelic(randomRelic);
            return randomRelic;
        }
        return null;
    }

    // 添加测试需要的方法
    public getRelicCount(): number {
        return this._activeRelics.size;
    }

    public canAcquireRelic(relicType: RelicType): boolean {
        return !this.hasRelic(relicType);
    }

    public getRelicEffect(relicType: RelicType): string {
        const relic = this.getRelic(relicType);
        return relic ? relic.description : '';
    }

    public saveRelics(): any {
        const relicData: any = {};
        this._activeRelics.forEach((relic, type) => {
            relicData[type] = relic;
        });
        return relicData;
    }

    public loadRelics(data: any): boolean {
        try {
            this.clearAllRelics();
            for (const [type, relicData] of Object.entries(data)) {
                if (Object.values(RelicType).includes(type as RelicType)) {
                    this._activeRelics.set(type as RelicType, relicData as Relic);
                }
            }
            return true;
        } catch (error) {
            console.error('Failed to load relics:', error);
            return false;
        }
    }

    public getRelicCombinations(): RelicType[][] {
        const activeTypes = Array.from(this._activeRelics.keys());
        const combinations: RelicType[][] = [];
        
        // 生成所有可能的组合
        for (let i = 0; i < activeTypes.length; i++) {
            for (let j = i + 1; j < activeTypes.length; j++) {
                combinations.push([activeTypes[i], activeTypes[j]]);
            }
        }
        
        return combinations;
    }
}