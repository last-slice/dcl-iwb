
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources, { colors, colorsLabels } from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, EDIT_MODES, EDIT_MODIFIERS, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { sceneEdit, selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { Billboard, BillboardMode, engine, Entity, Material, MeshRenderer, TextShape, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { sizeFont, calculateSquareImageDimensions, getImageAtlasMapping, calculateImageDimensions, getAspect } from '../../helpers'
import { uiSizes } from '../../uiConfig'
import { setUIClicked } from '../../ui'
import { TransformInputModifiers } from './EditTransform'
import { utils } from '../../../helpers/libraries'
import { paginateArray } from '../../../helpers/functions'

let editingPath = false
export let editPathView = "main"
let pathEntities:Entity[] = []

let visibleItems:any[] = []
let visibleIndex:number = 1

let pathInfo:any = {}
let currentPathPoint:Entity

export function updateEditPathView(view:string){
    editPathView = view
}

export function resetPathEntities(reset?:boolean){
    if(reset){
        editingPath = false
    }

    console.log('resetting entities')
    pathEntities.forEach((entity:Entity)=>{
        engine.removeEntityWithChildren(entity)
    })

    engine.removeEntityWithChildren(currentPathPoint)
}

export function updateEditPathPanel(){
    let itemInfo = sceneEdit[COMPONENT_TYPES.PATH_COMPONENT].get(selectedItem.aid)
    if(!itemInfo){
        return
    }

    pathInfo = {...itemInfo}

    let transform = sceneEdit[COMPONENT_TYPES.TRANSFORM_COMPONENT].get(selectedItem.aid)
    if(transform){
        pathInfo.position = transform.p
    }else{
        pathInfo.position = {x:0, y:0, z:0}
    }

    editPathView = "main"

    resetPathEntities()
    pathInfo.paths.forEach(async (point:any, index:number)=>{
        pathEntities.push(await addPathPoint(point, index))
    })

    visibleItems = paginateArray([...pathInfo.paths], visibleIndex, 6)
}

export function updateCurrentPathPoint(direction:string, factor:number, manual?:boolean){
    let transform:any = Transform.getMutable(currentPathPoint).position
    transform[direction] = manual ? factor : transform[direction] + (factor * selectedItem.pFactor)
}

function addPathPoint(point:any, index:any){
    console.log("adding path point", point, index)
    currentPathPoint = engine.addEntity()

    Transform.create(currentPathPoint, {position: point, parent: sceneEdit.parentEntity})
    
    let plane = engine.addEntity()
    MeshRenderer.setBox(plane)
    Transform.create(plane, {scale:Vector3.create(0.5,0.5,0.5), rotation:Quaternion.fromEulerDegrees(0,0,90), parent:currentPathPoint})
    Material.setPbrMaterial(plane, {albedoColor: Color4.create(Math.random(), Math.random(),Math.random())})

    let text = engine.addEntity()
    Transform.create(text, {position: Vector3.create(0,1,0), parent:currentPathPoint})
    TextShape.create(text, {text:"Point " + (index + 1), fontSize:3})
    Billboard.create(text, {billboardMode:BillboardMode.BM_Y})

    return currentPathPoint
}

export function EditPath() {
    return (
        <UiEntity
            key={resources.slug + "edit::path::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.PATH_COMPONENT ? 'flex' : 'none',
            }}
        >

            {/* main panel */}
              <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: editPathView === "main" ? 'flex' : 'none',
            }}
        >

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:"1%"}
    }}
