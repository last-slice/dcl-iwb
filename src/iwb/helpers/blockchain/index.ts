import * as dclTx from "decentraland-transactions";
import * as eth from "eth-connect";
import { createMANAComponent } from "./mana";
import { createStoreComponent } from "./store";
import { createCollectionComponent } from "./marketplace";
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { localUserId } from "../../components/Player";
import { sendAsync } from "~system/EthereumController";
let rpcId = 0

export async function createContract(contractAddress:string, abi:any){
  try {
    const provider = await createEthereumProvider()
    const requestManager = new eth.RequestManager(provider)
    provider.sendAsync
    const factory = new eth.ContractFactory(requestManager, abi)
    const contract = (await factory.at(contractAddress)) as any
    return contract
  } catch (error:any) {
    console.log(error.toString())
  }
}

export async function createComponents(c?:string) {
  let fromAddress = localUserId

  const provider = await createEthereumProvider()
  const requestManager: any = new eth.RequestManager(provider);
  const metaProvider: any = new eth.WebSocketProvider("wss://rpc-mainnet.matic.quiknode.pro");
  const metaRequestManager: any = new eth.RequestManager(metaProvider);
  const providers = {
    provider,
    requestManager,
    metaProvider,
    metaRequestManager,
    fromAddress,
    collectionAddress:c
  };

  const mana = await createMANAComponent(providers);
  const store = await createStoreComponent(providers);
  const collection = await createCollectionComponent(providers)
  return { mana, store, collection };
}

export type Providers = {
  provider: any;
  requestManager: eth.RequestManager;
  metaProvider: any;
  metaRequestManager: eth.RequestManager;
  fromAddress: string;
  collectionAddress?:string
};