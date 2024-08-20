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


## Please make configuration, so that this library, once published, could be used for javascript commonjs, modules as well as other typescript projects


To make your TypeScript library compatible with CommonJS, ECMAScript Modules (ESM), and TypeScript projects, you need to adjust your TypeScript configuration and build process accordingly. Here's how you can set it up:

### Step 1: Update `tsconfig.json`
Modify your `tsconfig.json` to generate both CommonJS and ESM outputs:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "declaration": true,
    "declarationDir": "./dist/types",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### Step 2: Create Multiple Build Outputs
To generate both CommonJS and ESM formats, you can use a combination of different `tsconfig` files and `npm` scripts.

1. **Create a `tsconfig.cjs.json`** for CommonJS build:
   ```json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "module": "CommonJS",
       "outDir": "./dist/cjs"
     }
   }
   ```

2. **Create a `tsconfig.esm.json`** for ESM build:
   ```json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "module": "ESNext",
       "outDir": "./dist/esm"
     }
   }
   ```

### Step 3: Adjust the Build Scripts
In your `package.json`, update the `scripts` section to build both formats:

```json
{
  "scripts": {
    "build:cjs": "tsc --project tsconfig.cjs.json",
    "build:esm": "tsc --project tsconfig.esm.json",
    "build": "npm run build:cjs && npm run build:esm",
    "test": "jest"
  }
}
```

### Step 4: Set Up `package.json` for Multi-Module Support
To ensure the library is compatible with both module systems and TypeScript, modify the `package.json`:

```json
{
  "name": "my-typescript-library",
  "version": "1.0.0",
  "description": "A sample TypeScript library",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/types/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  "scripts": {
    "build:cjs": "tsc --project tsconfig.cjs.json",
    "build:esm": "tsc --project tsconfig.esm.json",
    "build": "npm run build:cjs && npm run build:esm",
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

### Step 5: Publishing to npm
When publishing, npm will recognize the different entry points (`main`, `module`, `types`) and export them accordingly. After running `npm run build`, you can publish the package:

```bash
npm publish
```

### Final Directory Structure
Your directory structure after build should look something like this:

```
my-typescript-library/
│
├── dist/
│   ├── cjs/
│   │   └── index.js
│   ├── esm/
│   │   └── index.js
│   └── types/
│       └── index.d.ts
│
├── src/
│   └── index.ts
│
├── test/
│   └── index.test.ts
│
├── tsconfig.json
├── tsconfig.cjs.json
├── tsconfig.esm.json
├── jest.config.js
├── package.json
└── .eslintrc.json
```

This setup ensures your library can be consumed in multiple environments:
- **CommonJS** (Node.js requiring `require`)
- **ES Modules** (modern JavaScript environments using `import`)
- **TypeScript** (with accurate type definitions).

This will allow developers using your library to seamlessly integrate it into their projects, regardless of their setup.

# please write code to setup a esm, cjs, typescript projects to test my above library

## code to setup a esm project to test my above library

To set up an ECMAScript Modules (ESM) project to test your TypeScript library, follow these steps:

### Step 1: Create a New Directory for the ESM Test Project
1. Create a new directory and navigate into it:
   ```bash
   mkdir my-library-esm-test
   cd my-library-esm-test
   ```

### Step 2: Initialize Node.js Project
1. Initialize the Node.js project with a `package.json` file:
   ```bash
   npm init -y
   ```

2. Update `package.json` to specify ESM module type:
   ```json
   {
     "type": "module",
     "scripts": {
       "test": "node index.mjs"
     }
   }
   ```

### Step 3: Install Necessary Dependencies
1. Install your library. If it's published on npm:
   ```bash
   npm install my-typescript-library
   ```

2. If your library is not published yet, you can install it from the local file system:
   ```bash
   npm install ../my-typescript-library
   ```

### Step 4: Create Test Code
1. Create an `index.mjs` file in the root of your project:
   ```bash
   touch index.mjs
   ```

2. Write code in `index.mjs` to import and test your library using `import` (ESM syntax):
   ```javascript
   import { helloWorld } from 'my-typescript-library';

   console.log(helloWorld());
   ```

### Step 5: Run the Test
1. Run the test script using Node.js:
   ```bash
   npm test
   ```

### Final Directory Structure
Your ESM test project should look like this:

```
my-library-esm-test/
│
├── node_modules/
│   └── my-typescript-library/
│
├── index.mjs
└── package.json
```

This setup allows you to test your TypeScript library in an ESM environment, ensuring that it works correctly when imported using `import`. The `"type": "module"` setting in `package.json` designates that all `.js` files are treated as ESM by default, while the `.mjs` extension is a convention specifically for ESM files.

## code to setup a cjs project to test my above library

To set up a CommonJS (CJS) project to test your TypeScript library, follow these steps:

### Step 1: Create a New Directory for the CJS Test Project
1. Create a new directory and navigate into it:
   ```bash
   mkdir my-library-cjs-test
   cd my-library-cjs-test
   ```

### Step 2: Initialize Node.js Project
1. Initialize the Node.js project with a `package.json` file:
   ```bash
   npm init -y
   ```

### Step 3: Install Necessary Dependencies
1. Install your library. If it's published on npm:
   ```bash
   npm install my-typescript-library
   ```

2. If your library is not published yet, you can install it from the local file system:
   ```bash
   npm install ../my-typescript-library
   ```

### Step 4: Create Test Code
1. Create an `index.js` file in the root of your project:
   ```bash
   touch index.js
   ```

2. Write code in `index.js` to import and test your library using `require` (CommonJS syntax):
   ```javascript
   const { helloWorld } = require('my-typescript-library');

   console.log(helloWorld());
   ```

### Step 5: Run the Test
1. Simply run the script using Node.js:
   ```bash
   node index.js
   ```

### Final Directory Structure
Your CJS test project should look like this:

```
my-library-cjs-test/
│
├── node_modules/
│   └── my-typescript-library/
│
├── index.js
└── package.json
```

This setup allows you to test your TypeScript library in a CommonJS environment, ensuring that it works correctly when imported using `require`.

## code to setup a typescript project to test my above library

To set up a TypeScript project for testing the library you just created, you can follow these steps:

### Step 1: Create a New Directory for the Test Project
1. Create a new directory and navigate into it:
   ```bash
   mkdir my-library-test
   cd my-library-test
   ```

### Step 2: Initialize Node.js Project
1. Initialize the Node.js project with a `package.json` file:
   ```bash
   npm init -y
   ```

### Step 3: Install TypeScript and Other Dependencies
1. Install TypeScript and necessary types:
   ```bash
   npm install typescript @types/node --save-dev
   ```

2. Install your library (assuming it’s published on npm as `my-typescript-library`):
   ```bash
   npm install my-typescript-library
   ```

3. If your library is not published yet, you can install it from the local file system:
   ```bash
   npm install ../my-typescript-library
   ```

### Step 4: Set Up TypeScript Configuration
1. Create a `tsconfig.json` file:
   ```bash
   npx tsc --init
   ```

2. Modify the `tsconfig.json` to fit your testing setup:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "moduleResolution": "node",
       "outDir": "./dist"
     },
     "include": ["src"]
   }
   ```

