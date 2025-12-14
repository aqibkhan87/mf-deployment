import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ecommerce/productDetailsPage";
import ProductListing from "./components/ecommerce/productListingPage";
import CartPage from "./components/ecommerce/cartPage";
import CheckoutPage from "./components/ecommerce/eCommerceCheckoutPage";
import EcommercePayment from "./common/ecommerce/ecommercePayment";
import FlightPayment from "./common/flights/flightPayment";

const App = ({ history }) => {
  
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/cart/view" component={CartPage} />
        <Route exact path="/product/:categoryid/:productid" component={ProductDetails} />
        <Route exact path="/product/:categoryid" component={ProductListing} />
        <Route exact path="/ecommerce/checkout" component={CheckoutPage} />
        <Route exact path="/ecommerce-payment" component={EcommercePayment} />
        <Route exact path="/flight-payment" component={FlightPayment} />
      </Switch>
    </Router>
  );
};

export default App;
