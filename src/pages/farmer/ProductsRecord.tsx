
import React from 'react';
import { IonPage, IonContent, IonSelect, IonSelectOption, SelectChangeEventDetail } from '@ionic/react';
import { IonSelectCustomEvent } from '@ionic/core';
import axios from 'axios';

import { RouterProps, TokenPayload, Category, ProductStock } from '../../types';
import { WEBAPI } from '../../variables';
import { ReactComponent as LeftIcon } from '../../assets/left.svg';
import './Dashboard.css';

interface ProductsRecordPageState {
  page: number;
  category: Category | "all";
  products: ProductStock[];
  hasNext: boolean;
  loading: boolean;
  error: string;
}

class ProductsRecordPage extends React.Component<RouterProps, ProductsRecordPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      page: 1,
      category: 'all',
      products: [] as ProductStock[],
      hasNext: false,
      loading: true,
      error: ''
    };

    this.load = this.load.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
  }

  async getProducts (reset: boolean = true, category: Category | "all" = 'all') {
    const token = localStorage.getItem('token');
    const payloadStr = localStorage.getItem('payload');
    if (token === null || payloadStr === null) {
      this.props.history.push('/');
      return;
    }

    this.setState({
      loading: true,
      products: reset ? [] as ProductStock[] : this.state.products
    });

    const page = reset ? this.state.page : this.state.page + 1;
    const payload: TokenPayload = JSON.parse(payloadStr);
    const params = new URLSearchParams();
    const usercode = payload.usercode;
    params.set('page', page.toString());
    params.set('category', category);
    params.set('farmer', usercode);
    params.set('stock', '1');

    try {
      const response = await axios.get(`${WEBAPI}/product/list.php?${params.toString()}`);
      if (response.data.success) {
        const products = this.state.products;
        for (let i = 0; i < response.data.products.length; i++) {
          const product = response.data.products[i];
          products.push(product);
        }

        this.setState({
          hasNext: response.data.next,
          products
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
      await this.getProducts(false, this.state.category);
    }
  }

  async changeCategory (event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    const value = event.detail.value;
    this.setState({
      page: 1,
      category: value
    });

    await this.getProducts(true, value);
  }

  async componentDidMount () {
    await this.getProducts();
  }

  render () {
    const products = [] as React.ReactNode[];
    for (let i = 0; i < this.state.products.length; i++) {
      const product = this.state.products[i];
      let quantity = 0;
      let sold = 0;

      for (let x = 0; x < product.stocksIn.length; x++) {
        const stock = product.stocksIn[x];
        quantity += stock.quantity;
      }

      for (let y = 0; y < product.stocksOut.length; y++) {
        const stock = product.stocksOut[y];
        quantity += stock.quantity;
        sold += stock.quantity;
      }

      products.push(
        <tr key={i}>
          <td>{ product.stocksIn[0]?.date }</td>
          <td>{ product.name }</td>
          <td>{ quantity }</td>
          <td>{ sold * -1 }</td>
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
            <div className="dashboard-title-bar d-flex text-bold my-2 p-1">
              <span className="flex-1">Products Records</span>
              <IonSelect defaultValue="all" placeholder="All" interface="popover" onIonChange={this.changeCategory}>
                <IonSelectOption value="all">Category: All</IonSelectOption>
                <IonSelectOption value="vegetable">Category: Vegetable</IonSelectOption>
                <IonSelectOption value="root-crops">Category: Root Crops</IonSelectOption>
                <IonSelectOption value="fruits">Category: Fruits</IonSelectOption>
              </IonSelect>
            </div>

            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th>Last Stock In Date</th>
                  <th>Product Name</th>
                  <th>Product Quantity</th>
                  <th>Sold</th>
                </tr>
              </thead>
              
              <tbody>
                { products }
              </tbody>
            </table>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default ProductsRecordPage;
