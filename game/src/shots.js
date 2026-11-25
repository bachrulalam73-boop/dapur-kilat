import { addIngredient, addOrder, clearAssembly, createWorld, serveReady, startShift } from './world.js';

export function makeShotState(name, seed = 34261119) {
  const world = createWorld(seed);
  world.phase = 'playing';
  world.shift = 94;
  world.elapsed = 21;
  world.score = 286;
  world.coins = 286;
  world.combo = 3;
  world.level = 2;
  world.feedback = 'Gercep! Pesanan hangat menunggu di meja.';
  world.feedbackTime = 99;
  world.random = (() => { let s = Number(seed) >>> 0 || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; })();
  if (name === 'start') {
    world.orders = []; world.selectedOrder = null;
    addOrder(world, 'nasigoreng'); addOrder(world, 'mieayam');
    world.phase = 'title';
  } else if (name === 'play') {
    world.orders = []; world.selectedOrder = null;
    addOrder(world, 'nasigoreng'); addOrder(world, 'mieayam');
    world.selectedOrder = world.orders[0].id;
    world.assembly = ['nasi', 'telur'];
    world.feedback = 'Sip! Nasi dan telur sudah masuk. Tambah kecap!';
  } else if (name === 'serve') {
    world.orders = []; world.selectedOrder = null;
    addOrder(world, 'nasigoreng'); addOrder(world, 'sateayam');
    world.selectedOrder = world.orders[0].id;
    world.ready = { dishId: 'nasigoreng', orderId: world.orders[0].id };
    world.feedback = 'Aromanya mantap! Satu piring Nasi Goreng siap diantar.';
  } else if (name === 'end') {
    world.phase = 'ended'; world.score = 742; world.coins = 684; world.best = 810; world.bestCombo = 7; world.combo = 0; world.lives = 0;
    world.feedback = 'Pelanggan keburu pulang. Coba lagi, koki!';
    world.orders = []; world.selectedOrder = null;
    addOrder(world, 'mieayam');
  }
  return world;
}

export function shotNameFromUrl() {
  const params = new URLSearchParams(location.search);
  const value = params.get('shot');
  return ['start', 'play', 'serve', 'end'].includes(value) ? value : null;
}

export function screenshotControls(world) {
  return {
    begin: () => startShift(world),
    ingredient: id => addIngredient(world, id),
    clear: () => clearAssembly(world),
    serve: () => serveReady(world)
  };
}
