import Utils from '../../components/Utils.js';

const SEND_CONTACT_MESSAGE = 'SEND_CONTACT_MESSAGE';
const SEND_CONTACT_MESSAGE_ERROR = 'SEND_CONTACT_MESSAGE_ERROR';
const RESET = 'RESET';

export const sendContactMessage = (payload) => {
  return dispatch => {
    Utils.post(
      'contact/send',
      payload,
      (data) => {
        setTimeout(() => {
          if (data.status && data.status === true) {
            dispatch(resolvedSendContactMessage(SEND_CONTACT_MESSAGE, null));
          } else {
            dispatch(resolvedSendContactMessage(SEND_CONTACT_MESSAGE_ERROR, null));
          }
        }, 500); // timeout is for more peaceful loader icon change
      },
      () => {
        dispatch(resolvedSendContactMessage(SEND_CONTACT_MESSAGE_ERROR, null));
    });
  }
}

export const resolvedSendContactMessage = (type, data) => {
  return {
    type: type,
    payload: data
  }
};

export const resetContactFormState = (data) => {
  return {
    type: RESET,
    payload: null
  }
};
