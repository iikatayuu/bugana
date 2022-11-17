
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import './Transaction.css';

interface DeliveryPageState {
  transactions: Transaction[];
  loading: boolean;
  error: string;
}

class DeliveryPage extends React.Component<RouterProps, DeliveryPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      transactions: [],
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

    try {
      const response = await axios.get(`${WEBAPI}/transaction/list.php?type=delivery&token=${token}`);
      if (response.data.success) {
        this.setState({ transactions: response.data.transactions });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error: any) {
      this.setState({ error: 'Unable to fetch your data' });
    }

    this.setState({ loading: false });
  }

  render () {
    const transactions: React.ReactNode[] = [];
    for (let i = 0; i < this.state.transactions.length; i++) {
      const transaction = this.state.transactions[i];
      const user = transaction.user;
      const product = transaction.product;
      transactions.push(
        <div className="transaction card card-tertiary card-rect d-flex m-2 text-bold" key={i}>
          <div className="text-center">
            <img src={WEBURL + transaction.product.photos[0]} alt={product.name + ' Image'} width={135} height={100} className="mr-2" />
            <div>{ product.name }</div>
          </div>
          <div className="transaction-details flex-1">
            <div className="text-md">{ user.name }</div>
            <div className="mb-3">{ user.addressstreet + ', ' + user.addressbrgy + ', ' + user.addresscity }</div>
            <div className="mb-1">Quantity: { transaction.quantity }</div>
            <div className="mb-1">Amount: { (parseFloat(transaction.amount) / parseInt(transaction.quantity)).toFixed(2) }</div>
            <div className="mb-1">Total Amount: { transaction.amount }</div>
            <button type="button" className="delivered mt-2">Order Received</button>
          </div>
        </div>
      );
    }

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">To Deliver</span>
          </header>

          <main>
            {
              this.state.loading &&
              <div className="mt-2 text-center">
                <LoaderIcon width={100} />
                <span>Fetching data...</span>
              </div>
            }

            { transactions }
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default DeliveryPage;
