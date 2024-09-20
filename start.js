const tsConfigPaths = require('tsconfig-paths');

require('module-alias/register');

tsConfigPaths.register({
    baseUrl: './dist',
    paths: {
        '@/*': ['./*']
    }
});

require('./dist/server.js');
