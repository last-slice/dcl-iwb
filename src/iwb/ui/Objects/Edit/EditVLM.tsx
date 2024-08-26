import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { utils } from '../../../helpers/libraries'

let vlm:any = {}
let id:string = ''
let scene:any

export function updateVLM(){
    scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    vlm = {...scene[COMPONENT_TYPES.VLM_COMPONENT].get(selectedItem.aid)}
    console.log('setting vlm to', vlm)
    id = ""
}


export function EditVLMComponent() {
    return (
        <UiEntity
            key={resources.slug + "edit::vlm::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VLM_COMPONENT ? 'flex' : 'none',
            }}
        >


     <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '20%',
        margin:{bottom:'5%'},
        display: vlm && !vlm.id ? "flex" : "none"
    }}
    uiText={{value: "Before VLM can connect to your IWB scene, you need to copy your SceneId from the VLM site here.", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'top-left'}}
    />

     {/* url input info */}
     <UiEntity
         uiTransform={{
             flexDirection: 'row',
             alignItems: 'center',
             justifyContent: 'center',
             width: '100%',
             height: '10%',
             margin: {top: "1%", bottom:'1%'},
             display: vlm && !vlm.id ? "flex" : "none"
         }}
     >

         <Input
             onChange={(input) => {
                id = input.trim()
             }}
             onSubmit={(input) => {
                id = input.trim()
            }}
             color={Color4.White()}
             fontSize={sizeFont(25, 15)}
             placeholder={"Enter VLM Scene Id"}
             placeholderColor={Color4.White()}
             uiTransform={{
                 width: '100%',
                 height: '120%',
             }}
         ></Input>

         <UiEntity
             uiTransform={{
                 flexDirection: 'row',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                 height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                 margin:{left:'1%'}
             }}
             uiBackground={{
                 textureMode: 'stretch',
                 texture: {
                     src: 'assets/atlas2.png'
                 },
                 uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
             }}
             uiText={{
                 value: "Search",
                 fontSize: sizeFont(25, 15),
                 color: Color4.White(),
                 textAlign: 'middle-center'
             }}
             onMouseDown={() => {
                setUIClicked(true)
                update("id", id)
                setUIClicked(false)
             }}
             onMouseUp={()=>{
                setUIClicked(false)
             }}
         />
     </UiEntity>

     <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: vlm && vlm.id ? "flex" : "none"
    }}
    uiText={{value: "Scene Id:", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: vlm && vlm.id ? "flex" : "none"
    }}
    uiText={{textWrap:'nowrap', value: (vlm.id ? vlm.id : ""), fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:"5%"},
        display: vlm && vlm.id ? "flex" : "none"
    }}
    uiText={{value: "Scene Parent Id: " + (vlm.id ? scene.parentEntity : ""), fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '15%',
        display: vlm && vlm.id ? "flex" : "none"//
    }}
    uiText={{value: "Copy this ID into your VLM Instances as the PARENT ENTITY", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'top-left'}}
    />
    
    


        </UiEntity>
    )
}

function update(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.VLM_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )

    utils.timers.setTimeout(()=>{
        updateVLM()
    }, 200)
}