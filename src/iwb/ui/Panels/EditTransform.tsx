
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { getImageAtlasMapping, sizeFont } from '../helpers'
import { cancelSelectedItem, deleteSelectedItem, saveItem, selectedItem } from '../../components/modes/build'
import { Transform, engine } from '@dcl/sdk/ecs'
import { localUserId, players } from '../../components/player/player'
import { EDIT_MODES } from '../../helpers/types'
import { uiSizes } from '../uiConfig'

export function EditTransform() {
    return (
        <UiEntity
            key={"edittransformpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '80%',
                margin:{top:'2%'}
            }}
        // uiBackground={{color:Color4.Green()}}
        >

{/* transform header */}
    {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '10%',
            }}

        uiText={{value: "Transform", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
        /> */}

{/* position header */}
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '10%',
                margin:{top:'1%'}
            }}

        uiText={{value: "Position", fontSize:sizeFont(17,12), textAlign:'middle-left'}}
        />

{/* position row */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '15%',
                margin:{top:'1%'}
            }}
        >

            {/* x cell */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativePosition("x") : ""), fontSize:sizeFont(20,15)}}
         />

         {/* y cell */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativePosition("y") : ""), fontSize:sizeFont(20,15)}}
         />

         {/* z cell */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativePosition("z") : ""), fontSize:sizeFont(20,15)}}
         />


        </UiEntity>

{/* Rotation header */}
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '10%',
                margin:{top:'2%'}
            }}

        uiText={{value: "Rotation", fontSize:sizeFont(17,12), textAlign:'middle-left'}}
        />

{/* rotation row */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '15%',
                margin:{top:'1%'}
            }}
        >

            {/* x cell */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).x.toFixed(2) : ""), fontSize:sizeFont(20,15)}}
         />

         {/* y cell */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).y.toFixed(2) : ""), fontSize:sizeFont(20,15)}}
         />

         {/* z cell */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? Quaternion.toEulerAngles(Transform.get(selectedItem.entity).rotation).z.toFixed(2) : ""), fontSize:sizeFont(20,15)}}
         />


        </UiEntity>

{/* scale header */}
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '10%',
                margin:{top:'2%'}
            }}

        uiText={{value: "Scale", fontSize:sizeFont(17,12), textAlign:'middle-left'}}
        />

{/* scale row */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '15%',
                margin:{top:'1%'}
            }}
        >

            {/* x cell */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem  && selectedItem.enabled ? Transform.get(selectedItem.entity).scale.x : ""), fontSize:sizeFont(20,15)}}
         />

         {/* y cell */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'2%'}
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? Transform.get(selectedItem.entity).scale.y : ""), fontSize:sizeFont(20,15)}}
         />

         {/* z cell */}
         <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            uiBackground={{color:Color4.Gray()}}
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? Transform.get(selectedItem.entity).scale.z : ""), fontSize:sizeFont(20,15)}}
         />


        </UiEntity>

            {/* button rows */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '20%',
                margin:{top:'1%'}
            }}
        >

{/* save button */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{left:"1%", right:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.positiveButton)
            }}
            uiText={{value: "Save", fontSize:sizeFont(20,16)}}
            onMouseDown={()=>{
                saveItem()
            }}
        />

{/* delete button */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{left:"1%", right:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.dangerButton)
            }}
            uiText={{value: "Delete", fontSize:sizeFont(20,16)}}
            onMouseDown={()=>{
                deleteSelectedItem()
            }}
        />

{/* cancel button */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{left:"1%", right:"1%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.blackButton)
            }}
            uiText={{value: "Cancel", fontSize:sizeFont(20,16)}}
            onMouseDown={()=>{
                cancelSelectedItem()
            }}
        />

        </UiEntity>

        </UiEntity>
    )
}//

function getRelativePosition(type:string){
    if(players.get(localUserId)!.activeScene){

        switch(selectedItem.mode){
            case EDIT_MODES.EDIT:
                // console.log('objec position', selectedCatalogItem)
                let transform = Transform.get(selectedItem.entity)
        
                switch(type){
                    case 'x':
                        return transform.position.x.toFixed(2)
                    case 'y':
                        return transform.position.y.toFixed(2)
                    case 'z':
                        return (transform.position.z).toFixed(2)
                }
            break;

            case EDIT_MODES.GRAB:
                let scene = players.get(localUserId)!.activeScene!.parentEntity
                let sceneTransform = Transform.get(scene).position
                const {position, rotation} = Transform.get(engine.PlayerEntity)
        
                const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
                const finalPosition = Vector3.add(position, forwardVector)
        
                finalPosition.x = finalPosition.x - sceneTransform.x
                // finalPosition.y = finalPosition.y - sceneTransform.y
                finalPosition.z = finalPosition.z - sceneTransform.z
        
                // console.log('scene position', sceneTransform)
                // console.log('objec position', finalPosition)
        
                switch(type){
                    case 'x':
                        return finalPosition.x.toFixed(2)
                    case 'y':
                        return finalPosition.y.toFixed(2)
                    case 'z':
                        return (finalPosition.z + 4).toFixed(2)
                }
                break;
        }

    }else{
        return ""
    }

    
}