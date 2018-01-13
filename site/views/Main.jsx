import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import { BrowserRouter, Link, Route, IndexRoute, Switch } from 'react-router-dom';
import $ from 'jquery';

import Header from '../components/Header.jsx'
import Chat from '../components/Chat/Chat.jsx'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.loginStatus = false;
  }

  static childContextTypes = {
    loginStatus: PropTypes.Bool
  };

  getChildContext() {
    return {loginStatus: this.loginStatus};
  }

  componentWillMount() {
    this.logIn(null, null, 'login/status');
  }

  logIn = (uname = null, passw = null, action = 'login/admin') => {
    let host = window.location.host;
    let url = '';
    if(host.indexOf('localhost') != -1 || host.indexOf('127.0.0.1') != -1) {
       url = 'http://localhost:3000/';
    } else {
       url = '';
    }

    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      type: "POST",
      url: url + action,
      data: {
        username: uname,
        password: passw
      },
      success: function() {
          this.loginStatus = status;
      }.bind(this),
      dataType: 'json'
    });
  }

  render() {

    return <div>
      <Header logIn={this.logIn}/>
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

export default withRouter(App)
