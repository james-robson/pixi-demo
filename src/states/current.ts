export let currentState: ((delta: number) => void);

export function setState(newState: (delta: number) => void): void {
    currentState = newState;
}
