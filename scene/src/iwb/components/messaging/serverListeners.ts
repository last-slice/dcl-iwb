import { log } from "../../functions"
import { items } from "../catalog"


export function initiateMessageListeners(room:any){
    room.onMessage("init", (info:any)=>{
        log('init message received', info)

        //set initial catalog
        let catalog = info.catalog
        for (const key in catalog) {
            if (catalog.hasOwnProperty(key)) {
              const value = catalog[key];
              items.set(key,value)
            }
          }
        log('catalog size is', items.size)
    })
}