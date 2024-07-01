import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS } from '../../../../helpers/types'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { items } from '../../../../components/Catalog'

let animations:any[] = []
let loop:number = 0
let animation:string = ""
let selectedIndex = 0

let updated = false

export function updateAssetAnimations(reset?:boolean){
    if(reset){
        selectedIndex = 0
        updated = false
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
        // updateActionData({loop:0, anim:animations[0], name:newActionData.name, type:newActionData.type}, true)
        updated = true
        console.log('item has animations', animations)
        animation = animations[selectedIndex]
    }
    return
}

export function AddAnimationActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::animation::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Set Animation Loop", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
        options={["Select Loop", "Play Once", "Loop"]}
        selectedIndex={0}
        onChange={selectLoop}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

    </UiEntity>
    )
}

function selectAnimation(index:number){
    animation = animations[index]
    updateActionData({anim:animation, loop:loop, name:newActionData.name, type:newActionData.type}, true)
}

function selectLoop(index:number){
    loop = index
    updateActionData({loop:index === 0 ? false : true, anim:animation, name:newActionData.name, type:newActionData.type}, true)
}
