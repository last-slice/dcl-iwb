import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps, Input, Dropdown } from '@dcl/sdk/react-ecs'
import resources from '../../../helpers/resources'
import { displayMainView, mainView } from '../IWBView'
import { calculateSquareImageDimensions, sizeFont, getImageAtlasMapping, calculateImageDimensions, getAspect } from '../../helpers'
import { sendServerMessage } from '../../../components/Colyseus'
import { SERVER_MESSAGE_TYPES, SOUND_TYPES } from '../../../helpers/types'
import { formatDollarAmount, formatSize, paginateArray } from '../../../helpers/functions'
import { uiSizes } from '../../uiConfig'
import { setUIClicked } from '../../ui'
import { Color4 } from '@dcl/sdk/math'
import { playSound } from '../../../components/Sounds'
import { createTempScenePool } from '../../../modes/Create'
import { displayExpandedMap } from '../ExpandedMapView'

let creatorView:string = "loading"

let scenePool:any[] = []
let visibleItems:any[] = []
let visibleIndex:number = 1

export function updateScenePool(pool:any){//
    scenePool = pool
    visibleIndex = 1
    updateVisibleItems()
    updateCreatorPoolView("main")
}

export function updateVisibleItems(){
    visibleItems.length = 0
    visibleItems = paginateArray([...scenePool], visibleIndex, 2)
    console.log('visibleItems scene pool is', visibleItems)
}

export function updateCreatorPoolView(view:string){
    creatorView = view
    if(view === "loading"){
        sendServerMessage(SERVER_MESSAGE_TYPES.SCENE_POOL_GET, {})
    }
}

export function CreateScenePoolView(){
    return(
        <UiEntity
        key={resources.slug + "-main-view-right-create-pool"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:mainView === "CreatePool" ? 'flex' : 'none'
        }}
        >

{/* loading screen */}
<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display:creatorView === "loading" ? "flex" : "none"
        }}
        uiText={{value:"Loading Scenes...", fontSize:sizeFont(30,20)}}
        />


        {/* main view */}
    <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            display: creatorView === "main" ? "flex" : "none"
        }}
        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '5%',
        }}
        uiText={{value:"Scene Templates", fontSize:sizeFont(30,20)}}
        />

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '90%',
        }}
        >
            {
                mainView === "CreatePool" &&
                creatorView === "main" &&
                generateRows()
            }
        </UiEntity>

<UiEntity
            uiTransform={{
                display: scenePool.length > 2 ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Blue()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '25%',
                        height: '100%',
                        margin: {right: '5%'}
                    }}
                    uiText={{value: "Page " + (visibleIndex) + " / " + (Math.ceil(scenePool.length / 2)), fontSize: sizeFont(20, 15)}}
                />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {right: '2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.opaqueArrowleft)
                    }}
                    uiText={{value: "<", fontSize: sizeFont(20, 12)}}
                    onMouseDown={() => {
                        setUIClicked(true)
                        if (visibleIndex - 1 >= 1) {
                            visibleIndex--
                            updateVisibleItems()
                        }
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)
                    }}
                />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: calculateSquareImageDimensions(4).width,
                        height: calculateSquareImageDimensions(4).height,
                        margin: {left: '2%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping(uiSizes.opaqueArrowRight)
                    }}
                    uiText={{value: ">", fontSize: sizeFont(20, 12)}}
                    onMouseDown={() => {
                        setUIClicked(true)
                        if(visibleIndex * 2 < scenePool.length){
                            visibleIndex++
                            updateVisibleItems()
                        }
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

function generateRows(){
    let arr:any[] = []
    visibleItems.forEach((item:any, i:number)=>{
        arr.push(
             <UiEntity
                    key={resources.slug + "pool::item::" + item.id}
                    uiTransform={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        height: '50%',
                        margin:'1%'
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs:getImageAtlasMapping(uiSizes.horizRectangle)
                    }}
                    onMouseDown={()=>{
                        setUIClicked(true)
                        setUIClicked(false)
                    }}
                    onMouseUp={()=>{
                        setUIClicked(false)//
                    }}
                    >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '15%',
                        height: '100%',
                        margin:{top:'3%', left:'5%'}//
                    }}
                    >
                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: calculateSquareImageDimensions(10).width,
                                height: calculateSquareImageDimensions(10).height,
                            }}
                            uiBackground={{
                                textureMode: 'stretch',
                                texture: {
                                    src:'' + item.image
                                },
                            }}
                        />
                    </UiEntity>

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '70%',
                        height: '100%',
                    }}
                    >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '70%',
                            height: '10%',
                            margin:{top:'2%'}
                        }}
                        uiText={{value:"" + item.name, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(30,20)}}
                        />

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '70%',
                                height: '10%',
                                margin:{top:'2%'}
                            }}
                            uiText={{value:"Required Parcels: " + item.pcnt, textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15)}}
                            />

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '70%',
                                height: '10%',
                                margin:{top:'2%'}
                            }}
                            uiText={{value:"File Size: " + formatSize(item.si) + " MB", textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15)}}
                            />

                        <UiEntity
                            uiTransform={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '70%',
                                height: '10%',
                                margin:{top:'2%'}
                            }}
                            uiText={{value:"Poly Count: " + formatDollarAmount(item.pc), textAlign:'middle-left', textWrap:'nowrap', fontSize:sizeFont(20,15)}}
                            />


                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '15%',
                        height: '100%',
                        margin:{top:"2%", right:'4%'}
                    }}
                    >

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateImageDimensions(5, getAspect(uiSizes.buttonPillBlue)).width,
                            height: calculateImageDimensions(5,getAspect(uiSizes.buttonPillBlue)).height,
                            margin:{top:"1%", bottom:'1%'},
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping(uiSizes.buttonPillBlue)
                        }}
                        onMouseDown={() => {
                            setUIClicked(true)
                            playSound(SOUND_TYPES.WOOD_3)
                            createTempScenePool(item)
                            updateCreatorPoolView("main")
                            displayMainView(false)
                            displayExpandedMap(true, undefined, undefined, true)
                            setUIClicked(false)
                        }}
                        onMouseUp={()=>{
                            setUIClicked(false)//
                        }}
                        uiText={{textWrap:'nowrap',  value:"Use", color:Color4.White(), fontSize:sizeFont(20,15)}}
                        />

                    </UiEntity>


        </UiEntity>
        )
    })
    return arr
}