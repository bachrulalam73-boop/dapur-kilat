export const WIDTH = 1280;
export const HEIGHT = 800;
export const COLORS = {
  ink: '#432923', cream: '#fff3d7', paper: '#ffe6b5', wood: '#915238', woodDark: '#60372d',
  orange: '#ef8b42', turmeric: '#f4bd4e', tomato: '#d95c42', mint: '#7da77a', green: '#47745b',
  wall: '#f1d3a4', tile: '#e9c38a', dark: '#30201e', rose: '#c86b59', sky: '#9cc0b1'
};

export const INGREDIENTS = [
  { id: 'nasi', name: 'Nasi', short: 'NASI', color: '#f7eee0', kind: 'rice', key: '1' },
  { id: 'telur', name: 'Telur', short: 'TELUR', color: '#f4c552', kind: 'egg', key: '2' },
  { id: 'kecap', name: 'Kecap', short: 'KECAP', color: '#57352b', kind: 'sauce', key: '3' },
  { id: 'mie', name: 'Mie', short: 'MIE', color: '#edc25f', kind: 'noodle', key: '4' },
  { id: 'ayam', name: 'Ayam', short: 'AYAM', color: '#ce8555', kind: 'chicken', key: '5' },
  { id: 'sayur', name: 'Sayur', short: 'SAYUR', color: '#70975a', kind: 'greens', key: '6' },
  { id: 'bawang', name: 'Bawang', short: 'BAWANG', color: '#d5b86d', kind: 'onion', key: '7' },
  { id: 'sate', name: 'Sate', short: 'SATE', color: '#b9663c', kind: 'satay', key: '8' },
  { id: 'bumbu', name: 'Bumbu kacang', short: 'BUMBU', color: '#b27a3c', kind: 'peanut', key: '9' },
  { id: 'lontong', name: 'Lontong', short: 'LONTONG', color: '#e7dfc0', kind: 'cake', key: '0' },
  { id: 'teh', name: 'Teh', short: 'TEH', color: '#9d5a37', kind: 'tea', key: '' },
  { id: 'gula', name: 'Gula', short: 'GULA', color: '#fff5de', kind: 'sugar', key: '' },
  { id: 'es', name: 'Es', short: 'ES', color: '#a8d7db', kind: 'ice', key: '' }
];

export const DISHES = [
  { id: 'nasigoreng', name: 'Nasi Goreng', tag: 'WOK FAVORIT', color: '#dc8b3f', ingredients: ['nasi', 'telur', 'kecap'], cook: 4.2, price: 28 },
  { id: 'mieayam', name: 'Mie Ayam', tag: 'MIE HANGAT', color: '#d3a447', ingredients: ['mie', 'ayam', 'sayur', 'bawang'], cook: 5, price: 32 },
  { id: 'sateayam', name: 'Sate Ayam', tag: 'BAKARAN', color: '#b96743', ingredients: ['sate', 'bumbu', 'lontong'], cook: 4.5, price: 35 },
  { id: 'esteh', name: 'Es Teh Manis', tag: 'SEGAR DINGIN', color: '#6b9c93', ingredients: ['teh', 'gula', 'es'], cook: 2.7, price: 18 }
];

export const DIFFICULTY = { firstOrder: 7.2, interval: 10, shiftSeconds: 150, orderBase: 43, orderMin: 27, cookSpeed: 1 };
export const ingredient = id => INGREDIENTS.find(item => item.id === id);
export const dish = id => DISHES.find(item => item.id === id);
