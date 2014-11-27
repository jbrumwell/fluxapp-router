/* jslint node:true */
'use strict';

var fluxApp; 
var _       = require('lodash');
var utils   = require('./utils');


var routes;
var actions;

function initStore() {
  routes = fluxApp.createStore('__routeStore', {
    actions : {
      onRouteChange : '__routeActions.change'
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
  actions = fluxApp.createActions('__routeActions', {
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

        if (!params.force && isEnabled()) {
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

        if (isEnabled()) {
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

function go(path, params, action) {
  return actions.change(path, params, action); 
  return actions.change.apply(null, arguments);
}

function use(app) {
  fluxApp = app;

  // Initialization
  initStore();
  initActions();
}

function getStore() {
  return routes;
}

function getActions() {
  return actions;
}

function isEnabled() {
  return !!window.history;
}


module.exports = {
  forward : forward,
  back    : back,
  go      : go,

  use        : use,
  getStore   : getStore,
  getActions : getActions,

  isEnabled : isEnabled
};

module.exports.components = require('./components');
module.exports.init = init;
