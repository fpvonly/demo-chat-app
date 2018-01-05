import React from 'react';
import {render} from 'react-dom';
import { NavLink  } from 'react-router-dom';
import menu from './menu.json';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
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

  render() {
    return <nav id="navigation">
      <ul>
        {this.getMenuItems()}
      </ul>
    </nav>
  }
}
