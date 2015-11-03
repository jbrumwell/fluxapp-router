'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fluxapp = require('fluxapp');

var _fluxapp2 = _interopRequireDefault(_fluxapp);

var router = _fluxapp2['default'].getRouter();

function promiseMethod(target, name, descriptor) {
  descriptor.value = _bluebird2['default'].method(descriptor.value);

  return descriptor;
}

exports['default'] = function (name) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { method: 'history' } : arguments[1];

  var RouterStore = (function (_BaseStore) {
    _inherits(RouterStore, _BaseStore);

    function RouterStore() {
      _classCallCheck(this, RouterStore);

      _get(Object.getPrototypeOf(RouterStore.prototype), 'constructor', this).apply(this, arguments);
    }

    _createDecoratedClass(RouterStore, [{
      key: 'getInitialState',
      value: function getInitialState() {
        return {
          lastRequest: false
        };
      }
    }, {
      key: '_transitionFrom',
      decorators: [promiseMethod],
      value: function _transitionFrom(from, to) {
        var transition = true;

        if (to && from && from.routeId !== to.routerId && from.route.handler && from.route.handler.willTransitionFrom) {
          transition = from.route.handler.willTransitionFrom(to, from);
        }

        return transition;
      }
    }, {
      key: '_transitionTo',
      decorators: [promiseMethod],
      value: function _transitionTo(to, transition) {
        var from = this.getState();

        if (transition !== false && from.routeId !== to.routeId && to.route.handler && to.route.handler.willTransitionTo) {
          transition = to.route.handler.willTransitionTo(to, from);
        }

        return transition;
      }
    }, {
      key: '_transition',
      value: function _transition(from, to) {
        var _this = this;

        if (options.method !== 'history') {
          to.url = '#' + to.url;
        }

        this._transitionFrom(from, to).then(this._transitionTo.bind(this, to)).then(function (transition) {
          transition = transition !== false;

          if (transition) {
            to.lastRequest = _this.getState();

            _this.setState(to);
          }
        });
      }
    }, {
      key: 'onInit',
      value: function onInit(state) {
        var _this2 = this;

        state.route = router.getRouteById(state.routeId);

        this._transitionTo(state).then(function (transition) {
          if (transition !== false) {
            _this2.setState(state);
          }
        });
      }
    }, {
      key: 'onGo',
      value: function onGo(result) {
        result.route = router.getRouteById(result.routeId);

        this._transition(this.getState(), result);
      }
    }, {
      key: 'onPopState',
      value: function onPopState(state) {
        this._transition(this.getState(), state);
      }
    }, {
      key: 'isActive',
      value: function isActive(url) {
        var route = router.getRoute(url);
        var currentId = this.getState().routeId;

        return route && currentId && route.id === currentId;
      }
    }, {
      key: 'isHistoryEnabled',
      value: function isHistoryEnabled() {
        return options.method === 'history';
      }
    }, {
      key: 'getLastRequest',
      value: function getLastRequest() {
        return this.state.lastRequest;
      }
    }, {
      key: 'getRoute',
      value: function getRoute() {
        return this.state.route;
      }
    }, {
      key: 'getUrl',
      value: function getUrl() {
        return this.state.url;
      }
    }, {
      key: 'getParams',
      value: function getParams() {
        return this.state.params;
      }
    }, {
      key: 'getQuery',
      value: function getQuery() {
        return this.state.query;
      }
    }], [{
      key: 'actions',
      value: {
        onInit: name + '.init',
        afterInit: name + '.init:after',
        onGo: name + '.go',
        onPopState: name + '.popstate'
      },
      enumerable: true
    }]);

    return RouterStore;
  })(_fluxapp.BaseStore);

  return _defineProperty({}, name, RouterStore);
};

module.exports = exports['default'];