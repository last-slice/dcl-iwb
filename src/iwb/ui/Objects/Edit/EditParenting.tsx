
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import { log } from '../../../helpers/functions'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, NOTIFICATION_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { cancelEditingItem, selectedItem } from '../../../modes/Build'
import { openEditComponent, visibleComponent } from '../EditAssetPanel'
import { generateButtons, setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { utils } from '../../../helpers/libraries'
import { Transform, engine } from '@dcl/sdk/ecs'
import { getWorldPosition, getWorldRotation } from '@dcl-sdk/utils'
import { localPlayer } from '../../../components/Player'
import { getEntity } from '../../../components/IWB'
import { showNotification } from '../NotificationPanel'

///parenting
let parentIndex:number = 0
let parentEntityArray:any[] = []
let children:any[] = []

export function updateChildrenAssets(){
    children.length = 0
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene){
        let parenting = scene[COMPONENT_TYPES.PARENTING_COMPONENT].find(($:any) => $.aid === selectedItem.aid)
        if(parenting){
            parenting.children.forEach((childAid:string)=>{
                let nameInfo = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(childAid)
                if(nameInfo){
                    children.push({name:nameInfo.value, aid:childAid})
                }
            })
        }

        getEntities()

        //find asset parent
        let parentsWithChildren = scene[COMPONENT_TYPES.PARENTING_COMPONENT].filter((obj:any) => obj.children.length > 0);
        let parentInfo = parentsWithChildren.find(($:any)=> $.children.includes(selectedItem.aid))
        let parent = parentEntityArray.findIndex(($:any)=> $.aid === parentInfo.aid)
        if(parent >= 0){
            parentIndex = parent
        }
    }
}

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
            uiText={{value:"Choose Parent Entity", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
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
                margin:{bottom:"2%"}
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
                        options={[...parentEntityArray.map(($:any)=> $.name)]}
                        selectedIndex={parentIndex} 
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
                        alignSelf:'flex-start',
                        width: calculateImageDimensions(7, getAspect(uiSizes.buttonPillBlack)).width,
                        height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                        margin:{left:'1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
                    }}
                    uiText={{
                        value: "Update Parent",
                        fontSize: sizeFont(25, 15),
                        color: Color4.White(),
                        textAlign: 'middle-center',
                        textWrap:'nowrap'
                    }}
                    onMouseDown={() => {
                        setUIClicked(true)
                        update("edit", {parent: parentIndex})
                        showNotification({type:NOTIFICATION_TYPES.MESSAGE, message: "Parent updated!", animate:{enabled:true, return:true, time:3}})
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />
                </UiEntity>

            </UiEntity>

            <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignContent:'flex-start',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100%',
                        height: '10%',
                    }}
                >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignContent:'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
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
            uiText={{value:"Current Child Entities", textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
        />
                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'row',
                        alignContent:'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                    }}
                ><UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(8, getAspect(uiSizes.buttonPillBlack)).width,
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
                    value: "Add New Entity",
                    fontSize: sizeFont(25, 15),
                    color: Color4.White(),
                    textAlign: 'middle-center'
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    update("newchild", {})
                    utils.timers.setTimeout(()=>{
                        updateChildrenAssets()
                    }, 200)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
                    </UiEntity>

            
                </UiEntity>



        {selectedItem && selectedItem.enabled && visibleComponent === COMPONENT_TYPES.PARENTING_COMPONENT && getChildrenViews()}

        </UiEntity>
    )
}

function getChildrenViews(){
    let arr:any[] = []
    let count = 0
    children.forEach((child:any)=>{
        arr.push(<Row data={child} rowCount={count}/>)
        count++
    })

    return arr
}

function getEntities(){
    parentEntityArray.length = 0

    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }
    scene[COMPONENT_TYPES.PARENTING_COMPONENT].forEach((item:any)=>{
        // console.log('entity is', item)
        let assetName = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(item.aid)
        if(item.aid !== selectedItem.aid && assetName){
            // console.log('found entity name')
            // let data:any = {...item}
            // data.name = assetName
            parentEntityArray.push({name:assetName.value, aid:item.aid}) 
        }
    })
    parentEntityArray.sort((a:any, b:any) => a.name.localeCompare(b.name))
    parentEntityArray.unshift({name:"Player Camera", aid:"2"})
    parentEntityArray.unshift({name:"Player", aid:"1"})
    parentEntityArray.unshift({name:"Scene", aid:"0"})
}

function Row(info:any){
    let data:any = info.data
    return(
        <UiEntity
        key={resources.slug + "parent-child-row-"+ info.rowCount}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%", bottom:'1%', left:"2%", right:'2%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
                >

            {/* action name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin:{left:'2%'}
            }}
            uiText={{value:"" + data.name, textAlign:'middle-left', fontSize:sizeFont(20,15), color:Color4.White()}}
            />

             {/* <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%', 
                height: '100%',
            }}
            uiText={{value:"" + (data.type && data.type.replace(/_/g, ' ').replace(/\b\w/g, (char:any) => char.toUpperCase())), fontSize:sizeFont(20,15), color:Color4.White()}}
            /> */}

            {/* action edit buttons column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    margin:{left:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    // updateTrigger('delete', 'remove', trigger.rowCount)
                    // update("delete", {aid:data.id})
                    sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_DELETE_ITEM,{
                        assetId: data.aid,
                        sceneId: selectedItem.sceneId,
                        childDelete:true
                    })
                    utils.timers.setTimeout(()=>{
                        updateChildrenAssets()
                    }, 200)
                }}
            />
                </UiEntity>

            </UiEntity>
    )
}

function selectParentIndex(index:number){
    parentIndex = index
}

function update(action:string, data:any){
    console.log('trying to update parent', data)
    let selectedEntityPosition = getWorldPosition(selectedItem.entity)
    let selectedEntityRotation = getWorldRotation(selectedItem.entity)
    let parentInfo:any = parentEntityArray[data.parent]
    let parentEntity:any

    if(data.hasOwnProperty("parent")){
        switch(data.parent){
            case 0:
                parentEntity = {entity:localPlayer.activeScene.parentEntity}
                break;

            case 1:
                parentEntity = {entity:engine.PlayerEntity}
                break;

            case 2:
                parentEntity = {entity:engine.CameraEntity}
                break;

            default:
                parentEntity = getEntity(localPlayer.activeScene, parentInfo.aid)
                break;
        }

        // console.log("parent entity is", parentEntity)//

        if(parentEntity){
            let parentEntityPosition = getWorldPosition(parentEntity.entity)
            let parentEntityRotation = getWorldRotation(parentEntity.entity)

            // console.log('parent entity world position', parentEntityPosition)
            // console.log('parent entity transform position', Transform.get(parentEntity.entity).position)

            // console.log('distance is', Vector3.subtract(selectedEntityPosition, parentEntityPosition))

            sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
                {
                    component:COMPONENT_TYPES.PARENTING_COMPONENT,
                    aid:selectedItem.aid,
                    sceneId:selectedItem.sceneId,
                    action:action,
                    data:parentInfo.aid,
                    pp:parentEntityPosition,
                    pr:Quaternion.toEulerAngles(parentEntityRotation),
                    sp:selectedEntityPosition,
                    sr:Quaternion.toEulerAngles(selectedEntityRotation)
                }
            )
        }
    }else{
        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
            {
                component:COMPONENT_TYPES.PARENTING_COMPONENT,
                aid:selectedItem.aid,
                sceneId:selectedItem.sceneId,
                action:action,
                data:data
            }
        )
    }
}