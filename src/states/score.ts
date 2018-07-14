import { detectPlayerOneMovement, detectPlayerTwoMovement } from '../lib/movement/player';
import { settings } from '../lib/settings';

export function score (delta: number): void {
    // You can still move while the score animation plays
    detectPlayerOneMovement(delta);
    if (settings.mode === 'twoPlayer') {
        detectPlayerTwoMovement(delta);
    }
}
