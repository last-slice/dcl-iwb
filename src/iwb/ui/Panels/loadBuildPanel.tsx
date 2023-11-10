import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { prevBuilds } from '../../components/builds'
import { addLineBreak, calculateImageDimensions, calculateSquareImageDimensions, dimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import resources from '../../helpers/resources'

export let showLoadBuildPanel = false

export let buildSelect = false
export let buildCode = 0
export let buildName = ''

const columns = 2;
const rows = 3;

let currentPage = 0;
const itemsPerPage = 9;

export function displayLoadBuildPanel(value: boolean) {
    showLoadBuildPanel = value
}

export function createLoadBuildPanel() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = [...prevBuilds.values()].slice(startIndex, endIndex);
    const totalPages = Math.ceil(itemsToShow.length / (columns * rows));
    return (
        <UiEntity
            key={"loadbuildpanel"}
            uiTransform={{
                display: showLoadBuildPanel ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(45, 580 / 403).width,
                height: calculateImageDimensions(45, 580 / 403).height,
                positionType: 'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(45, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(45, 580 / 403).height) / 2 }
            }}
        // uiBackground={{ color: Color4.Red() }}//
        
        >
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: 'assets/atlas2.png'
                    },
                    uvs: getImageAtlasMapping({
                        atlasHeight: 1024,
                        atlasWidth: 1024,
                        sourceTop: 495,
                        sourceLeft: 2,
                        sourceWidth: 570,
                        sourceHeight: 403
                    })
                }}
            >

                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '90%',
                        height: '30%',
                    }}
                // uiBackground={{color:Color4.Green()}}
                >

                    <Label
                        value={addLineBreak(" Load Build", true, 50)}
                        color={Color4.Black()}
                        fontSize={35}
                        font="serif"//
                        textAlign="middle-center"
                    />
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '90%',
                            height: '30%',
                            position: { top: 40 }
                        }}
                    // uiBackground={{color:Color4.Green()}}
                    >
                    </UiEntity>

            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '80%',
                height: '200%',
                positionType:'absolute',
                position: { left: (dimensions.width - calculateImageDimensions(92, 580 / 403).width) / 2, top: (dimensions.height - calculateImageDimensions(60, 580 / 403).height) / 2 }
            }}
            uiBackground={{color:Color4.Gray()}}
            />

            {/* header row */}
        <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '10%',
            }}
            // uiBackground={{color:Color4.Blue()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'assets/atlas2.png'
                },
                uvs: getImageAtlasMapping({
                    atlasHeight: 1024,
                    atlasWidth: 1024,
                    sourceTop: 801,
                    sourceLeft: 802,
                    sourceWidth: 223,
                    sourceHeight: 41
                })
            }}
            
        >
            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Name", fontSize:sizeFont(25,15), textAlign:'middle-left',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Parcel Count", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Size", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Poly Count", fontSize:sizeFont(25,15), textAlign:'middle-center',color:Color4.Black()}}
            />

            <UiEntity
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
            uiText={{value:"Visit", fontSize:sizeFont(25,15), textAlign:'middle-center', color:Color4.Black()}}
            />
                    
                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: calculateImageDimensions(3, 111 / 41).width,
                            height: calculateImageDimensions(4, 111 / 41).height,
                            margin: { right: "2%" },
                            position: { bottom: 25, right: 500 }
                        }}
                        uiBackground={{
                            textureMode: 'stretch',
                            texture: {
                                src: 'assets/atlas2.png'
                            },
                            uvs: getImageAtlasMapping({
                                atlasHeight: 1024,
                                atlasWidth: 1024,
                                sourceTop: 60,
                                sourceLeft: 844,
                                sourceWidth: 30,
                                sourceHeight: 30
                            })
                        }}
                        onMouseDown={() => {
                            displayLoadBuildPanel(false)
                        }}
                    >
                    </UiEntity>
                </UiEntity>



        </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(7, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { top: 227, left: -120 }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 1024,
                            atlasWidth: 1024,
                            sourceTop: 882,
                            sourceLeft: 579,
                            sourceWidth: 223,
                            sourceHeight: 41
                        })
                    }}
                    onMouseDown={() => {

                    }}
                >
                    <Label
                        value="Accept"
                        color={Color4.Black()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(7, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { top: 190, left: 10 }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 1024,
                            atlasWidth: 1024,
                            sourceTop: 841,
                            sourceLeft: 579,
                            sourceWidth: 223,
                            sourceHeight: 41
                        })
                    }}
                    onMouseDown={() => {

                    }}
                >
                    <Label
                        value="Delete"
                        color={Color4.Black()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: calculateImageDimensions(7, 223 / 41).width,
                        height: calculateImageDimensions(13, 223 / 41).height,
                        margin: { right: "2%" },
                        position: { top: 154, left: 140 }
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: getImageAtlasMapping({
                            atlasHeight: 1024,
                            atlasWidth: 1024,
                            sourceTop: 801,
                            sourceLeft: 802,
                            sourceWidth: 223,
                            sourceHeight: 41
                        })
                    }}
                    onMouseDown={() => {
                        { generateCatalogRows(itemsToShow) }

                    }}
                >
                    <Label
                        value="Browse"
                        color={Color4.White()}
                        fontSize={sizeFont(30, 20)}
                        font="serif"
                        textAlign="middle-center"
                    />
                      </UiEntity>

                    <UiEntity
                        uiTransform={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '10%',
                            height: '20%',
                        }}
                        uiText={{ value: "Page " + (currentPage + 1) + " / " + totalPages }}
                    />
                    <UiEntity
                        uiTransform={{
                            display: totalPages > 1 ? 'flex' : 'none',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignContent: 'center',
                            alignItems: 'center',
                            width: '90%',
                            height: '8%',
                        }}
                    // uiBackground={{color:Color4.Blue()}}
                    >

                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                                flexDirection: 'row',
                                width: '25%',
                                height: '90%',
                                margin: { right: '2%' }
                            }}
                            uiBackground={{ color: Color4.Purple() }}
                            uiText={{ value: "<", fontSize: sizeFont(20, 12) }}
                            onMouseUp={() => {
                                if (currentPage - 1 >= 0) {
                                    currentPage--
                                }
                            }}
                        />
                        <UiEntity
                            uiTransform={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                                flexDirection: 'row',
                                width: '25%',
                                height: '90%',
                                margin: { left: '2%' }
                            }}
                            uiBackground={{ color: Color4.Purple() }}
                            uiText={{ value: ">", fontSize: sizeFont(20, 12) }}
                            onMouseUp={() => {
                                if ((currentPage + 1) * itemsPerPage + itemsPerPage <= prevBuilds.size)
                                    currentPage++
                            }}
                        />
                    </UiEntity>



                </UiEntity>
                </UiEntity>




     

    )
}
function generateCatalogRows(itemsToShow: any) {
    let arr: any[] = []

    let start = 0
    let end = 3
    for (let i = 0; i < Math.ceil(itemsToShow.length / 3); i++) {
        arr.push(<CatalogRow row={start} items={itemsToShow.slice(start, end)} />)
        start += 3
        end += 3
    }
    return arr
}

