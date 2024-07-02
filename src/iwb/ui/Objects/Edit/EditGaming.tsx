
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { cancelEditingItem, selectedItem } from '../../../modes/Build'
import { openEditComponent, visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'

let gamingInfo:any = {}
let startScreen:string = ""

export function updateGamingInfo(reset?:boolean){
    if(reset){
        gamingInfo = undefined
        return
    }
    gamingInfo = {...localPlayer.activeScene[COMPONENT_TYPES.GAME_COMPONENT].get(selectedItem.aid)}
}

export function EditGaming(){
    return (
        <UiEntity
        key={resources.slug + "advanced::gaming:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.GAME_COMPONENT ? 'flex' : 'none',
            }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Game Name", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >
    <Input
        onChange={(value) => {
            // gamingInfo.name = value.trim()
            update("name", value.trim())
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'' + (gamingInfo && gamingInfo.name)}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // value={selectedItem && selectedItem.enabled  ? getDefaultCounterValue() : ""}
        />

        </UiEntity>

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Game Description", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />
        
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            >
    <Input
        onChange={(value) => {
            // gamingInfo.description = value.trim()//
            update("description", value.trim())
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'' + (gamingInfo && gamingInfo.description)}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // value={selectedItem && selectedItem.enabled  ? getDefaultCounterValue() : ""}
        />

        </UiEntity>

        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                >
            <Dropdown
                options={['IWB']}//, 'Custom']}
                selectedIndex={gamingInfo && gamingInfo.startScreen !== "iwb" ? 1 : 0}
                onChange={selectStartScreenType}
                uiTransform={{
                    width: '100%',
                    height: '120%',
                }}
                // uiBackground={{color:Color4.Purple()}}//
                color={Color4.White()}
                fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: gamingInfo && gamingInfo.startScreen !== "iwb" ? "flex" : "none"
    }}
    >
    <Input
        onChange={(value) => {
            startScreen = value.trim()
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'' + (gamingInfo && gamingInfo.startScreen)}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        // value={selectedItem && selectedItem.enabled  ? getDefaultCounterValue() : ""}
        />

        </UiEntity>

        {/* <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin:'2%'
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{
            value: "Update",
            fontSize: sizeFont(25, 15),
            color: Color4.White(),
            textAlign: 'middle-center'
        }}
        onMouseDown={() => {
            setUIClicked(true)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    /> */}


        </UiEntity>
    )
}

function selectStartScreenType(index:number){
    gamingInfo.startScreen = index === 0 ? "iwb" : startScreen
}

function update(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.GAME_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}