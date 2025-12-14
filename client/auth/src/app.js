import React from "react";
import { Route, Switch, Router } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

const App = ({ history }) => {
  console.log("defaultHistory inside Auth", history);

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/auth/signup" component={Signup} />
        <Route exact path="/auth/login" component={Login} />
      </Switch>
    </Router>
  );
};

export default App;
