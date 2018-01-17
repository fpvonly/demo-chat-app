import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, IndexRoute, Switch } from 'react-router-dom';

import App from './views/Main.jsx';
import Index from './views/index.jsx';
import Contact from './views/Contact.jsx';
import Info from './views/Info.jsx';
import NotFound from './views/NotFound.jsx';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/admin" component={Index} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/info" component={Info} />
        <Route component={NotFound} />
      </Switch>
    </App>
  </BrowserRouter>,
  document.getElementById('app')
);
