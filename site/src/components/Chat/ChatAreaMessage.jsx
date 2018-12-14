import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

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
    siteLoginState: {},
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
    siteLoginState: PropTypes.object,
    allowSenderEdit: PropTypes.bool,
    custom: PropTypes.bool,
    messageId: PropTypes.string,
    timestamp: PropTypes.string,
    userName: PropTypes.string,
    className: PropTypes.string,
    deleteCallback: PropTypes.func,
    editCallback: PropTypes.func
  };

  componentDidUpdate(prevProps, prevState) {
    // if the admin user has logged out from main site, reset edit state
    if (this.props.siteLoginState.loginStatus === false && prevProps.siteLoginState.loginStatus === true) {
      this.setState({
        editMode: ''
      });
    }
  }

  handleEditClick = (messageId, e) => {
    e.preventDefault();

    this.setState({
      editMode: 'EDIT'
    });
  }

  handleSaveClick = async (messageId, e) => {
    e.preventDefault();
    //e.persist();
    this.setState({
      editMode: 'SAVING'
    }, async () => {
      let edit = this.props.editCallback;
      let saveError = await edit.call(undefined, messageId, this.editMessageTextarea.value);
      this.updateUIAfterSave(saveError);
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

  getDeleteBtn = (siteLoginState) => {
    let deleteBtn = null;
    let isAdmin = (siteLoginState.loginData && siteLoginState.loginData.user_id) ? true : false;

    if (isAdmin === true && this.state.editMode !== 'SAVING') {
      deleteBtn = <div key={'delete_' + this.props.messageId}>
        <a href="#"
          className="delete_btn"
          onClick={this.props.deleteCallback.bind(undefined, this.props.messageId)}>
            Delete this message
          </a>
        </div>;
    }

    return deleteBtn;
  }

  getEditBtn = (siteLoginState) => {
    let editBtn = null;
    let isAdmin = (siteLoginState.loginData && siteLoginState.loginData.user_id) ? true : false;

    if (isAdmin === true || this.props.allowSenderEdit === true) {
      // if normal '' initial state
      if (this.state.editMode === '') {
        editBtn = <div>
          <a href="#"
            className="edit_btn"
            onClick={this.handleEditClick.bind(this, this.props.messageId)}>
              Edit this message
          </a>
        </div>;
      } else if (this.state.editMode === 'EDIT') { // else edit state and ready for save
        editBtn = <div>
          <a href="#"
            className="save_btn"
            onClick={this.handleSaveClick.bind(this, this.props.messageId)}>
              Save message
          </a>
        </div>;
      } else if (this.state.editMode === 'SAVING') {
        editBtn = <div><img src="./assets/images/loader.svg" alt="Saving the message..." width="50" /></div>;
      }
    }

    return editBtn;
  }

  render() {
    let message = null;
    let errorStyle = null;
    if (this.state.saveError === true) {
      errorStyle = {'border':'1px solid red'};
    }

    // if the message is not a user sent message but a system generated one
    if (this.props.custom  === true) {
      message = <div className={this.props.className}>
        <span className="message_text_span">
          {this.props.children}
        </span>
      </div>;
    } else { // else the message is user sent message (and editable)
      message = <div className={this.props.className}>
        {this.props.timestamp && this.props.userName
          ? <span className="chat_name_span">{Utils.getCurrentTime(this.props.timestamp) + ' "' +  this.props.userName + '" says:'}</span>
          : null}
        {(this.state.editMode === '')
            ? <span className="message_text_span">{this.props.children}</span>
            : <textarea
                ref={(c) => { this.editMessageTextarea = c; }}
                className='edit_message_textarea'
                defaultValue={this.props.children.toString()}
                autoFocus
                style={errorStyle} />}
          {this.getDeleteBtn(this.props.siteLoginState)}
          {this.getEditBtn(this.props.siteLoginState)}
      </div>;
    }

    return message;
  }
}
