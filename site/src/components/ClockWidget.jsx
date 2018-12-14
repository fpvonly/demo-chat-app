import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Utils from './Utils';

export default class ClockWidget extends React.Component {
  constructor(props) {
    super(props);

    this.widget = null;
    this.bgRotate = null;
    this.bg = null;
    this.interval = null;
    this.storagePos = {
      'left': 50,
      'top': 50
    };
    this.spinnerPos = {'opacity': 0.76, 'transform': 'rotate(-87.5deg)'};

    this.state = {
      hours: '00',
      minutes: '00',
      seconds: '00',
      day: '',
      month: '',
      year: ''
    };
  }

  componentDidMount() {
    let widgetPosStorage = Utils.getlocalStorageItem('widgetClockPosition');
    if (widgetPosStorage !== '') {
      widgetPosStorage = JSON.parse(widgetPosStorage);
      this.storagePos = {
        'left': widgetPosStorage.left,
        'top': widgetPosStorage.top
      };
    }

    this.tickTock();
    window.addEventListener("resize", this.handleWindowResize, false);

    this.storagePos = this.overridePositionIfNotVisible(this.storagePos);
    this.interval = setInterval(this.tickTock, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("resize", this.handleWindowResize, false);
  }

  handleWindowResize = () => {
    let widgetPosStorage = Utils.getlocalStorageItem('widgetClockPosition');
    if (widgetPosStorage !== '') {
      widgetPosStorage = JSON.parse(widgetPosStorage);
      this.storagePos = this.overridePositionIfNotVisible(widgetPosStorage);
    } else {
      this.storagePos = this.overridePositionIfNotVisible(this.storagePos);
    }
  }

  tickTock = () => {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let day = currentTime.getDate();
    let month = currentTime.getMonth() + 1;
    let year = currentTime.getFullYear();

    this.setState({
      hours: (hours < 10 ? '0' + hours : hours),
      minutes: (minutes < 10 ? '0' + minutes : minutes),
      seconds: (seconds < 10 ? '0' + seconds : seconds),
      day: day,
      month: month,
      year: year
    });
  }

  // WIDGET POSITION DRAGGING ->
  handleWidgetDragStart = (e) => {
    window.addEventListener("mousemove", this.handleWidgetDrag, false);
    window.addEventListener("mouseup", this.handleWidgetDragEnd, false);
  }

  handleWidgetDrag = (e) => {
    let leftPos = e.pageX - $(this.widget).width()/2;
    let topPos = e.pageY - $(this.widget).height()/2 - window.pageYOffset;
    this.storagePos = {
      'left': leftPos,
      'top': topPos
    };
    $(this.widget).css(this.storagePos);
  }

  handleWidgetDragEnd = (e) => {
    Utils.setlocalStorageItem('widgetClockPosition', JSON.stringify(this.storagePos)); // save the  original drop position even if out of bounds
    this.storagePos = this.overridePositionIfNotVisible(this.storagePos);
    $(this.widget).css(this.storagePos);
    window.removeEventListener("mousemove", this.handleWidgetDrag, false);
  }
  // <- END WIDGET POSITION DRAGGING

  // SPINNER HANDLE POSITION DRAGGING ->
  handleSpinnerDragStart = (e) => {
    e.stopPropagation();
    window.addEventListener("mousemove", this.handleSpinnerDrag, false);
    window.addEventListener("mouseup", this.handleSpinnerDragEnd, false);
  }

  handleSpinnerDrag = (e) => {
    let cssValues = this.calculateSpinnerDragStyles(e);
    Utils.setlocalStorageItem('widgetClockSpinner', JSON.stringify(cssValues));
    $(this.bgRotate).css({'transform': cssValues['transform']});
    $(this.bg).css({'opacity': cssValues['opacity']});
  }

  handleSpinnerDragEnd = (e) => {
    window.removeEventListener("mousemove", this.handleSpinnerDrag, false);
  }
  // <- END SPINNER HANDLE POSITION DRAGGING

  calculateSpinnerDragStyles = (e) => {
    let cssValues = this.spinnerPos; // defaults
    let widgetSpinnerSettings = Utils.getlocalStorageItem('widgetClockSpinner');
    if (widgetSpinnerSettings !== '') {
      widgetSpinnerSettings = JSON.parse(widgetSpinnerSettings);
      if (widgetSpinnerSettings && widgetSpinnerSettings.opacity && widgetSpinnerSettings.transform) {
        cssValues['opacity'] = widgetSpinnerSettings.opacity;
        cssValues['transform'] = widgetSpinnerSettings.transform;
      }
    }

    if (e) {
      let wrapper = $(this.widget);
      let wrapperCenter = [wrapper.offset().left + wrapper.width()/2, wrapper.offset().top + wrapper.height()/2];
      let angle = Math.atan2(e.pageX - wrapperCenter[0], - (e.pageY - wrapperCenter[1])) * (180/Math.PI);
      let opacity = 0;

      if (angle >= 0 && angle <= 180) {
        opacity = (angle/180)/2;
      } else if (angle < 0 && angle >= -180) {
        opacity = (1 - (Math.abs(angle)/180)/2);
      }
      cssValues['opacity'] = opacity;
      cssValues['transform'] = 'rotate(' + angle + 'deg)';
    }

    return cssValues;
  }

  overridePositionIfNotVisible = (currentPosition) => {
    let newPos= {
      left: currentPosition.left,
      top: currentPosition.top
    }

    if (currentPosition.left < 0) {
      newPos.left = 20;
    }
    if (currentPosition.left > window.innerWidth - $(this.widget).width()) {
      newPos.left = window.innerWidth - $(this.widget).width() - 20;
    }
    if (currentPosition.top < 0) {
      newPos.top = 20;
    }
    if (currentPosition.top > window.innerHeight - $(this.widget).height()) {
      newPos.top = window.innerHeight - $(this.widget).height() - 20;
    }

    return newPos;
  }

  render() {
    return <div ref={(c) => { this.widget = c;}} className='widget_clock' onMouseDown={this.handleWidgetDragStart} style={this.storagePos}>
      <div ref={(c) => { this.bgRotate = c;}} className='bg' style={{'transform': this.calculateSpinnerDragStyles()['transform']}}>
        <div ref={(c) => { this.bg = c;}} className='bg_color' style={{'opacity': this.calculateSpinnerDragStyles()['opacity']}} />
        <div className='handle' onMouseDown={this.handleSpinnerDragStart} />
      </div>
      <div className='inner_circle'>
        <div className='date_wrapper'>
          <span className='day'>{this.state.day}</span>
          <span className='divider'>.</span>
          <span className='month'>{this.state.month}</span>
          <span className='divider'>.</span>
          <span className='year'>{this.state.year}</span>
        </div>
        <div className='time_wrapper'>
          <span className='hours'>{this.state.hours}</span>
          <span className='divider'>:</span>
          <span className='minutes'>{this.state.minutes}</span>
          <div className='seconds_display'>
            {this.state.seconds}
          </div>
        </div>
      </div>
    </div>;
  }
}
