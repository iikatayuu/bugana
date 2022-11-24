
import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { RouterProps, TokenPayload } from '../types';
import { WEBAPI } from '../variables';
import Dashboard from '../components/Dashboard';
import { ReactComponent as RightIcon } from '../assets/right.svg';
import './User.css';

interface UserPageState {
  timestamp: number;
}

class UserPage extends React.Component<RouterProps, UserPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      timestamp: 0
    };
  }

  componentDidMount () {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);
    this.setState({ timestamp });
  }

  render () {
    const payloadItem = localStorage.getItem('payload');
    if (payloadItem === null) return <Redirect to="/" />;
    const payload: TokenPayload = JSON.parse(payloadItem);

    const component = (
      <React.Fragment>
        <header className="page-header">
          <span className="page-title ml-1">Account</span>
        </header>

        <main>
          <div className="user-container">
            <img src={WEBAPI + '/profileimg.php?id=' + payload.userid + '&t=' + this.state.timestamp } alt={ payload.username + ' Profile Picture' } width={160} />
            <h5>{ payload.name }</h5>
          </div>

          <nav className="user-menu">
            <Link to="/user/pickup" className="mb-2">
              <button type="button" className="btn btn-secondary btn-block btn-round text-dark">To Pick up</button>
            </Link>
            <Link to="/user/deliver" className="mb-2">
              <button type="button" className="btn btn-secondary btn-block btn-round text-dark">To Deliver</button>
            </Link>
            <Link to="/user/history" className="mb-2">
              <button type="button" className="btn btn-secondary btn-block btn-round text-dark">Purchase History</button>
            </Link>
          </nav>

          <h5 className="user-subtitle my-2">Account Settings</h5>
          <nav className="user-settings">
            <Link to="/profile" className="mb-2">
              <span>My Profile</span>
              <RightIcon width={20} height={20} />
            </Link>
            <Link to="/help" className="mb-2">
              <span>Help Center</span>
              <RightIcon width={20} height={20} />
            </Link>
            <Link to="/logout" className="mb-2">
              <span>Log Out</span>
              <RightIcon width={20} height={20} />
            </Link>
          </nav>
        </main>
      </React.Fragment>
    );

    return <Dashboard component={component} />;
  }
}

export default UserPage;
