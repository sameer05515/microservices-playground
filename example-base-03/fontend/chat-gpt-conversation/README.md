# prettier common configurations

```json
{
  "printWidth": 80,                       // Maximum line length before wrapping
  "tabWidth": 2,                          // Number of spaces per indentation level
  "useTabs": false,                       // Indentation using spaces (not tabs)
  "semi": true,                           // Whether to add semicolons at the end of statements
  "singleQuote": true,                    // Use single quotes instead of double quotes
  "jsxSingleQuote": false,                // Use double quotes in JSX (commonly double quotes in JSX)
  "trailingComma": "es5",                 // Add trailing commas in multi-line objects/arrays (es5, none, all)
  "bracketSpacing": true,                 // Print spaces between brackets in object literals
  "arrowParens": "always",                // Always include parentheses for arrow functions
  "endOfLine": "lf",                      // Line endings - 'lf' for UNIX, 'crlf' for Windows, 'auto' to detect
  "quoteProps": "as-needed",              // Only add quotes to object properties that are necessary
  "proseWrap": "always",                  // Wrap markdown text if it exceeds the print width
  "htmlWhitespaceSensitivity": "css",     // Respect the default CSS display property for HTML files
  "embeddedLanguageFormatting": "auto",   // Automatically format embedded code in HTML, JSX, etc.
  "arrowParens": "avoid"                  // Avoid unnecessary parentheses around a sole arrow function parameter (optional)
}


```