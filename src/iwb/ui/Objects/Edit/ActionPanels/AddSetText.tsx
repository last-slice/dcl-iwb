import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Actions, COMPONENT_TYPES } from '../../../../helpers/types'
import { getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { colyseusRoom } from '../../../../components/Colyseus'
import { selectedItem } from '../../../../modes/Build'

let dataEntities:any[] = []
let type = 0

export function resetAddSetText(){
    type = 0
    dataEntities.length = 0
    updateActionData({ttype:0})
}

export function AddSetText(){
    return(
        <UiEntity
        key={resources.slug + "action::set::text::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Choose Text Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{bottom:'2%'}
            }}
            >

        <Dropdown
            options={["Text", "State", "Counter"]}
            selectedIndex={0}
            onChange={selectTextType}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}
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
                    height: '15%',
                    display:type === 0 ? "flex" : "none"
                }}
            >

            <Input
                onChange={(value) => {
                    updateActionData({text:value.trim()}, true)
                }}
                onSubmit={(value) => {
                    updateActionData({text:value.trim()}, true)
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'Enter Text'}
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
                width: '100%',
                height: '15%',
                margin:{bottom:'2%'},
                display: type > 0 ? "flex" : "none"
            }}
            >

        <Dropdown
            options={getDataEntities()}
            selectedIndex={0}
            onChange={(index:number)=>{
                if(index > 0){
                    updateActionData({label:dataEntities.sort((a:any, b:any)=> a.name.localeCompare(b.name))[index-1].aid})
                }
            }}
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
    )
}

function selectTextType(index:number){
    type = index
    updateActionData({ttype:index})

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    if(index > 0){
        getEntities()
    }
}

function getEntities(){
    dataEntities.length = 0

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((entity:any)=>{
        if(!["0", "1", "2"].includes(entity.aid)){
            if(type === 0){
            }
            else if(type === 1){
                let hasState = scene[COMPONENT_TYPES.STATE_COMPONENT].get(entity.aid)
                if(hasState){
                    dataEntities.push({name: scene[COMPONENT_TYPES.NAMES_COMPONENT].get(entity.aid).value, aid:entity.aid})
                }
            }
            else{
                let hasCounter = scene[COMPONENT_TYPES.COUNTER_COMPONENT].get(entity.aid)
                if(hasCounter){
                    dataEntities.push({name: scene[COMPONENT_TYPES.NAMES_COMPONENT].get(entity.aid).value, aid:entity.aid})
                }
            }
        }
    })
    console.log('data entities area', dataEntities)
    dataEntities.sort((a, b)=> a.name.localeCompare(b.name))
}

function getDataEntities(){
    if(dataEntities.length === 0){
        return []
    }
    return ["Select Data Entity",...dataEntities.map($=> $.name)]
}