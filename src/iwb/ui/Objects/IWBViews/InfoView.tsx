import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { iwbConfig, realm, worlds } from '../../../components/Config'
import resources from '../../../helpers/resources'
import { HoriztonalButtons } from '../../Reuse/HoriztonalButtons'
import { generateButtons, setUIClicked } from '../../ui'
import { displayMainView, mainView } from '../IWBView'
import { sendServerMessage } from '../../../components/Colyseus'
import { localUserId, localPlayer, createTutorialVideo, settings } from '../../../components/Player'
import { SOUND_TYPES, SERVER_MESSAGE_TYPES, NOTIFICATION_TYPES } from '../../../helpers/types'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping, calculateSquareImageDimensions, addLineBreak } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { playSound } from '../../../components/Sounds'
import { confirmDeleteAsset, newItems, playerItemsOriginal } from '../../../components/Catalog'
import { IWBTable, setTableConfig, updateIWBTable } from '../../Reuse/IWBTable'
import { showNotification } from '../NotificationPanel'
import { displayPendingPanel } from '../PendingInfoPanel'
import {  formatDollarAmount, formatSize, paginateArray } from '../../../helpers/functions'

export let infoView = "Version"

let feedback = ""
let worldAccessUserId:string = ""

export function updateInfoView(view:string){
    let button = horiztonalButtons.find($=> $.label === infoView)
    if(button){
        button.pressed = false
    }

    infoView = view
    button = horiztonalButtons.find($=> $.label === view)
    if(button){
        button.pressed = true
    }

    if(view === "Assets"){
        updateWorldAssets()
    }
}

export let horiztonalButtons:any[] = [
    {label:"Version", pressed:true, func:()=>{
        updateInfoView("Version")
        // playSound(SOUND_TYPES.SELECT_3)
        // showYourBuilds()
        // updateExploreView("Current World")
        },
        height:6,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:12
    },
    {label:"Help", pressed:false, func:()=>{
        updateInfoView("Help")
        // playSound(SOUND_TYPES.SELECT_3)
        // showWorlds()
        // updateExploreView("My Worlds")
        },
        height:6,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:15
    },
    {label:"Assets", pressed:false, func:()=>{
        updateInfoView("Assets")
        playSound(SOUND_TYPES.SELECT_3)
        updateWorldAssets()
        },
        height:6,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:15,
        displayCondition:()=>{
            return localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)
        }
        
    },
    {label:"Access", pressed:false, func:()=>{
        updateInfoView("Access")
        playSound(SOUND_TYPES.SELECT_3)
        setTableConfig(worldAccessTableConfig)
        updateIWBTable(getWorldPermissions())

        },
        height:6,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:15,
        displayCondition:()=>{
            return localPlayer && localPlayer.homeWorld
        }
    },
]
let buttons:any[] = [
    {label:"Tutorials", pressed:false, func:()=>{
        infoView = 'Tutorials'
        showTutorials()
        }
    },
    {label:"Feedback", pressed:false, func:()=>{
        infoView = "Feedback"
        }
    },
]

export function InfoView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-info"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:mainView === "Info" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Blue()}}
        >

        <HoriztonalButtons buttons={horiztonalButtons} slug={"info-view"} />

        <VersionView/>
        <HelpView/>
        <AssetsView/>
        <FeedbackView/>
        <FeedbackSentView/>
        <AccessView/>
        <TutorialsView/>

            </UiEntity>
    )
}

function VersionView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-version"}
        uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:infoView === "Version" ? 'flex' : 'none',
            margin:{top:"2%"}
        }}
        // uiBackground={{color:Color4.Green()}}
        >


