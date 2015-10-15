'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stores = require('./stores');

var _stores2 = _interopRequireDefault(_stores);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _contextMethods = require('./context-methods');

var _contextMethods2 = _interopRequireDefault(_contextMethods);

exports['default'] = function (options) {
  return function (fluxapp, name) {
    return {
      stores: (0, _stores2['default'])(name, options),
      actions: (0, _actions2['default'])(name, options),
      contextMethods: (0, _contextMethods2['default'])(name)
    };
  };
};

module.exports = exports['default'];