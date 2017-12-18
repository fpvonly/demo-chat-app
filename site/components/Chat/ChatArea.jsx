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

  drawMessages = () => {
    let messagesProps = Array.isArray(this.props.messages) === true ? this.props.messages : [];
    let messages = [];
    let align_class = 'msg_right';

    for (let i = messagesProps.length - 1; i >= 0; i--) {
      let msg = messagesProps[i];
      align_class = (i % 2 === 0 ? 'msg_right' : 'msg_left')
      // if msg is the newest message of top of the array
      if (msg.custom) {
        messages.push(<div className={'message ' + align_class} key={i}><span className="message_text_span">{msg.custom}</span></div>);
      } else {
        messages.push(<div className={'message ' + align_class} key={i}>
            {msg.timestamp && msg.id ? <span className="chat_name_span">{msg.timestamp + ' ' +  msg.id}</span> : null}
            <span className="message_text_span">{msg.message}</span>
          </div>);
      }
//TODO
      /*
      if( this.getCookie( 'utype' ) == '1' )
      {
         this.form.find('#message_area .message .message_delete_link').css('display','inline-block');
      }
      */
    }
    return messages;
  }

  render() {
    let messages = this.drawMessages();
    let chatArea = null;

    if(this.props.visible === true) {
      chatArea = <div>
            <div ref={(c) => { this.chat_funcs_area = $(c); }} id="chat_funcs">
              <input type="text" name="message_input" id="message_input" maxlength="1000" placeholder="Message"/>
              <input type="button" value="Send" id="message_send_btn" onClick={this.props.validateAndSendMessage} />
            </div>
            <div  ref={(c) => { this.message_area = $(c); }} id="message_area">
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
          <div  ref={(c) => { this.message_area = $(c); }} id="message_area">
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