{/* update column */}
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
        // uiBackground={{ color: Color4.Teal() }}
        uiText={{value:"Version Info", fontSize:sizeFont(25,20), textAlign:'middle-left', color:Color4.White()}}
    />

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
    }}
        // uiBackground={{ color: Color4.Teal() }}
        uiText={{value:"World Version: " + (worlds.find((w)=> w.ens === realm) ? worlds.find((w)=> w.ens === realm).v : ""), fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '7%',
    }}
    // uiBackground={{ color: Color4.Teal() }}
    uiText={{value:"IWB Version: " + (iwbConfig.v ? iwbConfig.v : ""), fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
    />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:"5%"}
    }}
        // uiBackground={{ color: Color4.Teal() }}
        uiText={{value:"IWB Updates", fontSize:sizeFont(25,20), textAlign:'middle-left', color:Color4.White()}}
    />



    {/* updates panel */}
    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '40%',
    }}
    >
    {generateUpdateRows()}
    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '10%',
    }}
    >
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
        height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
        margin:{top:"1%", bottom:'1%'},
        display: localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions) ? "flex" : "none"
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
    }}
    onMouseDown={() => {
        playSound(SOUND_TYPES.SELECT_3)
        displayMainView(false)
        
        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your deployment is processing...please wait for confirmation to refresh", animate:{enabled:true, time:7, return:true}})
        sendServerMessage(
            SERVER_MESSAGE_TYPES.FORCE_DEPLOYMENT, {user: localUserId}
        )
        displayPendingPanel(true, "deployment")
    }}
    uiText={{value:"Update", color:Color4.White(), fontSize:sizeFont(25,15)}}
    />
    </UiEntity>

    


    </UiEntity>

        {/* backup column */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '40%',
                height:'100%',
                display: localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions) ? "flex" : "none"
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
                // uiBackground={{ color: Color4.Teal() }}
                uiText={{value:"World Backup", fontSize:sizeFont(25,20), textAlign:'middle-left', color:Color4.White()}}
            />

                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
                // uiBackground={{ color: Color4.Teal() }}
                uiText={{value:"Last Backup: " + getLastBackUp(), fontSize:sizeFont(20,15), textAlign:'middle-left', color:Color4.White()}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                    height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
                    margin:{top:"1%", bottom:'1%'},
                    display: localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions) ? "flex" : "none"
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                }}
                onMouseDown={() => {
                    playSound(SOUND_TYPES.SELECT_3)
                    
                    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your world backup is pending...", animate:{enabled:true, time:5, return:true}})
                    sendServerMessage(
                        SERVER_MESSAGE_TYPES.FORCE_BACKUP, 
                        worlds.find((w)=> w.ens === realm)
                    )
                    let world =  worlds.find((w)=> w.ens === realm)
                    if(world){
                        world.backedUp = Math.floor(Date.now()/1000)
                    }
                }}
                uiText={{textWrap:'nowrap', value:"Back Up", color:Color4.White(), fontSize:sizeFont(25,15)}}
            />


                
        </UiEntity>

    </UiEntity>
    )
}

function HelpView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-help"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:infoView === "Help" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Green()}}
        >
            {generateButtons({slug:"help-view", buttons:buttons})}
            </UiEntity>
    )
}

let totalAssets:number = 0
let totalSize:number = 0
function AssetsView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-assets"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:infoView === "Assets" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Teal()}}
        >

        {/* totals row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiText={{value:"Total Assets: " + totalAssets, fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
                />

            </UiEntity>
             <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiText={{value:"Total Size: " + formatSize(totalSize) + "MB", fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
                />
            </UiEntity>

        </UiEntity>

                    {/* File count size container */}
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:"2%"}
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* File count size container */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: `${Math.min(parseFloat(formatSize(totalSize)), 100)}%`,
                height: '100%',
            }}
            uiBackground={{color: parseFloat(formatSize(totalSize)) / 100 > 0.75 ? Color4.Red() : Color4.Green()}}
            />

            </UiEntity>



            <IWBTable />


            </UiEntity>
    )
}

function FeedbackView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-feedback"}
            uiTransform={{
                display: infoView === "Feedback" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
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
                margin:{top:"3%", bottom:'1%'},
            }}
            uiText={{value:"Feedback", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
            />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
                margin:{top:"3%", bottom:'1%'},
            }}
            >

            <Input
            onChange={(value) => {
                feedback = value
            }}
            fontSize={sizeFont(20,15)}
            color={Color4.White()}
            placeholder={'please type your feedback for our team!'}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '90%',
                height: '100%',
            }}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlack)).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                setUIClicked(true)
                playSound(SOUND_TYPES.SELECT_3)

                console.log('localplayer.name =', localPlayer, localPlayer.name)
                sendServerMessage(
                    SERVER_MESSAGE_TYPES.SUBMIT_FEEDBACK, 
                    {
                        user:localUserId, 
                        name: localPlayer.dclData.name, 
                        feedback:feedback
                    }
                )
                feedback = ""
                updateInfoView("FeedbackSent")

            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            uiText={{value:"Submit", fontSize:sizeFont(25,15), color:Color4.White()}}
            />

                </UiEntity>

        </UiEntity>
    )
}

function FeedbackSentView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-feedback-sent"}
        uiTransform={{
            display: infoView === "FeedbackSent" ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
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
            margin:{top:"3%", bottom:'1%'},
        }}
        uiText={{value:"Feedback submitted!", fontSize:sizeFont(25,20), color:Color4.White(), textAlign:'middle-center'}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlack)).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        onMouseDown={()=>{
            playSound(SOUND_TYPES.SELECT_3)
            updateInfoView("Help")
        }}
        uiText={{value:"Close", fontSize:sizeFont(25,15), color:Color4.White()}}
        />

        </UiEntity>
    )
}


