import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { buildInfoTab, displaySceneInfoPanel, displaySceneSetting, scene } from './buildsIndex'
import { formatDollarAmount, formatSize } from '../../../helpers/functions'
import { displayDeleteBuildPanel } from '../deleteBuildPanel'
import { displaySetting, displaySettingsPanel } from '../settings/settingsIndex'
import { displayCreateScenePanel } from '../CreateScenePanel'
import { editCurrentParcels } from '../../../components/modes/create'
import { sendServerMessage } from '../../../components/messaging'
import { SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { displaySceneSavedPanel } from '../sceneSavedPanel'
import { openExternalUrl } from '~system/RestrictedActions'

let settings:any[] = [
    {label:"Scene Enabled", enabled:true},
    {label:"Scene Public", enabled:true},
]

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
            uiText={{value:"Parcel Count: " + (scene && scene !== null ? scene.pcls.length : ""), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
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
            uiText={{value:"Size: " + (scene && scene !== null ? formatSize(scene.si) + "MB" : ""), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
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
            uiText={{value:"Poly Count: "  + (scene && scene !== null ? formatDollarAmount(scene.pc) : ""), fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            </UiEntity>

            {/* scene name */}
            <UiEntity
            uiTransform={{
                display: scene?.n === "Realm Lobby" ? 'none' : 'flex',
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
            uiText={{value:"Scene Name:", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.n = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null ? scene.n : "")}
                placeholderColor={Color4.White()}
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
                display: scene?.n === "Realm Lobby" ? 'none' : 'flex',
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
            uiText={{value:"Scene Desc:", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.d = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null ? scene.d : "")}
                placeholderColor={Color4.White()}
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
                display: scene?.n === "Realm Lobby" ? 'none' : 'flex',
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
            uiText={{value:"Scene Image: ", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />


            <Input
                onChange={(e) =>{ scene!.im = e }}
                fontSize={sizeFont(20,15)}
                placeholder={"" + (scene && scene !== null && scene.im ? scene.im : "")}
                placeholderColor={Color4.White()}
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'},
                display: scene?.n === "Realm Lobby" ? 'none' : 'flex'
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
            uiText={{value:"Scene Enabled", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs:  getButtonState("Enabled")
        }}
        onMouseDown={() => {
            scene!.e = !scene!.e
        }}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '10%',
                margin:{left: '2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Toggle all scene assets for everyone", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            </UiEntity>

                         {/* scene public */}
                         <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'flex-start',
                width: '100%',
                height: '10%',
                margin:{bottom:'2%'},
                display: scene?.n === "Realm Lobby" ? 'none' : 'flex'
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
            uiText={{value:"Scene Public", fontSize:sizeFont(25,15), color:Color4.White(), textAlign:'middle-left'}}
            />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
            height: calculateSquareImageDimensions(4).height,
            margin:{top:"1%", bottom:'1%'},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getButtonState("Public")
        }}
        onMouseDown={() => {
            scene!.priv = !scene!.priv        
        }}
        />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '10%',
                margin:{left: '2%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Toggle all scene assets for others", fontSize:sizeFont(20,15), color:Color4.White(), textAlign:'middle-left'}}
            />

            </UiEntity>


            {/* buttons row */}
        <UiEntity
            uiTransform={{
                // display: 'flex',
                display: scene?.n === "Realm Lobby" ? 'none' : 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.White()}}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            console.log('on clicked')
            editCurrentParcels(scene!.id)
            // createTempScene(scene.name, scene.description, scene.enabled)
            displaySceneInfoPanel(false, null)
            displaySettingsPanel(false)
            displaySetting("Explore")
            displayCreateScenePanel(true, true)
        }}
        uiText={{value: "Edit Parcels", color:Color4.White(), fontSize:sizeFont(30,15)}}
        />            

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_SAVE_EDITS,
                {
                    sceneId: scene!.id,
                    name: scene!.n,
                    desc: scene!.d,
                    image: scene!.im,
                    enabled: scene!.e,
                    priv: scene!.priv
                })

            displaySceneInfoPanel(false, scene)
            displaySceneSetting("Info")
            displaySceneSavedPanel(true)
        }}
        uiText={{value: "Save Edits", color:Color4.White(), fontSize:sizeFont(30,15)}}
        />

            {/* create button */}
            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(6, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(6,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{right:"1%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            displaySceneInfoPanel(false, scene)
            displaySceneSetting('Info') 
            displayDeleteBuildPanel(true)
        }}
        uiText={{value: "Delete Scene", color:Color4.White(), fontSize:sizeFont(30,15)}}
        />

        </UiEntity>




        {/* view image link */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10%',
                height: '20%',
                positionType:'absolute',
                position:{right: '5%', bottom:'40%'}
            }}
            uiText={{value:"View Image", fontSize:sizeFont(15,10), color:Color4.White(), textAlign:'middle-left'}}
            onMouseDown={()=>{
                openExternalUrl({url:"" + scene!.im})
            }}
            />

        
        </UiEntity>
    )
}

function getButtonState(button:string){
    if(scene){
        switch(button){
            case 'Enabled':
                return scene!.e ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        
            case 'Public':
                return scene!.priv ? getImageAtlasMapping(uiSizes.toggleOffTrans) : getImageAtlasMapping(uiSizes.toggleOnTrans)
    
            default:
                return getImageAtlasMapping(uiSizes.toggleOnTrans)
        }
    }else{
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }

}//