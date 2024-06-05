import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import resources from '../../../helpers/resources'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../helpers'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { advancedView, buttons } from '../EditAdvanced'

///parenting
let componentIndex:number = 0

export function AddAdvancedComponent(){
    return(
        <UiEntity
        key={resources.slug + "advanced::add:panel::ui"}
            uiTransform={{
                display: advancedView === "Add" ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'center',
                width: '100%',
                height: '100%',
                margin:{top:"10%"}
            }}
            >

                    <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '100%',
                    height: '10%',
                }}
                uiText={{value:"Choose Component", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
                />

            {/* add component row       */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '100%',
                    height: '13%',
                }}
                >

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '80%',
                        height: '100%',
                    }}
                >

                    <Dropdown
                        options={getComponents()}
                        selectedIndex={0}
                        onChange={selectIndex}
                        uiTransform={{
                            width: '60%',
                            height: '120%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}//
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />

                </UiEntity>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20%',
                        height: '100%',
                    }}
                >


                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        value: "Add",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        addComponent()
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
                </UiEntity>

                </UiEntity>

        </UiEntity>
    )
}

function getComponents(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return []
        }

        let array = [...Object.values(COMPONENT_TYPES)].splice(-8).filter(item => !scene.components.includes(item))
        return array
    }
    return []
}

function selectIndex(index:number){
    componentIndex = index
}

function addComponent(){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:"Add",
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            type: getComponents()[componentIndex],
        }
    )
}