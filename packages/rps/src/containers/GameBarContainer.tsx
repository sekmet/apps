import {connect} from 'react-redux';

import GameBar from '../components/GameBar';
import {SiteState} from '../redux/reducer';
import {PlayingState} from '../redux/game/state';

function mapStateToProps(state: SiteState) {
  const gameState = state.game.gameState as PlayingState;
  const {myName, opponentName, roundBuyIn, player, allocation} = gameState;

  const myBalance = allocation[player];
  const opponentBalance = allocation[1 - player];

  return {
    myName,
    opponentName,
    myBalance,
    opponentBalance,
    roundBuyIn,
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameBar);
