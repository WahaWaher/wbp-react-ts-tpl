const { isDev } = require('./utils/mode');

module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    isDev && 'react-refresh/babel',
  ].filter(Boolean),
};
