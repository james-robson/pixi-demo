import * as PIXI from 'pixi.js';

import 'pixi-sound';
import * as WebFont from 'webfontloader';
import { app, createApplication } from './lib/app';
import * as collisions from './lib/collisionDetection';
import { KeyListener } from './lib/keyListener';
import './main.css';
import { Ball } from './sprites/ball';
import { CenterLine } from './sprites/centerLine';
import { menuContainer, renderMenu } from './sprites/menu';
import { createPaddles, leftPaddle, rightPaddle } from './sprites/paddle';

import './assets/images/loading.gif';

import './assets/sounds/beeep.ogg';
import './assets/sounds/peeeeeep.ogg';
import './assets/sounds/plop.ogg';

const sideHitSound = PIXI.sound.Sound.from('./assets/sounds/plop.ogg');
const paddleHitSound = PIXI.sound.Sound.from('./assets/sounds/beeep.ogg');
const scoreSound = PIXI.sound.Sound.from('./assets/sounds/peeeeeep.ogg');

let settings: IGameSettings;
let state: ((delta: number) => void);
let ball = new Ball();

const playerTwoKeyboardUp = new KeyListener(87); // W key
const playerTwoKeyboardDown = new KeyListener(83); // S key
const playerOneKeyboardUp = new KeyListener(38); // Up arrow
const playerOneKeyboardDown = new KeyListener(40); // Down arrow

let playerTwoScore = 0;
const playerTwoScoreText = new PIXI.Text('0', {fontFamily : 'Press Start 2P', fontSize: 72, fill : 0xffffff, align : 'center'});
playerTwoScoreText.anchor.set(0.5, 0.5);
playerTwoScoreText.position.set(window.innerWidth / 4, 100);

let playerOneScore = 0;
const playerOneScoreText = new PIXI.Text('0', {fontFamily : 'Press Start 2P', fontSize: 72, fill : 0xffffff, align : 'center'});
playerOneScoreText.anchor.set(0.5, 0.5);
playerOneScoreText.position.set((window.innerWidth / 4) * 3, 100);

let direction: boolean = true;

window.addEventListener('load', () => {
    bootstrap();
    WebFont.load({
        google: {
            families: ['Press Start 2P']
        },
        active: menu
    });
}, false);

function addGraphicsToApp(): void {
    createPaddles(100, window.innerWidth - 100);
    app.stage.addChild(leftPaddle.sprite);
    app.stage.addChild(rightPaddle.sprite);

    const centerLines = new CenterLine();
    centerLines.sprites.forEach((line: PIXI.Graphics) => {
        app.stage.addChild(line);
    });

    app.stage.addChild(ball.sprite);

    app.stage.addChild(playerTwoScoreText);
    app.stage.addChild(playerOneScoreText);
}

function bootstrap(): void {
    createApplication();
    const view = app.view;

    document.body.appendChild(view);
}

function gameLoop(delta: number): void {
    state(delta);
}

function score (delta: number): void {
    // You can still move while the score animation plays
    detectPlayerOneMovement(delta);
    if (settings.mode === 'twoPlayer') {
        detectPlayerTwoMovement(delta);
    }
}

function win (): void {
    const winningPlayer = (playerTwoScore === 10) ? 'ONE' : 'TWO';
    const winText = new PIXI.Text(`PLAYER ${winningPlayer} WINS!`, {fontFamily : 'Press Start 2P', fontSize: 52, fill : 0xffffff, align : 'center'});
    winText.anchor.set(0.5, 0.5);
    winText.position.set(window.innerWidth / 2, window.innerHeight / 2);
    app.stage.addChild(winText);
}

function startPlaying(selectedSettings: IGameSettings): void {
    state = play;
    settings = selectedSettings;
    addGraphicsToApp();
    const element = document.getElementById('loadingContainer');
    element.classList.add('hidden');

    app.ticker.add((delta) => gameLoop(delta));
}

