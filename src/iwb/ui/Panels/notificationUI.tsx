import * as utils from '@dcl-sdk/utils'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { InputAction, MeshCollider, MeshRenderer, Texture, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NOTIFICATION_DETAIL, NOTIFICATION_TYPES } from '../../helpers/types'
import { log } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { calculateImageDimensions, dimensions, getImageAtlasMapping, addLineBreak, sizeFont, calculateSquareImageDimensions } from '../helpers'

export let queue:any[] = []
export let showingNotification = false

let currentNotification:any = {
    text:"",
    image:"",
    type:NOTIFICATION_TYPES.MESSAGE,
    animating:false,
    canShow:true,
    goback:false,
    direction:0,
    start:-150,
    offset:-300
}

export function displayNotification(value:boolean){
    showingNotification = value
}

export function canShowNotifications(){
    return !currentNotification.animating && !showingNotification
}

export function wantsToShowNotifications(){
    //player settings to show notifications
    //need to fill it out
    return true
}

export function checkNotificationQueue(){
    log('checking animtation queue', queue)
    if(canShowNotifications() && wantsToShowNotifications()){//} || queue[0].forceShow){
        if(queue.length > 0){
            showingNotification = true
            let not = queue.shift()
            showNextNotification(not)
        }
    }
}

export function showNextNotification(data:NOTIFICATION_DETAIL){
    if(wantsToShowNotifications()){
        log('show next notification', data)
        hideAll()
        currentNotification.text = data.message
        currentNotification.type = data.type
        currentNotification.image = data.image ? data.image : ""
        startAnimating(data.animate)
    }
}

export function hideAll(){
    currentNotification.showing = false
    currentNotification.animating = false
    currentNotification.goback = false
    currentNotification.offset = -150
    currentNotification.direction = 0
    engine.removeSystem(animateNotification)
}

/**
     *
     * @typedef {Object} NOTIFICATION_DETAIL - Object with data for displaying an image
     */
export function showNotification(data:NOTIFICATION_DETAIL){
    queue.push(data)
    checkNotificationQueue()
}

export function updateCurrentNotification(data:NOTIFICATION_DETAIL){
    showNotification(data)
}

export function hideNotification(){
    log('hiding notification')
    currentNotification.direction = 2
    engine.addSystem(animateNotification)
}

function startAnimating(animate:any){
    currentNotification.goback = animate.return
    animate.time ? currentNotification.goBackTime = animate.time : currentNotification.goBackTime = 5
    currentNotification.direction = 1
    engine.removeSystem(animateNotification)
    engine.addSystem(animateNotification)
}

export function updateOffset(){

}

function checkBounceBack(){
    log('ending notificatoin move')
    engine.removeSystem(animateNotification)
    if(currentNotification.goback){

        utils.timers.setTimeout(()=>{
            currentNotification.goback = false
            currentNotification.goBackTime = 0
            hideNotification()
        }, currentNotification.goBackTime * 1000)
    }
    // else{
    //     currentNotification.showing = false
    //     currentNotification.animating = false
    //     hideAll()
    //     checkNotificationQueue()
    // }
}


export function animateNotification(dt:number){
    showingNotification = true
    if(currentNotification.direction == 1){
        if(currentNotification.offset <= 20){
            currentNotification.offset += 20
            currentNotification.animating = true
        }
        else{
            checkBounceBack()
        }
    }
    else{
        currentNotification.goback = false
        if(currentNotification.offset >= currentNotification.start){
            currentNotification.offset -= 20
            currentNotification.animating = true
        }
        else{
            engine.removeSystem(animateNotification)
            showingNotification = false
            currentNotification.animating = false
            hideAll()
            checkNotificationQueue()
        }
    }
}


export function createNotificationUI(){
    return (
      <UiEntity key={"notificationui"}
        uiTransform={{
          width: calculateImageDimensions(40, 824/263).width,
          height: calculateImageDimensions(40, 824/263).height,
          display: showingNotification ? 'flex' : 'none',
          justifyContent:'center',
          flexDirection:'column',
          alignItems:'center',
          alignContent:'center',
          positionType:'absolute',
          position:{left:(dimensions.width - calculateImageDimensions(40, 824/263).width) / 2, top:currentNotification.offset}
        }}
        uiBackground={{
          texture:{
              src:resources.textures.atlas2
          },
          textureMode: 'stretch',
          uvs:getImageAtlasMapping({
            atlasHeight:1024,
            atlasWidth:1024,
            sourceTop:0,
            sourceLeft:0,
            sourceWidth:824,
            sourceHeight:263
        })
        }}
      >
  
  
  {/* basic message view */}
  <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          display: currentNotification.type === NOTIFICATION_TYPES.MESSAGE ? 'flex' : 'none',
          alignSelf:'center'
        }}
        uiText={{color:Color4.Black(), value: addLineBreak(currentNotification.text, undefined, 25), fontSize:sizeFont(35,25)}}
      >
        
          </UiEntity>


  {/* image message view */}
  <UiEntity
        uiTransform={{
          width: '95%',
          height: '75%',
          display: currentNotification.type === NOTIFICATION_TYPES.IMAGE ? 'flex' : 'none',
          flexDirection:'row',
          justifyContent:'center',
          alignContent:'center',
          alignItems:'center'
        }}
        // uiBackground={{color:Color4.Red()}}
      >

        {/* noticiation image panel */}
  <UiEntity
        uiTransform={{
          width: '25%',
          height: '100%',
          flexDirection:'column',
          justifyContent:'center',
          alignContent:'center',
          alignItems:'center',
          margin:{left:"3%", bottom:"2%"}
        }}
      >

        {/* image box */}
          <UiEntity
        uiTransform={{
          width: calculateSquareImageDimensions(11).width,
          height: calculateSquareImageDimensions(11).width,
          display:'flex'
        }}
        uiBackground={{
            texture:{
                src: resources.endpoints.proxy + currentNotification.image
            },
            textureMode: 'stretch',
            uvs:getImageAtlasMapping({
                atlasHeight:512,
                atlasWidth:512,//
                sourceTop:0,
                sourceLeft:0,
                sourceWidth:512,
                sourceHeight:512
              })
          }}
      />

    </UiEntity>

    <UiEntity
        uiTransform={{
          width: '85%',
          height: '100%',
          display: currentNotification.type === NOTIFICATION_TYPES.IMAGE ? 'flex' : 'none',
          alignSelf:'center',
          padding:{left:"5%"}
        }}
        uiText={{color:Color4.Black(), value: addLineBreak(currentNotification.text, undefined, 35), fontSize:sizeFont(35,25)}}
      />
</UiEntity>

</UiEntity>

    )
  }