
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import './Transaction.css';

interface HistoryPageState {
  shipping: number;
  transactions: Transaction[][];
  loading: boolean;
  error: string;
}

class HistoryPage extends React.Component<RouterProps, HistoryPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      shipping: 0,
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
      const response = await axios.get(`${WEBAPI}/transaction/list.php?token=${token}`);
      if (response.data.success) {
        const profileRes = await axios.get(`${WEBAPI}/profile.php?token=${token}`);
        const profile = profileRes.data.profile;
        const shippingFeeRes = await axios.get(`${WEBAPI}/shipping.php?brgy=${profile.addressbrgy}`);
        const shipping = shippingFeeRes.data.fee;

        const transactions: Transaction[] = response.data.transactions;
        const grouped: Transaction[][] = [];
        let index = -1;
        let lastCode = '';

        for (let i = 0; i < transactions.length; i++) {
          const transaction = transactions[i];
          if (transaction.code !== lastCode) {
            lastCode = transaction.code;
            index++;
            grouped[index] = [transaction];
          } else {
            grouped[index].push(transaction);
          }
        }

        this.setState({ transactions: grouped, shipping });
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
      const items = this.state.transactions[i];
      const sellers: string[] = [];

      transactions.push(
        <div className="transaction card card-tertiary card-rect m-2 text-bold" key={i}>
          {
            items.map((transaction, itemI) => {
              const product = transaction.product;
              const user = transaction.user;
              let seller: React.ReactNode = '';
              if (!sellers.includes(user.id)) {
                sellers.push(user.id);
                seller = (
                  <React.Fragment>
                    <div className="text-md mt-2">{ user.name }</div>
                    <div className="mb-1">{ user.addressstreet + ', ' + user.addresspurok + ', ' + user.addressbrgy }</div>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={itemI}>
                  { seller }
                  <div className="d-flex mb-1">
                    <div className="text-center">
                      <img src={WEBURL + transaction.product.photos[0]} alt={product.name + ' Image'} width={135} height={100} className="mr-2" />
                      <div>{ product.name }</div>
                    </div>
                    <div className="transaction-details flex-1">
                      <div className="mb-1">Quantity: { transaction.quantity }</div>
                      <div className="mb-1">Amount: { (parseFloat(transaction.amount) / parseInt(transaction.quantity)).toFixed(2) }</div>
                      { transaction.paymentoption === 'delivery' && <div className="mb-1">Shipping Fee: { this.state.shipping.toFixed(2) }</div> }
                      <div className="mb-1">Total Amount: { (parseFloat(transaction.amount) + (transaction.paymentoption === 'delivery' ? this.state.shipping : 0)).toFixed(2) }</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          }
          
          <div className="text-center mt-2">
            <div>Order { items[0].paymentoption === 'pickup' ? 'Picked up' : 'Received' }</div>
            <div>{ items[0].date }</div>
          </div>
        </div>
      );
    }

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header bg-primary-old">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">Purchase History</span>
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

export default HistoryPage;
