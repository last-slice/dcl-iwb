
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'

let updatedName:string = ""

export function EditName() {
    return (
        <UiEntity
            key={resources.slug + "editnamepanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.NAMES_COMPONENT ? 'flex' : 'none',
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
        uiText={{value:"Asset Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                updatedName = value.trim()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter new asset name'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            />

        </UiEntity>

        {generateButtons({slug:"update-name", buttons:[
            {label:"Update", pressed:false, func:()=>{
                sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
                    {
                        component:COMPONENT_TYPES.NAMES_COMPONENT,
                        aid:selectedItem.aid, 
                        sceneId:selectedItem.sceneId, 
                        value:updatedName
                    }
                )
                }
            }
        ]})}


        {/* <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10%',
            height: '100%',
            margin: {left: "1%", right: "1%"}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update Asset Name", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
                {
                    component:COMPONENT_TYPES.NAMES_COMPONENT,
                    aid:selectedItem.aid, 
                    sceneId:selectedItem.sceneId, 
                    value:updatedName
                }
            )

        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    /> */}

        </UiEntity>
    )
}