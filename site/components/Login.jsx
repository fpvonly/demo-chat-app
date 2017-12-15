import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Navigation from './menu/Menu.jsx'

export default class Login extends React.Component {

  static defaultProps = {
    visible: false
  };

  static propTypes = {
    visible: PropTypes.Boolean
  };

  render() {
    let fields = null;

    if (this.props.visible === true) {
      fields = <div>
        <div id="login_fields">
          <span className="welcome_text">
            TODOOO!!!
          </span>
          <a href="todo/admin/logout" target="_self">Log out</a>
        </div>

        <div id="login_fields">
          <form action="<%- domain %>/admin/login" type="application/x-www-form-urlencoded" method="POST">
            <input type="text" name="admin_username" placeholder="Username" value="<%= username %>" />
            <input type="password" name="admin_password" placeholder="Password" value="<%= password %>" />
            <input type="submit" name="log_in_btn" id="log_in_btn" value="Login" />
          </form>
        </div>
      </div>;
    }

    return fields;
  }
}
