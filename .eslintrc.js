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
        "babel/quotes": 0,
        "babel/semi": 1,
        "babel/no-unused-expressions": 1,
        "babel/valid-typeof": 1,
        "@typescript-eslint/explicit-function-return-type":0,
        "@typescript-eslint/no-use-before-define":0,
        "@typescript-eslint/no-non-null-assertion": true"
    }
};