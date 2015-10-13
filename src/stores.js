import Promise from 'bluebird';
import fluxapp from 'fluxapp';

const router = fluxapp.getRouter();

export default (name) => {
  return {
    [name] : {
      actions : {
        onInit : 'router.init',
        afterInit : 'router.init:after',
        onGo : 'router.go',
        onPopState : 'router.popstate',
      },

      getInitialState() {
        return {
          lastRequest : false,
        };
      },

      _transitionFrom : Promise.method(function _transitionFrom(from, to) {
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
      }),

      _transitionTo : Promise.method(function _transitionTo(to, transition) {
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
      }),

      _transition(from, to) {
        this._transitionFrom(from, to)
            .then(this._transitionTo.bind(this, to))
            .then((transition) => {
              transition = transition !== false;

              if (transition) {
                to.lastRequest = this.getState();

                this.setState(to);
              }
            });
      },

      onInit(state) {
        state.route = router.getRouteById(state.routeId);

        this._transitionTo(state).then((transition) => {
          if (transition !== false) {
            this.setState(state);
          }
        });
      },

      onGo(result) {
        result.route = router.getRouteById(result.routeId);

        this._transition(this.getState(), result);
      },

      onPopState(state) {
        this._transition(this.getState(), state);
      },

      isActive(url) {
        const route = router.getRoute(url);
        const currentId = this.getState().routeId;

        return route && currentId && route.id === currentId;
      },

      getLastRequest() {
        return this.state.lastRequest;
      },

      getRoute() {
        return this.state.route;
      },

      getUrl() {
        return this.state.url;
      },

      getParams() {
        return this.state.params;
      },

      getQuery() {
        return this.state.query;
      },
    },
  };
};
