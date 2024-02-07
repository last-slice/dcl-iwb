import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../ui/helpers'
import { uiSizes } from '../../../ui/uiConfig'
import { Color4 } from '@dcl/sdk/math'
import { attemptSignup, canSignup, competitionScenes, enabled, getEnabled, updateUI, votes, voting } from './BuildCompetition'
import resources from '../../../helpers/resources'
import { localUserId } from '../../player/player'

let showSplash = false

export function displaySplash(value:boolean){
    showSplash = value
}

export function createBuildCompeitionUI(){
    return (
        <UiEntity
            key={"customui-build-competition"}
            uiTransform={{
                display: getEnabled() ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position:{left:'0%', top:'0%'}
            }}
        >
                {/* splash info  */}
            <UiEntity
            uiTransform={{
                display: showSplash ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(65, 2680/1500).width,
                height: calculateImageDimensions(40, 2680/1500).width,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(65,  2680/1500).width) / 2, bottom:'5%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/competition.png'
                },
            }}
            onMouseDown={()=>{
                displaySplash(false)
                updateUI()
            }}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: calculateImageDimensions(13, getAspect(uiSizes.vertRectangle)).width,
                height: calculateImageDimensions(13, getAspect(uiSizes.vertRectangle)).width,
                positionType: 'absolute',
                position:{left:resources.DEBUG ? '20%' : '2%', top:'0%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'//
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
            }}
        >

            <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'10%'}
            }}
            uiText={{value:"Build Competition", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'10%'}
            }}
            uiText={{value:"Starts February 8th!", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

    <UiEntity
            uiTransform={{
                display:'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:'5%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value:"Details", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                displaySplash(true)
                updateUI()
            }}
        />

<UiEntity
            uiTransform={{
                display: canSignup && localUserId && !competitionScenes.find((scene:any)=> scene.builder === localUserId) ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(4,getAspect(uiSizes.buttonPillBlue)).height,
                margin:{top:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{value:"Signup", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
            onMouseDown={()=>{
                attemptSignup()
            }}
        />

        <UiEntity
            uiTransform={{
                display: voting ? 'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(8, getAspect(uiSizes.rectangleButton)).width,
                height: calculateImageDimensions(15,getAspect(uiSizes.rectangleButton)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiText={{value:"Your Votes: " + votes + "/3", fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

        </UiEntity>

        </UiEntity>
    )
}