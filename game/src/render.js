import { COLORS as C, DISHES, HEIGHT, INGREDIENTS, WIDTH, dish, ingredient } from './config.js';
import { selectedDish, selectedOrder } from './world.js';

const rounded = (ctx, x, y, w, h, r, fill, stroke = null, line = 1) => {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = line; ctx.strokeStyle = stroke; ctx.stroke(); }
};
const text = (ctx, value, x, y, size, color = C.ink, weight = 700, align = 'left') => {
  ctx.fillStyle = color; ctx.font = `${weight} ${size}px system-ui, sans-serif`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(value, x, y);
};
const line = (ctx, x1, y1, x2, y2, color, width = 1) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); };

function drawLamp(ctx, x, y) {
  line(ctx, x, 0, x, y - 23, '#654337', 4);
  ctx.beginPath(); ctx.moveTo(x - 52, y - 19); ctx.lineTo(x - 34, y + 11); ctx.lineTo(x + 34, y + 11); ctx.lineTo(x + 52, y - 19); ctx.closePath(); ctx.fillStyle = '#d78a49'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + 10, 34, 7, 0, 0, Math.PI * 2); ctx.fillStyle = '#ffd77b'; ctx.fill();
  ctx.save(); const glow = ctx.createRadialGradient(x, y + 20, 5, x, y + 130, 140); glow.addColorStop(0, '#ffd77830'); glow.addColorStop(1, '#ffd77800'); ctx.fillStyle = glow; ctx.fillRect(x - 145, y, 290, 220); ctx.restore();
}

function drawKitchen(ctx, world) {
  ctx.fillStyle = C.wall; ctx.fillRect(0, 0, WIDTH, 800);
  ctx.fillStyle = '#e7c28a'; ctx.fillRect(0, 0, WIDTH, 183);
  for (let y = 18; y < 184; y += 42) for (let x = (y % 84 ? 0 : 53); x < WIDTH; x += 106) {
    rounded(ctx, x + 3, y + 3, 98, 34, 6, '#f5d8a8', '#ddb67e', 1.5);
    ctx.beginPath(); ctx.arc(x + 49, y + 20, 7, Math.PI, Math.PI * 2); ctx.strokeStyle = '#dfbb88'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = '#a95e42'; ctx.fillRect(0, 180, WIDTH, 13);
  drawLamp(ctx, 300, 88); drawLamp(ctx, 967, 88);
  // Hanging herb bundles add a lived-in warung silhouette.
  for (const [x, y] of [[105, 171], [1110, 164]]) {
    line(ctx, x, 142, x, y, '#674936', 2);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(x + Math.sin(i * 2) * 12, y - 12 + i * 7, 6, 15, i * .55, 0, Math.PI * 2); ctx.fillStyle = i % 2 ? '#5d8155' : '#78965e'; ctx.fill(); }
  }
  // Deep kitchen alcove and stove.
  rounded(ctx, 454, 191, 373, 197, 18, '#594137'); rounded(ctx, 471, 207, 339, 163, 12, '#49342f');
  rounded(ctx, 490, 219, 300, 129, 8, '#2d2725');
  ctx.fillStyle = '#794235'; ctx.fillRect(0, 383, WIDTH, 24);
  for (let x = 18; x < WIDTH; x += 94) { line(ctx, x, 387, x + 68, 387, '#bd7852', 2); }
  // Stove work area.
  rounded(ctx, 482, 361, 321, 152, 14, '#4e3830', '#c2794b', 3);
  rounded(ctx, 504, 378, 277, 109, 11, '#292523', '#765044', 3);
  for (const x of [552, 730]) {
    ctx.beginPath(); ctx.arc(x, 431, 31, 0, Math.PI * 2); ctx.fillStyle = '#44312b'; ctx.fill();
    ctx.beginPath(); ctx.arc(x, 431, 23, 0, Math.PI * 2); ctx.strokeStyle = world.cooking ? '#f1a948' : '#88604a'; ctx.lineWidth = 5; ctx.stroke();
    if (world.cooking) { ctx.beginPath(); ctx.arc(x, 431, 13 + Math.sin(world.elapsed * 14) * 3, 0, Math.PI * 2); ctx.fillStyle = '#e78036'; ctx.fill(); }
  }
  rounded(ctx, 37, 426, 238, 72, 13, '#79513e', '#d4925b', 2);
  text(ctx, 'DAPUR TERBUKA', 57, 445, 11, '#f7d28e', 800);
  text(ctx, 'Masak sepenuh hati,', 57, 467, 12, '#fff0d0', 700);
  text(ctx, 'sajikan selagi hangat.', 57, 484, 12, '#fff0d0', 700);
  ctx.fillStyle = '#bf8d5b'; ctx.fillRect(0, 510, WIDTH, 31);
  ctx.fillStyle = '#a46b48'; ctx.fillRect(0, 541, WIDTH, 16);
  ctx.fillStyle = '#694332'; ctx.fillRect(0, 557, WIDTH, 243);
  for (let y = 568; y < 795; y += 56) { line(ctx, 0, y, WIDTH, y, '#7b5038', 3); }
  for (let x = 70; x < WIDTH; x += 170) line(ctx, x, 559, x, 800, '#774a35', 2);
  // Counter edge highlight.
  ctx.fillStyle = '#d09a62'; ctx.fillRect(0, 509, WIDTH, 8);
}

