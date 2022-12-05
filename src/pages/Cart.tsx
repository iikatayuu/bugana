
import React from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, CartItem } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as CartIcon } from '../assets/cart-lg.svg';
import './Cart.css';

interface CartPageState {
  cart: CartItemSelectable[];
  message: string;
}

interface CartItemSelectable extends CartItem {
  selected: boolean;
}

class CartPage extends React.Component<RouterProps, CartPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      cart: [] as CartItemSelectable[],
      message: ''
    };

    this.updateQuantity = this.updateQuantity.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  updateQuantity (action: string, index: number) {
    return (event: React.MouseEvent) => {
      const cart = this.state.cart;
      const quantity = parseInt(cart[index].quantity)
      if (action === '-') cart[index].quantity = (quantity - 1).toString();
      if (action === '+') cart[index].quantity = (quantity + 1).toString();
      this.setState({ cart });
    }
  }

  toggleSelect (index: number) {
    return (event: React.ChangeEvent) => {
      const cart = this.state.cart;
      cart[index].selected = !cart[index].selected;
      this.setState({ cart });
    }
  }

  selectAll (event: React.ChangeEvent) {
    const cart = this.state.cart;
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    for (let i = 0; i < cart.length; i++) {
      cart[i].selected = value;
    }

    this.setState({ cart });
  }

  checkout (event: React.MouseEvent) {
    event.preventDefault();

    const items: CartItem[] = [];
    this.state.cart.forEach(item => {
      if (!item.selected) return;
      items.push(item);
    });

    if (items.length === 0) return;
    const data = JSON.stringify(items);
    localStorage.setItem('checkout', data);
    this.props.history.push('/checkout');
  }

  async componentDidMount () {
    const token = localStorage.getItem('token');
    if (token === null) {
      this.props.history.push('/');
      return;
    }

    try {
      const response = await axios.get(`${WEBAPI}/cart/get.php?token=${token}`);
      if (response.data.success) {
        const cart = response.data.cart;
        for (let i = 0; i < cart.length; i++) cart[i].selected = false;

        this.setState({ cart });
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }
  }

  render () {
    const cart: React.ReactNode[] = [];
    const total = this.state.cart.reduce((acc, value) => {
      if (!value.selected) return acc;
      const quantity = parseInt(value.quantity);
      const price = parseFloat(value.product.price);
      return acc + (quantity * price)
    }, 0);

    if (this.state.cart.length > 0) {
      const sellers: string[] = [];
      for (let i = 0; i < this.state.cart.length; i++) {
        const item = this.state.cart[i];
        const product = item.product;
        const user = item.user;
        let seller: React.ReactNode = '';
        if (!sellers.includes(user.id)) {
          seller = <div className="cart-seller mb-1">{ user.name }</div>;
          sellers.push(user.id);
        }

        cart.push(
          <div className="my-2" key={i}>
            { seller}
            <div className="cart-item">
              <input type="checkbox" className="mr-5" checked={item.selected} onChange={this.toggleSelect(i)} />
              <img src={WEBURL + product.photos[0]} alt={product.name + ' Image'} width={75} height={75} className="mr-3" />
              <div className="cart-item-info">
                <Link to={`/product/${product.id}`} className="cart-item-title">{ product.name }</Link>
                <div className="text-primary-old text-sm mt-2">Price: { product.price }</div>
                <div className="cart-item-quantity mt-1">
                  <button type="button" onClick={this.updateQuantity('-', i)}>-</button>
                  <div className="text-center">{ item.quantity }</div>
                  <button type="button" onClick={this.updateQuantity('+', i)}>+</button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">My Cart</span>
          </header>

          <main className="main-cart">
            { this.state.cart.length > 0 ? cart : <CartIcon className="cart-icon" />}
          </main>

          <footer className="cart-actions">
            <input type="checkbox" id="cart-all" className="ml-1" onChange={this.selectAll} />
            <div className="flex-1 ml-1">
              <label htmlFor="cart-all">All</label>
            </div>
            <div className="mr-3">Total: <span className="text-danger text-bold">{ total.toFixed(2) }</span></div>
            <button type="button" className="cart-btn btn btn-primary" onClick={this.checkout}>Check Out</button>
          </footer>
        </IonContent>
      </IonPage>
    );
  }
}

export default CartPage;
