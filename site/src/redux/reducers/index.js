import {combineReducers} from 'redux';
import contactReducer from './contact-reducer';
import loginReducer from './login-reducer';

const appState = combineReducers({
  contactReducer,
  loginReducer
});

export default appState;
