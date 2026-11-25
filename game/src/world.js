import { DIFFICULTY, DISHES, dish } from './config.js';
import { choose, seededRandom } from './random.js';

export function createWorld(seed = Date.now()) {
  return {
    random: seededRandom(seed), phase: 'title', orders: [], selectedOrder: null, assembly: [], cooking: null, ready: null,
    score: 0, coins: 0, combo: 0, bestCombo: 0, level: 1, lives: 3, shift: DIFFICULTY.shiftSeconds,
    elapsed: 0, spawnAt: 0, nextOrderId: 1, feedback: 'Pilih pesanan, lalu racik bahan di meja.', feedbackTime: 3,
    angry: 0, best: Number(localStorage.getItem('dapurKilatBest') || 0), muted: false, particles: [],
    lastTime: 0, flash: 0
  };
}

export function addOrder(world, forcedId) {
  if (world.orders.length >= 3 || world.phase !== 'playing') return null;
  const chosen = forcedId ? dish(forcedId) : choose(world.random, DISHES);
  const duration = Math.max(DIFFICULTY.orderMin, DIFFICULTY.orderBase - (world.level - 1) * 2.2);
  const order = { id: world.nextOrderId++, dishId: chosen.id, remaining: duration, duration, born: world.elapsed };
  world.orders.push(order);
  if (!world.selectedOrder) world.selectedOrder = order.id;
  return order;
}

export function startShift(world) {
  world.phase = 'playing';
  world.elapsed = 0;
  world.shift = DIFFICULTY.shiftSeconds;
  world.spawnAt = DIFFICULTY.firstOrder;
  world.orders = [];
  world.selectedOrder = null;
  world.assembly = [];
  world.cooking = null;
  world.ready = null;
  world.score = 0;
  world.coins = 0;
  world.combo = 0;
  world.level = 1;
  world.lives = 3;
  world.feedback = 'Pesanan masuk! Gercep, ya!';
  world.feedbackTime = 2.5;
  world.angry = 0;
  addOrder(world);
}

export function selectedOrder(world) {
  return world.orders.find(order => order.id === world.selectedOrder) || world.orders[0] || null;
}

export function selectedDish(world) {
  const order = selectedOrder(world);
  return order ? dish(order.dishId) : null;
}

export function selectOrder(world, id) {
  if (!world.orders.some(order => order.id === id)) return;
  world.selectedOrder = id;
  world.assembly = [];
  world.feedback = `${dish(world.orders.find(order => order.id === id).dishId).name} dipilih. Racik bahannya!`;
  world.feedbackTime = 2.1;
}

export function addIngredient(world, id) {
  if (world.phase !== 'playing' || world.cooking || world.ready) return { type: 'blocked' };
  const order = selectedOrder(world);
  if (!order) {
    world.feedback = 'Tunggu pesanan baru datang.';
    world.feedbackTime = 1.6;
    return { type: 'wrong' };
  }
  const recipe = dish(order.dishId).ingredients;
  if (!recipe.includes(id) || world.assembly.includes(id)) {
    order.remaining = Math.max(0, order.remaining - 3.5);
    world.feedback = 'Bahan keliru! Buang racikan atau cek resep.';
    world.feedbackTime = 2;
    world.flash = 0.22;
    return { type: 'wrong' };
  }
  world.assembly.push(id);
  world.feedback = world.assembly.length === recipe.length ? 'Mantap! Masuk ke wajan…' : 'Sip! Bahan masuk ke racikan.';
  world.feedbackTime = 1.4;
  if (world.assembly.length === recipe.length) {
    world.cooking = { dishId: order.dishId, orderId: order.id, progress: 0, duration: dish(order.dishId).cook };
    world.assembly = [];
  }
  return { type: 'added' };
}

export function clearAssembly(world) {
  if (world.assembly.length) {
    world.assembly = [];
    world.feedback = 'Racikan dibuang. Mulai lagi, jangan panik!';
    world.feedbackTime = 2;
  }
}

export function serveReady(world) {
  if (!world.ready || world.phase !== 'playing') return false;
  const plate = world.ready;
  const order = world.orders.find(item => item.id === plate.orderId);
  if (!order) {
    world.feedback = 'Pelanggan sudah pergi — sajian tak terpakai.';
    world.feedbackTime = 2.5;
    world.ready = null;
    return false;
  }
  const speedTip = Math.max(0, Math.floor(order.remaining * 0.35));
  const comboBonus = Math.min(20, world.combo * 3);
  const earned = dish(plate.dishId).price + speedTip + comboBonus;
  world.score += earned;
  world.coins += earned;
  world.combo++;
  world.bestCombo = Math.max(world.bestCombo, world.combo);
  world.feedback = `Piring bersih! +${earned} koin  •  ${world.combo}× kombo`;
  world.feedbackTime = 2.8;
  world.particles.push({ x: 790, y: 483, life: 1, text: `+${earned}`, color: '#fff0a6' });
  world.orders = world.orders.filter(item => item.id !== order.id);
  world.selectedOrder = world.orders[0]?.id ?? null;
  world.assembly = [];
  world.ready = null;
  return true;
}

function failOrder(world, order) {
  world.orders = world.orders.filter(item => item.id !== order.id);
  if (world.selectedOrder === order.id) {
    world.selectedOrder = world.orders[0]?.id ?? null;
    world.assembly = [];
  }
  world.lives--;
  world.combo = 0;
  world.angry = 1.5;
  world.feedback = 'Pelanggan marah! Pesanan keburu dingin.';
  world.feedbackTime = 2.7;
  world.flash = 0.5;
  if (world.lives <= 0) {
    world.phase = 'ended';
    world.best = Math.max(world.best, world.score);
    localStorage.setItem('dapurKilatBest', String(world.best));
  }
}

export function updateWorld(world, dt) {
  if (world.phase !== 'playing') return;
  dt = Math.min(dt, 0.1);
  world.elapsed += dt;
  world.shift = Math.max(0, world.shift - dt);
  world.level = 1 + Math.floor(world.score / 150);
  world.feedbackTime = Math.max(0, world.feedbackTime - dt);
  world.angry = Math.max(0, world.angry - dt);
  world.flash = Math.max(0, world.flash - dt);
  world.spawnAt -= dt;
  if (world.spawnAt <= 0) {
    if (world.orders.length < Math.min(3, 2 + Math.floor((world.level - 1) / 2))) addOrder(world);
    world.spawnAt = Math.max(6, DIFFICULTY.interval - (world.level - 1) * 0.8);
  }
  for (const order of [...world.orders]) {
    order.remaining -= dt;
    if (order.remaining <= 0) failOrder(world, order);
    if (world.phase !== 'playing') return;
  }
  if (world.cooking) {
    world.cooking.progress += dt * DIFFICULTY.cookSpeed;
    if (world.cooking.progress >= world.cooking.duration) {
      world.ready = { dishId: world.cooking.dishId, orderId: world.cooking.orderId };
      world.cooking = null;
      world.feedback = 'Siap saji! Klik piring atau tekan Space.';
      world.feedbackTime = 4;
    }
  }
  world.particles = world.particles.filter(particle => (particle.life -= dt) > 0);
  if (world.shift <= 0 && world.phase === 'playing') {
    world.phase = 'ended';
    world.best = Math.max(world.best, world.score);
    localStorage.setItem('dapurKilatBest', String(world.best));
  }
}
