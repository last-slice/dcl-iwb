import { getWorldPosition, getWorldRotation } from "@dcl-sdk/utils";
import { engine, MeshRenderer, VisibilityComponent, Entity, TransformType, Material, Transform } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import { items } from "../components/Catalog";
import { settings } from "../components/Player";
import { log } from "./functions";
import { colyseusRoom } from "../components/Colyseus";


type Parcel = string;
type Range = { xmin: number, xmax: number, zmin: number, zmax: number };

export const bbE = engine.addEntity()
MeshRenderer.setBox(bbE)
Material.setPbrMaterial(bbE, {albedoColor: Color4.create(1, 1, 0, 0.5)})
VisibilityComponent.create(bbE, {visible: false})

export function isEntityInScene(entity: Entity, catalogId: string): boolean {
    if(settings && !settings.sceneCheck){
        return true
    }
    // check if object inside scene boundaries
    const itemWorldPositon = getWorldPosition(entity)
    const itemWorldRotation = getWorldRotation(entity)
    const curParcel = getParcelForPosition(itemWorldPositon.x, itemWorldPositon.z)
    //log('cur parcel', curParcel)
    const curScene = findSceneByParcel(curParcel)
    //log('cur scene', curScene)

    if (curScene) {

        let itemData = items.get(catalogId)
        let selEntityTransform = Transform.get(entity)

        const isInside = isItemInScene({
                position: itemWorldPositon,
                scale: selEntityTransform.scale,
                rotation: itemWorldRotation
            },
            itemData?.bb ?? {x: 1, y: 1, z: 1},
            curScene.pcls)

        log('is inside', isInside)
        return isInside

    } else {
        log('item is outside of scene')
        return false
    }
}


export function isItemInScene(transform: TransformType, bb: {
    x: number,
    y: number,
    z: number
}, parcels: Parcel[]): boolean {
    // get x, z range values for all scene parcels
    const range = getParcelRange(parcels);
    //log('range', range)

    // get 4 corner points of the item
    const rotEuler = Quaternion.toEulerAngles(transform.rotation)
    const points = getCornerPointsWithRotation(
        transform.position.x,
        transform.position.z,
        bb.x * transform.scale.x,
        bb.z * transform.scale.z,
        rotEuler.y);

    //log('points', points)

    // check if each point is in scene range
    for (let point of points) {
        if (!isPointInRange(point[0], point[1], range.xmin, range.xmax, range.zmin, range.zmax)) {
            return false
        }
    }
    return true
}

function getParcelRange(parcels: Parcel[]): Range {
    let xmin = Infinity, zmin = Infinity, xmax = -Infinity, zmax = -Infinity;

    for (let parcel of parcels) {
        if(parcel === '') continue;

        let [x, z] = parcel.split(',').map(Number);
        xmin = Math.min(xmin, x);
        zmin = Math.min(zmin, z);
        xmax = Math.max(xmax, x);
        zmax = Math.max(zmax, z);
    }

    // Multiply by 16 to get the actual range
    xmin *= 16;
    zmin *= 16;
    xmax = xmax * 16 + 16; // Add 16 to include the width of the parcel
    zmax = zmax * 16 + 16; // Add 16 to include the height of the parcel

    return {xmin, xmax, zmin, zmax};
}

function isPointInRange(x: number, z: number, xmin: number, xmax: number, zmin: number, zmax: number) {
    return x >= xmin && x <= xmax && z >= zmin && z <= zmax;
}

type Point = [number, number];

function getCornerPoints(x: number, z: number, length: number, width: number): Point[] {
    const halfLength = length / 2;
    const halfWidth = width / 2;

    const topLeft: Point = [x - halfLength, z + halfWidth];
    const topRight: Point = [x + halfLength, z + halfWidth];
    const bottomLeft: Point = [x - halfLength, z - halfWidth];
    const bottomRight: Point = [x + halfLength, z - halfWidth];

    return [topLeft, topRight, bottomLeft, bottomRight];
}


function rotatePoint(px: number, pz: number, cx: number, cz: number, angle: number): Point {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Translate point back to origin
    px -= cx;
    pz -= cz;

    // Rotate point
    const xnew = px * cos - pz * sin;
    const znew = px * sin + pz * cos;

    // Translate point back
    const newPoint: Point = [xnew + cx, znew + cz];
    return newPoint;
}

function getCornerPointsWithRotation(x: number, z: number, length: number, width: number, rotation: number): Point[] {
    const halfLength = length / 2;
    const halfWidth = width / 2;

    let topLeft: Point = [x - halfLength, z + halfWidth];
    let topRight: Point = [x + halfLength, z + halfWidth];
    let bottomLeft: Point = [x - halfLength, z - halfWidth];
    let bottomRight: Point = [x + halfLength, z - halfWidth];

    // Rotate each corner point around the center point (x, z) by the rotation angle
    topLeft = rotatePoint(topLeft[0], topLeft[1], x, z, rotation);
    topRight = rotatePoint(topRight[0], topRight[1], x, z, rotation);
    bottomLeft = rotatePoint(bottomLeft[0], bottomLeft[1], x, z, rotation);
    bottomRight = rotatePoint(bottomRight[0], bottomRight[1], x, z, rotation);

    return [topLeft, topRight, bottomLeft, bottomRight];
}


export function getCenterOfParcels(parcels: Parcel[]): Point {
    let range = getParcelRange(parcels)
    return [
        (range.xmin + range.xmax) / 2,
        (range.zmin + range.zmax) / 2
    ];
}


export function findSceneByParcel(parcel: string): any | undefined {
    for (let [key, scene] of colyseusRoom.state.scenes) {
        if (scene.pcls.find((sc: string) => sc === parcel)) {
            return scene
        }
    }
}

export function getParcelForPosition(x: number, z: number): string {
    return `${Math.floor(x / 16)},${Math.floor(z / 16)}`;
}


export function createBBForEntity(entity: Entity, catalogId: string) {
    const itemWorldPositon = getWorldPosition(entity)
    const itemWorldRotation = getWorldRotation(entity)

    const selEntityTransform = Transform.get(entity)
    let itemData = items.get(catalogId)

    const transform = {
        position: itemWorldPositon,
        scale: selEntityTransform.scale,
        rotation: itemWorldRotation
    }
    const bb = itemData?.bb ?? {x: 1, y: 1, z: 1}
    Transform.createOrReplace(bbE, {
        position: Vector3.create(
            transform.position.x,
            transform.position.y + (transform.scale.y * bb.y / 2),
            transform.position.z),
        rotation: transform.rotation,
        scale: Vector3.create(
            bb.x * transform.scale.x,
            bb.y * transform.scale.y,
            bb.z * transform.scale.z)
    })

}