function drawMiniIngredient(ctx, id, x, y, scale = 1) {
  const item = ingredient(id); if (!item) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  const fill = item.color;
  if (item.kind === 'rice') {
    ctx.fillStyle = '#fff7e7'; ctx.beginPath(); ctx.ellipse(0, 1, 13, 8, -.15, 0, Math.PI * 2); ctx.fill();
    for (const [dx, dy] of [[-5, 0], [2, -3], [6, 2], [-1, 4]]) { ctx.beginPath(); ctx.ellipse(dx, dy, 2.8, 1.4, -.4, 0, Math.PI * 2); ctx.fillStyle = '#e3d8c2'; ctx.fill(); }
  } else if (item.kind === 'egg') {
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 10, -.2, 0, Math.PI * 2); ctx.fillStyle = '#fff4d4'; ctx.fill(); ctx.beginPath(); ctx.arc(1, 0, 5.5, 0, Math.PI * 2); ctx.fillStyle = '#efa93c'; ctx.fill();
  } else if (item.kind === 'sauce' || item.kind === 'peanut' || item.kind === 'tea') {
    rounded(ctx, -8, -12, 16, 24, 4, item.kind === 'tea' ? '#d8ece2' : '#d7b783', '#80533b', 1.5); rounded(ctx, -5, -8, 10, 15, 3, fill); ctx.fillStyle = '#66503b'; ctx.fillRect(-4, -15, 8, 4);
  } else if (item.kind === 'noodle') {
    ctx.strokeStyle = fill; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-11, -7 + i * 4); ctx.bezierCurveTo(-2, -13 + i * 4, 1, 4 + i * 3, 10, -5 + i * 4); ctx.stroke(); }
  } else if (item.kind === 'chicken' || item.kind === 'satay') {
    ctx.strokeStyle = item.kind === 'satay' ? '#d8ba82' : '#9b5e40'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-13, 9); ctx.lineTo(13, -8); ctx.stroke();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-7 + i * 8, 5 - i * 5, 5, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
  } else if (item.kind === 'greens') {
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(-7 + i * 5, 2 - (i % 2) * 5, 6, 10, -.5 + i * .3, 0, Math.PI * 2); ctx.fillStyle = i % 2 ? '#91ad68' : fill; ctx.fill(); }
  } else if (item.kind === 'onion') {
    ctx.beginPath(); ctx.ellipse(0, 1, 11, 9, 0, 0, Math.PI * 2); ctx.fillStyle = '#f3d9a0'; ctx.fill(); ctx.strokeStyle = '#bf9c68'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 1, 5, 0, Math.PI * 2); ctx.stroke();
  } else if (item.kind === 'cake') {
    rounded(ctx, -11, -9, 22, 18, 5, fill, '#b3a580', 1.5); line(ctx, -8, -2, 8, -2, '#c5bb9e', 1.5);
  } else if (item.kind === 'sugar') {
    for (const [dx, dy] of [[-7, 1], [4, -3], [2, 6]]) { rounded(ctx, dx - 5, dy - 6, 10, 10, 2, '#fff8e7', '#d5c6a6', 1); }
  } else if (item.kind === 'ice') {
    ctx.fillStyle = '#b8e0de'; ctx.strokeStyle = '#6faeb1'; ctx.lineWidth = 1.5;
    for (const [dx, dy] of [[-7, 1], [5, -3], [3, 7]]) { ctx.beginPath(); ctx.moveTo(dx - 5, dy - 4); ctx.lineTo(dx + 3, dy - 6); ctx.lineTo(dx + 7, dy + 1); ctx.lineTo(dx, dy + 6); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  }
  ctx.restore();
}

