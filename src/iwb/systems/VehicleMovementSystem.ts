import { tweenSystem } from "@dcl/sdk/ecs";
import { testVehicles, tweenToHeading, tweenToPosition } from "../components/Vehicle";
import { colyseusRoom, connected } from "../components/Colyseus";
import { COMPONENT_TYPES } from "../helpers/types";//


export function VehicleMovementSystem(dt:number){
	if(connected){
		colyseusRoom.state.scenes.forEach((scene:any, aid:string)=>{
			scene[COMPONENT_TYPES.VEHICLE_COMPONENT].forEach((vehicle:any, aid:string)=>{
				// Increase Tween TimeSince
				vehicle.timeSinceLastTweenPos += (dt * 1000)
				vehicle.timeSinceLastTweenRot += (dt * 1000) 

				// Handle POS tweens
				// Check if PosTween has completed or if the timesincelasttween is excessive
				const posTweenCompleted = tweenSystem.tweenCompleted(vehicle.entityPos)
				if (posTweenCompleted || (vehicle.timeSinceLastTweenPos > vehicle.timeToNextTweenPos)) {
					
					//console.log(vehicle.modelName, vehicle.vehicleID, "posTw", vehicle.timeSinceLastTweenPos, "starting new tween")	
					
					tweenToPosition(vehicle)
				}	
				
				// Handle ROT tweens
				// Check if RotTween has completed or if the timesincelasttween is excessive
				const rotTweenCompleted = tweenSystem.tweenCompleted(vehicle.entityRot)
				if (rotTweenCompleted || (vehicle.timeSinceLastTweenRot > vehicle.timeToNextTweenRot)) {
						
					//console.log(vehicle.modelName, vehicle.vehicleID, "rotTw", vehicle.timeSinceLastTweenRot, "starting new tween")	
					
					// Start a separate tween on the entityRot (Child) to rotate it
					// vehicle.tweenToHeading()
					tweenToHeading(vehicle)
				}
			})
		})
	}

    // testVehicles.forEach((vehicle)=>{
    //     // if(vehicle.active){
    //         // Increase Tween TimeSince
	// 		vehicle.timeSinceLastTweenPos += (dt * 1000)
	// 		vehicle.timeSinceLastTweenRot += (dt * 1000) 

    //         // Handle POS tweens
	// 		// Check if PosTween has completed or if the timesincelasttween is excessive
	// 		const posTweenCompleted = tweenSystem.tweenCompleted(vehicle.entityPos)
	// 		if (posTweenCompleted || (vehicle.timeSinceLastTweenPos > vehicle.timeToNextTweenPos)) {
				
	// 			//console.log(vehicle.modelName, vehicle.vehicleID, "posTw", vehicle.timeSinceLastTweenPos, "starting new tween")	
				
	// 			tweenToPosition(vehicle)
	// 		}	
			
	// 		// Handle ROT tweens
	// 		// Check if RotTween has completed or if the timesincelasttween is excessive
	// 		const rotTweenCompleted = tweenSystem.tweenCompleted(vehicle.entityRot)
	// 		if (rotTweenCompleted || (vehicle.timeSinceLastTweenRot > vehicle.timeToNextTweenRot)) {
					
	// 			//console.log(vehicle.modelName, vehicle.vehicleID, "rotTw", vehicle.timeSinceLastTweenRot, "starting new tween")	
				
	// 			// Start a separate tween on the entityRot (Child) to rotate it
	// 			// vehicle.tweenToHeading()
    //             tweenToHeading(vehicle)
	// 		}
    //     // }
    // })
}