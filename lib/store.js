'use strict';

var Promise = require('bluebird');
var fluxApp = require('fluxapp');
var url = require('url');

function isEnabled() {
  return typeof window !== 'undefined' && window.history;
}

module.exports = {
  fluxappRouter: {
    init: function init() {
      if (isEnabled()) {
        window.addEventListener('popstate', this.onPopState.bind(this), false);
      }
    },

    actions : {
      onInit: 'fluxappRouter.init',
      onPopState: 'fluxappRouter.go',
    },

    getInitialState: function getInitialState() {
      return {
        route: null,
        meta: null,
        url: null,
      }
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

    onPopState: function onPopState(event) {
      var self = this;
      var state = this.getState();
      var router = fluxApp.getRouter();
      var route = router.getRouteById(event.state.routeId);
      var meta = event.state.meta;
      var Component = route.handler;
      var parser = router.getParserById(route.id);

      this._transitionFrom(state.route, state.meta)
          .then(this._transitionTo.bind(this, route, meta))
          .then(function(transition) {
            transition = transition !== false;

            if (transition) {
              self.setState({
                route: route,
                meta: meta,
                url: event.state.url,
              });
            }
          });
    },

    isActive: function isActive(url) {
      var router = fluxApp.getRouter();
      var route = router.getRoute(url);

      return route && this.state.route && route.id === this.state.route.id;
    },

    getRoute: function getRoute() {
      return this.state.route;
    },

    getUrl: function getUrl() {
      return this.state.meta && this.state.meta.url || '';
    },

    getParams: function getParams() {
      return this.state.meta && this.state.meta.params || {};
    },

    getQuery: function getQuery() {
      return this.state.meta && this.state.meta.query || {};
    },

    getRouteMetaData: function getRouteMetaData() {
      return this.state.meta || {};
    },
  }
}
