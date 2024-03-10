import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { Color4 } from '@dcl/sdk/math'
import { invisibleLayers, visibleLayers } from '../CollisionComponentPanel'

export let actionVisibilityIndex:number = 0
export let actionVisibilityColliderVMask:number = 0
export let actionVisibilityCollideriMask:number = 0

export function ActionVisibilityComponent(){
    return(
        <UiEntity
        key={'actionvisibilitycomponent'}
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
            width: '32%',
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
    uiText={{value:"Select Visibility", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"action-set-visibility-dropdown"}
        options={["Visible", "Invisible"]}
        selectedIndex={0}
        onChange={selectVisibility}
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
            width: '32%',
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
    uiText={{value:"Visible Collider", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"action-visibility-vis-collider-dropdown"}
        options={visibleLayers}
        selectedIndex={actionVisibilityColliderVMask}
        onChange={selectVisibilityCollider}
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
            width: '32%',
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
    uiText={{value:"Invisbile Collider", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
        key={"action-visibility-invvis-collider-dropdown"}
        options={invisibleLayers}
        selectedIndex={actionVisibilityCollideriMask}
        onChange={selectInvisibleCollider}
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

function selectVisibility(index:number){
    actionVisibilityIndex = index
}


function selectVisibilityCollider(index:number){
    actionVisibilityColliderVMask = index
}

function selectInvisibleCollider(index:number){
    actionVisibilityCollideriMask = index
}

