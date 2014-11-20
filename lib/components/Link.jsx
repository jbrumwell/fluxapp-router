/* jshint node:true */
'use strict';

var React = require('react/addons');
var router = require('../index');
var _ = require('lodash');

var a = React.DOM.a;


module.exports = React.createClass({

  onClick : function(e) {
    e.preventDefault();

    router.go(this.props.href, { force : this.props.force });
  },

  render : function() {
    var props = _.clone(this.props);
    delete props.force;

    props.onClick = props.onClick || this.onClick;
    return a(props);
  }
});
