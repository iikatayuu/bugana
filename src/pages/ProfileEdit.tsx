
import React from 'react';
import { IonPage, IonContent, IonAlert, IonSelect, IonSelectOption, SelectChangeEventDetail } from '@ionic/react';
import { IonSelectCustomEvent } from '@ionic/core';
import axios from 'axios';

import { RouterProps } from '../types';
import { WEBAPI } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as ModalXIcon } from '../assets/modal-x.svg';
import './ProfileEdit.css';

interface ProfileEditPageState {
  value: string;
  confirmValue: string;
  saving: boolean;
  message: string;
  openDarkModal: boolean;
  darkModalMessage: string;
  darkModalIcon: string;
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
      confirmValue: '',
      saving: false,
      message: '',
      openDarkModal: false,
      darkModalMessage: '',
      darkModalIcon: ''
    };

    this.key = key !== null ? key : '';
    this.editName = name !== null ? name : '';
    this.changeValue = this.changeValue.bind(this);
    this.changeConfirmValue = this.changeConfirmValue.bind(this);
    this.changeSelectValue = this.changeSelectValue.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeValue (event: React.ChangeEvent) {
    const input = event.target as HTMLInputElement;
    this.setState({ value: input.value });
  }

  changeConfirmValue (event: React.ChangeEvent) {
    const input = event.target as HTMLInputElement;
    this.setState({ confirmValue: input.value });
  }

  changeSelectValue (event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    const detail = event.detail;
    this.setState({ value: detail.value });
  }

  modal (message: string, icon: string = '', show: boolean = true) {
    return (event?: React.MouseEvent) => {
      this.setState({
        darkModalMessage: message,
        darkModalIcon: icon,
        openDarkModal: show
      });

      if (show) {
        setTimeout(() => {
          this.setState({ openDarkModal: false });
        }, 5000);
      }
    }
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
      if (this.key === 'password') {
        if (this.state.value !== this.state.confirmValue) {
          this.setState({ saving: false });
          this.modal('Password incorrect!', 'x', true)();
          return;
        }
      }

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
    let inputType: string = 'text';
    if (this.key === 'birthday') inputType = 'date';
    let input = <input type={inputType} value={this.state.value} className="form-control form-control-border py-2" onChange={this.changeValue} />;

    if (this.key === 'password') {
      input = (
        <React.Fragment>
          <div className="edit-form-group mb-5">
            <label className="edit-form-group-label py-1 px-2 text-md">New Password:</label>
            <input type="password" value={this.state.value} className="form-control mt-1 py-2" onChange={this.changeValue} />
          </div>

          <div className="edit-form-group">
            <label className="edit-form-group-label py-1 px-2 text-md">Confirm New Password:</label>
            <input type="password" value={this.state.confirmValue} className="form-control mt-1 py-2" onChange={this.changeConfirmValue} />
          </div>
        </React.Fragment>
      );
    }

    if (this.key === 'gender') {
      input = (
        <IonSelect value={this.state.value} interface="popover" onIonChange={this.changeSelectValue} className="form-control py-3">
          <IonSelectOption value="Male">Male</IonSelectOption>
          <IonSelectOption value="Female">Female</IonSelectOption>
        </IonSelect>
      );
    }

    if (this.key === 'addressbrgy') {
      input = (
        <IonSelect value={this.state.value} interface="popover" onIonChange={this.changeSelectValue} className="form-control py-3">
          <IonSelectOption>Abuanan</IonSelectOption>
          <IonSelectOption>Alianza</IonSelectOption>
          <IonSelectOption>Atipuluan</IonSelectOption>
          <IonSelectOption>Bacong-Montilla</IonSelectOption>
          <IonSelectOption>Bagroy</IonSelectOption>
          <IonSelectOption>Balingasag</IonSelectOption>
          <IonSelectOption>Binubuhan</IonSelectOption>
          <IonSelectOption>Busay</IonSelectOption>
          <IonSelectOption>Calumangan</IonSelectOption>
          <IonSelectOption>Caridad</IonSelectOption>
          <IonSelectOption>Don Jorge L. Araneta</IonSelectOption>
          <IonSelectOption>Dulao</IonSelectOption>
          <IonSelectOption>Ilijan</IonSelectOption>
          <IonSelectOption>Lag-Asan</IonSelectOption>
          <IonSelectOption>Ma-ao</IonSelectOption>
          <IonSelectOption>Mailum</IonSelectOption>
          <IonSelectOption>Malingin</IonSelectOption>
          <IonSelectOption>Napoles</IonSelectOption>
          <IonSelectOption>Pacol</IonSelectOption>
          <IonSelectOption>Poblacion</IonSelectOption>
          <IonSelectOption>Sagasa</IonSelectOption>
          <IonSelectOption>Tabunan</IonSelectOption>
          <IonSelectOption>Taloc</IonSelectOption>
          <IonSelectOption>Sampinit</IonSelectOption>
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

          {
            this.state.openDarkModal && <React.Fragment>
              <div className="dark-modal-backdrop" onClick={this.modal('', '', false)}></div>
              <div className="dark-modal-wrapper" onClick={this.modal('', '', false)}>
                <div className="dark-modal d-flex flex-column align-items-center text-center">
                  { this.state.darkModalIcon === 'x' && <ModalXIcon width={32} height={32} className="mb-1" /> }
                  { this.state.darkModalMessage }
                </div>
              </div>
            </React.Fragment>
          }
        </IonContent>
      </IonPage>
    );
  }
}

export default ProfileEditPage;
