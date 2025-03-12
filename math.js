
const min = (a, b) => (a < b ? a : b);
const max = (a, b) => (a > b ? a : b);
const abs = (a) => (a < 0 ? -a : a);
const sign = (a) => (a < 0 ? -1 : 1);
const toInt = (a) => (a | 0);
const rand = (l, r) => toInt(Math.random() * (r - l) + l);