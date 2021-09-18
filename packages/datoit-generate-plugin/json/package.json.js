'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

/**
 * Expose main package JSON of the application
 * with basic info, dependencies, etc.
 */

module.exports = scope => {
  // Finally, return the JSON.
  return _.merge(scope.appPackageJSON || {}, {
    name: `datoit-plugin-${scope.id}`,
    version: '0.0.0',
    description: 'This is the description of the plugin.',
    datoit: {
      name: scope.id,
      icon: 'plug',
      description: `Description of ${scope.id} plugin.`,
    },
    dependencies: {},
    author: {
      name: scope.author || 'A Datoit developer',
      email: scope.email || '',
      url: scope.website || '',
    },
    maintainers: [
      {
        name: scope.author || 'A Datoit developer',
        email: scope.email || '',
        url: scope.website || '',
      },
    ],
    engines: {
      node: '>=10.16.0 <=14.x.x',
      npm: '>=6.0.0',
    },
    license: scope.license || 'MIT',
  });
};
