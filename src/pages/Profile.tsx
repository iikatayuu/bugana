
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { IonPage, IonContent, useIonActionSheet, UseIonActionSheetResult, useIonToast, UseIonToastResult, IonAlert } from '@ionic/react';
import axios from 'axios';

import { Profile, RouterProps } from '../types';
import { WEBAPI } from '../variables';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as LoaderIcon } from '../assets/loader.svg';
import './Profile.css';

interface ProfilePageProps extends RouterProps {
  actionSheet: UseIonActionSheetResult;
  toast: UseIonToastResult;
}

interface ProfilePageState {
  loading: boolean;
  error: string;
  changing: boolean;
  message: string;
  timestamp: number;
  profile: Profile | null;
}

class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
  constructor (props: ProfilePageProps) {
    super(props);

    this.state = {
      loading: true,
      error: '',
      changing: false,
      message: '',
      timestamp: 0,
      profile: null
    };

    this.changePp = this.changePp.bind(this);
  }

  async changePp (event: React.ChangeEvent) {
    const token = localStorage.getItem('token');
    if (token === null) return;

    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files === null || files.length === 0) return;

    this.setState({
      changing: true,
      message: ''
    });

    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('image', files[0]);
      const response = await axios.post(`${WEBAPI}/changeimg.php`, formData);

      if (response.data.success) {
        const date = new Date();
        const timestamp = Math.floor(date.getTime() / 1000);
        this.setState({ timestamp });
      } else {
        this.setState({ message: response.data.message });
      }
    } catch (error: any) {
      this.setState({ message: 'Unable to update profile picture' });
    }

    this.setState({ changing: false });
  }

  async componentDidMount () {
    const token = localStorage.getItem('token');
    if (token === null) {
      this.props.history.push('/');
      return;
    }

    try {
      const response = await axios.get(`${WEBAPI}/profile.php?token=${token}`);
      if (response.data.success) {
        const date = new Date();
        const timestamp = Math.floor(date.getTime() / 1000);
        this.setState({
          profile: response.data.profile,
          timestamp
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
    const payloadItem = localStorage.getItem('payload');
    if (payloadItem === null) return <Redirect to="/" />;
    const payload = JSON.parse(payloadItem);
    const profile = this.state.profile;
    let profileNode;

    if (profile !== null) {
      const birthday = profile.birthday;
      profileNode = (
        <React.Fragment>
          <div className="user-container">
            <img src={WEBAPI + '/profileimg.php?id=' + payload.userid + '&t=' + this.state.timestamp} alt={ payload.username + ' Profile Picture' } width={160} className="profile-pp" />
            <input type="file" id="profile-pp-update" onChange={this.changePp} className="d-none" />
            <label htmlFor="profile-pp-update" className="profile-pp-update mt-3 text-center">TAP TO CHANGE</label>
            {
              this.state.message &&
              <p className="text-sm text-danger">{ this.state.message }</p>
            }
          </div>

          <div className="profile-code mt-2">#{ profile.code }</div>
          <div className="profile-group mt-2 mb-5">
            <Link to={'/profile/edit?name=Name&key=name&value=' + encodeURIComponent(profile.name)} className="profile-data">NAME: { profile.name }</Link>
            <Link to={'/profile/edit?name=Gender&key=gender&value=' + profile.gender} className="profile-data">GENDER: { profile.gender }</Link>
            <Link to={'/profile/edit?name=Birthday&key=birthday&value=' + encodeURIComponent(birthday)} className="profile-data">BIRTHDAY: { birthday }</Link>
          </div>

          <div className="profile-group mt-2 mb-5">
            <Link to={'/profile/edit?name=Email&key=email&value=' + encodeURIComponent(profile.email)} className="profile-data">EMAIL: { profile.email }</Link>
            <Link to={'/profile/edit?name=Contact%20Number&key=mobile&value=' + encodeURIComponent(profile.mobile)} className="profile-data mb-3">CONTACT NUMBER: { profile.mobile }</Link>
            <Link to="/profile/edit?name=Password&key=password" className="profile-data-btn btn btn-secondary btn-sm ml-1">CHANGE PASSWORD</Link>
          </div>

          <div className="profile-group mt-2 mb-3">
            <Link to={'/profile/edit?name=Address%20Barangay&key=addressbrgy&value=' + encodeURIComponent(profile.addressbrgy)} className="profile-data">BARANGAY: { profile.addressbrgy }</Link>
            <Link to={'/profile/edit?name=Address%20Purok&key=addresspurok&value=' + encodeURIComponent(profile.addresspurok)} className="profile-data">PUROK: { profile.addresspurok }</Link>
            <Link to={'/profile/edit?name=Purok%2FStreet&key=addressstreet&value=' + encodeURIComponent(profile.addressstreet)} className="profile-data mb-4">STREET: { profile.addressstreet }</Link>
          </div>

          <IonAlert isOpen={this.state.changing} backdropDismiss={false} message="Updating profile picture..." />
        </React.Fragment>
      );
    }

    return (
      <IonPage>
        <IonContent fullscreen>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} />
            </button>
            <span className="page-title ml-2">My Profile</span>
          </header>

          <main className="mb-2">
            {
              this.state.error !== '' &&
              <div className="mt-2 text-center">{ this.state.error }</div>
            }

            {
              this.state.loading &&
              <div className="mt-2 text-center">
                <LoaderIcon width={100} />
                <span>Fetching your profile data...</span>
              </div>
            }

            { profile !== null && profileNode }
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default function ProfilePageWrap (props: RouterProps) {
  const actionSheet = useIonActionSheet();
  const toast = useIonToast();
  return <ProfilePage {...props} actionSheet={actionSheet} toast={toast} />
}
