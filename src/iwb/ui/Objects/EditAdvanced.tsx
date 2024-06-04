import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, calculateSquareImageDimensions, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { localPlayer } from '../../components/Player'
import { selectedItem } from '../../modes/Build'
import { colyseusRoom } from '../../components/Colyseus'
import { COMPONENT_TYPES } from '../../helpers/types'
import { generateButtons, setUIClicked } from '../ui'
import { items } from '../../components/Catalog'
import { openEditComponent } from './EditAssetPanel'

let show = false
let buttons:any[] = []
let advancedView:string = ""

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