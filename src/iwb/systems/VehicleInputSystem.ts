import { inputSystem, InputAction, PointerEventType, Transform, engine } from "@dcl/sdk/ecs";
import { playerMode } from "../components/Config";
import { localPlayer } from "../components/Player";
import { SCENE_MODES } from "../helpers/types";
import { accelerateVehicle, applyVehiceForce, decelerateVehicle, leaveVehicle, setTargetHeading, turning, updateVehicleDirection, updateVehicleSpeed } from "../components/Vehicle";
import { Quaternion } from "@dcl/sdk/math";


export function VehicleInputSystem(dt:number){
    // if(!localPlayer || playerMode !== SCENE_MODES.PLAYMODE || !localPlayer.inVehicle){
    //     return
    // }


    if (inputSystem.isTriggered(InputAction.IA_JUMP, PointerEventType.PET_DOWN)) {
        leaveVehicle()
    } 

    // Handle acceleration/deceleration inputs
    if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_DOWN)) {
        accelerateVehicle()
    } 
    
    if (inputSystem.isTriggered(InputAction.IA_FORWARD, PointerEventType.PET_UP)) {
        decelerateVehicle()
    }

    if (inputSystem.isTriggered(InputAction.IA_BACKWARD, PointerEventType.PET_DOWN)) {
        decelerateVehicle()
    } 


    if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_DOWN)) {
        turning(1)
    } 

    if (inputSystem.isTriggered(InputAction.IA_LEFT, PointerEventType.PET_UP)) {
        turning(0)
    } 

    if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_DOWN)) {
        turning(2)
    } 

    if (inputSystem.isTriggered(InputAction.IA_RIGHT, PointerEventType.PET_UP)) {
        turning(0)
    } 

    applyVehiceForce(dt)

    // const cameraEulerRot  = Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation)
    // setTargetHeading(cameraEulerRot.y)
    // console.log(cameraEulerRot.y)

    updateVehicleSpeed(dt, localPlayer)
    updateVehicleDirection(dt)
}