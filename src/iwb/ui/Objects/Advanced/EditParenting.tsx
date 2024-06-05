import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Dropdown } from '@dcl/sdk/react-ecs'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import resources from '../../../helpers/resources'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { sizeFont, calculateImageDimensions, getAspect, getImageAtlasMapping } from '../../helpers'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { advancedView } from '../EditAdvanced'

///parenting
let parentIndex:number = 0

export function EditParenting(){
    return(
        <UiEntity
        key={resources.slug + "advanced::parenting:panel::ui"}
            uiTransform={{
                display: advancedView === COMPONENT_TYPES.PARENTING_COMPONENT ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignContent:'center',
                width: '100%',
                height: '100%',
                margin:{top:"10%"}
            }}
            >

                {/* current parent row */}
                <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '100%',
                    height: '15%',
                }}
                >

                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '30%',
                    height: '100%',
                }}
                uiText={{value:"Current Parent", fontSize:sizeFont(20,15), color:Color4.White()}}
                />


            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                    }}
                >

                    <Dropdown
                        options={getEntities()}
                        selectedIndex={getParentIndex()}
                        onChange={selectParentIndex}
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
                        value: "Save",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        updateParent("parent", parentIndex)
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

function getEntities(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return []
        }
        let entities:any[] = []
        scene.parenting.forEach((item:any)=>{
            let assetName = scene.names.get(item.aid)
            if(item.aid !== selectedItem.aid){
                if(assetName){
                    let data:any = {...item}
                    data.name = assetName
                    entities.push(assetName.value) 
                }
            }
        })
        return entities
    }
    return []
}

function getParentIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(!scene){
            return 0
        }
        for(let i = 0; i < scene.parenting.length; i++){
            let parent = scene.parenting[i]
            for(let j = 0; parent.children.length; j++){
                let child = parent.children[j]
                if(child === selectedItem.aid){
                    return i
                }
            }
        }
        return 0
    }
    return 0
}

function selectParentIndex(index:number){
    parentIndex = index
}

function updateParent(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:COMPONENT_TYPES.PARENTING_COMPONENT,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}