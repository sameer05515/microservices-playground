// app.js

const { arrayUtils, stringUtils, objectUtils } = require('@stparap/utility-lib');

// Array utilities
const uniqueArray = arrayUtils.unique([1, 2, 2, 3]);
console.log('Unique Array:', uniqueArray);

// String utilities
const capitalizedString = stringUtils.capitalize('world');
console.log('Capitalized String:', capitalizedString);

// Object utilities
const mergedObject = objectUtils.mergeObjects({ a: 1 }, { b: 2 });
console.log('Merged Object:', mergedObject);
