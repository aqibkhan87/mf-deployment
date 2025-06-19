import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";

import Landing from "./components/Landing";
import Pricing from "./components/Pricing";

const App = () => {
  return (
    <StylesProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Landing} />
          <Route exact path="/pricing" component={Pricing} />
        </Switch>
      </BrowserRouter>
    </StylesProvider>
  );
};

export default App;
