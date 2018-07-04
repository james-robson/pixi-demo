import * as PIXI from 'pixi.js';

export class Paddle {
    public sprite: PIXI.Graphics = new PIXI.Graphics();

    constructor(xAxisPosition: number) {
        this.sprite.beginFill(0xffffff);
        this.sprite.drawRect(0, 0, 30, 150);
        this.sprite.x = xAxisPosition;
        this.sprite.y = window.innerHeight / 2 - (this.sprite.height / 2);
    }

    public moveUp(): void {
        this.sprite.y -= 10;
    }

    public moveDown(): void {
        this.sprite.y += 10;
    }
}
