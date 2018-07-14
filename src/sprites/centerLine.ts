import * as PIXI from 'pixi.js';
import { app } from '../lib/app';

export class CenterLine {
    public sprites: PIXI.Graphics[];
    private lineLength: number = 0;

    constructor() {
        this.sprites = [];
        while (this.lineLength < window.innerHeight) {
            const centerLine = new PIXI.Graphics();
            const dashLength = 40;
            centerLine.position.set(window.innerWidth / 2, this.lineLength);

            centerLine.lineStyle(10, 0xffffff)
                .moveTo(0, 0)
                .lineTo(0, dashLength);

            this.sprites.push(centerLine);
            this.lineLength += dashLength * 2;
        }
    }
}

export function createCenterLine(): void {
    const centerLine = new CenterLine();
    centerLine.sprites.forEach((line: PIXI.Graphics) => {
        app.stage.addChild(line);
    });
}
