import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { localPlayer } from '../../../../components/Player'
import { COMPONENT_TYPES } from '../../../../helpers/types'


let contactMaterials:any[] = []
let selectedMaterialIndex = 0
let friction:number = 0
let bounce:number = 0

export function updateAllContactMaterials(){
    contactMaterials.length = 0
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }
    scene[COMPONENT_TYPES.PHYSICS_COMPONENT].forEach((component:any, aid:string)=>{
        if(component.type === 0){
            component.contactMaterials.forEach((material:any, name:string)=>{
                contactMaterials.push({name, ...material})
            })
        }
    })
    if(contactMaterials.length > 0){
        friction = contactMaterials[0].friction
        bounce = contactMaterials[0].bounce
        updateActionData({vMask:bounce, iMask:friction, state:contactMaterials[0].name})
    }
}

export function AddUpdatePhysicsMaterial(){
    return(
        <UiEntity
        key={resources.slug + "action::update::physics::material::panel"}
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
        uiText={{value:"Choose Contact Material", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
        options={contactMaterials.map((c:any)=> c.name)}
        selectedIndex={0}
        onChange={(index:number)=>{
            // updateActionData({value:index - 1})
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
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
            height: '20%',
            margin:{top:'5%'}
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '25%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Friction: " + friction, textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />
             <Input
                onChange={(value) => {
                    let temp = parseFloat(value.trim())
                    if(!isNaN(temp)){
                        friction = temp
                        updateActionData({iMask:friction})
                    }
                }}
                onSubmit={(value) => {
                    let temp = parseFloat(value.trim())
                    if(!isNaN(temp)){
                        friction = temp
                        updateActionData({iMask:friction})
                    }
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'amount (0-1)'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '76%',
                }}
                ></Input>
</UiEntity>

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '25%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Bounce: " + bounce, textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />
             <Input
                onChange={(value) => {
                    let temp = parseFloat(value.trim())
                    if(!isNaN(temp)){
                        bounce = temp
                        updateActionData({vMask:bounce})
                    }
                }}
                onSubmit={(value) => {
                    let temp = parseFloat(value.trim())
                    if(!isNaN(temp)){
                        bounce = temp
                        updateActionData({vMask:bounce})
                    }
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'amount (0-1)'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '76%',
                }}
                ></Input>
</UiEntity>

        </UiEntity>

    </UiEntity>
    )
}