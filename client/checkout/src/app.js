import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/productDetails.jsx";
import ProductListing from "./components/productlisting.jsx";
import CartPage from "./components/cartPage.jsx";
import CheckoutPage from "./components/checkoutPage.jsx";
import WishlistPage from "./components/wishlist.jsx";

const App = ({ history }) => {
  
  console.log("history in Checkout MF APP", history)
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/cart/view" component={CartPage} />
        <Route exact path="/cart/wishlist" component={WishlistPage} />
        <Route exact path="/product/:categoryid/:productid" component={ProductDetails} />
        <Route exact path="/product/:categoryid" component={ProductListing} />
        <Route exact path="/checkout" component={CheckoutPage} />
      </Switch>
    </Router>
  );
};

export default App;
