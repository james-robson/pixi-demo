import * as PIXI from 'pixi.js';

function createPixiCanvas(): HTMLCanvasElement {
  const canvas = new PIXI.Application({ width: 640, height: 360 });
  return canvas.view;
}

document.body.appendChild(createPixiCanvas());