function drawOrderBoard(ctx, world) {
  rounded(ctx, 34, 28, 407, 351, 19, '#5c372d', '#d69a5e', 3);
  rounded(ctx, 47, 42, 381, 321, 12, '#f5dfb6', '#b4774b', 2);
  text(ctx, 'PAPAN PESANAN', 66, 67, 18, C.ink, 900);
  rounded(ctx, 332, 50, 77, 29, 14, '#48745a'); text(ctx, `LV ${world.level}`, 370, 65, 12, '#fff3d7', 900, 'center');
  const slots = 3, rowY = 88, rowH = 86;
  for (let i = 0; i < slots; i++) {
    const y = rowY + i * 91;
    const order = world.orders[i];
    if (!order) {
      rounded(ctx, 60, y, 352, rowH, 10, '#ead2a8', '#d9bb8d', 1);
      text(ctx, 'MENUNGGU PELANGGAN BARU', 236, y + 42, 13, '#9b795a', 800, 'center');
      continue;
    }
    const d = dish(order.dishId); const active = order.id === world.selectedOrder;
    rounded(ctx, 60, y, 352, rowH, 10, active ? '#fff3d4' : '#f8e8c9', active ? '#df8b43' : '#d9bf94', active ? 3 : 1.5);
    rounded(ctx, 70, y + 11, 43, 42, 9, d.color); drawMiniIngredient(ctx, d.ingredients[0], 91, y + 33, .88);
    text(ctx, d.name, 123, y + 21, 16, C.ink, 850);
    text(ctx, `${d.tag}  ·  #${order.id}`, 124, y + 43, 9, '#936b4b', 800);
    let ix = 125;
    for (const ing of d.ingredients) { drawMiniIngredient(ctx, ing, ix, y + 65, .5); ix += 27; }
    text(ctx, `${Math.ceil(order.remaining)}s`, 391, y + 20, 13, order.remaining < 12 ? '#c34d3d' : '#614438', 900, 'right');
    rounded(ctx, 314, y + 34, 83, 7, 4, '#ddc9a8');
    rounded(ctx, 314, y + 34, Math.max(2, 83 * order.remaining / order.duration), 7, 4, order.remaining < 12 ? '#d55443' : '#76a06a');
    text(ctx, `${d.price} k`, 390, y + 62, 10, '#638451', 850, 'right');
  }
  text(ctx, 'KLIK TIKET UNTUK PILIH', 65, 351, 9, '#8f704f', 800);
}

