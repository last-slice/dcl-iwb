
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../helpers'
import { visibleComponent } from './EditObjectDataPanel'
import { BLOCKCHAINS, COMPONENT_TYPES, EDIT_MODES, NFT_FRAMES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sendServerMessage } from '../../../components/messaging'
import { selectedItem } from '../../../components/modes/build'
import { log } from '../../../helpers/functions'

let fontStyles:string[] = [
    "Sans Serif",
    "Serif",
    "Monospace"
]

let textLabelAlignment:string[] = [
    "Top Left",
    "Top Center",
    "Top Right",
    "Middle Left",
    "Middle Center",
    "Middle Right",
    "Bottom Left",
    "Bottom Center",
    "Bottom Right",
]

let colorsLabels:string[] = [
    "Black",
    "Blue",
    "Gray",
    "Green",
    "Magenta",
    "Purple",
    "Red",
    "Teal",
    "Yellow",
    "White",
]

let colors:Color4[] = [
    Color4.Black(),
    Color4.Blue(),
    Color4.Gray(),
    Color4.Green(),
    Color4.Magenta(),
    Color4.Purple(),
    Color4.Red(),
    Color4.Teal(),
    Color4.Yellow(),
    Color4.White(),
]

let textAlignment:string[] = [
    'top-left' , 'top-center' , 'top-right' , 'middle-left' , 'middle-center' , 'middle-right' , 'bottom-left' , 'bottom-center' , 'bottom-right'
]


export function TextComponentPanel() {
    return (
        <UiEntity
            key={"edittextComponentPanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.TEXT_COMPONENT ? 'flex' : 'none',
            }}
        >


    {/* text row */}
    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"5%"}
            }}
        >

             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:"5%"}
            }}
        uiText={{value:"Text", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                updateText("text", value)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'text'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            value={selectedItem && selectedItem.enabled && selectedItem.itemData.textComp ? selectedItem.itemData.textComp.text : ""}
            />

        </UiEntity>

        </UiEntity>




            {/* style & size row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
            }}
        >

        {/* font style column */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
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
        uiText={{value:"Font Style", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '40%',
            }}
        >

                        <Dropdown
                    key={"font-style-dropdown"}
                    options={fontStyles}
                    selectedIndex={getFontStyle()}
                    onChange={selectFont}
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

        {/* font size column */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
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
        uiText={{value:"Font Size", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '40%',
            }}
        >

            <Input
            onChange={(value) => {
                updateText("fontSize", value)
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'fontsize'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            value={ "" + (selectedItem && selectedItem.enabled && selectedItem.itemData.textComp ? selectedItem.itemData.textComp.fontSize : "")}
            />

        </UiEntity>

        </UiEntity>


            </UiEntity>

            {/* aligntment & color row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '25%',
                margin:{top:"2%"}
            }}
        >

                {/* alignment row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
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
        uiText={{value:"Text Align", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                    key={"text-alignment-dropdown"}
                    options={textLabelAlignment}
                    selectedIndex={getTextAlign()}
                    onChange={selectTextAlign}
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

                {/* color row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
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
        uiText={{value:"Text Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                    key={"text-colors-dropdown"}
                    options={colorsLabels}
                    selectedIndex={getTextColor()}
                    onChange={selectColor}
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
    )
}


function getFontStyle(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.textComp ? fontStyles.findIndex((c)=> c === selectedItem.itemData.textComp.font) : 0
}

function getTextAlign(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.textComp ? selectedItem.itemData.textComp.align : 0
}

function getTextColor(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.textComp ? colors.findIndex((ta)=> ta.r === selectedItem.itemData.textComp.color.r && ta.g === selectedItem.itemData.textComp.color.g && ta.b === selectedItem.itemData.textComp.color.b) : 0
}

function selectColor(index: number) {
    if(index !== getTextColor()){
        updateText("color", colors[index])
    }    
}

function selectFont(index: number) {
    if(index !== getFontStyle()){
        updateText("font", index)
    }    
}

function selectTextAlign(index: number) {
    if(index !== getTextAlign()){
        updateText("align", index)
    }  
}

function updateText(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.TEXT_COMPONENT, action:"toggle", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}