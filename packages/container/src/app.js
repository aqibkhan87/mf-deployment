import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";
import MarketingApp from "./components/MarketingApp";

const comp = () => {
  return <div>Hi There!!!!</div>;
};

const App = () => {
  return (
    <div>
      <StylesProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/" component={comp} />
            <Route path="/marketing" component={<MarketingApp />} />
          </Switch>
        </BrowserRouter>
      </StylesProvider>
      <hr />
      <MarketingApp />
    </div>
  );
};

export default App;
