import React from 'react';

const LoginContext = React.createContext({
    loginState: {
      loginData: null,
      loginStatus: false,
      loginError: false
    }
});
export default LoginContext;
