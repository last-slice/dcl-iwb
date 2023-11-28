import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { createTempScene } from '../../../components/modes/create'
import { displayCreateScenePanel } from '../CreateScenePanel'
import { SCENE_MODES } from '../../../helpers/types'
import { buildInfoTab, displaySceneInfoPanel, displaySceneSetting, scene } from './buildsIndex'
import { formatDollarAmount } from '../../../helpers/functions'
import { displayDeleteBuildPanel } from '../deleteBuildPanel'

export function BuildInfo() {
    return (
        <UiEntity
            key={"specific-buildinfopanel"}
            uiTransform={{
                display: buildInfoTab === "Info" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
        >

             {/* scene metadata info */}
             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Parcel Count: " + (scene && scene !== null ? scene.pcls.length : ""), fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Size: " + (scene && scene !== null ? scene.si + "MB" : ""), fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />


<UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Poly Count: "  + (scene && scene !== null ? formatDollarAmount(scene.pcnt) : ""), fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />


            </UiEntity>

            {/* scene name */}
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Name:", fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene?.n === e.trim() }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null ? scene.n : "")}
                placeholderColor={Color4.Gray()}
                uiTransform={{
                    width: '80%',
                    height:'100%',
                }}
                value={"" + (scene && scene !== null ? scene.n : "")}
            />
            </UiEntity>

             {/* scene description */}
             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Desc:", fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.d = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null ? scene.d : "")}
                placeholderColor={Color4.Gray()}
                uiTransform={{
                    width: '80%',
                    height:'100%',
                }}
                value={"" + (scene && scene !== null ? scene.d : "")}
            />
            </UiEntity>

               {/* scene image link */}
               <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Image: ", fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.im = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null && scene.im ? scene.im : "")}
                placeholderColor={Color4.Gray()}
                uiTransform={{
                    width: '80%',
                    height:'100%',
                }}
                value={"" + (scene && scene !== null ? scene.im : "")}
            />
            </UiEntity>

             {/* scene enabled */}
             <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Scene Enabled", fontSize:sizeFont(20,15), color:Color4.Black(), textAlign:'middle-left'}}
            />

            </UiEntity>


            {/* buttons row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.Black()}}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(10, getAspect(uiSizes.blueButton)).width,
            height: calculateImageDimensions(12,getAspect(uiSizes.blueButton)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.positiveButton)
        }}
        onMouseDown={() => {
        }}
        uiText={{value: "Save Edits", color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

            {/* create button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(10, getAspect(uiSizes.blueButton)).width,
            height: calculateImageDimensions(12,getAspect(uiSizes.blueButton)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.dangerButton)
        }}
        onMouseDown={() => {
            displaySceneInfoPanel(false, scene)
            displaySceneSetting('Info') 
            displayDeleteBuildPanel(true)
        }}
        uiText={{value: "Delete Scene", color:Color4.Black(), fontSize:sizeFont(30,20)}}
        />

        </UiEntity>


        
        </UiEntity>
    )
}