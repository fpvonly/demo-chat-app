import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import assert from 'assert';

import Utils from '../../src/components/Utils.js';
import Chat from '../../src/components/Chat/Chat.jsx';
const TestServer = require('../chat-test-server.js');

// global window stuff..
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

describe('<Chat> component and sub-components', function() {
  const options = new ReactRouterEnzymeContext();
  let wrapper;

  // set chat login credentials
  Utils.setlocalStorageItem('chat_name', 'John Doe', 86400);

  wrapper = mount(<Chat siteLoginStatus={false} />, options.get());
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
        assert.equal(wrapper.state('STATUS'), 'LOADING');
        wrapper.update(); // force child component to re-render
        done();
      }, 5);
    });

    it('<ChatLogin> should have login fields still visible', function() {
      assert.equal(wrapper.find('#chat_reg').length, 1);
    });

    it('<ChatArea> should have loader icon visible', function() {
      assert.equal(wrapper.find('.chat_message_loader').length, 1);
    });
  });
});
