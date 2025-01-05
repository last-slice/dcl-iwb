import * as dclTx from "decentraland-transactions";
import * as eth from "eth-connect";
import { Providers } from "./index";


export function createMANAComponent({
  provider,
  requestManager,
  metaProvider,
  metaRequestManager,
  fromAddress,
}: Providers) {
  async function getContract() {
    const manaConfig = dclTx.getContract(dclTx.ContractName.MANAToken, 137);
    let contract: any = await new eth.ContractFactory(metaRequestManager, manaConfig.abi).at(manaConfig.address);

    return {
      manaConfig,
      contract,
    };
  }

  async function balance() {
    const { manaConfig, contract } = await getContract();
    console.log('mana config is', manaConfig)
    const res = await contract.balanceOf(fromAddress);
    return res;
  }

  async function isApproved(spenderAddress: string) {
    const { manaConfig, contract } = await getContract();
    const res = await contract.allowance(fromAddress, spenderAddress);

    return +res;
  }

  async function approve(spenderAddress: string, amount: number = 0) {
    const { manaConfig, contract } = await getContract();

    const functionHex = contract.approve.toPayload(
      spenderAddress,
      amount === 0 ? "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" : amount
    );

    console.log(functionHex);

    const txHash = await dclTx.sendMetaTransaction(
      requestManager as any,
      metaRequestManager as any,
      functionHex.data,
      manaConfig,
      { serverURL: "https://transactions-api.decentraland.org/v1" }
    );
    console.log(txHash);
    return txHash;
  }

  async function transfer(toAddress: string, amount: number = 0) {
    const { manaConfig, contract } = await getContract();

    const functionHex = contract.transfer.toPayload(
      toAddress,
      amount === 0 ? "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" : amount
    );

    console.log(functionHex);

    try {
      const txHash = await dclTx.sendMetaTransaction(
        requestManager as any,
        metaRequestManager as any,
        functionHex.data,
        manaConfig,
        { serverURL: "https://transactions-api.decentraland.org/v1" }
      );
      console.log(txHash);
      return txHash
    }
    catch(error){
      console.log('blockchain create order error', error);
      return "error";
    }
  }

  return { balance, isApproved, approve, transfer };
}