let tutorialVisibleIndex:number = 1
let visibleTutorials:any[] = []
let tutorialsView = "list"
let tutorial:any

export function showTutorials(){
    tutorialVisibleIndex = 1
    refreshVisibleTutorials()
}

export function refreshVisibleTutorials(){
    visibleTutorials.length = 0
    visibleTutorials = paginateArray([...iwbConfig.tutorials], tutorialVisibleIndex, 6)
}

function TutorialsView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-tutorials"}
        uiTransform={{
            display: infoView === "Tutorials" ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        >

        {/* tutorials list view */}
        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
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
                        if(tutorialVisibleIndex - 1 >= 1 ){
                            tutorialVisibleIndex--
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
                        tutorialVisibleIndex++
                        refreshVisibleTutorials()
                    }}
                    />

                    </UiEntity>

                    </UiEntity>


        </UiEntity>

    
        {/* individual tutorial view */}
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
                height: calculateSquareImageDimensions(20).height,
                margin:{top:"1%", bottom:'1%'},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: '' + (tutorial && tutorial.image ? tutorial.image : "")
                }
            }}
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
                setUIClicked(true)
                playSound(SOUND_TYPES.SELECT_3)
                displayMainView(false)
                infoView = 'Version'
                tutorialsView = 'list'
                // displayTutorialVideoControls(true)
                createTutorialVideo(tutorial)
                setUIClicked(false)
            }}
            uiText={{value:"Play Video", color:Color4.White(), fontSize:sizeFont(25,15)}}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
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
                tutorialsView = 'list'
            }}
            uiText={{value:"Go Back", color:Color4.White(), fontSize:sizeFont(25,15)}}
            />



            </UiEntity>

            </UiEntity>

            </UiEntity>


        </UiEntity>
    )
}

function AccessView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-access"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:infoView === "Access" ? 'flex' : 'none'
        }}
        >

        <IWBTable />

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
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
        >

        <Input
            onChange={(value) => {
                worldAccessUserId = value.trim()
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'enter wallet address'}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '100',
            }}
            ></Input>
            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
        >

            {generateButtons({slug:"add-world-access", buttons:[
                {label:"Add Builder", pressed:false, width:12, height:8, func:()=>{
                    if(worldAccessUserId !== ""){
                        sendServerMessage(SERVER_MESSAGE_TYPES.WORLD_ADD_BP, 
                            {
                                user:worldAccessUserId,
                            }
                        )
                    }
                    },
                }
            ]})}
            </UiEntity>

            </UiEntity>

        </UiEntity>
    )
}

function generateUpdateRows(){
    let arr:any[] = []
    if(iwbConfig && iwbConfig.updates){
        iwbConfig.updates.forEach((update:string, i:number)=>{
            arr.push(
            <UiEntity
            key={'version-update-row' + update}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"1%", bottom:'1%'},
            }}
            // uiBackground={{
            //     textureMode: 'stretch',
            //     texture: {
            //         src: 'assets/atlas2.png'
            //     },
            //     uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

            //     :

            //     getImageAtlasMapping(uiSizes.rowPillDark)
            // }}
            uiText={{value:"- " + update, fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
            >
    
            </UiEntity>
            )
        })  

        if(newItems.size > 0){
            arr.push(
                <UiEntity
                key={resources.slug + 'info-view-version-updates-row-items'}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '15%',
                    margin:{top:"1%", bottom:'1%'},
                }}
                // uiBackground={{
                //     textureMode: 'stretch',
                //     texture: {
                //         src: 'assets/atlas2.png'
                //     },
                //     uvs: getImageAtlasMapping(uiSizes.rowPillDark)
                // }}
                uiText={{value:"- New Catalog items - " + newItems.size, fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
                >
        
                </UiEntity>
                )
        }
    }
    return arr
}

function getLastBackUp(){
    let world = worlds.find((w)=> w.ens === realm)
    if(!world){
        return ""
    }
    // console.log('world is', world)
    if(world.backedUp){
        return Math.floor((Math.floor(Date.now()/1000) - world.backedUp) / 86400) + " days ago"
    }else{
       return "Never"
    }
}

