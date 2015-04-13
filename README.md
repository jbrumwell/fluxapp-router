# fluxapp-router

A router for fluxapp. Manages the current page state, gives you info about the 
currently opened page and history, and gracefully degrades on non-historyAPI 
and non-js browsers.

### Usage

The router is not to be used directly. After a platform is set in
`fluxApp` it can be required like:

    var router = fluxApp.getRouter();

The current state is kept in a vanilla fluxApp store, which can be
accessed with a `getStore()` method on the `router` object. You will
want to add some watchers to trigger re-renders of your page when the
state changes.

Then inside your views, you need some links that are router-compatible, so that
they don't require your whole page to reload (that would be wasteful):

    var Link = router.components.Link;

    ...

    render: function() {
      return <Link href='/hi'>Hi, I am a link</Link>;


Used this way, this link will trigger a router state change, and if no routing is available
in your browser, will degrade to a simple link. All the properties apart from `force` will be
passed to the internal `<a>` instance transparently.

#### URL patterns

fluxapp-router uses Fluxapp routing internally to expand and match urls. 
Fluxapp uses [path-to-regexp](https://github.com/component/path-to-regexp) and 
if you are wondering how to construct urls, please consult its documentation.

