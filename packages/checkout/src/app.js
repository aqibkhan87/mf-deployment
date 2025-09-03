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
        <Route exact path="/view" component={CartPage} />
        <Route exact path="/wishlist" component={WishlistPage} />
        <Route exact path="/:categoryid" component={ProductListing} />
        <Route exact path="/:categoryid/:id" component={ProductDetails} />
        <Route exact path="/" component={CheckoutPage} />
      </Switch>
    </Router>
  );
};

export default App;
