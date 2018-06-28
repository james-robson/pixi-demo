import * as PIXI from 'pixi.js';
import { Application, Container } from 'pixi.js';
import './main.css';

let app: Application;
let ball: PIXI.Graphics;
let leftPaddle: PIXI.Graphics;
let rightPaddle: PIXI.Graphics;
let direction: boolean = true;

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
    ball = new PIXI.Graphics();
    ball.beginFill(0xffffff);
    ball.drawRect(0, 0, 30, 30);
    ball.x = window.innerHeight / 2;
    ball.y = window.innerWidth / 2;
    appToUpdate.stage.addChild(ball);
}

function bootstrap(): void {
    app = createPixiApp();
    const view = app.view;

    document.body.appendChild(view);

    addGraphicsToApp(app);
    app.ticker.add((delta) => gameLoop(delta));
}

function drawPaddles(stage: Container): void {
    leftPaddle = new PIXI.Graphics();
    leftPaddle.beginFill(0xffffff);
    leftPaddle.drawRect(0, 0, 30, 150);
    leftPaddle.x = 100;
    leftPaddle.y = window.innerHeight / 2 - (leftPaddle.height / 2);
    stage.addChild(leftPaddle);

    rightPaddle = leftPaddle.clone();
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

function gameLoop(delta: number): void {
    const ballVelocityX = 3;
    let paddle;
    if (direction) {
        paddle = rightPaddle;
    } else {
        paddle = leftPaddle;
    }

    const collision = detectBallCollision(paddle, ball);
    if (collision) {
        direction = !direction;
    }

    // Move the ball 1 pixel
    if (direction) {
        ball.x += ballVelocityX;
    } else {
        ball.x -= ballVelocityX;
    }
}

// tslint:disable-next-line:no-shadowed-variable
function detectBallCollision(paddle: PIXI.Graphics, currentBall: PIXI.Graphics): boolean {

    // Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    // hit will determine whether there's a collision
    hit = false;

    // Find the center points of each sprite
    const paddleCenterX = paddle.x + paddle.width / 2;
    const paddleCenterY = paddle.y + paddle.height / 2;
    const ballCenterX = currentBall.x + currentBall.width / 2;
    const ballCenterY = currentBall.y + currentBall.height / 2;

    // Find the half-widths and half-heights of each sprite
    const paddleHalfWidth = paddle.width / 2;
    const paddleHalfHeight = paddle.height / 2;
    const ballHalfWidth = currentBall.width / 2;
    const ballHalfHeight = currentBall.height / 2;

    // Calculate the distance vector between the sprites
    vx = paddleCenterX - ballCenterX;
    vy = paddleCenterY - ballCenterY;

    // Figure out the combined half-widths and half-heights
    combinedHalfWidths = paddleHalfWidth + ballHalfWidth;
    combinedHalfHeights = paddleHalfHeight + ballHalfHeight;

    // Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      // A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        // There's definitely a collision happening
        hit = true;
      } else {

        // There's no collision on the y axis
        hit = false;
      }
    } else {

      // There's no collision on the x axis
      hit = false;
    }

    // `hit` will be either `true` or `false`
    return hit;
  }
