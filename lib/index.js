'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _components = require('./components');

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

exports['default'] = {
  Form: _components.Form,
  Link: _components.Link,
  Plugin: _plugin2['default']
};
module.exports = exports['default'];