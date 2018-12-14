import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {NavLink} from 'react-router-dom';

import menu from './menu.json';
import LoginContext from '../../views/LoginContext.js';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  getMenuItems = () => {
    let items = [];
    items = menu.menu.map(function(indexValueObject, i) {
      if (indexValueObject.class.indexOf('ext') !== -1) {
        return <li className="navi_list_element" key={i}>
          <a href={indexValueObject.href}
            className={indexValueObject.class}
            target={indexValueObject.target === '_blank'
              ? indexValueObject.target
              : undefined}>
                {indexValueObject.text}
          </a>
        </li>;
      } else {
        return <li className="navi_list_element" key={i}>
          <NavLink
            to={'/' + indexValueObject.dataTarget}
            className={indexValueObject.class}
            activeClassName='main_link_active'
            target={indexValueObject.target === '_blank'
              ? indexValueObject.target
              : undefined}>
                {indexValueObject.text}
          </NavLink>
        </li>;
      }
    });
    return items;
  }

  getAdminLoginLink = (loginContext) => {
    if (loginContext.loginStatus === false) {
      return <li className="navi_list_element">
          <NavLink to="/admin" className="main_link admin_login_link" title="Admin login">
            <img src="../../assets/images/settings-icon.png" />
          </NavLink>
      </li>
    } else {
      return null;
    }
  }

  render() {
    return <LoginContext.Consumer>
        {
          (loginContext) => (
            <nav id="navigation">
              <ul>
                {this.getMenuItems()}
                {this.getAdminLoginLink(loginContext)}
              </ul>
            </nav>
          )
        }
      </LoginContext.Consumer>;
  }
}
