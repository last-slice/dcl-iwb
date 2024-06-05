import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import resources, { colors } from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, calculateSquareImageDimensions, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { localPlayer } from '../../components/Player'
import { selectedItem } from '../../modes/Build'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { generateButtons, setUIClicked } from '../ui'
import { items } from '../../components/Catalog'
import { openEditComponent } from './EditAssetPanel'
import { Color4 } from '@dcl/sdk/math'

let show = false
let buttons:any[] = []
let advancedView:string = ""

///parenting
let parentIndex:number = 0

export function displayEditAdvancedPanel(value:boolean, toggle?:boolean){
    show = value

    if(show){
        updateComponents()
    }
    // show = toggle ? !show : value
    // resetViews()

    // setTableConfig(currentWorldTableConfig)
    // updateMainView("Worlds")
    // updateWorldView("Current World")

    // if(show && worldView === "Current World"){
    //     updateIWBTable(testData.scenes)
    // }
}

function resetViews(){
    // mainView = "Worlds"
    // updateWorldView("Current World")
    // buttons.forEach(($:any)=>{
    //     $.pressed = false
    // })
}

function updateAdvancedView(view:string){
    let button = buttons.find($=> $.label === advancedView)
    if(button){
        button.pressed = false
    }

    advancedView = view
    button = buttons.find($=> $.label === view)
    if(button){
        button.pressed = true
    }
}

function updateComponents(){
    buttons.length = 0
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene.parenting.find(($:any)=> $.aid === selectedItem.aid)
            if(itemInfo){
                buttons.push({label:COMPONENT_TYPES.PARENTING_COMPONENT, pressed:false, func:()=>{
                    updateAdvancedView(COMPONENT_TYPES.PARENTING_COMPONENT)
                    }
                })
            }

            buttons.push({label:COMPONENT_TYPES.TRIGGER_COMPONENT, pressed:false, func:()=>{
                    updateAdvancedView(COMPONENT_TYPES.TRIGGER_COMPONENT)
                }
            })
            buttons.push({label:COMPONENT_TYPES.ACTION_COMPONENT, pressed:false, func:()=>{
                    updateAdvancedView(COMPONENT_TYPES.ACTION_COMPONENT)
                }
            })
            buttons.push({label:COMPONENT_TYPES.STATE_COMPONENT, pressed:false, func:()=>{
                    updateAdvancedView(COMPONENT_TYPES.STATE_COMPONENT)
                }
            })
            buttons.push({label:COMPONENT_TYPES.COUNTER_COMPONENT, pressed:false, func:()=>{
                    updateAdvancedView(COMPONENT_TYPES.COUNTER_COMPONENT)
                }
            })
        }
    }
}

export function createAdvancedEditPanel() {
    return (
        <UiEntity
        key={"" + resources.slug + "edit-advanced-panel-ui"}
            uiTransform={{
                display: show? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width,
                height: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width) / 2, bottom: '15%'}
            }}
        // uiBackground={{ color: Color4.Red() }}
        >

            {/* main bg container */}
            <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    justifyContent:'center'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.horizRectangle)
                }}
            >

                {/* main content container */}
                <UiEntity
                uiTransform={{
                    display:'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '97%',
                    height: '85%',
                    margin:{left:"1%"},
                    padding:{left:"1%", right:'2%', bottom:'2%'}
                }}
                >

                {/* left container */}
                <UiEntity
                uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '20%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Red()}}
                    >

                    <UiEntity
                    uiTransform={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(15).width,
                        height: calculateSquareImageDimensions(15).height,
                        margin:{bottom:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: "" + (selectedItem && selectedItem.enabled ? items.get(selectedItem.catalogId)?.im : "")
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 256,
                            atlasWidth: 256,
                            sourceTop: 0,
                            sourceLeft: 0,
                            sourceWidth: 256,
                            sourceHeight: 256
                        })
                    }}
                    />


                    {generateButtons({slug:"advanced-view", buttons:buttons})}
                </UiEntity>


                {/* right container */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '75%',
                    height: '100%',
                    margin:{left:'2%'}
                }}
                // uiBackground={{color:Color4.Blue()}}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                }}
                // uiBackground={{color:Color4.Blue()}}
                uiText={{fontSize:sizeFont(25,20), textAlign:'middle-center', value:"Advanced Editing " + getName()}}
                />

                <ParentingPanel/>


                </UiEntity>

                {/* back button */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(2, getAspect(uiSizes.backButton)).width,
                        height: calculateImageDimensions(2, getAspect(uiSizes.backButton)).height,
                        positionType:'absolute',
                        position:{right:'2%', top:'0%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.backButton)
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        displayEditAdvancedPanel(false)
                        openEditComponent("")
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
  
                </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}

function getName(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let name = scene.names.get(selectedItem.aid)
            if(name){
                return name.value
            }else{
                let item = items.get(selectedItem.catalogId)
                return item?.n
            }
        }
        return ""
        
    }
    return ""
}

function ParentingPanel(){
    return(
        <UiEntity
        key={resources.slug + "advanced::parenting:panel::ui"}
            uiTransform={{
                display: advancedView === COMPONENT_TYPES.PARENTING_COMPONENT ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'center',
                width: '100%',
                height: '100%',
                margin:{top:"10%"}
            }}
            >

                {/* current parent row */}
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

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '30%',
                    height: '100%',
                }}
                uiText={{value:"Current Parent", fontSize:sizeFont(20,15), color:Color4.White()}}
                />


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
                        options={getEntities()}
                        selectedIndex={getParentIndex()}
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
                        width: '20%',
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
                        updateParent("parent", parentIndex)
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
                </UiEntity>

                </UiEntity>

        </UiEntity>
    )
}

function getEntities(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return []
        }
        let entities:any[] = []
        scene.parenting.forEach((item:any)=>{
            let assetName = scene.names.get(item.aid)
            if(item.aid !== selectedItem.aid){
                if(assetName){
                    let data:any = {...item}
                    data.name = assetName
                    entities.push(assetName.value) 
                }
            }
        })
        return entities
    }
    return []
}

function getParentIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return 0
        }
        for(let i = 0; i < scene.parenting.length; i++){
            let parent = scene.parenting[i]
            for(let j = 0; parent.children.length; j++){
                let child = parent.children[j]
                if(child === selectedItem.aid){
                    return i
                }
            }
        }
        return 0
    }
    return 0
}

function selectParentIndex(index:number){
    parentIndex = index
}

function updateParent(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.PARENTING_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}