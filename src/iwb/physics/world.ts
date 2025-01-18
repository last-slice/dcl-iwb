import { addCannonMaterial, cannonMaterials } from '../components/Physics';
import { CANNON } from '../helpers/libraries';

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

  // Set restitution to 0 to avoid bouncing
  const carGroundContactMaterial = new CANNON.ContactMaterial(vehicleMaterial, groundMaterial, {
    friction: 0.8,    // Adjust friction as needed for grip
    restitution: 0.0  // No bounce
  });
  world.addContactMaterial(carGroundContactMaterial);
  world.addBody(groundBody)
}
