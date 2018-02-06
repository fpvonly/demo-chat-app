import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

const assert = require('assert');
//const Header = require('../../components/Header.jsx');


describe('<Header> component', function() {
  let wrapper;
  let logInMock = function() {};

  it('should have correct tags', function() {
    wrapper = shallow(<div>test</div>);
    assert.equal(wrapper.text(), 'test');
  });
});
