const React = require('react');
const {expect} = require('chai');
const {mount} = require('enzyme');

import ClockWidget from '../../components/ClockWidget.jsx';

describe('<ClockWidget> component', function() {

  let wrapper;
  let loginStatus;

  before(() => {
    wrapper = mount(<ClockWidget />);
  }); // ENDS before


  describe('Has correct html structure', function() {

    it('should have login fields visible', function() {
      expect(wrapper.find('.widget_clock').length).to.equal(1);
      // spinner handle stuff
      expect(wrapper.find('.widget_clock').find('.bg').length).to.equal(1);
      expect(wrapper.find('.widget_clock').find('.bg_color').length).to.equal(1);
      expect(wrapper.find('.widget_clock').find('.bg').childAt(1).instance().className).to.equal('handle');
      // date and time stuff
      expect(wrapper.find('.widget_clock').find('.inner_circle').length).to.equal(1);
      expect(wrapper.find('.widget_clock').find('.inner_circle').childAt(0).instance().className).to.equal('date_wrapper');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(0).instance().className).to.equal('day');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(1).instance().className).to.equal('divider');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(2).instance().className).to.equal('month');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(3).instance().className).to.equal('divider');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(4).instance().className).to.equal('year');
      expect(wrapper.find('.widget_clock').find('.inner_circle').childAt(1).instance().className).to.equal('time_wrapper');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(0).instance().className).to.equal('hours');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(1).instance().className).to.equal('divider');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(2).instance().className).to.equal('minutes');
      expect(wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(3).instance().className).to.equal('seconds_display');
    });

  });// ENDS Has correct html structure


  describe('Functionality', function() {
    let timeState = null;
    let day = null;
    let month = null;
    let year = null;
    let hours = null;
    let minutes = null;
    let seconds = null;
    let originalSpinnerPos = null;

    before(() => {
      timeState = wrapper.state();
      day = wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(0);
      month = wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(2);
      year = wrapper.find('.widget_clock').find('.inner_circle').find('.date_wrapper').childAt(4);
      hours = wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(0);
      minutes = wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(2);
      seconds = wrapper.find('.widget_clock').find('.inner_circle').find('.time_wrapper').childAt(3);
    });

    it('timer should be running', function(done) {
      setTimeout(() => {
        expect(wrapper.state()).to.not.equal(timeState);

        // UI
        // date
        expect(day.text()).to.equal(timeState.day.toString());
        expect(month.text()).to.equal(timeState.month.toString());
        expect(year.text()).to.equal(timeState.year.toString());
        // clock time
        expect(hours.text()).to.equal(timeState.hours.toString());
        expect(minutes.text()).to.equal(timeState.minutes.toString());
        expect(seconds.text()).to.not.equal(timeState.seconds.toString());
        done();
      }, 1100);
    });

  });// ENDS Functionality

});
