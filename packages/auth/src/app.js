import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import Landing from "./components/Landing";
import Pricing from "./components/Pricing";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Landing} />
          <Route exact path="/pricing" component={Pricing} />
        </Switch>
      </BrowserRouter>
    </StyledEngineProvider>
  );
};

export default App;
