
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, ENTITY_POINTER_LABELS, Pointers, SERVER_MESSAGE_TYPES, Triggers } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { utils } from '../../../helpers/libraries'


export let pointerView = "main"

let newPointerTypeIndex:number = 0
let newPointerButtonIndex:number = 0
let newPointerData:any = {}

export function updatePointerView(value:string, pointerId?:string){
    pointerView = value
    if(value === "info"){
        if(pointerId){
            console.log('have pointer info to popuplate')
        }else{
            let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
            if(scene){
                utils.timers.setTimeout(()=>{
                    let pointers = scene.pointers.get(selectedItem.aid)
                    if(pointers){
                        console.log('pointers are', pointers.events)
                        newPointerData = {...pointers.events[pointers.events.length-1]}
                    }
                }, 500)
            }
        }
    }
}

export function EditPointer(){
    return (
        <UiEntity
        key={resources.slug + "advanced::pointer:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.POINTER_COMPONENT ? 'flex' : 'none',
            }}
        >

        {/* main pointer panel view */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: pointerView === "main" ? "flex" : "none"
        }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
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
                value: "Add Pointer",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                newPointerData.type = 1
                newPointerData.hoverText = "Hover Text",
                newPointerData.button = 0
                newPointerData.maxDistance = 3
                newPointerData.showFeedback = true
                
                update('add', newPointerData)
                updatePointerView("info")
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
            uiText={{value:"Current Pointers", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        // uiBackground={{color:Color4.Blue()}}
        />

        {/* current list container */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '70%',
        }}
        // uiBackground={{color:Color4.Green()}}
        > 
    
        {selectedItem && selectedItem.enabled && getPointerEvents()}

        </UiEntity>

        </UiEntity>

            {/* info panel view */}
             <UiEntity
            uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent:'center',
            width: '100%',
            height: '100%',
            display: pointerView === "info" ? "flex" : "none"
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
                uiText={{value:"Pointer Event Info", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            {/* pointer type dropdown */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'}
                }}
                >

                    <Dropdown
                        options={getPointerList()}
                        selectedIndex={newPointerTypeIndex}
                        onChange={selectPointerType}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />

                </UiEntity>

            {/* pointer button dropdown */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:'1%'}
                }}
                >

                    <Dropdown
                        options={getPointerButtonList()}
                        selectedIndex={newPointerButtonIndex}
                        onChange={selectPointerButton}
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
                alignContent:'center',
                width: '100%',
                height: '10%',
            }}
                uiText={{value:"Hover Text", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />
                {/* pointer hover text */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            }}
        >

            <Input
                onChange={(value) => {
                    newPointerData.hoverText = value.trim()
                    update('edit', newPointerData)
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'Hover Text'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100',
                }}
                ></Input>
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '15%',
                margin:{top:"5%"}
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '50%',
                height: '100%',
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
                margin:{bottom:"10%"}
            }}
                uiText={{value:"Max Distance", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '80%',
                }}
            >
                <Input
                    onChange={(value) => {
                        newPointerData.maxDistance = parseFloat(value.trim())
                        update("edit", newPointerData)
                    }}
                    fontSize={sizeFont(20,15)}
                    placeholder={'' + newPointerData.maxDistance}
                    placeholderColor={Color4.White()}
                    color={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    ></Input>
                </UiEntity>

                </UiEntity>

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '50%',
                height: '100%',
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
                margin:{bottom:"10%"}
            }}
                uiText={{value:"Show Feedback", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

                        {/* show feedback dropdown */}
                        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '80%',
                }}
                >

                    <Dropdown
                        options={['True', 'False']}
                        selectedIndex={0}
                        onChange={(index:number)=>{
                            newPointerData.showFeedback = index === 0 ? true : false
                            update("edit", newPointerData)
                        }}
                        uiTransform={{
                            width: '100%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />

                </UiEntity>
                </UiEntity>

            </UiEntity>

            </UiEntity>

        </UiEntity>
    )
}

function selectPointerType(index:number){
    newPointerTypeIndex = index
    newPointerData.eventType = index
    update('edit', newPointerData)
}

PointerEventType.PET_DOWN

function selectPointerButton(index:number){
    newPointerButtonIndex = index
    newPointerData.button = index
    update('edit', newPointerData)
}


function getPointerList(){
    return [...Object.values(Pointers).map(str => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))]
}

function getPointerButtonList(){
    return [...ENTITY_POINTER_LABELS]
}

function getPointerEvents(){
    let arr:any[] = []
    let count = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let pointers = scene.pointers.get(selectedItem.aid)
        if(pointers){
            pointers.events.forEach((data:any, i:number)=>{
                arr.push(<Row data={data} rowCount={count} />)
                count++
            })
        }
    }
    return arr
}

function getTriggerActions(){
    // let arr:any[] = []
    // let count = 0
    // let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    // if(scene){
    //     let trigger = scene.actions.get(selectedItem.aid)
    //     if(actions){
    //         actions.actions.forEach((action:any, i:number)=>{
    //             arr.push(<ActionRow data={action} rowCount={count} />)
    //             count++
    //         })
    //     }
    // }
    // return arr
}

function Row(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "pointer-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
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
            uiText={{value:"" + Object.values(Pointers)[data.eventType].replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase()), fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
            }}
            uiText={{value:"" + ENTITY_POINTER_LABELS[data.button], fontSize:sizeFont(20,15), color:Color4.White()}}
            />

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
                updatePointerView("info", data.id)
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
                update("delete", {id:data.id})
            }}
        />
                </UiEntity>

            </UiEntity>
    )
}

function update(action:string, data:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.POINTER_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:data,
        }
    )
}