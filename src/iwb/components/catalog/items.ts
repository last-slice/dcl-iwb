import { log } from "../../helpers/functions";
import {SceneItem} from "../../helpers/types";
import { realm, worlds } from "../scenes";

export let items: Map<string, SceneItem> = new Map();
export let newItems: Map<string, SceneItem> = new Map();

export let original: SceneItem[] = []
export let sortedAll: SceneItem[] = []
export let Sorted3D: SceneItem[] = []
export let Sorted2D: SceneItem[] = []

export function refreshSortedItems() {
    original = [...items.values()]

    sortedAll = original.sort((a, b) => a.n.localeCompare(b.n));
    Sorted3D = original.filter((item: any) => item.ty === "3D").sort((a, b) => a.n.localeCompare(b.n));
    Sorted2D = original.filter((item: any) => item.ty === "2D").sort((a, b) => a.n.localeCompare(b.n));

    console.log("items are ", original)
}

export function setAllItems(updates: SceneItem[]) {
    updates.forEach((update) => {
        items.set(update.id, update)
    })
    refreshSortedItems()


}

export function updateItem(id: string, update: SceneItem) {
    items.set(id, update)
}

export function setNewItems(){
    let world = worlds.find((w)=> w.ens === realm)
    if(world){
        items.forEach((item:SceneItem, key:string)=>{
            if(item.v > world.v){
                newItems.set(key, item)
            }
        })
    }

}