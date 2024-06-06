
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'

///parenting
let parentIndex:number = 0

export function EditParenting(){
    return (
        <UiEntity
        key={resources.slug + "advanced::parenting:panel::ui"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.PARENTING_COMPONENT ? 'flex' : 'none',
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
            uiText={{value:"Current Parent", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            {/* current parent row */}
            <UiEntity
                uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent:'center',
                width: '100%',
                height: '10%',
                }}
            >

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
                        selectedIndex={0}
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
                        width: '50%',
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


            <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
            uiText={{value:"Current Children", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

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
    let index = 0
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