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
          routes.state.current.path === path) {
        throw new Error('The same route cannot be applied twice without forcing');
      }

      if (! params.changeBy) {
        var route = fluxApp.getRouter().getRoute(path, { method : params.method });
        if (! route) {
          throw new Error('The path provided doesn\'t match any route');
        }

        if (window.history && window.history.pushState) {
          window.history.pushState(action, '', path);
        }
      } else {
        var finalIdx = routes.state.currentIdx - params.changeBy;
        if (finalIdx < 0) {
          throw new Error('Cannot move forward in history any more');
        } else if (finalIdx >= routes.state.history.length) {
          throw new Error('Cannot move back in history any more');
        }

        action.id = routes.state.history[finalIdx].id;

        if (window.history && window.history.replaceState) {
          window.history.replaceState(_.cloneDeep(action), '', routes.state.history[finalIdx].path);
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

// Initialization
initStore();
initActions();

module.exports = {
  forward : forward,
  back    : back,
  go      : actions.change,
};

module.exports.components = require('./components');

// If we're running on a client
if (typeof window === 'object') {

  window.addEventListener('popstate', function(e) {
    var offset = utils.findHistoryOffset(e.state.id, routes.state);
    if (offset) {
      actions.change(undefined, { changeBy : offset });
    } else {
      actions.change(undefined, undefined, e.state);
    }
  }, false);

  setTimeout(function() {
    actions.change(window.location.pathname, { force : true });
  });

}
