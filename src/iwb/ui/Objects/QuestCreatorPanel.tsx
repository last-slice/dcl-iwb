import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../helpers/resources'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions, dimensions } from '../helpers'
import { uiSizes } from '../uiConfig'
import { generateButtons, setUIClicked } from '../ui'
import { displayMainView } from './IWBView'
import { sendServerMessage } from '../../components/Colyseus'
import { PrerequisiteType, Quest, QUEST_PREREQUISITES, QuestStep, SERVER_MESSAGE_TYPES } from '../../helpers/types'
import { localPlayer } from '../../components/Player'
import { validateCreateQuest } from '@dcl/quests-client/dist-cjs/utils'
import { HoriztonalButtons } from '../Reuse/HoriztonalButtons'
import { getRandomString } from '../../helpers/functions'
import { realm } from '../../components/Config'
import { questConditions, quests } from '../../components/Quests'

let showQuestCreator = false
let validQuest = false
let questView = "main"
let questCreateView = "List"

let steps:any[] = []
let connections:any[] = []
let newQuest:Quest = {
    id:"",
    name:"",
    description:"",
    steps:[],
    prerequisites:[],
    rewards:{
      xp:0,
      items:[]
    },
    scene:"",
    world:"",
}

let newStep:QuestStep = {
  id:"",
  description:"",
  prerequisites:[],
  type:'interaction'
}

let newCondition:QUEST_PREREQUISITES = {
  id:"",
  description:"",
  questId:"",
  value:"",
  type: PrerequisiteType.StepCompletion
}

let questCreate:any[] = [
  {label:"Details", pressed:true, func:()=>{
  }},
  {label:"Steps", pressed:false, func:()=>{
  }},
  {label:"Rewards", pressed:false, func:()=>{
  }},
]

let mainQuestCreatorButtons:any[] = [
  {label:"Conditions", pressed:false, func:()=>{
    updateQuestView("Conditions", mainQuestCreatorButtons)
  }},
  {label:"Quests", pressed:false, func:()=>{
    updateQuestView("Quests", mainQuestCreatorButtons)
    updateQuestCreateView("List", horiztonalButtons)
  }},
  {label:"Rewards", pressed:false, func:()=>{
    updateQuestView("Rewards", mainQuestCreatorButtons)
  }},
  {label:"Close", pressed:false, func:()=>{
     displayQuestCreatorPanel(false)
     displayMainView(true)
     questView = ""
  }},
 ]

 export let horiztonalButtons:any[] = [
  {label:"Details", pressed:false, func:()=>{
      updateQuestCreateView("Details", horiztonalButtons)
      // updateWorldView("Current World")
      // playSound(SOUND_TYPES.SELECT_3)
      },
      height:6,
      width:8,
      fontBigScreen:30,
      fontSmallScreen:12
  },
  {label:"Steps", pressed:false, func:()=>{
    updateQuestCreateView("Steps", horiztonalButtons)
      // updateWorldView("My Worlds")
      // setTableConfig(myWorldConfig)
      // updateIWBTable(localPlayer.worlds)
      // console.log("player worlds", localPlayer.worlds)
      // playSound(SOUND_TYPES.SELECT_3)
      // showWorlds()
      // updateExploreView("My Worlds")
      },
      height:6,
      width:8,
      fontBigScreen:30,
      fontSmallScreen:15
  },
  {label:"Rewards", pressed:false, func:()=>{
    updateQuestCreateView("Rewards", horiztonalButtons)
      // updateWorldView("All Worlds")
      // setTableConfig(allWorldsConfig)
      // updateIWBTable(worlds)
      // playSound(SOUND_TYPES.SELECT_3)//
      // // displayStatusView("All Worlds")
      // showAllWorlds()
      // updateExploreView("All Worlds")
      },
      height:6,
      width:8,
      fontBigScreen:30,
      fontSmallScreen:15
  },
]

export function displayQuestCreatorPanel(value:boolean){
    showQuestCreator = value

    if(value){
      updateQuestView("Quests", mainQuestCreatorButtons)
      resetNewStep()
      resetNewQuest()
      resetNewCondition()
    }else{
      resetNewStep()//
      validQuest = false
      updateQuestCreateView("List", horiztonalButtons)
    }
}

