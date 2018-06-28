import * as PIXI from 'pixi.js';
import { Application, Container, Graphics } from 'pixi.js';
import './main.css';

let app: Application;

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    // Remove all the old child elements
    while (app.stage.children[0]) {
        app.stage.removeChild(app.stage.children[0]);
    }
    addGraphicsToApp(app);
});

window.addEventListener('load', () => {
    bootstrap();
    }, false);

function createPixiApp(): PIXI.Application {
    return new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
}

function addGraphicsToApp(appToUpdate: PIXI.Application): void {
    const paddle = drawPaddle();
    drawCenterLine(appToUpdate.stage);
    appToUpdate.stage.addChild(paddle);
}

function bootstrap(): void {
    app = createPixiApp();
    const view = app.view;

    document.body.appendChild(view);

    addGraphicsToApp(app);
}

function drawPaddle(): Graphics {
    const paddle = new PIXI.Graphics();
    paddle.beginFill(0xffffff);
    paddle.drawRect(0, 0, 30, 150);
    paddle.x = window.innerWidth / 3;
    paddle.y = window.innerHeight / 3;
    return paddle;
}

function drawCenterLine(stage: Container): void {
    let lineLength = 0;

    while (lineLength < window.innerHeight) {
        const centerLine = new PIXI.Graphics();
        const dashLength = 40;
        centerLine.position.set(window.innerWidth / 2, lineLength);

        centerLine.lineStyle(10, 0xffffff)
            .moveTo(0, 0)
            .lineTo(0, dashLength);

        lineLength += dashLength * 2;

        stage.addChild(centerLine);
    }
}
