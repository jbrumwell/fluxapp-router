/* jslint node:true */
'use strict';

var fluxApp = require('fluxapp');
var _       = require('lodash');
var utils   = require('./utils');


var routes;
var actions;

function initStore() {
  routes = fluxApp.createStore('route', {
    actions : {
      onRouteChange : 'route.change'
    },

    onRouteChange : function onRouteChange(payload) {
      var newState = this.state;

      if (this.state.currentIdx > 0 && !payload.changeBy) {
        newState.history = newState.history.slice(this.state.currentIdx);
        newState.currentIdx = 0;
      }

      if (payload.changeBy) {
        newState.currentIdx -= payload.changeBy;
      } else {
        // Get the handler - it cannot be pushed into the state
        var route = fluxApp.getRouter().getRoute(payload.path, { method : payload.params.method });
        newState.history.unshift({
          route  : route,
          params : payload.params,
          path   : payload.path,
          id     : payload.id
        });

        newState.currentIdx = 0;
      }

      newState.current = newState.history[newState.currentIdx];

      this.setState(newState);
    },

    getInitialState : function getInitialState() {
      return {
        history     : [],
        current     : {},
        currentIdx  : 0
      };
    }
  });
}

function initActions() {
  actions = fluxApp.createActions('route', {
    change : function routeChangeAction(handler, path, params, action) {

      // If action is provided, it means we want to restore the state
      if (action) {
        return action;
      }

      params = params || {};
      action = {
        id       : utils.genId(),
        path     : path,
        changeBy : params.changeBy,
        params   : params
      };

      if (!params.changeBy && !params.force &&
          routes.state.current.path === action.path) {
        throw new Error('The same route cannot be applied twice without forcing');
      }

      if (! params.changeBy) {
        var route = fluxApp.getRouter().getRoute(action.path, { method : params.method });
        if (! route) {
          throw new Error('The path provided doesn\'t match any route');
        }

        if (!params.force && window.history && window.history.pushState) {
          window.history.pushState(action, '', action.path);
        }
      } else {
        var finalIdx = routes.state.currentIdx - params.changeBy;
        if (finalIdx < 0) {
          throw new Error('Cannot move forward in history any more');
        } else if (finalIdx >= routes.state.history.length) {
          throw new Error('Cannot move back in history any more');
        }

        var routedTo  = routes.state.history[finalIdx];
        action.id     = routedTo.id;
        action.path   = routedTo.path;
        action.params = routedTo.params;

        if (window.history && window.history.replaceState) {
          window.history.replaceState(action, '', routes.state.history[finalIdx].path);
        }
      }


      return action;
    }

  });
}


function forward() {
  actions.change(undefined, { changeBy : 1 });
}

function back() {
  actions.change(undefined, { changeBy : -1 });
}

function init() {

  window.addEventListener('popstate', function(e) {
    if (e.state) {
      var offset = utils.findHistoryOffset(e.state.id, routes.state);
      if (offset !== null) {
        actions.change(undefined, { changeBy : offset });
      } else {

        // Sanitize the state
        delete e.state.changeBy;
        actions.change(undefined, undefined, e.state);
      }
    } else {
      actions.change(window.location.pathname, { force : true });
    }
  }, false);

  actions.change(window.location.pathname, { force : true });
}

// Initialization
initStore();
initActions();

module.exports = {
  forward : forward,
  back    : back,
  go      : actions.change,
  init    : init
};

module.exports.components = require('./components');
