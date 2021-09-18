'use strict';

const policyUtils = require('../policy');

describe('Policy util', () => {
  describe('Get policy', () => {
    test('Throws on policy not found', () => {
      expect(() => policyUtils.get('undefined')).toThrow();
    });

    test('Retrieves global policy', () => {
      const policyFn = () => {};

      // init global datoit
      global.datoit = {
        config: {
          policies: {
            'test-policy': policyFn,
          },
        },
      };

      expect(policyUtils.get('global::test-policy')).toBe(policyFn);
    });

    test('Retrieves a global plugin policy', () => {
      const policyFn = () => {};

      global.datoit = {
        plugins: {
          'test-plugin': {
            config: {
              policies: {
                'test-policy': policyFn,
              },
            },
          },
        },
      };

      expect(() => policyUtils.get('test-plugin.test-policy')).toThrow();
      expect(policyUtils.get('plugins::test-plugin.test-policy')).toBe(policyFn);
    });

    test('Retrieves a plugin policy locally', () => {
      const policyFn = () => {};

      global.datoit = {
        plugins: {
          'test-plugin': {
            config: {
              policies: {
                'test-policy': policyFn,
              },
            },
          },
        },
      };

      expect(policyUtils.get('test-policy', 'test-plugin')).toBe(policyFn);
    });

    test('Retrieves an api policy locally', () => {
      const policyFn = () => {};

      global.datoit = {
        api: {
          'test-api': {
            config: {
              policies: {
                'test-policy': policyFn,
              },
            },
          },
        },
      };

      expect(policyUtils.get('test-policy', undefined, 'test-api')).toBe(policyFn);
    });
  });
});
