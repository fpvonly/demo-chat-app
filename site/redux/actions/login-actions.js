import Utils from '../../components/Utils.js';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const LOGIN_ERROR = 'LOGIN_ERROR';

export const logIn = (action, payload) => {
  return dispatch => {
    Utils.post(
      action,
      payload,
      function(data) {
        if (data.login && data.login === true) { // NORMAL LOGIN AND SESSION RESUME
          dispatch(resolvedlogIn(LOGIN, data));
        } else if (data.loginError && data.loginError === true) { // LOGIN ERROR
          dispatch(resolvedlogIn(LOGIN_ERROR, null));
        } else if (data.logout && data.logout === true) { // LOGOUT
          dispatch(resolvedlogIn(LOGOUT, null));
        }
      }
    );
  }
}

export const resolvedlogIn = (type, data) => {
  return {
    type: type,
    payload: data
  }
};
