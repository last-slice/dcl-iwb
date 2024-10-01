import { inputSystem, InputAction, PointerEventType, Transform, engine } from "@dcl/sdk/ecs";
import { playerMode } from "../components/Config";
import { localPlayer, localUserId } from "../components/Player";
import { COMPONENT_TYPES, SCENE_MODES } from "../helpers/types";
import { accelerateVehicle, applyVehiceForce, decelerateVehicle, setTargetHeading, testVehicles, turning, updateVehicleDirection, updateVehicleSpeed } from "../components/Vehicle";
import { Quaternion } from "@dcl/sdk/math";
import { colyseusRoom, connected } from "../components/Colyseus";


export function VehicleInputSystem(dt:number){
    if(!localPlayer || playerMode !== SCENE_MODES.PLAYMODE || !connected){//
        return
    }

    colyseusRoom.state.scenes.forEach((scene:any, aid:string)=>{
        scene[COMPONENT_TYPES.VEHICLE_COMPONENT].forEach((vehicle:any, aid:string)=>{
            if(vehicle.driver === localUserId){
                // Handle acceleration/deceleration inputs
                if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
                    accelerateVehicle(vehicle)
                } 
                
                if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
                    decelerateVehicle(vehicle)
                }
            
                if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)) {
                    decelerateVehicle(vehicle)
                } 
            
            
                if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
                    turning(vehicle, 1)
                } 
            
                if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_UP)) {
                    turning(vehicle, 0)
                } 
            
                if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)) {
                    turning(vehicle, 2)
                } 
            
                if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_UP)) {
                    turning(vehicle, 0)
                } 
            
                applyVehiceForce(vehicle)
            
                // const cameraEulerRot  = Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation)
                // setTargetHeading(cameraEulerRot.y)
                // console.log(cameraEulerRot.y)
            
                updateVehicleSpeed(vehicle, dt)
                updateVehicleDirection(vehicle)
            }
        })
    })


    ///test cars
    // testVehicles.forEach((vehicle:any, aid:string)=>{
    //     // if(vehicle.driver === localUserId){
    //         if (inputSystem.isTriggered(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)) {
    //             leaveVehicle()
    //         } 

    //         if(vehicle.active){
    //             // Handle acceleration/deceleration inputs
    //             if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
    //                 if(vehicle.forward){
    //                     accelerateVehicle()
    //                 }else{
    //                     decelerateVehicle()
    //                 }
                    
    //             } 

    //             if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
    //                 if(vehicle.forward){
    //                     decelerateVehicle()
    //                 }else{
    //                     accelerateVehicle()
    //                 }
    //             }

    //             // Handle acceleration/deceleration inputs
    //             if (inputSystem.isTriggered(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)) {
    //                 if(vehicle.currentSpeed === 0){
    //                     vehicle.forward = !vehicle.forward
    //                 }
    //             } 

    //             if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)) {
    //                 decelerateVehicle()
    //             } 


    //             if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
    //                 turning(1)
    //             } 

    //             if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_UP)) {
    //                 turning(0)
    //             } 

    //             if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)) {
    //                 turning(2)
    //             } 

    //             if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_UP)) {
    //                 turning(0)
    //             } 
    //         }
        
    //         applyVehiceForce(dt)
        
    //         // const cameraEulerRot  = Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation)
    //         // setTargetHeading(cameraEulerRot.y)
    //         // console.log(cameraEulerRot.y)
        
    //         updateVehicleSpeed(dt)
    //         updateVehicleDirection(dt)
    //     // }
    // })


}