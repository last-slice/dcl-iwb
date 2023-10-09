import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping } from '../helpers'

export function PillPanel(info:any) {
    return (
        <UiEntity
            key={"pillpanel"}
            uiTransform={{
                display: info.show? 'flex' :'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 824/263).width,
                height: calculateImageDimensions(45, 824/263).height,
                positionType: 'absolute',
                position:{left:(dimensions.width - calculateImageDimensions(45, 824/263).width) / 2, top:(dimensions.height - calculateImageDimensions(45, 824/263).height) / 2}
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                width: '100%',
                height: '100%',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:0,
                    sourceLeft:0,
                    sourceWidth:824,
                    sourceHeight:263
                })
            }}
        >

        {/* x button */}
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center',
            width: calculateSquareImageDimensions(3).width,
            height: calculateSquareImageDimensions(3).height,
            positionType:'absolute',
            position:{top:'13%', right:'5%'}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
            src: 'assets/atlas2.png'
            },
            uvs:getImageAtlasMapping({
                atlasHeight:1024,
                atlasWidth:1024,
                sourceTop:60,
                sourceLeft:844,
                sourceWidth:30,
                sourceHeight:30
            })
        }}
        onMouseDown={()=>{
            info.hide()
        }}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                width: '90%',
                height: '30%',
            }}
            // uiBackground={{color:Color4.Green()}}
            >

        <Label
        value={addLineBreak("To upload assets, please click on the link below to launch the Asset Uploader", undefined, 50)}
        color={Color4.Black()}
        fontSize={29}
        font="serif"//
        textAlign="middle-center"
        />
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:'center',
                width: '90%',
                height: '30%',
            }}
            // uiBackground={{color:Color4.Blue()}}
            >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                width: calculateImageDimensions(13, 223/41).width,
                height: calculateImageDimensions(13, 223/41).height,
                margin:{right:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:841,
                    sourceLeft:579,
                    sourceWidth:223,
                    sourceHeight:41
                })
            }}
            onMouseDown={()=>{
                info.hide()
            }}
        />


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                width: calculateImageDimensions(13, 223/41).width,
                height: calculateImageDimensions(13, 223/41).height,
                margin:{left:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping({
                    atlasHeight:1024,
                    atlasWidth:1024,
                    sourceTop:718,
                    sourceLeft:802,
                    sourceWidth:223,
                    sourceHeight:41
                })
            }}
            onMouseDown={()=>{
                info.accept()
            }}
        />

        </UiEntity>

        </UiEntity>
        


        </UiEntity>
    )
}