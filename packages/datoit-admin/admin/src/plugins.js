/* eslint-disable */

const injectReducer = require('./utils/injectReducer').default;
const useInjectReducer = require('./utils/injectReducer').useInjectReducer;
const injectSaga = require('./utils/injectSaga').default;
const useInjectSaga = require('./utils/injectSaga').useInjectSaga;
const { languages } = require('./i18n');

window.strapi = Object.assign(window.strapi || {}, {
  node: MODE || 'host',
  env: NODE_ENV,
  backendURL: BACKEND_URL === '/' ? window.location.origin : BACKEND_URL,
  languages,
  currentLanguage:
    window.localStorage.getItem('strapi-admin-language') ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    'en',
  injectReducer,
  injectSaga,
  useInjectReducer,
  useInjectSaga,
});

module.exports = {
  'datoit-plugin-documentation': require('../../../datoit-plugin-documentation/admin/src').default,
  'datoit-plugin-users-permissions': require('../../../datoit-plugin-users-permissions/admin/src')
    .default,
  'datoit-plugin-content-manager': require('../../../datoit-plugin-content-manager/admin/src')
    .default,
  'datoit-plugin-content-type-builder': require('../../../datoit-plugin-content-type-builder/admin/src')
    .default,
  'datoit-plugin-email': require('../../../datoit-plugin-email/admin/src').default,
  'datoit-plugin-upload': require('../../../datoit-plugin-upload/admin/src').default,
  'datoit-plugin-graphql': require('../../../datoit-plugin-graphql/admin/src').default,
  'datoit-plugin-i18n': require('../../../datoit-plugin-i18n/admin/src').default,
};
