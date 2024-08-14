import { unique, flatten } from '../../src/utils/arrayUtils';

test('"unique" removes duplicates', () => {
  expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
});

test('"flatten" flattens nested arrays', () => {
  expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, 3, 4]);
});
