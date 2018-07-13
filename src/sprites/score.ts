import { app } from '../lib/app';

const textSettings = {fontFamily : 'Press Start 2P', fontSize: 72, fill : 0xffffff, align : 'center'};
const playerOneScoreText = new PIXI.Text('0', textSettings);
const playerTwoScoreText = new PIXI.Text('0', textSettings);

export function renderScores(): void {
    playerTwoScoreText.anchor.set(0.5, 0.5);
    playerTwoScoreText.position.set(window.innerWidth / 4, 100);

    playerOneScoreText.anchor.set(0.5, 0.5);
    playerOneScoreText.position.set((window.innerWidth / 4) * 3, 100);

    app.stage.addChild(playerTwoScoreText);
    app.stage.addChild(playerOneScoreText);
}

export function updateScores(playerOneScore: number, playerTwoScore: number): void {
    playerOneScoreText.text = playerOneScore.toString();
    playerTwoScoreText.text = playerTwoScore.toString();
}
