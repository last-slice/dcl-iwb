import { Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { easeOutBack } from "../helpers/functions"
import { GunDataComponent } from "../helpers/Components"

export let isProcessingGunRay = false
export function processGunArray(){
    isProcessingGunRay = true
}

let gunRecoilAdded = false
export function addGunRecoilSystem(){
    if(!gunRecoilAdded){
        gunRecoilAdded = true
        engine.addSystem(GunRecoilSystem)
    }
}
export function removeGunRecoilSystem(){
    engine.removeSystem(GunRecoilSystem)
    gunRecoilAdded = false
}

export function GunRecoilSystem(dt:number){
    // if(weapon){
    //     //start recoil animation
    //     const gunEntites = engine.getEntitiesWith(GunDataComponent)

    //     for (const [entity, gunData] of gunEntites) {

    //         if(gunData.active){
    //             const gunTransform = Transform.getMutable(entity)     
    //             const gunDataMutable = GunDataComponent.getMutable(entity)    
                
    //             gunDataMutable.recoilFactor += gunData.recoilSpeed * dt 

    //             if(gunDataMutable.recoilFactor > 1){
    //                 //gunDataMutable.recoilFactor = 1
    //                 gunDataMutable.recoilFactor = 1
    //                 gunDataMutable.active = false
    //                 isProcessingGunRay = false
    //             }               
                
    //             //gunTransform.position = Vector3.lerp( gunDataMutable.recoilPosition, gunDataMutable.restPosition, 1 - Math.pow(1 - gunDataMutable.recoilFactor, 3))
    //             gunTransform.position = Vector3.lerp( gunDataMutable.recoilPosition, gunDataMutable.restPosition, 1 - Math.pow(1 - gunDataMutable.recoilFactor, 3))
    //             gunTransform.rotation = Quaternion.slerp( gunDataMutable.recoilRotation, gunDataMutable.restRotation,  easeOutBack(gunDataMutable.recoilFactor  ) )
    //         }
    //     }
    // }
}