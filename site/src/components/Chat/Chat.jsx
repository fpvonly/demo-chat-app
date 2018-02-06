import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Server from '../../../server/server_config.json'
import Utils from '../Utils.js';
import ChatLogin from './ChatLogin.jsx';
import ChatArea from './ChatArea.jsx';

const LOGGEDOUT = 'LOGGEDOUT';
const LOGGEDIN = 'LOGGEDIN';
const LOADING = 'LOADING';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.ws = null;
    this.form = null;
    this.state = {
      STATUS: LOGGEDOUT,
      messages: [] // no redux for chat functionality to keep it easily detachable, so local state implementation for now
    }
  }

  static defaultProps = {
    siteLoginStatus: false
  };

  static propTypes = {
    siteLoginStatus: PropTypes.bool
  };

  static contextTypes = {
    loginState: PropTypes.object
  };

  componentDidMount() {
    if (typeof WebSocket !== "undefined") {
			if(Utils.getlocalStorageItem('chat_name') === '' && Utils.getlocalStorageItem('email') === '') {
				this.setState({STATUS: LOGGEDOUT});
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
         this.setState({STATUS: LOADING});
      };

      this.ws.onmessage = (evt) => {
        let receivedMsg = JSON.parse(evt.data);
        let newMessages = this.state.messages.slice();
        if(Array.isArray(receivedMsg) === true) {
          newMessages = receivedMsg.concat(newMessages); // array of messages
        } else {
          newMessages = [receivedMsg].concat(newMessages); // single message
        }

        if (this.state.STATUS === LOADING) {
          setTimeout(() => {
            this.setState({
              messages: newMessages,
              STATUS: LOGGEDIN
            });
          }, 1000); // more peaceful login animation this way
        } else {
          this.setState({
            messages: newMessages
          });
        }
      };

       this.ws.onclose = () => {
          this.setState({STATUS: LOGGEDOUT});
       };

      this.ws.onerror = () => {
        this.setState({
          STATUS: LOGGEDOUT,
          messages: [{custom: 'Sorry but there seems to be a problem with the chat server.', _id: 'custom_err_1'}]
        });
      };
    }
    else
    {
      this.setState({
        STATUS: LOGGEDOUT,
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
      this.sendWSMessage(msgText+';' + Utils.getlocalStorageItem('chat_name') + ';' + Utils.getlocalStorageItem('email') + ';' + Utils.getlocalStorageItem('uid'));
    }
  }

  deleteMessage = (messageId, e) => {
    e.preventDefault();

    if (confirm('Are you sure you want to delete the message?') === true) {
      Utils.post(
        'admin/deletemessage/',
        {id: messageId},
        (data) => {
          // if the delete was successful, update the message list
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
        }
      );
    }
  }

  editMessage = (messageId, newMessage = '') => {
    return new Promise ((resolve, reject) => {
      Utils.post(
        'admin/editmessage/',
        {
          id: messageId,
          message: newMessage,
          uid: Utils.getlocalStorageItem('uid')
        },
        (data) => {
          // if the edit was succesful, update the message list
          if (data.edited && data.edited === true) {
            let messages = this.state.messages.slice();
            let newMessages = messages.map(function(msg) {
              if (msg._id && msg._id === messageId) {
                msg.message = newMessage;
              }
              return msg;
            });
            this.setState({messages: newMessages}, () => {
              resolve(false);
            });
          } else {
            resolve(true);
          }
        },
        () => {
          resolve(true);
        });
    });
  }

  render() {
    return <div id="chat_area">
     <form
        id="chat_form"
        action="#"
        ref={(c) => { this.form = c; }}
        onSubmit={(e) => {e.preventDefault();}}>
          <ChatLogin
            visible={(this.state.STATUS === LOGGEDOUT || this.state.STATUS === LOADING ? true : false)}
            openWSConnection={this.openWSConnection} />
          <ChatArea
            siteLoginStatus={this.props.siteLoginStatus}
            loginStatus={this.state.STATUS}
            validateAndSendMessage={this.validateAndSendMessage}
            editMessage={this.editMessage}
            deleteMessage={this.deleteMessage}
            messages={this.state.messages} />
        </form>
    </div>
  }
}
