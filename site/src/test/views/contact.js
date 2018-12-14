const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');

import {Contact} from '../../views/Contact.jsx';

describe('<Contact> view', function() {

  let action = false;
  let dispatchMock = (actionFunction) => { action = actionFunction; };

  let wrapper = mount(<Contact contactFormState={ {inProgress: false, formSent: false, sendError: false} } dispatch={dispatchMock}/>);

  it('should have correct html structure', function() {
    expect(wrapper.find('#contact_area').length).to.equal(1);
    expect(wrapper.find('#contact_area').find('.info').length).to.equal(1);
    expect(wrapper.find('#contact_area').find('#contact_form').length).to.equal(1);
    expect(wrapper.find('#contact_area').find('#contact_btn').length).to.equal(1);
  });

  describe('Simulated contact form send with no input content', function() {

    before(() => {
      wrapper.find('#contact_area #contact_btn').simulate('click');
    });

    it('form not sent', function() {
      expect(wrapper.state('inProgress')).to.equal(false);
      expect(action).to.equal(false);
    });

  }); // ENDS Simulated contact form send with no input content

  describe('Simulated contact form send with only name inputted', function() {

    before(() => {
      wrapper.find('#contact_area #contact_name').instance().value = 'Test name';
      wrapper.find('#contact_area #contact_btn').simulate('click');
    });

    it('form not sent', function() {
      expect(wrapper.state('inProgress')).to.equal(false);
      expect(action).to.equal(false);
    });

  }); // ENDS Simulated contact form send with only name inputted

  describe('Simulated contact form send with only name and email inputted', function() {

    before(() => {
      wrapper.find('#contact_area #contact_name').instance().value = 'Test name';
      wrapper.find('#contact_area #contact_email').instance().value = 'emial@email.com';
      wrapper.find('#contact_area #contact_btn').simulate('click');
    });

    it('form not sent', function() {
      expect(wrapper.state('inProgress')).to.equal(false);
      expect(action).to.equal(false);
    });

  }); // ENDS Simulated contact form send with only name and email inputted

  describe('Simulated contact form send with name, email and message text inputted', function() {

    before(() => {
      wrapper.find('#contact_area #contact_name').instance().value = 'Test name';
      wrapper.find('#contact_area #contact_email').instance().value = 'emial@email.com';
      wrapper.find('#contact_area #contact_message').instance().value = 'Test message';
      wrapper.find('#contact_area #contact_btn').simulate('click');
    });

    it('loader icon visible', function() {
      expect(wrapper.find('.contact_form_loader').length).to.equal(1);
    });

    it('form sending activated', function() {
      expect(wrapper.state('inProgress')).to.equal(true);
      expect(typeof action).to.equal('function');
    });

  }); // ENDS Simulated contact form send with name and email and message etxt inputted

  describe('Form state after sending the form', function() {

    before(() => {
      wrapper.setProps({ contactFormState: { inProgress: false, formSent: true, sendError: false } });
    });

    it('loader icon is NOT visible anymore', function() {
      expect(wrapper.find('.contact_form_loader').length).to.equal(0);
    });

    it('contact form is not displayed anymore', function() {
      expect(wrapper.state('inProgress')).to.equal(false);
      expect(wrapper.find('#contact_form').length).to.equal(0);
    });

    it('thank you message is displayed', function() {
      expect(wrapper.find('.contact_thanks').length).to.equal(1);
    });

  }); // ENDS Form state after sending the form

});
