/**
 * Calculates the next and previous indices in a circular list.
 *
 * If the index is out of bounds (negative or dataLength <= 0), returns { next: -1, prev: -1 }.
 * Otherwise, wraps around the list such that:
 *   - next is (index + 1) modulo dataLength,
 *   - prev is (index - 1) modulo dataLength (handles wrap-around to the last index).
 *
 * @param {number} dataLength - The total number of items in the list.
 * @param {number} index - The current index.
 * @returns {{ next: number, prev: number }} Object containing the next and previous indices.
 */
export const calculateNextPrev = (dataLength, index) => {
  if (index < 0 || dataLength <= 0) return { next: -1, prev: -1 };
  return {
    next: (index + 1 + dataLength) % dataLength,
    prev: (index - 1 + dataLength) % dataLength,
  };
};
