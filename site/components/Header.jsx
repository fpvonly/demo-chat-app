import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';

import Navigation from './Navigation/Navigation.jsx'
import Login from './Login.jsx';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
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

  render() {
    return <header className="full_header">
      <div className="wrapper_navi">
        <div className="main_logo">
          <a className="logo" href="/">
            <img src="./assets/images/logo.png" alt="Click for Home Page - Web Development with Javascript" />
          </a>
        </div>
        <Navigation loginStatus={this.props.loginStatus} />
        <Login logIn={this.props.logIn} loginStatus={this.props.loginStatus} loginError={this.props.loginError}/>
        <div className="clear"></div>
      </div>
    </header>
  }
}
