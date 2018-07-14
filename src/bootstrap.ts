import * as WebFont from 'webfontloader';
import { app, createApplication } from './lib/app';
import { IGameSettings, updateSettings } from './lib/settings';
import { createBall } from './sprites/ball';
import { createCenterLine } from './sprites/centerLine';
import { menuContainer, renderMenu } from './sprites/menu';
import { createPaddles } from './sprites/paddles';
import { createScores } from './sprites/scores';
import { currentState, setState } from './states/current';
import { play } from './states/play';

export function bootstrap(): void {
    createApplication();
    const view = app.view;

    document.body.appendChild(view);

    // Once the font loads show the menu
    WebFont.load({
        google: {
            families: ['Press Start 2P']
        },
        active: showMenu
    });
}

function showMenu(): void {
    const element = document.getElementById('loadingContainer');
    element.classList.add('hidden');

    renderMenu();
    const onePlayerText = menuContainer.getChildByName('onePlayerText');
    const twoPlayerText = menuContainer.getChildByName('twoPlayerText');

    // Add event listeners to the menu text
    onePlayerText.on('click', () => {
        app.stage.removeChild(menuContainer);
        startPlaying({mode: 'onePlayer'});
    });

    twoPlayerText.on('click', () => {
        app.stage.removeChild(menuContainer);
        startPlaying({mode: 'twoPlayer'});
    });
}

function startPlaying(selectedSettings: IGameSettings): void {
    setState(play);
    updateSettings(selectedSettings);
    addGraphicsToApp();

    app.ticker.add((delta) => currentState(delta));
}

function addGraphicsToApp(): void {
    createPaddles(100, window.innerWidth - 100);
    createBall();
    createCenterLine();
    createScores();
}
