import React from 'react';

interface Props {
  message: string;
}

export default class FundingConfirmedPage extends React.PureComponent<Props> {
  render() {
    const { message } = this.props;

    return (
      <div className="container centered-container">
        <div className="w-100 text-center mb-5">
          <h1 className="mb-5">Funding Confirmed!</h1>
          <p className="lead">{message}</p>
        </div>
      </div>
    );
  }
}
