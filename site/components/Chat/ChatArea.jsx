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
  }

  static propTypes = {
    siteLoginStatus: PropTypes.Bool,
    visible: PropTypes.Boolean,
    validateAndSendMessage: PropTypes.function,
    setCookie: PropTypes.function,
    getCookie: PropTypes.function,
    messages: PropTypes.Array
  };

  static defaultProps = {
    siteLoginStatus: false,
    visible: false,
    validateAndSendMessage: () => {},
    setCookie: function() {},
    getCookie: function() {},
    messages: []
  };

  static contextTypes = {
    loginData: PropTypes.Bool
  };

  componentDidMount() {
  /*  if (this.message_area !== null) {
      this.message_area.find('.message').css('opacity');
      this.message_area.find('.message').css('opacity', '1');
    }*/
  }

  componentDidUpdate(prevProps, prevState) {
    /*if (prevProps.messages !== this.props.messages && this.message_area !== null) {

      this.message_area.find('.message').css('opacity');
      this.message_area.find('.message').css('opacity', '1');
    }*/
  }

  deleteMessage(messageId, e) {
    e.preventDefault();
    let url = '';

    if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
       url = 'http://localhost:3000/';
    } else {
       url = 'TODO';
    }

    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      type: "POST",
      url: url + 'admin/deletemessage/',
      data: {id: messageId},
      success: function(data) {
        if (data.deleted && data.deleted === true) {

          console.log('DELETE', data.deleted);
          //this.setState({loginStatus: true});
        }
      }.bind(this),
      dataType: 'json'
    });
  }

  drawMessages = () => {
    let messagesProps = Array.isArray(this.props.messages) === true ? this.props.messages : [];
    let messages = [];
    let align_class = 'msg_right';

    for (let i = messagesProps.length - 1; i >= 0; i--) {
      let msg = messagesProps[i];
      let deleteBtn = null;
      align_class = (i % 2 === 0 ? 'msg_right' : 'msg_left');

      if (this.context.loginData && this.context.loginData.user_id) {
        deleteBtn = <a href="#" onClick={this.deleteMessage.bind(this, msg._id)}>Delete {msg._id }</a>;
      }

      // if msg is the newest message of top of the array
      if (msg.custom) {
        messages.push(<div className={'message ' + align_class} key={i}><span className="message_text_span">{msg.custom}</span></div>);
      } else {
        messages.push(<div className={'message ' + align_class} key={i}>
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
console.log('RENDER');
    if(this.props.visible === true) {
      chatArea = <div>
            <div ref={(c) => { this.chat_funcs_area = $(c); }} id="chat_funcs">
              <input type="text" name="message_input" id="message_input" maxlength="1000" placeholder="Message"/>
              <input type="button" value="Send" id="message_send_btn" onClick={this.props.validateAndSendMessage} />
            </div>
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
