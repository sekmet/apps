import { select, cancel, take, fork, actionChannel } from 'redux-saga/effects';

import { messageListener } from './message-listener';
import { messageSender } from './message-sender';
import { transactionSender } from './transaction-sender';
import { adjudicatorWatcher } from './adjudicator-watcher';
import { blockMiningWatcher } from './block-mining-watcher';

import { WalletState, CHANNEL_INITIALIZED, WAIT_FOR_ADJUDICATOR } from '../states';
import { getProvider } from '../../utils/contract-utils';

import { displaySender } from './display-sender';
import { ganacheMiner } from './ganache-miner';
import { adjudicatorLoader } from './adjudicator-loader';

export function* sagaManager(): IterableIterator<any> {
  let adjudicatorWatcherProcess;
  let blockMiningWatcherProcess;
  let ganacheMinerProcess;

  // always want the message listenter to be running
  yield fork(messageListener);

  // todo: restrict just to wallet actions
  const channel = yield actionChannel('*');

  while (true) {
    yield take(channel);

    const state: WalletState = yield select((walletState: WalletState) => walletState);

    // if we don't have an adjudicator, make sure that the adjudicatorLoader runs once
    // todo: can we be sure that this won't be called more than once if successful?
    if (state.type === WAIT_FOR_ADJUDICATOR) {
      yield adjudicatorLoader();
    }

    // if have adjudicator, make sure that the adjudicator watcher is running
    if (state.type === CHANNEL_INITIALIZED) {
      if ('channelId' in state.channelState) {
        if (!adjudicatorWatcherProcess) {
          const provider = yield getProvider();
          adjudicatorWatcherProcess = yield fork(
            adjudicatorWatcher,
            state.channelState.channelId,
            provider,
          );
        }
      } else {
        if (adjudicatorWatcherProcess) {
          yield cancel(adjudicatorWatcherProcess);
          adjudicatorWatcherProcess = undefined;
        }
      }

      // We only watch for mined blocks when waiting for a challenge expiry
      if ('challengeExpiry' in state.channelState && state.channelState.challengeExpiry) {
        if (!blockMiningWatcherProcess) {
          blockMiningWatcherProcess = yield fork(blockMiningWatcher);
        }
        if (process.env.TARGET_NETWORK === 'development' && !ganacheMinerProcess) {
          ganacheMinerProcess = yield fork(ganacheMiner);
        }
      } else {
        if (blockMiningWatcherProcess) {
          yield cancel(blockMiningWatcherProcess);
          blockMiningWatcherProcess = undefined;
        }
        if (ganacheMinerProcess) {
          yield cancel(ganacheMinerProcess);
          ganacheMinerProcess = undefined;
        }
      }
    }

    const { outboxState } = state;
    if (outboxState.messageOutbox) {
      const messageToSend = outboxState.messageOutbox;
      yield messageSender(messageToSend);
    }
    if (outboxState.displayOutbox) {
      const displayMessageToSend = outboxState.displayOutbox;
      yield displaySender(displayMessageToSend);
    }
    // if we have an outgoing transaction, make sure that the transaction-sender runs
    if (outboxState.transactionOutbox) {
      const transactionToSend = outboxState.transactionOutbox;
      yield transactionSender(transactionToSend);
    }
  }
}
