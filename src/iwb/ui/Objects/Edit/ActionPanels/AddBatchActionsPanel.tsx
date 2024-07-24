import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { selectedItem } from '../../../../modes/Build'
import { colyseusRoom } from '../../../../components/Colyseus'
import { COMPONENT_TYPES } from '../../../../helpers/types'
import { getAllAssetNames } from '../../../../components/Name'

let entities:any[] = []
let entitiesWithActions:any[] = []

let selectedEntityIndex:number = 0
let selectedActionIndex:number = 0

let batchActions:any[] = []

let updated = false

export function releaseBatchActions(){
    updated = false
}

export function updateEntityActions(aid:string){
    entitiesWithActions.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }
    
    let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(aid)
    if(actions && actions.actions.length > 0){
        actions.actions.forEach((action:any)=>{
            entitiesWithActions.push(action)
        })
    }
    console.log('entity actions are ', entitiesWithActions,batchActions)
}

export function updateEntitiesWithActions(){
    if(!updated){
        updated = true
        entities.length = 0
        entities = getAllAssetNames(selectedItem.sceneId)
        batchActions.length = 0
        console.log('updatnig entites wit hactions')
    }
}

export function AddBatchActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::batch::actions::panel"}
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
        uiText={{value:"Add Batch Action", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

{/* action entity dropdown */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '15%',
    }}
    >

    <Dropdown
        // options={[...["Select Entity"], ...getEntityList()]}
        options={[...["Select Entity"], ...entities.map($=> $.name)]}
        selectedIndex={0}
        onChange={selectEntityIndex}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>

            {/* action entity actions dropdown */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '15%',
        margin:{top:"1%"}
    }}
    >

    <Dropdown
        options={[...["Select Action"], ...entitiesWithActions.map(($:any)=> $.name)]}
        // options={entitiesWithActions.length > 0 ? [...["Select Action"], ...entitiesWithActions[entityIndex].actions.map((item:any) => item.name).sort((a:any,b:any)=> a.localeCompare(b))] : []}
        selectedIndex={0}
        onChange={selectActionIndex}
        uiTransform={{
            width: '100%',
            height: '100%',
            display: selectedEntityIndex !== 0 ? "flex" : "none"
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
    />

    </UiEntity>

        {/* add action button */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(10, getAspect(uiSizes.buttonPillBlack)).width,
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
                value: "Add Action",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                setData({...entitiesWithActions[selectedActionIndex]}.id)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

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

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '45%',
        }}
        >

            {selectedItem && selectedItem.enabled && newActionData && updated && getBatchActionList()}
            
        </UiEntity>
    </UiEntity>
    )
}

function selectEntityIndex(index:number){
    console.log('select entity index', index)
    selectedEntityIndex = index
    if(index !== 0){
        updateEntityActions(entities[index-1].aid)
    }
}

function selectActionIndex(index:number){
    console.log('select action index', index)
    selectedActionIndex = index
    // if(index !== 0){
    //     newAction = entitiesWithActions[index-1]
    //     console.log('new action is', newAction)
    // }
}

function setData(value:any){
    let action = entitiesWithActions[selectedActionIndex-1]
    console.log('selected action is', action)
    batchActions.push({...entitiesWithActions[selectedActionIndex-1]})

    newActionData.actions = [...batchActions.map(($:any)=> $.id)]
    updateActionData({actions:newActionData.actions})

    console.log('all entities with actions', batchActions)
}

function getBatchActionList(){
    let arr:any[] = []
    let count = 0
    console.log('batch actions are a', batchActions)
    for(let i = 0; i < batchActions.length; i++){
        let action = batchActions[i]
        if(action){
            arr.push(<Row data={{name:action.name, actionId:action.id}} rowCount={count} />)
            count++
        }
    }
    return arr
}

export function Row(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "batch-action-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%', 
                height: '100%',
            }}
            uiText={{value:"" + data.name, fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    let actionIndex = newActionData.actions.findIndex(($:any)=> $.id === data.actionId)
                    if(actionIndex >= 0){
                        newActionData.actions.splice(actionIndex, 1)
                    }
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}
