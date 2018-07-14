export class KeyListener {
    public isDown: boolean = false;
    public isUp: boolean =  true;

    private code: number;

    constructor(keyCode: number) {
        this.code = keyCode;
        // Attach event listeners
        window.addEventListener(
            'keydown', this.downHandler.bind(this), false
        );
        window.addEventListener(
            'keyup', this.upHandler.bind(this), false
        );
    }

    private downHandler = (event: KeyboardEvent) => {
        if (event.keyCode === this.code) {
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
      }

      // The `upHandler`
    private upHandler = (event: KeyboardEvent) => {
        if (event.keyCode === this.code) {
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    }
}

export const playerTwoKeyboardUp = new KeyListener(87); // W key
export const playerTwoKeyboardDown = new KeyListener(83); // S key
export const playerOneKeyboardUp = new KeyListener(38); // Up arrow
export const playerOneKeyboardDown = new KeyListener(40); // Down arrow
