import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Dropdown, Input, UiEntity } from '@dcl/sdk/react-ecs'
import { newActionData, updateActionData, updateActionView } from '../EditAction'
import resources from '../../../../helpers/resources'
import { sizeFont } from '../../../helpers'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'

let selectedIndex:number = 0
export let entityStates:any[] = []

let stateVariables:any[] = [] 
let isVar:boolean = false
let stateVariable:string = ""

export function updateEntityStates(){
    entityStates.length = 0
    stateVariables.length = 0
    isVar = false

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene)  return;

    scene[COMPONENT_TYPES.STATE_COMPONENT].forEach((state:any, aid:string)=>{
        stateVariables.push({aid:aid, name: scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value})
    })

    stateVariables.unshift({name:"SELECT VARIABLE", aid:""})

    let states = scene[COMPONENT_TYPES.STATE_COMPONENT].get(selectedItem.aid)
    if(states && states.values.length > 0){
        states.values.forEach((value:any)=>{
            entityStates.push(value)
        })
    }
    if(!newActionData.state){
        newActionData.state = entityStates[0]
    }
    
    selectedIndex = 0
}


export function AddSetStatePanel(){
    return(
        <UiEntity
        key={resources.slug + "action::state::panel"}
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
    }}
    uiText={{value:"State Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
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
        options={["SELECT STATE TYPE", "CUSTOM", "VARIABLE"]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index == 1){
                isVar = false
                delete newActionData.message
            }

            if(index === 2){
                isVar = true
                updateActionData({message:stateVariable})
            }
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            display: isVar ? "flex" : "none"
        }}
        >

             <Dropdown
                    options={[...stateVariables.map((counter:any)=> counter.name)]}
                    selectedIndex={0}
                    onChange={(index:number)=>{
                        if(index !== 0){
                            stateVariable = stateVariables[index].aid
                            updateActionData({message:stateVariables[index].aid})
                        }
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'},
              display: isVar ? "none" : "flex"
        }}
        uiText={{value:"Select State", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'1%'},
              display: isVar ? "none" : "flex"
        }}
        >

        <Dropdown
            options={[...entityStates]}
            selectedIndex={selectedIndex}
            onChange={selectState}
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

function selectState(index:number){
    selectedIndex = index
    console.log('index is', index)
    // console.log('new action data is', newActionData)
    // let data = {...newActionData}
    // newActionData.state = entityStates[index]
    // data.state = entityStates[index]
    // console.log('data is', data)
    // updateActionData({...data}, true)
    // console.log('new action data is', newActionData)
    updateActionData({state:entityStates[index]})
}
