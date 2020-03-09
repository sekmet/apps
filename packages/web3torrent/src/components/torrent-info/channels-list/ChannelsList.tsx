import _, {Dictionary} from 'lodash';
import prettier from 'prettier-bytes';
import React from 'react';
import {ChannelState} from '../../../clients/payment-channel-client';
import {PaidStreamingWire} from '../../../library/types';
import './ChannelsList.scss';
import {WebTorrentContext} from '../../../clients/web3torrent-client';

export type UploadInfoProps = {
  wires: PaidStreamingWire[];
  channels: Dictionary<ChannelState>;
  peerType: 'seeder' | 'leecher';
};

class ChannelsList extends React.Component<UploadInfoProps> {
  static contextType = WebTorrentContext;

  channelIdToTableRow(
    channelId: string,
    channels: Dictionary<ChannelState>,
    wires: PaidStreamingWire[],
    peerType: 'seeder' | 'leecher'
  ) {
    let channelButton;

    if (channels[channelId].status === 'closing') {
      channelButton = <button disabled>Closing ...</button>;
    } else if (channels[channelId].status === 'closed') {
      channelButton = <button disabled>Closed</button>;
    } else {
      channelButton = (
        <button onClick={() => this.context.paymentChannelClient.closeChannel(channelId)}>
          Close Channel
        </button>
      );
    }

    const wire = wires.find(
      wire =>
        wire.paidStreamingExtension.peerChannelId === channelId ||
        wire.paidStreamingExtension.pseChannelId === channelId
    );

    const uploaded = wire ? wire.uploaded : 0;
    const peerAccount = wire ? wire.paidStreamingExtension.peerAccount : 'unknown';

    return (
      <tr className="peerInfo" key={peerAccount}>
        <td>{channelButton}</td>
        <td className="channel-id">{channelId}</td>
        <td className="peer-id">{peerAccount}</td>
        <td className="uploaded">
          {uploaded && prettier(uploaded)}
          &nbsp;
          {peerType === 'seeder' ? `up` : `down`}
        </td>
        {peerType === 'seeder' ? (
          <td className="earned">{Number(channels[channelId].beneficiaryBalance)} wei</td>
        ) : (
          <td className="paid">-{Number(channels[channelId].beneficiaryBalance)} wei</td>
        )}
      </tr>
    );
  }

  render() {
    return (
      <section className="wires-list">
        <table className="wires-list-table">
          <tbody>
            {_.keys(this.props.channels)
              .sort((channelId1, channelId2) => Number(channelId1) - Number(channelId2))
              .map(id =>
                this.channelIdToTableRow(
                  id,
                  this.props.channels,
                  this.props.wires,
                  this.props.peerType
                )
              )}
          </tbody>
        </table>
      </section>
    );
  }
}

export {ChannelsList};
