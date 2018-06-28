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
    drawPaddles(appToUpdate.stage);
    drawCenterLine(appToUpdate.stage);
}

function bootstrap(): void {
    app = createPixiApp();
    const view = app.view;

    document.body.appendChild(view);

    addGraphicsToApp(app);
}

function drawPaddles(stage: Container): void {
    const leftPaddle = new PIXI.Graphics();
    leftPaddle.beginFill(0xffffff);
    leftPaddle.drawRect(0, 0, 30, 150);
    leftPaddle.x = 100;
    leftPaddle.y = window.innerHeight / 2 - (leftPaddle.height / 2);
    stage.addChild(leftPaddle);

    const rightPaddle = leftPaddle.clone();
    rightPaddle.x = window.innerWidth - 100;
    rightPaddle.y = window.innerHeight / 2 - (rightPaddle.height / 2);
    stage.addChild(rightPaddle);
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
