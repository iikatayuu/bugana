
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import axios from 'axios';

import { RouterProps } from '../types';
import { WEBAPI } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';

interface ForgotPageState {
  message: string;
}

class ForgotPage extends React.Component<RouterProps, ForgotPageState> {
  constructor (props: RouterProps) {
    super(props);

    this.state = { message: '' };

    this.submit = this.submit.bind(this);
  }

  async submit (event: React.FormEvent) {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    this.setState({ message: '' });

    try {
      const response = await axios.post(target.action, formData);
      if (response.data.success) {
        this.props.history.push('/');
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: error.message });
    }
  }

  render () {
    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">Forgot Password</span>
          </header>

          <main className="p-3">
            <form action={`${WEBAPI}/forgot.php`} method="post" onSubmit={this.submit}>
              <div className="form-group">
                <input type="text" name="username" placeholder="Username" className="form-control py-2" required />
              </div>

              {
                this.state.message &&
                <p className="text-sm text-danger my-1">{ this.state.message }</p>
              }

              <button type="submit" className="btn btn-block btn-primary mt-2">Submit</button>
            </form>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default ForgotPage;
