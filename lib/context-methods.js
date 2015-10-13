"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (name) {
  return {
    getRouterStore: function getRouterStore() {
      return this.getStore(name);
    },

    getRouterActions: function getRouterActions() {
      return this.getActions(name);
    },

    registerRouteHandler: function registerRouteHandler(handler) {
      var store = this.getStore(name);

      store.addChangeListener(handler);

      return this;
    }
  };
};

module.exports = exports["default"];