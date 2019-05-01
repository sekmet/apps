import React from 'react';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import * as states from './states';

import { unreachable } from '../../../../utils/reducer-utils';
import { PlayerIndex } from '../../../types';
import ApproveStrategy from '../../../../components/funding/approve-strategy';
import WaitForOtherPlayer from '../../../../components/wait-for-other-player';
import AcknowledgeX from '../../../../components/acknowledge-x';
import { FundingStrategy } from '..';

interface Props {
  state: states.OngoingFundingState;
  strategyChosen: (processId: string, strategy: FundingStrategy) => void;
  strategyApproved: (processId: string, strategy: FundingStrategy) => void;
  strategyRejected: (processId: string) => void;
  fundingSuccessAcknowledged: (processId: string) => void;
  cancelled: (processId: string, by: PlayerIndex) => void;
}

class FundingContainer extends PureComponent<Props> {
  render() {
    const { state } = this.props;
    const { processId } = state;

    switch (state.type) {
      case states.WAIT_FOR_STRATEGY_PROPOSAL:
        return <WaitForOtherPlayer name={'strategy choice'} />;
      case states.WAIT_FOR_STRATEGY_APPROVAL:
        return (
          <ApproveStrategy
            strategyChosen={(strategy: FundingStrategy) =>
              actions.strategyApproved(processId, strategy)
            }
            cancelled={() => actions.cancelled(processId, PlayerIndex.B)}
          />
        );
      case states.WAIT_FOR_FUNDING:
        // TODO: embed the funding container
        return <div />;
      case states.WAIT_FOR_SUCCESS_CONFIRMATION:
        return (
          <AcknowledgeX
            title="Channel funded!"
            action={() => actions.fundingSuccessAcknowledged(processId)}
            description="You have successfully funded your channel"
            actionTitle="Ok!"
          />
        );
      default:
        return unreachable(state);
    }
  }
}

const mapDispatchToProps = {
  strategyChosen: actions.strategyProposed,
  strategyApproved: actions.strategyApproved,
  strategyRejected: actions.strategyRejected,
  fundingSuccessAcknowledged: actions.fundingSuccessAcknowledged,
  cancelled: actions.cancelled,
};

export const Funding = connect(
  () => ({}),
  mapDispatchToProps,
)(FundingContainer);
