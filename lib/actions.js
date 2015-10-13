/* global window */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var router = _fluxapp2['default'].getRouter();

exports['default'] = function (name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { method: 'history' } : arguments[1];

  function isHistoryEnabled() {
    return options.method === 'history' && typeof window !== 'undefined' && window.history;
  }

  return _defineProperty({}, name, {
    init: function init(url, meta) {
      var request = router.build(url, meta, false);

      if (!request) {
        throw new Error('fluxapp:router:init unable to locate route specified', url);
      }

      if (isHistoryEnabled()) {
        window.history.replaceState(request, request.title || '', request.url);

        window.addEventListener('popstate', this.popstate.bind(this), false);
      } else {
        window.addEventListener('hashchange', this.hashchange.bind(this), false);
      }

      return request;
    },

    hashchange: function hashchange() {
      var url = window.location.hash.replace('#', '');
      this.go(url);
    },

    popstate: function popstate(event) {
      var state = event.state;

      if (state && state.routeId) {
        state.route = router.getRouteById(state.routeId);
      }

      return state;
    },

    go: function go(id, meta) {
      var request = router.build(id, meta);

      if (!request) {
        throw new Error('fluxapp:router:Go unable to locate route specified', id);
      }

      if (isHistoryEnabled()) {
        window.history.pushState(request, request.title, request.url);
      }

      return request;
    },

    back: function back() {
      if (isHistoryEnabled()) {
        window.history.back();
      } else {
        throw new Error('Fluxapp:Router back is not available in hash routing');
      }
    },

    forward: function forward() {
      if (isHistoryEnabled()) {
        window.history.forward();
      } else {
        throw new Error('Fluxapp:Router forward is not available in hash routing');
      }
    }
  });
};

module.exports = exports['default'];