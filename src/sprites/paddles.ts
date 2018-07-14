import { app } from 'app';
import * as PIXI from 'pixi.js';

export let leftPaddle: Paddle;
export let rightPaddle: Paddle;

export class Paddle {
    public sprite: PIXI.Graphics = new PIXI.Graphics();
    private width: number = 30;
    private height: number = 150;
    private halfHeight: number = this.height / 2;
    private halfWidth: number = this.width / 2;

    constructor(xAxisPosition: number) {
        this.sprite.beginFill(0xffffff);
        this.sprite.drawRect(0, 0, this.width, 150);
        this.sprite.x = xAxisPosition;
        this.sprite.y = window.innerHeight / 2 - (this.sprite.height / 2);
    }

    public moveUp(delta: number): void {
        this.sprite.y -= (10 + delta);
    }

    public moveDown(delta: number): void {
        this.sprite.y += (10 + delta);
    }

    public getHalfHeight(): number {
        return this.halfHeight;
    }

    public getHalfWidth(): number {
        return this.halfWidth;
    }
}

export function createPaddles(paddleOneX: number, paddleTwoX: number): void {
    leftPaddle = new Paddle(paddleOneX);
    rightPaddle = new Paddle(paddleTwoX);
    app.stage.addChild(leftPaddle.sprite);
    app.stage.addChild(rightPaddle.sprite);
}
