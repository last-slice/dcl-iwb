
import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions, getAspect } from '../helpers'
import { uiSizes } from '../uiConfig'
import resources from '../../helpers/resources'
import { setUIClicked } from '../ui'
import { abortQuest, attemptStartQuest, prerequisitesMet, quests } from '../../components/Quests'
import { teleportToScene } from '../../modes/Play'
import { colyseusRoom } from '../../components/Colyseus'
import { Color4 } from '@dcl/sdk/math'
import { Quest } from '../../helpers/types'
import { realm } from '../../components/Config'

export let showQuestView = false
let questView = "main"
let viewType = "expanded"
let selected = "tasks"

let visibleStartedIndex = 1
let visibleNotStartedIndex = 1

let visibleStartedQuests:any[] = []
let visibleNotStartedQuests:any[] = []
let availableSteps:any[] = []

let questInfo:any = {}

export function updateQuestPanel(quest:Quest){
    console.log('updating quest panel', quest)
    questInfo = {...quest}
    generateSteps()
}

export function displayQuestPanel(value: boolean) {
    showQuestView = value

    // switch(viewType){
    //     case 
    // }//

    visibleStartedIndex = 1
    visibleNotStartedIndex = 1

    visibleStartedQuests.length = 0
    visibleNotStartedQuests.length = 0

    if(value){
        questInfo = {}
    }else{
        viewType = "expanded"
        selected = "tasks"
    }
}

export function createQuestPanel() {
    return (
        <UiEntity
            key={resources.slug + "quest::info::panel"}
            uiTransform={{
                display: showQuestView ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
        >

            <QuestExpandedView/>
            <QuestInfoView/>
            </UiEntity>
    )
}

function QuestExpandedView(){
    return(
        <UiEntity
            key={resources.slug + "quest::expanded::info::panel"}
            uiTransform={{
                display: viewType === "expanded" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(20, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '3%', top: '1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
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
        justifyContent: 'flex-start',
        width: '80%',
        height: '85%',
        margin:{bottom:'5%'}
    }}
    >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '10%',
                margin:{top:'2%'}
            }}
            uiText={{textWrap:"nowrap", value:"" + realm + " Quests", textAlign:'middle-center', fontSize:sizeFont(25,20)}}
            />


{
    showQuestView &&
    viewType === "expanded" &&
    generateQuestRows()
    }
            </UiEntity>

        </UiEntity>
    )
}

function generateQuestRows(){
    let arr:any[] = []
    let count = 0
    quests.forEach((quest:any)=>{
        arr.push(<QuestRow count={count} quest={quest} />)
        count++
    })
    return arr
}

function generateSteps(){
    let arr:any[] = []
    let count = 0
    availableSteps.forEach((step:any)=>{
        arr.push(<StepRow count={count} step={step} />)
        count++
    })
    return arr
}

function generateRewards(){
    let arr:any[] = []
    let count = 0
    // availableSteps.forEach((step:any)=>{
    //     arr.push(<StepRow count={count} step={step} />)
    //     count++
    // })
    return arr
}

function getAvailableSteps(){
    availableSteps.length = 0
    console.log('quest info is', questInfo)

    if(questInfo.playerData.started){
        questInfo.steps.forEach((step:any)=>{
            if(questInfo.playerData.completedSteps.includes(step.id)){
                availableSteps.push({description:step.description, completed:true})
            }else if(prerequisitesMet(questInfo.playerData, step.prerequisites)){
                availableSteps.push({description:step.description, completed:false})
            }
        })
    }

    console.log('available steps', availableSteps)
}

function QuestRow(data:any){
    return(
<UiEntity
    key={resources.slug + "quest::row::" + data.count}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf:'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '20%',
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
        width: '96%',
        height: '15%',
        margin:{top:'2%'}
    }}
    uiText={{textWrap:"nowrap", value:"" + data.quest.name, textAlign:'middle-left', fontSize:sizeFont(25,20)}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        height: '35%',
        margin:{bottom:'2%'}
    }}
    uiText={{value:"" + data.quest.description, textAlign:'top-left', fontSize:sizeFont(20,12)}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        height: '15%',
        margin:{top:'1%'}
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
    uiText={{textWrap:"nowrap", value:"Status: " + (data.quest.playerData.started ? data.quest.playerData.status : "Not Started"), textAlign:'middle-left', fontSize:sizeFont(20,12)}}
    />


<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
    uiText={{textWrap:"nowrap", value:"Start Location: ", textAlign:'middle-left', fontSize:sizeFont(20,12)}}
    />


    </UiEntity>

    {/* <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        height: '15%',
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
    uiText={{textWrap:"nowrap", value: !data.quest.started ? ""  : "Progress: " + (data.playerData ? Math.round(data.playerData.completedSteps.length / data.steps.length) : 0) + "%", textAlign:'middle-left', fontSize:sizeFont(20,12)}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
    uiText={{textWrap:"nowrap", value:"Rewards: ", textAlign:'middle-left', fontSize:sizeFont(20,12)}}
    />
    </UiEntity> */}

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '96%',
        height: '15%',
        positionType:'absolute',
        position:{right: '3%', bottom:'10%'},
    }}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.infoButtonOpaque)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.infoButtonOpaque)).height,
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.infoButtonOpaque)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        questInfo = {...data.quest}
        viewType = "info"
        getAvailableSteps()
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
        width: calculateImageDimensions(1.5, getAspect(uiSizes.goIcon)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.goIcon)).height,
        display: !data.quest.started ? "flex" : "none"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.goIcon)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        teleportToScene({id:data.quest.sceneId})
        displayQuestPanel(false)
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

