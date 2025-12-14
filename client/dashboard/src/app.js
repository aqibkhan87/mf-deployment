import React, { Suspense, lazy } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
const AuthMFApp = lazy(() => import("./mfs/AuthMFApp"));
const CheckoutMFApp = lazy(() => import("./mfs/CheckoutMFApp"));
import OrdersPage from "./components/order/orderHistory";
import ProductWishlist from "./components/wishlist/wishlistPage";
import MainNav from "./components/mainNav";
import FlightResults from "./booking/flightSearch";
import DashboardPage from "./components/dashboard/dashboard";
import AddressList from "./components/address/addressList";
// import LoginSummary from "./mfs/authComponent/loginSummary";
// import AddressForm from "./mfs/authComponent/addressForm";
import LoginSummary from "./common/loginSummary";
import AddressForm from "./common/addressForm";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <MainNav />
        <main className="flex-1">
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
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          Built with ♥ as a micro-frontend demo project.
        </footer>
      </BrowserRouter>
    </div>
  );
};

export default App;
