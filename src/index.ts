import * as PIXI from 'pixi.js';

function createPixiApp(): PIXI.Application {
    return new PIXI.Application({ width: 640, height: 360 });
}

function addGraphicsToApp(appToUpdate: PIXI.Application): void {
    const circle = new PIXI.Graphics();
    circle.beginFill(0x5cafe2);
    circle.drawCircle(0, 0, 80);
    circle.x = 320;
    circle.y = 180;
    appToUpdate.stage.addChild(circle);
}

const app = createPixiApp();
const view = app.view;

document.body.appendChild(view);

addGraphicsToApp(app);
