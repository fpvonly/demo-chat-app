import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';

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

  static propTypes = {
    siteLoginStatus: PropTypes.Bool,
    visible: PropTypes.Boolean,
    validateAndSendMessage: PropTypes.function,
    deleteMessage: PropTypes.function,
    setCookie: PropTypes.function,
    getCookie: PropTypes.function,
    messages: PropTypes.Array
  };

  static defaultProps = {
    siteLoginStatus: false,
    visible: false,
    validateAndSendMessage: () => {},
    deleteMessage: function() {},
    setCookie: function() {},
    getCookie: function() {},
    messages: []
  };

  static contextTypes = {
    loginData: PropTypes.Object
  };

  drawMessages = () => {
    let messagesProps = Array.isArray(this.props.messages) === true ? this.props.messages.slice() : [];
    let messages = [];
    let align_class = '';

    messagesProps.reverse();
    for (let i = messagesProps.length - 1; i >= 0; i--) {
      let msg = messagesProps[i];
      let deleteBtn = null;
      align_class = (i % 2 === 0 ? 'msg_right' : 'msg_left');

      if (this.context.loginData && this.context.loginData.user_id && msg._id) {
        deleteBtn = <a href="#" className="delete_btn" onClick={this.props.deleteMessage.bind(this, msg._id)}>Delete this message</a>;
      }

      // if msg is the newest message of top of the array
      if (msg.custom) {
        messages.push(<div className={'message ' + align_class} key={(msg._id ? msg._id : i)}><span className="message_text_span">{msg.custom}</span></div>);
      } else {
        messages.push(<div className={'message ' + align_class} key={(msg._id ? msg._id : i)}>
            {msg.timestamp && msg.user_name
              ? <span className="chat_name_span">{this.getCurrentTime(msg.timestamp) + ' "' +  msg.user_name + '" says:'}</span>
              : null}
            <span className="message_text_span">{msg.message}</span>
            <div>{deleteBtn}</div>
          </div>);
      }
    }
    return messages;
  }

  validateAndSendMessage = (e) => {
    this.props.validateAndSendMessage(e, this.message_input.val());
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

  getCurrentTime = (date) => {
  	var d = (date ? new Date(date) : new Date());
  	var offset = (new Date().getTimezoneOffset() / 60) * -1;
  	var n = new Date(d.getTime() + offset);
  	var time = n.getDate() + '.' + (n.getMonth() + 1) + '.' + n.getFullYear() + '  '
      + (n.getHours() < 10 ? '0' : '') + n.getHours() + ':' + (n.getMinutes() < 10 ? '0' : '') + n.getMinutes();
  	return time;
  };

  render() {
    let messages = this.drawMessages();
    let chatArea = null;

    if(this.props.visible === true) {
      chatArea = <div>
            <div ref={(c) => { this.chat_funcs_area = $(c); }} id="chat_funcs">
              <input
                ref={(c) => { this.message_input = $(c); }}
                type="text"
                id="message_input"
                maxLength="1000"
                placeholder="Message"
                onKeyUp={this.handleKeyUp}
                key={this.state.clearMsgFieldKey} />
              <input type="button" value="Send" id="message_send_btn" onClick={this.validateAndSendMessage} />
            </div>
            <div ref={(c) => { this.message_area = $(c); }} id="message_area">
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
    } else if(this.props.visible === false && this.props.messages.length === 1 && this.props.messages[0].custom) {
      chatArea = <div>
          <div ref={(c) => { this.message_area = $(c); }} id="message_area">
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
                {messages}
            </ReactCSSTransitionGroup>
            <div className="clear"></div>
          </div>
        </div>;
    }

    return chatArea;
  }
}
