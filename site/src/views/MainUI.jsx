import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {BrowserRouter, Link, Route, IndexRoute, Switch} from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';

import {logIn} from '../redux/actions/login-actions';
import Server from '../../server/server_config.json'
import Utils from '../components/Utils.js';
import Translate from '../components/Translate.jsx';
import Header from '../components/Header.jsx'
import Chat from '../components/Chat/Chat.jsx'
import ClockWidget from '../components/ClockWidget/ClockWidget.jsx'

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    loginState: {
      loginData: null,
      loginStatus: false,
      loginError: false
    } // from store
  };

  static propTypes = {
    loginState: PropTypes.object // from store
  };

  static childContextTypes = {
    loginState: PropTypes.object
  };

  getChildContext() {
    return {loginState: this.props.loginState};
  }

  componentWillMount() {
    this.logIn(null, null, 'login/status');
  }

  logIn = (uname = null, passw = null, action = 'login/admin', afterLoginFailureCallback = () => {}) => {
    let params = {};
    if (uname !== false && passw !== false) {
      params = {
        username: uname,
        password: passw
      }
    }
    this.props.dispatch(logIn(action, params));
  }

  render() {
    const pathName = this.props.location.pathname;

    return <div>
      <Header logIn={this.logIn} loginStatus={this.props.loginState.loginStatus} loginError={this.props.loginState.loginError} />
      <section className="view">
        <div className="view_content">
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeave={false}>
              {React.cloneElement(this.props.children, {key: pathName})}
          </ReactCSSTransitionGroup>
          <p className="info_shout">
            <Translate id="index_chat_text"/>
          </p>
          <Chat siteLoginStatus={this.props.loginState.loginStatus} />
        </div>
      </section>
      <footer>
        &copy; {new Date().getFullYear() + ' Ari Petäjäjärvi'}
        <Translate id="footer_text"/>
      </footer>
      <ClockWidget />
    </div>
  }
}

function mapStateToProps(state) {
  return {
    loginState: state.loginReducer,
  };
}
export default withRouter(connect(mapStateToProps)(App));
