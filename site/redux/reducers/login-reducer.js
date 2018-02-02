const initialState = {
  loginStatus: false,
  loginData: null,
  loginError: false
}

const loginReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case 'LOGIN':
      return newState = action.payload;
    default:
      return state;
  }
}

export default loginReducer;
