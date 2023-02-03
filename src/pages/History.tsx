
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { dateFormat } from '../utils/date';
import { ReactComponent as NoOrderIcon } from '../assets/no-order.svg';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import './Transaction.css';

interface HistoryPageState {
  transactions: Transaction[][];
  loading: boolean;
  error: string;
}

class HistoryPage extends React.Component<RouterProps, HistoryPageState> {
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
      const response = await axios.get(`${WEBAPI}/transaction/list.php?token=${token}`);
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
      const shipping = parseFloat(items[0].shipping);
      const total = items.reduce((prev, curr) => {
        prev += parseFloat(curr.amount);
        return prev;
      }, shipping);
      let status = '';

      transactions.push(
        <div className="transaction card card-rect d-flex flex-column align-items-center m-2" key={i}>
          {
            items.map((transaction, itemI) => {
              const product = transaction.product;
              const user = transaction.user;
              status = transaction.status;

              return (
                <React.Fragment key={itemI}>
                  <h6 className="transaction-product-title text-center text-bold mb-1">{ product.name }</h6>
                  <img src={WEBURL + transaction.product.photos[0]} alt={product.name + ' Image'} width={135} height={135} className="mx-auto" />
                  <p className="transaction-product-description text-center my-2">"{ product.description }"</p>

                  <div>
                    <div className="mb-1">
                      <span className="text-bold">Farmers Name:</span> { user.name }
                    </div>
                    <div className="mb-1">
                      <span className="text-bold">Address:</span> { user.addressstreet + ', ' + user.addresspurok + ', ' + user.addressbrgy }
                    </div>
                    <div className="mb-1">
                      <span className="text-bold">Product:</span> { product.name }
                    </div>
                    <div className="mb-1">
                      <span className="text-bold">Quantity:</span> { transaction.quantity } kg
                    </div>
                    <div className="mb-1">
                      <span className="text-bold">Amount:</span> ₱{ transaction.amount }
                    </div>
                    <div className="mb-1">
                      <span className="text-bold">Total Amount:</span> ₱{ total.toFixed(2) }
                    </div>
                    <div className="mb-1">
                      <span className="text-bold">Transaction Completed:</span> { dateFormat(transaction.date) }
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          }

          { status === 'success' && <button type="button" className="btn-received mt-2" disabled>Order { items[0].paymentoption === 'pickup' ? 'Picked up' : 'Received' }</button> }
          { status === 'rejected' && <button type="button" className="btn-received btn-received-error mt-2" disabled>Violation, Did not Pick up or Received</button> }
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

            {
              !this.state.loading && transactions.length === 0 && (
                <div className="no-order-icon text-center">
                  <NoOrderIcon className="mr-4" />
                  <div className="text-bold mt-1">You have no orders yet...</div>
                </div>
              )
            }

            { transactions }
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default HistoryPage;
