import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import ProductDetailsPage from "./components/ecommerce/productDetailsPage";
import ProductListingPage from "./components/ecommerce/productListingPage";
import CartPage from "./components/ecommerce/cartPage";
import CheckoutPage from "./components/ecommerce/eCommerceCheckoutPage";
import PassengerEditPage from "./components/flights/passengerEditPage";
import AddonsPage from "./components/flights/addonsPage";
import SeatSelectionPage from "./components/flights/seatSelectionPage";
import ItineraryPage from "./components/flights/itineraryPage";
import CheckInPage from "./components/flights/checkInPage";

const App = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/cart/view" component={CartPage} />
        <Route exact path="/product/:categoryid/:productid" component={ProductDetailsPage} />
        <Route exact path="/product/:categoryid" component={ProductListingPage} />
        <Route exact path="/ecommerce/checkout" component={CheckoutPage} />
        <Route exact path="/passenger-edit" component={PassengerEditPage} />
        <Route exact path="/addons" component={AddonsPage} />
        <Route exact path="/seat-selection" component={SeatSelectionPage} />
        <Route exact path="/itinerary" component={ItineraryPage} />
        <Route exact path="/check-in" component={CheckInPage} />
        <Route exact path="/check-in/addons" component={AddonsPage} />
        <Route exact path="/check-in/seat-selection" component={SeatSelectionPage} />
      </Switch>
    </Router>
  );
};

export default App;
