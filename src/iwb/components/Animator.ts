import { Animator } from "@dcl/sdk/ecs"
import { COMPONENT_TYPES } from "../helpers/types"

export function setAnimationBuildMode(scene:any, entityInfo:any){
    console.log('setting animator build mode', entityInfo)
    let animatorInfo = scene[COMPONENT_TYPES.ANIMATION_COMPONENT].get(entityInfo.aid)
    if(animatorInfo){
        if(!Animator.has(entityInfo.entity)){
             //need to do some resetting
            let animations:any[] = []
            animatorInfo.states.forEach((state:any)=>{
                animations.push(state)
            })

            Animator.createOrReplace(entityInfo.entity, {
                states:animations
            })
        }
        Animator.stopAllAnimations(entityInfo.entity, true)
        // Animator.deleteFrom(entityInfo.entity)

       
    }
}

export function setAnimationPlayMode(scene:any, entityInfo:any){
    console.log('setting animator play mode')
    let animatorInfo = scene[COMPONENT_TYPES.ANIMATION_COMPONENT].get(entityInfo.aid)
    if(animatorInfo){
        Animator.deleteFrom(entityInfo.entity)

        let animations:any[] = []
        animatorInfo.states.forEach((state:any)=>{
            animations.push(state)
        })

        Animator.createOrReplace(entityInfo.entity, {
            states:animations
        })
    }
}


export function disableAnimationPlayMode(scene:any, entityInfo:any){
    console.log('disable animator play mode')
    let itemInfo = scene[COMPONENT_TYPES.ANIMATION_COMPONENT].get(entityInfo.aid)
    if(itemInfo && Animator.has(entityInfo.entity)){
        console.log('stopping all animations')
        Animator.stopAllAnimations(entityInfo.entity, true)
    }
}
