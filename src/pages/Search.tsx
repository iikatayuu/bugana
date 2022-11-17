
import React from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Product } from '../types';
import { WEBAPI, WEBURL } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as MagnifyingGlassIcon } from '../assets/magnifying-glass.svg';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import './Search.css';

interface SearchPageState {
  search: string;
  result: Product[];
  page: number;
  hasNext: boolean;
  message: string;
  loading: boolean;
}

class SearchPage extends React.Component<RouterProps, SearchPageState> {
  constructor (props: RouterProps) {
    super(props);

    const params = new URLSearchParams(props.location.search);
    const q = params.get('q') || '';

    this.state = {
      search: q,
      result: [] as Product[],
      page: 1,
      hasNext: false,
      message: '',
      loading: true
    };

    this.getProducts = this.getProducts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.load = this.load.bind(this);
  }

  handleChange (event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;
    const state: any = {};
    state[name] = value;
    this.setState(state);
  }

  async submitSearch (event: React.FormEvent) {
    event.preventDefault();

    const q = this.state.search;
    this.setState({ page: 1 });
    this.props.history.push('/search?q=' + q);
    await this.getProducts(true, q);
  }

  async getProducts (reset: boolean = true, search: string = '') {
    this.setState({
      loading: true,
      result: reset ? [] as Product[] : this.state.result
    });

    const page = reset ? this.state.page : this.state.page + 1;
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('search', search);

      const response = await axios.get(`${WEBAPI}/product/list.php?${params.toString()}`);
      if (response.data.success) {
        const result = this.state.result;
        for (let i = 0; i < response.data.products.length; i++) {
          const product = response.data.products[i];
          result.push(product);
        }

        this.setState({
          hasNext: response.data.next,
          result
        });
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }

    this.setState({ loading: false, page });
  }

  async load () {
    if (this.state.hasNext && !this.state.loading) {
      await this.getProducts(false);
    }
  }

  async componentDidMount () {
    await this.getProducts(true, this.state.search);
  }

  render () {
    const products: React.ReactNode[] = [];
    for (let i = 0; i < this.state.result.length; i++) {
      const product = this.state.result[i];
      products.push(
        <Link to={'/product/' + product.id} className="home-product p-1" key={i}>
          <img src={WEBURL + product.photos[0]} alt={product.name + ' Image'} width={135} height={100} />
          <div className="home-product-name">{ product.name }</div>
          <span className="home-product-price mt-2">{ product.price }</span>
        </Link>
      );
    }

    return (
      <IonPage>
        <IonContent scrollEvents={true} onIonScrollEnd={this.load} fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.push('/dashboard'); }}>
              <LeftIcon width={20} height={20} />
            </button>

            <form action="/search" method="get" className="dashboard-search ml-3" onSubmit={this.submitSearch}>
            <input type="text" name="search" value={this.state.search} onChange={this.handleChange} />
            <button type="submit">
              <MagnifyingGlassIcon width={20} height={20} />
            </button>
          </form>
          </header>

          <main className="mb-2">
            <div className="search-icon">
              <SearchIcon />
              <div className="text-bold">Find what suits your taste...</div>
            </div>

            <div className="products">{ products }</div>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default SearchPage;
