import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { iwbConfig, realm, worlds } from '../../../components/Config'
import resources from '../../../helpers/resources'
import { HoriztonalButtons } from '../../Reuse/HoriztonalButtons'
import { generateButtons, setUIClicked } from '../../ui'
import { mainView } from '../IWBView'
import { sendServerMessage } from '../../../components/Colyseus'
import { localUserId, localPlayer } from '../../../components/Player'
import { SOUND_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { playSound } from '../../../components/Sounds'
import { newItems } from '../../../components/Catalog'
import { IWBTable, setTableConfig, updateIWBTable } from '../../Reuse/IWBTable'

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
        // playSound(SOUND_TYPES.SELECT_3)
        // // displayStatusView("All Worlds")
        // showAllWorlds()
        // updateExploreView("All Worlds")
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
        console.log(worlds.find($=> $.ens === realm))
        updateIWBTable(getWorldPermissions())

        },
        height:6,
        width:6,
        fontBigScreen:30,
        fontSmallScreen:15,
        displayCondition:()=>{
            return localPlayer && (localPlayer.homeWorld || localPlayer.worldPermissions)
        }
    },
]
let buttons:any[] = [
    {label:"Tutorials", pressed:false, func:()=>{
        infoView = 'Tutorials'
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

            </UiEntity>
    )
}

function VersionView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-version"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:infoView === "Version" ? 'flex' : 'none'
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
        margin:{top:'5%', bottom:"1%"}
    }}
// uiBackground={{ color: Color4.Teal() }}
uiText={{value:"This World Version: " + (worlds.find((w)=> w.ens === realm) ? worlds.find((w)=> w.ens === realm).v : ""), fontSize:sizeFont(35,25), textAlign:'middle-center', color:Color4.White()}}
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
uiText={{value:"IWB Version: " + (iwbConfig.v ? iwbConfig.v : ""), fontSize:sizeFont(35,25), textAlign:'middle-center', color:Color4.White()}}
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
// uiBackground={{ color: Color4.Teal() }}
>
    {generateUpdateRows()}
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
        height: calculateImageDimensions(8,getAspect(uiSizes.buttonPillBlue)).height,
        margin:{top:"1%", bottom:'1%'},
        // display: localUserId && players.get(localUserId)!.worlds.find((w)=> w.ens === realm) ?  (players.get(localUserId)!.worlds.find((w)=> w.ens === realm).v < iwbConfig.v ? 'flex' : 'none') : "none"
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
        // displaySettingsPanel(false)
        // displaySetting("Explore")
        // showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Your deployment is processing...please wait for confirmation to refresh", animate:{enabled:true, time:7, return:true}})
        // sendServerMessage(
        //     SERVER_MESSAGE_TYPES.FORCE_DEPLOYMENT, 
        //     worlds.find((w)=> w.ens === realm)
        // )
        // displayPendingPanel(true, "deployment")
    }}
    uiText={{value:"Update", color:Color4.White(), fontSize:sizeFont(30,20)}}
    />

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

function AssetsView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-assets"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display:infoView === "Assets" ? 'flex' : 'none'
        }}
        // uiBackground={{color:Color4.Teal()}}
        >

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

function TutorialsView(){
    return(
        <UiEntity
        key={resources.slug + "-info-view-tutorials"}
        uiTransform={{
            display: infoView === "Version" ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
    // uiBackground={{ color: Color4.Teal() }}
        >
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
                width: '70%',
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
                src: 'assets/atlas2.png',
                uvs:()=>{getImageAtlasMapping(uiSizes.trashButtonTrans)}
            },
            uvs: {
                atlasHeight: 1024,
                atlasWidth: 1024,
                sourceTop: 258,
                sourceLeft: 896,
                sourceWidth: 128,
                sourceHeight: 128
            }
        },
        onClick:(user:any)=>{
            // playSound(SOUND_TYPES.SELECT_3)
            sendServerMessage(SERVER_MESSAGE_TYPES.WORLD_DELETE_BP, 
                {
                    user:user,
                }
            )
            // if(scene.init){
            //     displaySettingsPanel(false)
            //     displaySetting("Explore")
            //     displayRealmTravelPanel(true, scene)
            // }else{
            //     displaySettingsPanel(false)
            //     displayInitalizeWorldPanel(true, scene)
            // }
        }
    },
    ]
}

export function getWorldPermissions(){
    return worlds.find($=> $.ens === realm) !== undefined ? [...worlds.find($=> $.ens === realm).bps] : []
}