'use strict';

module.exports = {
  getRouterStore: function() {
    return this.getStore('fluxappRouter');
  },

  getRouterActions: function() {
    return this.getActions('fluxappRouter');
  },

  registerRouteHandler: function(handler) {
    var store = this.getStore('fluxAppRouter');

    store.addChangeListener(handler);

    return this;
  }
}
