import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

const assert = require('assert');
import Header from '../../src/components/Header.jsx';


describe('<Header> component', function() {
  this.jsdom = require('jsdom-global')();
  const options = new ReactRouterEnzymeContext();

  let wrapper;
  let logInMock = function() {};

  wrapper = mount(<Header loginStatus={true} loginError={false} logIn={logInMock} />, options.get());

  it('should have correct html structure', function() {
    assert.equal(wrapper.find('.full_header').first().length, 1);
    assert.equal(wrapper.find('.full_header').find('.wrapper_navi').length, 1);
    assert.equal(wrapper.find('.full_header .wrapper_navi').find('.main_logo').length, 1);
    assert.equal(wrapper.find('.full_header .wrapper_navi .main_logo').find('.logo img').length, 1);
  });

  it('should have correct props', function() {
    expect(wrapper.prop('loginStatus')).to.equal(true);
    expect(wrapper.prop('loginError')).to.equal(false);
    expect(wrapper.prop('logIn')).to.equal(logInMock);
  });

});
