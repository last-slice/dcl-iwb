
import { createQuestsClient, QuestInstance } from '@dcl/quests-client'
import { createQuestHUD } from '@dcl/quests-client/dist/hud'
import { localPlayer } from './Player'
import { showNotification } from '../ui/Objects/NotificationPanel'
import { COMPONENT_TYPES, NOTIFICATION_TYPES, PlayerQuest, PrerequisiteType, Quest, QUEST_PREREQUISITES, QuestStep, SERVER_MESSAGE_TYPES, StepCompletionPrerequisite, Triggers } from '../helpers/types'
import { Player } from '~system/Players'
import { updateQuestPanel } from '../ui/Objects/QuestPanel'
import { colyseusRoom, sendServerMessage } from './Colyseus'
import { runGlobalTrigger, runSingleTrigger } from './Triggers'
import { getEntity } from './IWB'

// const serviceUrl = 'wss://quests-rpc.decentraland.zone'//
const serviceUrl = 'wss://quests-rpc.decentraland.org'
export let quests:any[] = []
export let questConditions:any[] = []
export let questClients:Map<string, any> = new Map()

// const questHud = createQuestHUD({autoRender:true})


export function checkQuestComponent(scene:any, entityInfo:any, data?:any){
  let itemInfo = scene[COMPONENT_TYPES.QUEST_COMPONENT].get(entityInfo.aid)
  if(itemInfo){
    console.log('quest component is', itemInfo)
  }
}

export async function questListener(scene:any){
  scene[COMPONENT_TYPES.QUEST_COMPONENT].onAdd(async (quest:any, aid:any)=>{
      let info = getEntity(scene, aid)
      if(!info){
          return
      }

     await setServerQuests(scene.id, [{quest:quest, aid:aid}])
     console.log('getting qeusts for player')
     sendServerMessage(SERVER_MESSAGE_TYPES.QUEST_PLAYER_DATA, {sceneId:scene.id, aid:aid})


     quest.listen("name", (current:any, previous:any)=>{
      updateQuestMetaData(scene.id, quest, aid)
     })
     quest.listen("description", (current:any, previous:any)=>{
      updateQuestMetaData(scene.id, quest, aid)
     })
     quest.listen("enabled", (current:any, previous:any)=>{
      updateQuestMetaData(scene.id, quest, aid)
     })
  })

  scene[COMPONENT_TYPES.QUEST_COMPONENT].onRemove(async (quest:any, aid:any)=>{
    console.log('quest componenent removed', aid)
    let info = getEntity(scene, aid)
    if(!info){
        return
    }

    let localQuestIndex = quests.findIndex($=> $.aid === aid)
    console.log('quest index is', localQuestIndex)
    if(localQuestIndex >=0){
      quests.splice(localQuestIndex, 1)
    }

  })
}

export function updateQuestMetaData(sceneId:string, quest:any, aid:string){
  let localQuest = quests.find($=> $.aid === aid)
  if(!localQuest){
    console.log('local quest to update not found')
    return
  }

  localQuest.name = quest.name
  localQuest.description = quest.description
  localQuest.enabled = quest.enabled
  sendServerMessage(SERVER_MESSAGE_TYPES.QUEST_STEP_DATA, {sceneId:sceneId, aid:aid})
}

export function setServerQuests(sceneId:string, serverQuests:any[]){
    console.log('server quests are ', serverQuests)
    serverQuests.forEach((info:any)=>{
      let quest:any = {...info.quest}
      quest.sceneId = sceneId
      quest.started = false
      quest.playerData = {}
      quest.steps = []
      quest.prerequisites = []
      quest.aid = info.aid
      quests.push(quest)
      sendServerMessage(SERVER_MESSAGE_TYPES.QUEST_STEP_DATA, {sceneId:sceneId, aid:info.aid})
    })
}

export function setQuestSteps(aid:string, steps:QuestStep[]){
  let quest = quests.find($=> $.aid === aid)
  if(!quest){
    return
  }
  quest.steps = steps
  console.log('quest is updated with steps', quest)
}

export function setQuestPlayerData(aid:string, data:any){
  console.log('local quests are', quests)
  let quest = quests.find($=> $.aid === aid)
  if(!quest){
    console.log('did not find local quest to set player data')
    return
  }
  quest.playerData = data
}

export function removeQuest(id:string){
  let questIndex = quests.findIndex(q=> q.id === id)
  if(questIndex >= 0) quests.splice(questIndex, 1)
}

export function setServerConditions(data:any[]){
  console.log('server conditions are ', data)
  data.forEach(condition=> {
    questConditions.push(condition)
  })
}

export function removeCondition(id:string){
  let index = questConditions.findIndex(q=> q.id === id)
  if(index >= 0) questConditions.splice(index, 1)
}

export function getQuest(questId: string): PlayerQuest | undefined {
  let quest = quests.find((quest:any) => quest.id === questId)//
  if(!quest){
    return undefined
  }
  return quest.playerData;
}


