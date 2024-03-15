import { Animator, GltfContainer, InputAction, MeshCollider, MeshRenderer, TextAlignMode, TextShape, Transform, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import { localPlayer } from "../../player/player";
import { showNotification } from "../../../ui/Panels/notificationUI";
import { NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from "../../../helpers/types";
import * as crypto from 'dcl-crypto-toolkit'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { sendServerMessage } from "../../messaging";
import { sceneBuilds, scenesLoaded } from "../../scenes";
import { utils } from "../../../helpers/libraries";
import { log } from "../../../helpers/functions";
import { addMate, createBuildCompeitionUI, team } from "./ui";
import { addCustomView, customViews, redrawCustomUI, updateCustomView } from "../ui";

const MESSAGE_ACTION = "buildCompetition"

enum BUILD_TYPES {
    SIGNUP = 'signup',
    GET_SCENES = 'getscenes',
    CAST_VOTE = 'cast-vote',
    UPDATE = 'update',
    CHECK_BUILDER_EXISTS = 'check_builder_exists'
}

let room:any//

export let competitionScenes:any[] = []
export let enabled:boolean = false
export let voting:boolean = false
export let canSignup:boolean = false
export let votes:number = 3
export function createBuildCompetitionSignup(r:any){
    room = r

    addCustomView({id:MESSAGE_ACTION, view:createBuildCompeitionUI()})
    areScenesLoaded()
}

export function getEnabled(){
    return enabled
}

function areScenesLoaded(){
    if(!scenesLoaded){
        let pending = utils.timers.setTimeout(()=>{
            utils.timers.clearTimeout(pending)
            areScenesLoaded()
        },   1000 * 3)
    }else{
        createMessageListeners(room)
        sendServerMessage(SERVER_MESSAGE_TYPES.CUSTOM, {action:MESSAGE_ACTION, data:{type:BUILD_TYPES.GET_SCENES}})
        // createSignup()//
    }
}

export function addTeammate(mate:string){
    sendServerMessage(SERVER_MESSAGE_TYPES.CUSTOM, {action:MESSAGE_ACTION, data:{mate:mate, type:BUILD_TYPES.CHECK_BUILDER_EXISTS}})
}

export async function attemptSignup(){
    if(localPlayer && !localPlayer.dclData.isGuest){
        console.log('need to sign message')

          
        let eip712TypedData = {
            types: {
                EIP712Domain: domain,
                ['IWB Builder Competition Registration']: itemDefinition
            },
            domain: domainData,
            primaryType: "IWB Builder Competition Registration",
            message:  {
                Time:Math.round(Date.now()/1000) + 600
              }
        }

        let provider = createEthereumProvider()
        provider.sendAsync({
          method: 'eth_signTypedData_v4', params:[localPlayer.dclData.userId, JSON.stringify(eip712TypedData)],
          jsonrpc:'2.0',
          id: 999999999
         },async(err,res)=>{
            console.log(res)
            sendServerMessage(SERVER_MESSAGE_TYPES.CUSTOM, {action:MESSAGE_ACTION, data:{signature:res.result, message:eip712TypedData, type:BUILD_TYPES.SIGNUP, team:team}})
         })

    }else{
        showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Only Web3 wallet are eligible for sign up.", animate:{enabled:true, return:true, time:5}})
    }
}

let domain = [
    {name: "name", type: "string" },
    {name: "version", type: "string"},
    {name: "chainId", type: "uint256"}
  ]
  
  let itemDefinition = [
    {"name": 'Time', "type": 'uint256'},
  ]
  
  let domainData = {
    name: "My Dapp",
    version: "1",
    chainId: 1
  }

function createMessageListeners(room:any){
    room.onMessage(SERVER_MESSAGE_TYPES.CUSTOM, async(info:any)=>{
        log(SERVER_MESSAGE_TYPES.CUSTOM + ' received', info)
        if(info.action === MESSAGE_ACTION){
            switch(info.data.type){
                case BUILD_TYPES.CHECK_BUILDER_EXISTS:
                    if(info.data.value !== "false"){
                        addMate(info.data.value)
                    }
                    break;

                case BUILD_TYPES.GET_SCENES:
                    competitionScenes = info.data.value.scenes
                    enabled = info.data.value.enabled
                    canSignup = info.data.value.canSignup
                    voting = info.data.value.voting

                    getVotes()
                    updateUI()

                    createSigns()
                    break;

                case BUILD_TYPES.CAST_VOTE:
                    if(info.data.voteSelf){
                        showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "You cannot vote for yourself!", animate:{enabled:true, return:true, time:5}})
                    }else{
                        votes -= info.data.vote
                        showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "You voted for " + info.data.builder + "!", animate:{enabled:true, return:true, time:5}})
                        updateUI()
                    }
                    
                    break;

                case BUILD_TYPES.SIGNUP:
                    competitionScenes.push(info.data.competitionScene)
                    getNewCompetitionScene(0, info.data.sceneId)
                    break;

                case BUILD_TYPES.UPDATE:
                    switch(info.data.key){
                        case 'canSignup':
                            canSignup = info.data.value
                            break;

                        case 'enabled':
                            enabled = info.data.value
                            break;

                        case 'voting':
                            voting = info.data.value
                            break;

                        case 'decide':
                            if(info.data.winner.includes('|')){
                                console.log('we have a tie')
                                info.data.winner.replace(new RegExp('|', 'g'), ' and ');
                                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Build Competition results!\n We have a tie!" + info.data.winner, animate:{enabled:true, return:true, time:5}})
                            }else{
                                showNotification({type: NOTIFICATION_TYPES.MESSAGE, message: "Build Competition results!\nThe winner is " + info.data.winner, animate:{enabled:true, return:true, time:15}})
                            }
                            break;
                    }
                    updateUI()
                    break;
            }
        }
    })
}

