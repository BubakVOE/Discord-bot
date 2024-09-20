const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');
const path = require('path');

console.log('Registering paths:', {
  baseUrl: path.resolve(__dirname, tsConfig.compilerOptions.outDir),
  paths: tsConfig.compilerOptions.paths
});

tsConfigPaths.register({
  baseUrl: path.resolve(__dirname, tsConfig.compilerOptions.outDir),
  paths: tsConfig.compilerOptions.paths
});

require('./dist/server.js');