export function updateQuestView(view:string, buttons:any[]){
  let button = buttons.find($=> $.label === questView)
  if(button){
      button.pressed = false
  }

  questView = view
  button = buttons.find($=> $.label === view)
  if(button){
      button.pressed = true
  }
}

export function updateQuestCreateView(view:string, buttons:any[]){
  let button = buttons.find($=> $.label === questCreateView)
  if(button){
      button.pressed = false
  }

  questCreateView = view
  button = buttons.find($=> $.label === view)
  if(button){
      button.pressed = true
  }


}


function resetNewCondition(){
  newCondition = {
    id:"",
    description:"",
    questId:"",
    value:"",
    type: PrerequisiteType.StepCompletion
  }
}

function resetNewStep(){
  newStep = {
    id:"",
    description:"",
    prerequisites:[],
    type:'interaction'
  }
}

function resetNewQuest(){
  newQuest = {
    id:getRandomString(6),
    name:"",
    description:"",
    steps:[],
    prerequisites:[],
    rewards:{
      xp:0,
      items:[]
    },
    scene:"" + localPlayer.activeScene.id,
    world:"" + realm,
}
}

function validateStep(){
  newStep.id = getRandomString(5)
  newQuest.steps.push({...newStep})
  resetNewStep()
  validateQuest()
}

function validateQuest(){
  validQuest = true
}

function attemptQuestCreation(){
  if(validQuest){
    displayQuestCreatorPanel(false)
    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_CREATE_QUEST, [{...newQuest}])
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


  <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
        positionType:'absolute',
        position:{right: '5%', top:'3%'},
        display:questView === "Quests" && questCreateView === "List" ? "flex" : "none"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
    }}
    uiText={{textAlign:'middle-center', textWrap:'nowrap', value:"New", fontSize:sizeFont(20,15)}}
    onMouseDown={() => {
        setUIClicked(true)
        updateQuestCreateView("Details", horiztonalButtons)
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.backButton)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.backButton)).height,
        positionType:'absolute',
        position:{right: '5%', top:'3%'},
        display:questView === "Quests" && questCreateView !== "List" ? "flex" : "none"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.backButton)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        //reset quest info
        updateQuestCreateView("List", horiztonalButtons)
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',

    }}
    uiText={{value:"Quest Creator", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
  />

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        height: '83%',
    }}
  >
    {/* left column buttons */}
    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '20%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Blue()}}
  >
    {   showQuestCreator &&
        generateButtons(
            {
                slug:"quest-creator-navigation", 
                buttons:mainQuestCreatorButtons
                }
        )
    }

  </UiEntity>

    {/* right panels */}
  <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
  >
    <CreateView/>
    <EditView/>
    <QuestList/>
    <QuestConditions/>
    {/* <AnalyticsView /> */}
  </UiEntity>
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
        display: questView === "Quests" && questCreateView !== "List" ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Red()}}
  >

<HoriztonalButtons buttons={horiztonalButtons} slug={"quest-creator-lis-view"} />


<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '90%',
    }}
  >
  <DetailsView/>
  <StepsView/>
  <RewardsView/>
  </UiEntity>


{/* <UiEntity
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
</UiEntity> */}

{/* {   showQuestCreator && questView === "new" &&
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
    } */}

    </UiEntity>

    )
}

function QuestConditions(){
  return(
      <UiEntity
  key={"" + resources.slug + "quest::creator::condition::panel"}
  uiTransform={{
      display: questView === "Conditions" ? 'flex' : 'none',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
  }}
  // uiBackground={{color:Color4.Green()}}
>

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '60%',
      height: '100%',
  }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}
    uiText={{value:"Current Condition", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
  />

  {
    showQuestCreator &&
    questView === "Conditions" &&
    generateConditions()
  }
  </UiEntity>

  <UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '40%',
      height: '100%',
  }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}
    uiText={{value:"Create Condition", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
  />
  </UiEntity>
  </UiEntity>
  )
}

function QuestList(){
  return(
      <UiEntity
  key={"" + resources.slug + "quest::creator::list::panel"}
  uiTransform={{
      display: questView === "Quests" && questCreateView === "List" ? 'flex' : 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
  }}
  // uiBackground={{color:Color4.Green()}}
>
  {
    showQuestCreator &&
    questView === "Quests" &&
    questCreateView === "List" && 
    generateQuests()
  }
  </UiEntity>
  )
}

