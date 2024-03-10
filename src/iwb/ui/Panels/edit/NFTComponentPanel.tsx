
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { BLOCKCHAINS, COMPONENT_TYPES, EDIT_MODES, NFT_FRAMES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { log } from '../../../helpers/functions'
import { NftFrameType } from '@dcl/sdk/ecs'
import { updateNFTFrame } from '../../../components/scenes/components'

let chains:BLOCKCHAINS[] = [
    BLOCKCHAINS.ETH,
    // BLOCKCHAINS.POLYGON
]

let frames:NFT_FRAMES[] = [
    NFT_FRAMES.NFT_CLASSIC,
    NFT_FRAMES.NFT_BAROQUE_ORNAMENT,
    NFT_FRAMES.NFT_DIAMOND_ORNAMENT,
    NFT_FRAMES.NFT_MINIMAL_WIDE,
    NFT_FRAMES.NFT_MINIMAL_GREY,
    NFT_FRAMES.NFT_BLOCKY,
    NFT_FRAMES.NFT_GOLD_EDGES,
    NFT_FRAMES.NFT_GOLD_CARVED,
    NFT_FRAMES.NFT_GOLD_WIDE,
    NFT_FRAMES.NFT_GOLD_ROUNDED,
    NFT_FRAMES.NFT_METAL_MEDIUM,
    NFT_FRAMES.NFT_METAL_WIDE,
    NFT_FRAMES.NFT_METAL_SLIM,
    NFT_FRAMES.NFT_METAL_ROUNDED,
    NFT_FRAMES.NFT_PINS,
    NFT_FRAMES.NFT_MINIMAL_BLACK,
    NFT_FRAMES.NFT_MINIMAL_WHITE,
    NFT_FRAMES.NFT_TAPE,
    NFT_FRAMES.NFT_WOOD_SLIM,
    NFT_FRAMES.NFT_WOOD_WIDE,
    NFT_FRAMES.NFT_WOOD_TWIGS,
    NFT_FRAMES.NFT_CANVAS,
    NFT_FRAMES.NFT_NONE,
]

export function NFTComponentPanel() {
    return (
        <UiEntity
            key={"editnftComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.NFT_COMPONENT ? 'flex' : 'none',
            }}
        >


        {/* chain row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"5%"}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        uiText={{value:"NFT Chain", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >

                        <Dropdown
                    key={"chain-type-dropdown"}
                    options={chains}
                    selectedIndex={getChainIndex()}
                    onChange={selectChain}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

        </UiEntity>

        </UiEntity>

                {/* style row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"5%"}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        uiText={{value:"Frame Style", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >

                        <Dropdown
                    key={"nft-frame-dropdown"}
                    options={frames}
                    selectedIndex={getFrameIndex()}
                    onChange={selectFrame}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

        </UiEntity>

        </UiEntity>


    {/* contract row */}
    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"5%"}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
                margin:{bottom:"5%"}
            }}
        uiText={{value:"NFT Contract Address", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
        >

        <Input
            onChange={(value) => {
                updateNFT("contract", value)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'contract address'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.nftComp ? selectedItem.itemData.nftComp.contract : ""}
            ></Input>

        </UiEntity>

        </UiEntity>

        {/* tokenid row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"5%"}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
                margin:{bottom:"5%"}
            }}
        uiText={{value:"NFT Token ID", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
        >

        <Input
            onChange={(value)=>{
                updateNFT("tokenId", value)
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.nftComp ? selectedItem.itemData.nftComp.tokenId : ""}
            fontSize={sizeFont(20,15)}
            placeholder={'token id'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>

        </UiEntity>

        </UiEntity>
     
        </UiEntity>
    )
}

function getChainIndex(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.nftComp ? chains.findIndex((c)=> c === selectedItem.itemData.nftComp.chain) : 0
}

function getFrameIndex(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.nftComp ? selectedItem.itemData.nftComp.style : 0
}

function selectChain(index: number) {
    if(index !== getChainIndex()){
        updateNFT("chain", chains[index])
    }    
}

function selectFrame(index: number) {
    if(index !== getChainIndex()){
        updateNFT("style", index)
    }  
}

function updateNFT(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.NFT_COMPONENT, action:"toggle", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}