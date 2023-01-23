
import React from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../../types';
import { WEBAPI } from '../../variables';
import { dateFormat } from '../../utils/date';
import { ReactComponent as LeftIcon } from '../../assets/left.svg';
import './Dashboard.css';

interface SalesRecordPageState {
  page: number;
  transactions: Transaction[];
  hasNext: boolean;
  loading: boolean;
  error: string;
}

class SalesRecordPage extends React.Component<RouterProps, SalesRecordPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      page: 1,
      transactions: [] as Transaction[],
      hasNext: false,
      loading: true,
      error: ''
    };

    this.load = this.load.bind(this);
  }

  async getTransactions (reset: boolean = true) {
    const token = localStorage.getItem('token');
    if (token === null) {
      this.props.history.push('/');
      return;
    }

    this.setState({
      loading: true,
      transactions: reset ? [] as Transaction[] : this.state.transactions
    });

    const page = reset ? this.state.page : this.state.page + 1;
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('token', token);
    params.set('farmer', '1');

    try {
      const response = await axios.get(`${WEBAPI}/transaction/list.php?${params.toString()}`);
      if (response.data.success) {
        const transactions = this.state.transactions;
        for (let i = 0; i < response.data.transactions.length; i++) {
          const transaction = response.data.transactions[i];
          transactions.push(transaction);
        }

        this.setState({
          hasNext: response.data.next,
          transactions
        });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error: any) {
      this.setState({ error: 'Unable to fetch your profile' });
    }

    this.setState({
      loading: false,
      page
    });
  }

  async load () {
    if (this.state.hasNext && !this.state.loading) {
      await this.getTransactions(false);
    }
  }

  async componentDidMount () {
    await this.getTransactions();
  }

  render () {
    const transactions = [] as React.ReactNode[];
    for (let i = 0; i < this.state.transactions.length; i++) {
      const transaction = this.state.transactions[i];
      let transactionid = transaction.id;
      while (transactionid.length < 5) transactionid = `0${transactionid}`;

      const date = dateFormat(transaction.date);
      transactions.push(
        <tr key={i}>
          <td>{ transactionid }</td>
          <td>{ date }</td>
          <td>
            <Link to={'/records/sales/' + transaction.code}>View Details</Link>
          </td>
        </tr>
      );
    }

    return (
      <IonPage>
        <IonContent scrollEvents={true} onIonScrollEnd={this.load} fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.push('/farmer/dashboard'); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">Return to Home Page</span>
          </header>

          <main>
            <div className="dashboard-title-bar text-bold my-2 p-1 text-center">
              <span className="text-xl text-bold p-1">Monthly Sales Table</span>
            </div>

            <table className="table table-striped text-center">
              <thead className="table-primary">
                <tr className="text-sm">
                  <th>Transaction ID</th>
                  <th>Transaction Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                { transactions }
              </tbody>
            </table>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default SalesRecordPage;
