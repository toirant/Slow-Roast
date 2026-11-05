import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createToast,
  addToast,
  removeToast,
  isToastExpired,
} from './toast.ts';

test('createToast constructs a valid toast item with default duration and id', () => {
  const toast = createToast('Action Confirmed', 'First box reserved with free shipping');
  assert.ok(toast.id.startsWith('toast-'));
  assert.equal(toast.title, 'Action Confirmed');
  assert.equal(toast.message, 'First box reserved with free shipping');
  assert.equal(toast.variant, 'success');
  assert.equal(toast.durationMs, 4500);
  assert.ok(toast.timestamp > 0);
});

test('addToast prepends new toasts and limits to maxToasts', () => {
  const t1 = createToast('T1', 'Msg 1');
  const t2 = createToast('T2', 'Msg 2');
  const t3 = createToast('T3', 'Msg 3');
  const t4 = createToast('T4', 'Msg 4');

  let list = addToast([], t1, 3);
  assert.equal(list.length, 1);
  assert.equal(list[0].id, t1.id);

  list = addToast(list, t2, 3);
  assert.equal(list.length, 2);
  assert.equal(list[0].id, t2.id);

  list = addToast(list, t3, 3);
  assert.equal(list.length, 3);

  list = addToast(list, t4, 3);
  assert.equal(list.length, 3);
  assert.equal(list[0].id, t4.id);
  assert.equal(list.some((t) => t.id === t1.id), false, 'oldest toast should be trimmed');
});

test('removeToast removes target toast by ID', () => {
  const t1 = createToast('T1', 'Msg 1');
  const t2 = createToast('T2', 'Msg 2');
  const list = [t1, t2];

  const filtered = removeToast(list, t1.id);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, t2.id);
});

test('isToastExpired accurately evaluates expiry given timestamp and duration', () => {
  const toast = createToast('T1', 'Msg', 'success', 3000);
  assert.equal(isToastExpired(toast, toast.timestamp + 1000), false);
  assert.equal(isToastExpired(toast, toast.timestamp + 2999), false);
  assert.equal(isToastExpired(toast, toast.timestamp + 3000), true);
  assert.equal(isToastExpired(toast, toast.timestamp + 5000), true);
});
