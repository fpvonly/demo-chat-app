const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');
const ReactRouterEnzymeContext = require('react-router-enzyme-context');
const TestServer = require('../chat-test-server.js');

import Utils from '../../src/components/Utils.js';
import Chat from '../../src/components/Chat/Chat.jsx';

// start chat test server (not the actual production server)
TestServer();

describe('<Chat> component and sub-components', function() {

  after(() => {
    TestServer.stop();
  });

  Utils.setlocalStorageItem('chat_name', 'John Doe', 86400); // set chat login credentials
  const options = new ReactRouterEnzymeContext();

  let wrapper = mount(<Chat siteLoginStatus={false} />, options.get());
  wrapper.setContext({
    loginState: {
      loginData: {
        user_id: 9999 // admin user for activating the delete buttons in ui
      }
    }
  });

  describe('STATE: LOADING', function() {
    it('component state is correct while logging in', (done) =>  {
      setTimeout(() => {
        expect(wrapper.state('STATUS')).to.equal('LOADING');
        wrapper.update(); // force child component to re-render
        done();
      }, 5);
    });

    it('<ChatLogin> should have login fields still visible', function() {
      expect(wrapper.find('#chat_reg').length).to.equal(1);
    });

    it('<ChatArea> should have loader icon visible', function() {
      expect(wrapper.find('.chat_message_loader').length).to.equal(1);
    });
  });
});
