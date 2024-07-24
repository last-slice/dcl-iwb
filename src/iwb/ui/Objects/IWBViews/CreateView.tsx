import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../helpers/resources'
import { displayMainView, mainView } from '../IWBView'
import { HoriztonalButtons } from '../../Reuse/HoriztonalButtons'
import { sendServerMessage } from '../../../components/Colyseus'
import { settings } from '../../../components/Player'
import { SOUND_TYPES, SERVER_MESSAGE_TYPES, SCENE_CATEGORIES, NOTIFICATION_TYPES } from '../../../helpers/types'
import { calculateSquareImageDimensions, sizeFont, getImageAtlasMapping, calculateImageDimensions, getAspect } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { playSound } from '../../../components/Sounds'
import { setUIClicked } from '../../ui'
import { createTempScene } from '../../../modes/Create'
import { displayExpandedMap } from '../ExpandedMapView'
import { showNotification } from '../NotificationPanel'
import { utils } from '../../../helpers/libraries'

let name = ""
let desc = ""
let im = ""
let enabled = true
let priv = false
let age = 'E'
let cat = "art"
let disablePX = false
let noVoice = false


export function CreateSceneView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-create"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:mainView === "Create" ? 'flex' : 'none'
        }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '10%',
                }}
            >
            <Input
                onChange={(value)=>{
                    name = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'Enter Scene Name'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                ></Input>
            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                    height: '10%',
                    margin:{top:"1%"}
                }}
            >
            <Input
                onChange={(value)=>{
                    desc = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'Enter Scene Description'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                ></Input>
            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '10%',
                margin:{top:"1%"}
            }}
        >
            <Input
                onChange={(value)=>{
                    im = value.trim()
                }}
                fontSize={sizeFont(20,15)}
                placeholder={'Enter Scene Image'}
                placeholderColor={Color4.White()}
                color={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                ></Input>
            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '15%',
                margin:{top:"3%"}
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{right:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"10%"}
                }}
            uiText={{value:"Scene Enabled", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >
            <Dropdown
        options={['True']}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){
                enabled = true
            }else{
                enabled = false
            }
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"10%"}
                }}
            uiText={{value:"Scene Private", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >
            <Dropdown
        options={['False', 'True']}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){
                priv = false
            }else{
                priv = true
            }
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


            </UiEntity>

        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '15%',
                margin:{top:"3%"}
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{right:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"10%"}
                }}
            uiText={{value:"Content Rating", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >
            <Dropdown
        options={['Adult (PG 18+)', 'Teen (PG 13+)']}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){
                age = "E"
            }else{
                age = "E"
            }
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"10%"}
                }}
            uiText={{value:"Categories", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >
            <Dropdown
        options={[...Object.values(SCENE_CATEGORIES)].sort((a:any, b:any)=> a.localeCompare(b))}
        selectedIndex={0}
        onChange={(index:number)=>{
            let sorted = [...Object.values(SCENE_CATEGORIES)].sort((a:any, b:any)=> a.localeCompare(b))
            cat = sorted[index]
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


            </UiEntity>

        </UiEntity>


        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '15%',
                margin:{top:"3%"}
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{right:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"10%"}
                }}
            uiText={{value:"Disable Portable Exp.", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >
            <Dropdown
        options={['False', 'True']}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){
                disablePX = false
            }else{
                disablePX = true
            }
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


            </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:"2%"}
            }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{bottom:"10%"}
                }}
            uiText={{value:"Disable Voice", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-center'}}
            />

                <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '90%',
            }}
        >
            <Dropdown
        options={['False', 'True']}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index === 0){
                noVoice = false
            }else{
                noVoice = true
            }
        }}
        uiTransform={{
            width: '100%',
            height: '120%',
        }}
        // uiBackground={{color:Color4.Purple()}}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>


            </UiEntity>

        </UiEntity>

          {/* create button */}
          <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlue)).width,
            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
            margin:{top:"2%"},
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
        }}
        onMouseDown={() => {
            displayMainView(false)
            createTempScene(name, desc, im, enabled, priv, cat, age, disablePX, noVoice)
            displayExpandedMap(true)
        }}
        uiText={{value: "Create", color:Color4.White(), fontSize:sizeFont(30,20)}}
        />

            </UiEntity>
    )
}

function getButtonState(button:string){
    if(settings && settings[button]){
        return getImageAtlasMapping(uiSizes.toggleOnTrans)
    }else{
        return getImageAtlasMapping(uiSizes.toggleOffTrans)
    }
}