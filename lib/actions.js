'use strict';

var fluxApp = require('fluxapp');
var router = fluxApp.getRouter();

function isEnabled() {
  return !! (typeof window !== 'undefined' && window.history);
}

module.exports = {
  router: {
    init: function init(url, meta) {
      var request = router.build(url, meta, false);

      if (! request) {
        throw new Error('fluxapp:router:init unable to locate route specified', route);
      }

      if (isEnabled()) {
        window.history.replaceState(
          request,
          request.title || '',
          request.url
        );
      }

      return request;
    },

    go: function go(id, meta) {
      var request = router.build(id, meta);

      if (! request) {
        throw new Error('fluxapp:router:Go unable to locate route specified', route);
      }

      if (isEnabled()) {
        window.history.pushState(
          request,
          request.title,
          request.url
        );
      }

      return request;
    },

    back: function back() {
      if (isEnabled) {
        window.history.back();
      }
    },

    forward: function forward() {
      if (isEnabled) {
        window.history.forward();
      }
    }
  }
}
