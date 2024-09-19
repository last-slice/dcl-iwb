import * as CANNON from 'cannon/build/cannon'
import { addCannonMaterial, cannonMaterials } from '../components/Physics';

export async function loadPhysicsWorld(world: CANNON.World) {
  let groundMaterial = addCannonMaterial("ground")
  let vehicleMaterial = addCannonMaterial("vehicle")
  addCannonMaterial("player")

  const groundBody: CANNON.Body = new CANNON.Body({
    mass: 0, // mass === 0 makes the body static,
    material: groundMaterial,
    shape:new CANNON.Plane()
  })
  groundBody.position.set(0, 0, 0); // X = 0, Y = -1 (down by 1), Z = 0//
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis

  groundBody.collisionFilterGroup = 1; // We'll use 1 for terrain, 2 for vehicles, 3 for balls
  groundBody.collisionFilterMask = 1 //| 2 | 3 | 4 | 5

  vehicleMaterial.friction    = 1
  vehicleMaterial.restitution = 0

//    // Ball-Ground contact (bouncy)
//    const playerBallContactMaterial = new CANNON.ContactMaterial(playerMaterial, ballMaterial, {
//     friction: 0.3,    // Friction when ball touches ground
//     restitution: 0.5  // High bounciness for the ball
//   }
// );

//     // Ball-Ground contact (bouncy)
//     let ground = 
//   const ballGroundContactMaterial = new CANNON.ContactMaterial(ballMaterial, cannonMaterials.get("ground"), {
//       friction: 0.4,    // Friction when ball touches ground
//       restitution: 0.8  // High bounciness for the ball
//     }
//   );

//   const groundPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, groundPhysicsMaterial, {
//     friction: 0.5,
//     restitution: 0.1
//   })

//   const playerWallContactMaterial = new CANNON.ContactMaterial(
//     playerMaterial,   // Player material
//     wallPhysicsMaterial,     // Wall material//
//     {
//       friction: 1,     // Friction to simulate pushing force
//       restitution: 0   // Little bounce (optional)
//     }
//   );

//   const playerVehicleContactMaterial = new CANNON.ContactMaterial(
//     playerMaterial,   // Player material
//     vehiclePhysicsMaterial,     // Wall material
//     {
//       friction: 1,     // Friction to simulate pushing force
//       restitution: 1   // Little bounce (optional)
//     }
//   );

  // Set restitution to 0 to avoid bouncing
  const carGroundContactMaterial = new CANNON.ContactMaterial(vehicleMaterial, groundMaterial, {
    friction: 0.8,    // Adjust friction as needed for grip
    restitution: 0.0  // No bounce
  });

  // world.addContactMaterial(playerBallContactMaterial)
  // // Add the contact material to the world
  world.addContactMaterial(carGroundContactMaterial);

  // world.addContactMaterial(playerVehicleContactMaterial)
  // world.addContactMaterial(playerWallContactMaterial)
  // world.addContactMaterial(groundPhysicsContactMaterial)
  // world.addContactMaterial(ballGroundContactMaterial)


  world.addBody(groundBody)
}
