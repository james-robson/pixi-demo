import { Application } from 'pixi.js';

export let app: Application;

export function createApplication(): void {
    app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
}
