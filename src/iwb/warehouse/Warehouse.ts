import { createAudioRoom } from "./Audio";

export let inWarehouse = true
export let warehouseHoverFn:any
export let warehouseHoverExitFn:any
export let warehouseClickFn:any

export function createWarehouse(){
    createAudioRoom()
}

export function setWarehouseHoverFn(fnc:any){
    warehouseHoverFn = (data:any)=>{
        console.log('running warehouse hover function', data)
        fnc(data)
    }
}

export function setWarehouseHoverExitFn(fnc:any){
    warehouseHoverExitFn = (data:any)=>{
        console.log('running warehouse exit hover function', data)
        fnc(data)
    }
}

export function setWarehouseClickFn(fnc:any){
    warehouseClickFn = (data:any)=>{
        console.log('running warehouse clickver function', data)
        fnc(data)
    }
}