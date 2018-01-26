import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {BrowserRouter, Link, Route, IndexRoute, Switch} from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';

import Server from '../server/server_config.json'
import Translate from '../components/Translate.jsx';
import Header from '../components/Header.jsx'
import Chat from '../components/Chat/Chat.jsx'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.loginData = null;
    this.state = {
      loginStatus: false
    };
  }

  static childContextTypes = {
    loginData: PropTypes.object
  };

  getChildContext() {
    return {loginData: this.loginData};
  }

  componentWillMount() {
    this.logIn(null, null, 'login/status');
  }

  logIn = (uname = null, passw = null, action = 'login/admin', afterLoginFailureCallback = () => {}) => {
    let host = window.location.host;
    let url = '';
    let params = {};

    if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
      url = 'http://localhost:80/';
    } else {
      url = 'http://' + Server.server_domain + ':' + Server.server_port + '/';
    }

    if (uname !== false && passw !== false) {
      params = {
        username: uname,
        password: passw
      }
    }

    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      type: "POST",
      url: url + action,
      data: params,
      success: function(data) {
        if (data.login && data.login === true) {
          this.loginData = data;
          this.setState({loginStatus: true});
        } else if (data.logout && data.logout === true) {
          this.loginData = null;
          this.setState({loginStatus: false});
        } else {
          this.loginData = null;
          this.setState({loginStatus: false}, () => {
            afterLoginFailureCallback();
          });
        }
      }.bind(this),
      dataType: 'json'
    });
  }

  render() {
    const pathName = this.props.location.pathname;
    return <div>
      <Header logIn={this.logIn} loginStatus={this.state.loginStatus} />
  		<section className="parallax-window parallax">
  			<div className="parallax_content">
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeave={false}>
               {React.cloneElement(this.props.children, {key: pathName})}
          </ReactCSSTransitionGroup>
  				<p className="info">
            <Translate id="index_chat_text"/>
          </p>
  				<Chat siteLoginStatus={this.state.loginStatus} />
    			<div className="footer_content">
            &copy; {new Date().getFullYear() + ' Ari Petäjäjärvi'}
            <Translate id="footer_text"/>
          </div>
        </div>
  		</section>
    </div>
  }
}

export default withRouter(App)
