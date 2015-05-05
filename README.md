# fluxapp-router

A router plugin for [Fluxapp](http://www.github.com/colonyamerican/fluxapp). Manages the current page state, gives you info about the
currently opened page and history, and gracefully degrades on non-historyAPI
and non-js browsers.

## Installation

`npm install --save fluxapp-router`

## Usage

```js
'use strict';

import fluxApp from 'fluxapp';
import fluxAppRouter from 'fluxapp-router';

fluxApp.registerPlugins({
  router: fluxAppRouter,
});
```

## Actions

Fluxapp router exposes a method on the fluxapp context `getRouterActions()` but is also available under the namespace `router` using `getActions('router')`

### go / forward / back

```js
export default React.createClass({
  mixins: [fluxapp.mixins.component],

  statics: {
    willTransitionTo: function() {},
    willTransitionFrom: function() {},
  },

  onBackClick(event) {
    const actions = this.getActions('router');
    const forward = this.state.forward;
    const previous = this.state.previous;
    const options = {};

    if (previous) {
      actions.back();
    } else if (forward) {
      actions.forward();
    } else {
      actions.go('routeid', options);
    }

    event.preventDefault();
  },

})
```

## Components

### Link

```js
import Link from 'react-router/components';

return <Link to="routerid" meta={customOptions} onClick={customOnCLick} />
```

## Options

Options provided should be compatible with those used by fluxapps internal router#build method.  
