import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Link, Route, IndexRoute, Switch } from 'react-router-dom';
import Header from '../components/Header.jsx'
import Chat from '../components/Chat/Chat.jsx'

export default class App extends React.Component {
  render() {
    return <div>
      <Header />
  		<section className="parallax-window parallax">
  			<div className="parallax_content">
  				<div id="page_load_content">
            {this.props.children}
          </div>
  				<p className="info">index_chat_text</p>
  				<Chat />
    			<div className="footer_content">footer_text</div>
        </div>
  		</section>
    </div>
  }
}
