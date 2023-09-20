export let airdropServer = ""
export let airdropAuth = ""

export let giveawayServer = ""
export let giveawayAuth = ""

export let airdropsEnabled = false
export let mintsEnabled = false
export let discordEnabled = false

export let mintContract = ""

export function updateAirdropsEnabled(enabled:boolean){
  airdropsEnabled = enabled
}

export function updateDiscordEnabled(enabled:boolean){
  discordEnabled = enabled
}

export function updateAirdropServer(link:string){
    airdropServer = link
}

export function updateMintsEnabled(enabled:boolean){
  mintsEnabled = enabled
}


export function updateMintcontract(c:string){
  mintContract = c
}