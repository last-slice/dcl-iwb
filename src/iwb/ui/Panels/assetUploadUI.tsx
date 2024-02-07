import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { attemptAssetUploader } from '../../helpers/functions'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getAspect, getImageAtlasMapping, sizeFont } from '../helpers'
import { Color4 } from '@dcl/sdk/math'
import { uiSizes } from '../uiConfig'

export let showAssetUI = false

export function displayAssetUploadUI(value: boolean) {
    showAssetUI = value
}

export function createAssetUploadUI() {
    return (
        <UiEntity
            key={"assetuploaduiprompt"}
            uiTransform={{
                display: showAssetUI ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 824/263).width,
                height: calculateImageDimensions(45, 824/263).height,
                positionType: 'absolute',
                position:{left:(dimensions.width - calculateImageDimensions(45, 824/263).width) / 2, top:(dimensions.height - calculateImageDimensions(45, 824/263).height) / 2}
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

        {/* <PillPanel show={showAssetUI} hide={()=>{displayAssetUploadUI(false)}} accept={()=>{attemptAssetUploader()}}> */}

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
        color={Color4.White()}
        fontSize={sizeFont(30,20)}
        font="serif"
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


            {/* close popup button */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).height,
                margin:{right:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                displayAssetUploadUI(false)
            }}
            uiText={{value:"Close", fontSize:sizeFont(30,20), color:Color4.White()}}
        >
        </UiEntity>



         {/* load asset loader button */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center',
                width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlack)).height,
                margin:{left:"5%"}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            onMouseDown={()=>{
                displayAssetUploadUI(false)
                attemptAssetUploader()
            }}
            uiText={{value:"Open", fontSize:sizeFont(30,20), color:Color4.White()}}
        >
    </UiEntity>

        </UiEntity>
        
        </UiEntity>
       
    )
}