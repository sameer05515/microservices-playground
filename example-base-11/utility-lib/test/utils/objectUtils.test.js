import { deepClone, mergeObjects } from '../../src/utils/objectUtils';

test('deepClone creates a deep copy', () => {
  const obj = { a: 1, b: { c: 2 } };
  const cloned = deepClone(obj);
  expect(cloned).toEqual(obj);
  expect(cloned).not.toBe(obj);
});

test('mergeObjects merges two objects', () => {
  expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
});
