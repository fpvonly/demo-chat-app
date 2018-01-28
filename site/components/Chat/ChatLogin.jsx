import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RFC4122 from 'rfc4122';

import Utils from '../Utils.js';

export default class ChatLogin extends React.Component {

  constructor(props) {
    super(props);

    this.reg_btn = null;
    this.chat_name = null;
    this.email = null;
    this.chat_reg_area = null;

    this.state = {
      nameError: false,
      emailError: false
    }
  }

  static propTypes = {
    visible: PropTypes.bool,
    openWSConnection: PropTypes.func
  };

  static defaultProps = {
    visible: false,
    openWSConnection: () => {}
  };

  handleRegBtnClick = (e) => {
    let nameInputError = false;
    let emailInputError = false;

    let name = this.chat_name.value.trim();
    let email = this.email.value.trim();

    // for now, email is optional
    if(name !== '' /*&& email !== ''*/) {
      if(email === '' || Utils.isValidEmailAddress(email) === true) {        
        let rfc4122 = new RFC4122();
        let uid = rfc4122.v4f();
        Utils.setlocalStorageItem('chat_name', name, 1);
        Utils.setlocalStorageItem('email', email, 1);
        Utils.setlocalStorageItem('uid', uid, 1);
        this.props.openWSConnection();
      } else {
        emailInputError = true;
      }
    } else {
      nameInputError = true;
      // for now, email is optional
      /*if(email === '') {
        emailInputError = true;
      }*/
    }
    this.setState({emailError: emailInputError, nameError: nameInputError});
  }

  handleKeyUp = (e) => {
    if(e.keyCode === 13) {
      this.handleRegBtnClick(e);
    }
  }

  render() {
    let errorStyle = null;
    if (this.state.nameError === true || this.state.emailError === true) {
      errorStyle = {'border':'1px solid red'};
    }

    let chatRegArea = this.props.visible === true
      ? <div ref={(c) => { this.chat_reg_area = c; }} id="chat_reg">
          <input ref={(c) => { this.chat_name = c; }}
            type="text"
            name="chat_name"
            id="chat_name"
            placeholder="Chat name"
            maxLength="20"
            style={(this.state.nameError === true ? errorStyle : null)}
            onKeyUp={this.handleKeyUp} />
          <input ref={(c) => { this.email = c; }}
            type="text"
            name="email"
            id="email"
            placeholder="E-mail (optional)"
            maxLength="40"
            style={(this.state.emailError === true ? errorStyle : null)}
            onKeyUp={this.handleKeyUp} />
          <input ref={(c) => { this.reg_btn = c; }}
            type="button"
            value="Log in"
            id="reg_btn"
            onClick={this.handleRegBtnClick} />
        </div>
      : null;

    return chatRegArea;
  }
}
