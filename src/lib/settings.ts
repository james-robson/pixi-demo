export let settings: IGameSettings;

export function updateSettings(newSettings: IGameSettings): void {
    settings = newSettings;
}

export interface IGameSettings {
    mode: 'onePlayer' | 'twoPlayer';
}