function generateConditions(){
  let arr:any[] = []
  let count = 0
  questConditions.filter(q=> q.world === realm).forEach((condition:QUEST_PREREQUISITES)=>{
      arr.push(<ConditionsRow count={count} condition={condition} />)
      count++
  })
  return arr
}

function ConditionsRow(data:any){
  return(
<UiEntity
  key={resources.slug + "create::quest::condition::row::" + data.count}
  uiTransform={{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf:'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '10%',
      margin:{top:"1%", bottom:"1%"}
  }}
  uiBackground={{
      textureMode: 'stretch',
      texture: {
          src: 'assets/atlas2.png'
      },
      uvs: getImageAtlasMapping(uiSizes.rowPillDark)
  }}
  >

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60%',
      height: '100%',
      margin:{left:'2%'}
  }}
  uiText={{textWrap:"nowrap", value:"" + data.condition.description, textAlign:'middle-left', fontSize:sizeFont(20,15)}}
  />

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '10%',
      height: '100%',
  }}
  uiText={{textWrap:"nowrap", value:"" + data.condition.type, textAlign:'middle-left', fontSize:sizeFont(20,15)}}
  />

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20%',
      height: '100%',
  }}
  uiText={{textWrap:"nowrap", value:"" + getConditionValue(data.condition), textAlign:'middle-left', fontSize:sizeFont(20,15)}}
  />

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '10%',
      height: '100%',
  }}
  >
    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
        margin:{left:"1%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.trashButton)
    }}
    onMouseDown={() => {
      setUIClicked(true)
      // sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_QUEST, data.quest.id)
      setUIClicked(false)
    }}
    onMouseUp={()=>{
      setUIClicked(false)
    }}
/>
  </UiEntity>

  </UiEntity>
  )
}

function generateQuests(){
  let arr:any[] = []
  let count = 0
  quests.filter(q=> q.world === realm).forEach((quest:Quest)=>{
      arr.push(<QuestRow count={count} quest={quest} />)
      count++
  })
  return arr
}

function getConditionValue(data:any){
  return ""
}

function QuestRow(data:any){
  return(
<UiEntity
  key={resources.slug + "create::quest::list::row::" + data.count}
  uiTransform={{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf:'center',
      justifyContent: 'center',
      width: '100%',
      height: '15%',
      margin:{top:"1%", bottom:"1%"}
  }}
  uiBackground={{
      textureMode: 'stretch',
      texture: {
          src: 'assets/atlas2.png'
      },
      uvs: getImageAtlasMapping(uiSizes.rowPillDark)
  }}
  >

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      height: '100%',
      margin:{left:'2%'}
  }}
  uiText={{textWrap:"nowrap", value:"" + data.quest.name, textAlign:'middle-left', fontSize:sizeFont(20,15)}}
  />

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '10%',
      height: '100%',
  }}
  >
    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
        margin:{left:"1%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.trashButton)
    }}
    onMouseDown={() => {
      setUIClicked(true)
      sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_QUEST, data.quest.id)
      setUIClicked(false)
    }}
    onMouseUp={()=>{
      setUIClicked(false)
    }}
/>
  </UiEntity>

  </UiEntity>
  )
}

function DetailsView(){
  return(
    <UiEntity
    key={resources.slug + "quest::creator::new::details"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: questView === "Quests" && questCreateView === "Details" ? "flex" : 'none'
    }}
    >

          <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: '10%',
        margin:{top:"5%"}
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
    }}
    uiText={{value:"Scene: " + (localPlayer && localPlayer.activeScene ? localPlayer.activeScene.id : ""), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
  />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: '10%',
    }}
    uiText={{value:"World: " + (realm ? realm : ""), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(25,20)}}
  />


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        display: newQuest.steps.length === 0 ? "flex" : "none"
    }}
    uiText={{value:"Please add at least one (1) quest step before saving.", textAlign:'middle-center', fontSize:sizeFont(20,15)}}
  />


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).height,
         display: validQuest ? "flex" : "none"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
    }}
    uiText={{textAlign:'middle-center', textWrap:'nowrap', value:"Create", fontSize:sizeFont(20,15)}}
    onMouseDown={() => {
        setUIClicked(true)
        attemptQuestCreation()
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

    </UiEntity>
  )
}

