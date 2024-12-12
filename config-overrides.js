// config-overrides.js
const path = require('path');

module.exports = function override(config) {
  config.module.rules.push({
    test: /\.(glsl|vert|frag)$/,
    use: ['raw-loader']
  });
  return config;
};