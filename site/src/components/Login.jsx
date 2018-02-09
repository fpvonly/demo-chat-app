import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {render} from 'react-dom';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.username = null;
    this.password = null;

    this.state = {
      loggedIn: false,
      usernameInputError: false,
      passwordInputError: false
    }
  }

  static defaultProps = {
    logIn: () => {},
    loginStatus: false,
    loginError: false
  };

  static propTypes = {
    logIn: PropTypes.func,
    loginStatus: PropTypes.bool,
    loginError: PropTypes.bool
  };

  static contextTypes = {
    loginState: PropTypes.object
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

  render() {
    let fields = null;
    let loginState = this.context.loginState;

    // if user is succesfully logged in, display welcome message
    if (this.props.loginStatus === true) {
      fields = <div id="login_fields">
          <span className="welcome_text">
            {'Welcome ' + (loginState.loginData && loginState.loginData.username ? loginState.loginData.username : '')}
            <br />
          </span>
          <a id='logout_link' href="#" onClick={this.handleLogOutClick}>Log out</a>
        </div>;
    } // else if user us NOT loggedin but is in location /admin, show login fields
    else if (this.props.location.pathname.indexOf('/admin') !== -1) {
      let errorStyle = null;
      if (this.state.usernameInputError === true || this.state.passwordInputError === true || this.props.loginError === true) {
        errorStyle = {'border':'1px solid red'};
      }

      fields = <div id="login_fields">
          <form action="#">
            <input
              ref={(c) => { this.username = c; }}
              type="text"
              name="admin_username"
              placeholder="Username"
              style={(this.state.usernameInputError === true || this.props.loginError === true ? errorStyle : null)} />
            <input
              ref={(c) => { this.password = c; }}
              type="password"
              name="admin_password"
              placeholder="Password"
              style={(this.state.passwordInputError === true || this.props.loginError === true ? errorStyle : null)} />
            <input type="submit" name="log_in_btn" id="log_in_btn" value="Login" onClick={this.handleLoginClick} />
          </form>
        </div>;
    }

    return fields;
  }
}

export default withRouter(Login);
export { Login }; // pure component. used in tests
