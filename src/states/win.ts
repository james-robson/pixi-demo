import { app } from 'app';
import { scores } from 'sprites';

export function win (): void {
    const winningPlayer = (scores.getScore('playerOne') === 10) ? 'ONE' : 'TWO';
    const winText = new PIXI.Text(`PLAYER ${winningPlayer} WINS!`, {fontFamily : 'Press Start 2P', fontSize: 52, fill : 0xffffff, align : 'center'});
    winText.anchor.set(0.5, 0.5);
    winText.position.set(window.innerWidth / 2, window.innerHeight / 2);
    app.stage.addChild(winText);
}
