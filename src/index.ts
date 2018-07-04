import * as PIXI from 'pixi.js';
import { Application, Container } from 'pixi.js';
import './main.css';
import { Ball } from './sprites/ball';

let app: Application;
const ball = new Ball();
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
    appToUpdate.stage.addChild(ball.sprite);
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
    let paddle;

    // Only detect collisions on the paddle the ball is heading towards
    if (direction) {
        paddle = rightPaddle;
    } else {
        paddle = leftPaddle;
    }

    // PERF: It should be easy to work out if a ball is near either a paddle, side or goal without testing all three
    detectPaddleCollision(paddle, ball);
    detectSideCollision(ball);
    detectGoal(ball);

    ball.calculateRebound(direction);

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
function detectPaddleCollision(paddle: PIXI.Graphics, currentBall: Ball): void {

    // Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    // hit will determine whether there's a collision
    hit = false;

    // Find the center points of each sprite
    const paddleCenterX = paddle.x + paddle.width / 2;
    const paddleCenterY = paddle.y + paddle.height / 2;
    const ballCenterX = currentBall.sprite.x + currentBall.sprite.width / 2;
    const ballCenterY = currentBall.sprite.y + currentBall.sprite.height / 2;

    // Find the half-widths and half-heights of each sprite
    const paddleHalfWidth = paddle.width / 2;
    const paddleHalfHeight = paddle.height / 2;
    const ballHalfWidth = ball.sprite.width / 2;
    const ballHalfHeight = ball.sprite.height / 2;

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

        // Set the ball return angle
        // PERF: This is a really dumb way to do this...
        switch (true) {
            case vy > 60:
                currentBall.setAngle(direction ? 40 : 140);
                break;

            case vy > 40:
                currentBall.setAngle(direction ? 60 : 120);
                break;

            case vy > 20:
                currentBall.setAngle(direction ? 80 : 100);
                break;

            case vy < 20 && vy > -20:
                currentBall.setAngle(90);
                break;

            case vy < -20:
                currentBall.setAngle(direction ? 100 : 80);
                break;

            case vy < -40:
                currentBall.setAngle(direction ? 120 : 60);
                break;

            case vy < -60:
                currentBall.setAngle(direction ? 140 : 40);
                break;

            default:
                currentBall.setAngle(90);
                break;
        }
      } else {

        // There's no collision on the y axis
        hit = false;
      }
    } else {

      // There's no collision on the x axis
      hit = false;
    }

    if (hit) {
        direction = !direction;
    }
  }

function detectSideCollision(currentBall: Ball): void {
    // Top collision
    if (currentBall.sprite.y < 0) {
        currentBall.invertAngle();
    }

    // Bottom collision
    if ((currentBall.sprite.y + currentBall.sprite.height) >= window.innerHeight) {
        currentBall.invertAngle();
    }
}

function detectGoal(currentBall: Ball): void {
    // Left Goal
    if (currentBall.sprite.x < 0) {
        console.log('RIGHT SCORES!');
        const text = new PIXI.Text('RIGHT SCORES', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
        app.stage.addChild(text);
        app.ticker.stop();
    }

    // Right goal
    if ((currentBall.sprite.x + ball.sprite.width) >= window.innerWidth) {
        console.log('LEFT SCORES!');
        app.ticker.stop();
    }
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