>
            {/* loop row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{top:"1%"}
            }}
        >

                    {/* url label// */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin:{right:'5%'}
            }}
        uiText={{textWrap:'nowrap',value:"Start Relative", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
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
            uvs: pathInfo && pathInfo.start === 2 ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            update("edit", "start", pathInfo.start === 2 ? 1 : 2)
            utils.timers.setTimeout(()=>{
                updateEditPathPanel()
            },200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


        </UiEntity>

                {/* look point row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
                width: '40%',
                height: '100%',
                margin:{right:'5%'}
            }}
        uiText={{textWrap:'nowrap',value:"Back to Start", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: pathInfo && pathInfo.backToStart ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            update("edit", "backToStart", !pathInfo.backToStart)
            utils.timers.setTimeout(()=>{//
                updateEditPathPanel()
            },200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


        </UiEntity>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
        margin:{top:"1%"}
    }}
>
            {/* loop row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{top:"1%"}
            }}
        >

                    {/* url label// */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                height: '100%',
                margin:{right:'5%'}
            }}
        uiText={{textWrap:'nowrap',value:"Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
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
            uvs: pathInfo && pathInfo.loop ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            update("edit", "loop", !pathInfo.loop)
            utils.timers.setTimeout(()=>{
                updateEditPathPanel()
            },200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


        </UiEntity>

                {/* look point row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
                width: '40%',
                height: '100%',
                margin:{right:'5%'}
            }}
        uiText={{textWrap:'nowrap',value:"Look At Points", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: pathInfo && pathInfo.lookPoint ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            update("edit", "lookPoint", !pathInfo.lookPoint)
            utils.timers.setTimeout(()=>{
                updateEditPathPanel()
            },200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


        </UiEntity>


</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '15%',
        margin:{top:"1%"}
    }}
>
            {/* loop row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{top:"1%"}
            }}
        >
                        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{value:"Path Duration (seconds)", textWrap:'nowrap', fontSize:sizeFont(20,15), textAlign:'middle-left'}}//
        />
<Input
            onChange={(value) => {
                if(isNaN(parseFloat(value.trim()))){
                    return
                }
                update("edit", "duration", parseFloat(value.trim()))
            }}
            fontSize={sizeFont(20,15)}
            placeholder={'' + (pathInfo && pathInfo.duration)}
            placeholderColor={Color4.White()}
            color={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '70%',
            }}
            ></Input>

        </UiEntity>

                {/* look point row */}
                <UiEntity
            uiTransform={{
                flexDirection: 'row',
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
                width: '40%',
                height: '100%',
                margin:{right:'5%'}
            }}
        uiText={{textWrap:'nowrap',value:"Smooth Path", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
            uvs: pathInfo && pathInfo.smooth ? getImageAtlasMapping(uiSizes.toggleOnTrans) : getImageAtlasMapping(uiSizes.toggleOffTrans)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            update("edit", "smooth", !pathInfo.smooth)
            utils.timers.setTimeout(()=>{
                updateEditPathPanel()
            },200)
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />


        </UiEntity>


        </UiEntity>


</UiEntity>


        {/* current path label row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '95%',
                height: '15%',
                margin:{top:"1%"}
            }}
        >
                    <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '80%',
                height: '100%',
            }}
            uiText={{value:"Current Points: " + (pathInfo && pathInfo.paths && pathInfo.paths.length), textWrap:'nowrap', textAlign:'middle-left', fontSize:sizeFont(20,15)}}
        />

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: '20%',
                height: '100%',//
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
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
                value: "Add Point",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                addPathPoint(pathInfo.position, pathInfo.paths.length)
                editPathView = "add"
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
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '60%',
                margin:{top:"1%"}
            }}
        >
            {
                editPathView === "main" &&
                pathInfo && pathInfo.paths &&
                generatePathRows()//
            }
            </UiEntity>

{/* pagination arrows */}
<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            height: '10%',
        }}
        >
                        {/* scroll up button */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).width,
                height: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).height,
                margin: {left: "5%"},
            }}
            // uiBackground={{color:Color4.White()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                if(visibleIndex -1 >= 1){
                    visibleIndex--
                    visibleItems = paginateArray([...pathInfo.paths], visibleIndex, 6)
                }
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

        {/* scroll down button */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                margin: {right: "1%"},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                visibleIndex++
                visibleItems = paginateArray([...pathInfo.paths], visibleIndex, 6)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
        

</UiEntity>

        </UiEntity>

         {/* add paths panel */}
              <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
              display: editPathView === "add" ? 'flex' : 'none',
            }}
        >

            { 
                editPathView === "add" &&
                currentPathPoint && 
                <TransformInputModifiers modifier={EDIT_MODIFIERS.POSITION}
                    override={updateCurrentPathPoint}
                    rowHeight={'35%'}
                    factor={selectedItem && selectedItem.pFactor}
                    valueFn={(type:string)=>{
                        let transform = Transform.get(currentPathPoint)
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
                height: '20%',
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
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
                value: "Set Point",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center',
                textWrap:'nowrap'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                update("addpoint", "point", Transform.get(currentPathPoint).position)
                utils.timers.setTimeout(()=>{
                    updateEditPathPanel()
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

function generatePathRows(){
    let arr:any[] = []
    let count = 0
    visibleItems.forEach((point:any)=>{
        arr.push(<PathRow count={count} point={point} />)
        count++
    })

    return arr
}


function PathRow(data:any){
    return(
        <UiEntity
        key={resources.slug + "edit::path::row::" + data.count}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%", bottom:'1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)}}
            >  

            {/* point name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '100%',
                margin:{left:'1%'}
            }}
            uiText={{textWrap:'nowrap', textAlign:'middle-left', value:"Point " + (((visibleIndex - 1) * 6) + data.count + 1), fontSize:sizeFont(20,15)}}
            />

            {/* re order row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            />

            {/* delete row */}
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
            width: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).width,
                height: calculateImageDimensions(1.5, getAspect(uiSizes.trashButton)).height
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
            update('deletepoint', "point", ((visibleIndex - 1) * 6) + data.count)
            utils.timers.setTimeout(()=>{
                updateEditPathPanel()
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






function update(action:string, type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.PATH_COMPONENT,
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            action:action,
            [type]:value
        }
    )
}