export function startQuest(quest:any){
  let localQuest = quests.find((q => q.aid === quest.id))
  if(!localQuest){
    console.log('no local quest found')
    return
  }
  let scene = colyseusRoom.state.scenes.get(localQuest.sceneId)
  if(!scene){
    console.log('no scene for that quest to start from')
    return
  }
  
  let entityInfo = getEntity(scene, quest.id)
  if(!entityInfo){
    console.log('no entity for that quest')
    return
  }

  localQuest.started = true
  localQuest.playerData = quest

  showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You started the " + localQuest.name + " Quest!", animate:{enabled:true, return:true, time:3}})
  runSingleTrigger(entityInfo, Triggers.ON_QUEST_START, {input:0, pointer:0, quest:localQuest.aid})
}

export function updateQuestsDefinitions(updates:any[]){
  updates.forEach((questUpdate:any)=>{
    let quest = quests.find($ => $.id === questUpdate.id)
    if(quest){
      quest.definition = questUpdate.definition//
    }
  })
}


export async function initQuestClients(){
  try {
    let activeQuests = quests.filter(($:any)=> $.active)
    activeQuests.forEach(async(quest:any)=>{
        const questsClient = await createQuestsClient(serviceUrl, quest.id)
        console.log('Quest Client is ready to use!')
        questClients.set(quest.id, questsClient)
        // questsClient.abortQuest

        const currentProgress = questsClient.getQuestInstance()
        if (currentProgress) {
          quest.started = true
          console.log("quest has already been started", quest.name)
        }else{
          console.log("quest has not already been started", quest.name)
        }

        questsClient.onStarted((quest: QuestInstance) => {
          console.log('quest has started', quest)
        })

        questsClient.onUpdate((quest: QuestInstance) => {
          console.log('quest update ->', quest)
        })
    })
  } catch (e) {
    console.error('Quest Client Error on connecting to Quests Service')
  }
}

export async function attemptStartQuest(id:string){
  console.log('attempting quest start ', id)
  let questClient = questClients.get(id)
  if(questClient){
    try {
      const result = await questClient.startQuest()
      if (result) {
        console.log('Quest started successfully!')
        let quest = quests.find($ => $.id === id)
        if(quest){
          quest.started = true
        }
      } else {
        console.error("Quest couldn't be started")
      }
    } catch (e) {
      console.error('Error on connecting to Quests Service')
    }
  }
}

export async function abortQuest(id:string){
  console.log('attempting quest abort ', id)//
  let questClient = questClients.get(id)
  if(questClient){
    try {
      const result = await questClient.abortQuest()
      if (result) {
        console.log('Quest aborted successfully!')
        let quest = quests.find($ => $.id === id)
        if(quest){
          quest.started = false
        }
      } else {
        console.error("Quest couldn't be aborted")
      }
    } catch (e) {
      console.error('Error on connecting to Quests Service')
    }
  }
}

// Helper function to check if all prerequisites are met for a step (simplified for client-side)//
export function prerequisitesMet(player: Player, prerequisites: QUEST_PREREQUISITES[]): boolean {
  if (!prerequisites || prerequisites.length === 0) {
    return true;  // No prerequisites means the step is available
  }

  // Loop through each prerequisite to check if it's met
  for (const prereq of prerequisites) {
    switch (prereq.type) {
      case PrerequisiteType.Level:
        // if (player.level < prereq.value) {
        //   return false;
        // }
        break;
      case PrerequisiteType.Item:
        // if (!player.hasItem(prereq.value)) {
        //   return false;
        // }
        break;
      case PrerequisiteType.QuestCompletion:
        const questId = String(prereq.value);  // Ensure the ID is a string//
        const completedQuest = getQuest(questId);
        if (!completedQuest || completedQuest.status !== 'completed') {
          return false;
        }
        break;
      case PrerequisiteType.StepCompletion:
        const stepPrerequisite = prereq as StepCompletionPrerequisite
        console.log('checking step prereq', stepPrerequisite)
        const questForStep = getQuest(stepPrerequisite.questId);
        console.log("quest for step is", questForStep)
        if (!questForStep || !questForStep.completedSteps.includes(stepPrerequisite.value)) {
          return false;
        }
        break;
      default:
        return false;
    }
  }

  return true;  // All prerequisites are met
}

export function handlePlayerQuestAction(questId:string, quest:Quest){
    console.log('handle player quest action', quest)//
    let localQuest = quests.find((q => q.id === questId))
    if(!localQuest){
      return
    }

    localQuest.playerData = quest
    updateQuestPanel(localQuest)
}

export function handlePlayerCompleteQuest(questId:string){
  let localQuest = quests.find((q => q.aid === questId))
    if(!localQuest){
      return
    }

    console.log('local quest is', localQuest)

  let scene = colyseusRoom.state.scenes.get(localQuest.sceneId)
  if(!scene){
    console.log('no scene found')
    return
  }
  let entityInfo = getEntity(scene, questId)
  if(!entityInfo){
    console.log('no quest entity to run trigger')
    return
  }
  runSingleTrigger(entityInfo, Triggers.ON_QUEST_COMPLETE, {input:0, pointer:0, quest:localQuest.aid})
}