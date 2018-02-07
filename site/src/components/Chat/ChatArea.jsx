import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Message from './ChatAreaMessage.jsx';

import Utils from '../Utils.js';

export default class ChatArea extends React.Component {

  constructor(props) {
    super(props);

    this.reg_btn = null;
    this.chat_funcs_area = null;
    this.message_area = null;
    this.message_input = null;

    this.state = {
      clearMsgFieldKey: 1
    }
  }

  static defaultProps = {
    siteLoginStatus: false,
    loginStatus: '',
    validateAndSendMessage: () => {},
    deleteMessage: function() {},
    editMessage: function() {},
    messages: []
  };

  static propTypes = {
    siteLoginStatus: PropTypes.bool,
    loginStatus: PropTypes.string,
    validateAndSendMessage: PropTypes.func,
    deleteMessage: PropTypes.func,
    editMessage: PropTypes.func,
    messages: PropTypes.array
  };

  static contextTypes = {
    loginState: PropTypes.object
  };

  drawMessages = () => {
    let messagesProps = Array.isArray(this.props.messages) === true ? this.props.messages.slice() : [];
    let messages = [];
    let align_class = '';

    messagesProps.reverse();
    for (let i = messagesProps.length - 1; i >= 0; i--) {
      let msg = messagesProps[i];
      align_class = (i % 2 === 0 ? 'msg_right' : 'msg_left');

      if (msg.custom) {
        messages.push(<Message className={'message ' + align_class} custom key={(msg._id ? msg._id : i)}>{msg.custom}</Message>);
      } else {
        messages.push(
          <Message
            className={'message ' + align_class}
            allowSenderEdit={(msg.uid === Utils.getlocalStorageItem('uid'))}
            timestamp={msg.timestamp}
            userName={msg.user_name}
            messageId={msg._id}
            editCallback={this.props.editMessage}
            deleteCallback={this.props.deleteMessage}
            key={(msg._id ? msg._id : i)}>
              {msg.message}
        </Message>);
      }
    }
    return messages;
  }

  validateAndSendMessage = (e) => {
    this.props.validateAndSendMessage(e, this.message_input.value);
    this.clearMsgField();
  }

  clearMsgField = () => {
    let currentMsgFieldKey = this.state.clearMsgFieldKey;
    currentMsgFieldKey++
    this.setState({clearMsgFieldKey: currentMsgFieldKey});
  }

  handleKeyUp = (e) => {
    if(e.keyCode === 13) {
      this.validateAndSendMessage();
    }
  }

  render() {
    let messages = this.drawMessages();
    let chatArea = null;

    if(this.props.loginStatus === 'LOGGEDIN') {
      chatArea = <div>
            <div ref={(c) => { this.chat_funcs_area = c; }} id="chat_funcs">
              <input
                ref={(c) => { this.message_input = c; }}
                type="text"
                id="message_input"
                maxLength="1000"
                placeholder="Your message..."
                onKeyUp={this.handleKeyUp}
                key={this.state.clearMsgFieldKey} />
              <input
                type="button"
                id="message_send_btn"
                value="Send"
                onClick={this.validateAndSendMessage} />
            </div>
            <div ref={(c) => { this.message_area = c; }} id="message_area">
              <ReactCSSTransitionGroup
                transitionName="fade"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                  {messages}
              </ReactCSSTransitionGroup>
              <div className="clear"></div>
            </div>
          </div>;
    } else if (this.props.messages.length === 1 && this.props.messages[0].custom) {
      chatArea = <div>
          <div ref={(c) => { this.message_area = c; }} id="message_area">
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
                {messages}
            </ReactCSSTransitionGroup>
            <div className="clear"></div>
          </div>
        </div>;
    } else if (this.props.loginStatus === 'LOADING') {
      chatArea = <div>
        <img className='chat_message_loader' src="./assets/images/loader.svg" alt="Logging in..." width="50" />;
      </div>;
    }

    return chatArea;
  }
}
