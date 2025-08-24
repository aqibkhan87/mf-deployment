import React, { useEffect } from "react";
import { Route, Switch, Router } from "react-router-dom";
import ProductDetails from "./components/productDetails";
import CartPage from "./components/cart";
import CheckoutPage from "./components/checkout";
import OrdersPage from "./components/orderHistory";
import OrderDetails from "./components/orderDetails";
import WishlistPage from "./components/wishlist";

const App = ({ initialPath, defaultHistory }) => {
  console.log("Checkout MF Setup");
  console.log("initialPath", initialPath);

  return (
    <Router initialEntries={[initialPath]} history={defaultHistory}>
      <Switch>
        <Route path="/details/:id">
          <ProductDetails pid={1} />
        </Route>
        <Route path="/cart">
          <CartPage />
        </Route>
        <Route path="/checkout">
          <CheckoutPage />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/order:oid">
          <OrderDetails />
        </Route>
        <Route path="/wishlist">
          <WishlistPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
