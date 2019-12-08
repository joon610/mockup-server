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
    "plugins": [
        "babel"
    ],
    "rules": {
        "babel/new-cap": 1,
        "babel/camelcase": 1,
        "babel/no-invalid-this": 1,
        "babel/object-curly-spacing": 1,
        "babel/quotes": 1,
        "babel/semi": 1,
        "babel/no-unused-expressions": 1,
        "babel/valid-typeof": 1
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