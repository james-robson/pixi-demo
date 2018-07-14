import * as WebFont from 'webfontloader';
import './assets/images/loading.gif';
import { app, createApplication } from './lib/app';
import { IGameSettings, updateSettings } from './lib/settings';
import './main.css';
import { createBall } from './sprites/ball';
import { createCenterLine } from './sprites/centerLine';
import { menuContainer, renderMenu } from './sprites/menu';
import { createPaddles } from './sprites/paddles';
import { createScores } from './sprites/scores';
import { currentState, setState } from './states/current';
import { play } from './states/play';

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
