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
    logIn: () => {}
  };

  static propTypes = {
    logIn: PropTypes.Func
  };

  static contextTypes = {
    loginStatus: PropTypes.Bool
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
        <Navigation />
        <Login logIn={this.props.logIn} />
        <div className="clear"></div>
      </div>
    </header>
  }
}
