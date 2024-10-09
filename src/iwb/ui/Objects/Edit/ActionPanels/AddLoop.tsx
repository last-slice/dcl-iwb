import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, COMPONENT_TYPES, ENTITY_EMOTES, ENTITY_EMOTES_SLUGS, SERVER_MESSAGE_TYPES } from '../../../../helpers/types'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom, sendServerMessage } from '../../../../components/Colyseus'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'

let actions:any[] = []
let selectedIndex = 0

let updated = false

export function updateAssetActionsLoopPanel(){
    actions.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let entityActions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(selectedItem.aid)
    if(entityActions && entityActions.actions.length > 0){
        entityActions.actions.forEach((action:any)=>{
            actions.push(action)
        })
    }
}

export function AddLoopPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::loop::panel"}
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '25%',
            margin:{bottom:'1%'}
        }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '100%',
        }}
        >
                    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Choose Action", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
        options={[...["Select Action"], ...actions.map(($:any)=> $.name)]}
        selectedIndex={0}
        onChange={selectAction}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

        </UiEntity>

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '30%',
            height: '100%',
        }}
        >
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
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
                value: "Add",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                addAction()
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
            </UiEntity>

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
        uiText={{value:"Set Loop Interval", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'5%'}
        }}
    >
        <Input
            onChange={(value) => {
                updateActionData({timer: parseFloat(value.trim())}, true)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'time in seconds'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            ></Input>
        </UiEntity>

        <UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent:'center',
    width: '100%',
    height: '10%',
}}
    uiText={{value:"Current Actions", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
/>

    </UiEntity>
    )
}

function selectAction(index:number){
    selectedIndex = index
}

function addAction(){
    if(selectedIndex !== 0){
        let newActions = [...newActionData.actions]
        newActions.push(actions[selectedIndex-1].id)
        updateActionData({actions:newActions}, true)
    }
}