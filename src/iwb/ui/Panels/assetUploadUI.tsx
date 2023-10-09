import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { attemptAssetUploader } from '../../helpers/functions'
import { PillPanel } from '../PillPanel'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, getImageAtlasMapping } from '../helpers'
import { Color4 } from '@dcl/sdk/math'

export let showAssetUI = false

export function displayAssetUploadUI(value: boolean) {
    showAssetUI = value
}

export function createAssetUploadUI() {
    return (
        <PillPanel show={showAssetUI} hide={()=>{displayAssetUploadUI(false)}} accept={()=>{attemptAssetUploader()}}>

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
            displayAssetUploadUI(false)
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
                displayAssetUploadUI(false)
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
                attemptAssetUploader()
            }}
        />

        </UiEntity>
        </PillPanel>
    )
}