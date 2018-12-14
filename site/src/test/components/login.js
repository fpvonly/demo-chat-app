const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');

import {Login} from '../../components/Login.jsx';
import LoginContext from '../../views/LoginContext.js';

describe('<Login> component', function() {

  let wrapper;
  let loginStatus;
  let LogInMock = (a, b, status) => {
    loginStatus= status;
  }

  before(() => {

    wrapper = mount(<LoginContext.Provider
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
        <Login logIn={LogInMock} location={ {pathname: '/admin'} } />
    </LoginContext.Provider>);

  }); // ENDS before

  describe('Logged out state', function() {

    it('should have login fields visible', function() {
      expect(wrapper.find('#login_fields').length).to.equal(1);
      expect(wrapper.find('#login_fields form').length).to.equal(1);
      expect(wrapper.find('#login_fields form input[name="admin_username"]').length).to.equal(1);
      expect(wrapper.find('#login_fields form input[name="admin_password"]').length).to.equal(1);
      expect(wrapper.find('#login_fields #log_in_btn').length).to.equal(1);
    });

  });// ENDS Logged out state

  describe('Logging in', function() {

    before(() => {
      wrapper.find('#login_fields form input[name="admin_username"]').instance().value = 'testname';
      wrapper.find('#login_fields form input[name="admin_password"]').instance().value = 'testpass';
      wrapper.find('#login_fields #log_in_btn').simulate('click');
    });

    it('should have correct value from login callback functionality', function() {
      expect(loginStatus).to.equal('login/admin');
    });

  }); // ENDS Logging in

  describe('Logged-in state', function() {

    before(() => {
      wrapper = mount(<LoginContext.Provider
        value={
          {
            loginData: {
              username: 'John Doe',
              user_id: 9990
            },
            loginStatus: true,
            loginError: false
          }
        }>
          <Login logIn={LogInMock} location={ {pathname: '/admin'} } />
      </LoginContext.Provider>);
    });

    it('should have welcome text and a log out -link visible', function() {
      expect(wrapper.find('#login_fields .welcome_text').length).to.equal(1);
      expect(wrapper.find('#login_fields .welcome_text').text()).to.equal('Welcome John Doe');
      expect(wrapper.find('#logout_link').length).to.equal(1);
    });

  }); // ENDS Logged in state

  describe('Simulate log out click', function() {

    before(() => {
      wrapper.find('#logout_link').simulate('click');
    });

    after(() => {
      wrapper.unmount();
    });

    it('should have correct value from logout functionality', function() {
      expect(loginStatus).to.equal('logout');
    });

  }); // ENDS simulate log out

});
