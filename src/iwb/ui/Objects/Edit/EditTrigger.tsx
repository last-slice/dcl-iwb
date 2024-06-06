
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, ENTITY_POINTER_LABELS, SERVER_MESSAGE_TYPES, Triggers } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'

let parentIndex:number = 0

export function EditTrigger(){
    return (
        <UiEntity
        key={resources.slug + "advanced::trigger:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TRIGGER_COMPONENT ? 'flex' : 'none',
            }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Add Trigger Event", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            {/* new trigger row */}
            <UiEntity
                uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
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

                    <Dropdown
                        options={[...Object.values(Triggers).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).sort((a,b)=> a.localeCompare(b))]}
                        selectedIndex={0}
                        onChange={selectParentIndex}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />

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
                        flexDirection: 'row',
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
                        value: "Save",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        update("parent", parentIndex)
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
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Current Triggers", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        uiBackground={{color:Color4.Blue()}}
        />

        {/* current trigger list container */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '70%',
        }}
        uiBackground={{color:Color4.Green()}}
        > 
    
        {selectedItem && selectedItem.enabled && getTriggerEvents()}

        </UiEntity>

        </UiEntity>
    )
}

function getTriggerEvents(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let triggers = scene.triggers.get(selectedItem.aid)
        if(triggers){
            triggers.triggers.forEach((trigger:any, i:number)=>{
                arr.push(<TriggerRow data={trigger} rowCount={count} />)
                count++
            })
        }
    }
    return arr
}

function TriggerRow(trigger:any){
    let data:any = trigger.data
    return(
        <UiEntity
        key={resources.slug + "trigger-row-"+ trigger.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"2%", bottom:'2%', left:"2%", right:'2%'}
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
                width: '40%',
                height: '100%',
            }}
            >

            {/* trigger event type column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"" + data.type.replace(/^.*?_/, '').replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase()), fontSize:sizeFont(20,15), color:Color4.White()}}
            />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
                display: data.hasOwnProperty("input") ? "flex" : "none"
            }}
            uiText={{value:"" + ENTITY_POINTER_LABELS[data.input], fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            </UiEntity>

            {/* trigger condition column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
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
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"Conditions", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"" + data.actions.length, fontSize:sizeFont(20,15), color:Color4.White()}}
            />


            </UiEntity>

            {/* trigger action column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
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
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"Actions", fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* trigger event pointer column */}
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
            uiText={{value:"" + data.actions.length, fontSize:sizeFont(20,15), color:Color4.White()}}
            />


            </UiEntity>

            {/* trigger edit buttons column */}
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
                width: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.pencilEditIcon)).height,
                margin:{right:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas1.png'
                },
                uvs: getImageAtlasMapping(uiSizes.pencilEditIcon)
            }}
            onMouseDown={() => {
                // // updateTrigger('delete', 'remove', trigger.rowCount)
                // selectedTrigger = data
                // console.log('selected trigger is', selectedTrigger)
                // updateActionView("actions")
            }}
        />

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
                // updateTrigger('delete', 'remove', trigger.rowCount)
            }}
        />
                </UiEntity>

            </UiEntity>
    )
}


function selectParentIndex(index:number){
    parentIndex = index
}

function update(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.PARENTING_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}