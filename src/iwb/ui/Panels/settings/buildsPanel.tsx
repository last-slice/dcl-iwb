import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { displayDeleteBuildPanel } from '../deleteBuildPanel'
import { localUserId, players } from '../../../components/player/player'
import { formatDollarAmount } from '../../../helpers/functions'

let pressed:any ={
    Save:false,
    Load:false
}

export function BuildsPanel() {
    return (
        <UiEntity
            key={"mybuildspanel"}
            uiTransform={{
                display: showSetting === "Builds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            <UiEntity
            uiTransform={{
                display: showSetting === "Builds" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '70%',
                positionType:'absolute'
            }}
            uiBackground={{color:Color4.Gray()}}
            />

            {/* header row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Blue()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping({
                    atlasHeight: 1024,
                    atlasWidth: 1024,
                    sourceTop: 801,
                    sourceLeft: 802,
                    sourceWidth: 223,
                    sourceHeight: 41
                })
            }}
            
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Parcel Count", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Size", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Poly Count", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Visit", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
            />



        </UiEntity>

            {/* builds row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '60%',
            }}
            // uiBackground={{color:Color4.Yellow()}}
        >


            {generateBuildRows()}



        </UiEntity>

            {/* buttons row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.Black()}}
        >

            {/* save button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
            height: calculateImageDimensions(12,getAspect(uiSizes.rectangleButton)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState('Save')
        }}
        onMouseDown={() => {
            // pressed.Save = true
        }}
        onMouseUp={()=>{
            // pressed.Save = false
        }}
        uiText={{value: "Save", color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

        {/* load button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.rectangleButton)).width,
            height: calculateImageDimensions(12,getAspect(uiSizes.rectangleButton)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState('Load')
        }}
        onMouseDown={() => {
            // pressed.Load = true
            displaySettingsPanel(false)
            displayDeleteBuildPanel(true)
        }}
        onMouseUp={()=>{
            // pressed.Load = false
        }}
        uiText={{value: "Load", color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>


        
        </UiEntity>
    )
}

function getButtonState(button:string){
    if(pressed[button]){
        return getImageAtlasMapping({
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 923,
            sourceLeft: 579,
            sourceWidth: 223,
            sourceHeight: 41
        })
    }else{
        return getImageAtlasMapping({
            atlasHeight: 1024,
            atlasWidth: 1024,
            sourceTop: 801,
            sourceLeft: 802,
            sourceWidth: 223,
            sourceHeight: 41
        })
    }
}

function generateBuildRows(){
    let arr:any[] = []
    if(localUserId){
        let player = players.get(localUserId)
        player!.scenes.forEach((scene:any, i:number)=>{
            arr.push(
            <UiEntity
            key={"build row - " + scene.id}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                display:'flex'
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.normalButton)

                : //

                getImageAtlasMapping(uiSizes.normalLightestButton)
            }}
            >

            {/* scene name */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'flex-start',
                width: '30%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: scene.n, fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.Black()}}
            />

            {/* scene parcel count */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + scene.pcnt, fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            {/* scene parcel size */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + scene.si + "MB", fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            {/* scene poly count */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
                display:'flex'
            }}
            uiText={{value: "" + formatDollarAmount(scene.pc), fontSize:sizeFont(20,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            {/* save button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10%',
            height: '80%',
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.positiveButton)
        }}
        onMouseDown={() => {
            // pressed.Save = true
        }}
        onMouseUp={()=>{
            // pressed.Save = false
        }}
        uiText={{value: "Go", color:Color4.Black(), fontSize:sizeFont(20,15)}}
        />



                </UiEntity>
                )
        })
    }

    return arr
}