import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import { BrowserRouter, Link, Route, IndexRoute, Switch } from 'react-router-dom';
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

  loggedIn = (status) => {
    this.loginStatus = status;
  }

  render() {

    return <div>
      <Header loggedIn={this.loggedIn}/>
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
