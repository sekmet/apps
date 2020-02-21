import React from 'react';
import {FormButton} from '../../form';

import {Link, RouteComponentProps} from 'react-router-dom';
import {RoutePath} from '../../../routes';

import './LayoutHeader.scss';
import ConnectionBanner from '@rimble/connection-banner';

interface Props {
  currentNetwork: number;
  requiredNetwork: number;
}

const LayoutHeader: React.FC<RouteComponentProps & Props> = props => {
  return (
    <header className="header">
      <nav className="header-content">
        <Link className="header-logo" to={RoutePath.Root}>
          <span className="header-logo-hidden">Web3Torrent Logo - Go to Home</span>
        </Link>
        <div className="actions-container">
          <FormButton name="upload" onClick={() => props.history.push(RoutePath.Upload)}>
            Upload
          </FormButton>
        </div>
      </nav>
      <ConnectionBanner
        currentNetwork={props.currentNetwork}
        requiredNetwork={props.requiredNetwork}
        onWeb3Fallback={false}
      />
    </header>
  );
};

export {LayoutHeader};
