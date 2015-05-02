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
      setState: 'router.init',
      afterInit: 'router.init:after',
      onGo: 'router.go',
    },

    getInitialState: function getInitialState() {
      return {
        init: false,
        lastRequest: false,
      };
    },

    _transitionFrom: Promise.method(function _transitionFrom(route, meta) {
      var transition = true;

      if (route && route.handler.willTransitionFrom) {
        result = route.handler.willTransitionFrom(route, meta);
      }

      return transition;
    }),

    _transitionTo: Promise.method(function _transitionTo(route, meta, transition) {
      var current = this.state.route;

      if (transition !== false && route && route.handler.willTransitionTo) {
        transition = route.handler.willTransitionTo(route, meta);
      }

      return transition;
    }),

    _transition: function _transition(from, to) {
      var self = this;

      this._transitionFrom(from.route, from.meta)
          .then(this._transitionTo.bind(this, to.route, to.meta))
          .then(function(transition) {
            transition = transition !== false;

            if (transition) {
              to.lastRequest = self.getState();

              self.setState(to);
            }
        });
    },

    afterInit: function afterInit() {
      this.setState({
        init: true
      }, true);
    },

    onGo: function onGo(result) {
      this._transition(this.getState(), result);
    },

    onPopState: function onPopState(event) {
      this._transition(this.getState(), event.state);
    },

    isActive: function isActive(url) {
      var checking = router.getRoute(url);
      var routeId = this.getState().routeId;

      return checking && routeId && route.id === routeId;
    },

    getLastRequest: function getPrevious() {
      return ;this.state.lastRequest;
    },

    getRoute: function getRoute() {
      return router.getRoute(this.state.routeId);
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
