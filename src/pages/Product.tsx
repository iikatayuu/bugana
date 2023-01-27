
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, ProductStock, Farmer, CartItem } from '../types';
import { WEBURL, WEBAPI } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import { ReactComponent as ModalCheckIcon } from '../assets/modal-check.svg';
import { ReactComponent as ModalXIcon } from '../assets/modal-x.svg';
import './Product.css';

interface ProductPageState {
  loading: boolean;
  product: ProductStock | null;
  farmer: Farmer | null;
  activePhoto: number;
  photosLength: number;
  cart: boolean;
  cartQuantity: number;
  checkout: boolean;
  checkoutQuantity: number;
  addingCart: boolean;
  checkingOut: boolean;
  message: string;
  openDarkModal: boolean;
  darkModalMessage: string;
  darkModalIcon: string;
}

type OutType = "cart" | "checkout";

class ProductPage extends React.Component<RouterProps, ProductPageState> {
  touchstartX = 0;
  touchendX = 0;

  constructor (props: RouterProps) {
    super(props);
    
    this.state = {
      loading: true,
      product: null,
      farmer: null,
      activePhoto: 0,
      photosLength: 0,
      cart: false,
      cartQuantity: 0,
      checkout: false,
      checkoutQuantity: 0,
      addingCart: false,
      checkingOut: false,
      message: '',
      openDarkModal: false,
      darkModalMessage: '',
      darkModalIcon: ''
    };

    this.imageTouchStart = this.imageTouchStart.bind(this);
    this.imageTouchEnd = this.imageTouchEnd.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.checkout = this.checkout.bind(this);
    this.modal = this.modal.bind(this);
  }

  imageTouchStart (event: React.TouchEvent) {
    this.touchstartX = event.changedTouches[0].screenX;
  }

  imageTouchEnd (event: React.TouchEvent) {
    this.touchendX = event.changedTouches[0].screenX;
    const activePhoto = this.state.activePhoto;
    const photosLength = this.state.photosLength;
    if (this.touchendX < this.touchstartX && activePhoto < photosLength - 1) this.setState({ activePhoto: activePhoto + 1 });
    if (this.touchendX > this.touchstartX && activePhoto > 0) this.setState({ activePhoto: activePhoto - 1 });
  }

  updateQuantity (out: OutType, action: string) {
    if (!this.state.product) return

    const stocks = this.state.product.currentStocks;
    let quantity = out === 'cart' ? this.state.cartQuantity : this.state.checkoutQuantity;
    if (action === '-' && quantity > 0) quantity--;
    if (action === '+' && quantity < stocks) quantity++;

    return (event: React.MouseEvent) => {
      if (out === 'cart') this.setState({ cartQuantity: quantity });
      if (out === 'checkout') this.setState({ checkoutQuantity: quantity });
    }
  }

  open (out: OutType) {
    return (event: React.MouseEvent) => {
      if (out === 'cart') this.setState({ cart: true });
      if (out === 'checkout') this.setState({ checkout: true });
    }
  }

  close (event: React.MouseEvent) {
    this.setState({
      cart: false,
      checkout: false
    });
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

  async addToCart (event: React.FormEvent) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const quantity = this.state.cartQuantity;
    if (token === null || this.state.product === null || quantity === 0) return;

    this.setState({
      message: '',
      addingCart: true
    });

    const target = event.target as HTMLFormElement;
    const formData = new FormData();
    formData.append('token', token);
    formData.append('quantity', quantity.toString());
    formData.append('product', this.state.product.id);

    try {
      const response = await axios.post(target.action, formData)
      if (response.data.success) {
        this.setState({ cart: false });
        this.modal('Added to cart', 'check', true)();
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: 'Unable to register' });
    }

