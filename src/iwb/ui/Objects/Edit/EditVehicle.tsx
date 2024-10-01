
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { utils } from '../../../helpers/libraries'
import { AvatarShape, engine, Entity, Material, MeshRenderer, PBMaterial_PbrMaterial, Transform } from '@dcl/sdk/ecs'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { TransformInputModifiers } from './EditTransform'
import { getWorldPosition } from '@dcl-sdk/utils'

export let vehicleView = "main"
export let vehicleInfo:any = {}
let scene:any

export function clearEditVehicleData(){
    scene = undefined
    vehicleView = "main"

    removeEditVehicleObjects()
    vehicleInfo = {}
}

export function removeEditVehicleObjects(){
    Material.deleteFrom(vehicleInfo.holderL)
    Material.deleteFrom(vehicleInfo.holderF)
    Material.deleteFrom(vehicleInfo.holderR)
    Material.deleteFrom(vehicleInfo.holderB)
    Material.deleteFrom(vehicleInfo.holderG)

    MeshRenderer.deleteFrom(vehicleInfo.holderL)
    MeshRenderer.deleteFrom(vehicleInfo.holderF)
    MeshRenderer.deleteFrom(vehicleInfo.holderR)
    MeshRenderer.deleteFrom(vehicleInfo.holderB)
    MeshRenderer.deleteFrom(vehicleInfo.holderG)

    engine.removeEntity(vehicleInfo.avatar)
}

export function upateEditVehicleView(view:string){
    vehicleView = view

    if(view === "cockpit"){
        let transAlbedo:PBMaterial_PbrMaterial = {albedoColor: Color4.create(0,1,0,.2)}
        MeshRenderer.setPlane(vehicleInfo.holderL)
        MeshRenderer.setPlane(vehicleInfo.holderF)
        MeshRenderer.setPlane(vehicleInfo.holderR)
        MeshRenderer.setPlane(vehicleInfo.holderB)
        MeshRenderer.setPlane(vehicleInfo.holderG)

        Material.setPbrMaterial(vehicleInfo.holderL, transAlbedo)
        Material.setPbrMaterial(vehicleInfo.holderF, transAlbedo)
        Material.setPbrMaterial(vehicleInfo.holderR, transAlbedo)
        Material.setPbrMaterial(vehicleInfo.holderB, transAlbedo)
        Material.setPbrMaterial(vehicleInfo.holderG, transAlbedo)

        vehicleInfo.avatar = engine.addEntity()
        AvatarShape.createOrReplace(vehicleInfo.avatar)
        let holderWorldPosition = getWorldPosition(vehicleInfo.holderG)
        Transform.createOrReplace(vehicleInfo.avatar, {position:Vector3.create(holderWorldPosition.x, holderWorldPosition.y, holderWorldPosition.z + 0.2)})
    }else{
        removeEditVehicleObjects()
    }
}

export function updateCockpitPosition(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(vehicleInfo.holder).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)

    let holderWorldPosition = getWorldPosition(vehicleInfo.holderG)
    Transform.createOrReplace(vehicleInfo.avatar, {position:Vector3.create(holderWorldPosition.x, holderWorldPosition.y, holderWorldPosition.z + 0.2)})
}

export function getVehicleData(){
    scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let vehicle = scene[COMPONENT_TYPES.VEHICLE_COMPONENT].get(selectedItem.aid)
    if(!vehicle){
        return
    }

    vehicleInfo = {...vehicle}

    console.log('vehicle info is', vehicleInfo)
}

export function EditVehicle() {
    return (
        <UiEntity
            key={resources.slug + "edit::vehicle::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.VEHICLE_COMPONENT ? 'flex' : 'none',
            }}
        >
            <MainVehicleView/>
            <DetailsView/>
            <CockpitPositionView/>

        </UiEntity>
    )
}

function MainVehicleView(){
    return(
        <UiEntity
        key={resources.slug + "edit::vehicle::main::view"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: vehicleView === "main" ? "flex" : "none"
    }}
>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        uiText={{value:"Vehicle Type: " + getType(), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
        display:vehicleInfo.type === -1 ? "flex" : "none"
    }}
>
    <Dropdown
        options={["Select Type", "Ground"]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                vehicleInfo.type = index - 1
                updateVehicle("edit", "type", index - 1)
                utils.timers.setTimeout(()=>{
                    getVehicleData()
                }, 200)
            }
        }}
        uiTransform={{
            width: '100%',
            height: '100%',
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
        width: '100%',
        height: '10%',
        margin:{top:'1%', bottom:'1%'}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Details", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        upateEditVehicleView("details")
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
        height: '10%',
        margin:{top:'1%', bottom:'1%'}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Physics", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
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
        height: '10%',
        margin:{top:'1%', bottom:'1%'}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Entity Offset", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
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
        height: '10%',
        margin:{top:'1%', bottom:'1%'}
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Cockpit Position", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        upateEditVehicleView('cockpit')
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>


    </UiEntity>
    )
}

function DetailsView(){
    return(
        <UiEntity
        key={resources.slug + "edit::vehicle::details::view"}
        uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: vehicleView === "details" ? "flex" : "none"
        }}
        >
            <UiEntity
        uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        }}
        >

    <UiEntity
        uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
        }}
        uiText={{textWrap:'nowrap', value:"Force First Person", fontSize:sizeFont(25,20), textAlign:'middle-left'}}
        />

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
                    uvs: vehicleInfo.forceFPV ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    updateVehicle("edit", "forceFPV", !vehicleInfo.forceFPV)
                    utils.timers.setTimeout(()=>{
                        getVehicleData()
                    }, 200)
                    setUIClicked(false)
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

function CockpitPositionView(){
    return(
        <UiEntity
        key={resources.slug + "edit::vehicle::cockpit::view"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        display: vehicleView === "cockpit" ? "flex" : "none"
    }}
>
{Transform.has(vehicleInfo.holder) &&
    <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
        override={updateCockpitPosition}
        rowHeight={'35%'}
        entity={vehicleInfo.holder}
        factor={selectedItem && selectedItem.pFactor}
        valueFn={(type:string)=>{
            let transform = Transform.get(vehicleInfo.holder)
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

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
    >
            <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
            height: '100%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Save", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            updateVehicle("edit", "holderPos", Transform.get(vehicleInfo.holder).position)
            utils.timers.setTimeout(()=>{
                getVehicleData()
                upateEditVehicleView("main")
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>

</UiEntity>
    )
}


function getType(){
    switch(vehicleInfo.type){
        case 0:
            return "Ground Vehicle"

         case 1:
            return "Flying Vehicle"

        default:
            return ""
    }
}

export function updateVehicle(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.VEHICLE_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value,
        }
    )
}
