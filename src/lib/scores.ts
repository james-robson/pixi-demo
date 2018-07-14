export class Scores {
    private playerTwoScore: number;
    private playerOneScore: number;

    constructor() {
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
    }

    public getScores(): IScores {
        return {
            playerOneScore: this.playerOneScore,
            playerTwoScore: this.playerTwoScore
        };
    }

    public incrementScore(player: IPlayer): void {
        if (player === 'playerOne') {
            this.playerOneScore++;
        } else if (player === 'playerTwo') {
            this.playerTwoScore++;
        }
    }
}

export interface IScores {
    playerOneScore: number;
    playerTwoScore: number;
}

export type IPlayer = 'playerOne' | 'playerTwo';
