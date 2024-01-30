module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"

    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "warn",
        "prefer-const": "error",
        "no-var": "off",

        "init-declarations": ["error", "always"],
        "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],

        "no-else-return": ["error", { "allowElseIf": true }],
        "eqeqeq": ["error", "always"],

        // "camelcase": ["error", { "properties": "never" }],
        "no-mixed-spaces-and-tabs": "error",

        "arrow-spacing": ["error", { "before": true, "after": true }],
        "no-duplicate-imports": "error",
        "@typescript-eslint/no-explicit-any": "off"
    }
};