// Utility to calculate next and previous indices
export const calculateNextPrev = (dataLength, index) => {
  if (index < 0 || dataLength <= 0) return { next: -1, prev: -1 };
  return {
    next: (index + 1 + dataLength) % dataLength,
    prev: (index - 1 + dataLength) % dataLength,
  };
};
