import * as CANNON from 'cannon/build/cannon'

export let ballPhysicsMaterial:CANNON.Material
export const wallShape = new CANNON.Box(new CANNON.Vec3(64, 64, 1))
export let wallNorth:any

export function loadPhysicsWorld(world: CANNON.World): void {

  // loadWalls(world)

  const groundPhysicsMaterial = new CANNON.Material('groundMaterial')
  const groundPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, groundPhysicsMaterial, {
    friction: 0.5,
    restitution: 0.33
  })
  world.addContactMaterial(groundPhysicsContactMaterial)

  // Create a ground plane and apply physics material//
  const groundBody: CANNON.Body = new CANNON.Body({
    mass: 0, // mass === 0 makes the body static,
    // shape: new CANNON.Box(new CANNON.Vec3(64, 64, 1)),
    // position: new CANNON.Vec3(32, 27, 32)
  })
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis

  const groundShape: CANNON.Plane = new CANNON.Plane()
  groundBody.addShape(groundShape)
  groundBody.material = groundPhysicsMaterial
  world.addBody(groundBody)

  ballPhysicsMaterial = new CANNON.Material('ballMaterial')
  const ballPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, ballPhysicsMaterial, {
    friction: 0.4,
    restitution: 0.75
  })
  world.addContactMaterial(ballPhysicsContactMaterial)
}

function loadWalls(world:CANNON.World){
    // Invisible walls
    //   wallNorth = new CANNON.Body({
    //   mass: 0,
    //   shape: wallShape,
    //   position: new CANNON.Vec3(16, 0, 16)
    // })
    // world.addBody(wallNorth)
  
    const wallSouth = new CANNON.Body({
      mass: 0,
      shape: wallShape,
      position: new CANNON.Vec3(16, 0, 0)
    })
    world.addBody(wallSouth)
  
    const wallWest = new CANNON.Body({
      mass: 0,
      shape: wallShape,
      position: new CANNON.Vec3(0, 0, 16)
    })
    wallWest.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    world.addBody(wallWest)
  
    // const wallEast = new CANNON.Body({
    //   mass: 0,
    //   shape: wallShape,
    //   position: new CANNON.Vec3(16, 0, 16)
    // })
    // wallEast.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    // world.addBody(wallEast)


  //   world.addEventListener("beginContact", function(event:any) {
  //     // if ((event.bodyA === ballBody && event.bodyB === wallBody) ||
  //     //     (event.bodyB === ballBody && event.bodyA === wallBody)) {
  //     //     console.log("Ball has hit the wall!");
  //     // }

  //     console.log("Ball has hit the wall!");
  // });
}
