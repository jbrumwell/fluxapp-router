/* jshint node:true */
'use strict';

var React = require('react');
var fluxApp = require('fluxapp');
var _ = require('lodash');

var a = React.DOM.a;


module.exports = React.createClass({
  displayName: 'RouteLink',

  mixins : [ fluxApp.mixins.component ],

  propTypes: {
    to: React.PropTypes.string.isRequired,
    meta: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func,
  },

  flux: {
    stores: {
      updateCurrentState: 'router'
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      meta: {},
    }
  },

  getInitialState: function getInitialState() {
    return {
      active: false,
      route: '',
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (! _.isEqual(nextProps, this.props)) {
      this._stateFromProps(nextProps);
    }
  },

  componentWillMount: function componentWillMount() {
    this._stateFromProps(this.props);
  },

  _stateFromProps: function _stateFromProps(props) {
    var router = fluxApp.getRouter();
    var store = this.getStore('router');
    var route = router.build(props.to, props.meta);

    this.setState({
      url: route.url,
      active: store.isActive(route.url)
    });
  },

  updateCurrentState: function updateCurrentState() {
    var store = this.getStore('router');
    var route = store.state.route;

    this.setState({
      active: store.isActive(this.state.url)
    });
  },

  onClick: function onClick(e) {
    var actions = this.getActions('router');

    e.preventDefault();

    actions.go(this.state.url, this.props.meta);
  },

  render: function render() {
    var props = _.extend(
      {
        href: this.state.url,
        onClick: this.onClick
      },
      _.omit(this.props, ['to', 'meta'])
    );

    if (this.state.active) {
      props.className = props.className ? props.className + ' current' : 'current';
    }

    return a(props);
  }
});
