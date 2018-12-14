const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');
import { BrowserRouter as Router } from 'react-router-dom';

import Navigation from '../../components/Navigation/Navigation.jsx';
import LoginContext from '../../views/LoginContext.js';

describe('<Navigation> component', function() {

  let wrapper;

  before(() => {
    wrapper = mount(<Router>
      <LoginContext.Provider
        value={
          {
            loginData: {
              username: null,
              user_id: null
            },
            loginStatus: false,
            loginError: false
          }
        }>
          <Navigation />
    </LoginContext.Provider>
  </Router>);
  });

  describe('Logged out state', function() {

    it('link has correct html structure', function() {
      expect(wrapper.find('#navigation').length).to.equal(1);

      // sample tests to make sure links are correctly set-up in the component code
      // internal link
      let link = wrapper.find('#navigation .navi_list_element').first().find('a');
      expect(link.instance().className).to.equal('main_link');
      expect(link.instance().href).to.equal('https://localhost/info');
      expect(link.instance().textContent).to.equal('Info');

      // external link
      link = wrapper.find('#navigation .navi_list_element').at(2).find('a');
      expect(link.instance().className).to.equal('main_link ext');
      expect(link.instance().href).to.equal('https://github.com/fpvonly/');
      expect(link.instance().textContent).to.equal('GitHub');
    });

    it('it has correct amount of main navigation links', function() {
      expect(wrapper.find('#navigation .navi_list_element').length).to.equal(6);
    });

  });// ENDS Logged out state

  describe('Logged in state', function() {

    before(() => {
      wrapper = mount(<Router>
        <LoginContext.Provider
          value={
            {
              loginData: {
                username: 'test',
                user_id: 'a12312313'
              },
              loginStatus: true,
              loginError: false
            }
          }>
            <Navigation />
      </LoginContext.Provider>
    </Router>);
    });

    after(() => {
      wrapper.unmount();
    });

    it('it has correct amount of main navigation links', function() {
      expect(wrapper.find('#navigation .navi_list_element').length).to.equal(5); // no admin login link visible when logged in
    });

  });// ENDS Logged out state

});
