import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';
import MarketingApp from "./components/MarketingApp";
import DashboardApp from "./components/DashboardApp";

const comp = () => {
  return <div>Hi There!!!! Updated Code For Deploy Script</div>;
};

const App = () => {
  return (
    <div>
      <DashboardApp />
      <hr/>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <Switch>
            <Route exact path="/marketing" component={MarketingApp} />
            <Route exact path="/dashboard" component={DashboardApp} />
            <Route exact path="/" component={comp} />
            {/* fallback 404 */}
            <Route component={() => <h1>404 Not Found</h1>} />
          </Switch>
        </BrowserRouter>
      </StyledEngineProvider>
      <hr />
      <MarketingApp />
    </div>
  );
};

export default App;
