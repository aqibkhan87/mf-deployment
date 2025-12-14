import React, { Suspense, lazy } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
const AuthMFApp = lazy(() => import("./mfs/AuthApp"));
const CheckoutMFApp = lazy(() => import("./mfs/checkoutApp"));
import OrdersPage from "./components/order/orderHistory.jsx";
import ProductWishlist from "./components/wishlist/wishlistPage.jsx";
import MainNav from "./components/mainNav.jsx";
import FlightResults from "./booking/flightSearch.jsx";
import DashboardPage from "./components/dashboard/dashboard.jsx";
import AddressList from "./components/address/addressList.jsx";
// import LoginSummary from "./mfs/authComponent/loginSummary.jsx";
// import AddressForm from "./mfs/authComponent/addressForm.jsx";
import LoginSummary from "./common/loginSummary.js";
import AddressForm from "./common/addressForm.js";

const App = () => {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <MainNav />
        <main className="">
          <Switch>
            <Route
              path="/auth"
              render={() => (
                <Suspense fallback={<div>Loading Auth...</div>}>
                  <AuthMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/ecommerce/checkout"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                  <LoginSummary />
                  <AddressForm />
                </Suspense>
              )}
            />
            <Route
              path="/product"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/cart"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/ecommerce-payment"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/flight-payment"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/passenger-edit"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/addons"
              render={() => (
                <Suspense fallback={<div>Loading Checkout...</div>}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/wishlist" component={ProductWishlist} />
            <Route path="/addresses" component={AddressList} />
            <Route path="/order-history" component={OrdersPage} />
            <Route path="/flight-search" component={FlightResults} />
            <Route path="/" component={DashboardPage} />
            <Route component={() => <h1>404 Not Found</h1>} />
          </Switch>
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
