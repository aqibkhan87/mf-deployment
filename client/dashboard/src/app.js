import React from "react";
import { Route, Switch, Router } from "react-router-dom";
import OrdersPage from "./components/order/orderHistory";
import ProductWishlist from "./components/wishlist/wishlistPage";
import FlightResults from "./booking/flightSearch/flightSearch";
import DashboardPage from "./components/dashboard/dashboard";
import AddressList from "./components/address/addressList";
import DestinationFlights from "./booking/destinationFlights/destinationFlights";

const App = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/wishlist" component={ProductWishlist} />
        <Route path="/addresses" component={AddressList} />
        <Route path="/order-history" component={OrdersPage} />
        <Route path="/flight-search" component={FlightResults} />
        <Route path="/destination" component={DestinationFlights} />
        <Route path="/" component={DashboardPage} />
        <Route component={() => <h1>404 Not Found</h1>} />
      </Switch>
    </Router>
  );
};

export default App;
