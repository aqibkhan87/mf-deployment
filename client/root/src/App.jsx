import React, { Suspense, lazy } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
const AuthMFApp = lazy(() => import("./mfs/AuthMFApp"));
const CheckoutMFApp = lazy(() => import("./mfs/CheckoutMFApp"));
const DashboardMFApp = lazy(() => import("./mfs/DashboardMFApp"));
import MainNav from "./common/mainNav";
// import LoginSummary from "./mfs/authComponent/loginSummary";
// import AddressForm from "./mfs/authComponent/addressForm";
import LoginSummary from "./common/loginSummary";
import AddressForm from "./common/addressForm";
import Loader from "./common/loader/loader";
import { useLoaderStore } from "store/loaderStore";

const App = () => {
  const { loading } = useLoaderStore();
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <MainNav />
        <main className="flex-1">
          <Switch>
            <Route
              path="/auth"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <AuthMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/ecommerce/checkout"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                  <LoginSummary />
                  <AddressForm />
                </Suspense>
              )}
            />
            <Route
              path="/product"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/cart"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/ecommerce-payment"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/flight-payment"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/passenger-edit"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/addons"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/seat-selection"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/itinerary"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/check-in"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/check-in/addons"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/check-in/seat-selection"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <CheckoutMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/dashboard"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/wishlist"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/addresses"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/order-history"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/flight-search"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/destination"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route
              path="/"
              render={() => (
                <Suspense fallback={<Loader />}>
                  <DashboardMFApp />
                </Suspense>
              )}
            />
            <Route component={() => <h1>404 Not Found</h1>} />
          </Switch>
        </main>
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          Built with ♥ as a micro-frontend project by <span className="text-black font-semibold">Aqib Khan</span>
        </footer>
        {loading && (<Loader />)}
      </BrowserRouter>
    </div>
  );
};

export default App;
