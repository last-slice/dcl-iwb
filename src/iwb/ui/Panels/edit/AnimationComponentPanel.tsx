import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import {visibleComponent} from './EditObjectDataPanel'
import {COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES} from '../../../helpers/types'
import {sendServerMessage} from '../../../components/messaging'
import {selectedItem} from '../../../components/modes/build'
import {sceneBuilds} from '../../../components/scenes'
import { uiSizes } from '../../uiConfig'
import { playAudioFile, stopAudioFile } from '../../../components/scenes/components'
import { playAnimation } from '../../../helpers/functions'
import { Animator } from '@dcl/sdk/ecs'

let value = ""
let animations:any[] = [] 
let currentAnimationIndex:number = 0

export function AnimationComponent() {
    return (
        <UiEntity
            key={"editanimationcomponentpanel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.ANIMATION_COMPONENT ? 'flex' : 'none',
            }}
        >

     {/* enabled  row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                margin:{top:"1%"}
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{value:"Enabled", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
        >

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
            uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT && selectedItem.itemData.audComp ? (selectedItem.itemData.audComp.attachedPlayer ? getImageAtlasMapping(uiSizes.toggleOffTrans) : getImageAtlasMapping(uiSizes.toggleOnTrans)) : getImageAtlasMapping(uiSizes.toggleOnTrans)
        }}
        onMouseDown={() => {
            sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {
                component: COMPONENT_TYPES.AUDIO_COMPONENT,
                action: "update",
                data: {type:"attach", aid: selectedItem.aid, sceneId: selectedItem.sceneId, value: ""}
            })
        }}
        />


        </UiEntity>


        </UiEntity>

        {/* autostart setting */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"1%", bottom:'2%'}
            }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
        uiText={{value:"Autostart", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

                <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '47%',
                height: '100%',
            }}
        >

                        <Dropdown
                    key={"animation-start-dropdown"}
                    options={getAutostartAnimation()}
                    selectedIndex={getAutostart()}
                    onChange={selectAutostartAnimation}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '47%',
                height: '100%',
            }}
        >

                        <Dropdown
                    key={"animation-autostart-type-dropdown"}
                    options={['True', 'False']}
                    selectedIndex={getAutostart()}
                    onChange={selectStart}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

        </UiEntity>


            </UiEntity>

            </UiEntity>

   {/* autostart loop */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '95%',
                height: '10%',
                margin:{top:"1%", bottom:'1%'}
            }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '100%',
            }}
        uiText={{value:"Autoloop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
        >

                        <Dropdown
                    key={"animation-start-loop-dropdown"}
                    options={['True', 'False']}
                    selectedIndex={getAutoloop()}
                    onChange={selectAutoloop}
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


            {/* animation selection */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"1%"}
            }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '30%',
            }}
        uiText={{value:"Animations", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '70%',
            }}
        >

                        <Dropdown
                    key={"animations-type-dropdown"}
                    options={getAnimations()}
                    selectedIndex={0}
                    onChange={(e)=>{
                        currentAnimationIndex = e
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

                    {/* play button row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent:'flex-start',
                alignItems:'flex-start',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
            >

             <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                    height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    margin: {left: "1%", right: "1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    playAnimation(selectedItem.entity, getAnimation(), true)
                }}
            />

<UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                    height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    margin: {left: "1%", right: "1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                }}
                uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
                onMouseDown={() => {
                    Animator.stopAllAnimations(selectedItem.entity, true)
                }}
            />

            </UiEntity>

        </UiEntity>
    )
}

function getAnimations(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.animComp ? selectedItem.itemData.animComp.animations.map((value:any, index:number)=> value +  " - " + selectedItem.itemData.animComp.durations[index] + " seconds") : []
}

function getAnimation(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.animComp ? selectedItem.itemData.animComp.animations[currentAnimationIndex] : ""
}

function getAutostart(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.animComp ? selectedItem.itemData.animComp.autostart ? 0 : 1 : 1
}

function selectStart(index:number){
    updateAnimation("autostart", index === 0 ? true : false)
}

function selectAutostartAnimation(index:number){
    if(index !== selectedItem.itemData.animComp.startIndex){
        updateAnimation("startIndex", index)
    }
}

function getAutostartAnimation(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.animComp ? selectedItem.itemData.animComp.animations : []
}

function selectAutoloop(index:number){
    updateAnimation("autoloop", index === 0 ? true : false)
}

function getAutoloop(){
    return selectedItem && selectedItem.enabled && selectedItem.itemData.animComp ? selectedItem.itemData.animComp.autoloop ? 0 : 1 : 1
}

function updateAnimation(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.UPDATE_ITEM_COMPONENT, {component:COMPONENT_TYPES.ANIMATION_COMPONENT, action:"update", data:{aid:selectedItem.aid, sceneId:selectedItem.sceneId, type:type, value:value}})
}