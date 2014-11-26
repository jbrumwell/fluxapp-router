/* global describe, it, afterEach, beforeEach, document, sinon, expect, require */
'use strict';

var _ = require('lodash');
var fluxApp = require('fluxapp');
var Dispatcher = fluxApp.getDispatcher();

describe('Router', function() {
  var oldGetRouter;
  var getRouterReturn;
  var router;
  var mock;

  beforeEach(function() {
    oldGetRouter = fluxApp.getRouter;
    getRouterReturn = {
      getRoute : function() {}
    };

    router = require('../lib');
    mock = sinon.mock(getRouterReturn);

    fluxApp.getRouter = function() {
      return getRouterReturn;
    };
  });

  afterEach(function() {
    fluxApp.getRouter = oldGetRouter;

    var store = router.getStore();
    store.state = store.getInitialState();
  });
    

  it('should expose three history management methods', function() {
    expect(_.keys(router)).to.contain('forward');
    expect(_.keys(router)).to.contain('back');
    expect(_.keys(router)).to.contain('go');

  });

  it('should register a route store', function() {
    expect(router.getStore()).to.not.equal(undefined);
  });

  it('start with an empty state', function() {
    var state = router.getStore().state;
    expect(state.history.length).to.equal(0);
    expect(_.keys(state.current).length).to.equal(0);
    expect(state.currentIdx).to.equal(0);
  });

  it('should create a route change action', function() {
    var actions = router.getActions();
    expect(_.keys(actions).length).to.equal(1);
    expect(typeof actions.change).to.equal('function');
  });

  it('should check with fluxApp internal router if a path matches a route', function() {
    mock.expects('getRoute').twice().returns({
      path : '/',
      method : 'GET'
    });

    router.go('/');
    mock.verify();
  });

  it('should dispatch a route.change action if a route was found', function() {
    mock.expects('getRoute').twice().returns({
      path : '/',
      method : 'GET'
    });

    var processToken = Dispatcher.register(function processAction(action) {
      Dispatcher.unregister(processToken);
      expect(action.actionType).to.equal('__ROUTEACTIONS_CHANGE');

      mock.verify();
    });

    router.go('/');
  });

  it('should fail if no route was found', function() {
    mock.expects('getRoute').once().returns(null);

    var processToken = Dispatcher.register(function processAction(action) {
      Dispatcher.unregister(processToken);
      expect(action.actionType).to.equal('__ROUTEACTIONS_CHANGE_FAILED');
      expect(action.payload.message).to.contain("doesn't match");

      mock.verify();
    });

    router.go('/');
  });

  it('should update history state on successful route change', function() {
    mock.expects('getRoute').twice().returns({
      path : '/foo',
      method : 'GET'
    });

    router.go('/foo');

    var routes = router.getStore();
    expect(routes.state.current.path).to.equal('/foo');
    expect(routes.state.currentIdx).to.equal(0);
    expect(routes.state.history.length).to.equal(1);

    mock.verify();
  });

  it('should not enable going to the same route twice', function() {
    mock.expects('getRoute').twice().returns({
      path : '/',
      method : 'GET'
    });
    router.go('/');

    var processToken = Dispatcher.register(function processAction(action) {
      Dispatcher.unregister(processToken);
      expect(action.actionType).to.equal('__ROUTEACTIONS_CHANGE_FAILED');
      expect(action.payload.message).to.contain("cannot be applied twice");
    });

    router.go('/');
    mock.verify();
  });


  it('should enable going to the same route twice with force', function() {
    mock.expects('getRoute').exactly(4).returns({
      path : '/',
      method : 'GET'
    });

    router.go('/');
    var processToken = Dispatcher.register(function processAction(action) {
      Dispatcher.unregister(processToken);
      expect(action.actionType).to.equal('__ROUTEACTIONS_CHANGE');
    });

    router.go('/', { force : true });
    mock.verify();
  });

  it('should move back in history', function() {
    mock.expects('getRoute').exactly(4).returns({
      path : '/',
      method : 'GET'
    });

    router.go('/');
    router.go('/apath');
    router.back();

    var routes = router.getStore();
    expect(routes.state.current.path).to.equal('/');
    expect(routes.state.currentIdx).to.equal(1);
    mock.verify();
  });

  it('should not move back too far', function() {
    mock.expects('getRoute').exactly(4).returns({
      path : '/',
      method : 'GET'
    });

    router.go('/');
    router.go('/somewhere');

    router.back();
    var processToken = Dispatcher.register(function processAction(action) {
      Dispatcher.unregister(processToken);
      expect(action.actionType).to.equal('__ROUTEACTIONS_CHANGE_FAILED');
      expect(action.payload.message).to.contain("Cannot move back");

      var routes = router.getStore().state;
      expect(routes.history.length).to.equal(2);
      expect(routes.currentIdx).to.equal(1);
      expect(_.isEqual(routes.history[routes.currentIdx], routes.current)).to.equal(true);

      mock.verify();
    });

    router.back();
  });

  it('should move forward', function() {
    mock.expects('getRoute').exactly(4).returns({
      path : '/',
      method : 'GET'
    });

    router.go('/');
    router.go('/somewhere');
    router.back();
    router.forward();

    var routes = router.getStore().state;
    expect(routes.history.length).to.equal(2);
    expect(routes.currentIdx).to.equal(0);
    expect(_.isEqual(routes.history[routes.currentIdx], routes.current)).to.equal(true);

    mock.verify();
  });

  it('should not move forward too far', function() {
    var processToken = Dispatcher.register(function processAction(action) {
      Dispatcher.unregister(processToken);
      expect(action.actionType).to.equal('__ROUTEACTIONS_CHANGE_FAILED');
      expect(action.payload.message).to.contain('Cannot move forward');
    });

    router.forward();
  });

  it('should update the state correctly if a new route was requested after being back in history',
      function() {

    mock.expects('getRoute').exactly(6).returns({
      path : '/',
      method : 'GET'
    });

    router.go('/');
    router.go('/somewhere');
    router.back();
    router.go('/another');

    var routes = router.getStore().state;
    expect(routes.history.length).to.equal(2);
    expect(routes.currentIdx).to.equal(0);
    expect(routes.current.path).to.equal('/another');

    mock.verify();
  });

});
