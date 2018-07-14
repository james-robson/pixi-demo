import { app } from '../lib/app';

export let scores: Scores;

const textSettings = {fontFamily : 'Press Start 2P', fontSize: 72, fill : 0xffffff, align : 'center'};

export class Scores {
    private playerTwoScore: number;
    private playerOneScore: number;
    private playerOneScoreText: PIXI.Text;
    private playerTwoScoreText: PIXI.Text;

    constructor() {
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.playerOneScoreText = new PIXI.Text(this.playerOneScore.toString(), textSettings);
        this.playerTwoScoreText = new PIXI.Text(this.playerTwoScore.toString(), textSettings);

        this.playerOneScoreText.anchor.set(0.5, 0.5);
        this.playerOneScoreText.position.set(window.innerWidth / 4, 100);

        this.playerTwoScoreText.anchor.set(0.5, 0.5);
        this.playerTwoScoreText.position.set((window.innerWidth / 4) * 3, 100);

        app.stage.addChild(this.playerOneScoreText);
        app.stage.addChild(this.playerTwoScoreText);
    }

    public incrementScore(player: IPlayer): void {
        if (player === 'playerOne') {
            this.playerOneScore++;
        } else if (player === 'playerTwo') {
            this.playerTwoScore++;
        }

        this.playerOneScoreText.text = this.playerOneScore.toString();
        this.playerTwoScoreText.text = this.playerTwoScore.toString();
    }

    public getScore(player: IPlayer): number {
        if (player === 'playerOne') {
            return this.playerOneScore;
        } else if (player === 'playerTwo') {
            return this.playerTwoScore;
        }
    }
}

export function createScores(): void {
    scores = new Scores();
}

export type IPlayer = 'playerOne' | 'playerTwo';
