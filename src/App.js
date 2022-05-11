import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Configuracoes from './pages/Configuracoes';
import Ranking from './pages/Ranking';
import Feedback from './pages/Feedback';
import './mediaQueries.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/quiz" component={ Quiz } />
        <Route path="/" exact component={ Login } />
        <Route path="/configuracoes" component={ Configuracoes } />
        <Route path="/ranking" component={ Ranking } />
        <Route path="/feedback" component={ Feedback } />
      </Switch>
    );
  }
}

export default App;
