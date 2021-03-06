module.exports = {
    env: {
        es6: true
        ,node: true
    }
    ,extends: 'eslint:recommended'
    ,parserOptions: {
        sourceType: 'module'
    }
    ,rules: {
        indent: ['warn', 4]
        ,quotes: ['warn', 'single']
        ,semi: ['warn', 'always']
        ,'comma-style': ['warn', 'first']
        ,'comma-dangle': ['error', 'never']
    }
};
