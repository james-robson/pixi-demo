import * as PIXI from 'pixi.js';

import 'pixi-sound';
import * as WebFont from 'webfontloader';
import { app, createApplication } from './lib/app';
import * as collisions from './lib/collisionDetection';
import { playerOneKeyboardDown, playerOneKeyboardUp, playerTwoKeyboardDown, playerTwoKeyboardUp } from './lib/keyListener';
import { moveCPUPaddle } from './lib/movement/cpu';
import { detectPlayerOneMovement, detectPlayerTwoMovement } from './lib/movement/player';
import './main.css';
import { ball, createBall } from './sprites/ball';
import { createCenterLine } from './sprites/centerLine';
import { menuContainer, renderMenu } from './sprites/menu';
import { createPaddles, leftPaddle, rightPaddle } from './sprites/paddles';
import { createScores, scores } from './sprites/scores';
import { score } from './states/score';
import { win } from './states/win';

import './assets/images/loading.gif';

import './assets/sounds/beeep.ogg';
import './assets/sounds/peeeeeep.ogg';
import './assets/sounds/plop.ogg';
import { IGameSettings, settings, updateSettings } from './lib/settings';

const sideHitSound = PIXI.sound.Sound.from('./assets/sounds/plop.ogg');
const paddleHitSound = PIXI.sound.Sound.from('./assets/sounds/beeep.ogg');
const scoreSound = PIXI.sound.Sound.from('./assets/sounds/peeeeeep.ogg');

let state: ((delta: number) => void);
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
    createBall();
    createCenterLine();
    createScores();
}

function bootstrap(): void {
    createApplication();
    const view = app.view;

    document.body.appendChild(view);
}

function gameLoop(delta: number): void {
    state(delta);
}

function startPlaying(selectedSettings: IGameSettings): void {
    state = play;
    updateSettings(selectedSettings);
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
            scores.incrementScore('playerOne');
        } else {
            scores.incrementScore('playerTwo');
        }

        if (scores.getScore('playerOne') === 10 || scores.getScore('playerTwo') === 10) {
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
            // Start a new ball
            createBall();
            app.stage.addChild(ball.sprite);
            state = play;
            app.ticker.start();
        }, 3000);
        return;
    }
}
