'use strict';

/**
 * Expose main package JSON of the application
 * with basic info, dependencies, etc.
 */

module.exports = opts => {
  const {
    strapiDependencies,
    additionalsDependencies,
    strapiVersion,
    projectName,
    uuid,
    packageJsonStrapi,
  } = opts;

  // Finally, return the JSON.
  return {
    name: projectName,
    private: true,
    version: '0.1.0',
    description: 'A Datoit application',
    scripts: {
      develop: 'datoit develop',
      start: 'datoit start',
      build: 'datoit build',
      datoit: 'datoit',
    },
    devDependencies: {},
    dependencies: Object.assign(
      {},
      strapiDependencies.reduce((acc, key) => {
        acc[key] = strapiVersion;
        return acc;
      }, {}),
      additionalsDependencies
    ),
    author: {
      name: 'A Datoit developer',
    },
    strapi: {
      uuid: uuid,
      ...packageJsonStrapi,
    },
    engines: {
      node: '>=10.16.0 <=14.x.x',
      npm: '^6.0.0',
    },
    license: 'MIT',
  };
};