    this.setState({ addingCart: false });
  }

  async checkout (event: React.FormEvent) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const farmer = this.state.farmer;
    const product = this.state.product;
    const quantity = this.state.checkoutQuantity
    if (token === null || product === null || farmer === null || quantity === 0) return;

    this.setState({
      message: '',
      checkingOut: true
    });

    const date = new Date();
    const dateString =
      date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds()

    const item: CartItem = {
      id: '0',
      user: {
        id: farmer.id,
        name: farmer.name,
        username: farmer.username
      },
      product,
      quantity: quantity.toString(),
      date: dateString
    }

    const data = JSON.stringify([item]);
    localStorage.setItem('checkout', data);
    this.props.history.push('/checkout');
    this.setState({ checkingOut: false });
  }

  async componentDidMount () {
    try {
      const id = this.props.match.params.id;
      const response = await axios.get(`${WEBAPI}/product/get.php?id=${id}&stock=1`);
      const farmer = await axios.get(`${WEBAPI}/product/farmer.php?id=${id}`);

      if (response.data.success && farmer.data.success) {
        this.setState({
          product: response.data.product,
          farmer: farmer.data.farmer,
          photosLength: response.data.product.photos.length
        });
      } else {
        this.setState({ message: response.data.message || farmer.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }

    this.setState({ loading: false });
  }

  render () {
    const product = this.state.product;
    const farmer = this.state.farmer;

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
          </header>

          <main>
            {
              this.state.loading &&
              <div className="mt-2 text-center">
                <LoaderIcon width={100} />
                <span>Fetching product data...</span>
              </div>
            }

            {
              product !== null && farmer !== null &&
              <div>
                <div className="product-photos" onTouchStart={this.imageTouchStart} onTouchEnd={this.imageTouchEnd}>
                  {
                    product.photos.map((photo, i) => {
                      return (
                        <div className="product-photo" key={i} style={{ display: i === this.state.activePhoto ? '' : 'none' }}>
                          <img src={WEBURL + photo} alt="" width={250} height={250} />
                        </div>
                      );
                    })
                  }
                </div>

                <div className="card card-rect card-shadow text-center mx-2">
                  <h5 className="product-title mb-2">{ product.name }</h5>
                  <p className="product-description mb-2">"{ product.description }"</p>
                  <p className="product-price my-4 mb-2">PHP: { product.price }/kg</p>

                  <p className="text-sm mt-3 mb-2"><span className="text-primary-old">Note:</span> A total minimum of 150PHP is required for each order</p>
                </div>

                <div className="card card-rect card-shadow mt-4 mx-2">
                  <div className="d-flex">
                    <img src={WEBURL + '/api/profileimg.php?id=' + farmer.id} alt={farmer.name + ' Image'} width={50} height={50} />

                    <div className="ml-3">
                      <div className="product-farmer-name">Farmer's Name: { farmer.name }</div>
                      <strong className="product-farmer-address">Address: { farmer.addressstreet + ', ' + farmer.addresspurok + ', ' + farmer.addressbrgy }</strong>
                    </div>
                  </div>

                  <div className="d-flex justify-space-around mt-4">
                    <div>
                      <div className="product-stats-value text-center">{ farmer.products }</div>
                      <div className="product-stats-name">PRODUCTS</div>
                    </div>

                    <div>
                      <div className="product-stats-value text-center">{ product.currentStocks } kg</div>
                      <div className="product-stats-name">Available Stock</div>
                    </div>

                    <div>
                      <div className="product-stats-value text-center">{ farmer.transactions }</div>
                      <div className="product-stats-name">FULFILLMENT</div>
                    </div>
                  </div>
                </div>

                <div className="product-actions d-flex justify-space-around mt-3">
                  <button type="button" className="btn btn-secondary btn-lg btn-round" onClick={this.open('cart')}>Add to Cart</button>
                  <button type="button" className="btn btn-secondary btn-lg btn-round" onClick={this.open('checkout')}>Checkout</button>
                </div>
              </div>
            }
          </main>

          <div className={'popup-wrapper' + (this.state.cart || this.state.checkout ? '' : ' d-none')} onClick={this.close}></div>
          <div className={'popup' + (this.state.cart ? ' popup-open' : '')}>
            <form action={WEBAPI + '/cart/add.php'} method="post" className="product-cart text-center" onSubmit={this.addToCart}>
              <div className="popup-title mb-3">Unit</div>
              <div className="d-flex justify-space-between align-items-center">
                <button type="button" className="btn btn-secondary-old">kilogram</button>
                <div className="product-cart-quantity d-flex align-items-center">
                  <button type="button" onClick={this.updateQuantity('cart', '-')}>-</button>
                  <div className="text-center">{ this.state.cartQuantity }</div>
                  <button type="button" onClick={this.updateQuantity('cart', '+')}>+</button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-xl btn-round text-align mt-4" disabled={this.state.addingCart}>
                { this.state.addingCart ? 'Adding to cart...' : 'Add to Cart' }
              </button>
            </form>
          </div>

          <div className={'popup' + (this.state.checkout ? ' popup-open' : '')}>
            <form action="/checkout" method="post" className="product-cart text-center" onSubmit={this.checkout}>
              <div className="popup-title mb-3">Unit</div>
              <div className="d-flex justify-space-between align-items-center">
                <button type="button" className="btn btn-secondary-old">kilogram</button>
                <div className="product-cart-quantity d-flex align-items-center">
                  <button type="button" onClick={this.updateQuantity('checkout', '-')}>-</button>
                  <div className="text-center">{ this.state.checkoutQuantity }</div>
                  <button type="button" onClick={this.updateQuantity('checkout', '+')}>+</button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-xl btn-round text-align mt-4" disabled={this.state.checkingOut}>
                { this.state.checkingOut ? 'Checking out...' : 'Checkout' }
              </button>
            </form>
          </div>

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

export default ProductPage;
