export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const mergeObjects = (obj1, obj2) => ({ ...obj1, ...obj2 });
