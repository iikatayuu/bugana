
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../../types';
import { WEBAPI } from '../../variables';
import { ReactComponent as LeftIcon } from '../../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../../assets/loader.svg';
import './Dashboard.css';

interface SalesRecordTransactionPageState {
  transactionid: string;
  transactions: Transaction[];
  loading: boolean;
  error: string;
}

class SalesRecordTransactionPage extends React.Component<RouterProps, SalesRecordTransactionPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      transactionid: props.match.params.id,
      transactions: [] as Transaction[],
      loading: true,
      error: ''
    };
  }

  async componentDidMount () {
    const token = localStorage.getItem('token');
    if (token === null) {
      this.props.history.push('/');
      return;
    }

    this.setState({ loading: true });
    const params = new URLSearchParams();
    params.set('token', token);
    params.set('id', this.state.transactionid)

    try {
      const response = await axios.get(`${WEBAPI}/transaction/get.php?${params.toString()}`);
      if (response.data.success) {
        this.setState({ transactions: response.data.transactions });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error: any) {
      this.setState({ error: 'Unable to fetch your profile' });
    }

    this.setState({ loading: false });
  }

  render () {
    const transactions: React.ReactNode[] = [];
    let tx: Transaction | null = null;
    let totalAmount = 0;

    for (let i = 0; i < this.state.transactions.length; i++) {
      const transaction = this.state.transactions[i];
      if (tx === null) tx = transaction;

      transactions.push(
        <tr key={i}>
          <td>{ transaction.product.name }</td>
          <td>{ transaction.quantity }</td>
          <td>{ transaction.product.price }</td>
        </tr>
      );

      totalAmount += parseFloat(transaction.amount);
    }

    if (tx !== null && tx.paymentoption === 'delivery') totalAmount += 50;

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.push('/records/sales'); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">Return to Monthly Sales Table</span>
          </header>

          <main>
            <div className="dashboard-title-bar text-bold my-2 p-1">
              <span className="text-lg text-bold p-1">Order { tx !== null ? (tx.status === 'success' ? 'Completed' : 'Pending') : '' }</span>
            </div>

            {
              this.state.error !== '' &&
              <div className="mt-2 text-center">{ this.state.error }</div>
            }

            {
              this.state.loading &&
              <div className="mt-2 text-center">
                <LoaderIcon width={100} />
                <span>Fetching order details...</span>
              </div>
            }

            <div className="bg-tertiary text-md p-2">
            { tx !== null &&
              <React.Fragment>
                <div className="text-center mb-2">Transaction ID: { tx.code }</div>
                <div className="mb-2">Ordered by: { tx.user.name }</div>
                <div className="mb-2">Transaction Date: { tx.date }</div>
              </React.Fragment>
            }

            {
              transactions.length > 0
              ? (
                <table className="w-100 text-left mb-3">
                  <thead>
                    <tr>
                      <th className="pb-1">Product Name</th>
                      <th className="pb-1">Quantity</th>
                      <th className="pb-1">Price</th>
                    </tr>
                  </thead>

                  <tbody>{ transactions }</tbody>
                </table>
              )
              : ''
            }

            {
              tx !== null
              ? <div className="d-flex mr-4">
                  <div className="ml-auto">Total Amount: { totalAmount } </div>
                </div>
              : ''
            }
            </div>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default SalesRecordTransactionPage;
