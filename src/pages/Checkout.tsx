
import React from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonModal } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Profile, CartItem } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as AddressIcon } from '../assets/address.svg';
import { ReactComponent as BagIcon } from '../assets/bag.svg';
import { ReactComponent as CartDownIcon } from '../assets/cart-down.svg';
import { ReactComponent as DetailsIcon } from '../assets/details.svg';
import { ReactComponent as ModalCheckIcon } from '../assets/modal-check.svg';
import { ReactComponent as ModalXIcon } from '../assets/modal-x.svg';
import './Checkout.css';

interface CheckoutPageState {
  profile: Profile | null;
  shipping: number;
  items: CartItem[];
  payment: string;
  confirm: boolean;
  loading: boolean;
  error: string;
  checkingOut: boolean;
  openDarkModal: boolean;
  darkModalMessage: string;
  darkModalIcon: string;
}

class CheckoutPage extends React.Component<RouterProps, CheckoutPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      profile: null,
      shipping: 0,
      items: [] as CartItem[],
      payment: 'pickup',
      confirm: false,
      loading: true,
      error: '',
      checkingOut: false,
      openDarkModal: false,
      darkModalMessage: '',
      darkModalIcon: ''
    };

    this.openModal = this.openModal.bind(this);
    this.checkout = this.checkout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.modal = this.modal.bind(this);
  }

  openModal (event: React.MouseEvent) {
    const items = this.state.items;
    const profile = this.state.profile;
    let total = 0;
    if (items.length > 0 && profile !== null) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const product = item.product;
        const price = parseFloat(product.price);
        const totalPrice = parseInt(item.quantity) * price;

        total += totalPrice;
      }
    }

    if (total <= 150) {
      this.modal('Cannot proceed minimum order is limit to 150 pesos', 'x', true)();
    } else {
      this.setState({ confirm: true });
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

  async checkout (event: React.MouseEvent) {
    const token = localStorage.getItem('token');
    if (token === null) return;

    this.setState({
      error: '',
      checkingOut: true
    });

    try {
      const response = await axios.post(`${WEBAPI}/checkout.php`, {
        items: this.state.items,
        paymentoption: this.state.payment,
        shipping: this.state.payment === 'delivery' ? this.state.shipping : 0,
        token
      });

      if (response.data.success) {
        localStorage.removeItem('checkout');
        window.location.href = '/';
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error: any) {
      this.setState({ error: error.message });
    }

    this.setState({ checkingOut: false });
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.setState({ payment: value });
  }

  async componentDidMount () {
    const checkout = localStorage.getItem('checkout');
    const token = localStorage.getItem('token');
    if (checkout === null || token === null) {
      this.props.history.push('/');
      return;
    }

    try {
      const response = await axios.get(`${WEBAPI}/profile.php?token=${token}`);
      if (response.data.success) {
        const profile = response.data.profile;
        const shippingFeeRes = await axios.get(`${WEBAPI}/shipping.php?brgy=${profile.addressbrgy}`);

        this.setState({ profile, shipping: shippingFeeRes.data.fee });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error: any) {
      this.setState({ error: 'Unable to fetch your data' });
    }

    const items: CartItem[] = JSON.parse(checkout);
    this.setState({
      items,
      loading: false
    });
  }

  render () {
    const items = this.state.items;
    const profile = this.state.profile;
    const products: React.ReactNode[] = [];
    let total = this.state.payment === 'delivery' ? this.state.shipping : 0;

    if (items.length > 0 && profile !== null) {
      const sellers: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const product = item.product;
        const user = item.user;
        const price = parseFloat(product.price);
        const totalPrice = parseInt(item.quantity) * price;
        let seller: React.ReactNode = '';
        if (!sellers.includes(user.id)) {
          seller = <div className="checkout-seller mb-1">{ user.name }</div>
          sellers.push(user.id);
        }

        total += totalPrice;
        products.push(
          <div className="w-100" key={i}>
            { seller }
            <div className="checkout-item">
              <BagIcon className="mr-2" />
              <img src={WEBURL + product.photos[0]} alt={product.name + ' Image'} width={100} height={100} className="checkout-item-img mr-3" />
              <div className="text-bold flex-1">
                <div className="text-center text-md mb-3">{ product.name }</div>
                <div className="checkout-text mb-3">Quantity: { item.quantity }</div>
                <div className="checkout-text">Price: { price.toFixed(2) }</div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <IonPage className={this.state.confirm ? 'blur' : ''}>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">My Checkout</span>
          </header>

          <main className="main-checkout">
            {
              this.state.error !== '' &&
              <div className="mt-2 text-center">{ this.state.error }</div>
            }

            {
              this.state.loading &&
              <div className="mt-2 text-center">
                <LoaderIcon width={100} />
                <span>Fetching customer data...</span>
              </div>
            }

            {
              items.length > 0 && profile !== null &&
              <React.Fragment>
                <div className="checkout-container">
                  <AddressIcon className="mr-2" />
                  <div className="flex-1">
                    <div className="text-bold">{ profile.addressstreet }, { profile.addresspurok }, { profile.addressbrgy }</div>
                    <div className="checkout-text text-bold mt-1">
                      <div className="mb-1">Name: { profile.name }</div>
                      <div>Mobile: { profile.mobile }</div>
                    </div>
                  </div>

                  <Link to="/profile" className="checkout-address-edit my-2 mr-3">Edit</Link>
                </div>

                <div className="checkout-products-container">
                  { products }
                </div>

                <div className="checkout-container mt-3 pb-2">
                  <CartDownIcon className="mr-2" />
                  <div className="flex-1">
                    <div className="text-center text-bold">PAYMENT OPTION</div>
                    <div className="checkout-text text-bold mt-1">
                      <div className="d-flex mb-2">
                        <input type="radio" id="payment-option-pickup" name="payment-option" value="pickup" checked={this.state.payment==='pickup'} className="payment-option" onChange={this.handleChange} />
                        <label htmlFor="payment-option-pickup">Pick Up</label>
                      </div>

                      <div className="d-flex mb-2">
                        <input type="radio" id="payment-option-delivery" name="payment-option" value="delivery" checked={this.state.payment==='delivery'} className="payment-option" onChange={this.handleChange} />
                        <label htmlFor="payment-option-delivery">Delivery</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="checkout-container mt-3 pb-2">
                  <DetailsIcon className="mr-2" />
                  <div className="flex-1">
                    <div className="text-center text-bold">PAYMENT DETAILS</div>
                    <div className="checkout-text text-bold mt-1">
                      <div className="d-flex mt-2 mr-3">
                        <div className="flex-1">Product Total:</div>
                        <div>{ total.toFixed(2) }</div>
                      </div>
                      { this.state.payment === 'delivery' &&
                        <div className="d-flex mt-2 mr-3">
                          <div className="flex-1">Shipping Subtotal:</div>
                          <div>{ this.state.shipping.toFixed(2) }</div>
                        </div>
                      }
                      <div className="d-flex text-lg mt-2 mr-3">
                        <div className="flex-1">Total Payment:</div>
                        <div className="text-primary-old">{ total.toFixed(2) }</div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            }
          </main>

          <footer className="checkout-actions">
            <div className="flex-1">Total Payment: <span className="text-primary-old text-bold ml-2">{ total.toFixed(2) }</span></div>
            <button type="button" className="checkout-btn btn btn-primary" onClick={this.openModal}>Confirm</button>
          </footer>

          <IonModal id="modal-confirm" isOpen={this.state.confirm} onDidDismiss={() => this.setState({ confirm: false })}>
            <IonContent>
              <div className="modal-confirm-content m-3">
                <div className="text-center text-bold mb-1">CONFIRM CHECKOUT</div>
                <div className="modal-checkout card card-rect card-primary">
                  Upon confirming this purchase, you are agreeing to the following terms:
                  <ol>
                    <li>1. Delivery hours is 12NN and 6PM</li>
                    <li>2. Purchases are FINAL and CANNOT be CANCELED</li>
                    <li>3. Your account will be:
                      <ul>
                        <li>FIRST OFFENSE - WARNING</li>
                        <li>SECOND OFFENSE - BAN</li>
                        <li>If purchases or transactions are NOT COMPLETED</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                <div className="text-danger mt-2">{ this.state.error }</div>
                <button type="button" className="btn btn-secondary-old btn-block btn-round w-50 mt-2" onClick={this.checkout} disabled={this.state.checkingOut}>
                  { this.state.checkingOut ? 'Checking Out...' : 'Confirm' }
                </button>
              </div>
            </IonContent>
          </IonModal>

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

export default CheckoutPage;
