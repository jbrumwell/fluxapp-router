/* jslint node:true */
'use strict';

var fluxApp = require('fluxapp');
var _       = require('lodash');


var routes;
var actions;

function initStore() {
  routes = fluxApp.createStore('route', {
    actions : {
      onRouteChange : 'route.change'
    },

    onRouteChange : function onRouteChange(payload) {
      var newState = _.cloneDeep(this.state);

      if (this.state.currentIdx > 0 && !payload.changeBy) {
        newState.history = newState.history.slice(this.state.currentIdx);
      }
      
      if (payload.changeBy) {
        newState.currentIdx -= payload.changeBy;

        if (newState.currentIdx < 0) {
          throw new Error('Cannot move forward in history any more');
        } else if (newState.currentIdx >= newState.history.length) {
          throw new Error('Cannot move back in history any more');
        }
      } else {
        newState.history.unshift({
          route  : payload.route
        });

        newState.currentIdx = 0;
      }

      newState.current = newState.history[newState.currentIdx];

      this.setState(newState);
    },

    getInitialState : function getInitialState() {
      return {
        history     : [],
        currentIdx  : 0
      };
    }
  });
}

function initActions() {
  actions = fluxApp.createActions('route', {
    change : function routeChangeAction(path, params) {
      // Check which route is matched
      var foundRoute = fluxApp.getRouter().getRoute(path, { method : params.method });
      if (! foundRoute) {
        throw new Error('The path provided doesn\'t match any route');
      }

      // Change the location through history.pushState

      return {
        path     : path,
        changeBy : params.changeBy
      };
    }
  });
}


function forward() {
  go(undefined, { changeBy : 1 });
}

function back() {
  go(undefined, { changeBy : -1 });
}

function go(path, params) {
  // Some validation here
  params = params || {};

  if (!params.changeBy && !params.force && routes.state.current.path === path) {
      throw new Error('The same route cannot be applied twice without forcing');
  }

  actions.change(path, params);
}

module.exports = {
  forward : forward,
  back    : back,
  go      : go
};

// Initialization
initStore();
initActions();
go(window.location.pathname, { force : true });
