import * as dclTx from "decentraland-transactions";
import * as eth from "eth-connect";
import { Providers } from "./index";
import { localUserId } from "../../components/Player";

export function createCollectionComponent({
  provider,
  requestManager,
  metaProvider,
  metaRequestManager,
  fromAddress,
  collectionAddress
}: Providers) {

    async function getMarketplaceContract(override?:string) {
        const storeConfig = dclTx.getContract(dclTx.ContractName.MarketplaceV2, 137);
        let contract: any = await new eth.ContractFactory(metaRequestManager, storeConfig.abi).at(storeConfig.address);
        return {
          storeConfig,
          contract
        };
      }

  async function getContract(override?:string) {
    const storeConfig = dclTx.getContract(dclTx.ContractName.ERC721CollectionV2, 137);
    let contract: any = await new eth.ContractFactory(metaRequestManager, storeConfig.abi).at(override ? override : collectionAddress!);
    return {
      storeConfig,
      contract
    };
  }

  async function executeOrder(collectionId:string, tokenId:string, price:string){
    console.log('executing order', collectionId, tokenId, price);
    const { storeConfig, contract  } = await getMarketplaceContract();
    const functionSignature = contract.executeOrder.toPayload(collectionId, tokenId, price)
    console.log(functionSignature);

    let result
    try {
      result = await dclTx.sendMetaTransaction(
        requestManager as any,
        metaRequestManager as any,
        functionSignature.data,
        storeConfig,
        { serverURL:"https://transactions-api.decentraland.org/v1" }
      );
      console.log('execute secondary order result', result);
      return result;
    } catch (error) {
      console.log('execute secondary order error', error);
      return result;
    }
  }

  async function isApproved(marketplace:string, tokenId:string){
    console.log('checking approvals', marketplace)

    const { storeConfig, contract  } = await getContract();

    let approved = await contract.isApprovedForAll(fromAddress,marketplace)
    console.log('approved address is', approved)
    // // return approved
    // return true
    return approved
  }

  async function approve(approve:boolean){
    console.log('attempting to approve marketplace for nft', approve, collectionAddress)

    const { storeConfig, contract  } = await getContract();
    storeConfig.address = collectionAddress!
    // storeConfig.version = "1"
    // storeConfig.name = "Beacon Proxy"

    console.log('store config is', storeConfig)

    const functionSignature = contract.setApprovalForAll.toPayload('0x480a0f4e360E8964e68858Dd231c2922f1df45Ef', approve)
    console.log(functionSignature);

    let result
    try {
      result = await dclTx.sendMetaTransaction(
        requestManager as any,
        metaRequestManager as any,
        functionSignature.data,
        storeConfig,
        { serverURL:"https://transactions-api.decentraland.org/v1" }
      );
      console.log('blockchain store result', result);
      return result;
    } catch (error) {
      console.log('blockchain store error', error);
      return result;
    }
  }

  async function removeListing(nftAddress:string, tokenId:string){
    console.log('attempting to remove listing')

    const { storeConfig, contract  } = await getMarketplaceContract();

    const functionSignature = contract.cancelOrder.toPayload(nftAddress, tokenId)
    console.log(functionSignature);

    let result
    try {
      result = await dclTx.sendMetaTransaction(
        requestManager as any,
        metaRequestManager as any,
        functionSignature.data,
        storeConfig,
        { serverURL:"https://transactions-api.decentraland.org/v1" }
      );
      console.log('blockchain store result', result);
      return result;
    } catch (error) {
      console.log('blockchain store error', error);
      return result;
    }
  }

  async function createOrder(nftAddress:string, tokenId:string, price:number, time:number){
    console.log('attempting to create listing')

    const { storeConfig, contract  } = await getMarketplaceContract();

    const functionSignature = contract.createOrder.toPayload(nftAddress, tokenId, eth.toWei(price, "ether"), time)
    console.log(functionSignature);

    let result
    try {
      result = await dclTx.sendMetaTransaction(
        requestManager as any,
        metaRequestManager as any,
        functionSignature.data,
        storeConfig,
        { serverURL:"https://transactions-api.decentraland.org/v1" }
      );
      console.log('blockchain create order result', result);
      return result;
    } catch (error) {
      console.log('blockchain create order error', error);
      return result;
    }
  }

  async function transferNFT(to:string, contractAddress:string, tokenId:string){
    console.log('attempting to transfer nft', to, contractAddress, tokenId, )

    const { storeConfig, contract  } = await getContract(contractAddress);
    storeConfig.address = contractAddress

    const functionSignature = contract.transferFrom.toPayload(localUserId, to, tokenId)
    console.log(functionSignature);

    let result
    try {
      result = await dclTx.sendMetaTransaction(
        requestManager as any,
        metaRequestManager as any,
        functionSignature.data,
        storeConfig,
        { serverURL:"https://transactions-api.decentraland.org/v1" }
      );
      console.log('blockchain create order result', result);
      return result;
    } catch (error) {
      console.log('blockchain create order error', error);
      return "error";
    }
  }

  return {isApproved, approve, removeListing, createOrder, executeOrder, transferNFT}
}
