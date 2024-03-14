import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { selectedItem } from '../../../../components/modes/build'

export let selectedAnimationIndex:number = 0
export let selectedAnimationLoop:number = 0

export function ActionDialogComponent(){
    return(
        <UiEntity
        key={'actiondialogcomponent'}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
    >

        </UiEntity>


                  
    )
}

function selectAction(index:number){
    selectedAnimationIndex = index
}


function selectLoop(index:number){
    selectedAnimationLoop = index
}

