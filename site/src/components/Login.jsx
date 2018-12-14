import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {render} from 'react-dom';

import LoginContext from '../views/LoginContext.js';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.username = null;
    this.password = null;

    this.state = {
      usernameInputError: false,
      passwordInputError: false
    }
  }

  static defaultProps = {
    logIn: () => {}
  };

  static propTypes = {
    logIn: PropTypes.func
  };

  handleLoginClick = (e) => {
    e.preventDefault();

    let usernameInputError = false;
    let passwordInputError = false;
    let uname = this.username.value.trim();
    let passw = this.password.value.trim();

    if (uname === '') {
      usernameInputError = true;
    }
    if (passw === '') {
      passwordInputError = true;
    }

    this.setState({
      usernameInputError: usernameInputError,
      passwordInputError: passwordInputError
    }, () => {
      if (usernameInputError === false && passwordInputError === false)  {
        this.props.logIn(uname, passw, 'login/admin');
      }
    });
  }

  handleLogOutClick = (e) => {
    e.preventDefault();
    this.props.logIn(false, false, 'logout');
  }

  renderFields = (loginContext) => {
    let fields = null;
    
    // if user is succesfully logged in, display welcome message
    if (loginContext.loginStatus === true) {
      fields = <div id="login_fields">
          <span className="welcome_text">
            {'Welcome ' + (loginContext.loginData && loginContext.loginData.username ? loginContext.loginData.username : '')}
            <br />
          </span>
          <a id='logout_link' href="#" onClick={this.handleLogOutClick}>Log out</a>
        </div>;
    } else if (this.props.location.pathname.indexOf('/admin') !== -1) { // else if the user is NOT logged in but is in location /admin, show login fields
      let errorStyle = null;
      if (this.state.usernameInputError === true || this.state.passwordInputError === true || loginContext.loginError === true) {
        errorStyle = {'border':'1px solid red'};
      }

      fields = <div id="login_fields">
          <form action="#">
            <input
              ref={(c) => { this.username = c; }}
              type="text"
              name="admin_username"
              placeholder="Username"
              style={(this.state.usernameInputError === true || loginContext.loginError === true ? errorStyle : null)} />
            <input
              ref={(c) => { this.password = c; }}
              type="password"
              name="admin_password"
              placeholder="Password"
              style={(this.state.passwordInputError === true || loginContext.loginError === true ? errorStyle : null)} />
            <input type="submit" name="log_in_btn" id="log_in_btn" value="Login" onClick={this.handleLoginClick} />
          </form>
        </div>;
    }

    return fields;
  }

  render() {
    return  <LoginContext.Consumer>
      {
        (loginContext) => (
          this.renderFields(loginContext)
        )
      }
      </LoginContext.Consumer>;
  }
}

export default withRouter(Login);
export { Login }; // pure component. used in tests
