
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { utils } from '../../../helpers/libraries'
import { engine, Entity, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { TransformInputModifiers } from './EditTransform'
import { cannonMaterials } from '../../../components/Physics'

export let physicsView = "main"
let newMaterial = ""
let newContactMaterial:any = {}
let physicsInfo:any = {}
let physicsEntity:Entity
let scene:any
let materials:any[] = []
let contactMaterials:any[] = []

export function updatePhysicsView(view:string){
    physicsView = view
}

export function clearAssetPhysicsData(){
    // engine.removeEntity(physicsEntity)
    scene = undefined
    physicsView = "main"
    newMaterial = ""
    newContactMaterial = {
        name:"",
        from:"",
        to:"",
        friction:1,
        bounce:1,
    }
}

export function getAssetPhysicsData(){
    materials.length = 0
    contactMaterials.length = 0
    newContactMaterial = {
        name:"",
        from:"",
        to:"",
        friction:1,
        bounce:1,
    }

    scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        return
    }

    let physics = scene[COMPONENT_TYPES.PHYSICS_COMPONENT].get(selectedItem.aid)
    if(!physics){
        return
    }

    physicsInfo = {...physics}

    console.log('physics info is ', physicsInfo)

    // engine.removeEntity(physicsEntity)
    // if(physicsInfo.shape !== undefined){
    //     physicsEntity = engine.addEntity()
    //     Transform.create(physicsEntity, {parent: selectedItem.entity,
    //         position: physicsInfo.offset !== undefined ? physicsInfo.offset : Vector3.create(0,0,0),
    //         scale: physicsInfo.offset !== undefined ? physicsInfo.size : Vector3.create(1,1,1),
    //     })

    //     switch(physicsInfo.shape){
    //         case 0:
    //             MeshRenderer.setBox(physicsEntity)
    //             break;

    //         case 1:
    //             MeshRenderer.setPlane(physicsEntity)
    //             break;

    //         case 2:
    //             MeshRenderer.setSphere(physicsEntity)
    //             break;
    //     }

    //     console.log('transform is', Transform.get(physicsEntity))
    // }

    cannonMaterials.forEach((cm:any, material:string)=>{
        console.log('materials', material)
        materials.push(material)
    })

    scene[COMPONENT_TYPES.PHYSICS_COMPONENT].forEach((component:any)=>{
        // if(component.materials){
        //     component.materials.forEach((material:any)=>{//
        //         materials.push(material)
        //     })
        // }

        if(component.contactMaterials){
            component.contactMaterials.forEach((cm:any, name:string)=>{
                console.log('contact material is', name, cm)
                contactMaterials.push({name:name, from:cm.from, to:cm.to, friction:cm.friction, bounce:cm.restitution})
            })
        }
    })

    materials.unshift("Select Physics Material")
}

// export function updatePositionOffset(direction:string, factor:number, manual?:boolean){
//     let transform:any = Transform.getMutable(physicsEntity).position
//     transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)

//     // newActionData.sx = transform.x
//     // newActionData.sy = transform.y
//     // newActionData.sz = transform.z
// }

// export function updateScaleOffset(direction:string, factor:number, manual?:boolean){
//     let transform:any = Transform.getMutable(physicsEntity).scale
//     transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.sFactor)

//     // newActionData.sx = transform.x
//     // newActionData.sy = transform.y
//     // newActionData.sz = transform.z
// }


