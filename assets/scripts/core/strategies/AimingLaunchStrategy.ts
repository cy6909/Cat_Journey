import { LaunchStrategy, LaunchContext, LaunchParams } from "../LaunchStrategy";
import { Vec2 } from "cc";

export class AimingLaunchStrategy implements LaunchStrategy{
    calculateLaunchParams(context: LaunchContext): LaunchParams {
        if (!context.aimDirection) {
            return { direction: new Vec2(0, 1), speed: 100 };
        }
        const normalized = context.aimDirection.clone().normalize();
        return { direction: normalized, speed: 100 };
    }

    needsUserInput(): boolean {
        return true;
    }
}