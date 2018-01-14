import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';

import Navigation from './menu/Menu.jsx'
import Login from './Login.jsx';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    logIn: () => {},
    loginStatus: false
  };

  static propTypes = {
    logIn: PropTypes.Func,
    loginData: PropTypes.Bool
  };

  static contextTypes = {
    loginData: PropTypes.Bool
  };

  componenWillMount() {
  }

  render() {
    return <header className="full_header">
      <div className="wrapper_navi">
        <div className="main_logo">
          <a href="">
            <img src="./assets/images/logo.png" alt="Web developer" />
          </a>
        </div>
        <Navigation loginStatus={this.props.loginStatus} />
        <Login logIn={this.props.logIn} loginStatus={this.props.loginStatus} />
        <div className="clear"></div>
      </div>
    </header>
  }
}