import { INGREDIENTS } from './config.js';
import { addIngredient, clearAssembly, selectOrder, serveReady, startShift } from './world.js';

export function connectInput(canvas, world, audio, renderNow = () => {}) {
  const point = event => {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  };
  const ingredientBounds = () => {
    const d = world.orders.find(order => order.id === world.selectedOrder);
    const active = d ? INGREDIENTS.filter(item => importDish(world, d.dishId).ingredients.includes(item.id)) : INGREDIENTS;
    return active.map((item, index) => ({ item, x: 30 + (index % 7) * 106, y: 588 + Math.floor(index / 7) * 83 }));
  };
  const click = event => {
    const { x, y } = point(event);
    if (world.phase === 'title') { if (inside(x, y, 850, 540, 350, 90)) { startShift(world); audio.play('click'); renderNow(); } return; }
    if (world.phase === 'ended') { if (inside(x, y, 480, 515, 320, 80)) { startShift(world); audio.play('click'); renderNow(); } return; }
    if (inside(x, y, 1170, 102, 76, 48)) { world.muted = audio.toggle(); audio.play('click'); renderNow(); return; }
    if (inside(x, y, 1102, 410, 128, 87)) { clearAssembly(world); audio.play('click'); renderNow(); return; }
    if (world.ready && inside(x, y, 850, 385, 240, 180)) { if (serveReady(world)) audio.play('serve'); renderNow(); return; }
    for (let i = 0; i < 3; i++) {
      const order = world.orders[i];
      if (order && inside(x, y, 54, 84 + i * 91, 365, 87)) { selectOrder(world, order.id); audio.play('click'); renderNow(); return; }
    }
    for (const slot of ingredientBounds()) {
      if (inside(x, y, slot.x, slot.y, 98, 72)) {
        const result = addIngredient(world, slot.item.id);
        audio.play(result.type === 'added' ? (world.cooking ? 'cook' : 'add') : 'fail');
        renderNow(); return;
      }
    }
  };
  const keydown = event => {
    if (event.repeat) return;
    if (event.code === 'Space') { event.preventDefault(); if (serveReady(world)) audio.play('serve'); renderNow(); return; }
    if (event.key.toLowerCase() === 'm') { world.muted = audio.toggle(); audio.play('click'); renderNow(); return; }
    if (event.key.toLowerCase() === 'x' || event.key === 'Backspace') { clearAssembly(world); audio.play('click'); renderNow(); return; }
    if (event.key.toLowerCase() === 'r') { startShift(world); audio.play('click'); renderNow(); return; }
    if (world.phase === 'title' && (event.key === 'Enter' || event.code === 'Space')) { startShift(world); audio.play('click'); renderNow(); return; }
    const item = INGREDIENTS.find(part => part.key && part.key === event.key);
    if (item) { const result = addIngredient(world, item.id); audio.play(result.type === 'added' ? (world.cooking ? 'cook' : 'add') : 'fail'); renderNow(); }
  };
  canvas.addEventListener('pointerdown', click);
  window.addEventListener('keydown', keydown);
  return () => { canvas.removeEventListener('pointerdown', click); window.removeEventListener('keydown', keydown); };
}

function inside(x, y, left, top, width, height) { return x >= left && x <= left + width && y >= top && y <= top + height; }
function importDish(world, id) { return world.dishes?.find(item => item.id === id) || dishLookup(id); }
function dishLookup(id) {
  return ({
    nasigoreng: { ingredients: ['nasi', 'telur', 'kecap'] },
    mieayam: { ingredients: ['mie', 'ayam', 'sayur', 'bawang'] },
    sateayam: { ingredients: ['sate', 'bumbu', 'lontong'] },
    esteh: { ingredients: ['teh', 'gula', 'es'] }
  })[id];
}
