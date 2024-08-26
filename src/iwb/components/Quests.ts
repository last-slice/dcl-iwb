
import { createQuestsClient, QuestInstance } from '@dcl/quests-client'
import { createQuestHUD } from '@dcl/quests-client/dist/hud'

// const serviceUrl = 'wss://quests-rpc.decentraland.zone'
const serviceUrl = 'wss://quests-rpc.decentraland.org'
export let quests:any[] = []
export let questClients:Map<string, any> = new Map()

const questHud = createQuestHUD({autoRender:true})

export function setServerQuests(serverQuests:any[]){
    // console.log('server quests are ', serverQuests)
    quests = serverQuests
    quests.forEach((quest:any)=>{
      quest.started = false
    })
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