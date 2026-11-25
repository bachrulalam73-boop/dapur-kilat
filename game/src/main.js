import { createAudio } from './audio.js';
import { connectInput } from './input.js';
import { HEIGHT, WIDTH } from './config.js';
import { renderGame } from './render.js';
import { makeShotState, shotNameFromUrl } from './shots.js';
import { createWorld, updateWorld } from './world.js';

const canvas = document.querySelector('#kitchen');
const context = canvas.getContext('2d', { alpha: false });
const shot = shotNameFromUrl();
const seed = Number(new URLSearchParams(location.search).get('seed') || 34261119);
const world = shot ? makeShotState(shot, seed) : createWorld(seed || Date.now());
const audio = createAudio();

function draw() { renderGame(context, world); }
connectInput(canvas, world, audio, draw);

let previous = performance.now();
function frame(now) {
  const dt = (now - previous) / 1000;
  previous = now;
  if (!shot) updateWorld(world, dt);
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.dapurKilat = { world, render: draw, canvas, logicalSize: { width: WIDTH, height: HEIGHT } };
