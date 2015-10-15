import Promise from 'bluebird';
import fluxapp, { BaseStore } from 'fluxapp';

const router = fluxapp.getRouter();

function promiseMethod(target, name, descriptor) {
  descriptor.value = Promise.method(descriptor.value);

  return descriptor;
}

export default (name, options = { method : 'history' }) => {
  const RouterStore = class extends BaseStore {
    static actions = {
      onInit : `${name}.init`,
      afterInit : `${name}.init:after`,
      onGo : `${name}.go`,
      onPopState : `${name}.popstate`,
    }

    getInitialState() {
      return {
        lastRequest : false,
      };
    }

    @promiseMethod
    _transitionFrom(from, to) {
      let transition = true;

      if (
        to && from &&
        from.routeId !== to.routerId &&
        from.route.handler &&
        from.route.handler.willTransitionFrom
      ) {
        transition = from.route.handler.willTransitionFrom(to, from);
      }

      return transition;
    }

    @promiseMethod
    _transitionTo(to, transition) {
      const from = this.getState();

      if (
        transition !== false &&
        from.routeId !== to.routeId &&
        to.route.handler &&
        to.route.handler.willTransitionTo
      ) {
        transition = to.route.handler.willTransitionTo(to, from);
      }

      return transition;
    }

    _transition(from, to) {
      if (options.method !== 'history') {
        to.url = `#${to.url}`;
      }

      this._transitionFrom(from, to)
          .then(this._transitionTo.bind(this, to))
          .then((transition) => {
            transition = transition !== false;

            if (transition) {
              to.lastRequest = this.getState();

              this.setState(to);
            }
          });
    }

    onInit(state) {
      state.route = router.getRouteById(state.routeId);

      this._transitionTo(state).then((transition) => {
        if (transition !== false) {
          this.setState(state);
        }
      });
    }

    onGo(result) {
      result.route = router.getRouteById(result.routeId);

      this._transition(this.getState(), result);
    }

    onPopState(state) {
      this._transition(this.getState(), state);
    }

    isActive(url) {
      const route = router.getRoute(url);
      const currentId = this.getState().routeId;

      return route && currentId && route.id === currentId;
    }

    getLastRequest() {
      return this.state.lastRequest;
    }

    getRoute() {
      return this.state.route;
    }

    getUrl() {
      return this.state.url;
    }

    getParams() {
      return this.state.params;
    }

    getQuery() {
      return this.state.query;
    }
  };

  return {
    [name] : RouterStore,
  };
};
