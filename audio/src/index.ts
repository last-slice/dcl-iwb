
import * as utils from "@dcl-sdk/utils"
import { inputSystem } from '@dcl/sdk/ecs'

import { MeshRenderer, engine, GltfContainer, Material, Transform, VideoPlayer, pointerEventsSystem, Animator, InputAction, MeshCollider } from '@dcl/sdk/ecs'
import { Color3, Color4, Vector3, Quaternion } from '@dcl/sdk/math'

import { BUTTONSound, playOneshot, playSound } from './sound'
//import { AnimationState, Animator, Entity } from 'decentraland-ecs'



export function main () {
   
    let tile = engine.addEntity()
    GltfContainer.create(tile, { src: 'assets/models/CityTile.glb'}) 
    Transform.create(tile, {
      position: Vector3.create(116, 0, 116),
      scale: Vector3.create(12, 1, 12), // Scale it to cover your whole scene
    
    })   


    let partyButton = engine.addEntity()
  
    MeshCollider.setBox(partyButton)
    GltfContainer.create(partyButton, { src: 'assets/models/partyButton.glb'}) 
    Transform.create(partyButton, {
      position: Vector3.create(115.57, -0.1, 171),
      scale: Vector3.create(20, 20, 20),
    
    //  Transform.create(Teleport, { position: Vector3.create(116, 1.3, 169.47), scale: Vector3.create(3, 3, 3), rotation: Quaternion.fromEulerDegrees(90, 180, 0) })
    
    
    })
    
    pointerEventsSystem.onPointerDown(
        {
          entity: partyButton, opts: {
            button: InputAction.IA_POINTER,
            hoverText: 'Party Time!'
          }
        }
        ,
        function () {
            playOneshot(BUTTONSound)
        
    
        }
      )
    }

