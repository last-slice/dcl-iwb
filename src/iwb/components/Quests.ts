
import { createQuestsClient, QuestInstance } from '@dcl/quests-client'
import { createQuestHUD } from '@dcl/quests-client/dist/hud'
import { localPlayer } from './Player'
import { showNotification } from '../ui/Objects/NotificationPanel'
import { NOTIFICATION_TYPES, PlayerQuest, PrerequisiteType, Quest, QUEST_PREREQUISITES, StepCompletionPrerequisite, Triggers } from '../helpers/types'
import { Player } from '~system/Players'
import { updateQuestPanel } from '../ui/Objects/QuestPanel'
import { colyseusRoom } from './Colyseus'
import { runGlobalTrigger } from './Triggers'

// const serviceUrl = 'wss://quests-rpc.decentraland.zone'
const serviceUrl = 'wss://quests-rpc.decentraland.org'
export let quests:any[] = []
export let questConditions:any[] = []
export let questClients:Map<string, any> = new Map()

// const questHud = createQuestHUD({autoRender:true})

export function setServerQuests(serverQuests:any[]){
    console.log('server quests are ', serverQuests)
    serverQuests.forEach((quest:any)=>{
      quest.started = false
      quest.playerData = {}
      quests.push(quest)
    })
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
  let quest = quests.find((quest:any) => quest.id === questId)
  if(!quest){
    return undefined
  }
  return quest.playerData;
}


export function startQuest(quest:any){
  let localQuest = quests.find((q => q.id === quest.id))
  if(!localQuest){
    return
  }
  localQuest.started = true
  localQuest.playerData = quest
  showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"You started the " + localQuest.name + " Quest!", animate:{enabled:true, return:true, time:3}})
}

export function updateQuestsDefinitions(updates:any[]){
  updates.forEach((questUpdate:any)=>{
    let quest = quests.find($ => $.id === questUpdate.id)
    if(quest){
      quest.definition = questUpdate.definition
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

export function handlePlayerQuestAction(quest:Quest){
    console.log('handle player quest action', quest)
    let localQuest = quests.find((q => q.id === quest.id))
    if(!localQuest){
      return
    }

    localQuest.playerData = quest
    updateQuestPanel(localQuest)
}

export function handlePlayerCompleteQuest(quest:Quest){
  let localQuest = quests.find((q => q.id === quest.id))
    if(!localQuest){
      return
    }

    console.log('local quest is', localQuest)

  let scene = colyseusRoom.state.scenes.get(localQuest.scene)
  if(!scene){
    console.log('no scene found')
    return
  }
  runGlobalTrigger(scene, Triggers.ON_QUEST_COMPLETE, {input:0, pointer:0, quest:localQuest.id})
}