export let worldAccessTableConfig:any = {
    height:'10%', width:'100%', rowCount:6,
    headerData:[
        {name:"Name", go:"Del"},
    ],
    // tableSortFn:(a:any, b:any)=>{
    //     // Check if either of the names is "Realm Lobby"
    //     if (a.name === "Realm Lobby" && b.name !== "Realm Lobby") {
    //       return -1; // "Realm Lobby" comes first
    //     } else if (a.name !== "Realm Lobby" && b.name === "Realm Lobby") {
    //       return 1; // "Realm Lobby" comes first
    //     } else {
    //       // Both names are not "Realm Lobby", sort by parcel size (high to low)
    //     //   return b.pcnt - a.pcnt;
    //     return a.name.localeCompare(b.name)
    //     }
    // },

    rowConfig:[
    { 
        key:"name",
        overrideKey:true,
        width:'90%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White(),
    },
    {
        key:"go",
        width:'10%',
        height:'80%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:{
            size:3,
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png',
                uvs:()=>{getImageAtlasMapping(uiSizes.trashButtonTrans)}
            },
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 386,
                sourceLeft: 896,
                sourceWidth: 128,
                sourceHeight: 128
            }
        },
        onClick:(user:any)=>{
            playSound(SOUND_TYPES.SELECT_3)
            sendServerMessage(SERVER_MESSAGE_TYPES.WORLD_DELETE_BP, 
                {
                    user:user,
                }
            )
        }
    },
    ]
}

export let worldAssetsTableConfig:any = {
    height:'10%', width:'100%', rowCount:6,
    tableSortFn:(a:any, b:any) => a.n.localeCompare(b.name),
    headerData:[
        {n:"Name", si:"Size", pc:"Poly Count",  go:"Del"},
    ],
    // tableSortFn:(a:any, b:any)=>{
    //     // Check if either of the names is "Realm Lobby"
    //     if (a.name === "Realm Lobby" && b.name !== "Realm Lobby") {
    //       return -1; // "Realm Lobby" comes first
    //     } else if (a.name !== "Realm Lobby" && b.name === "Realm Lobby") {
    //       return 1; // "Realm Lobby" comes first
    //     } else {
    //       // Both names are not "Realm Lobby", sort by parcel size (high to low)
    //     //   return b.pcnt - a.pcnt;
    //     return a.name.localeCompare(b.name)
    //     }
    // },

    rowConfig:[
    { 
        key:"n",
        width:'50%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White(),
    },
    { 
        key:"si",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + (formatSize(data) + "MB")
        }
    },
    { 
        key:"pc",
        width:'20%',
        height:'100%',
        margin:{left:"1%"},
        value:"",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-left',
        color:Color4.White(),
        func:(data:any)=>{
            return "" + (formatDollarAmount(data))
        }
    },
    {
        key:"go",
        width:'10%',
        height:'80%',
        margin:{left:"1%"},
        value:"Go",
        fontSize:sizeFont(25,15),
        textAlign: 'middle-center',
        color:Color4.White(),
        image:{
            size:3,
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas1.png',
                uvs:()=>{getImageAtlasMapping(uiSizes.trashButtonTrans)}
            },
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 386,
                sourceLeft: 896,
                sourceWidth: 128,
                sourceHeight: 128
            }
        },
        onClick:(item:any)=>{
            playSound(SOUND_TYPES.SELECT_3)
            displayMainView(false)
            confirmDeleteAsset(item, true)
        }
    },
    ]
}

export function getWorldPermissions(){
    return worlds.find($=> $.ens === realm) !== undefined ? [...worlds.find($=> $.ens === realm).bps] : []
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

    for(let j = 0; j < 3; j++){
        arr.push(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '100%',
            margin:{right:"1%", left:'1%'},
            display:visibleTutorials[(count * 3) + rowcount] ? "flex" : "none"
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
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: '' + visibleTutorials && visibleTutorials[(count * 3) + rowcount] ? visibleTutorials[(count * 3) + rowcount].image : ""
            }
        }}
        onMouseDown={()=>{
            playSound(SOUND_TYPES.SELECT_3)
            tutorial = visibleTutorials[count + j]
            tutorialsView = 'individual'
        }}
        />

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{top:"3%", bottom:'1%'},
        }}
        // uiText={{value:"" + (visibleItems[count + rowcount] &&  visibleItems[count + rowcount].name.substring(0,20) + "..."), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}
        uiText={{value:"" + (visibleTutorials[(count * 3) + rowcount] && addLineBreak(visibleTutorials[(count * 3) + rowcount].name, undefined, 25)), fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-center'}}

        />

        </UiEntity>
    )
    rowcount++
    }
    return arr
}

function updateWorldAssets(){
    totalAssets = 0
    totalSize = 0

    playerItemsOriginal.forEach((item)=>{
        totalAssets++
        totalSize += item.si
    })
    setTableConfig(worldAssetsTableConfig)
    updateIWBTable(playerItemsOriginal)
}