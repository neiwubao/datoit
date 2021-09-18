const pluginPkg = require('../../package.json');
const pluginId = pluginPkg.name.replace(
  /^datoit-plugin-/i,
  ''
);

module.exports = pluginId;
