import React from 'react';
import {render} from 'react-dom';
import { NavLink  } from 'react-router-dom';
import menu from './menu.json';

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  getMenuItems = () => {
    let items = [];
    items = menu.menu.map(function(indexValueObject) {
      return <li className="navi_list_element">
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
