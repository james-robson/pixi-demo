import { app, createApplication } from 'app';
import { IGameSettings, updateSettings } from 'settings';
import { createBall, createCenterLine, createPaddles, createScores, menuContainer, renderMenu } from 'sprites';
import { currentState, play, setState } from 'states';
import * as WebFont from 'webfontloader';

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
