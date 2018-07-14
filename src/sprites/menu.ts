import { app } from 'app';

export const menuContainer = new PIXI.Container();

const textSettings = {
    fontFamily : 'Press Start 2P',
    fontSize: 52, fill : 0xffffff,
    align : 'center'
};

const menuTitle = new PIXI.Text(`PIXI PADDLES`, textSettings);
const onePlayerText = new PIXI.Text(`1 PLAYER`, textSettings);
const twoPlayerText = new PIXI.Text(`2 PLAYER`, textSettings);

export function renderMenu(): void {
    menuContainer.height = window.innerHeight;
    menuContainer.width = window.innerWidth;

    onePlayerText.interactive = true;
    onePlayerText.buttonMode = true;
    onePlayerText.name = 'onePlayerText';

    twoPlayerText.interactive = true;
    twoPlayerText.buttonMode = true;
    twoPlayerText.name = 'twoPlayerText';

    menuTitle.anchor.set(0.5, 0.5);
    onePlayerText.anchor.set(0.5, 0.5);
    twoPlayerText.anchor.set(0.5, 0.5);

    menuTitle.position.set(window.innerWidth / 2, window.innerHeight / 4);
    onePlayerText.position.set(window.innerWidth / 2, window.innerHeight / 2);
    twoPlayerText.position.set(window.innerWidth / 2, window.innerHeight / 1.5);

    menuContainer.addChild(menuTitle);
    menuContainer.addChild(onePlayerText);
    menuContainer.addChild(twoPlayerText);

    app.stage.addChild(menuContainer);
}
