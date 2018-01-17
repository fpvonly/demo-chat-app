import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {Parser} from 'html-to-react';

import t_en from '../localization/en.json';
//import t_fi from '../localization/fi.json';

export default class Translate extends React.Component {

  constructor(props) {
    super(props);
    this.htmlParser = new Parser();
  }

  static propTypes = {
    id: PropTypes.String,
    lang: PropTypes.String
  };

  static defaultProps = {
    id: '',
    lang: 'en'
  };

  render() {
    let t = null;
    if (this.props.lang === 'fi') {
      // TODO finnish tranlations
      //t = t_fi;
    } else {
      t = t_en;
    }
    return this.htmlParser.parse(t[this.props.id]);
  }
}
