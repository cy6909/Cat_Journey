import { LaunchStrategy, LaunchContext, LaunchParams } from "../LaunchStrategy";
import { Vec2 } from "cc";

export class RandomLaunchStrategy implements LaunchStrategy{
    calculateLaunchParams(context: LaunchContext): LaunchParams {
        const baseAngle = Math.PI / 2;
        const randomOffset = (Math.random() - 0.5) * (Math.PI / 6);
        const angle = baseAngle + randomOffset;
        const direction = new Vec2(Math.cos(angle), Math.sin(angle));
        return { direction, speed: 100 };
    }

    needsUserInput(): boolean {
        return false;
    }
}