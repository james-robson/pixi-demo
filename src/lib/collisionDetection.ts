import { Ball } from '../sprites/ball';
import { leftPaddle } from '../sprites/paddle';

export function paddle(currentBall: Ball, vx: number, vy: number): boolean {

    // Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights;

    // hit will determine whether there's a collision
    hit = false;

    // Find the half-widths and half-heights of each sprite
    const paddleHalfWidth = leftPaddle.getHalfWidth();
    const paddleHalfHeight = leftPaddle.getHalfHeight();
    const ballHalfWidth = currentBall.sprite.width / 2;
    const ballHalfHeight = currentBall.sprite.height / 2;

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

    if (hit) {
        hit = true;
    }

    return hit;
  }

export function side(currentBall: Ball): boolean {
    // Top collision
    if (currentBall.sprite.y < 0) {
        return true;
    }

    // Bottom collision
    if ((currentBall.sprite.y + currentBall.sprite.height) >= window.innerHeight) {
        return true;
    }
}

export function goal(currentBall: Ball): boolean {
    // Left Goal
    if (currentBall.sprite.x < 0) {
        return true;
    }

    // Right goal
    if ((currentBall.sprite.x + currentBall.sprite.width) >= window.innerWidth) {
        return true;
    }
}
