/*
const defaultState = {
  chatLog: [],
  currentChat: {
    id: 0,
    msg: '',
    user: 'Anonymous',
    timeStamp: 1472322852680
  }
};

*/

const contactReducer = (state = 0, action) => {
  let newState;
  switch (action.type) {
    case 'SEND_CONTACT_MESSAGE':
    console.log('SEND_CONTACT_MESSAGE ', action.payload);
      return newState = state + action.payload;
    default:
      return state
  }
}

export default contactReducer;
