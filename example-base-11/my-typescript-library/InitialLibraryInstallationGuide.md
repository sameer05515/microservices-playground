## Staring from scratch please guide how to setup a nodejs typescript project for library creation.

Here's a step-by-step guide to setting up a Node.js project for library creation using TypeScript:

### Step 1: Create a New Directory
1. Open your terminal.
2. Create a new directory for your project and navigate into it:
   ```bash
   mkdir my-typescript-library
   cd my-typescript-library
   ```

### Step 2: Initialize Node.js Project
1. Initialize the Node.js project with a `package.json` file:
   ```bash
   npm init -y
   ```

### Step 3: Install Development Dependencies
1. Install TypeScript and other necessary development dependencies:
   ```bash
   npm install typescript @types/node ts-node --save-dev
   ```

2. Install additional useful tools:
   - **ESLint** for linting:
     ```bash
     npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
     ```
   - **Prettier** for code formatting:
     ```bash
     npm install prettier eslint-config-prettier eslint-plugin-prettier --save-dev
     ```
   - **Jest** for testing:
     ```bash
     npm install jest ts-jest @types/jest --save-dev
     ```

### Step 4: Set Up TypeScript Configuration
1. Create a `tsconfig.json` file:
   ```bash
   npx tsc --init
   ```

2. Modify the `tsconfig.json` to fit a typical library setup:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "CommonJS",
       "declaration": true,
       "outDir": "./dist",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist", "test"]
   }
   ```

### Step 5: Set Up ESLint and Prettier Configuration
1. Create a `.eslintrc.json` file:
   ```json
   {
     "parser": "@typescript-eslint/parser",
     "parserOptions": {
       "ecmaVersion": 2020,
       "sourceType": "module"
     },
     "extends": [
       "eslint:recommended",
       "plugin:@typescript-eslint/recommended",
       "prettier"
     ],
     "plugins": ["@typescript-eslint", "prettier"],
     "rules": {
       "prettier/prettier": "error",
       "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
     }
   }
   ```

2. Create a `.prettierrc` file:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "printWidth": 80,
     "trailingComma": "all"
   }
   ```

### Step 6: Create Your Library Code
1. Create a `src` directory:
   ```bash
   mkdir src
   ```

2. Create an example TypeScript file in the `src` directory, e.g., `index.ts`:
   ```typescript
   export const helloWorld = (): string => {
     return 'Hello, world!';
   };
   ```

### Step 7: Set Up Testing
1. Create a `jest.config.js` file:
   ```javascript
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     testMatch: ['**/test/**/*.test.ts'],
   };
   ```

2. Create a `test` directory and an example test file, e.g., `index.test.ts`:
   ```typescript
   import { helloWorld } from '../src';

   test('should return Hello, world!', () => {
     expect(helloWorld()).toBe('Hello, world!');
   });
   ```

3. Add a test script to your `package.json`:
   ```json
   "scripts": {
     "test": "jest"
   }
   ```

### Step 8: Build and Run Tests
1. To build your project:
   ```bash
   npx tsc
   ```

2. To run tests:
   ```bash
   npm test
   ```

### Step 9: Set Up for Publishing (Optional)
1. Add a `"main"` field to your `package.json` to point to the compiled JavaScript file:
   ```json
   "main": "dist/index.js",
   ```

2. If you want to publish the library to npm, ensure your `package.json` is correctly configured with the package name, version, description, etc.

### Final `package.json` Example
```json
{
  "name": "my-typescript-library",
  "version": "1.0.0",
  "description": "A sample TypeScript library",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  },
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^8.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.0.0",
    "prettier": "^3.0.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.0.0",
    "typescript": "^5.0.0"
  }
}
```

This will give you a solid starting point for creating a Node.js library with TypeScript.


## 