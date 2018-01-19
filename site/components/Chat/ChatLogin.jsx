import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

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
    visible: PropTypes.Boolean,
    openWSConnection: PropTypes.function,
    setCookie: PropTypes.function,
    getCookie: PropTypes.function
  };

  static defaultProps = {
    visible: false,
    openWSConnection: () => {},
    setCookie: function() {},
    getCookie: function() {}
  };

  isValidEmailAddress( emailAddress ) {
    let pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test( emailAddress );
  };

  handleRegBtnClick = (e) => {
    let nameInputError = false;
    let emailInputError = false;

    let name = this.chat_name.value.trim();
    let email = this.email.value.trim();

    // for now, email is optional
    if(name !== '' /*&& email !== ''*/) {
      if(email === '' || this.isValidEmailAddress(email) === true) {
        this.props.setCookie('chat_name', name, 1);
        this.props.setCookie('email', email, 1);
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