function menu(): void {
    const element = document.getElementById('loadingContainer');
    element.classList.add('hidden');

    renderMenu();
    const onePlayerText = menuContainer.getChildByName('onePlayerText');
    const twoPlayerText = menuContainer.getChildByName('twoPlayerText');

    onePlayerText.on('click', () => {
        app.stage.removeChild(menuContainer);
        startPlaying({mode: 'onePlayer'});
    });

    twoPlayerText.on('click', () => {
        app.stage.removeChild(menuContainer);
        startPlaying({mode: 'twoPlayer'});
    });

}

function play (delta: number): void {
    ball.calculateRebound(direction);
    detectPlayerOneMovement(delta);

    if (settings.mode === 'onePlayer') {
        moveCPUPaddle(delta);
    } else {
        detectPlayerTwoMovement(delta);
    }

    const currentPaddle = direction ? rightPaddle : leftPaddle;

    // Find the center points of each sprite
    const paddleCenterX = currentPaddle.sprite.x + currentPaddle.getHalfWidth();
    const paddleCenterY = currentPaddle.sprite.y + currentPaddle.getHalfHeight();
    const ballCenterX = ball.sprite.x + ball.getHalfHeight();
    const ballCenterY = ball.sprite.y + ball.getHalfHeight();

    // Calculate the distance vector between the sprites
    const vx = paddleCenterX - ballCenterX;
    const vy = paddleCenterY - ballCenterY;

    // PERF: It should be easy to work out if a ball is near either a paddle, side or goal without testing all three
    if (collisions.paddle(ball, vx, vy)) {
        paddleHitSound.play();

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
                ball.setAngle(89);
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
                ball.setAngle(89);
                break;
        }

        if (!direction && (playerTwoKeyboardDown.isDown || playerTwoKeyboardUp.isDown)){
            ball.speedUp();
        } else if (direction && (playerOneKeyboardDown.isDown || playerOneKeyboardUp.isDown)){
            ball.speedUp();
        } else {
            ball.slowDown();
        }

        direction = !direction;

        return;
    }

    if (collisions.side(ball)) {
        sideHitSound.play();
        ball.invertAngle();
        return;
    }

    if (collisions.goal(ball)) {
        scoreSound.play();
        if (direction) {
            playerTwoScore++;
            playerTwoScoreText.text = playerTwoScore.toString();
        } else {
            playerOneScore++;
            playerOneScoreText.text = playerOneScore.toString();
        }

        if (playerTwoScore === 10 || playerOneScore === 10) {
            state = win;
            return;
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
        return;
    }
}

function detectPlayerOneMovement(delta: number): void {
    if (playerOneKeyboardUp.isDown && rightPaddle.sprite.y > 0) {
        rightPaddle.moveUp(delta);
    }

    if (playerOneKeyboardDown.isDown && (rightPaddle.sprite.y + rightPaddle.sprite.height) < window.innerHeight) {
        rightPaddle.moveDown(delta);
    }
}

function detectPlayerTwoMovement(delta: number): void {
    if (playerTwoKeyboardUp.isDown && leftPaddle.sprite.y > 0) {
        leftPaddle.moveUp(delta);
    }

    if (playerTwoKeyboardDown.isDown && (leftPaddle.sprite.y + leftPaddle.sprite.height) < window.innerHeight) {
        leftPaddle.moveDown(delta);
    }
}

const minDiff: number = 40;
const maxDiff: number = 130;

function moveCPUPaddle(delta: number): void {
    const threshold: number = Math.round((Math.random() * (maxDiff - minDiff) + minDiff) / 10) * 10;

    const paddleCenter = leftPaddle.sprite.y - leftPaddle.getHalfHeight();
    const ballCenter = ball.sprite.y - ball.getHalfHeight();

    const diff = paddleCenter - ballCenter;
    const isNegative = diff < 0 ? true : false;
    const normalisedDiff = Math.abs(diff);

    if ((isNegative && (normalisedDiff > threshold)) &&
       ((leftPaddle.sprite.y + leftPaddle.sprite.height) < window.innerHeight)) {
        leftPaddle.moveDown(delta);
        return;
    }

    if ((normalisedDiff > threshold) &&
       leftPaddle.sprite.y > 0) {
        leftPaddle.moveUp(delta);
    }
}

interface IGameSettings {
    mode: 'onePlayer' | 'twoPlayer';
}
