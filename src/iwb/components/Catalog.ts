import { SceneItem } from "../helpers/types";
import { selectedSetting } from "../ui/Objects/CatalogPanel";
import { realm, worlds } from "./Config";

export let items: Map<string, SceneItem> = new Map();
export let newItems: Map<string, SceneItem> = new Map();

export let original: SceneItem[] = []
export let playerItemsOriginal: SceneItem[] = []

export let sortedAll: SceneItem[] = []
export let Sorted3D: SceneItem[] = []
export let Sorted2D: SceneItem[] = []
export let SortedAudio: SceneItem[] = []
export let SortedSmartItems: SceneItem[] = []

export let styles: string[] = []

export function updateStyles(updates: string[]) {
    updates.forEach((update) => {
        styles.push(update)
    })
    styles = styles.sort((a, b) => a.localeCompare(b));
    styles.unshift("Audio")
    styles.unshift("All")
}

export function setCatalog(catalog:any){
    for (const key in catalog) {
        if (catalog.hasOwnProperty(key)) {
            const value = catalog[key];
            updateItem(key, value)
        }
    }
}

export function setRealmAssets(assets:any){
    for (const key in assets) {
        if (assets.hasOwnProperty(key)) {
            const value = assets[key];
            updateItem(key, value)
        }
    }
}

export function refreshSortedItems() {
    original = [...items.values()].filter((it:any)=> !it.ugc)
    playerItemsOriginal = [...items.values()].filter((it:any)=> it.ugc)

    sortedAll = sortByType(selectedSetting === 0 ? original : playerItemsOriginal)
    Sorted3D = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "3D")
    Sorted2D = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "2D")
    SortedAudio = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "Audio")
    SortedSmartItems = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "SM")
}

export function updateItem(id: string, update: SceneItem) {
    if(update.anim){
        update.tag ? update.tag.push("animation") : update.tag['animation']
    }
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