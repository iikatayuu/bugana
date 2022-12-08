
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/Login';
import ForgotPage from './pages/ForgotPage';
import RegistrationPage from './pages/Registration';
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import UserPage from './pages/User';
import PickupPage from './pages/Pickup';
import DeliveryPage from './pages/Delivery';
import HistoryPage from './pages/History';
import ProfilePage from './pages/Profile';
import ProfileEditPage from './pages/ProfileEdit';
import ProductPage from './pages/Product';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';

import FarmerDashboardPage from './pages/farmer/Dashboard';
import ProductsRecordPage from './pages/farmer/ProductsRecord';
import SalesRecordPage from './pages/farmer/SalesRecord';
import HistoryRecordPage from './pages/farmer/HistoryRecord';
import SalesRecordTransactionPage from './pages/farmer/SalesRecordTransaction';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/default.css';

setupIonicReact();

class App extends React.Component {
  logout () {
    localStorage.removeItem('token');
    localStorage.removeItem('payload');
    localStorage.removeItem('checkout');
    return <Redirect to="/" />;
  }

  render () {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet animated={false}>
            <Switch>
              <Route exact strict path="/" component={LoginPage} />
              <Route exact strict path="/forgot" component={ForgotPage} />
              <Route exact strict path="/register" component={RegistrationPage} />
              <Route exact strict path="/dashboard" component={HomePage} />
              <Route exact strict path="/search" component={SearchPage} />
              <Route exact strict path="/user" component={UserPage} />
              <Route exact strict path="/user/pickup" component={PickupPage} />
              <Route exact strict path="/user/deliver" component={DeliveryPage} />
              <Route exact strict path="/user/history" component={HistoryPage} />
              <Route exact strict path="/product/:id" component={ProductPage} />
              <Route exact strict path="/product"><Redirect to="/" /></Route>
              <Route exact strict path="/cart" component={CartPage} />
              <Route exact strict path="/checkout" component={CheckoutPage} />

              <Route exact strict path="/farmer/dashboard" component={FarmerDashboardPage} />
              <Route exact strict path="/records/products" component={ProductsRecordPage} />
              <Route exact strict path="/records/sales" component={SalesRecordPage} />
              <Route exact strict path="/records/sales/:id" component={SalesRecordTransactionPage} />
              <Route exact strict path="/records/history" component={HistoryRecordPage} />

              <Route exact strict path="/profile" component={ProfilePage} />
              <Route exact strict path="/profile/edit" component={ProfileEditPage} />
              <Route exact strict path="/logout" render={this.logout} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }
}

export default App;
