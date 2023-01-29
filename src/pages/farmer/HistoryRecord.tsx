
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps } from '../../types';
import { WEBAPI, MONTHS } from '../../variables';
import { ReactComponent as LeftIcon } from '../../assets/left.svg';
import './Dashboard.css';

type MonthDisplay = "current" | "previous";

interface HistoryRecordPageState {
  display: MonthDisplay;
  currentMonth: string;
  currentYear: string;
  lastMonth: string;
  lastYear: string;
  currentMonthIncome: number;
  lastMonthIncome: number;
  loading: boolean;
  error: string;
}

class HistoryRecordPage extends React.Component<RouterProps, HistoryRecordPageState> {
  constructor (props: RouterProps) {
    super(props);

    const date = new Date();
    const currentMonthIndex = date.getMonth();
    const currentMonth = MONTHS[currentMonthIndex];
    const currentYear = date.getFullYear();
    let lastMonth = '';
    let lastYear = 0;

    if (currentMonthIndex - 1 > -1) {
      lastMonth = MONTHS[currentMonthIndex - 1];
      lastYear = currentYear;
    } else {
      lastMonth = MONTHS[11];
      lastYear = currentYear - 1;
    }

    this.state = {
      display: 'current',
      currentMonth,
      currentYear: currentYear.toString(),
      lastMonth,
      lastYear: lastYear.toString(),
      currentMonthIncome: 0,
      lastMonthIncome: 0,
      loading: true,
      error: ''
    };

    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  toggleDisplay (event: React.MouseEvent) {
    if (this.state.display === 'current') this.setState({ display: 'previous' });
    if (this.state.display === 'previous') this.setState({ display: 'current' });
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
      if (response.data.success) {
        this.setState({
          currentMonthIncome: response.data.currentMonth,
          lastMonthIncome: response.data.lastMonth
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
    const dayMonth = this.state.display === 'current'
      ? `${this.state.currentMonth} ${this.state.currentYear}`
      : `${this.state.lastMonth} ${this.state.lastYear}`;

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.push('/farmer/dashboard'); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">Return to Home Page</span>
          </header>

          <main>
            <div className="dashboard-title-bar text-bold my-2 p-1 text-center">
              <span className="text-lg text-bold p-1">Sales History</span>
            </div>

            <div className="d-flex px-2">
              <button type="button" className={'btn btn-primary btn-round btn-xs btn-shadow text-dark text-bold' + (this.state.display === 'current' ? '' : ' d-none')} onClick={this.toggleDisplay}>Previous Month</button>
              <button type="button" className={'btn btn-primary btn-round btn-xs btn-shadow text-dark text-bold ml-auto' + (this.state.display === 'previous' ? '' : ' d-none')} onClick={this.toggleDisplay}>Current Month</button>
            </div>

            <div className="card card-background card-rect m-3">
              <h5 className="text-lg text-bold my-2 text-center">{ dayMonth }</h5>
              <h5 className="text-lg text-bold mb-3 text-center">MONTHLY GROSS COMPUTATION</h5>
              <div className="d-flex justify-space-around">
                <span>Sales Income:</span>
                <span className="text-bold">{ this.state.display === 'current' ? this.state.currentMonthIncome : this.state.lastMonthIncome } PHP</span>
              </div>
              <h5 className="text-md text-bold my-2 ml-3">Unsold</h5>
              <div className="d-flex justify-space-around mb-4">
                <span>Perished Products:</span>
                <span className="text-bold">0 KG</span>
              </div>
              <div className="d-flex justify-space-around align-items-center text-bold text-dark">
                <span>TOTAL INCOME:</span>
                <div className="card card-primary card-rect">{ this.state.display === 'current' ? this.state.currentMonthIncome : this.state.lastMonthIncome } PHP</div>
              </div>
            </div>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default HistoryRecordPage;
