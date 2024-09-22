const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');
const path = require('path');

const baseUrl = path.resolve(__dirname, tsConfig.compilerOptions.outDir);
const paths = {};

for (const alias in tsConfig.compilerOptions.paths) {
  paths[alias] = tsConfig.compilerOptions.paths[alias].map(p => p.replace('src', 'dist'));
}

Logger.log('Registering paths:', { baseUrl, paths });

tsConfigPaths.register({ baseUrl, paths });

require('./dist/server.js');