function StepsView(){
  return(
    <UiEntity
    key={resources.slug + "quest::creator::new::steps"}
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: questCreateView === "Steps" ? "flex" : 'none'
    }}
    >
          <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '60%',
        height: '100%',
    }}
    // uiBackground={{color:Color4.Teal()}}
    >
      <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}
    uiText={{value:"Current Steps", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
  />

  {
    showQuestCreator && 
    questView === "Quests" &&
    questCreateView === "Steps" &&
    generateSteps()
  }

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '40%',
        height: '100%',
    }}
    >
      <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}
    uiText={{value:"New Step", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
  />

          <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:'1%', bottom:'1%'}
    }}
    >
                <Input
    onChange={(value)=>{
        newStep.description = value.trim()
    }}
    onSubmit={(value)=>{
        newStep.description = value.trim()
    }}
    fontSize={sizeFont(20,15)}
    placeholder={'Enter Step Description'}
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
            width: '100%',
            height: '12%',
            margin:{top:'1%', bottom:'1%'}
        }}
    >
        <Dropdown
        options={["Select Type", "Interaction"]}
        selectedIndex={0}
        onChange={(index:number)=>{
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


        {/* <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',

    }}//
    uiText={{value:"Conditions", textAlign:'middle-center', textWrap:'nowrap', fontSize:sizeFont(35,20)}}
  /> */}


<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '12%',
        }}
    >
 <Dropdown
        options={["Select Condition", "Conditions"]}
        selectedIndex={0}
        onChange={(index:number)=>{
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
    }}
    uiText={{textAlign:'middle-center', textWrap:'nowrap', value:"Add", fontSize:sizeFont(20,15)}}
    onMouseDown={() => {
        setUIClicked(true)
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf:'flex-end',
        justifyContent: 'center',
        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
        positionType:'absolute',
        position:{bottom:0, left:'35%'}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
    }}
    uiText={{textAlign:'middle-center', textWrap:'nowrap', value:"Add Step", fontSize:sizeFont(20,15)}}
    onMouseDown={() => {
        setUIClicked(true)
        validateStep()
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>




    </UiEntity>

    </UiEntity>
  )
}

function generateSteps(){
  let arr:any[] = []
  let count = 0
  newQuest.steps.forEach((step:any)=>{
      arr.push(<StepRow count={count} step={step} />)
      count++
  })
  return arr
}

function StepRow(data:any){
  return(
<UiEntity
  key={resources.slug + "create::step::row::" + data.count}
  uiTransform={{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf:'center',
      justifyContent: 'center',
      width: '90%',
      height: '8%',
      margin:{top:"1%", bottom:"1%"}
  }}
  uiBackground={{
      textureMode: 'stretch',
      texture: {
          src: 'assets/atlas2.png'
      },
      uvs: getImageAtlasMapping(uiSizes.rowPillDark)
  }}
  >

<UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      height: '100%',
      margin:{left:'2%'}
  }}
  uiText={{textWrap:"nowrap", value:"" + data.step.description, textAlign:'middle-left', fontSize:sizeFont(20,15)}}
  />

{/* 
  <UiEntity
  uiTransform={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '10%',
      height: '100%',
  }}
  >
       <UiEntity
  uiTransform={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: calculateImageDimensions(1.5, getAspect(uiSizes.emptyCheckWhite)).width,
      height: calculateImageDimensions(1.5, getAspect(uiSizes.emptyCheckWhite)).height,
  }}
  uiBackground={{
      textureMode: 'stretch',
      texture: {
          src: 'assets/atlas2.png'
      },
      uvs: getImageAtlasMapping(data.step.completed ? uiSizes.checkWithBoxWhite : uiSizes.emptyCheckWhite)
  }}
  onMouseDown={() => {
      setUIClicked(true)
      setUIClicked(false)
  }}
  onMouseUp={()=>{
      setUIClicked(false)
  }}
/>
  </UiEntity> */}

  </UiEntity>
  )
}

function RewardsView(){
  return(
    <UiEntity
    key={resources.slug + "quest::creator::new::rewards"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: questCreateView === "Rewards" ? "flex" : 'none'
    }}
    >
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


//