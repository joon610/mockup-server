module.exports = {
    root: true,
    plugins: ["@typescript-eslint"],
    parserOptions: {
        parser: "@typescript-eslint/parser"
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:vue/recommended"
    ],
    rules: {
        quotes: ["error", "single"],
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-explicit-any": 0,
    }
};

// {
//   "defaultSeverity": "warning",
//   "extends": [
//     "tslint:recommended"
//   ],
//   "linterOptions": {
//     "exclude": [
//       "node_modules/**"
//     ]
//   },
//   "rules": {
//     "indent": [true, "spaces", 2],
//     "interface-name": false,
//     "no-consecutive-blank-lines": false,
//     "object-literal-sort-keys": false,
//     "ordered-imports": false,
//     "quotemark": [true, "single"],
//     "no-console": [false],
//     "no-var-requires":false,
//     "no-angle-bracket-type-assertion": true,
//     "max-classes-per-file": false
//   }
// }