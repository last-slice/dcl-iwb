import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { customSelect, itemSelect } from './CatalogPanel'
import { Entity, engine, Transform, MeshRenderer, MeshCollider, Material, PointerEvents, PointerEventType, InputAction } from '@dcl/ecs'
import { createObject } from '../helpers/selectedObject'
import { getPlayerPosition } from '@dcl-sdk/utils'
import { dimensions } from './helpers'

export let showToolPanel = false

export function displayToolPanel(value: boolean) {
  showToolPanel = value
}

export function createToolPanel() {
  return (
    <UiEntity
      key={"toolpanel"}
      uiTransform={{
        display: showToolPanel ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions.width * .5,
        height: dimensions.height * .1,
        positionType: 'absolute',
        position: { right: (dimensions.width - (dimensions.width * .5)) / 2, bottom: "1%" }
      }}
      uiBackground={{ color: Color4.Red() }}
    >
      <Button
        uiTransform={{ width: 100, height: 50, position: { top: 0, left: 20 }, alignSelf: 'flex-start' }}
        value='Place Item'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
     

          // if (itemSelect && cubeSelect) {
          //   placeObject(1)
          // }
          // if (itemSelect && triSelect) {
          //   placeObject(2)
          // }
          // if (itemSelect && sphereSelect) {
          //   placeObject(3)
          // }
          // if (itemSelect && customSelect) {
          //   // createObject("",Vector3.create(getPlayerPosition().x,getPlayerPosition().y,getPlayerPosition().z),Vector3.create(1,1,1))

          // }
          if (!itemSelect) {
            return
          }


        }}
      />
         <Button
        uiTransform={{ width: 100, height: 50, position: { top: 0, left: 150 }, alignSelf: 'flex-start' }}
        value='Rotate'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
          // console.log("CUBE" + cubeSelect)
          // console.log("Sphere" + sphereSelect)
          // console.log("Cone" + triSelect)


        }}
      />

    </UiEntity>
  )
}

export function placeObject(Objectcode: any) {
  switch (Objectcode) {
    case 0:
      break;
    case 1:
      createCube(getPlayerPosition().x - 1, getPlayerPosition().y, getPlayerPosition().z)
      break;
    case 2:
      createCone(getPlayerPosition().x - 1, getPlayerPosition().y, getPlayerPosition().z)
      break;
    case 3:
      createSphere(getPlayerPosition().x - 1, getPlayerPosition().y, getPlayerPosition().z)
      break;
  }

}

export function createCube(x: number, y: number, z: number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  // Cube.create(entity)

  Transform.create(entity, { position: { x, y, z } })

  // set how the cube looks and collides
  MeshRenderer.setBox(entity)
  MeshCollider.setBox(entity)



  return entity
}
export function createCone(x: number, y: number, z: number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  // Cube.create(entity)

  Transform.create(entity, { position: { x, y, z } })

  // set how the cube looks and collides
  MeshRenderer.setCylinder(entity)
  MeshCollider.setCylinder(entity)



  return entity
}

export function createSphere(x: number, y: number, z: number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  // Cube.create(entity)

  Transform.create(entity, { position: { x, y, z } })

  // set how the cube looks and collides
  MeshRenderer.setSphere(entity)
  MeshCollider.setSphere(entity)



  return entity
}