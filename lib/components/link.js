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

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var a = _react2['default'].DOM.a;

var RouteLink = (function (_FluxappComponent) {
  _inherits(RouteLink, _FluxappComponent);

  _createClass(RouteLink, null, [{
    key: 'propTypes',
    value: {
      to: _react2['default'].PropTypes.string.isRequired,
      meta: _react2['default'].PropTypes.object.isRequired,
      onClick: _react2['default'].PropTypes.func
    },
    enumerable: true
  }, {
    key: 'stores',
    value: {
      updateCurrentState: 'router'
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      meta: {}
    },
    enumerable: true
  }]);

  function RouteLink(props, context, updater) {
    _classCallCheck(this, RouteLink);

    _get(Object.getPrototypeOf(RouteLink.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      active: false,
      url: ''
    };
  }

  _createClass(RouteLink, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!_lodash2['default'].isEqual(nextProps, this.props)) {
        this._stateFromProps(nextProps);
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._stateFromProps(this.props);
    }
  }, {
    key: '_stateFromProps',
    value: function _stateFromProps(props) {
      var context = this.getFluxappContext();
      var router = _fluxapp2['default'].getRouter();
      var store = context.getRouterStore();
      var route = router.build(props.to, props.meta);

      if (route) {
        this.setState({
          url: route.url,
          active: store.isActive(route.url)
        });
      }
    }
  }, {
    key: 'updateCurrentState',
    value: function updateCurrentState() {
      var context = this.getFluxappContext();
      var store = context.getRouterStore();

      this.setState({
        active: store.isActive(this.state.url)
      });
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      var context = this.getFluxappContext();
      var actions = context.getRouterActions();

      e.preventDefault();

      actions.go(this.state.url, this.props.meta);
    }
  }, {
    key: 'render',
    value: function render() {
      var store = this.getStore('router');
      var url = this.state.url;
      var props = _lodash2['default'].extend({
        href: store.isHistoryEnabled() ? url : '/#' + url,
        onClick: this.onClick.bind(this)
      }, _lodash2['default'].omit(this.props, ['to', 'meta']));

      if (this.state.active) {
        props.className = props.className ? props.className + ' current' : 'current';
      }

      return a(props);
    }
  }]);

  return RouteLink;
})(_fluxapp.Component);

exports['default'] = RouteLink;
module.exports = exports['default'];