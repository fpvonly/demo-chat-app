const initialState = {
    sendError: false,
    formSent: false,
    inProgress: false
}

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_CONTACT_MESSAGE':
      return {
        inProgress: false,
        formSent: true
      };
    case 'SEND_CONTACT_MESSAGE_ERROR':
      return {
        inProgress: false,
        sendError: true
      };
    case 'RESET':
      return {
        sendError: false,
        formSent: false,
        inProgress: false
      };
    default:
      return state;
  }
}

export default contactReducer;
