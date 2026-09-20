import test from 'node:test';
import assert from 'node:assert/strict';
import '../countdown.js';
const { target, remaining, isGiftDay } = globalThis.FlowerCountdown;

test('el 21 cuenta siete días hasta el 28 del mismo año', () => {
  const now = new Date(2026, 8, 21);
  assert.equal(target(now).getFullYear(), 2026);
  assert.deepEqual(remaining(target(now), now), { days: 7, hours: 0, minutes: 0, seconds: 0 });
});
test('desglosa horas, minutos y segundos', () => {
  const now = new Date(2026, 8, 27, 22, 58, 57);
  assert.deepEqual(remaining(target(now), now), { days: 0, hours: 1, minutes: 1, seconds: 3 });
});
test('el 28 muestra la llegada durante todo el día y nunca números negativos', () => {
  for (const hour of [0, 12, 23]) {
    const now = new Date(2026, 8, 28, hour, 59, 59);
    assert.ok(isGiftDay(now));
    assert.equal(target(now).getFullYear(), 2026);
    assert.deepEqual(remaining(target(now), now), { days: 0, hours: 0, minutes: 0, seconds: 0 });
  }
});
test('pasado el 28 elige el próximo septiembre, incluso al cambiar de año', () => {
  for (const now of [new Date(2026, 8, 29), new Date(2026, 11, 31), new Date(2027, 0, 1)]) {
    assert.equal(target(now).getFullYear(), 2027);
    assert.equal(target(now).getMonth(), 8);
    assert.equal(target(now).getDate(), 28);
    assert.ok(!isGiftDay(now));
  }
});
