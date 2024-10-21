
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { Actions, COMPONENT_TYPES, EDIT_MODES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { utils } from '../../../helpers/libraries'
import { AvatarAnchorPointType, AvatarAttach, CameraModeArea, ColliderLayer, engine, Entity, GltfContainer, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { setUIClicked } from '../../ui'
import { TransformInputModifiers } from './EditTransform'
import { uiSizes } from '../../uiConfig'
import { addFPVWeapon } from '../../../components/Weapon'
import { checkTransformComponent } from '../../../components/Transform'
import { getEntity } from '../../../components/iwb'
import { checkGLTFComponent } from '../../../components/Gltf'
import { addForceCamera, removeForceCamera } from '../../../modes/Play'

export let weaponView = "main"
let weaponInfo:any = {}
let weaponEntity:Entity
let editAid:string = ""
let sceneId:string = ""
let muzzle:Entity

let audios:any[] = []
let selectedAudioIndex:number = 0

let projectiles:any[] = []
let selectedProjectileIndex:number = 0

export function updateEditWeaponView(view:string){
    weaponView = view
}

export function getWeaponData(){
   let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let weapon = scene[COMPONENT_TYPES.WEAPON_COMPONENT].get(selectedItem.aid)
    if(!weapon){
        return
    }

    editAid = selectedItem.aid
    sceneId = selectedItem.sceneId

    weaponInfo = {...weapon}

    console.log('weapon info is ', weaponInfo)

    engine.removeEntity(weaponInfo.weaponFPVParentEntity)
    engine.removeEntity(weaponEntity)
    engine.removeEntity(muzzle)
}

export function removeEditWeapon(){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return
    }

    engine.removeEntity(weaponEntity)
    engine.removeEntity(weaponInfo.weaponFPVParentEntity)
    engine.removeEntity(muzzle)

    removeForceCamera()

    let entityInfo = getEntity(scene, editAid)
    checkTransformComponent(scene, entityInfo)
    checkGLTFComponent(scene, entityInfo)

    weaponView = "main"
    // editAid = ""
    // sceneId = ""
    audios.length = 0
}

function addEditFPVWeapon(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    addForceCamera(0)
    let iwbInfo = scene[COMPONENT_TYPES.IWB_COMPONENT].get(selectedItem.aid)

    weaponEntity = addFPVWeapon(weaponInfo, iwbInfo)
}

function addMuzzleFPV(){
    muzzle = engine.addEntity()
    MeshRenderer.setSphere(muzzle)
    Transform.create(muzzle, {parent: weaponInfo.weaponFPVParentEntity, position: weaponInfo.muzzleOffsetFPV, scale: Vector3.create(0.2,0.2,0.2)})
}

function getSceneAudios(){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return
    }

    audios.length = 0
    selectedAudioIndex = 0

    scene[COMPONENT_TYPES.ACTION_COMPONENT].forEach((actionComponent:any, aid:string)=>{
        let playAudios = [...actionComponent.actions.filter(($:any)=> $.type === Actions.PLAY_SOUND)]
        playAudios.forEach((audioAction:any) => {
            audios.push({aid:aid, id:audioAction.id, name:audioAction.name }) 
        }); 
    })

    console.log('audios are', audios)
}

function getSceneProjectiles(){
    let scene = colyseusRoom.state.scenes.get(sceneId)
    if(!scene){
        return
    }

    projectiles.length = 0
    selectedProjectileIndex = 0

    scene[COMPONENT_TYPES.WEAPON_COMPONENT].forEach((weaponComponent:any, aid:string)=>{
        if(weaponComponent.type === 1){
            let name = scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid)
            projectiles.push({name:name.value, aid:aid})
        }
    })
}

export function updatePositionOffset(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(weaponEntity).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
}

export function updateRotationOffset(direction:string, factor:number, manual?:boolean){
    let transform = Transform.getMutable(weaponEntity)
    let rot:any = Quaternion.toEulerAngles(transform.rotation)

    rot[direction] = manual ? factor : rot[direction] + (factor * selectedItem.rFactor)
    transform.rotation = Quaternion.fromEulerDegrees(rot.x, rot.y, rot.z)
}

export function updateScaleOffset(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(weaponEntity).scale
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)
}

export function updateMuzzlePositionOffset(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(muzzle).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
}

