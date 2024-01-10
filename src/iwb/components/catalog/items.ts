import {SceneItem} from "../../helpers/types";
import {realm, worlds} from "../scenes";

export let items: Map<string, SceneItem> = new Map();
export let newItems: Map<string, SceneItem> = new Map();

export let original: SceneItem[] = []
export let sortedAll: SceneItem[] = []
export let Sorted3D: SceneItem[] = []
export let Sorted2D: SceneItem[] = []
export let SortedAudio: SceneItem[] = []

export function refreshSortedItems() {
    original = [...items.values()]

    sortedAll = sortByType(original)
    Sorted3D = sortByType(original, "3D")
    Sorted2D = sortByType(original, "2D")
    SortedAudio = sortByType(original, "Audio")
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