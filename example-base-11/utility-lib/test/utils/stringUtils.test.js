import { capitalize, reverse } from '../../src/utils/stringUtils';

test('capitalize capitalizes first letter', () => {
  expect(capitalize('hello')).toBe('Hello');
});

test('reverse reverses a string', () => {
  expect(reverse('abc')).toBe('cba');
});
