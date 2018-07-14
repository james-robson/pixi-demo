import * as WebFont from 'webfontloader';
import { app, createApplication } from './lib/app';
import './main.css';
import { createBall } from './sprites/ball';
import { createCenterLine } from './sprites/centerLine';
import { menuContainer, renderMenu } from './sprites/menu';
import { createPaddles, leftPaddle, rightPaddle } from './sprites/paddles';
import { createScores, scores } from './sprites/scores';
import { currentState, setState } from './states/current';
import { play } from './states/play';

import './assets/images/loading.gif';

import { IGameSettings, settings, updateSettings } from './lib/settings';

const direction: boolean = true;

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
    currentState(delta);
}

function startPlaying(selectedSettings: IGameSettings): void {
    setState(play);
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
