import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import {Color4} from '@dcl/sdk/math'
import {calculateImageDimensions, calculateSquareImageDimensions, getAspect, getImageAtlasMapping, sizeFont} from '../../helpers'
import resources from '../../../helpers/resources'
import { colyseusRoom, sendServerMessage } from '../../../components/Colyseus'
import { playAudioFile, searchAudius, stopAudioFile } from '../../../components/Sounds'
import { COMPONENT_TYPES, EDIT_MODES, SERVER_MESSAGE_TYPES } from '../../../helpers/types'
import { selectedItem } from '../../../modes/Build'
import { uiSizes } from '../../uiConfig'
import { visibleComponent } from '../EditAssetPanel'
import { paginateArray } from '../../../helpers/functions'
import { setUIClicked } from '../../ui'

let url = ""
let audioComponent:any = {}
let search = ""

let searchResults:any[] = []
let visibleItems:any[] = []
let visibleIndex = 1
let playing = false

// export function updateAudioComponent(audio:any){
//     console.log('setting audio to', audio)
//     if(audio.type > 0){
//         audioComponent = {...audio}
//     }
    
//     playing = false
//     clearSearch()
// }

export function updateAudioComponent(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(!scene){
        console.log('no scene for audio option')
        return
    }

    let audioInfo = scene[COMPONENT_TYPES.AUDIO_COMPONENT].get(selectedItem.aid)
    if(!audioInfo){
        console.log('invalid audio info')
        return
    }

    if(audioInfo.type > 0){
        console.log('im ehre')
        clearSearch()
        playing = false
    }
    audioComponent = {...audioInfo}

    console.log('audio component is', audioComponent)
}

function clearSearch(){
    search = ""
    visibleIndex = 1
    visibleItems.length = 0
    searchResults.length = 0
    stopAudioFile(undefined, true)
}

function refreshVisibleItems(){
    visibleItems = paginateArray([...searchResults], visibleIndex, 5)
}

export function EditAudioComponent() {
    return (
        <UiEntity
            key={resources.slug + "edit::audio::panel"}
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                display: visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT ? 'flex' : 'none',
            }}
        >

            <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: '10%',
                            margin:{top:"1%", bottom:"1%"}
                        }}
                    >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '33%',
                            height: '100%',
                            margin:{top:"1%"}
                        }}
                    >

                                {/* attach audio to player toggle */}
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50%',
                            height: '100%',
                        }}
                    uiText={{textWrap:'nowrap', value:"Attach", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,//
                        margin:{top:"1%", bottom:'1%'},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT  ? 
                            (hasAudio() ? 
                                getImageAtlasMapping(uiSizes.toggleOnTrans) : 
                                getImageAtlasMapping(uiSizes.toggleOffTrans)) : 
                            getImageAtlasMapping(uiSizes.toggleOnTrans)
                    }}
                    onMouseDown={() => {
                        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {
                            component: visibleComponent,
                            aid: selectedItem.aid, sceneId: selectedItem.sceneId,
                            attach: !audioComponent.attach
                        })
                    }}
                    />


                    </UiEntity>
                    </UiEntity>

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '33%',
                            height: '100%',
                            display: audioComponent && audioComponent.type && audioComponent.type === 0 ? "flex" : "none"
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
                    uiText={{value:"Loop", fontSize:sizeFont(25, 15), color:Color4.White(), textAlign:'middle-left'}}
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,//
                        margin:{top:"1%", bottom:'1%'},
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: selectedItem && selectedItem.enabled && selectedItem.mode === EDIT_MODES.EDIT  ? 
                            getLoop() === 0 ? 
                                getImageAtlasMapping(uiSizes.toggleOnTrans) : 
                                getImageAtlasMapping(uiSizes.toggleOffTrans) : 
                            getImageAtlasMapping(uiSizes.toggleOnTrans)
                    }}
                    onMouseDown={() => {
                        sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, {
                            component: visibleComponent,
                            aid: selectedItem.aid, sceneId: selectedItem.sceneId,
                            attach: !audioComponent.attach
                        })
                    }}
                    />


                    </UiEntity>

                    </UiEntity>


                    <UiEntity
                            uiTransform={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                width: '33%',
                                height: '100%',
                                margin: {top: "1%"}
                            }}
                        >
                            <UiEntity
                                uiTransform={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '70%',
                                    height: '100%',
                                }}
                                uiText={{
                                    value: "Volume",
                                    fontSize: sizeFont(25, 15),
                                    color: Color4.White(),
                                    textAlign: 'middle-left'
                                }}
                            />


                            <UiEntity
                                uiTransform={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '30%',
                                    height: '80%',
                                }}
                            >

                                <Input
                                    uiTransform={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    // uiBackground={{color:Color4.Purple()}}//
                                    placeholderColor={Color4.White()}
                                    placeholder={"" + getVolume()}
                                    color={Color4.White()}
                                    fontSize={sizeFont(20, 15)}
                                    textAlign='middle-center'
                                    onChange={(input) => {
                                        updateVolume("volume", parseFloat(input))
                                    }}
                                    onSubmit={(input) => {
                                        updateVolume("volume", parseFloat(input))
                                    }}
                                    value={"" + getVolume()}

                                />

                            </UiEntity>

                    </UiEntity>

            </UiEntity>

            <AudioFile />
            <Audius />
            <AudioStream />

        </UiEntity>
    )
}

