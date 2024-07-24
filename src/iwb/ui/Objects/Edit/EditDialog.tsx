
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked, setupUI } from '../../ui'
import { uiSizes } from '../../uiConfig'

let dialogData:any = {}
export let dialogView:string = "main"

export function updateDialog(){
    dialogView = "main"
    dialogData = {}

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    dialogData = scene[COMPONENT_TYPES.DIALOG_COMPONENT].get(selectedItem.aid)
}

export function updateDialogView(view:string){
    dialogView = view

    if(view === "add"){
        dialogData = {}
        dialogData.text = ""
    }
}

export function EditDialog() {
    return (
        <UiEntity
            key={resources.slug + "edit::dialog::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.DIALOG_COMPONENT ? 'flex' : 'none',
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: dialogView === "main" ? "flex" : "none"
            }}
        >
            <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                        margin:{bottom:'1%'}
                    }}
                    >
                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '75%',
                        height: '100%',
                    }}
                    >

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        uiText={{value:"Add Dialog", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                        />

                        </UiEntity>

                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                        margin:{left:'1%'}
                    }}
                    >
                                <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf:'flex-start',
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
                            dialogView = "add"
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
            margin:{bottom:'2%'}
        }}
        uiText={{value:"Current Dialogs", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />


        </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: dialogView === "add" ? "flex" : "none"
            }}
        >
             <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                        margin:{bottom:'1%'}
                    }}
                    >
                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '75%',
                        height: '100%',
                    }}
                    >

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        uiText={{value:"Add Dialog Text", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                        />

                        </UiEntity>

                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                        margin:{left:'1%'}
                    }}
                    >
                                <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf:'flex-start',
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
                            updateDialogView("add")
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
            }}
            >

            <Input
                onChange={(value) => {
                    dialogData.text = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'' + (dialogData && dialogData.text)}
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
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                        margin:{bottom:'1%'}
                    }}
                    >
                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '75%',
                        height: '100%',
                    }}
                    >

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        uiText={{value:"Add Buttons", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                        />

                        </UiEntity>

                        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                        height: '100%',
                        margin:{left:'1%'}
                    }}
                    >
                                <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf:'flex-start',
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
                            updateDialogView("add")
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)
                        }}
                    />
                        </UiEntity>

            </UiEntity>
        {/* {selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.DIALOG_COMPONENT && getAssetStates()} */}


        </UiEntity>
        
        </UiEntity>
    )
}

export function Row(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "-edit-state-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '7%',
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
                width: '40%', 
                height: '100%',
                margin:{left:'1%'}
            }}
            uiText={{value:"" + data.value, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"" + (data.default ? "Default" : "Set Default"), textAlign:'middle-center', fontSize:sizeFont(20,15), color:Color4.White()}}
            onMouseDown={()=>{
                setUIClicked(true)
                if(!data.default){
                    update("default", {default:data.value})
                }
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            >
            </UiEntity>

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
                    setUIClicked(true)
                    update("delete", {value:data.value})
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function update(action:string, data:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.STATE_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            action:action,
            data:data,
        }
    )
}