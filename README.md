# fluxapp-router

A router for fluxapp. Manages the current page state, gives you info about the 
currently opened page and history, and gracefully degrades on non-historyAPI 
and non-js browsers.

### Usage

First you have to initiate the router with instance of fluxApp used by your application:

    var router = require('fluxapp-router').use(require('fluxapp'))

From that point the router will keep info about state changes. The current state is
kept in a vanilla fluxApp store, which can be accessed with a `getStore()` method
on the `router` object. You will want to add some watchers to trigger re-renders of
your page when the state changes.

Then inside your views, you need some links that are router-compatible, so that
they don't require your whole page to reload (that would be wasteful):

    var Link = require('fluxapp-router').components.Link;

    ...

    render: function() {
      return <Link href='/hi'>Hi, I am a link</Link>;


Used this way, this link will trigger a router state change, and if no routing is available
in your browser, will degrade to a simple link. All the properties apart from `force` will be
passed to the internal `<a>` instance transparently.


In order to notify the watchers at the moment of the first page render that the page had renedered,
you have to do

    router.init()

after assigning the watchers with

    router.getStore().addChangeListener(function(change) {
    ...

#### URL patterns

fluxapp-router uses Fluxapp routing internally to expand and match urls. 
Fluxapp uses [path-to-regexp](https://github.com/component/path-to-regexp) and 
if you are wondering how to construct urls, please consult its documentation.

