import React from 'react';
import {render} from 'react-dom';
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
        <a className={indexValueObject.class}
          data-target={indexValueObject.dataTarget}
          target={indexValueObject.target}
          href={indexValueObject.href}>
            {indexValueObject.text}
        </a>
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