function AudioFile(){
    return(
        <UiEntity
        key={resources.slug + "edit::audio::source"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '75%',
            display: visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT && (audioComponent.type === 0) ? 'flex' : 'none'//
        }}
    >

{/* play button row  */}
<UiEntity
uiTransform={{
flexDirection: 'row',
justifyContent: 'center',
alignContent:'flex-start',
alignItems:'flex-start',
width: '100%',
height: '10%',
margin:{top:"1%", bottom:'2%'},
}}
>

<UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
margin: {left: "1%", right: "1%"}
}}
uiBackground={{
textureMode: 'stretch',
texture: {
src: 'assets/atlas2.png'
},
uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
}}
uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
onMouseDown={() => {
setUIClicked(true)
playAudioFile(selectedItem.catalogId)
setUIClicked(false)
}}
/>

<UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
margin: {left: "1%", right: "1%"}
}}
uiBackground={{
textureMode: 'stretch',
texture: {
src: 'assets/atlas2.png'
},
uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
}}
uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
onMouseDown={() => {
stopAudioFile(selectedItem.catalogId)
}}
/>

</UiEntity>

        </UiEntity>
    )
}

function Audius(){
    return(
         <UiEntity
         uiTransform={{
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'flex-start',
             width: '100%',
             height: '75%',
             display: visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT && audioComponent.type === 2 ? 'flex' : 'none'
            }}
     >


<UiEntity
    uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '10%',
        margin:{top:"2%", bottom:'2%'}
    }}
