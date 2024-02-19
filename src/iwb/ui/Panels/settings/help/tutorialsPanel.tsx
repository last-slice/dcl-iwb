import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { statusView } from '../StatusPanel'
import { helpView, updateHelpView } from './helpPanelMain'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { uiSizes } from '../../../uiConfig'
import { displayStatusView } from '../settingsPanel'
import { displaySettingsPanel } from '../settingsIndex'
import { displayTutorialVideoControls } from '../../../tutorialVideoControlPanel'
import { createTutorialVideo, iwbConfig } from '../../../../components/player/player'
import { paginateArray } from '../../../../helpers/functions'
import { playSound } from '../../../../components/sounds'
import { SOUND_TYPES } from '../../../../helpers/types'

let visibleItems:any[] = []
let visibleIndex:number = 1

let tutorialsView = "list"
let tutorial:any

export function updateTutorialsView(view:string){
    tutorialsView = view
}

export function showTutorials(){
    visibleIndex = 1
    refreshVisibleTutorials()
}

export function refreshVisibleTutorials(){
    visibleItems.length = 0
    visibleItems = paginateArray([...iwbConfig.tutorials], visibleIndex, 6)
}

export function TutorialsPanel() {
    return (
        <UiEntity
            key={"tutorialspanel"}
            uiTransform={{
                display: statusView === "Help" && helpView === "tutorials" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            >

                 {/* image column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"3%", bottom:'1%'},
            }}
            uiText={{value:"Tutorials", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            />

            {/* list view panel */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                margin:{top:"1%", bottom:'1%'},
                display: tutorialsView === "list" ? "flex" : "none"
            }}
            >

                {TutorialsList()}


                {/* pagination buttons */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                // margin:{top:"1%", bottom:'1%'},
            }}
            >

             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >
        </UiEntity>


        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.White()}}
        >

                 <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(5).width,
                height: calculateSquareImageDimensions(4).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
            }}
            onMouseDown={()=>{
                playSound(SOUND_TYPES.SELECT_3)
                if(visibleIndex - 1 >= 1 ){
                    visibleIndex--
                    refreshVisibleTutorials()
                }
            }}
            />

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(5).width,
                height: calculateSquareImageDimensions(4).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
            }}
            onMouseDown={()=>{
                playSound(SOUND_TYPES.SELECT_3)
                visibleIndex++
                refreshVisibleTutorials()
            }}
            />

            </UiEntity>

            </UiEntity>


            </UiEntity>



            {/* individual tutorial panel */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                margin:{top:"1%", bottom:'1%'},
                display: tutorialsView === "individual" ? "flex" : "none"
            }}
            >

            {/* image column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '50%',
                height: '90%',
                margin:{top:"5%", bottom:'1%'},
            }}
            >
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateSquareImageDimensions(25).width,
                height: calculateSquareImageDimensions(25).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{color:Color4.Black()}}
            />

            </UiEntity>

            {/* title & descripotion column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '50%',
                height: '100%',
                margin:{top:"1%", bottom:'1%'},
            }}
            >
                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf:'flex-start',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%", bottom:'1%'},
            }}
            uiText={{value:"" + (tutorial && tutorial.name), fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-left'}}
            />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"10%", bottom:'1%'},
            }}
            uiText={{value:"" + (tutorial && addLineBreak(tutorial.desc,undefined, 35)), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
            />


        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                positionType:'absolute',
                position:{bottom:0}
            }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%', right:'2%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                playSound(SOUND_TYPES.SELECT_3)
                displaySettingsPanel(false)
                displayStatusView("Version")
                updateHelpView("main`")
                updateTutorialsView("list")
                displayTutorialVideoControls(true)
                createTutorialVideo(tutorial)
            }}
            uiText={{value:"Play Video", color:Color4.White(), fontSize:sizeFont(25,15)}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%', left:'2%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={() => {
                playSound(SOUND_TYPES.SELECT_3)
                updateTutorialsView('list')
            }}
            uiText={{value:"Go Back", color:Color4.White(), fontSize:sizeFont(25,15)}}
            />



            </UiEntity>

            </UiEntity>

            </UiEntity>

        </UiEntity>
    )
}


function TutorialsList(){
    let arr:any[] = []
    let count = 0

    for(let i =0; i < 2; i++){
        arr.push(
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '40%',
                margin:{top:"1%", bottom:'1%'},
            }}
            >
        {generateRowItems(count)}
        </UiEntity>
        )
        count++
    }
    return arr
}

function generateRowItems(count:number){
    let arr:any[] = []
    let rowcount = 0
    for(let j =0; j < 3; j++){
        arr.push(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
            margin:{right:"1%", left:'1%'},
            display:visibleItems[count + rowcount] ? "flex" : "none"
        }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '88%',
            height: '90%',
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{color:Color4.Black()}}
        onMouseDown={()=>{
            playSound(SOUND_TYPES.SELECT_3)
            tutorial = visibleItems[count + j]
            updateTutorialsView("individual")
        }}
        />

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{top:"1%", bottom:'1%'},
        }}
        uiText={{value:"" + (visibleItems[count + rowcount] &&  visibleItems[count + rowcount].name.substring(0,20) + "..."), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-center'}}
        />

        </UiEntity>
    )
    rowcount++
    }
    return arr
}