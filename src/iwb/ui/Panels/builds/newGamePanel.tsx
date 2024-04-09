import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { buildInfoTab, displaySceneInfoPanel, scene } from './buildsIndex'
import { localPlayer } from '../../../components/player/player'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { displaySetting, displaySettingsPanel } from '../settings/settingsIndex'
import { addGameLobby } from '../../../components/modes/gaming'

export let newGame = {
    name:"",
    desc:"",
    type:1
}

let valid = false

function validationCheck(){
    if(newGame.name !== "" && newGame.desc !== "" && newGame.type !== -1){
        valid = true
    }else{
        valid = false
    }
}

export function NewGamePanel() {
    return (
        <UiEntity
            key={"iwbnewgamingpanel"}
            uiTransform={{
                display:'flex',
                // display: localPlayer && localPlayer.activeScene && !localPlayer.activeScene.game ? 'flex' : 'none',
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
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
            uiText={{value:"Create a new Game!", fontSize: sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '7%',
            }}
            uiText={{value:"Game Name", fontSize: sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        >

            <Input
        onChange={(value)=>{
            newGame.name = value.trim()
            validationCheck()
        }}
        fontSize={sizeFont(20,13)}
        placeholder={'Enter Game Name'}
        placeholderColor={Color4.White()}
        uiTransform={{
            width: '85%',
            height: '80%',
        }}
        color={Color4.White()}
        />
        
        </UiEntity>

    <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '7%',
            }}
            uiText={{value:"Game Description", fontSize: sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
        />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
            }}
        >

            <Input
        onChange={(value)=>{
            newGame.desc = value.trim()
            validationCheck()
        }}
        fontSize={sizeFont(20,13)}
        placeholder={'Enter Game Description'}
        placeholderColor={Color4.White()}
        uiTransform={{
            width: '85%',
            height: '80%',
        }}
        color={Color4.White()}
        />
        
        </UiEntity>


        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '7%',
            }}
            uiText={{value:"Game Type", fontSize: sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
        />


            {/* template container */}
    <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '35%',
            }}
            uiBackground={{color:Color4.Blue()}}
        />

                    {/* button container */}
    <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                height: '15%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
                display: valid ? "flex" : "none"
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value: "Create", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                displaySceneInfoPanel(false, null)
                displaySettingsPanel(false)
                displaySetting("Explore")
                addGameLobby()
            }}
            />

        </UiEntity>



    </UiEntity>



    )
}