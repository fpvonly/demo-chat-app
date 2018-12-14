const initialState = {
    sendError: false,
    formSent: false
}

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_CONTACT_MESSAGE':
      return {
        sendError: false,
        formSent: true
      };
    case 'SEND_CONTACT_MESSAGE_ERROR':
      return {
        formSent: false,
        sendError: true
      };
    case 'RESET':
      return {
        sendError: false,
        formSent: false
      };
    default:
      return state;
  }
}

export default contactReducer;
