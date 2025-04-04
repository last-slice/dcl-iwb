import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../../helpers/resources'
import { calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'
import { updateActionData } from '../EditAction'

let modifiers:any = {
    disableAll:false,
    disableWalk:false,
    disableRun:false,
    disableJog:false,
    disableJump:false,
    disableEmote:false
}

let inputModifiers:string[] = []

export function resetInputModifierActionPanel(){
    modifiers = {
        disableAll:false,
        disableWalk:false,
        disableRun:false,
        disableJog:false,
        disableJump:false,
        disableEmote:false
    }
    inputModifiers.length = 0
}

export function AddInputModifierActionPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::input::modifier::panel"}
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
            flexDirection: 'row',
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
            width: '70%',
            height: '100%',
        }}
        uiText={{value:"Disable All", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: modifiers.disableAll ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(inputModifiers.includes('disableAll')){
                        modifiers.disableAll = false
                        inputModifiers.splice(inputModifiers.findIndex($=> $ === "disableAll"),1)
                    }else{
                        modifiers.disableAll = true
                        inputModifiers.push("disableAll")
                    }
                    updateActionData({actions:[...inputModifiers]})
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
            </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'row',
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
            width: '70%',
            height: '100%',
        }}
        uiText={{value:"Disable Emote", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: modifiers.disableEmote ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(inputModifiers.includes('disableEmote')){
                        modifiers.disableEmote = false
                        inputModifiers.splice(inputModifiers.findIndex($=> $ === "disableEmote"),1)
                    }else{
                        modifiers.disableEmote = true
                        inputModifiers.push("disableEmote")
                    }
                    updateActionData({actions:[...inputModifiers]})
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
            </UiEntity>

    </UiEntity>

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
            flexDirection: 'row',
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
            width: '70%',
            height: '100%',
        }}
        uiText={{value:"Disable Walk", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: modifiers.disableWalk ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(inputModifiers.includes('disableWalk')){
                        modifiers.disableWalk = false
                        inputModifiers.splice(inputModifiers.findIndex($=> $ === "disableWalk"),1)
                    }else{
                        modifiers.disableWalk = true
                        inputModifiers.push("disableWalk")
                    }
                    updateActionData({actions:[...inputModifiers]})
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
            </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'row',
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
            width: '70%',
            height: '100%',
        }}
        uiText={{value:"Disable Run", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: modifiers.disableRun ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(inputModifiers.includes('disableRun')){
                        modifiers.disableRun = false
                        inputModifiers.splice(inputModifiers.findIndex($=> $ === "disableRun"),1)
                    }else{
                        modifiers.disableRun = true
                        inputModifiers.push("disableRun")
                    }
                    updateActionData({actions:[...inputModifiers]})
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
            </UiEntity>

    </UiEntity>

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
            flexDirection: 'row',
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
            width: '70%',
            height: '100%',
        }}
        uiText={{value:"Disable Jog", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: modifiers.disableJog ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(inputModifiers.includes('disableJog')){
                        modifiers.disableJog = false
                        inputModifiers.splice(inputModifiers.findIndex($=> $ === "disableJog"),1)
                    }else{
                        modifiers.disableJog = true
                        inputModifiers.push("disableJog")
                    }
                    updateActionData({actions:[...inputModifiers]})
                    setUIClicked(false) 
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
            </UiEntity>

    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'row',
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
            width: '70%',
            height: '100%',
        }}
        uiText={{value:"Disable Jump", fontSize:sizeFont(20,15), textAlign:'middle-left', textWrap:'nowrap'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(4).width,
                    height: calculateSquareImageDimensions(4).height,
                    margin:{top:"1%", bottom:'1%'},
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: modifiers.disableJump ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    if(inputModifiers.includes('disableJump')){
                        modifiers.disableJump = false
                        inputModifiers.splice(inputModifiers.findIndex($=> $ === "disableJump"),1)
                    }else{
                        modifiers.disableJump = true
                        inputModifiers.push("disableJump")
                    }
                    updateActionData({actions:[...inputModifiers]})
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />
            </UiEntity>

    </UiEntity>

        </UiEntity>



    </UiEntity>
    )
}