import Utils from '../../components/Utils.js';

const SEND_CONTACT_MESSAGE = 'SEND_CONTACT_MESSAGE';

export const sendContactMessage = (payload) => {
  return dispatch => {
    Utils.post(
      'contact/send',
      payload,
      (data) => {
        setTimeout(() => {
          if (data.status && data.status === true) {
            dispatch(resolvedSendContactMessage({
              inProgress: false,
              formSent: true
            }));
          } else {
            dispatch(resolvedSendContactMessage({
              inProgress: false,
              sendError: true
            }));
          }
        }, 500); // timeout is for more peaceful loader icon change
      },
      () => {
        dispatch(resolvedSendContactMessage({
          inProgress: false,
          sendError: true
        }));
    });
  }
}

export const resolvedSendContactMessage = (data) => {
  return {
    type: SEND_CONTACT_MESSAGE,
    payload: data
  }
};

export const resetContactFormState = (data) => {
  return {
    type: SEND_CONTACT_MESSAGE,
    payload: {
      sendError: false,
      formSent: false,
      inProgress: false
    }
  }
};