function StepRow(data:any){
    return(
<UiEntity
    key={resources.slug + "step::row::" + data.count}
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        justifyContent: 'center',
        width: '100%',
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
    </UiEntity>

    </UiEntity>
    )
}

function QuestInfoView(){
    return(
        <UiEntity
            key={resources.slug + "quest::info::panel"}
            uiTransform={{
                display: viewType === "info" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(25, 345 / 511).width,
                height: calculateImageDimensions(20, 345 / 511).height,
                positionType: 'absolute',
                position: {right: '3%', top: '1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangle)
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
        justifyContent: 'flex-start',
        width: '80%',
        height: '85%',
        margin:{bottom:'5%'}
    }}
    >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '10%',
                margin:{top:'2%'}
            }}
            uiText={{textWrap:"nowrap", value:"" + questInfo.name + " Quest", textAlign:'top-left', fontSize:sizeFont(25,20)}}
            />

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '10%',
    margin:{top:'1%', bottom:'1%'}
}}
uiText={{value:"" + questInfo.description, textAlign:'top-left', fontSize:sizeFont(20, 15)}}
/>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '10%',
    display: viewType === "info" && questInfo && questInfo.playerData && questInfo.playerData.started ? "flex" : "none"
}}
uiText={{textWrap:"nowrap", value:"Progress: " + (viewType === "info" && questInfo && questInfo.playerData && questInfo.playerData.started ? ("" + questInfo.playerData.completedSteps.length + "/" + questInfo.steps.length) : 0), textAlign:'middle-left', fontSize:sizeFont(20, 15)}}
/>  


{/* <UiEntity
uiTransform={{
    flexDirection: 'row',
    alignSelf:'flex-start',
    alignItems: 'flex-start',
    alignContent:'flex-start',
    justifyContent: 'flex-start',
    width: '60%',
    height: '10%',
    margin:{top:'1%'}
}}
>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    margin:'1%',
}}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'assets/atlas2.png'
          },
          uvs: getImageAtlasMapping(selected === "tasks" ? uiSizes.buttonPillBlue : uiSizes.buttonPillBlack)
      }}
      onMouseDown={() => {
        setUIClicked(true)
        // playSound(SOUND_TYPES.WOOD_3)
        selected = "tasks"
        setUIClicked(false)
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      uiText={{textWrap:'nowrap', value: "Tasks", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

<UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    margin:'1%'
}}
>
<UiEntity
      uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
          height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
      }}
      uiBackground={{
          textureMode: 'stretch',
          texture: {
              src: 'assets/atlas2.png'
          },
          uvs: getImageAtlasMapping(selected === "rewards" ? uiSizes.buttonPillBlue : uiSizes.buttonPillBlack)
      }}
      onMouseDown={() => {
        setUIClicked(true)
        // playSound(SOUND_TYPES.WOOD_3)
        selected = "rewards"
        setUIClicked(false)
      }}
      onMouseUp={()=>{
        setUIClicked(false)
      }}
      uiText={{textWrap:'nowrap', value: "Rewards", color:Color4.White(), fontSize:sizeFont(25,15)}}
      />
</UiEntity>

</UiEntity> */}

{
    viewType === "info" &&
    questInfo.playerData && 
    questInfo.playerData.started && 
    selected === "tasks" &&
    generateSteps()
}

{/* {
    viewType === "info" &&
    questInfo.started && 
    selected === "rewards" &&
    generateRewards()
} */}

    <UiEntity
uiTransform={{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '10%',
    display: questInfo.playerData && !questInfo.playerData.started && selected === "tasks" ? "flex" : "none"
}}
uiText={{value:"Tasks will be visible after starting the quest.", textAlign:'middle-left', fontSize:sizeFont(20, 15)}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.backButton)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.backButton)).height,
        positionType:'absolute',
        position:{right: '2%', top:'2%'},
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'//
        },
        uvs: getImageAtlasMapping(uiSizes.backButton)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        viewType = "expanded"
        questInfo = {}
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