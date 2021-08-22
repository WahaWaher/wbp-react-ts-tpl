const path = require('path');

const resolve = (part) => path.resolve(process.cwd(), part);

module.exports = {
  resolve,
  paths: {
    appRoot: process.cwd(),
    appSrc: resolve('src'),
    appBuild: resolve('dist'),
    appEntry: resolve('src/index.tsx'),
    appHtml: resolve('src/index.html'),
    appPublic: resolve('public'),
  },
};
