import { ball } from '../../sprites/ball';
import { leftPaddle } from '../../sprites/paddles';

const minDiff: number = 1;
const maxDiff: number = 30;

export function moveCPUPaddle(delta: number): void {
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
