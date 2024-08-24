
import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getImageAtlasMapping, sizeFont, calculateSquareImageDimensions, getAspect } from '../helpers'
import { uiSizes } from '../uiConfig'
import resources from '../../helpers/resources'
import { setUIClicked } from '../ui'
import { Color4 } from '@dcl/sdk/math'
import { abortQuest, attemptStartQuest, quests } from '../../components/Quests'

export let showQuestView = false
let questView = "main"
let viewType = "expanded"

let visibleStartedIndex = 1
let visibleNotStartedIndex = 1

let visibleStartedQuests:any[] = []
let visibleNotStartedQuests:any[] = []

export function displayQuestPanel(value: boolean) {
    showQuestView = value

    // switch(viewType){
    //     case 
    // }

    visibleStartedIndex = 1
    visibleNotStartedIndex = 1

    visibleStartedQuests.length = 0
    visibleNotStartedQuests.length = 0
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
            uiText={{textWrap:"nowrap", value:"IWB Quests", textAlign:'middle-center', fontSize:sizeFont(25,20)}}
            />

            <QuestList started={true}/>
            <QuestList started={false}/>
            </UiEntity>

        </UiEntity>
    )
}

function QuestList(data:any){
    return(
<UiEntity
key={resources.slug + "started::quests:panel"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '45%',
        margin:{top:'2%'}
    }}
    >

{/* header row */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:'2%'}
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
    uiText={{textWrap:"nowrap", value:data.started ? "Started Quests" : "Not Started Quests", textAlign:'top-left', fontSize:sizeFont(25,20)}}
    />

    <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '100%',
    }}
    >
        
    </UiEntity>

    </UiEntity>


    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf:'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        height: '90%',
        flexShrink:1
    }}
    // uiBackground={{color:Color4.create(1,0,1,.5)}}
    >
        {
            showQuestView &&
            viewType === "expanded" &&
            generateQuestRows(data.started)
        }
    </UiEntity>

    </UiEntity>
    )
}

function generateQuestRows(started:boolean){
    let arr:any[] = []
    let count = 0
    quests.filter(($:any)=> $.started === started).forEach((quest:any)=>{
        arr.push(<QuestRow count={count} type={started ? 0 : 1} quest={quest} />)
        count++
    })
    return arr
}

function QuestRow(data:any){
    return(
<UiEntity
    key={resources.slug + "quest::row::" + data.type + "::" + data.count}
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '25%',
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

{/* started quest info */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        display: data.type === 0 ? "flex" : "none"
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: '100%',
        margin:{left:"3%"},
        display: data.type === 0 ? "flex" : "none"
    }}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: '100%',
    }}
    uiText={{textWrap:"nowrap", value:"" + data.quest.name, textAlign:'middle-left', fontSize:sizeFont(25,20)}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
    }}
    uiText={{textWrap:"nowrap", value:"95%", textAlign:'middle-center', fontSize:sizeFont(25,20)}}
    />


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '30%',
        height: '100%',
        margin:{right:'3%'},
        display: data.type === 0 ? "flex" : "none"
    }}
    >
         <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.infoButtonBlack)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.infoButtonBlack)).height,
        margin:{right:"2%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.infoButtonBlack)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        setUIClicked(true)
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
        width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
        margin:{right:"2%"}
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
        abortQuest(data.quest.id)
        setUIClicked(true)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

    </UiEntity>

    </UiEntity>

{/* not started quest info */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        display: data.type === 1 ? "flex" : "none"
    }}
    >

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: '100%',
        margin:{left:"3%"},
    }}
    uiText={{textWrap:"nowrap", value:"" + data.quest.name, textAlign:'middle-left', fontSize:sizeFont(25,20)}}
    />

{/* start quest button column */}
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '30%',
        height: '100%',
        margin:{right:'3%'},
    }}
    >
        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(1.5, getAspect(uiSizes.infoButtonBlack)).width,
        height: calculateImageDimensions(1.5, getAspect(uiSizes.infoButtonBlack)).height,
        margin:{right:"2%"}
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.infoButtonBlack)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        console.log('need to show quest info')
        setUIClicked(true)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

           <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(3, getAspect(uiSizes.buttonPillBlue)).width,
                height: calculateImageDimensions(3, getAspect(uiSizes.buttonPillBlue)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
            }}
            uiText={{
                value: "Start",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                attemptStartQuest(data.quest.id)
                setUIClicked(true)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
    </UiEntity>


</UiEntity>
    </UiEntity>
    )
}