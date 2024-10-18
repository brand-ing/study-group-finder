import * as React from "react";
import logo from './logo.svg';
import './App.css';
import Home from './Home';
// import { BrowserRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import crudList from './crudList';
// import crudEdit from "./crudEdit";

class App extends React.Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/cruds' exact={true} component={crudList}/>
            {/* <Route path='/cruds/:id' component={crudEdit}/> */}
          </Switch>
        </Router>
    )
  }
}

export default App;
