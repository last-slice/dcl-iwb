import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { items } from '../../../../components/Catalog'

let animations:any[] = []
let animation:string = ""
let selectedIndex = 0

let updated = false

export function updateAssetAnimations(reset?:boolean){
    if(reset){
        selectedIndex = 0
        updated = false
        return
    }

    if(updated){
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
        // console.log('item has animations', animations)
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
            height: '15%',
            margin:{bottom:'1%'}
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
            width: '100%',
            height: '30%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Set Animation Loop", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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


        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '30%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
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
            margin:{bottom:'5%'}
        }}
        uiText={{value:"Set Animation Speed", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
                let speed = parseFloat(value.trim())
                updateActionData({speed:isNaN(speed) ? 1 : speed})
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'Enter Action Name'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>

        </UiEntity>


        </UiEntity>

    </UiEntity>
    )
}

function selectAnimation(index:number){
    selectedIndex = index
    console.log('index is', index)
    animation = animations[index]
    updateActionData({anim:animation})//, loop:loop, name:newActionData.name, type:newActionData.type}, true)
}

function selectLoop(index:number){
    updateActionData({loop:index <= 1 ? false : true, anim:animation, name:newActionData.name, type:newActionData.type}, true)
}
