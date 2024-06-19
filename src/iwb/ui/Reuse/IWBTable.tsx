import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { calculateImageDimensions, calculateSquareImageDimensions, getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { paginateArray } from '../../helpers/functions'
import resources from '../../helpers/resources'
import { localPlayer, localUserId } from '../../components/Player'
import { SOUND_TYPES } from '../../helpers/types'
import { setUIClicked, setupUI } from '../ui'

let rowCount = 6
let columnCount = 4

let visibleIndex = 1
let visibleItems: any[] = []

let tableArray:any[] = []
let tableSortFn:any

let tableConfig:any

export function setTableConfig(config:any){
    tableConfig = {...config}
}

export function refreshVisibleItems(){
    visibleItems.length = 0

    if(tableConfig.tableSortFn){
        tableArray.sort(tableConfig.tableSortFn)
    }

    visibleItems = paginateArray([...tableArray], visibleIndex, tableConfig && tableConfig.rowCount ? tableConfig.rowCount : 6)
}

export function updateIWBTable(data:any){
    tableArray = [...data]
    visibleIndex = 1

    console.log('table array is', tableArray)

    refreshVisibleItems()
}

export function IWBTable(data:any){
    let transform = data.transform ? data.transform : {}
    return(
        <UiEntity
        key={resources.slug + "iwb-table-item"}
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:  transform.justify ? transform.justify : 'flex-start',
                    width: transform.width ? transform.width : '100%',
                    height: transform.height ? transform.height : '80%',
                }}
                // uiBackground={{color:Color4.Gray()}}
            >

                {tableConfig && tableRows(tableConfig.headerData, true)}
                {tableRows(visibleItems)}

                <Buttons />

            </UiEntity>
    )
}

function tableRows(data:any, header?:boolean){
    let arr:any[] = []
    data.forEach((rowData:any, i:number)=>{
        arr.push(
            <UiEntity
                key={resources.slug + "table-row-" + i}
                    uiTransform={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: tableConfig && tableConfig.width ? tableConfig.width : '100%',
                        height: tableConfig && tableConfig.height ? tableConfig.height : '10%',
                        margin:{top:'0.1%'}
                    }}
                    uiBackground={{
                        textureMode: 'stretch',
                        texture: {
                            src: 'assets/atlas2.png'
                        },
                        uvs: i % 2 === 0 ? getImageAtlasMapping(uiSizes.rowPillLight)

                            : //

                            getImageAtlasMapping(uiSizes.rowPillDark)
                    }}
                >

                    {generateRow(rowData, header)}

                </UiEntity>
        )
    })
    return arr
}

function generateRow(data:any, header?:boolean){
    let arr:any[] = []
    let count = 0
    if(count === 0){

    }

    tableConfig && tableConfig.rowConfig.forEach((rowConfig:any, i:number)=>{
        arr.push(
            <UiEntity
                key={resources.slug + "-table-row-column-" + i}
                uiTransform={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: tableConfig.even ? `${100/tableConfig.rowConfig.length}%` : tableConfig && tableConfig.rowConfig[i].width ? tableConfig.rowConfig[i].width : '40%',
                    height: tableConfig.rowConfig[i].height ? tableConfig.rowConfig[i].height : '100%',
                    margin: tableConfig.rowConfig[i].margin ? tableConfig.rowConfig[i].margin : undefined
                }}
                uiText={
                    {
                    value: "" + (header ? data[rowConfig.key] : tableConfig.rowConfig[i].image ? "" : tableConfig.rowConfig[i].overrideKey ? "" + data : tableConfig.rowConfig[i].func ? tableConfig.rowConfig[i].func(data[rowConfig.key]) : data[rowConfig.key]),
                    fontSize: tableConfig.rowConfig[i].fontSize ? tableConfig.rowConfig[i].fontSize : sizeFont(25, 15),
                    textAlign: tableConfig.rowConfig[i].textAlign ? tableConfig.rowConfig[i].textAlign : 'middle-center',
                    color: tableConfig.rowConfig[i].color ? tableConfig.rowConfig[i].color : Color4.White()
                    }
                }
                // onMouseDown={()=>{
                //     setUIClicked(true)
                //     // if(tableConfig.rowConfig[i].onClick){
                //     //     tableConfig.rowConfig[i].onClick(data)
                //     // }
                // }}
                // onMouseUp={()=>{
                //     setUIClicked(false)
                // }}
            >
                {tableConfig.rowConfig[i].image && !header && <TableImage count={i} rowConfig={tableConfig.rowConfig[i]} data={data} />}

            </UiEntity>
        )
    })
    return arr
}

function TableImage(info:any){
    let rowConfig = info.rowConfig
    let data = info.data
    return(
        <UiEntity
        key={resources.slug + "-table-row-image-" + info.count}
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: rowConfig.image.size && rowConfig.image.aspect ? 
            calculateImageDimensions(rowConfig.image.size, rowConfig.image.aspect).width :
            rowConfig.image.size ?
            calculateSquareImageDimensions(rowConfig.image.size).width : rowConfig.image.width,

            height: rowConfig.image.size && rowConfig.image.aspect ? 
            calculateImageDimensions(rowConfig.image.size, rowConfig.image.aspect).height :
            rowConfig.image.size ?
            calculateSquareImageDimensions(rowConfig.image.size).height : rowConfig.image.height,
        }}
        uiBackground={rowConfig.image ? getImageBackground(rowConfig.image) : undefined}

        onMouseDown={()=>{
            setUIClicked(true)
            if(rowConfig.onClick){
                rowConfig.onClick(data)
            }
        }}
        onMouseUp={()=>{
            setUIClicked(false)
        }}
        />
    )
}

function getImageBackground(image:any){
    return {
        textureMode: image.textureMode,
        texture: {
            src: image.texture.src
        },
        uvs: image.uvs ? typeof image.uvs === 'function' ? image.uvs() : getImageAtlasMapping(image.uvs) : undefined
    }
}


function Buttons(){
    return(
        <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
        }}
        // uiBackground={{color:Color4.White()}}
    >
         <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '85%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.White()}}
    >
    </UiEntity>


    <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.White()}}
    >

             <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(3).width,
            height: calculateSquareImageDimensions(4).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.blackArrowLeft)
        }}
        onMouseDown={()=>{
            // playSound(SOUND_TYPES.SELECT_3)
            if(visibleIndex - 1 > 0){
                visibleIndex--
                refreshVisibleItems()
            }
        }}
        />

        <UiEntity
        uiTransform={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: calculateSquareImageDimensions(3).width,
            height: calculateSquareImageDimensions(4).height,
        }}
        uiBackground={{
            textureMode: 'stretch',
            texture: {
                src: 'assets/atlas2.png'
            },
            uvs: getImageAtlasMapping(uiSizes.blackArrowRight)
        }}
        onMouseDown={()=>{
            // playSound(SOUND_TYPES.SELECT_3)

            if (tableArray && (visibleIndex + 1 <= Math.floor([...tableArray].length / 6) + 1)){
                visibleIndex++
                refreshVisibleItems()
            }
        }}
        />

        </UiEntity>

    </UiEntity>
    )
}