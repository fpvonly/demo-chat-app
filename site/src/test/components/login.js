const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');
const ReactRouterEnzymeContext = require('react-router-enzyme-context');

import {Login} from '../../components/Login.jsx';

describe('<Login> component', function() {

  let wrapper;
  let loginStatus;

  before(() => {
    const options = new ReactRouterEnzymeContext();
    let LogInMock = (a, b, status) => {
      loginStatus= status;
    }

    wrapper = mount(<Login logIn={LogInMock} loginStatus={false} loginError={false} location={ {pathname: '/admin'} } />, options.get());
    wrapper.setContext({
      loginState: {
        loginData: {
          username: 'John Doe',
          user_id: 9990
        }
      }
    });
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

  describe('Logged in state', function() {

    before(() => {
      wrapper.setProps({
        loginStatus: true
      });
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
