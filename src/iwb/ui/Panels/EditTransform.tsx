
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { selectedCatalogItem, selectedEntity } from '../../components/modes/build'
import { Transform, engine } from '@dcl/sdk/ecs'
import { localUserId, players } from '../../components/player/player'

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

        uiText={{value: "Position", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
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
            uiText={{value:"" + (selectedCatalogItem !== null ? getRelativePosition("x") : ""), fontSize:sizeFont(20,15)}}
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
            uiText={{value:"" + (selectedCatalogItem !== null ? getRelativePosition("y") : ""), fontSize:sizeFont(20,15)}}
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
            uiText={{value:"" + (selectedCatalogItem !== null ? getRelativePosition("z") : ""), fontSize:sizeFont(20,15)}}
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

        uiText={{value: "Rotation", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
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
            uiText={{value:"0.00", fontSize:sizeFont(20,15)}}
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
            uiText={{value:"0.00", fontSize:sizeFont(20,15)}}
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
            uiText={{value:"0.00", fontSize:sizeFont(20,15)}}
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

        uiText={{value: "Scale", fontSize:sizeFont(20,15), textAlign:'middle-left'}}
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
            uiText={{value:"" + (selectedCatalogItem !== null ? Transform.get(selectedEntity).scale.x : ""), fontSize:sizeFont(20,15)}}
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
            uiText={{value:"" + (selectedCatalogItem !== null ? Transform.get(selectedEntity).scale.y : ""), fontSize:sizeFont(20,15)}}
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
            uiText={{value:"" + (selectedCatalogItem !== null ? Transform.get(selectedEntity).scale.z : ""), fontSize:sizeFont(20,15)}}
         />


        </UiEntity>

        </UiEntity>
    )
}

function getRelativePosition(type:string){
    if(players.get(localUserId)!.activeScene){
        let scene = players.get(localUserId)!.activeScene!.parentEntity
        let sceneTransform = Transform.get(scene).position
        const {position, rotation} = Transform.get(engine.PlayerEntity)

        const forwardVector = Vector3.rotate(Vector3.scale(Vector3.Forward(), 4), rotation)
        const finalPosition = Vector3.add(position, forwardVector)

        finalPosition.x = finalPosition.x - sceneTransform.x
        // finalPosition.y = finalPosition.y - sceneTransform.y
        finalPosition.z = finalPosition.z - sceneTransform.z

        console.log('scene position', sceneTransform)
        console.log('objec position', finalPosition)

        switch(type){
            case 'x':
                return finalPosition.x.toFixed(2)
            case 'y':
                return finalPosition.y.toFixed(2)
            case 'z':
                return (finalPosition.z + 4).toFixed(2)
        }
    }else{
        return ""
    }

    
}