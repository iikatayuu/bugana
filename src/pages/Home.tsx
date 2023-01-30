
import React from 'react';
import { Link } from 'react-router-dom';
import { IonSkeletonText, IonSelect, IonSelectOption, SelectChangeEventDetail } from '@ionic/react';
import { IonSelectCustomEvent } from '@ionic/core';
import axios from 'axios';

import { RouterProps, Product, Category } from '../types';
import { WEBURL, WEBAPI } from '../variables';
import Dashboard from '../components/Dashboard';
import logoInverse from '../assets/logo-inverse.png';
import banner from '../assets/banner.jpg';
import { ReactComponent as MagnifyingGlassIcon } from '../assets/magnifying-glass.svg';
import './Home.css';

interface HomePageState {
  topPicksLoading: boolean;
  topPicks: Product[];
  productsLoading: boolean;
  products: Product[];
  productsHasNext: boolean;
  productsPage: number;
  category: Category | "all";
  search: string;
  message: string;
}

class HomePage extends React.Component<RouterProps, HomePageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      topPicksLoading: true,
      topPicks: [] as Product[],
      productsLoading: true,
      products: [] as Product[],
      productsHasNext: false,
      productsPage: 1,
      category: 'all',
      search: '',
      message: ''
    };

    this.load = this.load.bind(this);
    this.changeProductsCategory = this.changeProductsCategory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  async getProducts (reset: boolean = true, category: Category | "all" = 'all', currentPage: number = 1) {
    this.setState({
      productsPage: reset ? currentPage : this.state.productsPage,
      category: reset ? category : this.state.category,
      productsLoading: true,
      products: reset ? [] as Product[] : this.state.products
    });

    const page = reset ? currentPage : this.state.productsPage + 1;
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('category', category);
      params.set('random', '1')

      const response = await axios.get(`${WEBAPI}/product/list.php?${params.toString()}`);
      if (response.data.success) {
        const products = this.state.products;
        for (let i = 0; i < response.data.products.length; i++) {
          const product = response.data.products[i];
          products.push(product);
        }

        this.setState({
          productsHasNext: response.data.next,
          products
        });
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }

    this.setState({
      productsLoading: false,
      productsPage: page
    });
  }

  async getTop () {
    this.setState({ topPicksLoading: true });

    try {
      const response = await axios.get(`${WEBAPI}/product/top.php`);
      if (response.data.success) {
        const products = this.state.topPicks;
        for (let i = 0; i < response.data.products.length; i++) {
          const product = response.data.products[i];
          products.push(product);
        }

        this.setState({ topPicks: products });
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }

    this.setState({ topPicksLoading: false });
  }

  async load () {
    if (this.state.productsHasNext && !this.state.productsLoading) {
      await this.getProducts(false, this.state.category);
    }
  }

  async changeProductsCategory (event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    const value = event.detail.value;
    await this.getProducts(true, value, 1);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    const state: any = {};
    state[name] = value;
    this.setState(state);
  }

  submitSearch (event: React.FormEvent) {
    event.preventDefault();

    const q = this.state.search;
    this.props.history.push('/search?q=' + q);
  }

  async componentDidMount () {
    const products = this.getProducts();
    const tops = this.getTop();
    await Promise.all([products, tops]);
  }

  render () {
    const top = [] as React.ReactNode[];
    const products = [] as React.ReactNode[];

    for (let i = 0; i < this.state.topPicks.length; i++) {
      const product = this.state.topPicks[i];
      top.push(
        <Link to={'/product/' + product.id} className="home-product p-1 mx-2" key={i}>
          <img src={WEBURL + product.photos[0]} alt={product.name + ' Image'} width={135} height={100} />
          <div className="home-product-name">{ product.name }</div>
          <span className="home-product-price mt-2">₱{ product.price }/kg</span>
        </Link>
      );
    }

    if (top.length === 0 && !this.state.topPicksLoading) top[0] = <div className="mt-2" key={0}>No top picks yet...</div>;

    for (let i = 0; i < this.state.products.length; i++) {
      const product = this.state.products[i];
      products.push(
        <Link to={'/product/' + product.id} className="home-product p-1" key={i}>
          <img src={WEBURL + product.photos[0]} alt={product.name + ' Image'} width={135} height={100} />
          <div className="home-product-name">{ product.name }</div>
          <span className="home-product-price mt-2">{ product.price }</span>
        </Link>
      );
    }

    const component = (
      <React.Fragment>
        <header className="page-header">
          <img src={logoInverse} alt="BUGANA Logo" />

          <form action="/search" method="get" className="dashboard-search" onSubmit={this.submitSearch}>
            <input type="text" name="search" value={this.state.search} onChange={this.handleChange} />
            <button type="submit">
              <MagnifyingGlassIcon width={20} height={20} />
            </button>
          </form>
        </header>

        <main>
          <div className="banner-container">
            <div className="banner-wrapper">
              <img src={banner} alt="Dashboard banner" width="100%" />
            </div>
          </div>

          <div className="mb-2">
            <div className="products-title">Top Picks:</div>
            <div className="products-top">{ top }</div>
            {
              this.state.topPicksLoading &&
              <div className="d-flex">
                <div className="mx-2">
                  <IonSkeletonText animated={true} style={{ width: '135px', height: '135px' }} />
                </div>

                <div className="mx-2">
                  <IonSkeletonText animated={true} style={{ width: '135px', height: '135px' }} />
                </div>
              </div>
            }
          </div>

          <div className="mb-2">
            <div className="products-title">
              <span>Products:</span>

              <IonSelect id="products-category" defaultValue="all" placeholder="All" interface="popover" onIonChange={this.changeProductsCategory}>
                <IonSelectOption value="all">All</IonSelectOption>
                <IonSelectOption value="vegetable">Vegetable</IonSelectOption>
                <IonSelectOption value="root-crops">Root Crops</IonSelectOption>
                <IonSelectOption value="fruits">Fruits</IonSelectOption>
              </IonSelect>
            </div>

            <div className="products">{ products }</div>

            {
              this.state.productsLoading &&
              <div className="d-flex">
                <div className="mx-2">
                  <IonSkeletonText animated={true} style={{ width: '135px', height: '135px' }} />
                </div>

                <div className="mx-2">
                  <IonSkeletonText animated={true} style={{ width: '135px', height: '135px' }} />
                </div>
              </div>
            }
          </div>
        </main>
      </React.Fragment>
    );

    return <Dashboard component={component} scrollEnd={this.load} />;
  }
}

export default HomePage;
