
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { BLOCKCHAINS, COMPONENT_TYPES, NFT_FRAMES, NFT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'

export function EditNftShape() {
    return (
        <UiEntity
            key={resources.slug + "editnftComponentPanel"}
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
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
            >

         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'5%'}
            }}
        uiText={{value:"NFT Chain", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '50%',
    }}
>

        <Dropdown
    options={Object.values(BLOCKCHAINS)}
    selectedIndex={getChainIndex()}
    onChange={selectChain}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Purple()}}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>

        </UiEntity>

        </UiEntity>

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                }}
            >

         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'5%'}
            }}
        uiText={{value:"NFT Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '50%',
    }}
>

        <Dropdown
    options={Object.values(NFT_TYPES)}
    selectedIndex={getTypeIdex()}
    onChange={selectType}
    uiTransform={{
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Purple()}}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>

        </UiEntity>

        </UiEntity>



        </UiEntity>

                {/* style row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"1%"}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'5%'}
            }}
        uiText={{value:"Frame Style", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
        >

                        <Dropdown
                    options={Object.values(NFT_FRAMES)}
                    selectedIndex={getFrameIndex()}
                    onChange={selectFrame}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
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
    if(selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.NFT_COMPONENT){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.NFT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return Object.values(BLOCKCHAINS).findIndex((c)=> c === itemInfo.chain.split(":")[1])
            }
            return 0
        }
        return 0
    }
    return 0
}

function getTypeIdex(){
    if(selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.NFT_COMPONENT){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.NFT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return Object.values(BLOCKCHAINS).findIndex((c)=> c === itemInfo.chain.split(":")[1])
            }
            return 0
        }
        return 0
    }
    return 0
}

function getFrameIndex(){
    if(selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.NFT_COMPONENT){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.NFT_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.style
            }
            return 0
        }
        return 0
    }
    return 0
}

function selectChain(index: number) {
    if(index !== getChainIndex()){
        updateNFT("chain", Object.values(BLOCKCHAINS)[index])
    }    
}

function selectFrame(index: number) {
    if(index !== getChainIndex()){
        updateNFT("style", index)
    }  
}

function selectType(index: number) {
    if(index !== getTypeIdex()){
        updateNFT("standard", Object.values(NFT_TYPES)[index])
    }  
}

function updateNFT(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.NFT_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}