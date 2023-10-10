import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { attemptAssetUploader } from '../../helpers/functions'
import { PillPanel } from '../PillPanel'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { Color4 } from '@dcl/sdk/math'

export let showNoWeb3 = false

export function displayNoWeb3(value: boolean) {
    showNoWeb3 = value
}

export function createNoWeb3Panel() {
    return (
        <UiEntity
            key={"noweb3panelui"}
            uiTransform={{
                display: showNoWeb3 ? "flex" : "none",
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
            displayNoWeb3(false)
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
        value={addLineBreak("Asset Uploader only enabled for Web3 wallets.", undefined, 50)}
        color={Color4.Black()}
        fontSize={sizeFont(30,20)}
        font="serif"
        textAlign="middle-center"
        />
        </UiEntity>
        
        </UiEntity>
       
    )
}