export function EditPhysics() {
    return (
        <UiEntity
            key={resources.slug + "edit::physics::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.PHYSICS_COMPONENT ? 'flex' : 'none',
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
        display: physicsView === "main" ? "flex" : "none"
    }}
uiText={{value:"Physics Type: " + getType(), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
        display:physicsInfo.type === -1 ? "flex" : "none"
    }}
>
    <Dropdown
        options={["Select Type", "Configuration", "Object"]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                physicsInfo.type = index - 1
                update("edit", "type", index - 1)
                utils.timers.setTimeout(()=>{
                    getAssetPhysicsData()
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
        margin:{bottom:"1%"},
        display: physicsInfo.type === 1 && physicsView === "main" ? "flex" : "none"
    }}
uiText={{value:"Physics Shape: " + getShape(), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
        display: physicsInfo.shape < 0 && physicsInfo.type === 1 && physicsView === "main" ? "flex" : "none"
    }}
>
    <Dropdown
        options={["Select Shape", "Box", "Plane", "Sphere"]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                physicsInfo.shape = index - 1
                update("edit", "shape", index - 1)
                utils.timers.setTimeout(()=>{
                    getAssetPhysicsData()
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
        margin:{bottom:"1%"},
        display: physicsInfo.shape >= 0 && physicsView === "main" ? "flex" : "none"
    }}
uiText={{value:"Physics Material: " + (physicsInfo.material !== undefined ? physicsInfo.material : ""), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:"1%"},
        display: materials.length <= 1 && physicsInfo.type === 1 && physicsInfo.shape >= 0 ? "flex" : "none"
    }}
uiText={{value:"Please create an entity with a Physics Configuration and add Materials to it first. Then choose from that list of materials to apply to this object", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '10%',
        display: physicsView === "main" && physicsInfo.shape >= 0 ? "flex" : "none"
        // display: physicsView === "main" && physicsInfo.shape >= 0 && physicsInfo.type >= 0 && physicsInfo.material && physicsInfo.material.length > 0 && materials.length >= 1 ? "flex" : "none"//
    }}
>
    <Dropdown
        options={[...materials]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                physicsInfo.shape = index - 1
                update("edit", "material", materials[index])
                utils.timers.setTimeout(()=>{
                    getAssetPhysicsData()
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
        margin:{top:'1%', bottom:'1%'},
        display: physicsView === "main" && physicsInfo.type === 1 && physicsInfo.shape >= 0 && physicsInfo.material ? 'flex' : 'none'
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Details", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        physicsView = "details"
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

{/* <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:'1%', bottom:'1%'},
        display: physicsView === "main" && physicsInfo.type === 1 && physicsInfo.shape >= 0 && physicsInfo.material ? 'flex' : 'none'
    }}
    uiBackground={{color: Color4.Black()}}
    uiText={{value: "Size && Offset", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        physicsView = "sizes"
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/> */}

{/* details container */}
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '90%',
        display: physicsView === "details" ? "flex" : "none"
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:'1%', bottom:'1%'},
        display: physicsInfo.shape !== undefined ? "flex" : "none"
    }}
    >
                <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: '100%',
    }}
    uiText={{textWrap:'nowrap', value:"Mass (kg): " + (physicsInfo.mass), fontSize:sizeFont(30,15), textAlign:'middle-left'}}
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

    <Input
        onChange={(value) => {
            let mass = parseFloat(value.trim())
            if(!isNaN(mass)){
                physicsInfo.mass = mass
            }
        }}
        onSubmit={(value) => {
            let mass = parseFloat(value.trim())
            if(!isNaN(mass)){
                physicsInfo.mass = mass
            }
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter mass'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
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
            width: '100%',
            height: '100%',
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
            update('edit', 'mass', physicsInfo.mass)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
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
        width: '100%',
        height: '12%',
        margin:{top:'1%', bottom:'1%'},
        display: physicsInfo.shape !== undefined ? "flex" : "none"
    }}
    >
                <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: '100%',
    }}
    uiText={{value:"Linear Friction (0-1): " + (physicsInfo.linearDamping), fontSize:sizeFont(30,15), textAlign:'middle-left'}}
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

    <Input
        onChange={(value) => {
            let mass = parseFloat(value.trim())
            if(!isNaN(mass)){
                physicsInfo.linearDamping = mass
            }
        }}
        onSubmit={(value) => {
            let mass = parseFloat(value.trim())
            if(!isNaN(mass)){
                physicsInfo.linearDamping = mass
            }
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter friction'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
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
            width: '100%',
            height: '100%',
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
            update('edit', 'linearDamping', physicsInfo.linearDamping)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
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
        width: '100%',
        height: '12%',
        margin:{top:'1%', bottom:'1%'},
        display: physicsInfo.shape !== undefined ? "flex" : "none"
    }}
    >
                <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: '100%',
    }}
    uiText={{value:"Angular Friction (0-1): " + (physicsInfo.angularDamping), fontSize:sizeFont(30,15), textAlign:'middle-left'}}
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

    <Input
        onChange={(value) => {
            let mass = parseFloat(value.trim())
            if(!isNaN(mass)){
                physicsInfo.angularDamping = mass
            }
        }}
        onSubmit={(value) => {
            let mass = parseFloat(value.trim())
            if(!isNaN(mass)){
                physicsInfo.angularDamping = mass
            }
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter friction'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
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
            width: '100%',
            height: '100%',
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
            update('edit', 'angularDamping', physicsInfo.angularDamping)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
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
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"},
            }}
        >

                    {/* url label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '100%',
            }}
        uiText={{textWrap:'nowrap', value:"Fixed Rotation", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: physicsInfo.fixedRotation ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            update('edit', 'fixedRotation', physicsInfo.fixedRotation === undefined ? true : !physicsInfo.fixedRotation)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
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


{/* configuration container */}
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '90%',
        display: physicsInfo.hasOwnProperty("type") && physicsInfo.type === 0 && physicsView === "main" ? "flex" : "none"
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
    uiText={{value: "Materials", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        physicsView = "materials"
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
    uiText={{value: "Contact Materials", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        physicsView = "contacts"
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
    uiText={{value: "Scene Gravity", fontSize: sizeFont(30, 20)}}
    onMouseDown={() => {
        setUIClicked(true)
        physicsView = "gravity"
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>

</UiEntity>

<Materials/>
<ContactMaterials/>
{/* <Sizes/> */}
<Gravity/>

        </UiEntity>
    )
}

// function Sizes(){
//     return(
// <UiEntity
// key={resources.slug + "edit::physics::sizes"}
//     uiTransform={{
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//         alignContent:'center',
//         width: '100%',
//         height: '90%',
//         display: physicsView === "sizes" ? "flex" : "none"
//     }}
// >

// <UiEntity
//     uiTransform={{
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//         height: '10%',
//         margin:{bottom:"1%"},
//     }}
// uiText={{value:"Physics Sizes && Offset", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
// />

// {/* {Transform.has(physicsEntity) &&
//     <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
//         override={updatePositionOffset}
//         rowHeight={'35%'}
//         entity={physicsEntity}
//         factor={selectedItem && selectedItem.pFactor}
//         valueFn={(type:string)=>{
//             let transform = Transform.get(physicsEntity)
//             switch (type) {
//                 case 'x':
//                     return transform.position.x.toFixed(3)
//                 case 'y':
//                     return transform.position.y.toFixed(3)
//                 case 'z':
//                     return (transform.position.z).toFixed(3)
//             }
//         }}
//     />
//     } */}

// {/* {Transform.has(physicsEntity) &&
//     <TransformInputModifiers modifier={EDIT_MODIFIERS.SCALE}
//         override={updateScaleOffset}
//         rowHeight={'35%'}
//         entity={physicsEntity}
//         factor={selectedItem && selectedItem.sFactor}
//         valueFn={(type:string)=>{
//             let transform = Transform.get(physicsEntity)
//             switch (type) {
//                 case 'x':
//                     return transform.scale.x.toFixed(3)
//                 case 'y':
//                     return transform.scale.y.toFixed(3)
//                 case 'z':
//                     return (transform.scale.z).toFixed(3)
//             }
//         }}
//     />
//     } */}

// <UiEntity
//     uiTransform={{
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//         height: '10%',
//     }}
//     >
//             <UiEntity
//         uiTransform={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '20%',
//             height: '100%',
//         }}
//         uiBackground={{
//             textureMode: 'stretch',
//             texture: {
//                 src: 'assets/atlas2.png'
//             },
//             uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
//         }}
//         uiText={{value: "Save", fontSize: sizeFont(20, 16)}}
//         onMouseDown={() => {
//             setUIClicked(true)
//             update("size-offset", "size-offset", {transform: Transform.get(physicsEntity)})
//             utils.timers.setTimeout(()=>{
//                 getAssetPhysicsData()
//                 updatePhysicsView("main")
//             }, 200)
//             setUIClicked(false)
//         }}
//         onMouseUp={()=>{
//             setUIClicked(false)
//         }}
//     />
//         </UiEntity>

// </UiEntity>
//     )
// }

function Gravity(){
    return(
        <UiEntity
        key={resources.slug + "edit::physics::gravity"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '90%',
        display: physicsView === "gravity" ? "flex" : "none"
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
uiText={{value:"Scene Gravity: " + (physicsInfo.gravity), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

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
    >

    <Input
        onChange={(value) => {
            if(isNaN(parseFloat(value.trim()))){
                return
            }
            physicsInfo.gravity = parseFloat(value.trim())
        }}
        onSubmit={(value) => {
            if(isNaN(parseFloat(value.trim()))){
                return
            }
            physicsInfo.gravity = parseFloat(value.trim())
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter new number (m/s2)'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
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
            width: '100%',
            height: '100%',
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
            update("edit", "gravity", physicsInfo.gravity)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
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
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"5%"}
            }}
        >

                    {/* url label */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
        uiText={{textWrap:'nowrap', value:"Gravity Effects Player", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: physicsInfo && physicsInfo.type === 0 && physicsInfo.playerReactGravity ? 
            getImageAtlasMapping(uiSizes.toggleOnTrans) : 
            getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            update("edit", "playerReactGravity", !physicsInfo.playerReactGravity)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
        }}
        />


        </UiEntity>


        </UiEntity>

</UiEntity>
    )
}

function Materials(){
    return(
        <UiEntity
        key={resources.slug + "edit::physics::materials"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '90%',
        display: physicsView === "materials" ? "flex" : "none"
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
uiText={{value:"Physics Materials", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

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
    >

    <Input
        onChange={(value) => {
            newMaterial = value.trim().replace(/ /g, "")
        }}
        onSubmit={(value) => {
            newMaterial = value.trim().replace(/ /g, "")
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter material name'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '95%',
            height: '100%',
        }}
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
            width: '100%',
            height: '100%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            update("add-material", "material", newMaterial)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>

    </UiEntity>


    {
        physicsView === "materials" && 
        generateMaterialRows()
    }

</UiEntity>
    )
}

function ContactMaterials(){
    return(
        <UiEntity
        key={resources.slug + "edit::physics::contactmaterials"}
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent:'center',
        width: '100%',
        height: '90%',
        display: physicsView === "contacts" ? "flex" : "none"
    }}
>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
uiText={{value:"Contact Materials", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:"1%"},
    }}
uiText={{value:"Contact materials are how two types of materials interact with each other when collided - ex, ball and wall.", fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:'1%'}
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
    }}
    >
    <Input
        onChange={(value) => {
            newContactMaterial.name = value.trim().replace(/ /g, "")
        }}
        onSubmit={(value) => {
            newContactMaterial.name = value.trim().replace(/ /g, "")
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter contact material name'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
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
uiText={{value:'(example "ballWall")', fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
/>

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '12%',
        margin:{bottom:"1%"},
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
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '30%',
        margin:{bottom:"3%"},
    }}
uiText={{value:"From", fontSize:sizeFont(20, 15), color:Color4.White(), textAlign:'middle-left'}}
/>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '70%',
    }}
>
    <Dropdown
        options={[...materials]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                newContactMaterial.from = materials[index]
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '30%',
        margin:{bottom:"3%"},
    }}
uiText={{value:"To", fontSize:sizeFont(20, 15), color:Color4.White(), textAlign:'middle-left'}}
/>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
        width: '100%',
        height: '70%',
    }}
>
    <Dropdown
        options={[...materials]}
        selectedIndex={0}
        onChange={(index:number)=>{
            if(index !== 0){
                newContactMaterial.to = materials[index]
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

</UiEntity>

</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:'3%'}
    }}
    >
        <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33%',
        height: '100%',
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:"5%"},
    }}
uiText={{value:'Friction', fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
/>

    <Input
        onChange={(value) => {
            let temp = parseFloat(value.trim().replace(/ /g, ""))
            if(!isNaN(temp)){
                newContactMaterial.friction = temp
            }
        }}
        onSubmit={(value) => {
            let temp = parseFloat(value.trim().replace(/ /g, ""))
            if(!isNaN(temp)){
                newContactMaterial.friction = temp
            }
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter 0-1'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        />

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33%',
        height: '100%',
    }}
    >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{bottom:"5%"},
    }}
uiText={{value:'Bounce', fontSize:sizeFont(20, 12), color:Color4.White(), textAlign:'middle-left'}}
/>

    <Input
        onChange={(value) => {
            let temp = parseFloat(value.trim().replace(/ /g, ""))
            if(!isNaN(temp)){
                newContactMaterial.bounce = temp
            }
        }}
        onSubmit={(value) => {
            let temp = parseFloat(value.trim().replace(/ /g, ""))
            if(!isNaN(temp)){
                newContactMaterial.bounce = temp
            }
        }}
        fontSize={sizeFont(20,15)}
        placeholder={'Enter 0-1'}
        placeholderColor={Color4.White()}
        color={Color4.White()}
        uiTransform={{
            width: '100%',
            height: '100%',
        }}
        />

    </UiEntity>

    <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33%',
        height: '100%',
    }}
    >
            <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '75%',
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
        }}
        uiText={{value: "Add", fontSize: sizeFont(20, 16)}}
        onMouseDown={() => {
            setUIClicked(true)
            update("add-contact-material", "contactMaterial", newContactMaterial)
            utils.timers.setTimeout(()=>{
                getAssetPhysicsData()
            }, 200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
    />
        </UiEntity>


    </UiEntity>

    {
        physicsView === "contacts" && 
        generateContactMaterialRows()
    }

</UiEntity>
    )
}

function getType(){
    switch(physicsInfo.type){
        case 0:
            return "Configuration"

         case 1:
            return "Object"

        default:
            return ""
    }
}

function getShape(){
    switch(physicsInfo.shape){
        case 0:
            return "Box"

         case 1:
            return "Plane"

         case 2:
            return "Sphere"

        default:
            return ""
    }
}

function generateMaterialRows(){
    let arr:any[] = []
    let count:number = 0

    materials.forEach((material:any, i:number)=>{
        if(i !== 0){
            arr.push(<PRow count={count} material={material}/>)
            count++
        }
    })
    return arr
}

function generateContactMaterialRows(){
    let arr:any[] = []
    let count:number = 0//

    contactMaterials.forEach((cm:any, i:number)=>{
            arr.push(<CRow count={count} cm={cm}/>)
            count++
    })
    return arr
}

function PRow(data:any){
    return(
        <UiEntity
                key={resources.slug + "physics::material::row" + data.count}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{top:"1%", bottom:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '80%',
                    height: '100%',
                    margin:{left:'5%'}
                }}
                >
                    <UiEntity
                        uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    uiText={{value:"" + data.material, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                    />

                </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:'center',
                    width: '20%',
                    height: '100%',
                    margin:{right:'5%'}
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    positionType:'absolute',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    update("delete-material", "material", data.material)
                    utils.timers.setTimeout(()=>{
                        getAssetPhysicsData()
                    }, 200)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />  

            </UiEntity>

            </UiEntity>
    )
}

function CRow(data:any){
    return(
        <UiEntity
                key={resources.slug + "physics::contactmaterial::row" + data.count}
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{top:"1%", bottom:"1%"}
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
                }}
            >
                <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '80%',
                    height: '100%',
                    margin:{left:'5%'}
                }}
                >
                    <UiEntity
                        uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    uiText={{value:"" + data.cm.name, fontSize:sizeFont(20,15), textAlign:'middle-left'}}
                    />

                </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:'center',
                    width: '20%',
                    height: '100%',
                    margin:{right:'5%'}
                }}
            >
                 <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                    height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height,
                    positionType:'absolute',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas1.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.trashButton)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    update("delete-contact-material", "contactMaterial", data.cm.name)//
                    utils.timers.setTimeout(()=>{
                        getAssetPhysicsData()
                    }, 200)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
                />  

            </UiEntity>

            </UiEntity>
    )
}

function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.PHYSICS_COMPONENT, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value,
        }
    )
}