function drawHud(ctx, world) {
  rounded(ctx, 462, 26, 784, 69, 18, '#55362d', '#cf8f56', 2);
  const labels = [
    ['SKOR', String(world.score).padStart(4, '0'), 513, '#ffe0a0'],
    ['KOIN', `◉ ${world.coins}`, 655, '#f6c85f'],
    ['KOMBO', `${world.combo}×`, 793, '#f09a55'],
    ['LEVEL', String(world.level), 928, '#a6c38a'],
    ['SHIFT', `${Math.ceil(world.shift)}s`, 1090, '#fff0d0']
  ];
  for (const [label, value, x, color] of labels) { text(ctx, label, x, 46, 9, '#e4c49a', 900, 'center'); text(ctx, value, x, 72, 22, color, 900, 'center'); }
  text(ctx, 'NYAWA', 1194, 45, 9, '#e4c49a', 900, 'center');
  for (let i = 0; i < 3; i++) { const x = 1170 + i * 23; drawHeart(ctx, x, 70, 8, i < world.lives ? '#ed775d' : '#80544a'); }
  rounded(ctx, 1177, 109, 58, 31, 15, '#f7e1b8', '#b57a4e', 1.5);
  text(ctx, world.muted ? '♪ ×' : '♪ ON', 1206, 125, 11, '#5d4435', 900, 'center');
}

function drawHeart(ctx, x, y, r, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(r / 10, r / 10); ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-18, -3, -10, -15, 0, -7); ctx.bezierCurveTo(10, -15, 18, -3, 0, 8); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}

function drawRecipeCard(ctx, world) {
  const d = selectedDish(world);
  rounded(ctx, 849, 167, 394, 215, 16, '#fff0d2', '#bd8050', 2);
  text(ctx, 'RESEP ANDALAN', 873, 193, 12, '#8a563d', 900);
  if (!d) { text(ctx, 'Pilih tiket untuk melihat resep', 1045, 260, 17, '#8b705b', 700, 'center'); return; }
  rounded(ctx, 1118, 179, 105, 25, 12, d.color);
  text(ctx, d.tag, 1170, 192, 9, '#fff8e9', 900, 'center');
  text(ctx, d.name, 873, 229, 25, C.ink, 900);
  text(ctx, 'Sentuh bahan dengan urutan bebas', 873, 254, 12, '#94704e', 650);
  let x = 875;
  for (const id of d.ingredients) {
    rounded(ctx, x, 273, 81, 75, 11, '#f5dfb6', '#dfc497', 1.2);
    drawMiniIngredient(ctx, id, x + 40, 300, 1);
    text(ctx, ingredient(id).name, x + 40, 332, 9, '#634939', 800, 'center');
    x += 87;
  }
  text(ctx, 'BUANG RACIKAN', 1185, 363, 9, '#a05443', 900, 'right');
}

