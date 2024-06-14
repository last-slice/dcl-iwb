import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import resources, { colors } from '../../helpers/resources'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, calculateSquareImageDimensions, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { selectedItem } from '../../modes/Build'
import { colyseusRoom, sendServerMessage } from '../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { generateButtons, setUIClicked } from '../ui'
import { items } from '../../components/Catalog'
import { openEditComponent } from './EditAssetPanel'
import { EditParenting } from './Advanced/EditParenting'
import { AddAdvancedComponent } from './Advanced/AddAdvancedComponent'

let show = false
export let buttons:any[] = []
export let advancedView:string = ""

export function displayEditAdvancedPanel(value:boolean, toggle?:boolean){
    show = value
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
            buttons.push({
                label:'Add', 
                pressed:false, 
                width:8,
                height:5,
                func:()=>{
                    updateAdvancedView("Add")
                }
            })
            
            buttons.push({
                label:COMPONENT_TYPES.PARENTING_COMPONENT, 
                pressed:false, 
                width:8,
                height:5,
                func:()=>{
                    updateAdvancedView(COMPONENT_TYPES.PARENTING_COMPONENT)
                }
            })
        }
    }
}

function generateAdvancedButtons(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return []
    }

    let buttons:any[] = []
    buttons.push({
        label:'Add', 
        pressed:false, 
        width:8,
        height:5,
        func:()=>{
            updateAdvancedView("Add")
        }
    })

    let advancedComponents = [...Object.values(COMPONENT_TYPES)].splice(-8).filter(item => scene.components.includes(item))
    advancedComponents.forEach((component:string)=>{
        buttons.push({
            label:component, 
            pressed:false, 
            width:8,
            height:5,
            func:()=>{
                updateAdvancedView(component)
            }
        })
    })
    return buttons
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

                    {
                    generateButtons({
                        slug:"advanced-view", 
                        buttons: !selectedItem || !selectedItem.enabled ? [] :
                        generateAdvancedButtons()
                        })
                    }
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

                <AddAdvancedComponent/>
                <EditParenting/>


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
            let name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(selectedItem.aid)
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