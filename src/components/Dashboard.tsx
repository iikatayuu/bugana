
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';

import { ReactComponent as HomeIcon } from '../assets/home.svg';
import { ReactComponent as CartIcon } from '../assets/cart.svg';
import { ReactComponent as UserIcon } from '../assets/user.svg';
import './Dashboard.css';

interface DashboardProps {
  component: React.ReactNode;
  scrollEnd?: () => void;
}

class Dashboard extends React.Component<DashboardProps> {
  render () {
    if (window.localStorage.getItem('token') === null) return <Redirect to="/" />;

    return (
      <IonPage>
        <IonContent scrollEvents={true} onIonScrollEnd={this.props.scrollEnd} fullscreen>
          { this.props.component }

          <div className="dashboard-footer-placeholder"></div>
          <footer className="dashboard-footer">
            <nav className="dashboard-footer-nav">
              <Link to="/dashboard">
                <HomeIcon />
              </Link>

              <Link to="/cart">
                <CartIcon />
              </Link>

              <Link to="/user">
                <UserIcon />
              </Link>
            </nav>
          </footer>
        </IonContent>
      </IonPage>
    );
  }
}

export default Dashboard;
