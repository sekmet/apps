import {ContractArtifacts} from '@statechannels/nitro-protocol';

import {ContractFactory, ethers, providers} from 'ethers';
import {cHubChainPK} from '../constants';

const rpcEndpoint = process.env.RPC_ENDPOINT;
const provider = new providers.JsonRpcProvider(rpcEndpoint);
const walletWithProvider = new ethers.Wallet(cHubChainPK, provider);

export async function ethAssetHolder() {
  let ethAssetHolderFactory: ContractFactory;
  try {
    ethAssetHolderFactory = await ContractFactory.fromSolidity(
      ContractArtifacts.EthAssetHolderArtifact,
      walletWithProvider
    );
  } catch (err) {
    if (err.message.match('bytecode must be a valid hex string')) {
      throw new Error(`Contract not deployed on network ${process.env.CHAIN_NETWORK_ID}`);
    }

    throw err;
  }

  const contract = await ethAssetHolderFactory.attach(process.env.ETH_ASSET_HOLDER_ADDRESS);

  return contract;
}