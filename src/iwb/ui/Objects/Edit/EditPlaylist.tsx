
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { paginateArray } from '../../../helpers/functions'
import { utils } from '../../../helpers/libraries'

let typeIndex = 0
let playmodeIndex = 0
let playlist:any = {}
let newItem:string = ""
export let playlistView:string = "main"

let visibleItems:any[] = []
let visibleIndex:number = 1

export let type:any[] = [
    "SELECT",
    "IMAGES",
    "VIDEO",
    "AUDIO"
]

let playModes:any[] = [
    "SELECT",
    "IN ORDER",
    "SHUFFLE"
]

export function updatePlaylistComponent(refresh?:boolean){
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    let itemInfo = scene[COMPONENT_TYPES.PLAYLIST_COMPONENT].get(selectedItem.aid)
    if(!itemInfo){
        return
    }

    playlist = {...itemInfo}
    newItem = ""

    if(refresh){
        visibleItems.length = 0
    }
    else{
        playlistView = "main"
        visibleIndex = 1
    }
   
    visibleItems = paginateArray([...playlist.playlist], visibleIndex, 6)
    typeIndex = playlist.type >= 0 ? playlist.type + 1 : 0
    playmodeIndex = playlist.playtype + 1
}

export function EditPlaylist() {
    return (
        <UiEntity
            key={resources.slug + "edit::playlist;:panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.PLAYLIST_COMPONENT ? 'flex' : 'none',
            }}
        >

      {/* main items view */}  
  <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: playlistView === "main" ? "flex" : "none"
            }}
        >

                    {/* type row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '50%',
            }}
        uiText={{value:"Playlist Type", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '60%',
                    }}
                >

                    <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                display: typeIndex !== 0 ? 'flex' : 'none'
                            }}
                            uiText={{textWrap:'nowrap', value:"" + (type[typeIndex]), fontSize:sizeFont(20,15)}}
                        />

                        <Dropdown
                    options={type}
                    selectedIndex={typeIndex}
                    onChange={selectTypeIndex}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                        display:typeIndex === 0 ? 'flex' : 'none'
                    }}
                    // uiBackground={{color:Color4.Purple()}}//
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />

        </UiEntity>


        </UiEntity>

    {/* items amount row */}
    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
        >

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
        uiText={{value:"Item Count: " + (playlist.playlist ? playlist.playlist.length : 0), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                    }}
                >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Add Items",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'//
            }}
            onMouseDown={() => {
                setUIClicked(true)
                playlistView = "add"
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            />

        </UiEntity>


        </UiEntity>

            {/* play type row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"},
            }}
        >

        {/* add playlist item */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '100%',
            }}
        uiText={{value:"Play Mode", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '40%',
                height: '100%',
            }}
            >
         <Dropdown
                    options={playModes}
                    selectedIndex={playmodeIndex}
                    onChange={selectPlaymodeIndex}
                    uiTransform={{
                        width: '100%',
                        height: '120%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}//
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />
        </UiEntity>

        </UiEntity>
    
    {/* images slide time row */}
    <UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"},
                display: typeIndex === 1 ? "flex" : "none"
            }}
        >

        {/* add playlist item */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '100%',
            }}
        uiText={{value:"Slide Time (in seconds)", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >
            <Input
                onSubmit={(value) => {
                    playlist.slideTime = parseFloat(value.trim())
                    update('edit', 'slidetime', playlist.slideTime)
                }}
                onChange={(value) => {
                    playlist.slideTime = parseFloat(value.trim())
                    update('edit', 'slidetime', playlist.slideTime)
                }}
                fontSize={sizeFont(20, 15)}
                placeholder={'' + (playlist.slideTime ? playlist.slideTime : 0)}
                placeholderColor={Color4.White()}
                uiTransform={{
                    width: '100%',
                    height: '100%',
                }}
                color={Color4.White()}
            />
        </UiEntity>

        </UiEntity>

            </UiEntity>

{/* add items view */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: playlistView === "add" ? "flex" : "none"
            }}
        >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:"1%"}
            }}
        >
             <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '80%',
                    height: '100%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        newItem = value.trim()
                    }}
                    onChange={(value) => {
                        newItem = value.trim()
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'Add link'}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
            </UiEntity>

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '20%',
                    height: '100%',
                }}
            >

            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'flex-start',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Add",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
                setUIClicked(true)
                update('item', 'additem', newItem)
                utils.timers.setTimeout(()=>{
                    updatePlaylistComponent(true)
                }, 200)
                setUIClicked(false)
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
            />

            </UiEntity>

        </UiEntity>



        {/* playlist items list */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',//
                height: '10%',
            }}
        uiText={{value:"Current Playlist", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '70%',
            }}
        >

            {visibleComponent === COMPONENT_TYPES.PLAYLIST_COMPONENT && typeIndex !== 0 && getPlaylist()}

        </UiEntity>

            </UiEntity>


     
        </UiEntity>
    )
}

