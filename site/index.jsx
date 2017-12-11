import React from 'react';
import {render} from 'react-dom';
import Index from './views/index.jsx';
import Navigation from './components/menu/Menu.jsx'

class App extends React.Component {
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
				<div id="page_load_content"></div>

				<p className="info"> index_chat_text</p>

				<div id="chat_area">
				 <form id="chat_form" action="#" method="POST" enctype="application/x-www-form-urlencoded">
					<div id="chat_reg">
						<input type="text" name="chat_name" id="chat_name" placeholder="Chat name" maxlength="20"/>
						<input type="text" name="email" id="email" placeholder="E-mail" maxlength="40" />
						<input type="button" value="Log in" id="reg_btn" />
					</div>
					<div id="chat_funcs" style={{'display': 'none'}}>
						<input type="text" name="message_input" id="message_input" maxlength="1000" placeholder="Message"/>
						<input type="button" value="Send" id="message_send_btn" />
					</div>
					<div id="message_area">
						<div className="clear"></div>
					</div>
				 </form>
			  </div>
			</div>
			<div className="footer_content">footer_text</div>

		</section>


      <Index />
      Hello World! 2xxxx5 ddd
    </div>
  }
}

render(<App />, document.getElementById('app'));
