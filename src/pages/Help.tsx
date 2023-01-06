
import React from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';

import { RouterProps } from '../types';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as MagnifyingGlassIcon } from '../assets/magnifying-glass.svg';
import { ReactComponent as HelpAccountsIcon } from '../assets/help-accounts.svg';
import { ReactComponent as HelpSecurityIcon } from '../assets/help-security.svg';
import { ReactComponent as HelpPaymentsIcon } from '../assets/help-payments.svg';
import { ReactComponent as HelpViolationIcon } from '../assets/help-violation.svg';
import { ReactComponent as HelpDeliveryIcon } from '../assets/help-delivery.svg';
import { ReactComponent as HelpSalesIcon } from '../assets/help-sales.svg';

import './Help.css';

interface HelpPageState {
  search: string;
}

class HelpPage extends React.Component<RouterProps, HelpPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      search: ''
    };

    this.submitSearch = this.submitSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  submitSearch (event: React.FormEvent) {}

  handleChange (event: React.ChangeEvent) {}

  render () {
    return (
      <IonPage>
        <IonContent fullscreen>
          <h1 className="help-title">Bugana Help Center</h1>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} className="mr-2" />
            </button>
            
            <form action="/search" method="get" className="dashboard-search" onSubmit={this.submitSearch}>
              <input type="text" name="search" value={this.state.search} onChange={this.handleChange} />
              <button type="submit">
                <MagnifyingGlassIcon width={20} height={20} />
              </button>
            </form>
          </header>

          <main>
            <h3 className="faq m-3">Frequently asked questions</h3>

            <div className="faq-item m-3">Welcome to Bugana: Guide for new buyers</div>
            <div className="faq-item m-3">How do I track my order?</div>

            <div className="help-sections">
              <Link to="/help/accounts" className="help-section">
                <h5>Accounts</h5>
                <HelpAccountsIcon width={64} height={64} />
              </Link>

              <Link to="/help/security" className="help-section">
                <h5>Security</h5>
                <HelpSecurityIcon width={64} height={64} />
              </Link>

              <Link to="/help/payments" className="help-section">
                <h5>Payments</h5>
                <HelpPaymentsIcon width={64} height={64} />
              </Link>

              <Link to="/help/violation" className="help-section">
                <h5>Violation</h5>
                <HelpViolationIcon width={64} height={64} />
              </Link>

              <Link to="/help/delivery" className="help-section">
                <h5>Delivery</h5>
                <HelpDeliveryIcon width={64} height={64} />
              </Link>

              <Link to="/help/sales" className="help-section">
                <h5>Return and Refunds</h5>
                <HelpSalesIcon width={64} height={64} />
              </Link>
            </div>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default HelpPage;
