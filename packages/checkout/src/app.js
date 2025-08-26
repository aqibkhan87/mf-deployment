import React, { useEffect } from "react";
import { Route, Switch, Router } from "react-router-dom";
import ProductDetails from "./components/productDetails";
import ProductListing from "./components/productlisting";
import CartPage from "./components/cart";
import CheckoutPage from "./components/checkout";
import WishlistPage from "./components/wishlist";

const App = ({ initialPath, defaultHistory }) => {
  console.log("initialPath in Checkout", initialPath);

  return (
    <Router initialEntries={[initialPath]} history={defaultHistory}>
      <Switch>
        <Route path="/listing">
          <ProductListing />
        </Route>
        <Route path="/details/:id">
          <ProductDetails />
        </Route>
        <Route path="/view">
          <CartPage />
        </Route>
        <Route path="/wishlist">
          <WishlistPage />
        </Route>
        <Route path="/">
          <CheckoutPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
