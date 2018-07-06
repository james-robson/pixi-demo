import * as PIXI from 'pixi.js';

export class Ball {
    public sprite: PIXI.Graphics = new PIXI.Graphics();

    private readonly radianMultiplier: number = Math.PI / 180;
    private readonly minAngle: number = 60;
    private readonly maxAngle: number = 120;
    private angle: number = Math.round((Math.random() * (this.maxAngle - this.minAngle) + this.minAngle) / 10) * 10;
    private velocity: number = 10;

    constructor() {
        this.sprite.beginFill(0xffffff);
        this.sprite.drawRect(0, 0, 30, 30);
        this.sprite.x = window.innerWidth / 2;
        this.sprite.y = window.innerHeight / 2;
    }

    public setAngle (newAngle: number): void {
        this.angle = newAngle;
    }

    public invertAngle (): void {
        this.angle = 180 - this.angle;
    }

    public calculateRebound(direction: boolean): void {
        const xAxisCalculation = Math.sin(this.angle * this.radianMultiplier) * this.velocity;
        const yAxisCalculation = Math.cos(this.angle * this.radianMultiplier) * this.velocity;
        if (direction) {
            this.sprite.x += xAxisCalculation;
            this.sprite.y += yAxisCalculation;
        } else {
            this.sprite.x -= xAxisCalculation;
            this.sprite.y -= yAxisCalculation;
        }

    }
}