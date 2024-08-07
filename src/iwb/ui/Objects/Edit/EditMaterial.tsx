
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont } from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { COMPONENT_TYPES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { openEditComponent, visibleComponent } from '../EditAssetPanel'
import { localPlayer } from '../../../components/Player'
import { displaySkinnyVerticalPanel } from '../../Reuse/SkinnyVerticalPanel'
import { setUIClicked } from '../../ui'
import { uiSizes } from '../../uiConfig'
import { getView } from '../../uiViews'

let typeIndex = 0
let textureIndex = 0
let emissiveTextureIndex = 0
let playlistIndex = 0
let material:any = {}
let playlists:any[] = []
export let materialView = "main"

export let type:any[] = [
    "PBR",
]

let textureTypes:any[] = [
    'NONE',
    'TEXTURE',
    'PLAYLIST'
]

let materialOptions:any[] = [
    "Albedo Color",
    "Texture",
    "Emissive",
    "Roughness",
    "Intensity"
]

export function updateMaterialComponent(){
    let scene = localPlayer.activeScene
    if(!scene){
        return
    }

    let materialInfo = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(selectedItem.aid)
    if(!materialInfo){
        return
    }

    playlists.length = 0
    scene[COMPONENT_TYPES.PLAYLIST_COMPONENT].forEach((playlist:any, aid:string)=>{
        playlists.push({aid:aid, name:scene[COMPONENT_TYPES.NAMES_COMPONENT].get(aid).value})
    })
    playlists.unshift({aid:"", name:"SELECT"})

    typeIndex = materialInfo.type
    textureIndex = materialInfo.textureType ? textureTypes.findIndex($=> $ === materialInfo.textureType) : 0
    emissiveTextureIndex = textureTypes.findIndex($=> $ === materialInfo.emissiveType)
    playlistIndex = textureIndex === 0 ? 0 : materialInfo.playlist ? playlists.findIndex($=> $.aid === materialInfo.playlist) : 0

    material = {...materialInfo}

    materialView = "main"
}

export function EditMaterial() {
    return (
        <UiEntity
            key={resources.slug + "edit::material::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.MATERIAL_COMPONENT ? 'flex' : 'none',
            }}
        >


        {/* main row */}
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
        uiText={{value:"Material", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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

                <Dropdown
            options={type}
            selectedIndex={getTypeIndex()}
            onChange={selectTypeIndex}
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
            // uiBackground={{color:Color4.Purple()}}
            color={Color4.White()}
            fontSize={sizeFont(20, 15)}
        />

        </UiEntity>

        </UiEntity>

            {/* main panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: materialView === "main" ? "flex" : "none",
                margin:{top:"1%"}
            }}
        >
            {materialView === "main" && generateMainViews()}
            </UiEntity>

            {/* albedo panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: materialView === "Albedo Color" ? "flex" : "none",
                margin:{top:"2%"}
            }}
        >
                            {/* albedo color row */}
                            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '15%',
                display:typeIndex === 0 ? 'flex' : 'none'
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{bottom:'3%'}
                }}
            uiText={{value:"Albedo Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
            >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"r", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('r', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('r', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.r)}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"g", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('g', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('g', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.g)}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"b", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('b', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('b', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.b)}
                    placeholderColor={Color4.White()}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    color={Color4.White()}
                />
        </UiEntity>

            </UiEntity>
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '25%',
                    height: '100%',
                }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '25%',
                    margin:{bottom:"5%"}
                }}
            uiText={{value:"a", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: '100%',
                    height: '70%',
                }}
                >
                <Input
                    onSubmit={(value) => {
                        validateColor('a', value.trim())
                    }}
                    onChange={(value) => {
                        validateColor('a', value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (material && material.albedoColor && material.albedoColor.a)}
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

            </UiEntity>
            </UiEntity>

         {/* texture panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: materialView === "Texture" ? "flex" : "none",
                margin:{top:"2%"}
            }}
        >


            {/* texture row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'1%'},
                display:typeIndex === 0 ? 'flex' : 'none'
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
            uiText={{value:"Texture", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '80%',
                    }}
                >
                       <Dropdown
                    options={textureTypes}
                    selectedIndex={textureIndex}
                    onChange={selectTextureIndex}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />
                </UiEntity>


            </UiEntity>

            {/* texture playlist dropdown */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
                margin:{top:'1%'},
                display:textureIndex !== 0 ? 'flex' : 'none'
            }}
            >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40%',
                    height: '100%',
                }}
            uiText={{value:"Choose Playlist", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
            />

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60%',
                        height: '80%',
                    }}
                >
                       <Dropdown
                    options={playlists.map($=> $.name)}
                    selectedIndex={playlistIndex}
                    onChange={selectPlaylistIndex}
                    uiTransform={{
                        width: '100%',
                        height: '100%',
                    }}
                    // uiBackground={{color:Color4.Purple()}}
                    color={Color4.White()}
                    fontSize={sizeFont(20, 15)}
                />
                </UiEntity>


            </UiEntity>
            </UiEntity>

        {/* emissive panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: materialView === "Emissive" ? "flex" : "none",
                margin:{top:"2%"}
            }}
        >
             {/* emissive row */}
             <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{top:'1%'},
                    display:typeIndex === 0 ? 'flex' : 'none'
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
                uiText={{value:"Emissive Texture", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                />

                <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '80%',
                        }}
                    >
                        <Dropdown
                        options={textureTypes}
                        selectedIndex={emissiveTextureIndex}
                        onChange={selectEmissiveTextureIndex}
                        uiTransform={{
                            width: '100%',
                            height: '100%',
                        }}
                        // uiBackground={{color:Color4.Purple()}}
                        color={Color4.White()}
                        fontSize={sizeFont(20, 15)}
                    />
                    </UiEntity>


            </UiEntity>

            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '10%',
                    }}
                uiText={{value:"Emissive Color", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                />

            {/* emissive color row */}
            <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '10%',
                            margin:{top:'1%'},
                            display:typeIndex === 0 ? 'flex' : 'none'
                        }}
                        >

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '50%',
                                height: '80%',
                            }}
                        >
                            <Dropdown
                                options={textureTypes}
                                selectedIndex={emissiveTextureIndex}
                                onChange={selectEmissiveTextureIndex}
                                uiTransform={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                // uiBackground={{color:Color4.Purple()}}
                                color={Color4.White()}
                                fontSize={sizeFont(20, 15)}
                            />
                        </UiEntity>

                        <UiEntity
                                uiTransform={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50%',
                                    height: '80%',
                                }}
                            >
                                <Dropdown
                                options={textureTypes}
                                selectedIndex={emissiveTextureIndex}
                                onChange={selectEmissiveTextureIndex}
                                uiTransform={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                // uiBackground={{color:Color4.Purple()}}
                                color={Color4.White()}
                                fontSize={sizeFont(20, 15)}
                            />
                            </UiEntity>


            </UiEntity>

            <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '10%',
                    margin:{top:'1%'},
                    display:typeIndex === 0 ? 'flex' : 'none'
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
                uiText={{value:"Emissive Intensity", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                />

                <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '80%',
                        }}
                    >
                         <Input
                    onSubmit={(value) => {
                        validateIntensity(value.trim())
                    }}
                    onChange={(value) => {
                        validateIntensity(value.trim())
                    }}
                    fontSize={sizeFont(20, 15)}
                    placeholder={'' + (material && material.emissveType !== 'NONE' ? material.emissiveIntensity : 0)}
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
            
        {/* Roughness panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: materialView === "Roughness" ? "flex" : "none",
                margin:{top:"2%"}
            }}
        >
                        <UiEntity
                uiTransform={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '15%',
                    margin:{top:'1%'},
                }}
                >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                        margin:{right:'1%'},
                    }}
                    >
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '20%',
                        }}
                    uiText={{value:"Roughness", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                    />
                    </UiEntity>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50%',
                        height: '100%',
                        margin:{left:'1%'},
                    }}
                    >
                    <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '20%',
                            }}
                        uiText={{value:"Metallic", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
                        />
                    </UiEntity>

                </UiEntity>
            </UiEntity>

        {/* Intensity panel */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: materialView === "Intensity" ? "flex" : "none",
                margin:{top:"2%"}
            }}
        >
            </UiEntity>
     
        </UiEntity>
    )
}

