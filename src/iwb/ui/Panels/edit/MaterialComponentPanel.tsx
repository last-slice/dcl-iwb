
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { BLOCKCHAINS, COMPONENT_TYPES, EDIT_MODES, MATERIAL_TYPES, NFT_FRAMES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { uiSizes } from '../../uiConfig'

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

export function MaterialComponentPanel() {
    return (
        <UiEntity
            key={"editmaterialComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.MATERIAL_COMPONENT ? 'flex' : 'none',
            }}
        >


        {/* material type row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
        uiText={{value:"Material Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >

            {/* <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                        uiText={{value:"" + MATERIAL_TYPES[getMaterialType()], fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}
                    /> */}

                        <Dropdown
                    key={"material-type-dropdown"}
                    options={MATERIAL_TYPES}
                    selectedIndex={getMaterialType()}
                    onChange={selectType}
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



        {/* first row edits */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                display:"none",
            }}
            uiBackground={{color:Color4.Blue()}}
        >

    {/* metallic column */}
    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '47%',
                height: '100%',
                margin:{right:'1%'}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"5%"}
            }}
        uiText={{value:"Metallic", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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

        <Input
            onChange={(value) => {
                updateMaterial("metallic", parseFloat(value))
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'0'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.metallic : "0"}
            ></Input>

        </UiEntity>

        </UiEntity>

        {/* roughness column */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '47%',
                height: '100%',
                margin:{left:'1%'}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"5%"}
            }}
        uiText={{value:"Roughness", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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

        <Input
            onChange={(value)=>{
                updateMaterial("roughness", parseFloat(value))
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.roughness : "1"}
            fontSize={sizeFont(20,15)}
            placeholder={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.roughness : "1"}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}//
            ></Input>

        </UiEntity>

        </UiEntity>

            </UiEntity>

            {/* emissive row edits */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
                margin:{top:"2%"},
                display:"none",
            }}
            uiBackground={{color:Color4.Green()}}
        >

            {/* emissive enable row */}
         <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
        >
                    
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            uiText={{value:"Emissive", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
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
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT && selectedItem.itemData.matComp ? (selectedItem.itemData.matComp.emiss ? getImageAtlasMapping(uiSizes.toggleOffNoBlack) : getImageAtlasMapping(uiSizes.toggleOnNoBlack)) : getImageAtlasMapping(uiSizes.toggleOnNoBlack)
        }}
        onMouseDown={() => {
            // sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.VISBILITY_COMPONENT, action:"toggle", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId}})
            // selectedItem.itemData.visComp.visible = !selectedItem.itemData.visComp.visible
        }}
        />

            </UiEntity>


        </UiEntity>


            {/* emissive url & intensity column */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
            }}
        >

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '47%',
                height: '100%',
            }}
        >
        <Input
            onChange={(value)=>{
                updateMaterial("emissPath", value)
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.emissPath : ""}
            fontSize={sizeFont(20,15)}
            placeholder={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.emissPath : ""}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}//
            ></Input>
            </UiEntity>


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '47%',
                height: '100%',
            }}
        >
        <Input
            onChange={(value)=>{
                updateMaterial("emissInt", parseFloat(value))
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.emissInt : "0"}
            fontSize={sizeFont(20,15)}
            placeholder={selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? selectedItem.itemData.matComp.emissInt : "0"}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}//
            ></Input>
            </UiEntity>



            </UiEntity>

        </UiEntity>


     
        </UiEntity>
    )
}

function getMaterialType(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.matComp ? MATERIAL_TYPES.findIndex((m)=> m === selectedItem.itemData.matComp.type) : 0
}



function selectType(index: number) {
    if(index !== getMaterialType()){
        updateMaterial("type", MATERIAL_TYPES[index])
    }    
}

function updateMaterial(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.MATERIAL_COMPONENT, action:"toggle", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}