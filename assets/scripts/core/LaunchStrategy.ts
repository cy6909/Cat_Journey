import { Vec2 } from "cc";

export interface LaunchParams{
    direction: Vec2;
    speed: number;
}

export interface LaunchContext{
    paddlePosition: Vec2;
    ballPosition: Vec2;
    mousePosition: Vec2;
    aimDirection: Vec2;
}

export interface LaunchStrategy{
    calculateLaunchParams(context: LaunchContext): LaunchParams;
    needsUserInput(): boolean;
}
