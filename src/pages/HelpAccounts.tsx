
import React from 'react';

import HelpSection from '../components/HelpSection';
import { RouterProps } from '../types';
import { FAQ } from '../variables';

class HelpAccounts extends React.Component<RouterProps> {
  render () {
    const qna = FAQ.filter(item => item.section === 'accounts');
    const match = this.props.match;
    const location = this.props.location;
    const history = this.props.history;
    return <HelpSection title="Managing Account" qna={qna} match={match} location={location} history={history} />;
  }
}

export default HelpAccounts;
