
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps } from '../types';
import { WEBAPI } from '../variables';
import './Login.css';
import logo from '../assets/logo.png';

interface LoginPageState {
  type: string;
  message: string;
  signingin: boolean;
}

class LoginPage extends React.Component<RouterProps, LoginPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = {
      type: 'customer',
      message: '',
      signingin: false
    };

    this.login = this.login.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  async login (event: React.FormEvent) {
    event.preventDefault();
    this.setState({
      message: '',
      signingin: true
    });

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    try {
      const response = await axios.post(target.action, formData);
      if (response.data.success) {
        const token = response.data.token;
        const parts = token.split('.');
        const payload = atob(parts[1]);

        localStorage.setItem('token', token);
        localStorage.setItem('payload', payload);
        target.reset();

        this.props.history.push(this.state.type === 'customer' ? '/dashboard' : '/farmer/dashboard');
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }

    this.setState({ signingin: false });
  }
  
  toggle (event: React.MouseEvent) {
    event.preventDefault();

    if (this.state.type === 'customer') this.setState({ type: 'farmer' });
    else if (this.state.type === 'farmer') this.setState({ type: 'customer' });
  }

  render () {
    if (localStorage.getItem('token')) return <Redirect to="/dashboard" />;

    return (
      <IonPage>
        <IonContent fullscreen style={{ '--background': 'var(--ion-color-primary)' }}>
          <form action={ WEBAPI + '/login.php' } method="post" className="form-login" onSubmit={this.login}>
            <img src={logo} alt="BUGANA Logo" className="login-logo" />

            <div className="card text-center">
              <h6 className="login-title mb-1">BUGANA</h6>
              <p className="login-subtitle mb-2">Please Enter User Credentials</p>
              <input type="hidden" name="type" value={this.state.type} />

              <div className="form-group mb-1">
                <input type="text" name="username" placeholder="Username" className="form-control py-2" required />
              </div>

              <div className="form-group">
                <input type="password" name="password" placeholder="Password" className="form-control py-2" required />
              </div>
              <Link to="/forgot" className="text-sm">Forgot Password?</Link>

              {
                this.state.message &&
                <p className="text-sm text-danger my-1">{ this.state.message }</p>
              }

              <button type="submit" className="btn btn-block btn-primary mt-2" disabled={this.state.signingin}>
                { this.state.signingin ? 'LOGGING IN...' : 'LOG IN' }
              </button>

              { this.state.type === 'customer' && <div className="text-sm">Want to join us? <Link to="/register">Sign up here</Link></div> }
              <button type="button" className="btn btn-tertiary btn-sm text-sm mt-2" style={{ width: '75%' }} onClick={this.toggle}>
                Sign In as <strong className="text-bold">{ this.state.type === 'customer' ? 'Farmer' : 'Customer' }</strong>
              </button>
            </div>
          </form>
        </IonContent>
      </IonPage>
    );
  }
}

export default LoginPage;
