import test from 'node:test';
import assert from 'node:assert/strict';
await import('../countdown.js');
const C = globalThis.FlowerCountdown;

test('antes del 28 apunta al 28 del mismo año', () => {
  const now = new Date(2026, 8, 20, 12);
  const target = C.target(now);
  assert.equal(target.getFullYear(), 2026);
  assert.equal(target.getMonth(), 8);
  assert.equal(target.getDate(), 28);
});

test('el 28 sigue siendo el día del regalo', () => {
  const now = new Date(2026, 8, 28, 20);
  assert.equal(C.isGiftDay(now), true);
  assert.equal(C.target(now).getFullYear(), 2026);
});

test('a partir del 29 apunta al año siguiente', () => {
  const now = new Date(2026, 8, 29, 0, 1);
  assert.equal(C.target(now).getFullYear(), 2027);
});
