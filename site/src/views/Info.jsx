import React from 'react';
import {render} from 'react-dom';

import Translate from '../components/Translate.jsx';

export default class Info extends React.Component {

  render() {
    return <div className="page_load_content">
        <section className="content_part">
          <Translate id="info_text"/>
          <Translate id="git_url"/>
        </section>
      </div>;
  }
}
