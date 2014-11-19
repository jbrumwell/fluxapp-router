/* jslint node:true */
'use strict';

var fluxApp = require('fluxapp');
var _       = require('lodash');


function fluxappRouter() {

  this.initStore();
  this.initActions();

}

fluxappRouter.prototype.initStore = function initStore() {
  this.routes = fluxApp.createStore('route', {
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
          route  : payload.route,
          params : payload.params
        });

        newState.currentIdx = 0;
      }

      newState.current = newState.history[newState.currentIdx];

      this.setState(newState);
    }
  });

  this.routes.state = {
    history     : [],
    currentIdx  : 0
  };
};

fluxappRouter.prototype.initActions = function initActions() {
  var self = this;

  this.actions = fluxApp.createActions('route', {
    change : function routeChangeAction(path, params) {
      // Check which route is matched
      var foundRoute = self.getRouter.getRoute(path, { method : params.method });
      if (! foundRoute) {
        throw new Error('The path provided doesn\'t match any route');
      }

      // TODO: Create a dict of params
      return {
        path     : path,
        params   : {},
        changeBy : params.changeBy
      };
    }
  });

};


fluxappRouter.prototype.forward = function forward() {
  this.go(undefined, { changeBy : 1 });
};

fluxappRouter.prototype.back = function back() {
  this.go(undefined, { changeBy : -1 });
};

fluxappRouter.prototype.go = function go(path, params) {
  // Some validation here
  params = params || {};

  if (!params.changeBy && !params.force && this.routes.state.current.path === path) {
      throw new Error('The same route cannot be applied twice without forcing');
  }

  this.actions.change(path, params);
};

fluxappRouter.prototype.init = function init(route, params) {
  if (route) {
    this.go.apply(this, arguments);
  } else {
    // Get path from window.location
  }
};

module.exports = new fluxappRouter();

