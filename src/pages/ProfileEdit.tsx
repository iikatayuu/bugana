
import React from 'react';
import { IonPage, IonContent, IonAlert, IonSelect, IonSelectOption, SelectChangeEventDetail } from '@ionic/react';
import { IonSelectCustomEvent } from '@ionic/core';
import axios from 'axios';

import { RouterProps } from '../types';
import { WEBAPI } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import './ProfileEdit.css';

interface ProfileEditPageState {
  value: string;
  saving: boolean;
  message: string;
}

class ProfileEditPage extends React.Component<RouterProps, ProfileEditPageState> {
  key: string;
  editName: string;

  constructor (props: RouterProps) {
    super(props);

    const search = new URLSearchParams(props.location.search);
    const name = search.get('name');
    const key = search.get('key');
    const value = search.get('value');

    this.state = {
      value: value !== null ? value : '',
      saving: false,
      message: ''
    };

    this.key = key !== null ? key : '';
    this.editName = name !== null ? name : '';
    this.changeValue = this.changeValue.bind(this);
    this.changeSelectValue = this.changeSelectValue.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeValue (event: React.ChangeEvent) {
    const input = event.target as HTMLInputElement;
    this.setState({ value: input.value });
  }

  changeSelectValue (event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    const detail = event.detail;
    this.setState({ value: detail.value });
  }

  async submit (event: React.MouseEvent) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (token === null) return;

    this.setState({
      saving: true,
      message: ''
    });

    try {
      const response = await axios.post(`${WEBAPI}/edit.php`, {
        key: this.key,
        value: this.state.value,
        token: token
      });

      if (response.data.success) {
        const token = response.data.token;
        const parts = token.split('.');
        const payload = atob(parts[1]);

        localStorage.setItem('token', token);
        localStorage.setItem('payload', payload);

        this.props.history.goBack();
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: 'Unable to update data' });
    }

    this.setState({ saving: false });
  }

  render () {
    const inputType = this.key === 'password' ? 'password' : 'text'
    let input = <input type={inputType} value={this.state.value} className="form-control py-3" onChange={this.changeValue} />;

    if (this.key === 'gender') {
      input = (
        <IonSelect value={this.state.value} interface="popover" onIonChange={this.changeSelectValue} className="form-control py-3">
          <IonSelectOption value="male">Male</IonSelectOption>
          <IonSelectOption value="female">Female</IonSelectOption>
          <IonSelectOption value="others">Others</IonSelectOption>
        </IonSelect>
      );
    }

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title edit-name ml-2">Edit { this.editName }</span>

            <button type="button" className="btn-save" onClick={this.submit}>SAVE</button>
          </header>

          <main>
            <div className="edit-input-container">
              { input }

              {
                this.state.message &&
                <p className="text-danger">{ this.state.message }</p>
              }
            </div>
          </main>

          <IonAlert isOpen={this.state.saving} backdropDismiss={false} message="Saving profile..." />
        </IonContent>
      </IonPage>
    );
  }
}

export default ProfileEditPage;
