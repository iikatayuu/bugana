
import React from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps, Product } from '../../types';
import { WEBAPI, WEBURL } from '../../variables';
import logoInverse from '../../assets/logo-inverse.png';
import './Dashboard.css';

interface DashboardPageState {
  top3Products: Product[];
  currentMonthIncome: number;
  loading: boolean;
  error: string;
}

class DashboardPage extends React.Component<RouterProps, DashboardPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      top3Products: [],
      currentMonthIncome: 0,
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

    this.setState({ loading: true });
    const params = new URLSearchParams();
    params.set('token', token);

    try {
      const response = await axios.get(`${WEBAPI}/transaction/income.php?${params.toString()}`);
      const topResponse = await axios.get(`${WEBAPI}/product/top3.php?${params.toString()}`);

      if (response.data.success && topResponse.data.success) {
        this.setState({
          top3Products: topResponse.data.products,
          currentMonthIncome: response.data.currentMonth
        });
      } else {
        this.setState({ error: response.data.message });
      }
    } catch (error: any) {
      this.setState({ error: 'Unable to fetch your profile' });
    }

    this.setState({ loading: false });
  }

  render () {
    const token = localStorage.getItem('token');
    const payloadStr = localStorage.getItem('payload');
    if (token === null || payloadStr === null) {
      this.props.history.push('/');
      return;
    }

    const payload = JSON.parse(payloadStr);
    const top3Products = this.state.top3Products;
    const top1Product = top3Products[0];
    const top2Product = top3Products[1];
    const top3Product = top3Products[2];

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <img src={logoInverse} alt="BUGANA Logo" />
            <span className="page-title ml-2">BUGANA</span>
          </header>

          <main className="p-2">
            <div className="d-flex">
              <img src={WEBAPI + '/profileimg.php?id=' + payload.userid} alt={payload.username + ' Image'} width={75} height={75} className="mr-2" />
              <div className="dashboard-name flex-1">{ payload.name }</div>
            </div>

            <div className="card card-rect card-border card-shadow w-75 mt-5 mb-3 mx-auto text-center">
              <strong className="text-sm text-bold">Monthly Sales</strong>
              <div className="dashboard-balance mt-2">PHP { this.state.currentMonthIncome.toFixed(2) }</div>
            </div>

            <h5 className="mb-1 text-bold text-md">Top SOLD Products this Month:</h5>
            <div className="d-flex align-items-end">
              <div className="d-flex flex-column align-items-center top-product">
                { top2Product && <img src={WEBURL + top2Product.photos[0]} alt={top2Product.name + ' Image'} width="64" height="64" /> }
                <span>{ top2Product ? top2Product.name : '' }</span>
              </div>

              <div className="d-flex flex-column align-items-center top-product">
                { top1Product && <img src={WEBURL + top1Product.photos[0]} alt={top1Product.name + ' Image'} width="80" height="80" /> }
                <span>{top1Product ? top1Product.name : ''}</span>
              </div>

              <div className="d-flex flex-column align-items-center top-product">
                { top3Product && <img src={WEBURL + top3Product.photos[0]} alt={top3Product.name + ' Image'} width="32" height="64" /> }
                <span>{ top3Product ? top3Product.name : '' }</span>
              </div>
            </div>

            <div className="dashboard-buttons mx-auto pt-3 text-center">
              <div className="mb-3"><Link to="/records/products" className="btn btn-secondary btn-round btn-block text-bold px-3" role="button">Products Records</Link></div>
              <div className="mb-3"><Link to="/records/sales" className="btn btn-secondary btn-round btn-block text-bold px-3" role="button">Sales Records</Link></div>
              <div className="mb-3"><Link to="/records/history" className="btn btn-secondary btn-round btn-block text-bold px-3" role="button">Sales History</Link></div>
              <div className="mb-3"><Link to="/profile" className="btn btn-secondary btn-round btn-block text-bold px-3" role="button">My Account</Link></div>
              <div className="mb-3"><Link to="/logout" className="btn btn-secondary btn-round btn-block text-bold px-3" role="button">Log Out</Link></div>
            </div>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default DashboardPage;
