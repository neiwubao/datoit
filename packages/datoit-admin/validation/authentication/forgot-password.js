'use strict';

const { yup, formatYupErrors } = require('datoit-utils');
const validators = require('../common-validators');

const forgotPasswordSchema = yup
  .object()
  .shape({
    email: validators.email.required(),
  })
  .required()
  .noUnknown();

const validateForgotPasswordInput = data => {
  return forgotPasswordSchema
    .validate(data, { strict: true, abortEarly: false })
    .catch(error => Promise.reject(formatYupErrors(error)));
};

module.exports = validateForgotPasswordInput;
