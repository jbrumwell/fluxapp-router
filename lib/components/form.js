'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fluxapp = require('fluxapp');

var form = _react2['default'].DOM.form;

var RouteForm = (function (_FluxappComponent) {
  _inherits(RouteForm, _FluxappComponent);

  _createClass(RouteForm, null, [{
    key: 'propTypes',
    value: {
      to: _react2['default'].PropTypes.string.isRequired,
      meta: _react2['default'].PropTypes.object.isRequired,
      onSubmit: _react2['default'].PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      meta: {}
    },
    enumerable: true
  }]);

  function RouteForm() {
    _classCallCheck(this, RouteForm);

    _get(Object.getPrototypeOf(RouteForm.prototype), 'constructor', this).apply(this, arguments);

    this.props.onSubmit = this.props.onSubmit ? this.props.onSubmit : this.onSubmit.bind(this);
  }

  _createClass(RouteForm, [{
    key: 'onSubmit',
    value: function onSubmit(e) {
      var actions = this.getActions('router');

      e.preventDefault();

      actions.go(this.props.to, this.props.meta);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = _lodash2['default'].extend({}, _lodash2['default'].omit(this.props, ['to', 'meta']));

      return form(props);
    }
  }]);

  return RouteForm;
})(_fluxapp.Component);

exports['default'] = RouteForm;
module.exports = exports['default'];