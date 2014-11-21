/* jshint node:true */
'use strict';

var React = require('react/addons');
var router = require('../index');
var _ = require('lodash');

var form = React.DOM.form;


module.exports = React.createClass({

  onSubmit : function handleSubmit(e) {
    e.preventDefault();

    router.go(this.props.action, { 
      method : this.props.method, 
      force  : this.props.force,
      refs   : this.refs
    });
  },

  render : function render() {
    var props = _.clone(this.props);
    delete props.force;

    props.onSubmit = this.onSubmit;
    return form(props);
  }
});
