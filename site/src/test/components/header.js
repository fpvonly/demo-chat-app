const React = require('react');
import { BrowserRouter as Router } from 'react-router-dom';
const {expect} = require('chai');
const assert = require('assert');
const {mount} = require('enzyme');

import Header from '../../components/Header.jsx';

describe('<Header> component', function() {
  let logInMock = () => {};
  let ref = null;
  let wrapper = mount(<Router><Header ref={(c) => {ref = c;}} logIn={logInMock} /></Router>);

  after(() => {
    wrapper.unmount();
  });

  it('should have correct html structure', function() {
    assert.equal(wrapper.find('.full_header').first().length, 1);
    assert.equal(wrapper.find('.full_header').find('.wrapper_navi').length, 1);
    assert.equal(wrapper.find('.full_header .wrapper_navi').find('.main_logo').length, 1);
    assert.equal(wrapper.find('.full_header .wrapper_navi .main_logo').find('.logo img').length, 1);
  });

  it('should have correct props', function() {
    expect(ref.props.logIn).to.equal(logInMock);
  });

});
