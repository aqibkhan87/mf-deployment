import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CheckoutApp from "./mfs/CheckoutApp";
import AuthApp from "./mfs/AuthApp";
import { useAuthStore } from "store/authStore";
import { ProductProvider } from "store/productContext";

import MainNav from "./components/mainNav";
import DashboardPage from "./components/dashboard";

const App = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <BrowserRouter>
            <ProductProvider>
              <MainNav />
              <main className="max-w-6xl mx-auto px-4 py-6">
                <Switch>
                  <Route path="/auth" component={AuthApp} />
                  <Route path="/dashboard" component={DashboardPage} />
                  <Route path="/checkout" component={CheckoutApp} />
                  <Route path="/product" component={CheckoutApp} />
                  <Route exact path="/" component={DashboardPage} />
                  <Route component={() => <h1>404 Not Found</h1>} />
                </Switch>
              </main>
            </ProductProvider>
          </BrowserRouter>
          <footer className="border-t py-6 text-center text-xs text-muted-foreground">
            Built with ♥ as a single‑file demo. Replace mock repos with real
            APIs to go live.
          </footer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
