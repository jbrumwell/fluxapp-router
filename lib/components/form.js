'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var form = _react2['default'].DOM.form;

exports['default'] = _react2['default'].createClass({
  displayName: 'RouteForm',

  mixins: [_fluxapp2['default'].mixins.component],

  propTypes: {
    to: _react2['default'].PropTypes.string.isRequired,
    meta: _react2['default'].PropTypes.object.isRequired,
    onSubmit: _react2['default'].PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      meta: {},
      onSubmit: this.onSubmit
    };
  },

  onSubmit: function onSubmit(e) {
    var actions = this.getActions('router');

    e.preventDefault();

    actions.go(this.props.to, this.props.meta);
  },

  render: function render() {
    var props = _lodash2['default'].extend({}, _lodash2['default'].omit(this.props, ['to', 'meta']));

    return form(props);
  }
});
module.exports = exports['default'];