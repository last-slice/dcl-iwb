import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { displaySetting, displaySettingsPanel, showSetting } from './settingsIndex'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { createTempScene } from '../../../components/modes/create'
import { displayCreateScenePanel } from '../CreateScenePanel'
import { formatSize } from '../../../helpers/functions'

let scene:any = {
    name: "",
    description:"",
    image:"",
    enabled:true,
    priv:false
}

let settings:any[] = [
    {label:"Scene Enabled", enabled:true},
    {label:"Scene Private", enabled:false},
]

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
            uiText={{value:"Create New Scene", fontSize:sizeFont(30,20), textAlign:'middle-center',color:Color4.White()}}
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
                placeholderColor={Color4.White()}
                color={Color4.White()}
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
                placeholderColor={Color4.White()}
                color={Color4.White()}
            />
            </UiEntity>


            {/* create scene image input */}
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
                onChange={(e) =>{ scene.image = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"Enter Scene Image"}
                placeholderColor={Color4.White()}
                color={Color4.White()}
            />
            </UiEntity>


            {/* create scene enabled container */}
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


            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Enabled", fontSize:sizeFont(30,20), color:Color4.White()}}
           />

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
            uvs: getButtonState("Scene Enabled")
        }}
        onMouseDown={() => {
            settings.find((set:any)=>set.label === "Scene Enabled").enabled = !settings.find((set:any)=>set.label === "Scene Enabled").enabled 
            scene.enabled = settings.find((set:any)=>set.label === "Scene Enabled").enabled
        }}
        />


            </UiEntity>



            {/* create scene public container */}
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


            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Private", fontSize:sizeFont(30,20), color:Color4.White()}}
           />

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
            uvs: getButtonState("Scene Private")
        }}
        onMouseDown={() => {
            settings.find((set:any)=>set.label === "Scene Private").enabled = !settings.find((set:any)=>set.label === "Scene Private").enabled 
            scene.priv = settings.find((set:any)=>set.label === "Scene Private").enabled
        }}
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
            // uiBackground={{color:Color4.White()}}
        >

            {/* create button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(8,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            createTempScene(scene.name, scene.description, scene.image, scene.enabled, scene.priv)
            displaySettingsPanel(false)
            displaySetting("Explore")
            displayCreateScenePanel(true)
        }}
        uiText={{value: "Create", color:Color4.White(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>


        
        </UiEntity>
    )
}

function getButtonState(button:string){
    if(settings.find((b:any)=> b.label === button).enabled){
        return getImageAtlasMapping(uiSizes.toggleOnTrans)
    }else{
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }//
}