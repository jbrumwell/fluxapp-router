/* jshint node:true */
'use strict';

var React = require('react/addons');
var router = require('../index');
var _ = require('lodash');

var store = router.getStore();

var a = React.DOM.a;


module.exports = React.createClass({

  onClick : function(e) {
    e.preventDefault();

    router.go(this.props.href, { force : this.props.force });
  },

  render : function() {
    var props = _.clone(this.props);
    delete props.force;

    if (props.href === store.state.current.path) {
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
