'use strict';

module.exports = {
  getRouterStore: function() {
    return this.getStore('fluxappRouter');
  },

  getRouterActions: function() {
    return this.getActions('fluxappRouter');
  },

  registerRouteHandler: function(handler) {
    var store = this.getStore('fluxappRouter');

    store.addChangeListener(handler);

    return this;
  }
}