function generateMainViews(){
    let arr:any[] = []
    let count = 0
    materialOptions.forEach((item:any, i:number)=>{
        arr.push(<MainView item={item} count={count} />)
        count++
    })
    return arr
}

function MainView(data:any){
    return(
        <UiEntity
        key={resources.slug + "edit::material::main::item::" + data.count}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin: {top: "2%"}
        }}
    >

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '95%',
                height: '100%',
            }}
            uiBackground={{color: Color4.Black()}}
            uiText={{value: "" + data.item, fontSize: sizeFont(30, 20)}}
            onMouseDown={() => {
                setUIClicked(true)
                materialView = data.item
            }}
            onMouseUp={()=>{
                setUIClicked(false)//
            }}
        />
    </UiEntity>
    )
}

function getTypeIndex(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene){
            let itemInfo = scene[COMPONENT_TYPES.MATERIAL_COMPONENT].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.type
            }
            return 0
        }
        return 0
    }
    return 0
}

function selectTypeIndex(index: number) {
    if(index !== typeIndex){
        typeIndex = index    
        update('type', index)
    }    
}

function selectTextureIndex(index: number) {
    if(index !== textureIndex){
        textureIndex = index
        update('texturetype', textureTypes[index])
    }    
}

function selectEmissiveTextureIndex(index: number) {
    if(index !== emissiveTextureIndex){
        emissiveTextureIndex = index
        update('emissivetexturetype', textureTypes[index])
    }    
}

function selectPlaylistIndex(index: number) {
    if(index !== playlistIndex){
        playlistIndex = index
        update('playlist', playlists[index].aid)
    }    
}

function update(type:any, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:COMPONENT_TYPES.MATERIAL_COMPONENT, 
            aid:selectedItem.aid, sceneId:selectedItem.sceneId,
            type:type,
            data:value
        }
    )
}

function validateIntensity(color:string){
    let value = parseFloat(color)
    if(isNaN(value) || value < 0 || value > 1){
        return
    }

    update("emissiveIntensity", value)
}

function validateColor(hue:string, color:string){
    let value = parseFloat(color)
    if(isNaN(value) || value < 0 || value > 1){
        return
    }

    update("albedoColor", {hue:hue, value:value})
}

//