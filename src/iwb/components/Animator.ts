import { Animator } from "@dcl/sdk/ecs"

export function setAnimationBuildMode(scene:any, entityInfo:any){
    let animatorInfo = scene.animators.get(entityInfo.aid)
    if(animatorInfo){
        Animator.stopAllAnimations(entityInfo.entity, true)
        // Animator.deleteFrom(entityInfo.entity)

        //need to do some resetting
        // let animations:any[] = []
        // animatorInfo.states.forEach((state:any)=>{
        //     animations.push(state)
        // })

        // Animator.createOrReplace(entityInfo.entity, {
        //     states:animations
        // })
    }
}

export function setAnimationPlayMode(scene:any, entityInfo:any){
    let animatorInfo = scene.animators.get(entityInfo.aid)
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
    let itemInfo = scene.animators.get(entityInfo.aid)
    if(itemInfo){
        Animator.has(entityInfo.entity) ? Animator.stopAllAnimations(entityInfo.entity, true) : null
    }
}
