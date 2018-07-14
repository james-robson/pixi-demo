import { detectPlayerOneMovement, detectPlayerTwoMovement } from 'movement';
import { settings } from 'settings';

export function score (delta: number): void {
    // You can still move while the score animation plays
    detectPlayerOneMovement(delta);
    if (settings.mode === 'twoPlayer') {
        detectPlayerTwoMovement(delta);
    }
}
