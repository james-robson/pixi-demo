import { playerOneKeyboardDown, playerOneKeyboardUp, playerTwoKeyboardDown, playerTwoKeyboardUp } from 'movement';
import { leftPaddle, rightPaddle } from 'sprites';

export function detectPlayerOneMovement(delta: number): void {
    if (playerOneKeyboardUp.isDown && rightPaddle.sprite.y > 0) {
        rightPaddle.moveUp(delta);
    }

    if (playerOneKeyboardDown.isDown && (rightPaddle.sprite.y + rightPaddle.sprite.height) < window.innerHeight) {
        rightPaddle.moveDown(delta);
    }
}

export function detectPlayerTwoMovement(delta: number): void {
    if (playerTwoKeyboardUp.isDown && leftPaddle.sprite.y > 0) {
        leftPaddle.moveUp(delta);
    }

    if (playerTwoKeyboardDown.isDown && (leftPaddle.sprite.y + leftPaddle.sprite.height) < window.innerHeight) {
        leftPaddle.moveDown(delta);
    }
}
