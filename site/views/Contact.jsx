import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {sendContactMessage, resetContactFormState} from '../redux/actions/contact-actions';
import Server from '../server/server_config.json'
import Utils from '../components/Utils.js';
import Translate from '../components/Translate.jsx';

class Contact extends React.Component {

  constructor(props) {
    super(props);

    this.contactName = null;
    this.contactEmail = null;
    this.contactMessage = null;

    this.state = {
      nameInputError: false,
      emailInputError: false,
      messageInputError: false,
      inProgress: false
    }
  }

  static defaultProps = {
    contactFormState: {
      inProgress: false,
      formSent: false,
      sendError: false
    } // from store
  };

  static propTypes = {
    contactFormState: PropTypes.object, // from store
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.contactFormState.inProgress === false && this.state.inProgress === true) {
      this.setState({inProgress: false});
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetContactFormState({}));
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
        this.props.dispatch(sendContactMessage(
          {
            'contact_name': contactName,
            'contact_email': contactEmail,
            'contact_message': contactMessage
          }));
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
    let formState = this.props.contactFormState;
    let errorStyle = null;
    let formContent = null;

    if (formState.formSent && formState.formSent === true) {
      formContent = <p className="contact_thanks">The form was succesfully sent!</p>;
    } else {
      if (formState.sendError === true || this.state.nameInputError === true || this.state.emailInputError === true || this.state.messageInputError === true) {
        errorStyle = {'border':'1px solid red'};
      }

      formContent = <div id="contact_area">
        <p className="info">
          <Translate id="contact_text"/>
        </p>
        <form id="contact_form" action="#">
          <input
            ref={(c) => { this.contactName = c; }}
            style={(formState.sendError === true || this.state.nameInputError === true ? errorStyle : null)}
            type="text"
            name="contact_name"
            id="contact_name"
            placeholder="Name"
            maxLength="128" />
          <input
            ref={(c) => { this.contactEmail = c; }}
            style={(formState.sendError === true || this.state.emailInputError === true ? errorStyle : null)}
            type="text"
            name="contact_email"
            id="contact_email"
            placeholder="E-mail"
            maxLength="40" />
          <textarea
            ref={(c) => { this.contactMessage = c; }}
            style={(formState.sendError === true || this.state.messageInputError === true ? errorStyle : null)}
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


function mapStateToProps(state){
  return {
    contactFormState: state.contactReducer,
  };
}
export default connect(mapStateToProps)(Contact);
