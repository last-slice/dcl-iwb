import {sceneBuilds} from "../components/scenes";
import {TransformType} from "@dcl/sdk/ecs";

type Parcel = string;
type Range = { xmin: number, xmax: number, zmin: number, zmax: number };


export function isItemInScene(transform: TransformType, bb: { x: number, z: number }, parcels: Parcel[]): boolean {
    // get x, z range values for all scene parcels
    const range = getParcelRange(parcels);

    // get 4 corner points of the item
    // TODO adjust for scale and rotation
    const points = getCornerPoints(transform.position.x, transform.position.z, bb.x, bb.z);

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

export function getCenterOfParcels(parcels: Parcel[]): Point {
    let range = getParcelRange(parcels)
    return [
        (range.xmin + range.xmax) / 2,
        (range.zmin + range.zmax) / 2
    ];
}


export function findSceneByParcel(parcel: string): any | undefined {
    for (let [key, scene] of sceneBuilds) {
        if (scene.pcls.find((sc: string) => sc === parcel)) {
            return scene
        }
    }
}

export function getParcelForPosition(x: number, z: number): string {
    return `${Math.floor(x / 16)},${Math.floor(z / 16)}`;
}