import * as PIXI from 'pixi.js';
import { Application, Container } from 'pixi.js';
import * as collisions from './lib/collisionDetection';
import { KeyListener } from './lib/keyListener';
import './main.css';
import { Ball } from './sprites/ball';
import { CenterLine } from './sprites/centerLine';
import { Paddle } from './sprites/paddle';

let app: Application;
let state = play;
let ball = new Ball();
const leftPaddle = new Paddle(100);
const rightPaddle = new Paddle(window.innerWidth - 100);
let currentPaddle = rightPaddle;

const playerOneKeyboardUp = new KeyListener(87); // W key
const playerOneKeyboardDown = new KeyListener(83); // S key
const playerTwoKeyboardUp = new KeyListener(38); // Up arrow
const playerTwoKeyboardDown = new KeyListener(40); // Down arrow

let playerOneScore = 0;
const playerOneScoreText = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 72, fill : 0xffffff, align : 'center'});
playerOneScoreText.anchor.set(0.5, 0.5);
playerOneScoreText.position.set(window.innerWidth / 4, 100);

let playerTwoScore = 0;
const playerTwoScoreText = new PIXI.Text('0', {fontFamily : 'Arial', fontSize: 72, fill : 0xffffff, align : 'center'});
playerTwoScoreText.anchor.set(0.5, 0.5);
playerTwoScoreText.position.set((window.innerWidth / 4) * 3, 100);

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
    appToUpdate.stage.addChild(leftPaddle.sprite);
    appToUpdate.stage.addChild(rightPaddle.sprite);

    const centerLines = new CenterLine();
    centerLines.sprites.forEach((line: PIXI.Graphics) => {
        appToUpdate.stage.addChild(line);
    });

    appToUpdate.stage.addChild(ball.sprite);

    app.stage.addChild(playerOneScoreText);
    app.stage.addChild(playerTwoScoreText);
}

function bootstrap(): void {
    app = createPixiApp();
    const view = app.view;

    document.body.appendChild(view);

    addGraphicsToApp(app);

    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta: number): void {
    state(delta);
}

function score (delta: number): void {
    // You can still move while the score animation plays
    detectMovement();
}

function play (delta: number): void {
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

        direction = !direction;
        currentPaddle = direction ? rightPaddle : leftPaddle;
    }

    if (collisions.side(ball)) {
        ball.invertAngle();
    }

    if (collisions.goal(ball)) {
        if (direction) {
            playerOneScore++;
            playerOneScoreText.text = playerOneScore.toString();
        } else {
            playerTwoScore++;
            playerTwoScoreText.text = playerTwoScore.toString();
        }

        state = score;

        const flashing = setInterval(() => {
            ball.sprite.alpha = ball.sprite.alpha ? 0 : 1;
        }, 200);

        setTimeout(() => {
            clearInterval(flashing);
            app.stage.removeChild(ball.sprite);
            ball = new Ball();
            app.stage.addChild(ball.sprite);
            state = play;
            app.ticker.start();
        }, 3000);
    }

    ball.calculateRebound(direction);
    detectMovement();

}

function detectMovement(): void {
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
