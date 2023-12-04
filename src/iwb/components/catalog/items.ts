import {SceneItem} from "../../helpers/types";

export let items: Map<string, SceneItem> = new Map();

export let original: SceneItem[] = []
export let sortedAll: SceneItem[] = []
export let Sorted3D: SceneItem[] = []
export let Sorted2D: SceneItem[] = []

export function refreshSortedItems() {
    original = [...items.values()]

    sortedAll = original.sort((a, b) => a.n.localeCompare(b.n));
    Sorted3D = original.filter((item: any) => item.ty === "3D").sort((a, b) => a.n.localeCompare(b.n));
    Sorted2D = original.filter((item: any) => item.ty === "2D").sort((a, b) => a.n.localeCompare(b.n));
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