'use strict';

const { omit } = require('lodash/fp');
const { getNonWritableAttributes } = require('datoit-utils').contentTypes;

module.exports = model => omit(getNonWritableAttributes(strapi.getModel(model)));
