import { app } from 'app';
import { detectPlayerOneMovement, detectPlayerTwoMovement, moveCPUPaddle, playerOneKeyboardDown, playerOneKeyboardUp,
playerTwoKeyboardDown, playerTwoKeyboardUp } from 'movement';
import * as collisions from 'movement/collisionDetection';
import { settings } from 'settings';
import { ball, createBall, leftPaddle, rightPaddle, scores } from 'sprites';
import { score, setState, win} from 'states';

import { paddleHitSound, scoreSound, sideHitSound } from 'sounds/sounds';

export function play (delta: number): void {
    ball.calculateRebound();
    detectPlayerOneMovement(delta);

    if (settings.mode === 'onePlayer') {
        moveCPUPaddle(delta);
    } else {
        detectPlayerTwoMovement(delta);
    }

    const currentPaddle = ball.direction ? rightPaddle : leftPaddle;

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
                ball.setAngle(ball.direction ? 40 : 140);
                break;

            case vy > 40:
                ball.setAngle(ball.direction ? 60 : 120);
                break;

            case vy > 20:
                ball.setAngle(ball.direction ? 80 : 100);
                break;

            case vy < 20 && vy > -20:
                ball.setAngle(89);
                break;

            case vy < -20:
                ball.setAngle(ball.direction ? 100 : 80);
                break;

            case vy < -40:
                ball.setAngle(ball.direction ? 120 : 60);
                break;

            case vy < -60:
                ball.setAngle(ball.direction ? 140 : 40);
                break;

            default:
                ball.setAngle(89);
                break;
        }

        if (!ball.direction && (playerTwoKeyboardDown.isDown || playerTwoKeyboardUp.isDown)){
            ball.speedUp();
        } else if (ball.direction && (playerOneKeyboardDown.isDown || playerOneKeyboardUp.isDown)){
            ball.speedUp();
        } else {
            ball.slowDown();
        }

        ball.direction = !ball.direction;

        return;
    }

    if (collisions.side(ball)) {
        sideHitSound.play();
        ball.invertAngle();
        return;
    }

    if (collisions.goal(ball)) {
        scoreSound.play();
        if (ball.direction) {
            scores.incrementScore('playerOne');
        } else {
            scores.incrementScore('playerTwo');
        }

        if (scores.getScore('playerOne') === 10 || scores.getScore('playerTwo') === 10) {
            setState(win);
            return;
        }

        setState(score);

        const flashing = setInterval(() => {
            ball.sprite.alpha = ball.sprite.alpha ? 0 : 1;
        }, 200);

        setTimeout(() => {
            clearInterval(flashing);
            app.stage.removeChild(ball.sprite);
            // Start a new ball
            createBall(!ball.direction);
            setState(play);
            app.ticker.start();
        }, 3000);
        return;
    }
}
