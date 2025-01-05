import { helloWorld } from '../src';

test('should return Hello, world!', () => {
  expect(helloWorld()).toBe('Hello, world!');
});
