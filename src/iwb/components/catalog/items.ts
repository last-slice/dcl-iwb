import {SceneItem} from "../../helpers/types";
import { selectedSetting } from "../../ui/Panels/CatalogPanel";
import {realm, worlds} from "../scenes";

export let items: Map<string, SceneItem> = new Map();
export let newItems: Map<string, SceneItem> = new Map();

export let original: SceneItem[] = []
export let playerItemsOriginal: SceneItem[] = []

export let sortedAll: SceneItem[] = []
export let Sorted3D: SceneItem[] = []
export let Sorted2D: SceneItem[] = []
export let SortedAudio: SceneItem[] = []
export let SortedSmartItems: SceneItem[] = []

export function refreshSortedItems() {
    original = [...items.values()].filter((it:any)=> !it.ugc)
    playerItemsOriginal = [...items.values()].filter((it:any)=> it.ugc)

    sortedAll = sortByType(selectedSetting === 0 ? original : playerItemsOriginal)
    Sorted3D = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "3D")
    Sorted2D = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "2D")
    SortedAudio = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "Audio")
    SortedSmartItems = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "SM")
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

function sortByType(items: SceneItem[], type?: string) {
    return type ?
        items.filter((item: any) => item.ty === type).sort((a, b) => a.n.localeCompare(b.n)) :
        items.sort((a, b) => a.n.localeCompare(b.n))
}

export function setNewItems() {
    let world = worlds.find((w) => w.ens === realm)
    if (world) {
        items.forEach((item: SceneItem, key: string) => {
            if (item.v > world.v) {
                newItems.set(key, item)
            }
        })
    }

}