import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../../helpers'
import { newActionData, updateActionData } from '../EditAction'
import resources from '../../../../helpers/resources'
import { AVATAR_ANCHOR_POINTS, COMPONENT_TYPES, EDIT_MODIFIERS } from '../../../../helpers/types'
import { AvatarAnchorPointType, AvatarAttach, CameraModeArea, CameraType, engine, Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { selectedItem } from '../../../../modes/Build'
import { TransformInputModifiers } from '../EditTransform'
import { localUserId } from '../../../../components/Player'
import { setUIClicked } from '../../../ui'
import { uiSizes } from '../../../uiConfig'

let anchorPoints:any[] = []
let setCameraEntity:Entity
let setPositionEntity:Entity
let setPositionParent:Entity
let selectedAnchorPoint:number = 0
let attachView = "main"

export function resetActionAttachEntity(){
    engine.removeEntityWithChildren(setPositionParent)
    engine.removeEntity(setPositionEntity)
    engine.removeEntity(setCameraEntity)
    selectedAnchorPoint = 0
}

export function addActionAttachEntity(){
    setPositionParent = engine.addEntity()
    setPositionEntity = engine.addEntity()

    if(GltfContainer.has(selectedItem.entity)){
        let gltf = GltfContainer.get(selectedItem.entity)
        GltfContainer.createOrReplace(setPositionEntity, {src:gltf.src, invisibleMeshesCollisionMask:0, visibleMeshesCollisionMask:0})
    }
    AvatarAttach.createOrReplace(setPositionParent, {
        anchorPointId:AvatarAnchorPointType.AAPT_NAME_TAG
    })

    Transform.createOrReplace(setPositionEntity, {parent: setPositionParent})

    anchorPoints = Object.keys(AVATAR_ANCHOR_POINTS)
    .filter(key => isNaN(Number(key))) // Filter out reverse mappings
    .map(key => ({
        original:key,
        value: AVATAR_ANCHOR_POINTS[key as keyof typeof AVATAR_ANCHOR_POINTS],
        label: key.substring(key.indexOf('_') + 1).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
    }));

    anchorPoints.sort((a:any, b:any) => a.label.localeCompare(b.label))
    selectedAnchorPoint = anchorPoints.findIndex($=> $.value === 1)

    attachView = "main"

    CameraModeArea.createOrReplace(setCameraEntity, {
        area: Vector3.create(4, 3, 4),
        mode: CameraType.CT_THIRD_PERSON,
    })

    AvatarAttach.createOrReplace(setCameraEntity, {
        anchorPointId:AvatarAnchorPointType.AAPT_NAME_TAG
    })
}

export function updateSetPositionEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(setPositionEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)

    newActionData.x = transform.x
    newActionData.y = transform.y
    newActionData.z = transform.z
}

export function updateSetScaleEntity(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(setPositionEntity).scale
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)

    newActionData.sx = transform.x
    newActionData.sy = transform.y
    newActionData.sz = transform.z
}

export function updateSetPositionEntityRotation(direction:string, factor:number, manual?:boolean){
    let transform = Transform.getMutable(setPositionEntity)
    let eulerRotation:any = Quaternion.toEulerAngles(transform.rotation)

    eulerRotation[direction] = manual ? factor : eulerRotation[direction] + (factor * selectedItem.rFactor)

    transform.rotation = Quaternion.fromEulerDegrees(eulerRotation.x, eulerRotation.y, eulerRotation.z)

    newActionData.xLook = eulerRotation.x
    newActionData.yLook = eulerRotation.y
    newActionData.zLook = eulerRotation.z
}

export function AddAttachPlayerPanel(){
    return(
        <UiEntity
        key={resources.slug + "action::attach::player::panel"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Green()}}
    >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin:{bottom:'1%'}
        }}
        uiText={{value:"Choose Anchor Type", textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'1%'}
        }}
    >
        <Dropdown
        options={anchorPoints.map($=> $.label)}
        selectedIndex={selectedAnchorPoint}
        onChange={selectAttachPoint}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        color={Color4.White()}
        fontSize={sizeFont(20, 15)}
            />
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50%',
            display: attachView === "main" ? "flex" : "none"
        }}
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30%',
                    margin:{top:"1%", bottom:'1%'}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Position Offset", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    attachView = "position"
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30%',
                    margin:{top:"1%", bottom:'1%'}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Rotation Offset", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    attachView = "rotation"
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30%',
                    margin:{top:"1%", bottom:'1%'}
                }}
                uiBackground={{color: Color4.Black()}}
                uiText={{value: "Scale Offset", fontSize: sizeFont(30, 20)}}
                onMouseDown={() => {
                    setUIClicked(true)
                    attachView = "scale"
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

        </UiEntity>


        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80%',
            display: attachView === "position" ? "flex" : "none"
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
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Go Back",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                attachView = "main"
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

            {Transform.has(setPositionEntity) &&
                <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateSetPositionEntity}
                    rowHeight={'90%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setPositionEntity)
                        switch (type) {
                            case 'x':
                                return transform.position.x.toFixed(3)
                            case 'y':
                                return transform.position.y.toFixed(3)
                            case 'z':
                                return (transform.position.z).toFixed(3)
                        }
                    }}
                />
                }
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80%',
            display: attachView === "rotation" ? "flex" : "none"
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
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Go Back",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                attachView = "main"
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

            {Transform.has(setPositionEntity) &&
                <TransformInputModifiers modifier={EDIT_MODIFIERS.ROTATION}
                    override={updateSetPositionEntityRotation}
                    rowHeight={'90%'}
                    factor={selectedItem && selectedItem.rFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setPositionEntity)
                        let eulerRotation = Quaternion.toEulerAngles(transform.rotation)
                        switch (type) {
                            case 'x':
                                return eulerRotation.x.toFixed(3)
                            case 'y':
                                return eulerRotation.y.toFixed(3)
                            case 'z':
                                return eulerRotation.z.toFixed(3)
                        }
                    }}
                />
                }
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '80%',
            display: attachView === "scale" ? "flex" : "none"
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
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Go Back",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                attachView = "main"
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

            {Transform.has(setPositionEntity) &&
                <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateSetScaleEntity}
                    rowHeight={'90%'}
                    factor={selectedItem && selectedItem.sFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(setPositionEntity)
                        switch (type) {
                            case 'x':
                                return transform.scale.x.toFixed(3)
                            case 'y':
                                return transform.scale.y.toFixed(3)
                            case 'z':
                                return (transform.scale.z).toFixed(3)
                        }
                    }}
                />
                }
        </UiEntity>

    </UiEntity>
    )
}

function selectAttachPoint(index:number){
    selectedAnchorPoint = index
    updateActionData({anchor:anchorPoints[index].value}, true)

    AvatarAttach.createOrReplace(setPositionParent, {
        anchorPointId: anchorPoints[index].value,
    })
}