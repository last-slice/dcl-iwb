import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { getImageAtlasMapping, sizeFont } from '../helpers'
import { uiSizes } from '../uiConfig'
import { paginateArray } from '../../helpers/functions'
import resources from '../../helpers/resources'

let rowCount = 6
let columnCount = 4

let visibleIndex = 1
let visibleItems: any[] = []

let tableHeader:any[] = []
let tableArray:any[] = []
let tableSortFn:any

let tableConfig:any

export function setTableConfig(config:any){
    tableConfig = {...config}
}

export function refreshVisibleItems(){
    visibleItems.length = 0

    if(tableSortFn && tableSortFn !== undefined){
        tableArray.sort(tableSortFn)
    }

    visibleItems = paginateArray([...tableArray], visibleIndex, rowCount)
}

export function updateIWBTable(data:any){
    tableArray = data
    refreshVisibleItems()
}

export function IWBTable(data:any){
    data.rowCount ? rowCount = data.rowCount : 6
    let transform = data.transform ? data.transform : {}
    return(
        <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:  transform.justify ? transform.justify : 'flex-start',
                    width: transform.width ? transform.width : '100%',
                    height: transform.height ? transform.height : '80%',
                }}
                // uiBackground={{color:Color4.Gray()}}
            >

                {tableConfig && tableConfig.headerData && tableRows(tableConfig.headerData)}
                {tableRows(visibleItems)}

            </UiEntity>
    )
}

function tableRows(data:any){
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

                    {generateRow(rowData)}

                </UiEntity>
        )
    })
    return arr
}

function generateRow(data:any){
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
                // uiBackground={{color:Color4.Green()}}
                uiText={{
                    value: "" + (data[rowConfig.key]),
                    fontSize: tableConfig.rowConfig[i].fontSize ? tableConfig.rowConfig[i].fontSize : sizeFont(25, 15),
                    textAlign: tableConfig.rowConfig[i].textAlign ? tableConfig.rowConfig[i].textAlign : 'middle-center',
                    color: tableConfig.rowConfig[i].color ? tableConfig.rowConfig[i].color : Color4.White()
                }}
            />
        )
    })

    // data.forEach((rowData:any, i:number)=>{
    //     for(let rowKey in rowData){
    //         if(tableConfig && tableConfig.rowConfig[i].key === rowKey)
    //     }
    //     if(tableConfig && tableConfig.rowConfig[i]){
    //         arr.push(
    //             <UiEntity
    //                 key={resources.slug + "-table-row-column-" + i}
    //                 uiTransform={{
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     width: data.even ? `${100/count}%` : tableConfig && tableConfig.rowConfig[i].width ? tableConfig.rowConfig[i].width : '40%',
    //                     height: tableConfig && tableConfig.rowConfig[i].height ? tableConfig.rowConfig[i].height : '100%',
    //                     margin: tableConfig && tableConfig.rowConfig[i].margin ? tableConfig.rowConfig[i].margin : undefined
    //                 }}
    //                 // uiBackground={{color:Color4.Green()}}
    //                 uiText={{
    //                     value: "" + (rowData.value),
    //                     fontSize: tableConfig && tableConfig.rowConfig[i].fontSize ? tableConfig.rowConfig[i].fontSize : sizeFont(25, 15),
    //                     textAlign: tableConfig && tableConfig.rowConfig[i].textAlign ? tableConfig.rowConfig[i].textAlign : 'middle-center',
    //                     color: tableConfig && tableConfig.rowConfig[i].color ? tableConfig.rowConfig[i].color : Color4.White()
    //                 }}
    //             />
    //         )
    //     }
    // })
    return arr
}