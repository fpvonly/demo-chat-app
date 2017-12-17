import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import chat from './chat_ws.js';

export default class ChatArea extends React.Component {

  constructor(props) {
    super(props);

    this.reg_btn = null;
    this.chat_funcs_area = null;
  }

  static propTypes = {
    visible: PropTypes.Boolean,
    validateAndSendMessage: PropTypes.function,
    setCookie: PropTypes.function,
    getCookie: PropTypes.function,
    messages: PropTypes.Array
  };

  static defaultProps = {
    visible: false,
    validateAndSendMessage: () => {},
    setCookie: function() {},
    getCookie: function() {},
    messages: []
  };

  drawMessages = () => {

    let messagesProps = Array.isArray(this.props.messages) === true ? this.props.messages : [];
    let messages = [];
    let align_class = 'msg_right';

    for (let i = messagesProps.length - 1; i >= 0; i--) {
      let msg = messagesProps[i];
      align_class = (i % 2 === 0 ? 'msg_right' : 'msg_left')

      messages.push(<div className={'message ' + align_class} style={{'opacity': 1}}>{msg.message}</div>);

      /*
      if( this.getCookie( 'utype' ) == '1' )
      {
         this.form.find('#message_area .message .message_delete_link').css('display','inline-block');
      }
      */
    }

    return messages;
  /*  let messages = this.form.find('#message_area').find('.message');
    let align_class = 'msg_right';
    if( messages.length > 0 )
    {
      if( messages.first().hasClass('msg_right') )
      {
        align_class = 'msg_left';
      }
    }
    this.form.find('#message_area').prepend( '<div class="message ' + align_class + '">'+received_msg+'</div>' );
    this.form.find('#message_area .message').css('opacity');	// this line is needed to get css animation working
    this.form.find('#message_area .message').css('opacity', '1');
    if( this.getCookie( 'utype' ) == '1' )
    {
       this.form.find('#message_area .message .message_delete_link').css('display','inline-block');
    }*/
  }

  render() {
    let messages = this.drawMessages();

    let chatArea = this.props.visible === true
      ? <div>
          <div ref={(c) => { this.chat_funcs_area = $(c); }} id="chat_funcs">
            <input type="text" name="message_input" id="message_input" maxlength="1000" placeholder="Message"/>
            <input type="button" value="Send" id="message_send_btn" onClick={this.props.validateAndSendMessage} />
          </div>
          <div id="message_area">
            {messages}
            <div className="clear"></div>
          </div>
        </div>
      : null;

    return chatArea;
  }
}