function getNewCompetitionScene(count:number, sceneId:string){
    if(count < 5){
        console.log('checking new compeititon scene', sceneId)
        let scene = sceneBuilds.get(sceneId)
        if(scene){
            console.log('found scene', scene)
            attemptCreateSign(scene)
            updateUI()
        }else{
            let pending = utils.timers.setTimeout(()=>{
                utils.timers.clearTimeout(pending)
                getNewCompetitionScene(count+1, sceneId)
            },   1000 * 1)
        }
    }   
}

export function updateUI(){
    let uiIndex = customViews.findIndex((view:any)=>view.id === MESSAGE_ACTION)
    updateCustomView(uiIndex, createBuildCompeitionUI())
}

function getVotes(){
    competitionScenes.forEach((scene)=>{
        votes -= scene.votes.filter((v:any)=> v === localPlayer.dclData.userId).length
    })
}

function createSigns(){
    sceneBuilds.forEach((build, key)=>{
        attemptCreateSign(build)
    })
}

function attemptCreateSign(build:any){
    let competitionScene = competitionScenes.find((sc:any)=> sc.name === build.n)
    if(competitionScene){
        let x = parseInt(build.bpcl.split(',')[0])
        let y = parseInt(build.bpcl.split(',')[1])

        let sign = engine.addEntity()
        GltfContainer.createOrReplace(sign, {src:'assets/6978d233-3efc-452d-82c4-d105860d85c1.glb'})
        Transform.createOrReplace(sign, {position: Vector3.create(16 * x,0, 16 * y), rotation:Quaternion.fromEulerDegrees(0,180,0)})

        let label = engine.addEntity()
        TextShape.createOrReplace(label, {text: "Builder\nCompetition", textColor:Color4.White(), fontSize:3, textAlign:TextAlignMode.TAM_MIDDLE_CENTER})
        Transform.createOrReplace(label, {parent:sign, position: Vector3.create(-1.15,1.7,0), rotation:Quaternion.fromEulerDegrees(0,180,0)})

        let name = engine.addEntity()
        TextShape.createOrReplace(name, {text: "" + competitionScene.name, textColor:Color4.Green(), fontSize:1.5, textAlign:TextAlignMode.TAM_MIDDLE_CENTER})
        Transform.createOrReplace(name, {parent:sign, position: Vector3.create(-1.15,1.2,0), rotation:Quaternion.fromEulerDegrees(0,180,0)})

        let vote = engine.addEntity()
        GltfContainer.createOrReplace(vote, {src:'assets/629000ee-8e08-47bd-acc2-222df02eb1df.glb'})
        Transform.createOrReplace(vote, {parent:sign, position:Vector3.create(-1.15, .9, 0), rotation:Quaternion.fromEulerDegrees(90,0,0)})
        Animator.createOrReplace(vote)
        pointerEventsSystem.onPointerDown({
            entity: vote,
            opts:{hoverText:"Vote for scene!", button:InputAction.IA_POINTER, maxDistance:5}},
            ()=>{
                if(votes > 0){
                    sendServerMessage(SERVER_MESSAGE_TYPES.CUSTOM, 
                        {action:MESSAGE_ACTION, 
                            data:{
                                type:BUILD_TYPES.CAST_VOTE,
                                builder: competitionScene.name
                            }
                        }
                    )
                }else{
                    console.log('you have no more votes to cast!')
                }
            }
        )
    }
}
