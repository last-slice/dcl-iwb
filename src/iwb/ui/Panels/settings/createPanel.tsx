import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { createTempScene } from '../../../components/modes/create'
import { displayCreateScenePanel } from '../CreateScenePanel'
import { SCENE_MODES } from '../../../helpers/types'

let pressed:any ={
    Save:false,
    Load:false
}

let scene:any = {
    name: "",
    description:""
}

export function CreateScenePanel() {
    return (
        <UiEntity
            key={"createnewscenepanel"}
            uiTransform={{
                display: showSetting === "Create" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

            {/* create scene label */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Create New Scene", fontSize:sizeFont(30,20), textAlign:'middle-center',color:Color4.Black()}}
            />

            {/* create scene name input */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            >

            <Input
                onChange={(e) =>{ scene.name = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"Enter Scene Name"}
                placeholderColor={Color4.Gray()}
            />
            </UiEntity>


            {/* create scene description input */}
                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '15%',
            }}
            // uiBackground={{color:Color4.Green()}}
            >

            <Input
                onChange={(e) =>{ scene.description = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"Enter Scene Description"}
                placeholderColor={Color4.Gray()}
            />
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

            {/* create button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.blueButton)).width,
            height: calculateImageDimensions(12,getAspect(uiSizes.blueButton)).height,
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
            //validate input//
            createTempScene(scene.name, scene.description)
            displaySettingsPanel(false)
            displaySetting("Explore")
            displayCreateScenePanel(true)
        }}
        uiText={{value: "Create", color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>


        
        </UiEntity>
    )
}