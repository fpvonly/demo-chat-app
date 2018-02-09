import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {NavLink} from 'react-router-dom';
import menu from './menu.json';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    loginStatus: PropTypes.bool
  }

  static defaultProps = {
    loginStatus: false
  }

  getMenuItems = () => {
    let items = [];
    items = menu.menu.map(function(indexValueObject, i) {
      return <li className="navi_list_element" key={i}>
        <NavLink
          to={(indexValueObject.class.indexOf('ext') !== -1
            ? indexValueObject.href
            : '/' + indexValueObject.dataTarget)}
          className={indexValueObject.class}
          activeClassName='main_link_active'
          target={indexValueObject.target === '_blank'
            ? indexValueObject.target
            : undefined }>
              {indexValueObject.text}
        </NavLink>
      </li>;
    });
    return items;
  }

  getAdminLoginLink = () => {
    if (this.props.loginStatus === false) {
      return <li className="navi_list_element">
          <NavLink to="/admin" className="main_link" id="admin_login_link" title="Admin login">
            <img src="../../assets/images/settings-icon.png" />
          </NavLink>
      </li>
    } else {
      return null;
    }
  }

  render() {
    return <nav id="navigation">
      <ul>
        {this.getMenuItems()}
        {this.getAdminLoginLink()}
      </ul>
    </nav>
  }
}
