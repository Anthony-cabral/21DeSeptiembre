import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../countdown.js', import.meta.url), 'utf8');
const context = { Date };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(source, context);
const countdown = context.FlowerCountdown;

test('apunta al 28 de septiembre del mismo año antes del día del regalo', () => {
  const now = new Date(2026, 8, 20, 8, 0, 0);
  const target = countdown.target(now);
  assert.equal(target.getFullYear(), 2026);
  assert.equal(target.getMonth(), 8);
  assert.equal(target.getDate(), 28);
});

test('el 28 completo se considera el día del regalo y el contador no baja de cero', () => {
  const now = new Date(2026, 8, 28, 15, 30, 0);
  const target = countdown.target(now);
  const remaining = countdown.remaining(target, now);
  assert.equal(countdown.isGiftDay(now), true);
  assert.deepEqual({ ...remaining }, { days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test('desde el 29 apunta al 28 de septiembre del siguiente año', () => {
  const now = new Date(2026, 8, 29, 0, 0, 0);
  const target = countdown.target(now);
  assert.equal(target.getFullYear(), 2027);
  assert.equal(target.getMonth(), 8);
  assert.equal(target.getDate(), 28);
});
