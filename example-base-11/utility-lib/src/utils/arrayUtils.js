export const unique = (arr) => [...new Set(arr)];

export const flatten = (arr) => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
