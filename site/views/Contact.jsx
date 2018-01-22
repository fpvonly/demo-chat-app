import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';

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
      messageInputError: false
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
      console.log('oooo');
      nameInputErr = true;
    }
    if (contactEmail === '') {
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
         url = 'TODO';
      }

      $.ajax({
        xhrFields: {
          withCredentials: true
        },
        type: "POST",
        url: url + 'contact/send',
        data: {
          'contact_name': contactName,
          'contact_email': contactEmail,
          'contact_message': contactMessage
        },
        success: function(data) {
          // TODO
        }.bind(this),
        dataType: 'json'
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
    if (this.state.nameInputError === true || this.state.emailInputError === true || this.state.messageInputError === true) {
      errorStyle = {'border':'1px solid red'};
    }

    return <div className="page_load_content">
      <section className="content_part">
          <p className="info">
            <Translate id="contact_text"/>
          </p>

          <div id="contact_area">
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
              <input type="button" value="Send" id="contact_btn" onClick={this.handleSend} />

              <div class="clear"></div>
           </form>
          </div>
      </section>
    </div>;
  }
}
