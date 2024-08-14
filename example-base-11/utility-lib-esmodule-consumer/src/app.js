import { arrayUtils, stringUtils, objectUtils } from '@stparap/utility-lib';

console.log(arrayUtils.unique([1, 2, 3, 2])); // [1, 2, 3]
console.log(stringUtils.capitalize('hello')); // Hello
console.log(objectUtils.deepClone({ a: 1 })); // { a: 1 }