import Utils from '../../components/Utils.js';

const LOGIN = 'LOGIN';

export const logIn = (action, payload) => {
  return dispatch => {
    Utils.post(
      action,
      payload,
      function(data) {
        if (data.login && data.login === true) { // NORMAL LOGIN AND SESSION RESUME
          dispatch(resolvedlogIn({
              loginStatus: true,
              loginData: data,
              loginError: false
          }));
        } else if (data.loginError && data.loginError === true) { // LOGIN ERROR
          dispatch(resolvedlogIn({
              loginStatus: false,
              loginData: null,
              loginError: true
          }));
        } else if (data.logout && data.logout === true) { // LOGOUT
            dispatch(resolvedlogIn({
              loginStatus: false,
              loginData: null,
              loginError: false
            }));
        }
      }
    );
  }
}

export const resolvedlogIn = (data) => {
  return {
    type: LOGIN,
    payload: data
  }
};