function selectTypeIndex(index: number) {
    if(index !== typeIndex){
        typeIndex = index - 1
        update('type', 'type', index - 1)
    }    
}

function selectPlaymodeIndex(index: number) {
    if(index !== playmodeIndex){
        playmodeIndex = index - 1
        update('type', 'playmode', index - 1)//
    }    
}

function update(type:any, action:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.PLAYLIST_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            action:action,
            type:type,
            data:value
        }
    )
}

function getPlaylist(){
    let arr:any[] = []
    let count = 0
    if(visibleItems.length > 0){
        for(let i = 0; i < 3; i++){
            arr.push(<PlaylistRow count={count}/>)
            count++
        }
    }
    return arr
}

function generateRowItems(count:number) {
    let arr:any[] = []
    let itemCount = 0
    for(let i = 0; i < 2; i++){
        arr.push( <PlaylistItem itemCount={(count * 2) + itemCount}/>)
        itemCount++
    }
    return arr
}

function PlaylistItem({itemCount}: { itemCount:number}){
    return(
<UiEntity
            key={"playlist-item-" + itemCount}
            uiTransform={{
                display:  visibleItems[itemCount] ? 'flex': 'none',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
                margin:{left:'1%', right:'1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs:getImageAtlasMapping(uiSizes.rowPillDark)
            }}
        >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
        margin:{left:'1%'}
    }}
uiText={{value:"" + (itemCount + 1), fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
/>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: '100%',
    }}
    >
        <UiEntity
                uiTransform={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: calculateSquareImageDimensions(10).width,
                    height: calculateSquareImageDimensions(10).height,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: "" + (visibleItems[itemCount])
                    }
                }}
            />
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
    }}
    >
         <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    width: calculateSquareImageDimensions(2).width,
                    height: calculateSquareImageDimensions(2).height,
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: itemCount > 0 ? "flex" : 'none'
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping(uiSizes.upArrowTrans)
                }}
                onMouseDown={() => {
                    setUIClicked(true)
                    update('up', 'reorder', itemCount)
                    utils.timers.setTimeout(()=>{
                        updatePlaylistComponent(true)
                    }, 300)
                    setUIClicked(false)
                }}
                onMouseUp={()=>{
                    setUIClicked(false)
                }}
            />

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        width: calculateSquareImageDimensions(2).width,
        height: calculateSquareImageDimensions(2).height,
        alignItems: 'center',
        justifyContent: 'center',
        display: playlist.playlist && itemCount < playlist.playlist.length - 1 ? "flex" : 'none'
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas2.png'
        },
        uvs: getImageAtlasMapping(uiSizes.downArrowTrans)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        update('down', 'reorder', itemCount)
        utils.timers.setTimeout(()=>{
            updatePlaylistComponent(true)
        }, 200)
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>
</UiEntity>

<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '10%',
        height: '100%',
    }}
    >
       

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        width: calculateSquareImageDimensions(3.5).width,
        height: calculateSquareImageDimensions(3.5).height,
        alignItems: 'center',
        justifyContent: 'center',
    }}
    uiBackground={{
        textureMode: 'stretch',
        texture: {
            src: 'assets/atlas1.png'
        },
        uvs: getImageAtlasMapping(uiSizes.trashButtonTrans)
    }}
    onMouseDown={() => {
        setUIClicked(true)
        update('down', 'remove', itemCount)
        utils.timers.setTimeout(()=>{
            updatePlaylistComponent(true)
        }, 200)
        setUIClicked(false)
    }}
    onMouseUp={()=>{
        setUIClicked(false)
    }}
/>
</UiEntity>

        </UiEntity>
    )
}

function PlaylistRow({count}: {count:number}){
    return(
        <UiEntity
        key={resources.slug + "playlist::row::" + count}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '33%',
                margin:{top:'1%', bottom:"1%"}
            }}
        >

                {generateRowItems(count)}

        </UiEntity>
    )
}