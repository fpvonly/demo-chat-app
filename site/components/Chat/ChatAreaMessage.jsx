import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Utils from '../Utils.js';

export default class ChatAreaMessage extends React.Component {

  constructor(props) {
    super(props);

    this.editMessageTextarea = null;
    this.state = {
      editMode: '',
      saveError: false
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

  handleEditClick = (messageId, e) => {
    e.preventDefault();

    this.setState({
      editMode: 'EDIT'
    });
  }

  handleSaveClick = (messageId, e) => {
    e.preventDefault();
    //e.persist();
    this.setState({
      editMode: 'SAVING'
    }, () => {
      let edit = this.props.editCallback;
      edit.call(undefined, messageId, this.editMessageTextarea.value).then((saveError) => {
        this.updateUIAfterSave(saveError);
      });
    });
  }

  updateUIAfterSave = (saveError = false) => {
    setTimeout(() => {
      if (saveError === true) {
        this.setState({
          editMode: 'EDIT',
          saveError: saveError
        });
      } else {
        this.setState({
          editMode: '',
          saveError: saveError
        });
      }
    }, 1000); // timeout for more graceful loader animation
  }

  render() {
    let message = null;
    let deleteBtn = null;
    let editBtn = null;
    let isAdmin = (this.context.loginData && this.context.loginData.user_id) ? true : false;
    let errorStyle = null;
    if (this.state.saveError === true) {
      errorStyle = {'border':'1px solid red'};
    }

    if (this.props.custom  === true) {
      message = <div className={this.props.className}>
        <span className="message_text_span">
          {this.props.children}
        </span>
      </div>;
    } else {
      if (isAdmin === true && this.state.editMode !== 'SAVING') {
        deleteBtn = <a href="#" className="delete_btn" onClick={this.props.deleteCallback.bind(undefined, this.props.messageId)}>Delete this message</a>;
      }
      if (isAdmin === true || this.props.allowSenderEdit === true) {
        if (this.state.editMode === '') {
          editBtn = <a href="#" className="edit_btn" onClick={this.handleEditClick.bind(this, this.props.messageId)}>Edit this message</a>;
        } else if (this.state.editMode === 'EDIT') {
          editBtn = <a href="#" className="save_btn" onClick={this.handleSaveClick.bind(this, this.props.messageId)}>Save message</a>;
        } else if (this.state.editMode === 'SAVING') {
          editBtn = <img src="./assets/images/loader.svg" alt="Saving the message..." width="50" />;
        }
      }

      message = <div className={this.props.className}>
        {this.props.timestamp && this.props.userName
          ? <span className="chat_name_span">{Utils.getCurrentTime(this.props.timestamp) + ' "' +  this.props.userName + '" says:'}</span>
          : null}
        {(this.state.editMode === '')
            ? <span className="message_text_span">{this.props.children}</span>
            : <textarea ref={(c) => { this.editMessageTextarea = c; }} defaultValue={this.props.children.toString()} autoFocus style={errorStyle} />}
        <div>{deleteBtn}</div>
        <div>{editBtn}</div>
      </div>;
    }

    return message;
  }
}