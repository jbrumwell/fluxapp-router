'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var a = _react2['default'].DOM.a;

exports['default'] = _react2['default'].createClass({
  displayName: 'RouteLink',

  mixins: [_fluxapp2['default'].mixins.component],

  propTypes: {
    to: _react2['default'].PropTypes.string.isRequired,
    meta: _react2['default'].PropTypes.object.isRequired,
    onClick: _react2['default'].PropTypes.func
  },

  flux: {
    stores: {
      updateCurrentState: 'router'
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      meta: {}
    };
  },

  getInitialState: function getInitialState() {
    return {
      active: false,
      url: ''
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!_lodash2['default'].isEqual(nextProps, this.props)) {
      this._stateFromProps(nextProps);
    }
  },

  componentWillMount: function componentWillMount() {
    this._stateFromProps(this.props);
  },

  _stateFromProps: function _stateFromProps(props) {
    var router = _fluxapp2['default'].getRouter();
    var store = this.getStore('router');
    var route = router.build(props.to, props.meta);

    if (route) {
      this.setState({
        url: route.url,
        active: store.isActive(route.url)
      });
    }
  },

  updateCurrentState: function updateCurrentState() {
    var store = this.getStore('router');

    this.setState({
      active: store.isActive(this.state.url)
    });
  },

  onClick: function onClick(e) {
    var actions = this.getActions('router');

    e.preventDefault();

    actions.go(this.state.url, this.props.meta);
  },

  render: function render() {
    var props = _lodash2['default'].extend({
      href: this.state.url,
      onClick: this.onClick
    }, _lodash2['default'].omit(this.props, ['to', 'meta']));

    if (this.state.active) {
      props.className = props.className ? props.className + ' current' : 'current';
    }

    return a(props);
  }
});
module.exports = exports['default'];