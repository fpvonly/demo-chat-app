import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Route, IndexRoute, Switch} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './redux/reducers';

import MainUI from './views/MainUI.jsx';
import Home from './views/Home.jsx';
import Contact from './views/Contact.jsx';
import Info from './views/Info.jsx';
import NotFound from './views/NotFound.jsx';

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <MainUI>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/admin" component={Home} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/info" component={Info} />
          <Route component={NotFound} />
        </Switch>
      </MainUI>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
