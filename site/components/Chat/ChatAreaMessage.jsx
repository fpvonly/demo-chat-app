import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';

import Utils from '../Utils.js';

export default class ChatAreaMessage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    }
  }

  static defaultProps = {
    allowSenderEdit: false,
    custom: false,
    messageId: '',
    timestamp: '',
    userName: '',
    className: 'message msg_right',
    deleteCallback: () => {},
    editCallback: () => {}
  };

  static propTypes = {
    allowSenderEdit: PropTypes.bool,
    custom: PropTypes.bool,
    messageId: PropTypes.string,
    timestamp: PropTypes.string,
    userName: PropTypes.string,
    className: PropTypes.string,
    deleteCallback: PropTypes.func,
    editCallback: PropTypes.func
  };

  static contextTypes = {
    loginData: PropTypes.object
  };

  handleEditClick = () => {

    //this.props.editCallback.bind(undefined, this.props.messageId)
    this.setState({
      editMode: true
    });
  }

  render() {
    let message = null;
    let deleteBtn = null;
    let editBtn = null;
    let isAdmin = (this.context.loginData && this.context.loginData.user_id) ? true : false;

    if (this.props.custom  === true) {
      message = <div className={this.props.className}>
        <span className="message_text_span">
          {this.props.children}
        </span>
      </div>;
    } else {
      if (isAdmin === true) {
        deleteBtn = <a href="#" className="delete_btn" onClick={this.props.deleteCallback.bind(undefined, this.props.messageId)}>Delete this message</a>;
      }
      if (isAdmin === true || this.props.allowSenderEdit === true) {
        if (this.state.editMode === false) {
          editBtn = <a href="#" className="edit_btn" onClick={this.handleEditClick.bind(this, this.props.messageId)}>Edit this message</a>;
        } else {
          editBtn = <a href="#" className="save_btn" onClick={this.handleEditClick.bind(this, this.props.messageId)}>Save message</a>;
        }
      }

      message = <div className={this.props.className}>
        {this.props.timestamp && this.props.userName
          ? <span className="chat_name_span">{Utils.getCurrentTime(this.props.timestamp) + ' "' +  this.props.userName + '" says:'}</span>
          : null}
        {(this.state.editMode === false)
            ? <span className="message_text_span">{this.props.children}</span>
            : <textarea defaultValue={this.props.children.toString()} />}
        <div>{deleteBtn}</div>
        <div>{editBtn}</div>
      </div>;
    }

    return message;

  }
}
