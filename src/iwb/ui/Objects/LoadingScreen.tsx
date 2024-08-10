import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import resources from '../../helpers/resources'
import { loadingTime } from '../../systems/LoadingSystem'

export let showPanel = false

export function displayMainLoadingScreen(value: boolean) {
    showPanel = value
}

export function createMainLoadingScreen() {
    return (
        <UiEntity
            key={resources.slug + "loading::screen"}
            uiTransform={{
                display: showPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                position: { left: 0, top:0}
            }}
        uiBackground={{ color: Color4.Black() }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(50,  3264/1024).width,
            height: calculateImageDimensions(50, 3264/1024).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/iwb_logo_white.png'
            },
        }}
    />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                display:'flex',
            }}
        // uiBackground={{color:Color4.Green()}}
        uiText={{value:"Loading", fontSize: sizeFont(45,45), color: Color4.White()}}
        />

                    {/* Poly count size container */}
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '40%',
                height: '5%',
            }}
            uiBackground={{color:Color4.Gray()}}
            >

            {/* Poly count size  */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: `${(loadingTime * 10)}%` ,
                height: '100%',
            }}
            uiBackground={{color: Color4.Green() }}
            />

            </UiEntity>


        </UiEntity>
    )
}