function generateRowItems(data: any) {
    let arr: any[] = []
    let count = 0
    for (let i = 0; i < data.items.length; i++) {
        arr.push(<CatalogItem row={data.row + "-" + count} item={data.items[count]} />)
        count++
    }
    return arr//
}

function CatalogRow(data: any) {
    // log('row is', data)
    return (
        <UiEntity
            key={"build-catalog-row" + data.row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '23%',
                margin: { top: '1%' }
            }}
        // uiBackground={{color:Color4.Green()}}
        >

            {generateRowItems(data)}

        </UiEntity>
    )
}

function CatalogItem(data: any) {
    return (
        <UiEntity
            key={"build-catalog-item-row" + data.row}
            uiTransform={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '33%',
                height: '100%',
            }}
        // uiBackground={{color:Color4.Teal()}}//
        >

            {/* item image */}
            <UiEntity
                uiTransform={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: calculateSquareImageDimensions(8).width,
                    height: calculateSquareImageDimensions(8).width,
                }}
                uiBackground={{
                    textureMode: 'stretch',
                    texture: {
                        src: data.item.im
                    },
                    uvs: getImageAtlasMapping({
                        atlasHeight: 256,
                        atlasWidth: 256,
                        sourceTop: 0,
                        sourceLeft: 0,
                        sourceWidth: 256,
                        sourceHeight: 256
                    })
                }}
                onMouseDown={() => {
                    //Functionality
                }}
            />

            <UiEntity
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '90%',
                    height: '20%',
                }}
                uiText={{ value: addLineBreak(data.item.n, undefined, 15), fontSize: sizeFont(20, 12) }}
            // uiBackground={{color:Color4.Blue()}}
            />


            <UiEntity
                uiTransform={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexDirection: 'row',
                    width: '90%',
                    height: '15%',
                    margin: { top: '2%' }
                }}
            // uiBackground={{color:Color4.Green()}}
            >

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: '50%',
                        height: '100%',
                        margin: { right: '1%' }
                    }}
                    uiBackground={{ color: Color4.Purple() }}
                    uiText={{ value: "Use", fontSize: sizeFont(20, 12) }}
                />

                <UiEntity
                    uiTransform={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                        width: '50%',
                        height: '100%',
                        margin: { left: '1%' }
                    }}
                    uiBackground={{ color: Color4.Purple() }}
                    uiText={{ value: "Info", fontSize: sizeFont(20, 12) }}
                />


            </UiEntity>




        </UiEntity>
    )
}
