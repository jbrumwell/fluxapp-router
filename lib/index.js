/* jslint node:true */
'use strict';

var _          = require('lodash');
var utils      = require('./utils');
var routeOracle = require('./route-oracle');

var routes;
var STORE_NAME    = '__routeStore';

function FluxAppRouter(fluxApp) {
  this._fluxApp = fluxApp;

  // Initialization
  this.initStore();
  this.initActions();

  this.components = require('./components')(this);
}

FluxAppRouter.prototype.initStore = function initStore() {
  var self = this;
  var storeName = this._fluxApp._routerConstants.STORE_NAME;

  this._routes = this._fluxApp.createStore(storeName, {
    actions : {
      onRouteChange : self.getActionType('change'),
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
        var route = routeOracle.getRoute(payload.path, { method : payload.params.method });
        newState.history.unshift({
          route  : route,
          params : payload.params,
          path   : payload.path,
          id     : payload.id
        });

        newState.currentIdx = 0;
      }

      newState.current = newState.history[newState.currentIdx];

      self.setState(newState);
    },

    getInitialState : function getInitialState() {
      return {
        history     : [],
        current     : {},
        currentIdx  : 0
      };
    }
  });
};

FluxAppRouter.prototype.initActions = function initActions() {
  var self = this;
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;

  this._fluxApp.createActions(actionPrefix, {
    change : function routeChangeAction(path, params, action) {

      // If action is provided, it means we want to restore the state
      if (action) {
        return action;
      }

      params = params || {};
      action = {
        id       : utils.genId(),
        path     : path,
        method   : 'GET',
        changeBy : params.changeBy,
        params   : params
      };

      if (!params.changeBy && !params.force &&
          self._routes.state.current.path === action.path) {
        throw new Error('The same route cannot be applied twice without forcing');
      }

      if (! params.changeBy) {
        var route = routeOracle.getRoute(action.path, { method : params.method });
        if (! route) {
          throw new Error('The path provided doesn\'t match any route');
        }

        if (!params.force && self.isEnabled()) {
          window.history.pushState(action, '', action.path);
        }
      } else {
        var finalIdx = self._routes.state.currentIdx - params.changeBy;
        if (finalIdx < 0) {
          window.history.go(1);
          throw new Error('Using browser history');
        } else if (finalIdx >= self._routes.state.history.length) {
          window.history.go(-1);
          throw new Error('Using browser history');
        }

        var routedTo  = self._routes.state.history[finalIdx];
        action.id     = routedTo.id;
        action.path   = routedTo.path;
        action.params = routedTo.params;

        if (self.isEnabled()) {
          window.history.replaceState(action, '', self._routes.state.history[finalIdx].path);
        }
      }

      return action;
    }

  });
};

FluxAppRouter.prototype.forward = function forward() {
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;
  return this._fluxApp.getAction(actionPrefix, 'change')(undefined, { changeBy : 1 });
};

FluxAppRouter.prototype.back = function back() {
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;
  return this._fluxApp.getAction(actionPrefix, 'change')(undefined, { changeBy : -1 });
};

FluxAppRouter.prototype.init = function init() {
  var self = this;
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;

  window.addEventListener('popstate', function(e) {
    if (e.state) {
      var offset = utils.findHistoryOffset(e.state.id, routes.state);
      if (offset !== null) {
        self._fluxApp.getAction(actionPrefix, 'change')(undefined, { changeBy : offset });
      } else {

        // Sanitize the state
        delete e.state.changeBy;
        self._fluxApp.getAction(actionPrefix, 'change')(undefined, undefined, e.state);
      }
    } else {
      self._fluxApp.getAction(actionPrefix, 'change')(window.location.pathname, { force : true });
    }
  }, false);

  this._fluxApp.getAction(actionPrefix, 'change')(window.location.pathname, { force : true });
};

FluxAppRouter.prototype.go = function go(path, params, action) {
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;

  var changeAction = this._fluxApp.getAction(actionPrefix, 'change');
  return changeAction.apply(null, arguments);
};

FluxAppRouter.prototype.getStore = function getStore() {
  return this._routes;
};

FluxAppRouter.prototype.getActions = function getActions() {
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;
  return this._fluxApp.getActions(actionPrefix);
}

FluxAppRouter.prototype.isEnabled = function isEnabled() {
  if (typeof window === 'object') {
    return !!window.history;
  } else {
    return false;
  }
}

FluxAppRouter.prototype.getActionType = function getActionType(action) {
  var actionPrefix = this._fluxApp._routerConstants.ACTION_PREFIX;
  return this._fluxApp.getActionType(actionPrefix + '.' + action);
}

FluxAppRouter.prototype.addRoute = routeOracle.addRoute.bind(routeOracle);
FluxAppRouter.prototype.getRoute = routeOracle.getRoute.bind(routeOracle);

module.exports = FluxAppRouter;
