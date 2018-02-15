const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');
const ReactRouterEnzymeContext = require('react-router-enzyme-context');

import Navigation from '../../components/Navigation/Navigation.jsx';

describe('<Navigation> component', function() {

  let wrapper;

  before(() => {
    const options = new ReactRouterEnzymeContext();
    wrapper = mount(<Navigation loginStatus={false} />, options);
  });

  describe('Logged out state', function() {

    it('link has correct html structure', function() {
      expect(wrapper.find('#navigation').length).to.equal(1);

      // sample tests to make sure links are correctly set-up in the component code
      // internal link
      let link = wrapper.find('#navigation .navi_list_element').first().find('a');
      expect(link.instance().className).to.equal('main_link');
      expect(link.instance().href).to.equal('/info');
      expect(link.instance().textContent).to.equal('Info');

      // external link
      link = wrapper.find('#navigation .navi_list_element').at(2).find('a');
      expect(link.instance().className).to.equal('main_link ext');
      expect(link.instance().href).to.equal('https://github.com/fpvonly/demo-chat-app');
      expect(link.instance().textContent).to.equal('GitHub');
    });

    it('it has correct amount of main navigation links', function() {
      expect(wrapper.find('#navigation .navi_list_element').length).to.equal(5);
    });

  });// ENDS Logged out state

  describe('Logged in state', function() {

    before(() => {
      wrapper.setProps({loginStatus: true});
    });

    after(() => {
      wrapper.unmount();
    });

    it('it has correct amount of main navigation links', function() {
      expect(wrapper.find('#navigation .navi_list_element').length).to.equal(4); // no admin login link visible when logged in
    });

  });// ENDS Logged out state

});
