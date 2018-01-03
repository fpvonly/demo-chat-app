import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import chat from './chat_ws.js';
import ChatLogin from './ChatLogin.jsx';
import ChatArea from './ChatArea.jsx';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.form = null;
    this.state = {
      ONLINE: false,
      messages: []
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    if (typeof WebSocket != "undefined") {
			if(this.getCookie('chat_name') == '' && this.getCookie('email') == '') {
				this.setState({ONLINE: false});
			}	else {
				this.openConnection();
			}
		}
  }

  openConnection = () => {
    if(typeof WebSocket !== "undefined") {
       let host = window.location.host;
       if(host.indexOf('localhost') != -1 || host.indexOf('127.0.0.1') !== -1) {
          this.ws = new WebSocket("ws://localhost:3000/echo");
       } else {
          this.ws = new WebSocket("ws://128.199.45.96:80/echo");
       }

       this.ws.onopen = () => {
         this.setState({ONLINE: true});
      };

      this.ws.onmessage = (evt) => {
        let received_msg = JSON.parse(evt.data);
        let newMessages = this.state.messages.slice();
        newMessages.push(received_msg);

        this.setState({messages: newMessages});
      };

       this.ws.onclose = () => {
          this.setState({ONLINE: false});
       };

      this.ws.onerror = () => {
        this.setState({
          ONLINE: false,
          messages: [{custom: 'Sorry but there seems to be a problem with the chat server.'}]
        });
      };
    }
    else
    {
      this.setState({
        ONLINE: false,
        messages: [{custom: 'Sorry, your browser has no Websocket API support. Update the browser!'}]
      });
    }
  }

  handleKeyUp = (e) => {
    if(e.keyCode === 13) {
      this.validateAndSendMessage();
    }
  }

  sendMessage = (msg) => {
    this.ws.send(msg);
  }

  validateAndSendMessage = () => {
    let msg_input = $.trim( this.form.find('#message_input').val() );
    if(msg_input != '') {
      this.sendMessage( msg_input+';' + this.getCookie('chat_name') + ';' + this.getCookie('email') );
      this.form.find('#message_input').val('');
    }
  }

  setCookie(cname, cvalue, exdays)
  {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }

  getCookie(cname)
  {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
      let c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if(c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }

  render() {
    return <div id="chat_area">
     <form
        ref={(c) => { this.form = $(c); }}
        onKeyUp={this.handleKeyUp}
        onSubmit={(e) => {e.preventDefault();}}
        id="chat_form"
        action="#">
          <ChatLogin
            visible={!this.state.ONLINE}
            setCookie={this.setCookie}
            openConnection={this.openConnection} />
          <ChatArea
            visible={this.state.ONLINE}
            setCookie={this.setCookie}
            getCookie={this.getCookie}
            validateAndSendMessage={this.validateAndSendMessage}
            messages={this.state.messages} />
        </form>
    </div>
  }
}
