import * as PIXI from 'pixi.js';
import { Application, Container } from 'pixi.js';
import './main.css';

const radianMultiplier = Math.PI / 180;
const maxBallAngle = 120;
const minBallAngle = 60;
const ballAngle = Math.round((Math.random() * (maxBallAngle - minBallAngle) + minBallAngle) / 10) * 10;

let app: Application;
let ball: PIXI.Graphics;
let leftPaddle: PIXI.Graphics;
let rightPaddle: PIXI.Graphics;
let direction: boolean = true;
let playerOneUpPressed: boolean = false;
let playerOneDownPressed: boolean = false;
let playerTwoUpPressed: boolean = false;
let playerTwoDownPressed: boolean = false;

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
    ball.x = window.innerWidth / 2;
    ball.y = window.innerHeight / 2;
    console.log(ball.x);
    console.log(ball.y);
    appToUpdate.stage.addChild(ball);
}

function bootstrap(): void {
    app = createPixiApp();
    const view = app.view;

    document.body.appendChild(view);

    addGraphicsToApp(app);
    addButtonListeners();

    app.ticker.add((delta) => gameLoop(delta));
}

function addButtonListeners(): void {
    const playerOneKeyboardUp = new KeyListener(87); // W key
    const playerOneKeyboardDown = new KeyListener(83); // S key
    playerOneKeyboardUp.press = () => {
        playerOneUpPressed = true;
    };

    playerOneKeyboardUp.release = () => {
        playerOneUpPressed = false;
    };

    playerOneKeyboardDown.press = () => {
        playerOneDownPressed = true;
    };

    playerOneKeyboardDown.release = () => {
        playerOneDownPressed = false;
    };

    const playerTwoKeyboardUp = new KeyListener(38); // Up arrow
    const playerTwoKeyboardDown = new KeyListener(40); // Down arrow
    playerTwoKeyboardUp.press = () => {
        playerTwoUpPressed = true;
    };

    playerTwoKeyboardUp.release = () => {
        playerTwoUpPressed = false;
    };

    playerTwoKeyboardDown.press = () => {
        playerTwoDownPressed = true;
    };

    playerTwoKeyboardDown.release = () => {
        playerTwoDownPressed = false;
    };
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
    const ballVelocity = 3;
    let paddle;

    // Only detect collisions on the paddle the ball is heading towards
    if (direction) {
        paddle = rightPaddle;
    } else {
        paddle = leftPaddle;
    }

    const collision = detectBallCollision(paddle, ball);
    if (collision) {
        direction = !direction;
    }

    if (direction) {
        ball.x += Math.sin(ballAngle * radianMultiplier) * ballVelocity;
        ball.y += Math.cos(ballAngle * radianMultiplier) * ballVelocity;
        // ball.x += ballVelocityX;
    } else {
        ball.x -= Math.sin(ballAngle * radianMultiplier) * ballVelocity;
        ball.y -= Math.cos(ballAngle * radianMultiplier) * ballVelocity;
        // ball.x -= ballVelocityX;
    }

    if (playerOneUpPressed && leftPaddle.y > 0) {
        leftPaddle.y -= 10;
    }

    if (playerOneDownPressed && (leftPaddle.y + leftPaddle.height) < window.innerHeight) {
        leftPaddle.y += 10;
    }

    if (playerTwoUpPressed && rightPaddle.y > 0) {
        rightPaddle.y -= 10;
    }

    if (playerTwoDownPressed && (rightPaddle.y + rightPaddle.height) < window.innerHeight) {
        rightPaddle.y += 10;
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

class KeyListener {
    public press: () => void;
    public release: () => void;
    public isDown: boolean = false;
    public isUp: boolean =  true;

    private code: number;

    constructor(keyCode: number) {
        this.code = keyCode;
        // Attach event listeners
        window.addEventListener(
            'keydown', this.downHandler.bind(this), false
        );
        window.addEventListener(
            'keyup', this.upHandler.bind(this), false
        );
    }

    private downHandler = (event: KeyboardEvent) => {
        if (event.keyCode === this.code) {
            this.isDown = true;
            this.isUp = false;
            this.press();
        }
        event.preventDefault();
      }

      // The `upHandler`
    private upHandler = (event: KeyboardEvent) => {
        if (event.keyCode === this.code) {
            if (this.isDown && this.release) { this.release(); }
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    }
}
