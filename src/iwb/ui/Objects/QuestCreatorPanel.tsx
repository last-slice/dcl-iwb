import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions, dimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
import { displayMainView } from './IWBView'
import { sendServerMessage } from '../../components/Colyseus'
import { SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { localPlayer } from '../../components/Player'
import { validateCreateQuest } from '@dcl/quests-client/dist-cjs/utils'

let showQuestCreator = false
let questView = "main"

let steps:any[] = []
let connections:any[] = []
let newQuest:any = {
    name:"",
    description:"",
    image:"",
    steps:[],
}

export function displayQuestCreatorPanel(value:boolean){
    showQuestCreator = value

    if(value){
        questView = "main"
    }
}

export function createQuestCreatorPanel(){
  return(
    <UiEntity
    key={"" + resources.slug + "quest::creator::panel"}
    uiTransform={{
        display: showQuestCreator? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width,
        height: calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).height,
        positionType: 'absolute',
        position: { left: (dimensions.width - calculateImageDimensions(45, getAspect(uiSizes.horizRectangle)).width) / 2, bottom: '15%'}
    }}
    uiBackground={{
      texture:{
          src: resources.textures.atlas2
      },
      textureMode: 'stretch',
      uvs:getImageAtlasMapping(uiSizes.horizRectangle)
    }}
    onMouseDown={()=>{
      setUIClicked(true)
      setUIClicked(false)
    }}
    onMouseUp={()=>{
      setUIClicked(false)
    }}
  >

    <MainView/>
    <CreateView/>
    <EditView/>
    {/* <AnalyticsView /> */}

  </UiEntity>
  )
}

function MainView(){
    return(
    <UiEntity
    key={"" + resources.slug + "quest::creator::panel::main::view"}
    uiTransform={{
        display: questView === "main" ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '85%',
        height: '90%',
    }}
    // uiBackground={{color:Color4.Green()}}
  >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}
    uiText={{value:"Quest Creator", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
  />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        height: '90%',
    }}
  >
    {   showQuestCreator && questView === "main" &&
        generateButtons(
            {
                slug:"add-new-quest", 
                buttons:[
                     {label:"New Quest", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{
                        questView = "new"
                     }},
                     {label:"All Quests", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{}},
                     {label:"Close", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{
                        displayQuestCreatorPanel(false)
                        displayMainView(true)
                        questView = ""
                     }},
                    ]
                }
        )
    }
  </UiEntity>

  </UiEntity>
)
}

function EditView(){
    return(
    <UiEntity
    key={"" + resources.slug + "quest::creator::panel::edit::view"}
    uiTransform={{
        display: questView === "edit" ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        height: '95%',
    }}
  >
    
  </UiEntity>
)
}

function CreateView(){
    return(
        <UiEntity
    key={"" + resources.slug + "quest::creator::create::panel"}
    uiTransform={{
        display: questView === "new" ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '65%',
        height: '90%',
    }}
    // uiBackground={{color:Color4.Green()}}
  >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:"5%"}
    }}
    uiText={{value:"New Quest Details", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
  />

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: '10%',
}}
>
<Input
onChange={(value)=>{
    newQuest.name = value.trim()
}}
onSubmit={(value)=>{
    newQuest.name = value.trim()
}}
fontSize={sizeFont(20,15)}
placeholder={'Enter Quest Name'}
placeholderColor={Color4.White()}
color={Color4.White()}
uiTransform={{
    width: '100%',
    height: '100%',
}}
></Input>
</UiEntity>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: '10%',
    margin:{top:"1%"}
}}
>
<Input
onChange={(value)=>{
    newQuest.description = value.trim()
}}
onSubmit={(value)=>{
    newQuest.description = value.trim()
}}
fontSize={sizeFont(20,15)}
placeholder={'Enter Quest Description'}
placeholderColor={Color4.White()}
color={Color4.White()}
uiTransform={{
    width: '100%',
    height: '100%',
}}
></Input>
</UiEntity>

<UiEntity
uiTransform={{
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
width: '70%',
height: '10%',
margin:{top:"1%"}
}}
>
<Input
onChange={(value)=>{
    newQuest.image = value.trim()
}}
onSubmit={(value)=>{
    newQuest.image = value.trim()
}}
fontSize={sizeFont(20,15)}
placeholder={'Enter Quest Image'}
placeholderColor={Color4.White()}
color={Color4.White()}
uiTransform={{
    width: '100%',
    height: '100%',
}}
></Input>
</UiEntity>

{   showQuestCreator && questView === "new" &&
        generateButtons(
            {
                slug:"create-new-panel", 
                buttons:[
                     {label:"Add Steps", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{
                        // questView = "steps"
                        try {
                            validateCreateQuest(template)
                            sendServerMessage(SERVER_MESSAGE_TYPES.QUEST_EDIT, {
                                sceneId:localPlayer.activeScene.id,
                                action:'create',
                                quest:template
                            })
                          } catch (error) {
                            console.log("quest validation error", error)
                          }
                     }},
                     {label:"Quit", pressed:false, width:7, bigScreen:20, smallScreen:15, height:5, func:()=>{
                        displayQuestCreatorPanel(false)
                     }}
                    ]
                }
        )
    }

    </UiEntity>

    )
}


let template:any = 
{
    "name": "Coven Test 2023 T1",
    "description": "Aurora Test 1",
    "imageUrl": "https://the-image-u-want-to-be-displayed-on-dcl-explorer.com",
    "definition": {
      "steps": [
        {
          "id": "STEP_1",
          "description": "First Step",
          "tasks": [
            {
              "id": "STEP_1_1",
              "description": "First Task of First Step",
              "actionItems": [
                {
                  "type": "CUSTOM",
                  "parameters": {
                    "id": "CUSTOM_EVENT_1"
                  }
                }
              ]
            }
          ]
        },
        {
          "id": "STEP_2",
          "description": "Second Step",
          "tasks": [
            {
              "id": "STEP_2_1",
              "description": "First Task of Second Step",
              "actionItems": [
                {
                  "type": "CUSTOM",
                  "parameters": {
                    "id": "CUSTOM_EVENT_2"
                  }
                }
              ]
            }
          ]
        }
      ],
      "connections": [
        {
          "stepFrom": "STEP_1",
          "stepTo": "STEP_2"
        }
      ]
    }
  }