>
<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }}
    uiText={{value: "Current Song: " + (audioComponent.name), fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/>
{/* <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        height: '100%',
    }}
    uiText={{value: "Link:", fontSize: sizeFont(25, 15), color: Color4.White(), textAlign: 'middle-left'}}
/> */}

</UiEntity>

            {/* play button row */}
            <UiEntity
            uiTransform={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent:'flex-start',
            alignItems:'flex-start',
            width: '100%',
            height: '10%',
            margin:{top:"1%", bottom:'2%'},
            display: audioComponent && audioComponent.name !== "Audius Song" ? "flex" : "none"
            }}
            >

            <UiEntity
            uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin: {left: "1%", right: "1%"}
            }}
            uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                setUIClicked(true)
                if(audioComponent && audioComponent.url){
                    playAudioFile(undefined, audioComponent.url)
                }
                setUIClicked(false)
            }}
            />

            <UiEntity
            uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
            height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
            margin: {left: "1%", right: "1%"}
            }}
            uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
            onMouseDown={() => {
                stopAudioFile(undefined, true)
            }}
            />

            </UiEntity>


     {/* url input info */}
     <UiEntity
         uiTransform={{
             flexDirection: 'row',
             alignItems: 'center',
             justifyContent: 'center',
             width: '100%',
             height: '10%',
             margin: {top: "1%", bottom:'1%'},
         }}
     >

         <Input
             onChange={(input) => {
                search = input.trim()
             }}
             onSubmit={(input) => {
                search = input.trim()
                attemptSongSearch(search)
            }}
             color={Color4.White()}
             fontSize={sizeFont(25, 15)}
             placeholder={"Search Audius songs"}
             placeholderColor={Color4.White()}
             uiTransform={{
                 width: '100%',
                 height: '120%',
             }}
         ></Input>

         <UiEntity
             uiTransform={{
                 flexDirection: 'row',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                 height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                 margin:{left:'1%'}
             }}
             uiBackground={{
                 textureMode: 'stretch',
                 texture: {
                     src: 'assets/atlas2.png'
                 },
                 uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
             }}
             uiText={{
                 value: "Search",
                 fontSize: sizeFont(25, 15),
                 color: Color4.White(),
                 textAlign: 'middle-center'
             }}
             onMouseDown={() => {
                setUIClicked(true)
                attemptSongSearch(search)
                setUIClicked(false)
             }}
             onMouseUp={()=>{
                setUIClicked(false)
             }}
         />
     </UiEntity>

     <UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '80%',
    }}
    >

    {
        visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT &&
        audioComponent && audioComponent.type === 2 &&
        generateAudiusSearchRows()
    }

<UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            height: '10%',
        }}
        >
                        {/* scroll up button */}
                        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).width,
                height: calculateImageDimensions(2, getAspect(uiSizes.leftArrowBlack)).height,
                margin: {left: "5%"},
            }}
            // uiBackground={{color:Color4.White()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.leftArrowBlack)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                if(visibleIndex -1 >= 1){
                    visibleIndex--
                    refreshVisibleItems()
                }
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />

        {/* scroll down button */}
        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).width,
                height: calculateImageDimensions(2, getAspect(uiSizes.rightArrowBlack)).height,
                margin: {right: "1%"},
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rightArrowBlack)
            }}
            onMouseDown={() => {
                setUIClicked(true)
                visibleIndex++
                refreshVisibleItems()
            }}
            onMouseUp={()=>{
                setUIClicked(false)
            }}
        />
        
        </UiEntity>

    </UiEntity>


     </UiEntity>

    )
}

function AudioStream(){
    return(
        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '75%',
            display: visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT && audioComponent.type === 1 ? 'flex' : 'none'
           }}
    >

            {/* url input info */}
            <UiEntity
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            margin: {top: "1%", bottom:'1%'},
        }}
    >

        <Input
            onChange={(input) => {
                audioComponent.url = input.trim()
                updateAudio("url", input.trim())
            }}
            onSubmit={(input) => {
                audioComponent.url = input.trim()
                updateAudio("url", input.trim())
           }}
            color={Color4.White()}
            fontSize={sizeFont(25, 15)}
            placeholder={"" + (audioComponent && audioComponent.url)}
            placeholderColor={Color4.White()}
            uiTransform={{
                width: '100%',
                height: '120%',
            }}
        ></Input>

        {/* <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
                height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
                margin:{left:'1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
            }}
            uiText={{
                value: "Set",
                fontSize: sizeFont(25, 15),
                color: Color4.White(),
                textAlign: 'middle-center'
            }}
            onMouseDown={() => {
               setUIClicked(true)
               setUIClicked(false)
            }}
            onMouseUp={()=>{
               setUIClicked(false)
            }}
        /> */}
    </UiEntity>


{/* play button row */}
<UiEntity
uiTransform={{
flexDirection: 'row',
justifyContent: 'center',
alignContent:'flex-start',
alignItems:'flex-start',
width: '100%',
height: '10%',
margin:{top:"1%", bottom:'2%'},
display: audioComponent && audioComponent.name !== "Audius Song" ? "flex" : "none"//
}}
>

    <UiEntity
    uiTransform={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
    height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
    margin: {left: "1%", right: "1%"}
    }}
    uiBackground={{
    textureMode: 'stretch',
    texture: {
        src: 'assets/atlas2.png'
    },
    uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
    }}
    uiText={{value: "Play", fontSize: sizeFont(20, 16)}}
    onMouseDown={() => {
        setUIClicked(true)
        if(audioComponent && audioComponent.url){
            playAudioFile(undefined, undefined, audioComponent.url)//
        }
        setUIClicked(false)
    }}
    />

