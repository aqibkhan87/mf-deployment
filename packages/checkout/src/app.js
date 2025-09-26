import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/productDetails";
import ProductListing from "./components/productlisting";
import CartPage from "./components/cartPage";
import CheckoutPage from "./components/checkoutPage";
import WishlistPage from "./components/wishlist";

const App = ({ history }) => {
  console.log("history in Checkout MF APP", history)
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/cart/view" component={CartPage} />
        <Route exact path="/cart/wishlist" component={WishlistPage} />
        <Route exact path="/product/:categoryid/:id" component={ProductDetails} />
        <Route exact path="/product/:categoryid" component={ProductListing} />
        <Route exact path="/checkout" component={CheckoutPage} />
      </Switch>
    </Router>
  );
};

export default App;
