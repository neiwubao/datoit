'use strict';

const {
  contentTypes: { hasDraftAndPublish },
} = require('datoit-utils');

module.exports = (ctx, next) => {
  const {
    params: { model: modelUid },
  } = ctx;

  const model = strapi.contentTypes[modelUid];

  if (!hasDraftAndPublish(model)) {
    throw strapi.errors.forbidden();
  }

  return next();
};
