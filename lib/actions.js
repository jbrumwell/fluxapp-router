/* global window */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var router = _fluxapp2['default'].getRouter();

exports['default'] = function (name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { method: 'history' } : arguments[1];

  function isHistoryEnabled() {
    return options.method === 'history' && typeof window !== 'undefined' && window.history;
  }

  var RouterActions = (function (_BaseActions) {
    _inherits(RouterActions, _BaseActions);

    function RouterActions() {
      _classCallCheck(this, RouterActions);

      _get(Object.getPrototypeOf(RouterActions.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(RouterActions, [{
      key: 'init',
      value: function init(url, meta) {
        var historyEnabled = isHistoryEnabled();

        url = historyEnabled ? url : url.replace('#', '');

        var request = router.build(url, meta, false);

        if (!request) {
          throw new Error('fluxapp:router:init unable to locate route specified', url);
        }

        if (historyEnabled) {
          window.history.replaceState(request, request.title || '', request.url);

          window.addEventListener('popstate', this.popstate.bind(this), false);
        } else {
          window.addEventListener('hashchange', this.hashchange.bind(this), false);
        }

        return request;
      }
    }, {
      key: 'hashchange',
      value: function hashchange() {
        var url = window.location.hash.replace('#', '');
        this.go(url);
      }
    }, {
      key: 'popstate',
      value: function popstate(event) {
        var state = event.state;

        if (state && state.routeId) {
          state.route = router.getRouteById(state.routeId);
        }

        return state;
      }
    }, {
      key: 'go',
      value: function go(id, meta) {
        var request = router.build(id, meta);

        if (!request) {
          throw new Error('fluxapp:router:Go unable to locate route specified', id);
        }

        if (isHistoryEnabled()) {
          window.history.pushState(request, request.title, request.url);
        }

        return request;
      }
    }, {
      key: 'back',
      value: function back() {
        if (isHistoryEnabled()) {
          window.history.back();
        } else {
          throw new Error('Fluxapp:Router back is not available in hash routing');
        }
      }
    }, {
      key: 'forward',
      value: function forward() {
        if (isHistoryEnabled()) {
          window.history.forward();
        } else {
          throw new Error('Fluxapp:Router forward is not available in hash routing');
        }
      }
    }]);

    return RouterActions;
  })(_fluxapp.BaseActions);

  return _defineProperty({}, name, RouterActions);
};

module.exports = exports['default'];