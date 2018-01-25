import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';

import Server from '../server/server_config.json'
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
    if (contactEmail === '' || this.isValidEmailAddress(contactEmail) === false) {
      emailInputErr = true;
    }
    if (contactMessage === '') {
      messageInputErr = true;
    }

    let url = '';
    if (nameInputErr == false && emailInputErr == false && messageInputErr === false) {

      if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
         url = 'http://localhost:3000/';
      } else {
         url = 'http://' + Server.server_domain + ':' + Server.server_port;
      }

      this.setState({inProgress: true}, () => {
        $.ajax({
          xhrFields: {
            withCredentials: true
          },
          type: "POST",
          url: url + 'contact/send',
          dataType: 'json',
          data: {
            'contact_name': contactName,
            'contact_email': contactEmail,
            'contact_message': contactMessage
          },
          success: function(data) {
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
          }.bind(this)
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

  isValidEmailAddress = (emailAddress) => {
    let pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
  };

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
          <input type="button" value="Send" id="contact_btn" disabled={this.state.inProgress} onClick={this.handleSend} />

          <div class="clear"></div>
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
