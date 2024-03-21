import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { uiSizes } from '../../../uiConfig'
import { Transform, engine } from '@dcl/sdk/ecs'
import { localPlayer } from '../../../../components/player/player'

export let teleportPosition:any = {
    x:0,
    y:0,
    z:0
}


export let cameraPosition:any = {
    x:0,
    y:0,
    z:0
}

export function ActionTeleportPlayerCompoent(){
    return(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:'flex'
        }}
        // uiBackground={{color:Color4.Teal()}}
    >

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'2%'}//
        }}
    uiText={{value:"Location", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
    />


        <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '40%',
        }}
    >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '10%',
        }}
        uiText={{value: "X", fontSize:sizeFont(25,20), color:Color4.White()}}
        />

    <Input
        onChange={(value)=>{
            teleportPosition.x = parseFloat(value)
        }}
        fontSize={sizeFont(20,12)}
        value={"" + teleportPosition.x.toFixed(2)}
        placeholder={"" + teleportPosition.x}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '80%',
            height: '80%',
        }}
        />
    </UiEntity>

    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '10%',
        }}
        uiText={{value: "Y", fontSize:sizeFont(25,20), color:Color4.White()}}
        />

        <Input
        onChange={(value)=>{
            teleportPosition.y = parseFloat(value)
        }}
        fontSize={sizeFont(20,12)}
        value={"" + teleportPosition.y.toFixed(2)}
        placeholder={"" + teleportPosition.y}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '80%',
            height: '80%',
        }}
        />
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '100%',
        }}
    >
         <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '33%',
            height: '10%',
        }}
        uiText={{value: "Z", fontSize:sizeFont(25,20), color:Color4.White()}}
        />

        <Input
        onChange={(value)=>{
            teleportPosition.z = parseFloat(value)
        }}
        fontSize={sizeFont(20,12)}
        value={"" + teleportPosition.z.toFixed(2)}
        placeholder={"" + teleportPosition.z}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '80%',
            height: '80%',
        }}
        />
        </UiEntity>

    </UiEntity>

    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '30%',
                margin:{top:'1%'}
            }}
            >
    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                    height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Get Position", fontSize: sizeFont(25, 20)}}
            onMouseDown={() => {
                let scene = Transform.get(localPlayer.activeScene!.parentEntity).position
                let player = Transform.get(engine.PlayerEntity).position
                teleportPosition.x = player.x - scene.x
                teleportPosition.y = player.y - scene.y
                teleportPosition.z = player.z - scene.z

                let fake = Vector3.Forward()
                fake = Vector3.scale(fake, 5)
                fake = Vector3.rotate(fake, Transform.get(engine.CameraEntity).rotation)
                let hitpoint = Vector3.add(teleportPosition, fake) 
                cameraPosition.x = hitpoint.x
                cameraPosition.y = hitpoint.y
                cameraPosition.z = hitpoint.z
            }}
        />
        </UiEntity>

</UiEntity>
                  
    )
}