const initialState = {
    sendError: false,
    formSent: false,
    inProgress: false
}

const contactReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case 'SEND_CONTACT_MESSAGE':
      return newState = action.payload;
    default:
      return state;
  }
}

export default contactReducer;