function drawFoodOnPlate(ctx, dishId, x, y, scale = 1, progress = null, time = 0) {
  const d = dish(dishId); if (!d) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.beginPath(); ctx.ellipse(0, 12, 101, 44, 0, 0, Math.PI * 2); ctx.fillStyle = '#b7a17e'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, 99, 42, 0, 0, Math.PI * 2); ctx.fillStyle = '#fff8e8'; ctx.fill(); ctx.strokeStyle = '#d8c9aa'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, 79, 31, 0, 0, Math.PI * 2); ctx.fillStyle = '#eee1c5'; ctx.fill();
  const ingredients = d.ingredients;
  if (dishId === 'nasigoreng') {
    for (let i = 0; i < 34; i++) { const a = i * 2.4, r = Math.sqrt(i / 34) * 51; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r, Math.sin(a) * r * .57, 8, 4, a, 0, Math.PI * 2); ctx.fillStyle = ['#e5bb72', '#d79a4c', '#f1d18b'][i % 3]; ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(5, -4, 23, 15, -.2, 0, Math.PI * 2); ctx.fillStyle = '#fff2d2'; ctx.fill(); ctx.beginPath(); ctx.arc(5, -4, 8, 0, Math.PI * 2); ctx.fillStyle = '#efa83d'; ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-47 + i * 15, 17 - (i % 2) * 9, 3, 0, Math.PI * 2); ctx.fillStyle = '#709154'; ctx.fill(); }
  } else if (dishId === 'mieayam') {
    ctx.strokeStyle = '#d9a943'; ctx.lineWidth = 4; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(-5, -1, 53 - i * 4, 23 - i * 1.4, i * .12, .3, Math.PI * 2 + .1); ctx.stroke(); }
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(-35 + (i % 3) * 23, -8 + Math.floor(i / 3) * 14, 8, 6, -.3, 0, Math.PI * 2); ctx.fillStyle = '#c48352'; ctx.fill(); }
    ctx.fillStyle = '#749456'; ctx.fillRect(30, -16, 7, 17); ctx.fillRect(41, -5, 7, 15);
  } else if (dishId === 'sateayam') {
    for (let row = 0; row < 3; row++) { ctx.strokeStyle = '#d1a775'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-52, -14 + row * 15); ctx.lineTo(53, -14 + row * 15); ctx.stroke(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.roundRect(-42 + i * 20, -19 + row * 15, 15, 10, 4); ctx.fillStyle = ['#b9663a', '#d28648'][i % 2]; ctx.fill(); } }
    ctx.fillStyle = '#b97a3f'; ctx.beginPath(); ctx.ellipse(3, 17, 33, 10, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 3; i++) { rounded(ctx, -52 + i * 18, 17, 14, 13, 4, '#e5dbc1'); }
  } else {
    rounded(ctx, -25, -27, 50, 56, 10, '#d1a05c', '#ad7948', 2); rounded(ctx, -20, -22, 40, 43, 8, '#b66338');
    for (const [ix, iy] of [[-11, -2], [3, 7], [12, -7]]) { ctx.save(); ctx.translate(ix, iy); ctx.rotate(.2); rounded(ctx, -7, -6, 14, 12, 3, '#d3e9df', '#8fb7aa', 1); ctx.restore(); }
    ctx.beginPath(); ctx.arc(0, -32, 14, 0, Math.PI * 2); ctx.fillStyle = '#f3e7bf'; ctx.fill();
  }
  if (progress !== null) {
    ctx.globalAlpha = .7; ctx.fillStyle = '#ed8043'; ctx.beginPath(); ctx.ellipse(0, -38 - Math.sin(time * 4) * 5, 4, 13, -.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(18, -42 - Math.sin(time * 3 + 1) * 5, 4, 11, .2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawIngredientCards(ctx, world) {
  const chosen = selectedDish(world); const list = chosen ? chosen.ingredients : ['nasi', 'telur', 'kecap', 'mie', 'ayam', 'sayur', 'bawang', 'sate', 'bumbu', 'lontong', 'teh', 'gula', 'es'];
  const cols = 7, cellW = 98, startX = 30, startY = 588;
  text(ctx, 'BAHAN SEGAR', 34, 570, 11, '#ffe1a9', 900);
  list.forEach((id, index) => {
    const item = ingredient(id), col = index % cols, row = Math.floor(index / cols), x = startX + col * (cellW + 8), y = startY + row * 83;
    const ready = world.assembly.includes(id); const correct = chosen?.ingredients.includes(id);
    rounded(ctx, x, y, cellW, 72, 11, ready ? '#dbebcb' : '#f7e5c4', correct ? '#e9ad55' : '#bd9369', correct ? 2 : 1);
    drawMiniIngredient(ctx, id, x + 27, y + 29, .8);
    text(ctx, item.name, x + 55, y + 26, 10, '#4f382f', 850, 'center');
    text(ctx, item.key ? `[${item.key}]` : 'klik', x + 55, y + 49, 9, '#947456', 750, 'center');
    if (ready) { ctx.beginPath(); ctx.arc(x + 84, y + 10, 7, 0, Math.PI * 2); ctx.fillStyle = '#5e895f'; ctx.fill(); text(ctx, '✓', x + 84, y + 10, 9, 'white', 900, 'center'); }
  });
}

function drawWorkstation(ctx, world) {
  // Pan and assembly zone.
  ctx.save(); ctx.translate(646, 447);
  ctx.beginPath(); ctx.ellipse(0, 23, 123, 48, 0, 0, Math.PI * 2); ctx.fillStyle = '#372824'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 12, 119, 43, 0, 0, Math.PI * 2); ctx.fillStyle = '#7d7e76'; ctx.fill(); ctx.strokeStyle = '#b9a78a'; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 7, 103, 33, 0, 0, Math.PI * 2); ctx.fillStyle = '#3c302a'; ctx.fill();
  if (world.cooking) {
    drawFoodOnPlate(ctx, world.cooking.dishId, 0, 2, .77, world.cooking.progress / world.cooking.duration, world.elapsed);
    rounded(ctx, -94, 63, 188, 10, 5, '#302622'); rounded(ctx, -94, 63, 188 * Math.min(1, world.cooking.progress / world.cooking.duration), 10, 5, '#f5b44d');
    text(ctx, `DIMASAK  ${Math.ceil(world.cooking.duration - world.cooking.progress)}s`, 0, 88, 10, '#ffe4ab', 900, 'center');
  } else if (world.assembly.length) {
    ctx.beginPath(); ctx.ellipse(0, 2, 68, 22, 0, 0, Math.PI * 2); ctx.fillStyle = '#d5c6a7'; ctx.fill();
    world.assembly.forEach((id, i) => drawMiniIngredient(ctx, id, -40 + i * 30, 2 + (i % 2) * 8, .85));
    text(ctx, 'RACIKAN', 0, 60, 10, '#ffdfa1', 900, 'center');
  } else {
    text(ctx, 'Wajan siap', 0, 0, 15, '#e8c28c', 850, 'center');
    text(ctx, 'pilih bahan resep', 0, 22, 10, '#b69a7b', 700, 'center');
  }
  ctx.restore();
  // Serving plate on the front counter.
  const plateX = 969, plateY = 475;
  if (world.ready) {
    rounded(ctx, 858, 391, 221, 168, 14, '#497251', '#a4c27e', 3);
    text(ctx, 'SIAP SAJI!', plateX, 412, 15, '#fff3d1', 950, 'center');
    drawFoodOnPlate(ctx, world.ready.dishId, plateX, plateY, .77);
    text(ctx, 'KLIK PIRING  ·  SPACE', plateX, 544, 9, '#fff3d1', 900, 'center');
  } else {
    ctx.beginPath(); ctx.ellipse(plateX, plateY + 7, 91, 37, 0, 0, Math.PI * 2); ctx.fillStyle = '#a58b6d'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(plateX, plateY, 90, 36, 0, 0, Math.PI * 2); ctx.fillStyle = '#f5ead2'; ctx.fill(); ctx.strokeStyle = '#d2c2a2'; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(plateX, plateY, 70, 24, 0, 0, Math.PI * 2); ctx.strokeStyle = '#e3d6bc'; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'PIRING SAJI', plateX, 527, 9, '#795c45', 900, 'center');
  }
  if (world.cooking) {
    rounded(ctx, 824, 403, 176, 49, 12, '#fff0d2', '#d09358', 2);
    text(ctx, 'WAKTU MASAK', 912, 417, 9, '#825d40', 900, 'center');
    rounded(ctx, 843, 431, 138, 9, 5, '#dbc49d'); rounded(ctx, 843, 431, 138 * world.cooking.progress / world.cooking.duration, 9, 5, '#e89743');
  }
  // Trash control.
  rounded(ctx, 1112, 418, 105, 75, 12, '#d5b78d', '#95674a', 2);
  ctx.fillStyle = '#71503a'; ctx.fillRect(1148, 437, 30, 35); ctx.fillRect(1144, 432, 38, 6); ctx.fillRect(1156, 426, 14, 5);
  line(ctx, 1155, 443, 1155, 467, '#d5b78d', 2); line(ctx, 1170, 443, 1170, 467, '#d5b78d', 2);
  text(ctx, 'BUANG  [X]', 1164, 484, 9, '#594132', 900, 'center');
}

