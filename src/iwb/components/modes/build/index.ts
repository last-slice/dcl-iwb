import { log } from "../../../helpers/functions"
import { items } from "../../catalog"


export let selectedCatalogItem:any = null

export function enableBuildMode(){
}

export function selectCatalogItem(item:any){
    selectedCatalogItem = item
}