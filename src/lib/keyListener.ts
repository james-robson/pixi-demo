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
