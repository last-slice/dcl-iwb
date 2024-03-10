import {items} from "./items";

export let styles: string[] = []

export function updateStyles(updates: string[]) {
    updates.forEach((update) => {
        styles.push(update)
    })
    styles = styles.sort((a, b) => a.localeCompare(b));
    styles.unshift("All")
}

export {items}