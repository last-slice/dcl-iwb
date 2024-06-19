import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { setUIClicked } from '../ui'
import resources from '../../helpers/resources'
import { UiTexts } from '../../components/UIText'
import { localPlayer } from '../../components/Player'
import { colyseusRoom } from '../../components/Colyseus'
import { COMPONENT_TYPES } from '../../helpers/types'
import { UiImages } from '../../components/UIImage'

export function createCustomUIImageComponent(){
  return(
    <UiEntity
    key={resources.slug + "uiimage::component::ui"}
    uiTransform={{
      width: '100%',
      height:'100%',
      justifyContent:'center',
      flexDirection:'column',
      alignContent:'center',
      alignItems:'center',
      positionType:'absolute',
      position:{top:0, right:0},
    }}
  >

        {localPlayer && localPlayer.activeScene && generateUIImageComponents()}

  </UiEntity>

  )
}

function generateUIImageComponents(){
    let scene = colyseusRoom.state.scenes.get(localPlayer.activeScene.id)
    if(!scene){
        return []
    }

    let arr:any[] = []

    scene[COMPONENT_TYPES.UI_IMAGE_COMPONENT].forEach((component:any, aid:string)=>{
        let itemInfo = UiImages.get(aid)
        if(itemInfo){
            // uiText.setText(component.text)
            itemInfo.visible ? itemInfo.show() : itemInfo.hide()
            arr.push(<CustomUIImage data={itemInfo} />)
        }
    })
    return arr
}

export class UIImage {
    key:string = ""
    src:string
    width:number
    height:number
    uvs?:any
    visible:boolean = false
    position:any

    constructor(key:string, itemInfo:any){
        this.key = key
        this.src = itemInfo.src
        this.width = itemInfo.width
        this.height = itemInfo.height
        this.uvs = itemInfo.uvs

        if(itemInfo.pt){
            if(!this.position){
                this.position = {}   
            }
            this.position.top =  `${itemInfo.pt}%`
        }
        if(itemInfo.pl){
            if(!this.position){
                this.position = {}   
            }
            this.position.left =  `${itemInfo.pl}%`
        }

        if(itemInfo.pr){
            if(!this.position){
                this.position = {}   
            }
            this.position.right =  `${itemInfo.pr}%`
        }

        if(itemInfo.pb){
            if(!this.position){
                this.position = {}   
            }
            this.position.bottom =  `${itemInfo.pb}%`
        }
    }

    show(){
        this.visible = true
    }

    hide(){
        this.visible = false
    }
}


export function CustomUIImage(info:any){
    let data = info.data
    return(
        <UiEntity
        key={resources.slug + "custom::ui::image::" + data.key}
        uiTransform={{
            // flexDirection: 'column',
            alignContent:'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display: data.visible ? 'flex' : 'none',
            positionType: 'absolute',
        }}
        >
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${data.width}%`,
            height: `${data.height}%`,
            positionType:'absolute',
            position: data.position ? data.position : undefined,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + data.src
            },
            uvs: data.uvs ? getImageAtlasMapping(data.uvs) : undefined
        }}
        // onMouseDown={() => {
        //     setUIClicked(true)
        // }}
        // onMouseUp={()=>{
        //     setUIClicked(false)
        // }}
        />
        </UiEntity>
    )
}