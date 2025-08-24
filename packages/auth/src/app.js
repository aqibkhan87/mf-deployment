import React from "react";
import { Route, Switch, Router } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';
import Login from "./components/login";
import Signup from "./components/signup";

const App = ({ initialPath, defaultHistory }) => {
  console.log("initialPath", initialPath);
  console.log("defaultHistory inside Auth", defaultHistory);


  return (
    <div>
      <StyledEngineProvider injectFirst>
        <Router initialEntries={[initialPath]} history={defaultHistory}>
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </Router>
      </StyledEngineProvider>
    </div>
  );
};

export default App;
