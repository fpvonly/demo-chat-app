import React from 'react';
import {render} from 'react-dom';

export default class Chat extends React.Component {

  render() {
    return <div id="chat_area">
    TODO
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

  }
}