export function EditWeapon() {
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.WEAPON_COMPONENT ? 'flex' : 'none',
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
                    display: weaponView === "main" ? "flex" : "none"
                }}
            uiText={{value:"Weapon Type: " + getType(), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent:'center',
                    width: '100%',
                    height: '10%',
                    display:weaponInfo.type === -1 ? "flex" : "none"
                }}
            >
                <Dropdown
                    options={["Select Type", "Gun", "Projectile"]}
                    selectedIndex={0}
                    onChange={(index:number)=>{
                        if(index !== 0){
                            weaponInfo.type = index - 1
                            update("type", "type", index - 1)
                            utils.timers.setTimeout(()=>{
                                getWeaponData()
                            }, 300)
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

                    <WeaponEditButtons/>
                    <EditAttributes/>
                    <EditFirstPersonView/>
                    <EditMuzzleFPV/>
                    <EditAudio/>
                    <EditProjectile/>

        </UiEntity>
    )
}

function WeaponEditButtons(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::buttons"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                display: weaponView === "main" && weaponInfo.type === 0 ? 'flex' : 'none',
            }}
        >

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
    uiText={{value: "Edit Attributes", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        weaponView = "attributes"
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
    uiText={{value: "Edit FPV", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        weaponView = "fpv"
        addEditFPVWeapon()
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
    uiText={{value: "Edit 3PV", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        weaponView = "3pv"
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
        margin:{top:'1%', bottom:'1%'},
        display: weaponInfo.type === 0 ? 'flex' : 'none'
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Muzzle", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        weaponView = "muzzle"
        addEditFPVWeapon()
        addMuzzleFPV()
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
        margin:{top:'1%', bottom:'1%'},
        display: weaponInfo.type === 0 ? 'flex' : 'none'
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Audio", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        weaponView = "audio"
        getSceneAudios()
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
        margin:{top:'1%', bottom:'1%'},
        display: weaponInfo.type === 0 ? 'flex' : 'none'
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Edit Projectile", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        weaponView = "projectile"
        getSceneProjectiles()
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

    </UiEntity>
    )
}

function EditAttributes(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::attributes"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                display: weaponView === "attributes" ? 'flex' : 'none',
            }}
        >

            <GunAttributes/>

    </UiEntity>
    )
}

function GunAttributes(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::attributes::gun"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: weaponView === "attributes" && weaponInfo.type === 0 ? 'flex' : 'none',
            }}
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
            uiText={{value:"Editing Weapon Attributes", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            {/* mag size */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Magazine Size: " + (weaponInfo.magSize), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        >
             <Input
                    onSubmit={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.magSize = amount
                    }}
                    onChange={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.magSize = amount
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'0'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '95%',
                        height: '100%',
                    }}
                />
            </UiEntity>

        </UiEntity>

        {/* max ammo */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Max Ammo: " + (weaponInfo.maxAmmo), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        >
             <Input
                    onSubmit={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.maxAmmo = amount
                    }}
                    onChange={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.maxAmmo = amount
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'0'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '95%',
                        height: '100%',
                    }}
                />
            </UiEntity>

        </UiEntity>

        {/* range */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Max Range: " + (weaponInfo.range), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        >
             <Input
                    onSubmit={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.range = amount
                    }}
                    onChange={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.range = amount
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'0'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '95%',
                        height: '100%',
                    }}
                />
            </UiEntity>

        </UiEntity>

            {/* velocity */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Projectile Velocity: " + (weaponInfo.velocity), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        >
             <Input
                    onSubmit={(value) => {
                        let amount = parseFloat(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.velocity = amount
                    }}
                    onChange={(value) => {
                        let amount = parseFloat(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.velocity = amount
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'0'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '95%',
                        height: '100%',
                    }}
                />
            </UiEntity>

        </UiEntity>

        {/* mag size */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Recoil Speed: " + (weaponInfo.recoilSpeed), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        >
             <Input
                    onSubmit={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.recoilSpeed = amount
                    }}
                    onChange={(value) => {
                        let amount = parseInt(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.recoilSpeed = amount
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'0'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '95%',
                        height: '100%',
                    }}
                />
            </UiEntity>

        </UiEntity>

        {/* fire rate */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Fire Rate / Cooldown (in seconds): " + (weaponInfo.fireRate), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        >
             <Input
                    onSubmit={(value) => {
                        let amount = parseFloat(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.fireRate = amount
                    }}
                    onChange={(value) => {
                        let amount = parseFloat(value.trim())
                        if(isNaN(amount)){
                            return
                        }
                        weaponInfo.fireRate = amount
                    }}
                    color={Color4.White()}
                    fontSize={sizeFont(25, 15)}
                    placeholder={'0'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '95%',
                        height: '100%',
                    }}
                />
            </UiEntity>

        </UiEntity>

        {/* auto firing */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Automatic Firing: " + (weaponInfo.fireAuto ? "Automatic" : "Semi-auto"), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
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
            uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT && 
            weaponInfo.fireAuto ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            weaponInfo.fireAuto = !weaponInfo.fireAuto
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />
            </UiEntity>

        </UiEntity>

         {/* multiplayer sync */}
         <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{bottom:"1%"},
            }}
        >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '85%',
                height: '100%',
            }}
            uiText={{value:"Sync Projectiles: " + (weaponInfo.synced ? "Multiplayer Sync" : "Local Only"), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15), color:Color4.White()}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
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
            uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT && 
            weaponInfo.synced ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            weaponInfo.synced = !weaponInfo.synced
            setUIClicked(false)
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
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '10%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            update('edit', 'data', weaponInfo)
            utils.timers.setTimeout(()=>{
                removeEditWeapon()
                updateEditWeaponView('main')
                getWeaponData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

            </UiEntity>
    )
}

function EditFirstPersonView(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::fpv"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                display: weaponView === "fpv" && weaponInfo.type >= 0 ? 'flex' : 'none',
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
        uiText={{value:"Edit First Person View", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />


{Transform.has(weaponEntity) &&
    <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
        override={updatePositionOffset}
        rowHeight={'26%'}
        entity={weaponEntity}
        factor={selectedItem && selectedItem.pFactor}
        valueFn={(type:string)=>{
            let transform = Transform.get(weaponEntity)
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


{Transform.has(weaponEntity) &&
    <TransformInputModifiers modifier={EDIT_MODIFIERS.ROTATION}
        override={updateRotationOffset}
        rowHeight={'26%'}
        entity={weaponEntity}
        factor={selectedItem && selectedItem.rFactor}
        valueFn={(type:string)=>{
            let transform = Transform.get(weaponEntity)
            let rot = Quaternion.toEulerAngles(transform.rotation)//
            switch (type) {
                case 'x':
                    return rot.x.toFixed(3)
                case 'y':
                    return rot.y.toFixed(3)
                case 'z':
                    return rot.z.toFixed(3)
            }
        }}
    />
    }


{Transform.has(weaponEntity) &&
    <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE}
        override={updateScaleOffset}
        rowHeight={'26%'}
        entity={weaponEntity}
        factor={selectedItem && selectedItem.sFactor}
        valueFn={(type:string)=>{
            let transform = Transform.get(weaponEntity)
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


<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '10%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)

            weaponInfo.pOffsetFPV = Vector3.clone(Transform.get(weaponEntity).position)
            weaponInfo.rOffsetFPV = Quaternion.toEulerAngles(Transform.get(weaponEntity).rotation)
            weaponInfo.sizeFPV = Vector3.clone(Transform.get(weaponEntity).scale)

            update('edit', 'data', weaponInfo)
            utils.timers.setTimeout(()=>{
                removeEditWeapon()
                updateEditWeaponView('main')
                getWeaponData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

    </UiEntity>
    )
}

function EditMuzzleFPV(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::muzzle::fpv"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                display: weaponView === "muzzle" && weaponInfo.type >= 0 ? 'flex' : 'none',
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
        uiText={{value:"Edit Muzzle Location", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />


{Transform.has(muzzle) &&
    <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
        override={updateMuzzlePositionOffset}
        rowHeight={'26%'}
        entity={muzzle}
        factor={selectedItem && selectedItem.pFactor}
        valueFn={(type:string)=>{
            let transform = Transform.get(muzzle)
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '10%',
            margin:{top:'2%'}
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)

            weaponInfo.muzzleOffsetFPV = Vector3.clone(Transform.get(muzzle).position)
            update('edit', 'data', weaponInfo)
            utils.timers.setTimeout(()=>{
                removeEditWeapon()
                updateEditWeaponView('main')
                getWeaponData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

    </UiEntity>
    )
}

function EditAudio(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::audio"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                display: weaponView === "audio" && weaponInfo.type === 1 ? 'flex' : 'none',
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
        uiText={{value:"Projectile Audio Action", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
        >
        <Dropdown
            options={audios.map($=> $.name)}
            selectedIndex={0}
            onChange={(index:number)=>{
                selectedAudioIndex = index
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '10%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)

            weaponInfo.audioActionAid = audios[selectedAudioIndex].aid
            weaponInfo.audioActionId = audios[selectedAudioIndex].id
            update('edit', 'data', weaponInfo)
            utils.timers.setTimeout(()=>{
                removeEditWeapon()
                updateEditWeaponView('main')
                getWeaponData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

    </UiEntity>
    )
}

function EditProjectile(){
    return (
        <UiEntity
            key={resources.slug + "edit::weapon::panel::projectile"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%',
                display: weaponView === "projectile" && weaponInfo.type === 0 ? 'flex' : 'none',
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
        uiText={{value:"Choose Projectile", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent:'center',
            width: '100%',
            height: '10%',
        }}
        >
        <Dropdown
            options={projectiles.map($=> $.name)}
            selectedIndex={0}
            onChange={(index:number)=>{
                selectedProjectileIndex = index
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '10%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Update", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)

            weaponInfo.projectile = projectiles[selectedProjectileIndex].aid
            update('edit', 'data', weaponInfo)
            utils.timers.setTimeout(()=>{
                removeEditWeapon()
                updateEditWeaponView('main')
                getWeaponData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />

    </UiEntity>
    )
}

function getType(){
    switch(weaponInfo.type){
        case 0:
            return "Gun"

         case 1:
            return "Projectile"

        default:
            return ""
    }
}

function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.WEAPON_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value,
        }
    )
}
