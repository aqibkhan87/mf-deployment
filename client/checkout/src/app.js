import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/ecommerce/productDetails.jsx";
import ProductListing from "./components/ecommerce/productlisting.jsx";
import CartPage from "./components/ecommerce/cartPage.jsx";
import CheckoutPage from "./components/ecommerce/eCommerceCheckoutPage.jsx";
import WishlistPage from "./components/ecommerce/wishlist.jsx";
import EcommercePayment from "./common/ecommerce/ecommercePayment.jsx";
import FlightPayment from "./common/flights/flightPayment.jsx";

const App = ({ history }) => {
  
  console.log("history in Checkout MF APP", history)
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/cart/view" component={CartPage} />
        <Route exact path="/cart/wishlist" component={WishlistPage} />
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
