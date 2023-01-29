
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import './Transaction.css';

interface DeliveryPageState {
  transactions: Transaction[][];
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

    this.receive = this.receive.bind(this);
  }

  receive (index: number) {
    const token = localStorage.getItem('token');
    if (token === null) {
      this.props.history.push('/');
      return;
    }

    return async (event: React.MouseEvent) => {
      const transactions = this.state.transactions;
      const transaction = transactions[index][0];
      if (transaction.status !== 'approved') return;

      const code = transaction.code;
      await axios.post(`${WEBAPI}/transaction/receive.php`, { token, code });

      transactions[index] = transactions[index].map(tx => {
        tx.status = 'success';
        return tx;
      });

      this.setState({ transactions });
    }
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

        this.setState({ transactions: grouped });
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
      const shipping = parseFloat(items[0].shipping);
      const total = items.reduce((prev, curr) => {
        prev += parseFloat(curr.amount);
        return prev;
      }, shipping);

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
                      <div className="mb-1">Amount: ₱{ (parseFloat(transaction.amount) / parseInt(transaction.quantity)).toFixed(2) }</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          }

          <div className="d-flex">
            <div className="transaction-img"></div>
            <div>
              <div className="mb-1">Shipping Fee: ₱{ shipping.toFixed(2) }</div>
              <div className="mb-1">Total Amount: ₱{ total.toFixed(2) }</div>
              <button type="button" className="delivered" onClick={this.receive(i)}>{ items[0].status === 'success' ? 'Order Received' : 'To Deliver' }</button>
            </div>
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
