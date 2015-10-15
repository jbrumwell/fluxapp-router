export default (name) => {
  return {
    getRouterStore() {
      return this.getStore(name);
    },

    getRouterActions() {
      return this.getActions(name);
    },

    registerRouteHandler(handler) {
      const store = this.getStore(name);

      store.addChangeListener(handler);

      return this;
    },
  };
};