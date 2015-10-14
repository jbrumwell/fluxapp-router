/* global window */
import fluxapp, { BaseActions } from 'fluxapp';

const router = fluxapp.getRouter();

export default (name, options = { method : 'history' }) => {
  function isHistoryEnabled() {
    return options.method === 'history' &&
           typeof window !== 'undefined' &&
           window.history;
  }

  const RouterActions = class extends BaseActions {
    init(url, meta) {
      const request = router.build(url, meta, false);

      if (! request) {
        throw new Error('fluxapp:router:init unable to locate route specified', url);
      }

      if (isHistoryEnabled()) {
        window.history.replaceState(
          request,
          request.title || '',
          request.url
        );

        window.addEventListener('popstate', this.popstate.bind(this), false);
      } else {
        window.addEventListener('hashchange', this.hashchange.bind(this), false);
      }

      return request;
    }

    hashchange() {
      const url = window.location.hash.replace('#', '');
      this.go(url);
    }

    popstate(event) {
      const state = event.state;

      if (state && state.routeId) {
        state.route = router.getRouteById(state.routeId);
      }

      return state;
    }

    go(id, meta) {
      const request = router.build(id, meta);

      if (! request) {
        throw new Error('fluxapp:router:Go unable to locate route specified', id);
      }

      if (isHistoryEnabled()) {
        window.history.pushState(
          request,
          request.title,
          request.url
        );
      }

      return request;
    }

    back() {
      if (isHistoryEnabled()) {
        window.history.back();
      } else {
        throw new Error('Fluxapp:Router back is not available in hash routing');
      }
    }

    forward() {
      if (isHistoryEnabled()) {
        window.history.forward();
      } else {
        throw new Error('Fluxapp:Router forward is not available in hash routing');
      }
    }
  };

  return {
    [name] : RouterActions,
  };
};
