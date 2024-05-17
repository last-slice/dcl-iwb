import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { playSound } from '@dcl-sdk/utils'
import { SOUND_TYPES } from '../../../../helpers/types'
import { calculateImageDimensions, getAspect, dimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions } from '../../../helpers'
import { uiSizes } from '../../../uiConfig'

export let show = false
export let showSetting = ""

export let buttons:any[] = [
    {label:"Trigger", pressed:false},
    {label:"Actions", pressed:false},
    {label:"States", pressed:false},
    {label:"Counter", pressed:false},
    {label:"Multiplayer", pressed:false},
    // {label:"Audio", pressed:false},
    // {label:"Dialog", pressed:false},
    // {label:"NPC", pressed:false},
]

export function updateAdvancedEditPanel(show?:boolean){
    console.log('updating advanced component')
    if(show){
        displayEditAdvancedPanel(true)
    }
}

export function displayEditAdvancedPanel(value: boolean) {
    show = value
}

// export function displaySetting(value:string){
//     showSetting = value
// }

export function createAdvancedEditPanel() {
    return (
        <UiEntity
            key={"iwb-edit-advanced-panel"}
            uiTransform={{
                display: show ? 'flex' : 'none',
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
                // uiBackground={{color:Color4.Green()}}
                >


                    {/* left column container */}
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

                    {/* edit item image */}
                    <UiEntity
                        uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(15).width,
                        height: calculateSquareImageDimensions(15).height,
                        }}
                        uiBackground={{color:Color4.White()}}
                    />


                    {generateSettingsButtons(buttons)}


                    </UiEntity>

                    {/* right column container */}
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


                    {/* edit item title */}
                    <UiEntity
                        uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '5%'
                        }}
                        // uiBackground={{color:Color4.Black()}}
                        uiText={{value:"Advanced Edit: Item Name", fontSize:sizeFont(25,20), color:Color4.White()}}
                    />
                        
                    </UiEntity>

                </UiEntity>

            </UiEntity>

        </UiEntity>
    )
}

function generateSettingsButtons(buttons:any[]){
    let arr:any[] = []
    buttons.forEach((button, i:number)=>{
        arr.push(
        <UiEntity
        key={button.label + "-settings"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(7,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState(button.label)
        }}
        onMouseDown={() => {
            playSound(SOUND_TYPES.WOOD_3)
            disablePress()
            buttons[i].pressed = true
        }}
        // onMouseUp={()=>{
        //     buttons[i].pressed = false
        // }}
        uiText={{value: button.label, color:Color4.White(), fontSize:sizeFont(30,20)}}
        />)
    })
    return arr
}

function disablePress(){
    buttons.forEach((button)=>{
        button.pressed = false
    })
}

function getButtonState(button:string){
    if(showSetting === button || buttons.find((b:any)=> b.label === button).pressed){
        return getImageAtlasMapping(uiSizes.buttonPillBlue)
    }else{
        return getImageAtlasMapping(uiSizes.buttonPillBlack)
    }
}