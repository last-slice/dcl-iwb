
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked, setupUI } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { items } from '../../../components/Catalog'
import { Animator, Entity } from '@dcl/sdk/ecs'
import { getEntity } from '../../../components/IWB'

let animations:any[] = []
let animation:string = ""
let selectedIndex = 0
export let animationEntity:Entity

export function updateAssetAnimations(reset?:boolean){
    if(reset){
        selectedIndex = 0
        return
    }

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    selectedIndex = 0

    let catalogItem = items.get(selectedItem.catalogId)
    if(catalogItem && catalogItem.anim){
        animations = [...catalogItem.anim.map($=> $.name)]
        animation = animations[selectedIndex]
    }
    return
}

export function EditAnimation() {
    return (
        <UiEntity
            key={resources.slug + "edit::animation::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.ANIMATION_COMPONENT ? 'flex' : 'none',
            }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Choose Animation", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
            margin:{bottom:'5%'}
        }}
    >
        <Dropdown
        options={animations}
        selectedIndex={selectedIndex}
        onChange={selectAnimation}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Play Animation",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                playAnimation()
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
        
        </UiEntity>
    )
}


function selectAnimation(index:number){
    animation = animations[index]
}

function playAnimation(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let item = scene[COMPONENT_TYPES.ANIMATION_COMPONENT].get(selectedItem.aid)
    if(!item){
        return
    }

    let entityInfo = getEntity(scene, selectedItem.aid)
    if(!entityInfo){
        return
    }

    animationEntity = entityInfo.entity

    Animator.stopAllAnimations(entityInfo.entity)
    const clip = Animator.getClip(entityInfo.entity, animation)
    clip.playing = true
    clip.loop = false
}