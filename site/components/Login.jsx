import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {render} from 'react-dom';
import $ from 'jquery';

import Navigation from './menu/Menu.jsx'

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.username = null;
    this.password = null;

    this.state = {
      loggedIn: false
    }
  }

  static defaultProps = {
    logIn: () => {}
  };

  static propTypes = {
    logIn: PropTypes.Func
  };

  handleLoginClick = (e) => {
    let uname = this.username.val();
    let passw = this.password.val()
    if ($.trim(passw) !== '' && $.trim(uname) !== '')  {
      //TODO
      this.setState({loggedIn: true}, () => {
        this.props.logIn(uname, passw);
      });
    }    
  }

  handleLogOutClick = (e) => {
    e.preventDefault();
    //TODO
    this.setState({loggedIn: false}, () => {
      this.props.logIn(this.state.loggedIn);
    });
  }

  render() {
    let fields = null;

    // if user is succesfully logged in, display welcome message
    if (this.state.loggedIn === true) {
      fields = <div id="login_fields">
          <span className="welcome_text">
            TODOOO!!!
          </span>
          <a href="#" onClick={this.handleLogOutClick}>Log out</a>
        </div>;
    } // else if user us NOT loggedin but is in location /admin, show login fields
    else if (this.props.location.pathname.indexOf('/admin') !== -1) {
      fields = <div id="login_fields">
          <form action="#">
            <input ref={(c) => { this.username = $(c); }} type="text" name="admin_username" placeholder="Username" />
            <input ref={(c) => { this.password = $(c); }} type="password" name="admin_password" placeholder="Password" />
            <input type="submit" name="log_in_btn" id="log_in_btn" value="Login" onClick={this.handleLoginClick} />
          </form>
        </div>;
    }

    return fields;
  }
}

export default withRouter(Login)
