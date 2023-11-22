import ReactEcs, {Label, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4, Quaternion, Vector3} from '@dcl/sdk/math'
import {engine, Transform} from '@dcl/ecs'
import {objName} from './CatalogPanel'
import {dimensions} from '../helpers'
import {sceneBuilds} from "../../components/scenes";
import {localPlayer} from "../../components/player/player";
import {getWorldPosition} from "@dcl-sdk/utils";

export let showNotificationPanel = false

export function displayNotificationPanel(value: boolean) {
    showNotificationPanel = value
}

export function createNotificationPanel() {
    return (
        <UiEntity
            key={"notificationpanel"}
            uiTransform={{
                display: showNotificationPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * .4,
                height: dimensions.height * .75,
                positionType: 'absolute',
                position: {right: (dimensions.width - (dimensions.width * .4)) / 2, top: "1%"}
            }}
            uiBackground={{color: Color4.create(0.063, 0.118, 0.31, .5)}}
        >
            <Label
                onMouseDown={() => {
                    console.log('Player Position clicked !')
                }}
                // value={`Shape: ${getShape()}`}
                value={`Object: ${objName}`}
                fontSize={18}
                uiTransform={{width: '100%', height: 30}}
            />
            <Label
                onMouseDown={() => {
                    console.log('Player Position clicked !')
                }}
                value={`Player: ${getPlayerPosition()}`}
                fontSize={18}
                uiTransform={{width: '100%', height: 30}}
            />

            <Label
                onMouseDown={() => {
                    console.log('Player Position clicked !')
                }}
                value={`Cam: ${getCameraPosition()}`}
                fontSize={18}
                uiTransform={{width: '100%', height: 30}}
            />

            <Label
                onMouseDown={() => {
                    console.log('Player Position clicked !')
                }}
                value={`Cam: ${getCameraParentPosition()}`}
                fontSize={18}
                uiTransform={{width: '100%', height: 30}}
            />

            <Label
                onMouseDown={() => {
                    console.log('Player Position clicked !')
                }}
                value={`Camera: ${getCameraRotation()}`}
                fontSize={18}
                uiTransform={{width: '100%', height: 30}}
            />

            {displaySceneBuilds()}

        </UiEntity>
    )
}

function displaySceneBuilds() {
    const buildsUIList: ReactEcs.JSX.Element[] = []

    sceneBuilds.forEach((sceneBuild, key) => {

        const itemsUiList: ReactEcs.JSX.Element[] = []

        sceneBuild.ass.forEach( (item) => {

            itemsUiList.push(
                <UiEntity

                    uiTransform={{
                        width: '100%', height: 500,
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                    uiBackground={{color: Color4.create(0.063, 0.118, 0.31, .5)}}

                >
                    {/*<Label*/}
                    {/*    key={key}*/}
                    {/*    value={sceneBuild.id}*/}
                    {/*    fontSize={18}*/}
                    {/*    uiTransform={{ width: '50%', height: 30 } }*/}
                    {/*/>*/}
                    <Label
                        key={key}
                        value={
                            item.id}
                        fontSize={18}
                        uiTransform={{width: '50%', height: 30}}
                    />
                </UiEntity>
            )

        })


        buildsUIList.push(
            <UiEntity

                uiTransform={{
                    width: '100%', height: 500,
                    alignItems: 'center',
                    flexDirection: 'column',
            }}
                uiBackground={{color: Color4.create(0.063, 0.118, 0.31, .5)}}


            >
                {/*<Label*/}
                {/*    key={key}*/}
                {/*    value={sceneBuild.id}*/}
                {/*    fontSize={18}*/}
                {/*    uiTransform={{ width: '50%', height: 30 } }*/}
                {/*/>*/}
                <Label
                    key={key}
                    value={sceneBuild.n}
                    fontSize={18}
                    uiTransform={{width: '50%', height: 30}}
                />
                {itemsUiList}
            </UiEntity>
        )

    })

    return buildsUIList
}


function getPlayerPosition() {
    const playerPosition = Transform.getOrNull(engine.PlayerEntity)
    if (!playerPosition) return ' no data yet'
    const {x, y, z} = playerPosition.position
    return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

function getCameraPosition() {


    const playerPosition = Transform.getOrNull(engine.CameraEntity)
    if (!playerPosition) return ' no data yet'
    const {x, y, z} = playerPosition.position
    return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

function getCameraParentPosition() {
    if(!localPlayer || !localPlayer.cameraParent) return ' no data yet'


    const playerPosition = getWorldPosition(localPlayer.cameraParent)// Transform.getOrNull(localPlayer.cameraParent)
    if (!playerPosition) return ' no data yet'
    const {x, y, z} = playerPosition
    return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

function getCameraRotation() {
    const cameraTransform = Transform.getOrNull(engine.CameraEntity)
    if (!cameraTransform) return ' no data yet'
    //const {x, y, z, w} = cameraTransform.rotation

    const rotEuler = Quaternion.toEulerAngles(cameraTransform.rotation)
    const {x, y, z} = rotEuler

    return `${isLookingUpOrDown(cameraTransform.rotation)}  ${changeAmount(cameraTransform.rotation)}  {X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)}}`// , w: ${w.toFixed(2)}}`
}

function normalizeQuaternion(q: Quaternion) {
    let magnitude = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
    return {
        w: q.w / magnitude,
        x: q.x / magnitude,
        y: q.y / magnitude,
        z: q.z / magnitude
    };
}


function rotateVectorByQuaternion(vector: Vector3, quaternion: Quaternion) {
    let w = quaternion.w, x = quaternion.x, y = quaternion.y, z = quaternion.z;
    let ix = w * vector.x + y * vector.z - z * vector.y,
        iy = w * vector.y + z * vector.x - x * vector.z,
        iz = w * vector.z + x * vector.y - y * vector.x,
        iw = -x * vector.x - y * vector.y - z * vector.z;

    return {
        x: ix * w + iw * -x + iy * -z - iz * -y,
        y: iy * w + iw * -y + iz * -x - ix * -z,
        z: iz * w + iw * -z + ix * -y - iy * -x
    };
}

function isLookingUpOrDown(quaternion: Quaternion) {
    let rotatedUpVector = rotateVectorByQuaternion({x: 0, y: 0, z: 1}, normalizeQuaternion(quaternion));
    return rotatedUpVector.y > 0 ? "Up" : "Down";
}

function changeAmount(quaternion: Quaternion) {
    let rotatedUpVector = rotateVectorByQuaternion({x: 0, y: 0, z: 1}, quaternion);
    return angleBetweenVectors({x: 0, y: 0, z: 1}, rotatedUpVector);
}

function angleBetweenVectors(u: { x: number, y: number, z: number }, v: { x: number, y: number, z: number }): number {
    let dotProduct = u.x * v.x + u.y * v.y + u.z * v.z;
    return Math.acos(dotProduct);
}


// function getShape(){
//   if(sphereSelect){
//     return 'Sphere'
//   }
//   if(triSelect){
//     return 'Cylinder'
//   }
//   if(cubeSelect){
//     return 'Cube'
//   }
//   if(customSelect){
//     return 'Custom Model'
//   }
//   else{
//     return 'No Object Selected'
//   }

// }