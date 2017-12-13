import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter, Link, Route, IndexRoute, Switch } from 'react-router-dom';
import Navigation from '../components/menu/Menu.jsx'
import Chat from '../components/Chat.jsx'

export default class App extends React.Component {
  render() {
    return <div>
      <header className="full_header">
  			<div className="wrapper_navi">
  				<div className="main_logo">
  					<a href="">
  						<img src="./assets/images/logo.png" alt="Web developer - Ari Petäjäjärvi" />
  					</a>
  				</div>
  				<Navigation />

  					<div id="login_fields">
  						<span className="welcome_text">
  							uuuuu
  						</span>
  						<a href="todo/admin/logout" target="_self">Log out</a>
  					</div>

  					<div id="login_fields">
  						<form action="<%- domain %>/admin/login" type="application/x-www-form-urlencoded" method="POST">
  							<input type="text" name="admin_username" placeholder="Username" value="<%= username %>" />
  							<input type="password" name="admin_password" placeholder="Password" value="<%= password %>" />
  							<input type="submit" name="log_in_btn" id="log_in_btn" value="Login" />
  						</form>
  					</div>

  				<div className="clear"></div>
  			</div>
  		</header>

  		<section className="parallax-window parallax">
  			<div className="parallax_content">
  				<div id="page_load_content">
            {this.props.children}
          </div>

  				<p className="info"> index_chat_text</p>

  				<Chat />
    			<div className="footer_content">footer_text</div>
        </div>
  		</section>


        Hello World! 2xxxx5 ddd
    </div>
  }
}
