import React from 'react';
import _ from 'lodash';
import fluxApp from 'fluxapp';

const form = React.DOM.form;

export default React.createClass({
  displayName : 'RouteForm',

  mixins : [ fluxApp.mixins.component ],

  propTypes : {
    to : React.PropTypes.string.isRequired,
    meta : React.PropTypes.object.isRequired,
    onSubmit : React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      meta : {},
      onSubmit : this.onSubmit,
    };
  },

  onSubmit(e) {
    const actions = this.getActions('router');

    e.preventDefault();

    actions.go(this.props.to, this.props.meta);
  },

  render() {
    const props = _.extend({}, _.omit(this.props, ['to', 'meta']));

    return form(props);
  },
});
