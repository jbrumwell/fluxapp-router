import stores from './stores';
import actions from './actions';
import contextMethods from './context-methods';

export default (options) => {
  return (fluxapp, name) => {
    return {
      stores : stores(name),
      actions : actions(name, options),
      contextMethods : contextMethods(name),
    };
  };
};