function drawFeedback(ctx, world) {
  rounded(ctx, 306, 518, 668, 35, 17, world.angry ? '#9c493d' : '#654236', world.angry ? '#e39a70' : '#ca8b55', 1.5);
  text(ctx, world.feedback || 'Pilih bahan untuk mulai meracik.', 640, 536, 13, '#fff1d6', 800, 'center');
  if (world.angry > 0) {
    text(ctx, '✕', 834, 449, 45, '#d64f44', 900, 'center');
  }
  if (world.flash > 0) { ctx.fillStyle = `rgba(195,64,49,${world.flash * .18})`; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
  for (const p of world.particles) { ctx.globalAlpha = Math.max(0, p.life); text(ctx, p.text, p.x, p.y - (1 - p.life) * 55, 24, p.color, 950, 'center'); ctx.globalAlpha = 1; }
}

function drawTitle(ctx, world) {
  ctx.fillStyle = '#2a17134d'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  rounded(ctx, 804, 126, 442, 544, 27, '#fff0d0', '#e4a45e', 4);
  rounded(ctx, 826, 148, 398, 151, 20, '#a45338');
  text(ctx, 'WARUNG KILAT', 1025, 177, 14, '#f8d696', 900, 'center');
  text(ctx, 'DAPUR', 1025, 220, 42, '#fff0d5', 950, 'center');
  text(ctx, 'KILAT', 1025, 266, 45, '#ffcb65', 950, 'center');
  text(ctx, 'Racik cepat, sajikan hangat!', 1025, 330, 15, '#694b38', 850, 'center');
  drawFoodOnPlate(ctx, 'nasigoreng', 902, 387, .43); drawFoodOnPlate(ctx, 'mieayam', 1025, 387, .43); drawFoodOnPlate(ctx, 'sateayam', 1148, 387, .43);
  const instructions = ['Pilih tiket • racik resep', 'Masak otomatis • Space untuk saji', 'Jaga 3 nyawa • X buang • M bisukan'];
  instructions.forEach((item, i) => text(ctx, item, 1025, 457 + i * 25, 12, '#614838', 750, 'center'));
  rounded(ctx, 866, 554, 318, 67, 18, '#4d7956', '#91ae76', 3);
  text(ctx, 'MULAI SHIFT', 1025, 587, 19, '#fff2d4', 950, 'center');
  text(ctx, 'KLIK UNTUK MULAI', 1025, 642, 9, '#9b7957', 850, 'center');
}

function drawGameOver(ctx, world) {
  ctx.fillStyle = '#2b191589'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  rounded(ctx, 365, 171, 550, 445, 27, '#fff0d0', '#d98d4d', 4);
  rounded(ctx, 403, 205, 474, 102, 18, '#923f36');
  text(ctx, 'SHIFT SELESAI', 640, 245, 17, '#f6ce90', 900, 'center');
  text(ctx, 'WADUH, DAPUR SEPI!', 640, 278, 29, '#fff0d6', 950, 'center');
  text(ctx, 'Skor akhir', 640, 358, 15, '#876346', 800, 'center');
  text(ctx, String(world.score), 640, 405, 53, '#a04b36', 950, 'center');
  text(ctx, `KOIN  ${world.coins}     •     KOMBO TERBAIK  ${world.bestCombo}×`, 640, 453, 14, '#6f5740', 850, 'center');
  text(ctx, `REKOR WARUNG  ${Math.max(world.best, world.score)}`, 640, 487, 13, '#668250', 900, 'center');
  rounded(ctx, 499, 527, 282, 61, 18, '#4d7956', '#90af78', 3);
  text(ctx, 'ULANGI SHIFT  [R]', 640, 557, 18, '#fff4dc', 950, 'center');
}

export function renderGame(ctx, world) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawKitchen(ctx, world);
  drawOrderBoard(ctx, world);
  drawHud(ctx, world);
  drawRecipeCard(ctx, world);
  drawWorkstation(ctx, world);
  drawIngredientCards(ctx, world);
  if (world.phase === 'playing') drawFeedback(ctx, world);
  if (world.phase === 'title') drawTitle(ctx, world);
  if (world.phase === 'ended') drawGameOver(ctx, world);
  if (world.phase === 'playing' && world.feedbackTime > 0 && world.assembly.length) {
    text(ctx, `${world.assembly.length} / ${selectedDish(world)?.ingredients.length ?? 0} bahan`, 785, 457, 10, '#fff0cf', 850, 'center');
  }
}

export function hitTests() {
  return { WIDTH, HEIGHT };
}
