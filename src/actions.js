/* global window */
import fluxapp, { BaseActions } from 'fluxapp';

export default (name, options = { method : 'history' }) => {
  const router = fluxapp.getRouter();

  const RouterActions = class extends BaseActions {
    constructor() {
      super(...arguments);

      this.popstate = this.popstate.bind(this);
      this.hashchange = this.hashchange.bind(this);
    }

    init(url, meta) {
      const historyEnabled = this._isHistoryEnabled();
      url = historyEnabled ? url : url.replace('#', '');
      const request = router.build(url, meta, false);

      if (! request) {
        throw new Error('fluxapp:router:init unable to locate route specified', url);
      }

      if (historyEnabled) {
        window.history.replaceState(
          request,
          request.title || '',
          request.url
        );
      }

      this._bindEventHandlers();

      return request;
    }

    _bindEventHandlers() {
      if (this._isClientSide()) {
        if (this._isHistoryEnabled()) {
          window.addEventListener('popstate', this.popstate, false);
        } else {
          window.addEventListener('hashchange', this.hashchange, false);
        }
      }
    }

    _isHistoryEnabled() {
      return options.method === 'history' &&
             this._isClientSide() &&
             window.history;
    }

    _isClientSide() {
      return typeof window !== 'undefined';
    }

    _updateClientSide(request) {
      if (this._isClientSide()) {
        if (this._isHistoryEnabled()) {
          window.history.pushState(
            request,
            request.title,
            request.url
          );
        } else {
          window.removeEventListener('hashchange', this.hashchange, false);
          window.location.hash = request.url;
          window.addEventListener('hashchange', this.hashchange, false);
        }
      }
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

      this._updateClientSide(request);

      return request;
    }

    back() {
      if (this._isHistoryEnabled()) {
        window.history.back();
      } else {
        throw new Error('Fluxapp:Router back is only support on client side when using history');
      }
    }

    forward() {
      if (this._isHistoryEnabled()) {
        window.history.forward();
      } else {
        throw new Error('Fluxapp:Router forward is only support on client side when using history');
      }
    }
  };

  return {
    [name] : RouterActions,
  };
};
