/* jshint node:true */
'use strict';

var React = require('react/addons');
var router = require('../index');
var _ = require('lodash');

var a = React.DOM.a;


module.exports = React.createClass({

  mixins : [ router._getFluxApp().mixins.component ],

  flux : {
    stores : {
      updateCurrentState : router.getStore()
    }
  },

  updateCurrentState : function updateCurrentState() {
    var store = router.getStore();
    var isCurrent = false;

    if (this.props.href === store.state.current.path) {
      isCurrent = true;
    }

    this.setState({
      isCurrentRoute : isCurrent
    });
  },

  onClick : function(e) {
    e.preventDefault();

    router.go(this.props.href, { force : this.props.force });
  },

  getInitialState : function getInitialState() {
    return {
      isCurrentRoute : false
    };
  },

  componentDidMount : function componentDidMount() {
    this.updateCurrentState();
  },

  render : function() {
    var props = _.clone(this.props);
    delete props.force;

    if (this.state.isCurrentRoute) {
      props.className = 'current';
    }

    if (router.isEnabled()) {
      props.onClick = props.onClick || this.onClick;
    } else {
      delete props.onClick;
    }

    return a(props);
  }
});
