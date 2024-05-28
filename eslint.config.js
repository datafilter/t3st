module.exports = [{
    files: ["**/*.js"],
    ignores: ["**/invalid_javascript.js"],
    rules: {
        "no-unused-vars": ["error",{ "argsIgnorePattern" : "^_", "varsIgnorePattern" : "^_" }],
        "prefer-const" : "error"
    }         
}]
