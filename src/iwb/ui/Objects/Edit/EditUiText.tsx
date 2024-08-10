import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources, { colors } from '../../../helpers/resources'
import { COMPONENT_TYPES, EDIT_MODES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { visibleComponent } from '../EditAssetPanel'
import { UiTexts } from '../../../components/UIText'
import { selectedItem } from '../../../modes/Build'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { showNotification } from '../NotificationPanel'

let dataEntities:any[] = []
let selectedEntityIndex:number = 0

export function showUIText(){
    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return 
        }
    
        let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
        if(uiTextInfo){
            console.log('setting text', uiTextInfo)
            uiText.setText("" + uiTextInfo.label)
            uiText.show()

            console.log('ui text is', uiText)
        }
        getEntities()

        let index = dataEntities.findIndex(($:any)=> $.aid === uiTextInfo.aid)
        if(index >=0){
            selectedEntityIndex = index
        }else{
            selectedEntityIndex = 0
        }
        console.log('index is', index, selectedEntityIndex)
    }
}

export function hideUIText(){
    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        uiText.hide()
    }
    dataEntities.length = 0
}

export function EditUiText() {
    return (
        <UiEntity
            key={resources.slug + "edit::uitext::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ? 'flex' : 'none',
            }}
            >

            {/* ui style row */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                }}
                >
                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50%',
                    height: '100%',
                    margin:{right:"2%"}
                }}
                >
                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '20%',
                        margin:{bottom:'5%'}
                    }}
                    uiText={{value: "UI Style", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
                />

                <Dropdown
                    options={["SDK", "Asset Pack"]}
                    selectedIndex={
                        selectedItem && 
                        selectedItem.enabled && 
                        visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ?
                        getUiVariable("style") : 0
                    }
                    onChange={selectUiStyle}
                    uiTransform={{
                        width: '100%',
                        height: '50%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}//
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
                    margin:{left:"2%"}
                }}
                >
                    <AssetPackStyle/>
                </UiEntity>

            </UiEntity>


            {/* text label && data row */}
            <TextLabelSizeRow/>
            <TextDataRow/>

{/* positioning row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
>
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '25%',
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
            uiText={{value: "Position (%)", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />
    </UiEntity>

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
            height: '50%',
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
    value: "Clear",
    fontSize: sizeFont(25, 15),
    color: Color4.White(),
    textAlign: 'middle-center'
}}
onMouseDown={() => {
    setUIClicked(true)
    clearUiPosition()
}}
onMouseUp={()=>{
    setUIClicked(false)
}}
/>

</UiEntity>
    </UiEntity>


</UiEntity>

    {/* positioning row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '15%',
    }}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
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
    margin:{bottom:"7%"}
}}
uiText={{value: "Top", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Top Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {
        updateUiPosition("top", input)
    }}
/>

</UiEntity>

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
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
    margin:{bottom:"7%"}
}}
uiText={{value: "Bottom", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Bottom Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {
        updateUiPosition("bottom", input)
    }}
/>

</UiEntity>

    </UiEntity>
    
    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
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
    margin:{bottom:"7%"}
}}
uiText={{value: "Left", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Left Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {//
        updateUiPosition("left", input)
    }}
/>

</UiEntity>

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
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
    margin:{bottom:"7%"}
}}
uiText={{value: "Right", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
}}
>

<Input
    uiTransform={{
        width: '80%',
        height: '120%',
    }}
    placeholder={"Right Position"}
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
    textAlign='middle-center'
    onChange={(input) => {
        updateUiPosition("right", input)
    }}
/>

</UiEntity>

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
    value: "Update",
    fontSize: sizeFont(25, 15),
    color: Color4.White(),
    textAlign: 'middle-center'
}}
onMouseDown={() => {
    setUIClicked(true)
    updateUi()
    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "UI Text updated!", animate:{enabled:true, return:true, time:3}})
}}
onMouseUp={()=>{
    setUIClicked(false)
}}
/>
</UiEntity>
            
        </UiEntity>
    )
}

function AssetPackStyle(){
    return(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display: selectedItem && 
            selectedItem.enabled && 
            visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ?
            getUiVariable("style") === 1 ? "flex" : "none" 
            : "none"
        }}
        >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '20%',
        margin:{bottom:'3%', top:"2%"}
    }}
    uiText={{value: "Select Asset Pack", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>

<Dropdown
    options={["IWB Font"]}
    selectedIndex={
        0
        // selectedItem && 
        // selectedItem.enabled && 
        // visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ?
        // getUiStyle() : 0
    }
    onChange={selectAssetPack}
    uiTransform={{
        width: '100%',
        height: '50%',
    }}
    // uiBackground={{color:Color4.Purple()}}//
    color={Color4.White()}
    fontSize={sizeFont(20, 15)}
/>
    </UiEntity>
    )
}

function TextLabelSizeRow(){
    return(
        <UiEntity
        key={resources.slug + "edit::ui::text::label::row"}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            margin:{right:"2%"}
        }}
        >
     <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Text Label", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Input
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            placeholderColor={Color4.White()}
            placeholder={"" + (
                selectedItem && 
                selectedItem.enabled && 
                visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ?
                getUiVariable("label") : ""
            )}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            textAlign='middle-center'
            onChange={(value:string) => {
                updateUiTextLabel(value)
            }}
        />
    </UiEntity>

        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            margin:{left:"2%"}
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Text Size", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Input
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            placeholderColor={Color4.White()}
            placeholder={"" + (
                selectedItem && 
                selectedItem.enabled && 
                visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ?
                getUiVariable("size") : ""
            )}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
            textAlign='middle-center'
            onChange={(input) => {
                updateUiSize(input)
            }}
        />
    </UiEntity>


        </UiEntity>

    </UiEntity>
    )
}

function TextDataRow(){
    return(
        <UiEntity
        key={resources.slug + "edit::ui::text::size::row"}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
        >
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            margin:{right:"2%"}
        }}
        >

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Text Data", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Dropdown
            options={["None", "State", "Counter", "Start Countdown"]}
            selectedIndex={
                selectedItem && 
                selectedItem.enabled && 
                visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT ?
                getUiVariable("type") : 0
            }
            onChange={selectUiType}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />
    </UiEntity>

        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
            margin:{left:"2%"},
        }}
        >

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:                         
            selectedItem && 
            selectedItem.enabled && 
            visibleComponent === COMPONENT_TYPES.UI_TEXT_COMPONENT &&
            (getUiVariable("type") !== 0 || getUiVariable("type") !== 3 ) ? "flex" : "none"
        }}
        >
            
    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:"7%"}
        }}
        uiText={{value: "Select Entity", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
        />

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
        }}
    >
        <Dropdown
            options={dataEntities.map((data:any)=> data.name)}
            selectedIndex={selectedEntityIndex}
            onChange={selectDataEntity}
            uiTransform={{
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Purple()}}//
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />
    </UiEntity>
    </UiEntity>

        </UiEntity>

    </UiEntity>
    )
}

function selectUiStyle(index:number){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        uiTextInfo.style = index

        let uiText = UiTexts.get(selectedItem.aid)

        if(uiText){
            uiText.style = index
        }

        if(index === 1){
            uiTextInfo.src = "13b63e57-a636-4cf2-8449-488a5fd6d03e"
            if(uiText){
                uiText.spriteSheet = "assets/" + uiTextInfo.src + ".png"
                uiText.resetDigits()
            }
        }
    }
}

function selectAssetPack(index:number){

}

function selectUiType(index:number){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        uiTextInfo.type = index

        let uiText = UiTexts.get(selectedItem.aid)
        if(uiText){
            uiText.sceneId = scene.id
            uiText.aid = selectedItem.aid
            uiText.type = index
        }

        if(index > 0){
            getEntities()
        }
    }
}

function getEntities(){
    dataEntities.length = 0

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(!uiTextInfo){
        return
    }

    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((entity:any)=>{
        if(!["0", "1", "2"].includes(entity.aid)){
            if(uiTextInfo.type === 0){
            }
            else if(uiTextInfo.type === 1){
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

    scene[COMPONENT_TYPES.GAME_COMPONENT].forEach((gameComponent:any, aid:string)=>{
        console.log('game component is', gameComponent)
        if(gameComponent.type === 'MULTIPLAYER'){
            dataEntities.push({name: "Start Countdown", aid:aid})
        }
    })
}

function selectDataEntity(index:number){
    selectedEntityIndex = index
}

function getUiVariable(variable:any){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return -500
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo && uiTextInfo[variable]){
        return uiTextInfo[variable]
    }
    return -500
}

function updateUiSize(value:string){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let size = parseInt(value.trim())

    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        uiText.size = size
        uiText.setText(uiText.currentText, uiText.currentTextData)
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        uiTextInfo.size = size
    }
}

function updateUiTextLabel(value:string){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        uiText.setText(value.trim())
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        uiTextInfo.label = value.trim()
    }
}

function updateUiPosition(type:string, value:any){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        switch(type){
            case 'top':
                uiTextInfo.pt = parseInt(value.trim())
                break;

            case 'bottom':
                uiTextInfo.pb = parseInt(value.trim())
                break;

            case 'left':
                uiTextInfo.pl = parseInt(value.trim())
                break;

            case 'right':
                uiTextInfo.pr = parseInt(value.trim())
                break;
        }
    }

    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        if(!uiText.position){
            uiText.position = {}   
        }
        uiText.position[type] = `${value.trim()}%`
    }
}

function clearUiPosition(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return -500
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        uiTextInfo.pt = undefined
        uiTextInfo.pr = undefined
        uiTextInfo.pl = undefined
        uiTextInfo.pb = undefined
    }

    let uiText = UiTexts.get(selectedItem.aid)
    if(uiText){
        delete uiText.position
    }
    console.log(uiText)
}

function updateUi(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return -500
    }

    let uiTextInfo = scene[COMPONENT_TYPES.UI_TEXT_COMPONENT].get(selectedItem.aid)
    if(uiTextInfo){
        let data = {...uiTextInfo}
        if(dataEntities[selectedEntityIndex]){
            data.aid = dataEntities[selectedEntityIndex].aid
        }
        
        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            {
                component:COMPONENT_TYPES.UI_TEXT_COMPONENT, 
                aid:selectedItem.aid, sceneId:selectedItem.sceneId,
                data: data
            }
        )
    }
}