<UiEntity
uiTransform={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).width,
height: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlack)).height,
margin: {left: "1%", right: "1%"}
}}
uiBackground={{
textureMode: 'stretch',
texture: {
    src: 'assets/atlas2.png'
},
uvs: getImageAtlasMapping(uiSizes.buttonPillBlack)
}}
uiText={{value: "Stop", fontSize: sizeFont(20, 16)}}
onMouseDown={() => {
    stopAudioFile(undefined, true)
}}
/>

</UiEntity>

    </UiEntity>

   )
}

function generateAudiusSearchRows(){
    let arr:any[] = []
    let count = 0
    visibleItems.forEach((item:any)=>{
        arr.push(<AudiusRow count={count} data={item} />)
        count++
    })
    return arr
}

function AudiusRow(data:any){
    return(
        <UiEntity
        key={resources.slug + "edit::audius::search::row::" + data.count}
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{top:"1%", bottom:'1%'}
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping(uiSizes.rowPillDark)
            }}
            >  

            {/* point name column */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60%',
                height: '100%',
                margin:{left:'1%'}
            }}
            uiText={{textWrap:'nowrap', textAlign:'middle-left', value:"" + (data.data.title.length > 20 ? data.data.title.substring(0,20) + "..." : data.data.title), fontSize:sizeFont(20,15)}}
            />

            {/* re order row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            uiText={{textWrap:'nowrap', textAlign:'middle-left', value:"" + (data.data.play_count) + " Plays", fontSize:sizeFont(20,15)}}
            />

            {/* delete row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            >
                 <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: resources.textures.atlas2
            },
            uvs: getImageAtlasMapping(uiSizes.plusButton)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            updateAudio("url", data.data.id)
            updateAudio("name", data.data.title)
            clearSearch()
            setUIClicked(false)
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
            />

                <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(4).width,
                height: calculateSquareImageDimensions(4).height
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: resources.textures.audiusPlayButton
            },
            // uvs: getImageAtlasMapping(uiSizes.trashButton)
        }}
        onMouseDown={() => {
            setUIClicked(true)
            if(playing){
               stopAudioFile(undefined, true) 
            }
            playAudioFile(undefined, data.data.id)
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

async function attemptSongSearch(filter:string){
    try{
        searchResults.length = 0
        visibleIndex = 1
        searchResults = await searchAudius(filter, resources.audius.endpoints.searchTracks)
        console.log('audius edit search results are ', searchResults)
        refreshVisibleItems()
    }
    catch(e){
        console.log("edit audio search audius error", e)
    }
    
}

function hasAudio(){
    let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
    if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT){
        let itemInfo = scene[visibleComponent].get(selectedItem.aid)
        if(itemInfo){
            return itemInfo.attach
        }
        return false
    }
    return false
}

function getLoop(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT){
            let itemInfo = scene[visibleComponent].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.loop ? 0 : 1
            }
            return 0
        }
        return 0
    }
    return 0
}

function updateAudio(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET, 
        {
            component:visibleComponent, 
            aid:selectedItem.aid, 
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}

function getVolume(){
    if(selectedItem && selectedItem.enabled){
        let scene = colyseusRoom.state.scenes.get(selectedItem.sceneId)
        if(scene && visibleComponent === COMPONENT_TYPES.AUDIO_COMPONENT){
            let itemInfo = scene[visibleComponent].get(selectedItem.aid)
            if(itemInfo){
                return itemInfo.volume
            }
            return 1
        }
        return 1
    }
    return 1
}

function updateVolume(type:string, value:any){
    sendServerMessage(SERVER_MESSAGE_TYPES.EDIT_SCENE_ASSET,
        {
            component:visibleComponent,
            aid:selectedItem.aid,
            sceneId:selectedItem.sceneId,
            [type]:value
        }
    )
}