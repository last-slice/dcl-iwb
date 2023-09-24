import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position,UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { dimensions } from './ui'
import { Color4 } from '@dcl/sdk/math'

export let showCatalogPanel = true

export function displayCatalogPanel(value:boolean){
    showCatalogPanel = value
}
export let cubeSelect = false 
export let triSelect = false 
export let sphereSelect = false
export let itemSelect = false
export let customSelect = false
export let itemCode = 0

export function createCatalogPanel(){
    return (
      <UiEntity
    key={"catalogpanel"}
    uiTransform={{
      display: showCatalogPanel ? 'flex' :'none',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      width: dimensions.width * .15,
      height: '100%',
      positionType:'absolute',
      position:{right:0,top:0}
    }}
    uiBackground={{color:Color4.Red()}}
  >
         <Button
        uiTransform={{ width: 100, height: 50,  position: {top: -200, left: 20},  alignSelf: 'flex-start'}}
        value='Cube'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
         
          cubeSelect = true
          itemSelect = true
          triSelect = false
          sphereSelect = false
          customSelect = false
          itemCode = 1
         
        
        
        }}
      />
              <Button
        uiTransform={{ width: 100, height: 50,  position: {top: -150, left: 20},  alignSelf: 'flex-start'}}
        value='Cylinder'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
         
            cubeSelect = false
            itemSelect = true
            triSelect = true
            sphereSelect = false
            customSelect = false
            itemCode= 2
         
        
        }}
      />
         <Button
        uiTransform={{ width: 100, height: 50,  position: {top: -100, left: 20},  alignSelf: 'flex-start'}}
        value='Sphere'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
         
            cubeSelect = false
            itemSelect = true
            triSelect = false
            sphereSelect = true
            customSelect = false
            itemCode = 3

        
        }}
      />
        <Button
        uiTransform={{ width: 100, height: 50,  position: {top: -50, left: 20},  alignSelf: 'flex-start'}}
        value='Model'
        variant='primary'
        fontSize={14}
        uiBackground={{ color: Color4.create(0.063, 0.118, 0.31, .5) }}
        onMouseDown={() => {
         
            cubeSelect = false
            itemSelect = true
            triSelect = false
            sphereSelect = false
            customSelect = true
            itemCode = 4

        
        }}
      />



  </UiEntity>
    )
}