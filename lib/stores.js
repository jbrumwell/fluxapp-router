'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var router = _fluxapp2['default'].getRouter();

exports['default'] = function (name) {
  return _defineProperty({}, name, {
    actions: {
      onInit: 'router.init',
      afterInit: 'router.init:after',
      onGo: 'router.go',
      onPopState: 'router.popstate'
    },

    getInitialState: function getInitialState() {
      return {
        lastRequest: false
      };
    },

    _transitionFrom: _bluebird2['default'].method(function _transitionFrom(from, to) {
      var transition = true;

      if (to && from && from.routeId !== to.routerId && from.route.handler && from.route.handler.willTransitionFrom) {
        transition = from.route.handler.willTransitionFrom(to, from);
      }

      return transition;
    }),

    _transitionTo: _bluebird2['default'].method(function _transitionTo(to, transition) {
      var from = this.getState();

      if (transition !== false && from.routeId !== to.routeId && to.route.handler && to.route.handler.willTransitionTo) {
        transition = to.route.handler.willTransitionTo(to, from);
      }

      return transition;
    }),

    _transition: function _transition(from, to) {
      var _this = this;

      this._transitionFrom(from, to).then(this._transitionTo.bind(this, to)).then(function (transition) {
        transition = transition !== false;

        if (transition) {
          to.lastRequest = _this.getState();

          _this.setState(to);
        }
      });
    },

    onInit: function onInit(state) {
      var _this2 = this;

      state.route = router.getRouteById(state.routeId);

      this._transitionTo(state).then(function (transition) {
        if (transition !== false) {
          _this2.setState(state);
        }
      });
    },

    onGo: function onGo(result) {
      result.route = router.getRouteById(result.routeId);

      this._transition(this.getState(), result);
    },

    onPopState: function onPopState(state) {
      this._transition(this.getState(), state);
    },

    isActive: function isActive(url) {
      var route = router.getRoute(url);
      var currentId = this.getState().routeId;

      return route && currentId && route.id === currentId;
    },

    getLastRequest: function getLastRequest() {
      return this.state.lastRequest;
    },

    getRoute: function getRoute() {
      return this.state.route;
    },

    getUrl: function getUrl() {
      return this.state.url;
    },

    getParams: function getParams() {
      return this.state.params;
    },

    getQuery: function getQuery() {
      return this.state.query;
    }
  });
};

module.exports = exports['default'];