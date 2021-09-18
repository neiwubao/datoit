'use strict';

const { getNature } = require('../models');

describe('getNature', () => {
  describe('oneWay', () => {
    test('oneWay', () => {
      global.datoit = {
        models: {
          baseModel: {
            attributes: {
              test: {
                model: 'modelName',
              },
            },
          },
          modelName: {},
        },
        db: {
          getModelsByPluginName() {
            return datoit.models;
          },
        },
        plugins: {},
      };

      const nature = getNature({
        attribute: global.datoit.models.baseModel.attributes.test,
        attributeName: 'test',
        modelName: 'baseModel',
      });

      expect(nature).toEqual({
        nature: 'oneWay',
        verbose: 'belongsTo',
      });
    });
  });

  describe('oneToOne', () => {
    test('oneToOne', () => {
      global.datoit = {
        models: {
          baseModel: {
            attributes: {
              test: {
                model: 'modelName',
                via: 'reverseAttribute',
              },
            },
          },
          modelName: {
            attributes: {
              reverseAttribute: {
                model: 'baseModel',
              },
            },
          },
        },
        db: {
          getModelsByPluginName() {
            return datoit.models;
          },
        },
        plugins: {},
      };

      const nature = getNature({
        attribute: global.datoit.models.baseModel.attributes.test,
        attributeName: 'test',
        modelName: 'baseModel',
      });

      expect(nature).toEqual({
        nature: 'oneToOne',
        verbose: 'belongsTo',
      });
    });
  });
});
