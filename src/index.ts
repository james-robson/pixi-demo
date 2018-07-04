import * as PIXI from 'pixi.js';
import { Application, Container } from 'pixi.js';
import * as collisions from './lib/collisionDetection';
import { KeyListener } from './lib/keyListener';
import './main.css';
import { Ball } from './sprites/ball';
import { Paddle } from './sprites/paddle';

let app: Application;
const ball = new Ball();
const leftPaddle = new Paddle(100);
const rightPaddle = new Paddle(window.innerWidth - 100);
const playerOneKeyboardUp = new KeyListener(87); // W key
const playerOneKeyboardDown = new KeyListener(83); // S key
const playerTwoKeyboardUp = new KeyListener(38); // Up arrow
const playerTwoKeyboardDown = new KeyListener(40); // Down arrow
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
    appToUpdate.stage.addChild(ball.sprite);
}

function bootstrap(): void {
    app = createPixiApp();
    const view = app.view;

    document.body.appendChild(view);

    addGraphicsToApp(app);

    app.ticker.add((delta) => gameLoop(delta));
}

function drawPaddles(stage: Container): void {
    stage.addChild(leftPaddle.sprite);
    stage.addChild(rightPaddle.sprite);
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
    let currentPaddle;

    // Only detect collisions on the paddle the ball is heading towards
    if (direction) {
        currentPaddle = rightPaddle;
    } else {
        currentPaddle = leftPaddle;
    }

    // Find the center points of each sprite
    const paddleCenterX = currentPaddle.sprite.x + currentPaddle.sprite.width / 2;
    const paddleCenterY = currentPaddle.sprite.y + currentPaddle.sprite.height / 2;
    const ballCenterX = ball.sprite.x + ball.sprite.width / 2;
    const ballCenterY = ball.sprite.y + ball.sprite.height / 2;

    // Calculate the distance vector between the sprites
    const vx = paddleCenterX - ballCenterX;
    const vy = paddleCenterY - ballCenterY;

    // PERF: It should be easy to work out if a ball is near either a paddle, side or goal without testing all three
    if (collisions.paddle(currentPaddle, ball, vx, vy)) {
        direction = !direction;

        // Set the ball return angle
        // PERF: This is a really dumb way to do this...
        switch (true) {
            case vy > 60:
                ball.setAngle(direction ? 40 : 140);
                break;

            case vy > 40:
                ball.setAngle(direction ? 60 : 120);
                break;

            case vy > 20:
                ball.setAngle(direction ? 80 : 100);
                break;

            case vy < 20 && vy > -20:
                ball.setAngle(90);
                break;

            case vy < -20:
                ball.setAngle(direction ? 100 : 80);
                break;

            case vy < -40:
                ball.setAngle(direction ? 120 : 60);
                break;

            case vy < -60:
                ball.setAngle(direction ? 140 : 40);
                break;

            default:
                ball.setAngle(90);
                break;
        }
    }

    if (collisions.side(ball)) {
        ball.invertAngle();
    }

    if (collisions.goal(ball)) {
        const text = new PIXI.Text('SCORE!!!', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
        app.stage.addChild(text);
        app.ticker.stop();
    }

    ball.calculateRebound(direction);

    if (playerOneKeyboardUp.isDown && leftPaddle.sprite.y > 0) {
        leftPaddle.moveUp();
    }

    if (playerOneKeyboardDown.isDown && (leftPaddle.sprite.y + leftPaddle.sprite.height) < window.innerHeight) {
        leftPaddle.moveDown();
    }

    if (playerTwoKeyboardUp.isDown && rightPaddle.sprite.y > 0) {
        rightPaddle.moveUp();
    }

    if (playerTwoKeyboardDown.isDown && (rightPaddle.sprite.y + rightPaddle.sprite.height) < window.innerHeight) {
        rightPaddle.moveDown();
    }
}
