import React from 'react';
import fluxapp from 'fluxapp';
import _ from 'lodash';

const a = React.DOM.a;

export default React.createClass({
  displayName : 'RouteLink',

  mixins : [ fluxapp.mixins.component ],

  propTypes : {
    to : React.PropTypes.string.isRequired,
    meta : React.PropTypes.object.isRequired,
    onClick : React.PropTypes.func,
  },

  flux : {
    stores : {
      updateCurrentState : 'router',
    },
  },

  getDefaultProps() {
    return {
      meta : {},
    };
  },

  getInitialState() {
    return {
      active : false,
      url : '',
    };
  },

  componentWillReceiveProps(nextProps) {
    if (! _.isEqual(nextProps, this.props)) {
      this._stateFromProps(nextProps);
    }
  },

  componentWillMount() {
    this._stateFromProps(this.props);
  },

  _stateFromProps(props) {
    const router = fluxapp.getRouter();
    const store = this.getStore('router');
    const route = router.build(props.to, props.meta);

    if (route) {
      this.setState({
        url : route.url,
        active : store.isActive(route.url),
      });
    }
  },

  updateCurrentState() {
    const store = this.getStore('router');

    this.setState({
      active : store.isActive(this.state.url),
    });
  },

  onClick(e) {
    var actions = this.getActions('router');

    e.preventDefault();

    actions.go(this.state.url, this.props.meta);
  },

  render() {
    const props = _.extend(
      {
        href : this.state.url,
        onClick : this.onClick,
      },
      _.omit(this.props, ['to', 'meta'])
    );

    if (this.state.active) {
      props.className = props.className ? props.className + ' current' : 'current';
    }

    return a(props);
  },
});
