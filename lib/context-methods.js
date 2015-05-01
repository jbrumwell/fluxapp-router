'use strict';

module.exports = {
  getRouterStore: function() {
    return this.getStore('fluxappRouter');
  },

  getRouterActions: function() {
    return this.getActions('fluxappRouter');
  },
}
