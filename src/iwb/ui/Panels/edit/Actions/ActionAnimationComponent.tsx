import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { selectedItem } from '../../../../components/modes/build'

export let selectedAnimationIndex:number = 0
export let selectedAnimationLoop:number = 0

export function ActionAnimationComponent(){
    return(
        <UiEntity
        key={'actionanimationcomponent'}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '49%',
            height: '100%',
            display:'flex'
        }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    uiText={{value:"Animation Name", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"action-play-animation-dropdown"}
        options={selectedItem && selectedItem.enabled && selectedItem.itemData.animComp ? selectedItem.itemData.animComp.animations.map((value:string, index:number)=> value + " - " + selectedItem.itemData.animComp.durations[index] + " seconds") : []}
        selectedIndex={selectedAnimationIndex}
        onChange={selectAction}
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
            width: '49%',
            height: '100%',
            display:'flex'
        }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    uiText={{value:"Animation Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"action-play-animation-loop-dropdown"}
        options={["False", "True"]}
        selectedIndex={selectedAnimationIndex}
        onChange={selectLoop}
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


                  
    )
}

function selectAction(index:number){
    selectedAnimationIndex = index
}


function selectLoop(index:number){
    selectedAnimationLoop = index
}

