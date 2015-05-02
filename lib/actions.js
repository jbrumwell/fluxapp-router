'use strict';

var fluxApp = require('fluxapp');
var router = fluxApp.getRouter();

function isEnabled() {
  return !! (typeof window !== 'undefined' && window.history);
}

module.exports = {
  router: {
    init: function init(url, meta) {
      var route = router.build(url, meta);

      if (! route) {
        throw new Error('fluxapp:router:init unable to locate route specified', route);
      }

      return {
        routeId: route.id,
        route: route,
        meta: meta,
      };
    },

    go: function go(id, meta) {
      var route = router.build(id, meta);
      var title;
      var state;

      if (! route) {
        throw new Error('fluxapp:router:Go unable to locate route specified', route);
      }

      meta.url = route.url;

      state = {
        routeId: route.id,
        meta: meta,
      };

      if (isEnabled()) {
        title = route.title || meta.title || '';

        window.history.pushState(
          state,
          title,
          route.url
        );
      }

      state.route = route;

      return state;
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
