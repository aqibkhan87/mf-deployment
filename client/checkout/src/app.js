import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ecommerce/productDetailsPage";
import ProductListing from "./components/ecommerce/productListingPage";
import CartPage from "./components/ecommerce/cartPage";
import CheckoutPage from "./components/ecommerce/eCommerceCheckoutPage";
import PassengerEditPage from "./components/flights/passengerEditPage";
import AddonsPage from "./components/flights/addons";
import SeatSelection from "./components/flights/seatSelection";

const App = ({ history }) => {
  
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/cart/view" component={CartPage} />
        <Route exact path="/product/:categoryid/:productid" component={ProductDetails} />
        <Route exact path="/product/:categoryid" component={ProductListing} />
        <Route exact path="/ecommerce/checkout" component={CheckoutPage} />
        <Route exact path="/passenger-edit" component={PassengerEditPage} />
        <Route exact path="/addons" component={AddonsPage} />
        <Route exact path="/seat-selection" component={SeatSelection} />
      </Switch>
    </Router>
  );
};

export default App;
