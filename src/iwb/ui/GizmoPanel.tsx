import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont, uiSizer } from './helpers'
import { selectedItem, sendServerEdit, toggleEditModifier, toggleModifier, transformObject } from '../components/modes/build'
import { uiSizes } from './uiConfig'
import { EDIT_MODES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../helpers/types'
import { sendServerMessage } from '../components/messaging'

export let showGizmoPanel = false

let pressed:any ={

}

export function displaySaveBuildPanel(value: boolean) {
    showGizmoPanel = value
}

export function createGizmoPanel() {
    return (
        <UiEntity
            key={"gizmopanel"}
            uiTransform={{
                display: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT ? 'flex' : 'none',
                // display:"flex",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .1,
                height: dimensions.height * .2,
                positionType: 'absolute',
                position: { right: '4%', bottom:'2%' }
            }}
        // uiBackground={{ color: Color4.Red() }}
        >

            {/* top row */}
                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.upArrow)
                    }}
                    onMouseDown={()=>{
                        sendServerEdit('y', 1)

                        pressed.left = true
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.upCarot)
                    }}
                    onMouseDown={()=>{
                        sendServerEdit('z', 1)
                        pressed.left = true
                    }}
                    />

                    


        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    // uiBackground={{
                    //     textureMode: 'stretch',
                    //     texture: {
                    //         src: 'assets/atlas2.png'
                    //     },
                    //     uvs: getImageAtlasMapping(uiSizes.upArrow)
                    // }}
                    uiText={{value: "" + (selectedItem && selectedItem.enabled ? selectedItem.factor : ""), fontSize:sizeFont(15,12)}}
                    />




                </UiEntity>

           {/* middle row */}
           <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(getIcon('left'))
                    }}
                    onMouseDown={()=>{
                        sendServerEdit('x', -1)
                        pressed.left = true
                    }}
                    onMouseUp={()=>{
                        pressed.left = false
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(getModifierIcon())
                    }}
                    onMouseDown={()=>{
                        toggleEditModifier()
                        pressed.modifer = true
                    }}
                    onMouseUp={()=>{
                        pressed.modifer = false
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.rightCarot)
                    }}
                    onMouseDown={()=>{
                        sendServerEdit('x', 1)
                        pressed.left = true
                    }}
                    />



                </UiEntity>         


{/* bottom row */}
           <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '30%',
                        margin:{top:'2%'}
                    }}
                    // uiBackground={{color:Color4.Green()}}
                >

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.downArrow)
                    }}
                    onMouseDown={()=>{
                        sendServerEdit('y', -1)
                        pressed.down = true
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                        margin:{right:'2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.downCarot)
                    }}
                    onMouseDown={()=>{
                        sendServerEdit('z', -1)
                        pressed.left = true
                    }}
                    />

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(5).width,
                        height:  calculateSquareImageDimensions(5).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas1.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.magnifyIcon)
                    }}
                    onMouseDown={()=>{
                        toggleModifier()
                    }}
                    />



                </UiEntity>   

        </UiEntity>
    )
}

function getIcon(type:string){
    switch(type){
        case 'left':
            if(pressed.type){
                return uiSizes.leftCarotPressed
            }else{
                return uiSizes.leftCarot
            }
    }
}//

function getModifierIcon(){
    if(selectedItem && selectedItem.enabled){
        switch(selectedItem.modifier){
            case EDIT_MODIFIERS.POSITION:
                if(pressed.modifer){
                    return uiSizes.positionIconPressed
                }else{
                    return uiSizes.positionIcon
                }

            case EDIT_MODIFIERS.ROTATION:
                if(pressed.modifer){
                    return uiSizes.rotationIconPressed
                }else{
                    return uiSizes.rotationIcon
                }

            case EDIT_MODIFIERS.SCALE:
                if(pressed.modifer){
                    return uiSizes.scaleIconPressed
                }else{
                    return uiSizes.scaleIcon
                }
        }
    }else{
        return ""
    }
}