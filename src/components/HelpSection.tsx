
import React from 'react';
import { IonPage, IonContent, IonModal } from '@ionic/react';

import { RouterProps, QnA } from '../types';
import { ReactComponent as LeftIcon } from '../assets/left.svg';
import { ReactComponent as MagnifyingGlassIcon } from '../assets/magnifying-glass.svg';
import './HelpSection.css';

interface HelpSectionProps extends RouterProps {
  title: string;
  qna: QnA[];
}

interface HelpSectionState {
  answering: boolean;
  answer: string;
}

class HelpSection extends React.Component<HelpSectionProps, HelpSectionState> {
  constructor (props: HelpSectionProps) {
    super(props);

    this.state = {
      answering: false,
      answer: ''
    };

    this.answer = this.answer.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
  }

  answer (a: string) {
    return (event: React.MouseEvent) => {
      this.setState({
        answering: true,
        answer: a
      });
    }
  }

  dismissModal () {
    this.setState({
      answering: false,
      answer: ''
    });
  }

  render () {
    const questions: React.ReactNode[] = [];
    for (let i = 0; i < this.props.qna.length; i++) {
      const qna = this.props.qna[i];
      questions.push(
        <div className="card card-rect card-shadow mt-4 mb-2 mx-2" onClick={this.answer(qna.answer)} key={i}>
          { qna.question }
        </div>
      );
    }

    return (
      <IonPage>
        <IonContent fullscreen>
          <h1 className="help-title">Bugana Help Center</h1>
          <header className="page-header">
            <button type="button" className="btn-nav" onClick={() => { this.props.history.goBack(); }}>
              <LeftIcon width={20} height={20} className="mr-2" />
            </button>

            <form action="/search" method="get" className="dashboard-search">
              <input type="text" name="search" />
              <button type="submit">
                <MagnifyingGlassIcon width={20} height={20} />
              </button>
            </form>
          </header>

          <main>
            <h1 className="help-section-title mt-3 mx-2">{ this.props.title }</h1>
            { questions }

            <IonModal isOpen={this.state.answering} onDidDismiss={() => this.setState({ answering: false })} className="help-modal">
              <IonContent>
                <div className="help-modal-content">
                  <p>{ this.state.answer }</p>
                  <button type="button" className="btn btn-help" onClick={this.dismissModal}>Confirm</button>
                </div>
              </IonContent>
            </IonModal>
          </main>
        </IonContent>
      </IonPage>
    );
  }
}

export default HelpSection;
