'use strict';

var Promise = require('bluebird');
var fluxApp = require('fluxapp');
var router = fluxApp.getRouter();
var url = require('url');

function isEnabled() {
  return typeof window !== 'undefined' && window.history;
}

module.exports = {
  router: {
    init: function init() {
      if (isEnabled()) {
        window.addEventListener('popstate', this.onPopState.bind(this), false);
      }
    },

    actions : {
      onInit: 'router.init',
      afterInit: 'router.init:after',
      onGo: 'router.go',
    },

    getInitialState: function getInitialState() {
      return {
        lastRequest: false,
      };
    },

    _transitionFrom: Promise.method(function _transitionFrom(from, to) {
      var transition = true;

      if (
        to && from &&
        from.routeId !== to.routerId &&
        from.route.handler &&
        from.route.handler.willTransitionFrom
      ) {
        transition = from.route.handler.willTransitionFrom(to, from);
      }

      return transition;
    }),

    _transitionTo: Promise.method(function _transitionTo(to, transition) {
      var from = this.getState();

      if (
        transition !== false &&
        from.routeId !== to.routeId &&
        to.route.handler &&
        to.route.handler.willTransitionTo
      ) {
        transition = to.route.handler.willTransitionTo(to, from);
      }

      return transition;
    }),

    _transition: function _transition(from, to) {
      var self = this;

      this._transitionFrom(from, to)
          .then(this._transitionTo.bind(this, to))
          .then(function(transition) {
            transition = transition !== false;

            if (transition) {
              to.lastRequest = self.getState();

              self.setState(to);
            }
        });
    },

    onInit: function onInit(state) {
      var self = this;

      state.route = router.getRouteById(state.routeId);

      this._transitionTo(state).then(function(transition) {
        if (transition !== false) {
          self.setState(state);
        }
      });
    },

    onGo: function onGo(result) {
      result.route = router.getRouteById(result.routeId);

      this._transition(this.getState(), result);
    },

    onPopState: function onPopState(event) {
      var state = event.state;

      if (state && state.routeId) {
        state.route = router.getRouteByUrl(state.url);
      }

      this._transition(this.getState(), state);
    },

    isActive: function isActive(url) {
      var route = router.getRoute(url);
      var currentId = this.getState().routeId;

      return route && currentId && route.id === currentId;
    },

    getLastRequest: function getPrevious() {
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
    },
  }
}
