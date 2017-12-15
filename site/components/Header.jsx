import React from 'react';
import {render} from 'react-dom';
import Navigation from './menu/Menu.jsx'
import Login from './Login.jsx';

export default class Header extends React.Component {

  render() {
    return <header className="full_header">
      <div className="wrapper_navi">
        <div className="main_logo">
          <a href="">
            <img src="./assets/images/logo.png" alt="Web developer - Ari Petäjäjärvi" />
          </a>
        </div>

        <Navigation />
        <Login />
        
        <div className="clear"></div>
      </div>
    </header>
  }
}
