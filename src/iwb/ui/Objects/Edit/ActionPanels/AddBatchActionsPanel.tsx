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

export let entityActions:any[] = []
let selectedIndex = 0

export function updateEntityActions(){
    entityActions.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let actions = scene[COMPONENT_TYPES.ACTION_COMPONENT].get(selectedItem.aid)
        if(actions && actions.actions.length > 0){
            actions.actions.forEach((action:any)=>{
                entityActions.push({name:action.name, actionId:action.id})
            })
        }
    }
    selectedIndex = 0
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
        options={entityActions.map($=> $.name)}
        selectedIndex={selectedIndex}
        onChange={selectActionIndex}
        uiTransform={{
            width: '100%',
            height: '120%',
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
                console.log(entityActions[selectedIndex].actionId)
                setData({...entityActions[selectedIndex]}.actionId)
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

            {selectedItem && selectedItem.enabled && newActionData && newActionData.actions && newActionData.actions.length > 0 && getBatchActionList()}
            
        </UiEntity>
    </UiEntity>
    )
}


function selectActionIndex(index:number){
    selectedIndex = index
}

function setData(value:any){
    console.log(entityActions)
    
    let data = {...newActionData}
    data.actions.push(value)
    updateActionData(data, true)
}

function getBatchActionList(){
    let arr:any[] = []
    let count = 0
    newActionData.actions.forEach((actionId:any, i:number)=>{
        arr.push(<Row data={{name:entityActions.find($=> $.actionId ===actionId).name, actionId:actionId}} rowCount={count} />)
        count++
    })
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
                    let actionIndex = newActionData.actions.findIndex(($:any)=> $.actionId === data.actionId)
                    if(actionIndex >= 0){
                        newActionData.actions.splice(actionIndex, 1)
                    }
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}
