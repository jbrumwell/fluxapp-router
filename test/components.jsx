/* global describe, it, afterEach, beforeEach, document, sinon, expect, require */
'use strict';

var _ = require('lodash');
var React = require('react/addons');
var router = require('../lib');

describe('Components', function() {

  var renderedComponent;

  function renderComponent(Component) {
    var elem = document.createElement('div');
    document.body.appendChild(elem);
    return React.render(Component, elem);
  }

  afterEach(function() {
    if (renderedComponent) {
      var elem = renderedComponent.getDOMNode().parentNode;
      React.unmountComponentAtNode(elem);
      document.body.removeChild(elem);
    }
  });

  it('Should expose correct components', function() {
    expect(_.keys(router.components).length).to.equal(2);
    expect(_.keys(router.components)).to.contain('Link');
    expect(_.keys(router.components)).to.contain('Form');
  });

  describe('Link component', function() {
    it('should render a standard <a>', function() {
      renderedComponent = renderComponent(<router.components.Link />);
      var node = renderedComponent.getDOMNode();

      expect(node.tagName).to.equal('A');
    });

    it('should fire a route on click', function() {
      var spy = sinon.spy(router, 'go');
      renderedComponent = renderComponent(
        <router.components.Link href='/that'/>);
      renderedComponent.getDOMNode().click();

      expect(spy.called).to.equal(true);
      router.go.restore();
    });

    it('should propagate a force parameter to router', function() {
      var spy = sinon.spy(router, 'go');
      renderedComponent = renderComponent(
        <router.components.Link href='/that' force={true} />);
      renderedComponent.getDOMNode().click();

      expect(spy.called).to.equal(true);
      expect(spy.args[0][1].force).to.equal(true);

      router.go.restore();
    });

    it('should propagate arbirtary parameters to the rendered node', function() {
      renderedComponent = renderComponent(
        <router.components.Link href='/that' force={true} 
          data-first={3} 
          data-something='else'
          />);
      var node = renderedComponent.getDOMNode();

      expect(node.getAttribute('data-first')).to.equal('3');
      expect(node.getAttribute('data-something')).to.equal('else');
      expect(node.getAttribute('href')).to.equal('/that');
    });

    it('should render the contents correctly', function() {
      renderedComponent = renderComponent(
        <router.components.Link href='/that'>Something</router.components.Link>);
      var node = renderedComponent.getDOMNode();

      expect(node.innerHTML).to.equal('Something');
    });
  });

  describe('Form component', function() {
    it('should call an onSubmit handler on submit', function() {
      var spy = sinon.spy(router, 'go');

      renderedComponent = renderComponent(
        <router.components.Form action='/somewhere' method='post' />);

      renderedComponent.getDOMNode().submit();

      expect(spy.called).to.equal(true);
      expect(spy.args[0][0]).to.equal('/somewhere');
      expect(spy.args[0][1].method).to.equal('post');

      router.go.restore();
    });


    it('should propagate the force parameter');
    it('should set attributes properly');

  });

});
