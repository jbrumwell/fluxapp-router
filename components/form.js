/* jshint node:true */
'use strict';

var React = require('react');
var _ = require('lodash');
var fluxApp = require('fluxapp');

var form = React.DOM.form;

module.exports = React.createClass({
  displayName: 'RouteForm',

  mixins : [ fluxApp.mixins.component ],

  propTypes: {
    to: React.PropTypes.string.isRequired,
    meta: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function getDefaultProps() {
    return {
      meta: {},
      onSubmit: this.onSubmit,
    }
  },

  onSubmit : function handleSubmit(e) {
    var actions = this.getActions('router');

    e.preventDefault();

    actions.go(this.props.to, this.props.meta);
  },

  render : function render() {
    var props = _.extend({}, _.omit(this.props, ['to', 'meta']));

    return form(props);
  }
});
