import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import CheckoutMFApp from "./mfs/CheckoutApp";
import AuthMFApp from "./mfs/AuthApp";
import OrdersPage from "./components/order/orderHistory";
import OrderDetails from "./components/order/orderDetails";
import ProductWishlisting from "./components/wishlist/wishlistPage.jsx";
import MainNav from "./components/mainNav.jsx";
import FlightResults from "./booking/flightSearch.jsx";
import DashboardPage from "./components/dashboard/dashboard.jsx";
import AuthComponents from "./components/common-mfs-components/auth/index.jsx";
import CheckoutComponents from "./components/common-mfs-components/checkout/index.jsx";

const App = () => {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <MainNav />
        <main className="">
          <Switch>
            <Route path="/auth" component={AuthMFApp} />
            <Route path="/ecommerce/checkout" component={CheckoutMFApp} />
            <Route path="/product" component={CheckoutMFApp} />
            <Route path="/cart" component={CheckoutMFApp} />
            <Route path="/ecommerce-payment" component={CheckoutMFApp} />
            <Route path="/flight-payment" component={CheckoutMFApp} />
            <Route path="/passenger-edit" component={CheckoutMFApp} />
            <Route path="/addons" component={CheckoutMFApp} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/wishlist" component={ProductWishlisting} />
            <Route path="/order-history" component={OrdersPage} />
            <Route path="/order/:orderid" component={OrderDetails} />
            <Route path="/flight-search" component={FlightResults} />
            <Route path="/" component={DashboardPage} />
            <Route component={() => <h1>404 Not Found</h1>} />
          </Switch>
          <AuthComponents />
          <CheckoutComponents />
        </main>
      </BrowserRouter>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Built with ♥ as a single‑file demo. Replace mock repos with real APIs to
        go live.
      </footer>
    </div>
  );
};

export default App;
