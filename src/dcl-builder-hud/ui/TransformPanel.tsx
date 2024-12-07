import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { getImageAtlasMapping, sizeFont } from "./helpers"
import { EDIT_MODES, selectedItem } from ".."
import { Color4, Quaternion } from "@dcl/sdk/math"
import { Transform } from '@dcl/sdk/ecs'

export function TransformPanel() {
    return (
        <UiEntity
            key={"dcl::builder::hud::edit::transform"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        // uiBackground={{color:Color4.Green()}}
        >
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
            uiText={{value:"" + (selectedItem  && selectedItem.enabled ? getRelativeScale('x') : ""), fontSize:sizeFont(20,15)}}
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
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativeScale('y') : ""), fontSize:sizeFont(20,15)}}
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
            uiText={{value:"" + (selectedItem && selectedItem.enabled ? getRelativeScale('z') : ""), fontSize:sizeFont(20,15)}}
         />


        </UiEntity>


        </UiEntity>
    )
}

function getRelativeScale(type:string){
    let transform = Transform.get(selectedItem.entity)
    
    switch(type){
        case 'x':
            return transform.scale.x.toFixed(2)
        case 'y':
            return transform.scale.y.toFixed(2)
        case 'z':
            return (transform.scale.z).toFixed(2)
    }
}

function getRelativePosition(type:string){
    let transform = Transform.get(selectedItem.entity)
    
    switch(type){
        case 'x':
            return transform.position.x.toFixed(2)
        case 'y':
            return transform.position.y.toFixed(2)
        case 'z':
            return (transform.position.z).toFixed(2)
    }
}