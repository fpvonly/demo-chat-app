import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Server from '../../server/server_config.json'
import Utils from '../Utils.js';
import ChatLogin from './ChatLogin.jsx';
import ChatArea from './ChatArea.jsx';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.ws = null;
    this.form = null;
    this.state = {
      ONLINE: false,
      messages: []
    }
  }

  static defaultProps = {
    siteLoginStatus: false
  };

  static propTypes = {
    siteLoginStatus: PropTypes.bool
  };

  static contextTypes = {
    loginData: PropTypes.object
  };

  componentDidMount() {
    if (typeof WebSocket !== "undefined") {
			if(Utils.getCookie('chat_name') == '' && Utils.getCookie('email') == '') {
				this.setState({ONLINE: false});
			}	else {
				this.openWSConnection();
			}
		}
  }

  openWSConnection = () => {
    if(typeof WebSocket !== "undefined") {
      if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        this.ws = new WebSocket("ws://localhost:80/echo");
      } else {
        this.ws = new WebSocket("ws://" + Server.server_domain + ":" + Server.server_port + "/echo");
      }

      this.ws.onopen = () => {
         this.setState({ONLINE: true});
      };

      this.ws.onmessage = (evt) => {
        let receivedMsg = JSON.parse(evt.data);
        let newMessages = this.state.messages.slice();
        if(Array.isArray(receivedMsg) === true) {
          newMessages = receivedMsg.concat(newMessages); // array of messages
        } else {
          newMessages = [receivedMsg].concat(newMessages); // single message
        }

        this.setState({messages: newMessages});
      };

       this.ws.onclose = () => {
          this.setState({ONLINE: false});
       };

      this.ws.onerror = () => {
        this.setState({
          ONLINE: false,
          messages: [{custom: 'Sorry but there seems to be a problem with the chat server.', _id: 'custom_err_1'}]
        });
      };
    }
    else
    {
      this.setState({
        ONLINE: false,
        messages: [{custom: 'Sorry, your browser has no Websocket API support. Update the browser!', _id: 'custom_err_2'}]
      });
    }
  }

  sendWSMessage = (msg) => {
    this.ws.send(msg);
  }

  validateAndSendMessage = (e, msgInput) => {
    let msgText = msgInput.trim();
    if(msgText !== '') {
      this.sendWSMessage(msgText+';' + Utils.getCookie('chat_name') + ';' + Utils.getCookie('email'));
    }
  }

  deleteMessage(messageId, e) {
    e.preventDefault();

    if (confirm('Are you sure you want to delete the message?') === true) {
      $.ajax({
        xhrFields: {
          withCredentials: true
        },
        type: "POST",
        url: Utils.getUrl() + 'admin/deletemessage/',
        data: {id: messageId},
        success: function(data) {
          // if the delete was succesful, update the message list
          if (data.deleted && data.deleted === true) {
            let messages = this.state.messages.slice();
            let newMessages = messages.filter(function(message) {
              if (message._id && message._id === messageId) {
                return false;
              }
              return true;
            });
            this.setState({messages: newMessages});
          }
        }.bind(this),
        dataType: 'json'
      });
    }
  }

  render() {
    return <div id="chat_area">
     <form
        id="chat_form"
        action="#"
        ref={(c) => { this.form = c; }}
        onSubmit={(e) => {e.preventDefault();}}>
          <ChatLogin
            visible={!this.state.ONLINE}
            openWSConnection={this.openWSConnection} />
          <ChatArea
            siteLoginStatus={this.props.siteLoginStatus}
            visible={this.state.ONLINE}
            validateAndSendMessage={this.validateAndSendMessage}
            deleteMessage={this.deleteMessage.bind(this)}
            messages={this.state.messages} />
        </form>
    </div>
  }
}
