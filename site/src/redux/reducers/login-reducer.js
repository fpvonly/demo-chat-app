const initialState = {
  loginStatus: false,
  loginData: null,
  loginError: false
}

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        loginStatus: true,
        loginData: action.payload,
        loginError: false
      };
    case 'LOGOUT':
      return {
        loginStatus: false,
        loginData: null,
        loginError: false
      };
    case 'LOGIN_ERROR':
      return {
        loginStatus: false,
        loginData: null,
        loginError: true
      };
    default:
      return state;
  }
}

export default loginReducer;
