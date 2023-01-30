
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Transaction } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import { ReactComponent as ModalCheckIcon } from '../assets/modal-check.svg';
import { ReactComponent as ModalXIcon } from '../assets/modal-x.svg';
import './Transaction.css';

interface DeliveryPageState {
  transactions: Transaction[][];
  loading: boolean;
  error: string;
  openDarkModal: boolean;
  darkModalMessage: string;
  darkModalIcon: string;
}

class DeliveryPage extends React.Component<RouterProps, DeliveryPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      transactions: [],
      loading: true,
      error: '',
      openDarkModal: false,
      darkModalMessage: '',
      darkModalIcon: ''
    };

    this.receive = this.receive.bind(this);
    this.modal = this.modal.bind(this);
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
      this.modal('Order has been received', 'check', true)();
    }
  }

  modal (message: string, icon: string = '', show: boolean = true) {
    return (event?: React.MouseEvent) => {
      this.setState({
        darkModalMessage: message,
        darkModalIcon: icon,
        openDarkModal: show
      });

      if (show) {
        setTimeout(() => {
          this.setState({ openDarkModal: false });
        }, 5000);
      }
    }
  }

  async componentDidMount () {
    const token = localStorage.getItem('token');
    if (token === null) {
      this.props.history.push('/');
      return;
    }

    try {
      const response = await axios.get(`${WEBAPI}/transaction/list.php?type=delivery&token=${token}&pending`);
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
      const status = items[0].status;
      if (status === 'success' || status === 'rejected') continue;

      transactions.push(
        <div className="transaction card card-rect d-flex flex-column align-items-center m-2" key={i}>
          {
            items.map((transaction, itemI) => {
              const product = transaction.product;
              const user = transaction.user;

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
                  </div>
                </React.Fragment>
              );
            })
          }

          <button type="button" className="btn-received mt-2" onClick={this.receive(i)}>Order Received</button>
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

          {
            this.state.openDarkModal && <React.Fragment>
              <div className="dark-modal-backdrop" onClick={this.modal('', '', false)}></div>
              <div className="dark-modal-wrapper" onClick={this.modal('', '', false)}>
                <div className="dark-modal d-flex flex-column align-items-center text-center">
                  { this.state.darkModalIcon === 'check' && <ModalCheckIcon width={32} height={32} className="mb-1" /> }
                  { this.state.darkModalIcon === 'x' && <ModalXIcon width={32} height={32} className="mb-1" /> }
                  { this.state.darkModalMessage }
                </div>
              </div>
            </React.Fragment>
          }
        </IonContent>
      </IonPage>
    );
  }
}

export default DeliveryPage;
