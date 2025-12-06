import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import CheckoutApp from "./mfs/CheckoutApp";
import AuthApp from "./mfs/AuthApp";
import OrdersPage from "./components/order/orderHistory";
import OrderDetails from "./components/order/orderDetails";
import MainNav from "./components/mainNav.jsx";
import AddonsPage from "./booking/addons.jsx";
import FlightResults from "./booking/flightSearch.jsx";
import PassengerEdit from "./booking/passenger-edit.jsx";
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
            <Route path="/auth" component={AuthApp} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/order-history" component={OrdersPage} />
            <Route path="/order/:orderid" component={OrderDetails} />
            <Route path="/checkout" component={CheckoutApp} />
            <Route path="/product" component={CheckoutApp} />
            <Route path="/cart" component={CheckoutApp} />
            <Route path="/" component={DashboardPage} />
            <Route path="/flight-search" component={FlightResults} />
            <Route path="/passenger-edit" component={PassengerEdit} />
            <Route path="/payment" component={PassengerEdit} />
            <Route path="/addons" component={AddonsPage} />
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
