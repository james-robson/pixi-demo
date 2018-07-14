import 'pixi-sound';
import * as PIXI from 'pixi.js';

import '../assets/sounds/beeep.ogg';
import '../assets/sounds/peeeeeep.ogg';
import '../assets/sounds/plop.ogg';

export const sideHitSound = PIXI.sound.Sound.from('./assets/sounds/plop.ogg');
export const paddleHitSound = PIXI.sound.Sound.from('./assets/sounds/beeep.ogg');
export const scoreSound = PIXI.sound.Sound.from('./assets/sounds/peeeeeep.ogg');
