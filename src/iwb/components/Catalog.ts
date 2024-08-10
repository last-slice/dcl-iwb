import { NOTIFICATION_TYPES, SceneItem, SERVER_MESSAGE_TYPES } from "../helpers/types";
import { initCatalog, selectedSetting, updateSearchFilter } from "../ui/Objects/CatalogPanel";
import { showNotification } from "../ui/Objects/NotificationPanel";
import { displayPendingPanel } from "../ui/Objects/PendingInfoPanel";
import { displaySkinnyVerticalPanel } from "../ui/Reuse/SkinnyVerticalPanel";
import { getView } from "../ui/uiViews";
import { sendServerMessage } from "./Colyseus";
import { realm, worlds } from "./Config";
import { settings } from "./Player";

export let items: Map<string, SceneItem> = new Map();
export let newItems: Map<string, SceneItem> = new Map();
export let marketplaceItems: Map<string, SceneItem> = new Map();

export let original: SceneItem[] = []
export let playerItemsOriginal: SceneItem[] = []
export let marketplaceOriginal: SceneItem[] = []

export let sortedAll: SceneItem[] = []
export let Sorted3D: SceneItem[] = []
export let Sorted2D: SceneItem[] = []
export let SortedAudio: SceneItem[] = []
export let SortedSmartItems: SceneItem[] = []
export let SortedNewest: SceneItem[] = []

export let styles: string[] = []

export function updateStyles(updates: string[]) {
    updates.forEach((update) => {
        styles.push(update)
    })
    styles = styles.sort((a, b) => a.localeCompare(b));
    styles.unshift("Audio")
    styles.unshift("New")
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

export function confirmDeleteAsset(item:any, ugc?:boolean){
    if(settings.confirms){
        console.log('confirm delete asset')
        displaySkinnyVerticalPanel(true, getView("Delete_Realm_Asset"), item.n, ()=>{
            deleteRealmAsset(item, ugc)
        })
    }else{
        deleteRealmAsset(item, ugc)
    }
}

export function deleteRealmAsset(item:any, ugc?:boolean){
    console.log('delete realm asset', item)
    sendServerMessage(ugc ? SERVER_MESSAGE_TYPES.DELETE_UGC_ASSET : SERVER_MESSAGE_TYPES.DELETE_WORLD_ASSETS, [item.id])
    showNotification({type:NOTIFICATION_TYPES.MESSAGE, message:"Item removed! Initiate a deployment to remove them from your world.", animate:{enabled:true, return:true, time:7}})
    displayPendingPanel(true, "assetsready")

    items.delete(item.id)
    refreshSortedItems()
    initCatalog(sortedAll)
}

export function refreshSortedItems() {
    original = [...items.values()].filter((it:any)=> !it.ugc)
    playerItemsOriginal = [...items.values()].filter((it:any)=> it.ugc)

    console.log('player items are ', playerItemsOriginal)

    sortedAll = sortByType(selectedSetting === 0 ? original : playerItemsOriginal)
    Sorted3D = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "3D")
    Sorted2D = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "2D")
    SortedAudio = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "Audio")
    SortedSmartItems = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "SM")
    SortedNewest = sortByType(selectedSetting === 0 ? original : playerItemsOriginal, "New")
}

export function refreshMarketplaceItems() {
    marketplaceOriginal = [...marketplaceItems.values()].filter(item1 => !original.some(item2 => item2.id === item1.id));

    sortedAll = sortByType(marketplaceOriginal)
    Sorted3D = sortByType(marketplaceOriginal, "3D")
    Sorted2D = sortByType(marketplaceOriginal, "2D")
    SortedAudio = sortByType(marketplaceOriginal, "Audio")
    SortedSmartItems = sortByType(marketplaceOriginal, "SM")
    SortedNewest = sortByType(marketplaceOriginal, "New")
}

export function updateItem(id: string, update: SceneItem) {
    if(update.anim){
        update.tag ? update.tag.push("animations") : update.tag['animations']
    }
    items.set(id, update)
}

function sortByType(items: SceneItem[], type?: string) {
    if(type){
        if(type === "New"){
            return items.filter((item:any)=> item.time && item. time >= (Date.now() / 1000) - (5 * 24 * 60 * 60))
        }
        else{
            return items.filter((item: any) => item.ty === type).sort((a, b) => a.n.localeCompare(b.n))
        }
    }else{
        return items.sort((a, b) => a.n.localeCompare(b.n))
    }
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

export function resetCatalog(){
    updateSearchFilter("")
    initCatalog(sortedAll)
}