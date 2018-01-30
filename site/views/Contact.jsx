import React from 'react';
import {render} from 'react-dom';

import Server from '../server/server_config.json'
import Utils from '../components/Utils.js';
import Translate from '../components/Translate.jsx';

export default class Contact extends React.Component {

  constructor(props) {
    super(props);

    this.contactName = null;
    this.contactEmail = null;
    this.contactMessage = null;

    this.state = {
      nameInputError: false,
      emailInputError: false,
      messageInputError: false,
      inProgress: false,
      formSent: false
    }
  }

  handleSend = (e) => {
    e.preventDefault();

    let nameInputErr = false;
    let emailInputErr = false;
    let messageInputErr = false;
    let contactName = this.contactName.value.trim();
    let contactEmail = this.contactEmail.value.trim();
    let contactMessage = this.contactMessage.value.trim();

    if (contactName === '') {
      nameInputErr = true;
    }
    if (contactEmail === '' || Utils.isValidEmailAddress(contactEmail) === false) {
      emailInputErr = true;
    }
    if (contactMessage === '') {
      messageInputErr = true;
    }

    if (nameInputErr == false && emailInputErr == false && messageInputErr === false) {
      this.setState({inProgress: true}, () => {
        Utils.post(
          'contact/send',
          {
            'contact_name': contactName,
            'contact_email': contactEmail,
            'contact_message': contactMessage
          },
          (data) => {
            setTimeout(() => {
              if (data.status && data.status === true) {
                this.setState({
                  inProgress: false,
                  formSent: true
                });
              } else {
                this.setState({
                  inProgress: false,
                  nameInputError: true,
                  emailInputError: true,
                  messageInputError: true,
                });
              }
            }, 1000); // timeout is for more peaceful loader icon change
          },
          () => {
            this.setState({
              inProgress: false,
              nameInputError: true,
              emailInputError: true,
              messageInputError: true,
            });
        });
      });
    } else {
      this.setState({
        nameInputError: nameInputErr,
        emailInputError: emailInputErr,
        messageInputError: messageInputErr
      });
    }
  }

  render() {
    let errorStyle = null;
    let formContent = null;

    if (this.state.formSent === true) {
      formContent = <p className="contact_thanks">The form was succesfully sent!</p>;
    } else {
      if (this.state.nameInputError === true || this.state.emailInputError === true || this.state.messageInputError === true) {
        errorStyle = {'border':'1px solid red'};
      }

      formContent = <div id="contact_area">
        <p className="info">
          <Translate id="contact_text"/>
        </p>
        <form id="contact_form" action="#">
          <input
            ref={(c) => { this.contactName = c; }}
            style={(this.state.nameInputError === true ? errorStyle : null)}
            type="text"
            name="contact_name"
            id="contact_name"
            placeholder="Name"
            maxLength="128" />
          <input
            ref={(c) => { this.contactEmail = c; }}
            style={(this.state.emailInputError === true ? errorStyle : null)}
            type="text"
            name="contact_email"
            id="contact_email"
            placeholder="E-mail"
            maxLength="40" />
          <textarea
            ref={(c) => { this.contactMessage = c; }}
            style={(this.state.messageInputError === true ? errorStyle : null)}
            name="contact_message"
            id="contact_message"
            placeholder="Your message">
          </textarea>

          {(this.state.inProgress === true)
            ? <img src="./assets/images/loader.svg" alt="Saving the message..." width="50" />
            : <input type="button" value="Send" id="contact_btn" onClick={this.handleSend} />}

          <div className="clear"></div>
        </form>
      </div>;
    }

    return <div className="page_load_content">
      <section className="content_part">
        {formContent}
      </section>
    </div>;
  }
}