### Step 5: Create Test Code
1. Create a `src` directory for your TypeScript test files:
   ```bash
   mkdir src
   ```

2. Create a `src/index.ts` file to import and use your library:
   ```typescript
   import { helloWorld } from 'my-typescript-library';

   console.log(helloWorld());
   ```

### Step 6: Build and Run the Test
1. Compile the TypeScript code:
   ```bash
   npx tsc
   ```

2. Run the compiled JavaScript:
   ```bash
   node dist/index.js
   ```

### Step 7: Set Up Testing with Jest (Optional)
If you want to add testing with Jest:

1. Install Jest and TypeScript support for Jest:
   ```bash
   npm install jest ts-jest @types/jest --save-dev
   ```

2. Create a `jest.config.js` file:
   ```javascript
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     testMatch: ['**/src/**/*.test.ts'],
   };
   ```

3. Create a test file, e.g., `src/index.test.ts`:
   ```typescript
   import { helloWorld } from 'my-typescript-library';

   test('helloWorld function returns correct string', () => {
     expect(helloWorld()).toBe('Hello, world!');
   });
   ```

4. Add a test script to your `package.json`:
   ```json
   "scripts": {
     "build": "tsc",
     "test": "jest"
   }
   ```

5. Run the tests:
   ```bash
   npm test
   ```

### Final Directory Structure
Your test project should look like this:

```
my-library-test/
│
├── dist/
│   └── index.js
│
├── src/
│   ├── index.ts
│   └── index.test.ts
│
├── tsconfig.json
├── jest.config.js
└── package.json
```

This setup will allow you to test your TypeScript library in a separate project, ensuring it works as expected when imported and used.